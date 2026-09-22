const INVENTORY_KEY="mma_inventory_v2";
const SETTINGS_KEY="mma_settings_v1";
const HISTORY_KEY="mma_history_v1";
const starterInventory=[];

const DOSE_GUIDE={
  "Paracetamol":"650 mg BD x 5 days for recurrent tension-type headache; 650 mg TDS after food for arthritis/body ache/sciatica/knee pain; 500 mg QID in dengue/typhoid/malaria supportive care.",
  "Levocetirizine":"5 mg OD/HS for documented adult OPD indications; pediatric dose must be weight/age/formulation verified.",
  "Pantoprazole":"40 mg OD before breakfast for documented acidity/dyspepsia/headache-associated gastric protection.",
  "Domperidone":"10 mg BD before meals for acidity/epigastric pain; 10 mg BD before meals for bloating; 10 mg TDS in dyspepsia per the reference.",
  "Amitriptyline":"10 mg HS for 2–4 weeks in documented neuropathic pain; 10 mg HS x 3 weeks in recurrent tension-type headache.",
  "Pregabalin":"75 mg HS for 2–4 weeks in documented neuropathic pain.",
  "Methylcobalamine":"1500 mcg OD in the documented numbness/neuropathy protocol.",
  "Amlodipine":"5 mg OD in newly detected hypertension protocol.",
  "Telmisartan":"40 mg OD if needed in the documented hypertension protocol.",
  "Atorvastatin":"10 mg HS in newly detected hypertension protocol; 10–20 mg OD at night in dyslipidemia protocol.",
  "Desmopressin":"0.2 mg HS x 4 weeks in documented nocturnal enuresis protocol.",
  "Sildenafil":"50 mg on demand, 30–60 min before intercourse; maximum 1 tablet/day in the documented ED protocol.",
  "Tadalafil":"5 mg OD x 4–6 weeks in the documented ED protocol.",
  "Dapoxetine":"30 mg on demand, 1–3 hours before intercourse; maximum 1 dose/day.",
  "Nitrofurantoin":"100 mg BD after meals x 5 days in the documented acute uncomplicated UTI protocol.",
  "Diethylcarbamazine":"100 mg TDS x 12 days in documented acute filariasis protocol.",
  "Doxycycline":"100 mg BD x 6 weeks in documented acute filariasis protocol.",
  "Ondansetron":"4 mg BD in documented dengue protocol; 4 mg TDS in acute diarrhoea; 4 mg SOS in vertigo/minor pregnancy ailments where specified.",
  "Cefixime":"200 mg BD x 14 days in the documented typhoid protocol.",
  "Azithromycin":"500 mg OD x 7 days in documented typhoid protocol; 500 mg OD x 5 days in acute sinusitis; 500 mg OD x 3 days in acute diarrhoea.",
  "Metformin":"500 mg BD after meals in type 2 diabetes; 500 mg OD with meals then BD in PCOD; 500 mg OD/BD after meals in gestational diabetes.",
  "Glimepiride":"1 mg OD before breakfast in documented type 2 diabetes protocol.",
  "Sitagliptin":"100 mg OD in documented type 2 diabetes protocol.",
  "Orlistat":"120 mg TDS with meals in documented obesity protocol.",
  "Aceclofenac":"100 mg BD after food in arthritis/sciatica/body ache/knee pain protocols.",
  "Thiocolchicoside":"4 mg BD in documented sciatica/body-ache protocols.",
  "Gabapentin":"300 mg HS in documented sciatica/numbness protocols.",
  "Loperamide":"2 mg SOS in IBS-D protocol.",
  "Racecadotril":"100 mg TDS in documented acute diarrhoea protocol.",
  "Albendazole":"400 mg single dose, repeat after 2 weeks in intestinal worm protocol; 400 mg stat after 14 weeks in anaemia-in-pregnancy protocol.",
  "Betahistine":"16 mg TDS in documented vertigo protocol.",
  "Cinnarizine":"25 mg HS in documented vertigo protocol.",
  "Metronidazole":"400 mg BD x 7 days in documented infective leucorrhoea protocol.",
  "Fluconazole":"150 mg stat, one dose only for documented vaginal candidiasis protocol.",
  "Mefenamic Acid":"500 mg BD during pain in dysmenorrhoea; 500 mg TDS during pain in fibroid protocol.",
  "Tranexamic Acid":"500 mg TDS during menses/heavy bleeding days in the documented AUB/fibroid protocols.",
  "Medroxyprogesterone Acetate":"10 mg OD x 10 days/cycle for AUB-O; 10 mg OD from day 16–25 of cycle in fibroid protocol.",
  "Folic Acid":"5 mg OD x 12 weeks in first-trimester pregnancy; 5 mg OD in infertility and PCOD protocols.",
  "Calcium + Vitamin D":"OD in arthritis/knee pain/first-trimester pregnancy; BD in second-trimester pregnancy and gestational diabetes protocols.",
  "Iron + Folic Acid":"OD in second/third trimester pregnancy; elemental iron 60–100 mg + folic acid 0.5 mg, 1 tablet OD after meals in anaemia of pregnancy.",
  "Myo-inositol + D-chiro-inositol":"OD x 3–6 months in PCOD protocol.",
  "Prednisolone":"60 mg OD x 5 days, then taper in documented Bell's palsy protocol.",
  "Acyclovir":"400 mg TDS x 7 days in documented Bell's palsy protocol.",
  "Aspirin":"75 mg low dose in third-trimester high-risk pregnancy protocol; use only under the documented high-risk indication.",
  "Labetalol":"100 mg BD, titrate as needed, in documented gestational hypertension protocol.",
  "Nifedipine":"SR 30 mg OD as an alternative in documented gestational hypertension protocol."
};

const $=id=>document.getElementById(id);
function loadInventory(){try{const s=JSON.parse(localStorage.getItem(INVENTORY_KEY));if(!Array.isArray(s))return[];const legacySeedIds=new Set(["seed-prevent-n","seed-naproxen-250","seed-naproxen-500"]);const cleaned=s.filter(m=>!legacySeedIds.has(m?.id));if(cleaned.length!==s.length)localStorage.setItem(INVENTORY_KEY,JSON.stringify(cleaned));return cleaned}catch{return[]}}
function saveInventory(items){localStorage.setItem(INVENTORY_KEY,JSON.stringify(items))}
function loadHistory(){try{const s=JSON.parse(localStorage.getItem(HISTORY_KEY));return Array.isArray(s)?s:[]}catch{return []}}
function saveHistory(items){localStorage.setItem(HISTORY_KEY,JSON.stringify(items))}
let inventory=loadInventory();
let settings=loadSettings();

function loadSettings(){try{return JSON.parse(localStorage.getItem(SETTINGS_KEY))||{expiryDays:90}}catch{return{expiryDays:90}}}
function saveSettings(){localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))}
function daysUntil(date){if(!date)return Infinity;const d=new Date(date+"T23:59:59");return Math.ceil((d-Date.now())/86400000)}
function stockStatus(m){const n=Number(m.stock)||0, min=Number(m.minStock)||0;return n<=0?"out":n<=min?"low":"ok"}
function expiryStatus(m){const d=daysUntil(m.expiry);if(!Number.isFinite(d))return"none";if(d<0)return"expired";if(d<=settings.expiryDays)return"near";return"ok"}
function getReorder(){return inventory.filter(m=>stockStatus(m)!=="ok")}
function getExpiryAlerts(){return inventory.filter(m=>["expired","near"].includes(expiryStatus(m)))}
function medicineRow(m,mode="inventory"){
  const status=stockStatus(m), exp=expiryStatus(m), need=Math.max(0,(Number(m.minStock)||0)-(Number(m.stock)||0));
  return {m,status,exp,need};
}
function renderDashboard(){
  const reorder=getReorder(), expiry=getExpiryAlerts();
  $("statTotal").textContent=inventory.length;
  $("statLow").textContent=reorder.filter(x=>stockStatus(x)==="low").length;
  $("statOut").textContent=reorder.filter(x=>stockStatus(x)==="out").length;
  $("statExpiry").textContent=expiry.length;
  $("dashboardReorder").innerHTML=reorder.length?reorder.map(m=>`<div class="alert-row"><strong>${esc(m.name)}</strong><span>${m.stock||0} / min ${m.minStock||0} • Need ${Math.max(0,(Number(m.minStock)||0)-(Number(m.stock)||0))}</span></div>`).join(""):'<div class="empty-list">No reorder items.</div>';
  $("dashboardExpiry").innerHTML=expiry.length?expiry.map(m=>`<div class="alert-row ${expiryStatus(m)==="expired"?"expired":""}"><strong>${esc(m.name)}</strong><span>${esc(m.batch||"No batch")} • ${expiryStatus(m)==="expired"?"EXPIRED":"Expires in "+daysUntil(m.expiry)+" days"} • ${esc(m.expiry||"—")}</span></div>`).join(""):'<div class="empty-list">No expiry alerts.</div>';
}
function renderRequired(){
  const rows=getReorder();
  $("requiredTable").innerHTML=rows.length?`<table><thead><tr><th>Medicine</th><th>Stock</th><th>Minimum</th><th>Suggested order</th><th>Status</th><th>Expiry</th></tr></thead><tbody>${rows.map(m=>`<tr><td><strong>${esc(m.name)}</strong></td><td>${m.stock||0}</td><td>${m.minStock||0}</td><td>${Math.max(0,(Number(m.minStock)||0)-(Number(m.stock)||0))}</td><td><span class="status-tag ${stockStatus(m)}">${stockStatus(m)==="out"?"OUT": "REORDER"}</span></td><td>${esc(m.expiry||"—")}</td></tr>`).join("")}</tbody></table>`:'<div class="empty-list">No medicines currently require reorder.</div>';
}
function renderExpiry(){
  const rows=getExpiryAlerts().sort((a,b)=>daysUntil(a.expiry)-daysUntil(b.expiry));
  $("expiryTable").innerHTML=rows.length?`<table><thead><tr><th>Medicine</th><th>Batch</th><th>Expiry</th><th>Days</th><th>Stock</th><th>Status</th></tr></thead><tbody>${rows.map(m=>`<tr><td><strong>${esc(m.name)}</strong></td><td>${esc(m.batch||"—")}</td><td>${esc(m.expiry||"—")}</td><td>${daysUntil(m.expiry)}</td><td>${m.stock||0}</td><td><span class="status-tag ${expiryStatus(m)}">${expiryStatus(m)==="expired"?"EXPIRED":"NEAR EXPIRY"}</span></td></tr>`).join("")}</tbody></table>`:'<div class="empty-list">No near-expiry or expired batches.</div>';
}
function refreshAll(){renderInventory();renderDashboard();renderRequired();renderExpiry();renderStoreTablets()}

function renderStoreTablets(){
  const searchEl=$("storeTabletSearch"), stockEl=$("storeTabletStock"), listEl=$("storeTabletsList"), countEl=$("tabletCount");
  if(!listEl)return;
  const q=(searchEl?.value||"").trim().toLowerCase();
  const mode=stockEl?.value||"available";
  const rows=inventory.filter(m=>{
    const matchesSearch=!q||[m.name,m.category,m.form,m.notes,m.batch,m.use,m.dose].join(" ").toLowerCase().includes(q);
    const available=(Number(m.stock)||0)>0;
    return matchesSearch&&(mode==="all"||available);
  });
  const total=inventory.filter(m=>(Number(m.stock)||0)>0).length;
  if(countEl)countEl.textContent=total+" available";
  listEl.innerHTML=rows.length?rows.map(m=>{
    const stock=Number(m.stock)||0;
    const use=m.use||m.notes||"Not specified";
    const dose=m.dose||"Not specified";
    const expiry=m.expiry||"—";
    return '<tr><td><strong>'+esc(m.name)+'</strong><br><small>'+esc(m.category||"Medicine")+(m.form?" • "+esc(m.form):"")+'</small></td><td>'+esc(use)+'</td><td>'+esc(dose)+'</td><td>'+esc(expiry)+'</td><td><span class="tablet-availability '+(stock>0?"available":"unavailable")+'">'+stock+'</span></td></tr>';
  }).join(""):'<tr><td colspan="5" class="store-empty">No medicines are currently recorded for this view. Add medicines from Inventory.</td></tr>';
}

document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); $(b.dataset.tab).classList.add("active");
  if(b.dataset.tab==="dashboard")renderDashboard();
  if(b.dataset.tab==="inventory")renderInventory();
  if(b.dataset.tab==="required")renderRequired();
  if(b.dataset.tab==="expiry")renderExpiry();
  if(b.dataset.tab==="history")renderHistory();
  if(b.dataset.tab==="storeTablets")renderStoreTablets();
}));

function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function stockClass(v){const n=Number(v);if(!Number.isFinite(n))return "";if(n<=0)return"stock-out";if(n<=5)return"stock-low";return"stock-ok"}

function renderInventory(){
  const q=$("inventorySearch").value.trim().toLowerCase(),cat=$("inventoryCategory").value,status=$("inventoryStatus").value;
  const rows=inventory.filter(m=>(!q||[m.name,m.category,m.form,m.notes,m.batch].join(" ").toLowerCase().includes(q))&&(!cat||m.category===cat)&&(!status||stockStatus(m)===status));
  if(!rows.length){$("inventoryTable").innerHTML='<div class="empty-list">No medicines added yet. Add the verified clinic inventory to enable inventory-aware suggestions.</div>';return}
  $("inventoryTable").innerHTML='<table><thead><tr><th>Medicine</th><th>Category</th><th>Batch</th><th>Expiry</th><th>Stock</th><th>Min</th><th>Status</th><th></th></tr></thead><tbody>'+ 
    rows.map(m=>'<tr><td><strong>'+esc(m.name)+'</strong><br><small>'+esc(m.form)+'</small></td><td>'+esc(m.category)+'</td><td>'+esc(m.batch||"—")+'</td><td>'+esc(m.expiry||"—")+'</td><td class="'+stockClass(m.stock)+'">'+(Number.isFinite(Number(m.stock))?m.stock:"—")+'</td><td>'+esc(m.minStock||0)+'</td><td><span class="status-tag '+stockStatus(m)+'">'+stockStatus(m).toUpperCase()+'</span></td><td><button class="btn ghost remove-medicine" data-id="'+esc(m.id)+'">Remove</button></td></tr>').join("")+
    '</tbody></table>';
}
window.removeMedicine=id=>{inventory=inventory.filter(m=>m.id!==id);saveInventory(inventory);renderInventory()};
$("inventoryTable").addEventListener("click",e=>{const b=e.target.closest(".remove-medicine");if(b)window.removeMedicine(b.dataset.id)});
$("inventorySearch").addEventListener("input",renderInventory);$("inventoryCategory").addEventListener("change",renderInventory);$("inventoryStatus").addEventListener("change",renderInventory);
$("storeTabletSearch").addEventListener("input",renderStoreTablets);$("storeTabletStock").addEventListener("change",renderStoreTablets);

$("addMedicine").addEventListener("click",()=>{
  const name=prompt("Verified medicine name:");if(!name?.trim())return;
  const category=prompt("Category: Tablet/Capsule, Syrup/Drops, Cream/Gel/Ointment, Respule, Injection, IV Fluid, Other")||"Other";
  const form=prompt("Form / strength (optional):")||"";
  const batch=prompt("Batch number (optional):")||"";
  const expiry=prompt("Expiry date YYYY-MM-DD (optional):")||"";
  const stockRaw=prompt("Current stock quantity:")||"0";
  const minRaw=prompt("Minimum stock / reorder level:")||"0";
  const notes=prompt("Verified clinic note / indication (optional):")||"";
  const use=prompt("Main use (optional):")||"";
  const dose=prompt("Dose / dosing reference (optional):")||"";
  const stock=Number(stockRaw),minStock=Number(minRaw);
  inventory.push({id:crypto.randomUUID(),name:name.trim(),category:category.trim(),form:form.trim(),batch:batch.trim(),expiry:expiry.trim(),stock:Number.isFinite(stock)?stock:0,minStock:Number.isFinite(minStock)?minStock:0,notes:notes.trim(),use:use.trim(),dose:dose.trim()});
  saveInventory(inventory);refreshAll();
});
$("resetInventory").addEventListener("click",()=>{if(confirm("Clear all locally stored inventory records?")){inventory=[];saveInventory(inventory);refreshAll()}});
$("expirySettings").addEventListener("click",()=>{const n=prompt("Near-expiry alert days:",settings.expiryDays);if(n!==null&&Number(n)>0){settings.expiryDays=Number(n);saveSettings();refreshAll()}});
$("exportPurchase").addEventListener("click",()=>{const rows=getReorder();const header="Medicine,Current Stock,Minimum Stock,Suggested Order,Status";const body=rows.map(m=>[m.name,m.stock||0,m.minStock||0,Math.max(0,(Number(m.minStock)||0)-(Number(m.stock)||0)),stockStatus(m)].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");const csv=header+"\n"+body;const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="clinic-reorder-list.csv";a.click();URL.revokeObjectURL(a.href)});

function buildAssessment(d){
  const t=[d.complaint,d.history,d.exam,d.redFlags].join(" ").toLowerCase();
  const urgentTerms=["severe breathlessness","respiratory distress","chest pain","unconscious","altered sensorium","shock","severe bleeding","seizure","cyanosis"];
  const urgent=urgentTerms.some(x=>t.includes(x));
  const possible=d.complaint?"Possible consideration based on the presenting complaint: "+d.complaint+". Correlate with history, examination and investigations before assigning a diagnosis.":"Insufficient information for a meaningful clinical consideration.";
  const oral=inventory.filter(m=>["Tablet/Capsule","Syrup/Drops","Cream/Gel/Ointment"].includes(m.category));
  const injectable=inventory.filter(m=>["Injection","IV Fluid","Respule"].includes(m.category));
  const checks=["Confirm allergy history and current medicines before prescribing.","Check age/weight, pregnancy status when relevant, renal/hepatic status and contraindications.","Record vitals and examination findings for every symptomatic patient.","Use only medicines from the verified clinic inventory.","Dose and route must be confirmed against the clinic protocol / product information before administration."];
  if(d.redFlags.trim())checks.unshift("Review the reported red flags carefully: "+d.redFlags.trim());
  return {urgent,possible,oral,injectable,checks,summary:["Age: "+(d.age||"Not recorded"),"Sex: "+(d.sex||"Not recorded"),"Complaint: "+(d.complaint||"Not recorded"),"History: "+(d.history||"Not recorded"),"Examination/Vitals: "+(d.exam||"Not recorded"),"Red flags: "+(d.redFlags||"None recorded")].join("\\n")};
}
function medCard(m){
  const dose=m.dose||Object.entries(DOSE_GUIDE).find(([k])=>m.name.toLowerCase().includes(k.toLowerCase())||k.toLowerCase().includes(m.name.toLowerCase()))?.[1]||"Dose not specified in the provided clinic reference files.";
  return '<div class="medicine-item"><strong>'+esc(m.name)+'</strong><small>'+esc(m.category||"")+(m.form?" • "+esc(m.form):"")+(m.notes?" • "+esc(m.notes):"")+'</small><div class="medicine-dose"><b>Reference dose:</b> '+esc(dose)+'</div></div>'
}

$("caseForm").addEventListener("submit",e=>{
  e.preventDefault();
  const d={age:$("age").value,sex:$("sex").value,complaint:$("complaint").value.trim(),history:$("history").value.trim(),exam:$("exam").value.trim(),redFlags:$("redFlags").value.trim()};
  const a=buildAssessment(d);
  $("emptyResult").classList.add("hidden");$("result").classList.remove("hidden");$("resultState").textContent=a.urgent?"Referral review":"Generated";
  $("referralBox").innerHTML=a.urgent?'<div class="referral"><strong>Urgent review:</strong> This may need urgent referral / further investigation. Do not delay emergency care for this tool.</div>':"";
  $("possibleDiagnosis").textContent=a.possible;
  $("phase1").innerHTML=a.oral.length?a.oral.map(medCard).join(""):'<div class="empty-list">No verified oral/topical medicines are currently loaded in the inventory.</div>';
  $("phase2").innerHTML=a.injectable.length?a.injectable.map(medCard).join(""):'<div class="empty-list">No verified injections/IV fluids/respules are currently loaded in the inventory.</div>';
  $("checks").innerHTML=a.checks.map(c=>"<li>"+esc(c)+"</li>").join("");$("summary").textContent=a.summary;
  const h=loadHistory();h.unshift({id:crypto.randomUUID(),createdAt:new Date().toLocaleString(),complaint:d.complaint,age:d.age,sex:d.sex});saveHistory(h.slice(0,30));
});
$("clearCase").addEventListener("click",()=>{$("caseForm").reset();$("emptyResult").classList.remove("hidden");$("result").classList.add("hidden");$("resultState").textContent="Waiting"});

function renderHistory(){const h=loadHistory();$("historyList").innerHTML=h.length?h.map(x=>'<div class="history-item"><strong>'+esc(x.complaint||"Unnamed complaint")+'</strong><small>'+esc(x.createdAt)+" • Age: "+esc(x.age||"—")+" • Sex: "+esc(x.sex||"—")+"</small></div>").join(""):'<div class="empty-list">No cases stored in this browser yet.</div>'}
$("clearHistory").addEventListener("click",()=>{if(confirm("Clear locally stored case history?")){localStorage.removeItem(HISTORY_KEY);renderHistory()}});

refreshAll();
