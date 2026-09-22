function normalizeRxText(v){return String(v||"").toLowerCase().replace(/[^a-z0-9+.#%/ -]/g," ").replace(/\\s+/g," ").trim()}
function inventoryCandidateMatch(m,c){
  const hay=normalizeRxText([m.name,m.generic].join(" "));
  const useHay=normalizeRxText([m.use,m.notes].join(" "));
  const terms=(c.match||[]).map(normalizeRxText).filter(Boolean);
  if(!terms.length)return false;
  return terms.some(term=>hay.includes(term)) || terms.some(term=>useHay.includes(term)&&term.length>=8);
}
function findProtocolForCase(d){
  const t=opdText(d);
  let best=null,bestScore=-Infinity;
  (clinicRxProtocols||[]).forEach(p=>{
    let score=0;
    (p.keywords||[]).forEach(k=>{
      const key=normalizeRxText(k);
      if(!key)return;
      if(t.includes(key))score+=5+Math.min(5,key.split(" ").length);
    });
    const title=normalizeRxText(p.title);
    if(title && t.includes(title))score+=12;
    ["dengue","malaria","typhoid","pregnancy","pcod","ibs","mastalgia"].forEach(specific=>{
      if(title.includes(specific)&&t.includes(specific))score+=15;
    });
    if(score>bestScore){best=p;bestScore=score}
  });
  return bestScore>0?best:null;
}
function clinicalTriage(d){
  const t=opdText(d), reasons=[];
  const explicit=["severe breathlessness","respiratory distress","chest pain","unconscious","altered sensorium","shock","severe bleeding","seizure","cyanosis","anaphylaxis","severe abdominal pain","persistent vomiting","blood in vomit","blood in stool","black stool","bleeding gums","rapid breathing","cold clammy","very low urine","no urine"];
  explicit.forEach(x=>{if(t.includes(x))reasons.push("Red flag: "+x+" reported.");});
  const spo2=Number(d.spo2),pulse=Number(d.pulse),temp=Number(d.temperature);
  if(Number.isFinite(spo2)&&spo2<92)reasons.push("SpO₂ below 92%: urgent clinical review is indicated.");
  if(Number.isFinite(pulse)&&pulse>130)reasons.push("Pulse >130/min: urgent clinical review is indicated.");
  if(Number.isFinite(pulse)&&pulse<45)reasons.push("Pulse <45/min: urgent clinical review is indicated.");
  if(Number.isFinite(temp)&&temp>=40)reasons.push("Temperature ≥40°C: urgent clinical assessment is indicated.");
  const bp=String(d.bp||"").match(/(\\d{2,3})\\s*[\\/ -]\\s*(\\d{2,3})/);
  if(bp&&Number(bp[1])<90)reasons.push("Systolic BP <90 mmHg: urgent clinical review is indicated.");
  if(/pregnan/.test(t)&&/(bleed|bleeding|vaginal blood|severe abdominal pain)/.test(t))reasons.push("Pregnancy with bleeding/severe abdominal pain requires urgent obstetric assessment.");
  return {urgent:reasons.length>0,reasons};
}
function medicineSafetyForAutoRx(m,d,p,rx){
  const t=opdText(d), g=normalizeRxText(m.generic+" "+m.name+" "+m.use+" "+m.notes);
  const reasons=[];
  const age=Number(d.age);
  if(age<12 && /nimesulide/.test(g))reasons.push("Nimesulide-containing products are not auto-selected below age 12.");
  if(age<18 && !/paediatric|pediatric|child|infant|suspension|drops|syrup/i.test((m.form||"")+" "+(m.category||"")) && !/paediatric|pediatric|child/i.test(String(p?.title||""))){
    reasons.push("No verified paediatric formulation/pathway for this medicine.");
  }
  if(/pregnan/.test(t) && !/pregnancy|antenatal|trimester|anaemia in pregnancy|anemia in pregnancy/.test(String(p?.title||"").toLowerCase())){
    if(/nsaid|aceclofenac|ibuprofen|nimesulide|etoricoxib|fluoroquinolone|ciprofloxacin|ofloxacin/.test(g))reasons.push("Pregnancy context requires medicine-specific safety review; this class is not auto-selected by a non-pregnancy pathway.");
  }
  if(/dengue/.test(t) && /nsaid|aceclofenac|ibuprofen|nimesulide|etoricoxib|mefenamic|diclofenac|naproxen/.test(g))reasons.push("Dengue context: NSAID-containing medicine is not auto-selected.");
  if(/kidney|renal|ckd|creatinine high/.test(t) && /nsaid|aceclofenac|ibuprofen|nimesulide|etoricoxib|mefenamic|diclofenac|naproxen/.test(g))reasons.push("Renal-risk history requires medicine-specific review before NSAID selection.");
  if(/liver|hepatic|hepatitis|cirrhosis|jaundice/.test(t) && /nimesulide/.test(g))reasons.push("Liver-risk history: nimesulide is not auto-selected.");
  if(/ulcer|gi bleed|gastric bleed|black stool/.test(t) && /nsaid|aceclofenac|ibuprofen|nimesulide|etoricoxib|mefenamic|diclofenac|naproxen/.test(g))reasons.push("GI bleeding/ulcer context: NSAID is not auto-selected.");
  return {ok:reasons.length===0,reasons};
}
function sameClinicalStockGroup(a,b){
  const ga=normalizeRxText(a.generic||a.name),gb=normalizeRxText(b.generic||b.name);
  return ga===gb || (a.name||"").toLowerCase()===(b.name||"").toLowerCase();
}
function chooseRxStockCandidate(candidates,rx,d,p){
  const usable=candidates.filter(m=>(Number(m.stock)||0)>0&&expiryStatus(m)!=="expired");
  const safe=usable.map(m=>({m,safety:medicineSafetyForAutoRx(m,d,p,rx)})).filter(x=>x.safety.ok);
  if(!safe.length)return null;
  safe.sort((a,b)=>daysUntil(a.m.expiry)-daysUntil(b.m.expiry)||a.m.name.localeCompare(b.m.name));
  const selected=safe[0].m;
  const sameGroupCount=safe.filter(x=>sameClinicalStockGroup(x.m,selected)).length;
  return {...selected,_selection:{type:"REFERENCE_MATCH",sameGroupCount,fefoUsed:sameGroupCount>1}};
}
function explicitInventorySubstituteCandidates(p,rx,d){
  const subs=rx.substitutes||p?.substitutes||[];
  if(!Array.isArray(subs)||!subs.length)return [];
  return inventory.filter(m=>(Number(m.stock)||0)>0&&expiryStatus(m)!=="expired"&&subs.some(s=>inventoryCandidateMatch(m,{match:s.match||[]})));
}
function buildInventoryPrescription(d,triage=clinicalTriage(d)){
  const p=findProtocolForCase(d),items=[],missing=[],notes=[];
  if(triage.urgent){
    notes.push("Urgent triage finding present. Automatic prescription selection is paused until the patient is clinically assessed/referred as appropriate.");
    return {protocol:p,items,missing,notes};
  }
  if(p){
    (p.medicines||[]).forEach(rx=>{
      let m=chooseRxStockCandidate(inventory.filter(x=>inventoryCandidateMatch(x,rx)),rx,d,p);
      let selectionType="REFERENCE_MATCH";
      if(!m){
        const substitutes=explicitInventorySubstituteCandidates(p,rx,d);
        if(substitutes.length){
          m=chooseRxStockCandidate(substitutes,rx,d,p);
          if(m)selectionType="EXPLICIT_REFERENCE_SUBSTITUTE";
        }
      }
      if(m)items.push({...m,rxPhase:rx.phase||prescriptionPhase(m),rxDose:rx.dose||m.dose||"",rxFreq:rx.frequency||"",rxDuration:rx.duration||"",rxInstruction:rx.instruction||"",rxSource:p.title,rxSourceRef:rx.source||p.source||"",rxSelectionType:selectionType});
      else missing.push(rx.label);
    });
    if(p.note)notes.push(p.note);
  }
  if(!items.length&&(!p||p.allowInventoryFallback===true)){
    const fallback=inventory.map(m=>({...m,_match:medicineRelevance(m,d),_safety:medicineSafetyForAutoRx(m,d,p,null)}))
      .filter(m=>(Number(m.stock)||0)>0&&expiryStatus(m)!=="expired"&&m._match.score>=6&&m._safety.ok)
      .sort((a,b)=>b._match.score-a._match.score||a.name.localeCompare(b.name)).slice(0,1);
    fallback.forEach(m=>items.push({...m,rxPhase:prescriptionPhase(m),rxDose:m.dose||"",rxFreq:"",rxDuration:"Short course / as clinically indicated",rxInstruction:"Inventory fallback is permitted by this protocol. Confirm indication, contraindications and product label before signing.",rxSource:"Inventory fallback",rxSelectionType:"SUPPORTED_INVENTORY_FALLBACK"}));
  }
  if(missing.length)notes.unshift("Reference medicine not currently available in recorded usable stock: "+missing.join(", ")+". No substitute is invented unless this protocol explicitly defines a supported substitute.");
  if(!items.length)notes.push("No safe automatic prescription match was found in current usable clinic stock for this case. Do not use expiry/stock pressure as a reason to choose another medicine.");
  const fefo=items.filter(m=>m._selection?.fefoUsed);
  if(fefo.length)notes.push("FEFO applied only after clinical/reference match and patient-safety checks, among the same suitable stock group: "+fefo.map(m=>m.name).join(", ")+".");
  return {protocol:p,items,missing,notes};
}

function renderAssessmentView(a,d,recordHistory){
  $("emptyResult").classList.add("hidden");$("result").classList.remove("hidden");
  $("resultState").textContent=a.urgent?"Referral review":(a.rx?.items?.length?"Prescription draft":"Generated");
  $("triageStatus").className="status-tag "+(a.urgent?"expired":"ok");
  $("triageStatus").textContent=a.urgent?"URGENT REVIEW":"ROUTINE REVIEW";
  $("referralBox").innerHTML=a.urgent?'<div class="referral"><strong>Urgent review:</strong> This may need urgent referral / further investigation. Do not delay emergency care for this tool.</div>':"";
  $("clinicalSnapshot").innerHTML='<div><span>Patient</span><strong>'+esc(d.patientName||"—")+'</strong></div><div><span>Age / Sex</span><strong>'+esc(d.age||"—")+" / "+esc(d.sex||"—")+'</strong></div><div><span>Vitals</span><strong>BP '+esc(d.bp||"—")+' • Sugar '+esc(d.bloodSugar||"—")+' • Pulse '+esc(d.pulse||"—")+' • SpO₂ '+esc(d.spo2||"—")+' • Temp '+esc(d.temperature||"—")+'</strong></div><div><span>Complaint</span><strong>'+esc(d.complaint||"—")+'</strong></div>';
  const rxTitle=a.rx?.protocol?'<div class="protocol-inline"><b>Matched clinic case:</b> '+esc(a.rx.protocol.title)+(a.rx.protocol.source?'<small> • '+esc(a.rx.protocol.source)+'</small>':"")+'</div>':"";
  const rxNotes=(a.rx?.notes||[]).map(x=>'<div class="medicine-warning">'+esc(x)+'</div>').join("");
  $("possibleDiagnosis").innerHTML=esc(a.possible)+rxTitle+rxNotes+(a.protocolMatches?.length?'<div class="protocol-inline"><b>Relevant clinic reference:</b> '+a.protocolMatches.map(p=>esc(p.title)).join(" • ")+'</div>':"");
  $("medicineMatchCount").textContent=a.matches.length+" matched";
  $("medicineMatchInfo").innerHTML=a.matches.length
    ?'<span>Only medicines recorded in the current clinic inventory are shown.</span> <span>Selection order: clinical/reference match → safety/patient factors → FEFO only within the same suitable stock group.</span>'
    :"<span>No inventory medicine was matched confidently to the entered complaint.</span>";
  $("phase1").innerHTML=a.oral.length?a.oral.map(medCard).join(""):'<div class="empty-list">No relevant verified oral/topical medicines matched this case.</div>';
  $("phase2").innerHTML=a.phase2.length?a.phase2.map(medCard).join(""):'<div class="empty-list">No injection or short-course Phase 2 medicine matched this case.</div>';
  selectedPrescriptions=(a.rx?.items||[]).map(x=>({...x}));
  renderPrescription();
  if($("summary"))$("summary").textContent=a.summary;
}
function runLiveAssessment(){
  const name=$("patientName")?.value.trim(), age=$("age")?.value, complaint=$("complaint")?.value.trim();
  if(!name||!age||!complaint)return;
  currentCaseData={patientName:name,age,sex:$("sex").value,mobile:$("mobile").value.trim(),village:$("village").value.trim(),complaint,history:$("history").value.trim(),bp:$("bp").value.trim(),bloodSugar:$("bloodSugar").value.trim(),pulse:$("pulse").value,spo2:$("spo2").value,temperature:$("temperature").value,exam:$("exam").value.trim(),redFlags:$("redFlags").value.trim(),followupDate:$("followupDate").value};
  const a=buildAssessment(currentCaseData);
  renderAssessmentView(a,currentCaseData,false);
}
function duplicateSafetyWarnings(rows){
  const list=Array.isArray(rows)?rows:[];
  const text=list.map(m=>(m.generic+" "+m.use+" "+m.notes).toLowerCase()).join(" ");
  const warnings=[];
  const para=list.filter(m=>/paracetamol/.test((m.generic+" "+m.notes).toLowerCase()));
  const nsaid=list.filter(m=>/aceclofenac|ibuprofen|nimesulide|etoricoxib|mefenamic|diclofenac|naproxen/.test((m.generic+" "+m.notes).toLowerCase()));
  const abx=list.filter(m=>/antibiotic|ciprofloxacin|cefixime|cefpodoxime|azithromycin|amoxicillin|ofloxacin|metronidazole|norfloxacin/.test((m.generic+" "+m.notes+" "+m.use).toLowerCase()));
  if(para.length>1)warnings.push("Multiple paracetamol-containing medicines are in the prescription. Check total daily paracetamol exposure and remove duplicate combination products where not specifically justified.");
  if(nsaid.length>1)warnings.push("Multiple NSAID/anti-inflammatory medicines are in the prescription. Avoid duplicate NSAID therapy unless specifically justified.");
  if(abx.length>1)warnings.push("Multiple antimicrobial medicines are in the prescription. Do not combine antibiotics routinely; confirm indication, site, allergy, renal/hepatic factors and antimicrobial appropriateness.");
  if(text.includes("nimesulide"))warnings.push("Nimesulide-containing product selected: use only for a documented indication, short-term, with patient-specific liver-risk review.");
  return [...new Set(warnings)];
}
function medCard(m){
  const dose=m.dose||Object.entries(DOSE_GUIDE).find(([k])=>m.name.toLowerCase().includes(k.toLowerCase())||k.toLowerCase().includes(m.name.toLowerCase()))?.[1]||"Dose not specified in the provided clinic reference files.";
  const stock=Number(m.stock)||0, exp=expiryStatus(m), warn=ageWarnings(m,currentCaseData||{});
  const selected=selectedPrescriptions.some(x=>x.id===m.id);
  return '<div class="medicine-item" data-med-id="'+esc(m.id)+'"><div class="medicine-item-top"><div><strong>'+esc(m.name)+'</strong><small>'+esc(m.generic||"")+'</small></div><span class="tablet-availability '+(stock>0?"available":"unavailable")+'">'+stock+' available</span></div><small>'+esc(m.category||"")+(m.form?" • "+esc(m.form):"")+'</small><div class="medicine-dose"><b>Reference:</b> '+esc(dose)+'</div><div class="medicine-use"><b>Use:</b> '+esc(m.use||m.notes||"Not specified")+'</div><div class="medicine-actions"><button type="button" class="btn '+(selected&&prescriptionPhase(m)==="1"?"primary":"ghost")+' add-prescription" data-add-rx="'+esc(m.id)+'" data-rx-phase="1">'+(selected&&prescriptionPhase(m)==="1"?"✓ Phase 1":"Add Phase 1")+'</button><button type="button" class="btn '+(selected&&prescriptionPhase(m)==="2"?"primary":"ghost")+' add-prescription" data-add-rx="'+esc(m.id)+'" data-rx-phase="2">'+(selected&&prescriptionPhase(m)==="2"?"✓ Phase 2":"Add Phase 2")+'</button></div>'+(m.expiry?'<div class="medicine-meta"><span>Expiry: '+esc(m.expiry)+'</span><span class="'+(exp==="expired"?"expiry-bad":"")+'">'+(exp==="expired"?"EXPIRED":expiryTimeLabel(m))+'</span></div>':"")+(warn.length?'<div class="medicine-warning">'+warn.map(x=>esc(x)).join(" ")+'</div>':"")+'</div>';
}
let currentCaseData=null;
function prescriptionPhase(m){
  if(m.rxPhase) return m.rxPhase;
  return ["Injection","IV Fluid","Respule"].includes(m.category) ? "2" : "1";
}
function rxCost(m){
  const v=Number(m.mrp||m.price||m.cost||0);
  return Number.isFinite(v)?v:0;
}
function renderPrescriptionCostSummary(){
  const p1=selectedPrescriptions.filter(m=>prescriptionPhase(m)==="1"), p2=selectedPrescriptions.filter(m=>prescriptionPhase(m)==="2");
  const cost=rows=>rows.reduce((s,m)=>s+rxCost(m),0);
  const el=$("prescriptionCostSummary"); if(!el)return;
  el.innerHTML='<div class="rx-cost-grid"><div><span>Phase 1 Payment</span><strong>₹'+cost(p1).toFixed(2)+'</strong></div><div><span>Phase 2 Payment</span><strong>₹'+cost(p2).toFixed(2)+'</strong></div><div><span>Total Payment</span><strong>₹'+(cost(p1)+cost(p2)).toFixed(2)+'</strong></div></div><small>Cost is calculated only from medicine prices recorded in inventory. Missing prices are not estimated.</small>';
}
function renderPrescription(){
  const list=$("selectedPrescriptionList"), warnEl=$("prescriptionWarnings");
  if(!list)return;
  list.innerHTML=selectedPrescriptions.length?selectedPrescriptions.map((m,i)=>{
    const phase=prescriptionPhase(m);
    const defaultDuration=phase==="2"&&!m.rxDuration?"2–3 days":"";
    return '<div class="rx-row"><div><strong>'+esc(m.name)+'</strong><small>'+esc(m.generic||"")+'</small></div><div class="rx-fields"><select data-rx-phase="'+i+'"><option value="1" '+(phase==="1"?"selected":"")+'>Phase 1 — Regular medicines</option><option value="2" '+(phase==="2"?"selected":"")+'>Phase 2 — Injection + short-course</option></select><input data-rx-dose="'+i+'" placeholder="Dose / strength" value="'+esc(m.rxDose||"")+'"><select data-rx-route="'+i+'"><option value="">Route</option><option '+(m.rxRoute==="IM"?"selected":"")+'>IM</option><option '+(m.rxRoute==="IV"?"selected":"")+'>IV</option><option '+(m.rxRoute==="SC"?"selected":"")+'>SC</option><option '+(m.rxRoute==="Oral"?"selected":"")+'>Oral</option><option '+(m.rxRoute==="Topical"?"selected":"")+'>Topical</option></select><input data-rx-freq="'+i+'" placeholder="Frequency" value="'+esc(m.rxFreq||"")+'"><input data-rx-duration="'+i+'" placeholder="'+(phase==="2"?"2–3 days / as indicated":"Duration")+'" value="'+esc(m.rxDuration||defaultDuration)+'"><input data-rx-instruction="'+i+'" placeholder="Instructions" value="'+esc(m.rxInstruction||"")+'"><input data-rx-compat="'+i+'" placeholder="IV/Drip compatibility — verify before mixing" value="'+esc(m.rxCompat||"")+'"><button type="button" class="btn danger-outline remove-rx" data-rx-remove="'+i+'">Remove</button></div></div>';
  }).join(""):'<div class="empty-list">Assessment se medicine par “Add to prescription” click karein. Phase 1 regular medicines ke liye hai; Phase 2 injection/IV ke saath 2–3 din ka short-course medicine bhi rakh sakte hain.</div>';
  renderPrescriptionCostSummary();
  const warnings=duplicateSafetyWarnings(selectedPrescriptions);
  warnEl.innerHTML=warnings.length?'<div class="medicine-warning"><b>Prescription safety check:</b> '+warnings.map(esc).join(" ")+'</div>':"";
  list.querySelectorAll("[data-rx-remove]").forEach(b=>b.addEventListener("click",()=>{selectedPrescriptions.splice(Number(b.dataset.rxRemove),1);renderPrescription();}));
  list.querySelectorAll("[data-rx-phase],[data-rx-dose],[data-rx-route],[data-rx-freq],[data-rx-duration],[data-rx-instruction],[data-rx-compat]").forEach(inp=>inp.addEventListener(inp.tagName==="SELECT"?"change":"input",()=>{
    const i=Number(inp.dataset.rxPhase??inp.dataset.rxDose??inp.dataset.rxRoute??inp.dataset.rxFreq??inp.dataset.rxDuration??inp.dataset.rxInstruction??inp.dataset.rxCompat);
    if(inp.dataset.rxPhase!==undefined)selectedPrescriptions[i].rxPhase=inp.value;
    if(inp.dataset.rxDose!==undefined)selectedPrescriptions[i].rxDose=inp.value;
    if(inp.dataset.rxRoute!==undefined)selectedPrescriptions[i].rxRoute=inp.value;
    if(inp.dataset.rxFreq!==undefined)selectedPrescriptions[i].rxFreq=inp.value;
    if(inp.dataset.rxDuration!==undefined)selectedPrescriptions[i].rxDuration=inp.value;
    if(inp.dataset.rxInstruction!==undefined)selectedPrescriptions[i].rxInstruction=inp.value;
    if(inp.dataset.rxCompat!==undefined)selectedPrescriptions[i].rxCompat=inp.value;
  }));
}
function addPrescription(id,phase){
  const m=inventory.find(x=>x.id===id);if(!m)return;
  const existing=selectedPrescriptions.find(x=>x.id===id);
  if(existing)existing.rxPhase=phase||existing.rxPhase||"1";
  else selectedPrescriptions.push({...m,rxPhase:phase||(["Injection","IV Fluid","Respule"].includes(m.category)?"2":"1")});
  renderPrescription();
  if(currentCaseData) rerenderAssessmentCards();
}
function rerenderAssessmentCards(){
  if(!currentCaseData)return;
  const a=buildAssessment(currentCaseData);
  $("phase1").innerHTML=a.oral.length?a.oral.map(medCard).join(""):'<div class="empty-list">No relevant verified oral/topical medicines matched this case.</div>';
  $("phase2").innerHTML=a.injectable.length?a.injectable.map(medCard).join(""):'<div class="empty-list">No relevant verified injections/IV fluids/respules matched this case.</div>';
}
function formatRxGroup(rows){
  return rows.map((m,i)=>{
    const dose=m.rxDose||m.dose||"Verify dose";
    const route=m.rxRoute?(" • Route: "+m.rxRoute):"";
    const compat=m.rxCompat?("\n   IV/Drip compatibility note: "+m.rxCompat):"";
    return (i+1)+". "+m.name+"\n   Dose: "+dose+route+"\n   Frequency: "+(m.rxFreq||"Verify")+
      "\n   Duration: "+(m.rxDuration||"Verify")+"\n   Instructions: "+(m.rxInstruction||"—")+compat;
  }).join("\n\n");
}
function printPrescription(){
  if(!selectedPrescriptions.length){alert("Please add at least one medicine to the prescription.");return}
  const d=currentCaseData||{};
  const p1=selectedPrescriptions.filter(m=>prescriptionPhase(m)==="1");
  const p2=selectedPrescriptions.filter(m=>prescriptionPhase(m)==="2");
  const section=(title,rows)=>"<h2>"+title+"</h2><pre style='white-space:pre-wrap;font:14px Arial'>"+esc(rows.length?formatRxGroup(rows):"None prescribed in this phase.")+"</pre>";
  const w=window.open("","_blank");if(!w)return;
  w.document.write("<html><head><title>Prescription</title><style>body{font:14px Arial;padding:30px;max-width:800px;margin:auto}h1{margin-bottom:4px}.muted{color:#666}.line{border-bottom:1px solid #ddd;margin:15px 0}h2{margin-top:24px;border-bottom:1px solid #ddd;padding-bottom:6px}</style></head><body><h1>My Medical Assistant</h1><div class='muted'>Clinic prescription draft</div><div class='line'></div><p><b>Patient:</b> "+esc(d.patientName||"—")+" &nbsp; <b>Age:</b> "+esc(d.age||"—")+" &nbsp; <b>Sex:</b> "+esc(d.sex||"—")+"</p><p><b>Mobile:</b> "+esc(d.mobile||"—")+" &nbsp; <b>Village:</b> "+esc(d.village||"—")+"</p><p><b>Complaint:</b> "+esc(d.complaint||"—")+"</p><div class='line'></div>"+section("PHASE 1 — Regular Medicines",p1)+section("PHASE 2 — Injection + Short-course Medicines",p2)+"<p class='muted'>Prescription draft — verify indication, dose, route, compatibility, contraindications and patient-specific factors before signing.</p></body></html>");
  w.document.close();w.print();
}


$("caseForm").addEventListener("submit",e=>{
  e.preventDefault();
  currentCaseData={patientName:$("patientName").value.trim(),age:$("age").value,sex:$("sex").value,mobile:$("mobile").value.trim(),village:$("village").value.trim(),complaint:$("complaint").value.trim(),history:$("history").value.trim(),bp:$("bp").value.trim(),bloodSugar:$("bloodSugar").value.trim(),pulse:$("pulse").value,spo2:$("spo2").value,temperature:$("temperature").value,exam:$("exam").value.trim(),redFlags:$("redFlags").value.trim(),followupDate:$("followupDate").value};
  const a=buildAssessment(currentCaseData);
  renderAssessmentView(a,currentCaseData,true);
  const h=loadHistory();
  h.unshift({id:crypto.randomUUID(),createdAt:new Date().toLocaleString(),dateKey:new Date().toISOString().slice(0,10),followupDate:currentCaseData.followupDate,patientName:currentCaseData.patientName,mobile:currentCaseData.mobile,village:currentCaseData.village,complaint:currentCaseData.complaint,age:currentCaseData.age,sex:currentCaseData.sex,data:{...currentCaseData},summary:a.summary});
  saveHistory(h.slice(0,100));
  logAudit("OPD case recorded",(currentCaseData.patientName||"Unnamed patient")+" • "+(currentCaseData.complaint||"Unnamed complaint"));
  renderHistory();renderDashboard();
});

$("printSummary")?.addEventListener("click",()=>{const text=$("summary")?.textContent||"";const w=window.open("","_blank");if(!w)return;w.document.write("<pre style=\"font:14px Arial;padding:30px;white-space:pre-wrap\">"+esc(text)+"</pre>");w.document.close();w.print()});
$("printPrescription")?.addEventListener("click",printPrescription);
$("clearPrescription")?.addEventListener("click",()=>{selectedPrescriptions=[];renderPrescription();rerenderAssessmentCards()});
$("clearCase").addEventListener("click",()=>{$("caseForm").reset();selectedPrescriptions=[];renderPrescription();$("emptyResult").classList.remove("hidden");$("result").classList.add("hidden");$("resultState").textContent="Waiting"});

function renderHistory(){
  const h=loadHistory(), q=($("historySearch")?.value||"").trim().toLowerCase();
  const rows=h.filter(x=>!q||[x.patientName,x.mobile,x.village,x.complaint,x.age,x.sex].join(" ").toLowerCase().includes(q));
  $("historyList").innerHTML=rows.length?rows.map((x,i)=>'<div class="history-item"><strong>'+esc(x.patientName||"Unnamed patient")+'</strong><small>'+esc(x.createdAt||"")+' • Age: '+esc(x.age||"—")+' • Sex: '+esc(x.sex||"—")+' • Mobile: '+esc(x.mobile||"—")+' • Village: '+esc(x.village||"—")+'</small><p class="history-complaint">'+esc(x.complaint||"No complaint")+(x.followupDate?" • Follow-up: "+esc(x.followupDate):"")+'</p><button class="btn ghost load-case" data-history-id="'+esc(x.id||"")+'">Open old history</button></div>').join(""):'<div class="empty-list">No matching patient history.</div>';
  $("historyList").querySelectorAll("[data-history-id]").forEach(b=>b.addEventListener("click",()=>{
    const x=h.find(v=>v.id===b.dataset.historyId);if(!x)return;
    const d=x.data||{patientName:x.patientName,mobile:x.mobile,village:x.village,age:x.age,sex:x.sex,complaint:x.complaint};
    $("patientName").value=d.patientName||"";$("mobile").value=d.mobile||"";$("village").value=d.village||"";$("age").value=d.age||"";$("sex").value=d.sex||"";$("complaint").value=d.complaint||"";
    $("history").value=d.history||"";$("bp").value=d.bp||"";$("bloodSugar").value=d.bloodSugar||"";$("pulse").value=d.pulse||"";$("spo2").value=d.spo2||"";$("temperature").value=d.temperature||"";$("exam").value=d.exam||"";$("redFlags").value=d.redFlags||"";$("followupDate").value=d.followupDate||"";
    switchTab("assistant");
  }));
}
$("historySearch")?.addEventListener("input",renderHistory);
$("clearHistory").addEventListener("click",()=>{if(confirm("Clear locally stored case history?")){localStorage.removeItem(HISTORY_KEY);renderHistory();renderDashboard()}});

let clinicProtocols=[];
async function loadProtocols(){
 try{const r=await fetch(PROTOCOLS_URL);clinicProtocols=await r.json();}catch{clinicProtocols=[]}
 renderProtocols();
}
function renderProtocols(){
 const el=$("protocolList"),q=($("protocolSearch")?.value||"").toLowerCase().trim();if(!el)return;
 const rows=clinicProtocols.filter(p=>!q||[p.title,p.category,p.summary,(p.redFlags||[]).join(" ")].join(" ").toLowerCase().includes(q));
 $("protocolCount").textContent=clinicProtocols.length+" protocols";
 el.innerHTML=rows.length?rows.map(p=>'<article class="protocol-card"><div><span class="mini-label">'+esc(p.category||"REFERENCE")+'</span><h3>'+esc(p.title)+'</h3><p>'+esc(p.summary||"")+'</p></div><div class="protocol-points">'+(p.checks||[]).map(x=>'<span>✓ '+esc(x)+'</span>').join("")+'</div><div class="protocol-caution"><b>Safety:</b> '+esc(p.caution||"Correlate clinically and verify current guidance.")+'</div></article>').join(""):'<div class="empty-list">No matching protocols.</div>';
}
function renderPedMedicineOptions(){
 const el=$("pedMedicine");if(!el)return;
 const names=inventory.filter(m=>/paediatric|pediatric|syrup|suspension|drops/i.test(m.form+" "+m.category)).slice().sort((a,b)=>a.name.localeCompare(b.name));
 el.innerHTML='<option value="">Generic calculation / custom</option>'+names.map(m=>'<option>'+esc(m.name)+'</option>').join("");
}
function calculatePediatric(){
 const w=Number($("pedWeight").value),d=Number($("pedDose").value),s=Number($("pedStrength").value),max=Number($("pedMax").value);
 if(!(w>0&&d>0&&s>0))return;
 const mg=w*d,ml=mg/s,maxDaily=max>0?w*max:null;
 $("pedResult").className="";$("pedResult").innerHTML='<div class="calc-result"><span>Weight</span><strong>'+w+' kg</strong><span>Target dose</span><strong>'+mg.toFixed(1)+' mg per dose</strong><span>Product strength</span><strong>'+s+' mg/mL</strong><span>Calculated volume</span><strong class="calc-big">'+ml.toFixed(2)+' mL per dose</strong>'+(maxDaily?'<span>Maximum daily reference</span><strong>'+maxDaily.toFixed(1)+' mg/day</strong>':"")+'<div class="medicine-warning">Calculation only. Verify the product label, indication, dosing interval, maximum dose and patient-specific factors before administration.</div></div>';
}
function renderReports(){
 const el=$("reportCards"),tb=$("reportTables");if(!el||!tb)return;
 const expired=inventory.filter(m=>expiryStatus(m)==="expired"),near=inventory.filter(m=>expiryStatus(m)==="near"),low=inventory.filter(m=>stockStatus(m)==="low"),out=inventory.filter(m=>stockStatus(m)==="out"),h=loadHistory();
 el.innerHTML='<article class="report-card"><span>Total stock units</span><strong>'+inventory.reduce((x,m)=>x+(Number(m.stock)||0),0)+'</strong></article><article class="report-card"><span>Near expiry</span><strong>'+near.length+'</strong></article><article class="report-card"><span>Expired</span><strong>'+expired.length+'</strong></article><article class="report-card"><span>Cases stored</span><strong>'+h.length+'</strong></article>';
 const list=(title,rows)=>'<section class="report-table"><h3>'+title+'</h3>'+ (rows.length?'<table><thead><tr><th>Medicine</th><th>Stock</th><th>Expiry</th></tr></thead><tbody>'+rows.slice(0,15).map(m=>'<tr><td><button class="link-button" data-report-med="'+esc(m.id)+'">'+esc(m.name)+'</button></td><td>'+esc(m.stock||0)+'</td><td>'+esc(m.expiry||"—")+'</td></tr>').join("")+'</tbody></table>':'<div class="empty-list">None.</div>')+'</section>';
 tb.innerHTML=list("Low stock",low)+list("Expiring within 6 months",near)+list("Expired",expired);
 tb.querySelectorAll("[data-report-med]").forEach(b=>b.addEventListener("click",()=>openMedicineModal(b.dataset.reportMed)));
}
function downloadJson(filename,obj){const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(obj,null,2)],{type:"application/json"}));a.download=filename;a.click();URL.revokeObjectURL(a.href)}
function backupAll(){
 downloadJson("my-medical-assistant-backup.json",{version:2,exportedAt:new Date().toISOString(),inventory,settings,history:loadHistory(),audit:loadAudit()});
 logAudit("Backup created","Full local backup downloaded");
}
function restoreBackupFile(file){
 const r=new FileReader();r.onload=()=>{try{const x=JSON.parse(r.result);if(!Array.isArray(x.inventory))throw new Error("Invalid backup");localStorage.setItem(INVENTORY_KEY,JSON.stringify(x.inventory));if(x.settings)localStorage.setItem(SETTINGS_KEY,JSON.stringify(x.settings));if(Array.isArray(x.history))localStorage.setItem(HISTORY_KEY,JSON.stringify(x.history));if(Array.isArray(x.audit))localStorage.setItem(AUDIT_KEY,JSON.stringify(x.audit));inventory=loadInventory();settings=loadSettings();
document.querySelectorAll("[data-quick-tab]").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.quickTab)));
$("globalMedicineSearch")?.addEventListener("input",e=>renderGlobalSearch(e.target.value));
if($("globalMedicineSearch"))$("globalMedicineSearch").insertAdjacentHTML("afterend",'<div id="globalSearchResults" class="global-search-results hidden"></div>');
document.addEventListener("click",e=>{if(e.target.matches("[data-close-modal]"))closeMedicineModal();});
$("protocolSearch")?.addEventListener("input",renderProtocols);
$("pediatricForm")?.addEventListener("submit",e=>{e.preventDefault();calculatePediatric();});
$("backupAll")?.addEventListener("click",backupAll);
$("restoreBackup")?.addEventListener("change",e=>{if(e.target.files[0])restoreBackupFile(e.target.files[0])});
$("clearAudit")?.addEventListener("click",()=>{if(confirm("Clear local audit log?")){localStorage.removeItem(AUDIT_KEY);renderAudit()}});
$("exportReport")?.addEventListener("click",()=>downloadJson("clinic-report.json",{generatedAt:new Date().toISOString(),inventory,nearExpiry:inventory.filter(m=>expiryStatus(m)==="near"),expired:inventory.filter(m=>expiryStatus(m)==="expired"),lowStock:inventory.filter(m=>stockStatus(m)==="low"),cases:loadHistory()}));
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{if(b.dataset.tab==="protocols")renderProtocols();if(b.dataset.tab==="pediatric")renderPedMedicineOptions();if(b.dataset.tab==="reports")renderReports();if(b.dataset.tab==="dataCenter")renderAudit()}));
document.addEventListener("click",e=>{const b=e.target.closest(".medicine-item[data-med-id]");if(b)openMedicineModal(b.dataset.medId)});

refreshAll();renderReports();renderAudit();loadProtocols();alert("Backup restored successfully.");}catch(e){alert("Backup could not be restored. Please select a valid My Medical Assistant backup.");}};r.readAsText(file);
}



function setupLiveOpd(){
  let timer=null;
  const ids=["patientName","age","sex","complaint","history","bp","bloodSugar","pulse","spo2","temperature","exam","redFlags"];
  ids.forEach(id=>$(id)?.addEventListener("input",()=>{clearTimeout(timer);timer=setTimeout(runLiveAssessment,300)}));
  ids.forEach(id=>$(id)?.addEventListener("change",()=>{clearTimeout(timer);timer=setTimeout(runLiveAssessment,50)}));
}
function setupClinicSecurity(){
  const pin=localStorage.getItem(PIN_KEY),lock=$("pinLock");
  if(!lock)return;
  if(pin && sessionStorage.getItem("mma_unlocked")!=="1"){lock.classList.remove("hidden");} else {lock.classList.add("hidden");}
  $("pinUnlock")?.addEventListener("click",()=>{
    if(($("pinInput").value||"")===localStorage.getItem(PIN_KEY)){lock.classList.add("hidden");$("pinInput").value="";$("pinError").textContent="";sessionStorage.setItem("mma_unlocked","1");}
    else $("pinError").textContent="Incorrect PIN.";
  });
  $("pinInput")?.addEventListener("keydown",e=>{if(e.key==="Enter")$("pinUnlock")?.click()});
  $("setPin")?.addEventListener("click",()=>{
    const p=($("newPin").value||"").trim();
    if(!/^\d{4,8}$/.test(p)){alert("PIN 4–8 digits ka hona chahiye.");return}
    localStorage.setItem(PIN_KEY,p);$("newPin").value="";alert("Clinic PIN set ho gaya.");
  });
  $("removePin")?.addEventListener("click",()=>{
    if(confirm("Remove clinic PIN from this browser?")){localStorage.removeItem(PIN_KEY);sessionStorage.removeItem("mma_unlocked");lock.classList.add("hidden");}
  });
}
function setupPrescriptionDelegation(){
  document.addEventListener("click",e=>{
    const b=e.target.closest("[data-add-rx]");
    if(b){e.preventDefault();e.stopPropagation();addPrescription(b.dataset.addRx,b.dataset.rxPhase||"1");}
  });
}
setupPrescriptionDelegation();
setupClinicSecurity();
refreshAll();renderReports();renderAudit();loadProtocols();loadClinicRxProtocols();setupLiveOpd();
