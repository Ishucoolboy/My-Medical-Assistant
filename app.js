const INVENTORY_KEY="mma_inventory_v2";
const SETTINGS_KEY="mma_settings_v1";
const HISTORY_KEY="mma_history_v1";
const AUDIT_KEY="mma_audit_v1";
const PIN_KEY="mma_clinic_pin_v1";
const PROTOCOLS_URL="./data/protocols.json";
const IV_COMPAT_URL="./data/iv-compatibility.json";
const CLINIC_RX_URL="./data/clinic-rx-protocols.json";
let clinicRxProtocols=[];
async function loadClinicRxProtocols(){try{const r=await fetch(CLINIC_RX_URL);if(!r.ok)throw new Error("rx protocols unavailable");clinicRxProtocols=await r.json();}catch{clinicRxProtocols=[]}}
let ivCompatibility={version:1,diluents:[],verifiedPairs:[]};
async function loadIvCompatibility(){
  try{const r=await fetch(IV_COMPAT_URL);if(!r.ok)throw new Error("IV compatibility data unavailable");ivCompatibility=await r.json();}catch{ivCompatibility={version:1,diluents:[],verifiedPairs:[]}}
  renderIvChecker();
}
function ivMedicineRows(){
  return inventory.filter(m=>["Injection","IV Fluid","Respule"].includes(m.category)||/injection|infusion|respule/i.test((m.form||"")+" "+(m.category||""))).sort((a,b)=>a.name.localeCompare(b.name));
}
function renderIvChecker(){
  const medEl=$("ivMedicineSelect"),dilEl=$("ivDiluentSelect");if(!medEl||!dilEl)return;
  const selected=medEl.value;
  medEl.innerHTML='<option value="">Select injection / IV medicine</option>'+ivMedicineRows().map(m=>'<option value="'+esc(m.id)+'">'+esc(m.name)+(m.generic?" — "+esc(m.generic):"")+'</option>').join("");
  if(selected&&ivMedicineRows().some(m=>m.id===selected))medEl.value=selected;
  dilEl.innerHTML='<option value="">Select diluent</option>'+((ivCompatibility.diluents||[]).length?(ivCompatibility.diluents||[]):["0.9% Normal Saline (NS)","Ringer Lactate (RL)","5% Dextrose (DNS/D5)"]).map(x=>'<option>'+esc(x)+'</option>').join("");
}
function checkIvCompatibility(){
  const medId=$("ivMedicineSelect")?.value,diluent=$("ivDiluentSelect")?.value,out=$("ivCompatibilityResult");if(!out)return;
  if(!medId||!diluent){out.innerHTML='<div class="empty-list">Select both medicine and diluent first.</div>';return}
  const med=inventory.find(m=>m.id===medId);
  const pairs=ivCompatibility.verifiedPairs||[];
  const key=(v)=>String(v||"").trim().toLowerCase();
  const pair=pairs.find(p=>key(p.medicineId)===key(medId)&&key(p.diluent)===key(diluent))
    ||pairs.find(p=>key(p.medicine)===key(med?.name)&&key(p.diluent)===key(diluent));
  if(pair){
    const status=pair.status==="do-not-mix"?"do-not-mix":"compatible";
    out.innerHTML='<div class="iv-status '+status+'"><strong>'+esc(status==="compatible"?"VERIFIED COMPATIBLE":"DO NOT MIX")+'</strong><p>'+esc(pair.message||"Verify current product information before administration.")+'</p>'+(pair.concentration?'<small>Concentration: '+esc(pair.concentration)+'</small>':"")+(pair.source?'<small>Reference: '+esc(pair.source)+'</small>':"")+'</div>';
    return;
  }
  out.innerHTML='<div class="iv-status unverified"><strong>NOT VERIFIED</strong><p>No verified compatibility entry is loaded for <b>'+esc(med?.name||"selected medicine")+'</b> + <b>'+esc(diluent)+'</b>.</p><small>Do not mix in the same syringe/bag/line based on this tool. Check the product insert, pharmacy compatibility reference, or institutional protocol.</small></div>';
}
function loadAudit(){try{const x=JSON.parse(localStorage.getItem(AUDIT_KEY));return Array.isArray(x)?x:[]}catch{return[]}}
function logAudit(action,detail){const x=loadAudit();x.unshift({at:new Date().toLocaleString(),action,detail});localStorage.setItem(AUDIT_KEY,JSON.stringify(x.slice(0,100)));renderAudit()}
function renderAudit(){const el=$("auditList");if(!el)return;const x=loadAudit();el.innerHTML=x.length?x.slice(0,30).map(v=>'<div class="history-item"><strong>'+esc(v.action)+'</strong><small>'+esc(v.at)+' • '+esc(v.detail||"")+'</small></div>').join(""):'<div class="empty-list">No local audit entries.</div>'}
function switchTab(id){const b=document.querySelector('.tab[data-tab="'+id+'"]');if(b)b.click()}
function medicineSearchRows(q){q=(q||"").trim().toLowerCase();if(!q)return[];return inventory.filter(m=>[m.name,m.generic,m.use,m.notes,m.category,m.form].join(" ").toLowerCase().includes(q)).sort((x,y)=>x.name.localeCompare(y.name))}
function openMedicineModal(id){
 const m=inventory.find(x=>x.id===id);if(!m)return;
 const modal=$("medicineModal");$("modalMedicineName").textContent=m.name;
 const dose=m.dose||"Dose not specified in the provided clinic reference files.";
 const exp=expiryStatus(m),stock=Number(m.stock)||0;
 $("medicineModalBody").innerHTML='<div class="detail-grid"><div><span>Generic / composition</span><strong>'+esc(m.generic||"—")+'</strong></div><div><span>Form</span><strong>'+esc(m.form||m.category||"—")+'</strong></div><div><span>Main use</span><strong>'+esc(m.use||m.notes||"—")+'</strong></div><div><span>Reference dose</span><strong>'+esc(dose)+'</strong></div><div><span>Batch</span><strong>'+esc(m.batch||"—")+'</strong></div><div><span>Expiry</span><strong class="'+(exp==="expired"?"expiry-bad":"")+'">'+esc(m.expiry||"—")+(m.expiry?" • "+expiryTimeLabel(m):"")+'</strong></div></div><div class="stock-editor"><strong>Stock: <span id="modalStockValue">'+stock+'</span></strong><button class="btn ghost" data-stock-action="minus">− 1</button><button class="btn primary" data-stock-action="plus">+ 1</button><input id="modalStockInput" type="number" min="0" value="'+stock+'"><button class="btn ghost" data-stock-action="set">Set</button><button class="btn primary" data-stock-action="dispense-fefo">Dispense 1 (FEFO)</button></div><div class="medicine-warning">Always verify indication, contraindications, formulation strength and patient-specific dose before use.</div>';
 modal.classList.remove("hidden");modal.setAttribute("aria-hidden","false");
 modal.querySelectorAll("[data-stock-action]").forEach(b=>b.addEventListener("click",()=>{const action=b.dataset.stockAction;let n=Number(m.stock)||0;if(action==="minus")n=Math.max(0,n-1);if(action==="plus")n=n+1;if(action==="set")n=Math.max(0,Number($("modalStockInput").value)||0);
if(action==="dispense-fefo"){
  const group=inventory.filter(x=>(x.name||"").toLowerCase()===(m.name||"").toLowerCase()&&(x.generic||"").toLowerCase()===(m.generic||"").toLowerCase()&&(Number(x.stock)||0)>0&&!["expired"].includes(expiryStatus(x))).sort((x,y)=>daysUntil(x.expiry)-daysUntil(y.expiry));
  const target=group[0]||m;
  if(!target || (Number(target.stock)||0)<=0){alert("No usable stock available for FEFO dispensing.");return}
  target.stock=Math.max(0,(Number(target.stock)||0)-1);
  saveInventory(inventory);logAudit("Medicine dispensed",target.name+" • FEFO batch "+(target.batch||"—")+" • remaining "+target.stock);refreshAll();
  if(target.id!==m.id){openMedicineModal(target.id);return}
  n=target.stock;
}
m.stock=n;saveInventory(inventory);$("modalStockValue").textContent=n;$("modalStockInput").value=n;logAudit("Stock adjusted",m.name+" → "+n);refreshAll()}));
}
function closeMedicineModal(){const modal=$("medicineModal");if(modal){modal.classList.add("hidden");modal.setAttribute("aria-hidden","true")}}
function renderGlobalSearch(q){
 const rows=medicineSearchRows(q);let box=$("globalSearchResults");if(!box)return;
 if(!q){box.classList.add("hidden");return}
 box.classList.remove("hidden");box.innerHTML=rows.length?rows.slice(0,12).map(m=>'<button class="search-result" data-med-id="'+esc(m.id)+'"><strong>'+esc(m.name)+'</strong><small>'+esc(m.use||m.generic||"")+' • '+(Number(m.stock)||0)+' available</small></button>').join(""):'<div class="search-empty">No matching medicine.</div>';
 box.querySelectorAll("[data-med-id]").forEach(b=>b.addEventListener("click",()=>{openMedicineModal(b.dataset.medId);$("globalMedicineSearch").value="";box.classList.add("hidden")}));
}

const starterInventory=[
  {id:"seed-cyclofen-mr",name:"Cyclofen-MR",type:"Pharma/Brand",generic:"Aceclofenac 100 mg + Paracetamol 325 mg + Chlorzoxazone 250 mg",category:"Tablet/Capsule",form:"Tablet",batch:"SPA252687",expiry:"2027-10-01",stock:40,minStock:0,notes:"Pain/inflammation with muscle spasm; use only for appropriate musculoskeletal indications.",use:"Musculoskeletal pain, inflammation and muscle spasm/stiffness.",dose:"100 mg aceclofenac + 325 mg paracetamol + 250 mg chlorzoxazone; reference protocol: 1 tablet BD after food where indicated. Verify patient-specific contraindications before use."},
  {id:"seed-nimucaff-plus",name:"Nimucaff Plus",type:"Pharma/Brand",generic:"Nimesulide 100 mg + Paracetamol 325 mg",category:"Tablet/Capsule",form:"Tablet",batch:"AB26004",expiry:"2028-01-01",stock:160,minStock:0,notes:"Short-term pain/inflammation and fever relief; use only when clinically appropriate and prescribed.",use:"Acute pain, painful inflammatory conditions and fever.",dose:"Label: as directed by physician. Use the lowest effective dose for the shortest duration; avoid duplicate paracetamol/nimesulide-containing medicines and review liver, kidney and GI risk before use."},
  {id:"seed-kloz",name:"KLOZ",type:"Pharma/Brand",generic:"Aceclofenac 100 mg + Paracetamol 325 mg",category:"Tablet/Capsule",form:"Tablet",batch:"TJ-25010",expiry:"2028-03-01",stock:130,minStock:0,notes:"Pain-relieving/anti-inflammatory combination; use only for appropriate indications and avoid duplicate paracetamol/NSAID therapy.",use:"Pain and inflammation, including musculoskeletal/joint pain.",dose:"Label: as directed by physician. Clinic aceclofenac reference: 100 mg BD after food where indicated; verify patient-specific contraindications and avoid duplicate paracetamol/NSAID products."},
  {id:"seed-acepep-sp",name:"Acepep-SP",type:"Pharma/Brand",generic:"Aceclofenac 100 mg + Paracetamol 325 mg + Serratiopeptidase 10 mg",category:"Tablet/Capsule",form:"Tablet",batch:"SBT-3807",expiry:"2027-10-01",stock:30,minStock:0,notes:"Analgesic/anti-inflammatory combination; use only for appropriate pain/inflammatory indications and avoid duplicate paracetamol/NSAID therapy.",use:"Pain and inflammation with associated swelling, including musculoskeletal conditions.",dose:"Label: as directed by physician. Verify patient-specific indication, contraindications and duplicate paracetamol/NSAID use before prescribing."},
  {id:"seed-band-aid",name:"Band Aid",type:"Medical Supply",generic:"Adhesive wound dressing",category:"Medical Supply",form:"Adhesive bandage",batch:"",expiry:"",stock:9,minStock:0,notes:"For covering and protecting minor superficial wounds/cuts after appropriate wound cleaning.",use:"Covering and protecting minor superficial cuts and wounds.",dose:"Not applicable"},
  {id:"seed-etoglide-th",name:"Etoglide-TH",type:"Pharma/Brand",generic:"Etoricoxib 60 mg + Thiocolchicoside 4 mg",category:"Tablet/Capsule",form:"Tablet",batch:"T260013",expiry:"2027-12-01",stock:20,minStock:0,notes:"Prescription analgesic/muscle-relaxant combination for selected musculoskeletal pain with muscle spasm; use only when clinically appropriate.",use:"Musculoskeletal pain associated with muscle spasm.",dose:"Label: as directed by physician. Verify contraindications, duration and patient-specific risks before use."},
  {id:"seed-tromanil-forte",name:"Tromanil-Forte",type:"Pharma/Brand",generic:"Aceclofenac 100 mg + Paracetamol 500 mg",category:"Tablet/Capsule",form:"Tablet",batch:"ACW45032",expiry:"2027-10-01",stock:180,minStock:0,notes:"Prescription analgesic/anti-inflammatory combination for pain and inflammatory conditions; avoid duplicate paracetamol/NSAID therapy.",use:"Pain and inflammation, including musculoskeletal pain.",dose:"Label: as directed by physician. Clinic aceclofenac reference: 100 mg BD after food where indicated; verify patient-specific contraindications and total paracetamol exposure."},
  {id:"seed-tromanil-plus",name:"Tromanil Plus",type:"Pharma/Brand",generic:"Nimesulide 100 mg + Paracetamol 325 mg",category:"Tablet/Capsule",form:"Tablet",batch:"AJ046079",expiry:"2028-02-01",stock:490,minStock:0,notes:"Prescription analgesic/anti-inflammatory combination. Pack states use for severe headache, migraine, body pain, joint pain, dental pain and sports injuries; nimesulide use should be short-term and liver risk considered.",use:"Short-term relief of severe headache/migraine, body pain, joint pain, dental pain and sports injuries.",dose:"Pack: as directed by physician. Pack warning states nimesulide use should ordinarily be restricted to 10 days; avoid duplicate paracetamol/nimesulide products and review liver risk."},
  {id:"seed-nimucaff",name:"Nimucaff",type:"Pharma/Brand",generic:"Paracetamol 325 mg + Aceclofenac 50 mg + Chlorpheniramine maleate 2 mg + Caffeine 15 mg",category:"Tablet/Capsule",form:"Tablet",batch:"425-2413",expiry:"2028-04-01",stock:280,minStock:0,notes:"Prescription combination containing analgesic/anti-inflammatory, antihistamine and caffeine; use only for appropriate indications and avoid duplicate paracetamol/NSAID products.",use:"Symptomatic relief of pain/headache with associated cold/allergic symptoms where clinically appropriate.",dose:"Pack: as directed by physician. Verify indication, sedation risk, contraindications and total paracetamol/NSAID exposure before use."},
  {id:"seed-ciprosun-500",name:"Ciprosun 500",type:"Pharma/Brand",generic:"Ciprofloxacin 500 mg",category:"Tablet/Capsule",form:"Tablet",batch:"SCT-3838",expiry:"2027-10-01",stock:50,minStock:0,notes:"Prescription fluoroquinolone antibiotic for susceptible bacterial infections; use only when clinically indicated and prescribed.",use:"Bacterial infections caused by susceptible organisms; indication should be confirmed before use.",dose:"Pack: as directed by physician. Dose and duration depend on infection/site, susceptibility and patient factors."},
  {id:"seed-ximeceff-200",name:"Ximeceff-200",type:"Pharma/Brand",generic:"Cefixime 200 mg",category:"Tablet/Capsule",form:"Dispersible Tablet",batch:"064252067",expiry:"2027-10-01",stock:50,minStock:0,notes:"Prescription cephalosporin antibiotic; use only for an appropriate susceptible bacterial infection and according to the clinical indication.",use:"Bacterial infections caused by susceptible organisms; clinic reference includes a typhoid protocol.",dose:"Reference protocol: Cefixime 200 mg BD x 14 days in the documented typhoid protocol. Use only when that indication is clinically appropriate."},
  {id:"seed-festive-200",name:"Festive-200",type:"Pharma/Brand",generic:"Ofloxacin 200 mg",category:"Tablet/Capsule",form:"Tablet",batch:"FTADFT4001",expiry:"2027-07-01",stock:50,minStock:0,notes:"Schedule H prescription fluoroquinolone antibiotic; use only for an appropriate susceptible bacterial infection and according to the clinical indication.",use:"Bacterial infections caused by susceptible organisms; use should be based on the confirmed/likely infection and antimicrobial appropriateness.",dose:"Pack: as directed by physician. No specific dose for this product is documented in the current clinic reference files; do not invent a patient-specific dose."},
  {id:"seed-azimax-250",name:"Azimax 250",type:"Pharma/Brand",generic:"Azithromycin 250 mg",category:"Tablet/Capsule",form:"Film-coated Tablet",batch:"21104576",expiry:"2028-11-01",stock:48,minStock:0,notes:"Schedule H prescription macrolide antibiotic; use only for an appropriate susceptible bacterial infection and according to the clinical indication.",use:"Bacterial infections caused by susceptible organisms; current clinic reference includes azithromycin protocols for typhoid, acute sinusitis and acute diarrhoea.",dose:"Clinic reference: Azithromycin 500 mg OD x 7 days in documented typhoid protocol; 500 mg OD x 5 days in acute sinusitis; 500 mg OD x 3 days in acute diarrhoea. This pack is 250 mg, so do not automatically substitute tablet count without checking the intended regimen."},
  {id:"seed-amoxyclav-625",name:"Amoxicillin + Clavulanate 625 mg (Oneclav-625 / Mahamox-CV 625)",type:"Pharma/Brand",generic:"Amoxicillin 500 mg + Clavulanic acid 125 mg",category:"Tablet/Capsule",form:"Tablet",batch:"",expiry:"",stock:34,minStock:0,notes:"Prescription penicillin-class antibiotic combination. Stock count recorded as 34 tablets across the photographed brands; batch/expiry not legible from the provided images.",use:"Susceptible bacterial infections where amoxicillin/clavulanate is clinically indicated.",dose:"No specific adult tablet dose for this product is documented in the current clinic reference files; do not invent a patient-specific dose. Confirm indication, renal function, allergy history and product details before use."},
  {id:"seed-theomox-250-dt",name:"Theomox-250 DT",type:"Pharma/Brand",generic:"Amoxicillin 250 mg",category:"Tablet/Capsule",form:"Dispersible Tablet",batch:"ET250304",expiry:"2027-03-01",stock:60,minStock:0,notes:"Schedule H prescription penicillin antibiotic; use only for an appropriate susceptible bacterial infection and according to the clinical indication.",use:"Susceptible bacterial infections where amoxicillin is clinically indicated.",dose:"No specific adult dose for this 250 mg formulation is documented in the current clinic reference files; do not invent a patient-specific dose. Confirm indication, age/weight, renal function and allergy history before use."},
  {id:"seed-aristo-gesic-suspension",name:"Aristo Gesic Suspension",type:"Pharma/Brand",generic:"Ibuprofen 100 mg + Paracetamol 162.5 mg per 5 mL",category:"Syrup/Drops",form:"Suspension",batch:"AIAL25022",expiry:"2027-10-01",stock:5,minStock:0,notes:"Prescription pediatric analgesic/antipyretic combination. Label warns about ibuprofen-related bronchospasm in susceptible patients and cautions against exceeding the daily dose.",use:"Symptomatic relief of pain and fever in appropriate pediatric patients.",dose:"Current clinic reference provides pediatric paracetamol dosing separately (10–15 mg/kg q4–6h, max 60 mg/kg/day); this fixed-dose ibuprofen/paracetamol suspension should not be assigned a dose from that paracetamol-only guide. Confirm age/weight, indication and total paracetamol/NSAID exposure before use."},
  {id:"seed-biocetamol-ds",name:"Biocetamol-DS",type:"Pharma/Brand",generic:"Paracetamol 250 mg per 5 mL",category:"Syrup/Drops",form:"Paediatric Oral Suspension",batch:"SF4252955",expiry:"2027-11-01",stock:1,minStock:0,notes:"Paediatric analgesic/antipyretic suspension. Label states 3–4 times daily as directed, minimum 4-hour interval and maximum 60 mg/kg/day.",use:"Fever and pain relief in paediatric patients.",dose:"Clinic paediatric reference: Paracetamol 10–15 mg/kg per dose every 4–6 hours; maximum 60 mg/kg/day. This product contains 250 mg per 5 mL, so volume should be calculated from the child's weight and the selected mg/kg dose."},
  {id:"seed-cefjoy-50",name:"Cefjoy 50",type:"Pharma/Brand",generic:"Cefpodoxime proxetil 50 mg/5 mL",category:"Syrup/Drops",form:"Oral Suspension",batch:"YSFS25019",expiry:"2026-08-01",stock:1,minStock:0,notes:"Prescription cephalosporin antibiotic suspension. The photographed pack expired in August 2026; do not dispense or use after expiry.",use:"Susceptible bacterial infections where cefpodoxime is clinically indicated.",dose:"No specific cefpodoxime suspension dose is documented in the current clinic reference files; do not invent a patient-specific dose. For this photographed stock, expiry must be addressed before any use."},
  {id:"seed-flott-oz",name:"Flott-OZ Suspension",type:"Pharma/Brand",generic:"Ofloxacin 50 mg + Metronidazole equivalent 120 mg + Simethicone 10 mg per 5 mL",category:"Syrup/Drops",form:"Oral Suspension",batch:"HHP25007",expiry:"2027-01-01",stock:1,minStock:0,notes:"Paediatric prescription combination containing ofloxacin, metronidazole and simethicone. Label cautions include hypoglycaemia and mental-health-related adverse effects; use only when clinically indicated.",use:"Selected gastrointestinal/infective conditions where this combination is specifically indicated.",dose:"No specific dose for this fixed-dose paediatric combination is documented in the current clinic reference files; do not invent a patient-specific dose. Confirm age/weight, indication and contraindications before use."},
  {id:"seed-sothrex-tulsi",name:"Sothrex Tulsi Syrup",type:"Pharma/Brand",generic:"Dextromethorphan Hydrobromide 10 mg + Guaifenesin 50 mg + Levocetirizine 0.8 mg + Phenylephrine 5 mg per 5 mL",category:"Syrup/Suspension",form:"Syrup",batch:"AEE25083",expiry:"2027-10-01",stock:1,minStock:0,notes:"Prescription cough/cold combination; use short-term and only when clinically appropriate. Composition cross-checked from current product listings because the uploaded box does not show the composition panel.",use:"Short-term symptomatic relief of cough/cold, mucus/chest congestion, allergic symptoms and nasal congestion.",dose:"Exact patient-specific dose not specified in the uploaded pack; verify age/weight and current label/prescription before use."},
  {id:"seed-gasogel",name:"Gasogel",type:"Pharma/Brand",generic:"Sodium Hydroxide + Magnesium Hydroxide + Simethicone oral suspension",category:"Syrup/Suspension",form:"Oral Suspension",batch:"2505-31002",expiry:"2028-06-01",stock:1,minStock:0,notes:"Antacid/antiflatulent suspension for symptomatic relief of acidity, heartburn and gas. Exact component strengths are not reliably legible in the uploaded photographs, so they are not guessed. Check sodium content, renal function and interacting medicines where relevant.",use:"Symptomatic relief of acidity/heartburn and gas-related discomfort.",dose:"Exact strengths and patient-specific dose are not reliably legible in the uploaded photographs; verify the bottle label before use."},
  {id:"seed-humup-syrup",name:"HUM UP Syrup",type:"Pharma/Brand",generic:"Ferric Ammonium Citrate + Folic Acid + Cupric Sulphate + Manganese Sulphate + Vitamin B12",category:"Syrup/Suspension",form:"Syrup",batch:"",expiry:"2027-08-01",stock:2,minStock:0,notes:"Haematinic/multivitamin-mineral syrup. The exact component strengths and batch number are not reliably legible in the uploaded photographs, so they are intentionally not guessed. Use according to clinical indication and product label.",use:"Iron/folate and micronutrient supplementation in appropriate iron-deficiency or nutritional-deficiency states.",dose:"Pack states 'as directed by the physician'; exact strengths are not reliably legible, so patient-specific dose should be confirmed from the bottle label."},
  {id:"seed-picolux",name:"Picolux",type:"Pharma/Brand",generic:"Sodium Picosulfate",category:"Syrup/Suspension",form:"Oral Solution",batch:"PWLL002",expiry:"2027-02-01",stock:1,minStock:0,notes:"Prescription stimulant laxative. Use for appropriate short-term constipation/bowel-cleansing indications; avoid prolonged unsupervised use and assess for obstruction or acute abdomen when clinically relevant.",use:"Short-term relief of constipation and selected bowel-cleansing indications.",dose:"Use according to product strength, indication and patient age; exact strength was not legible in the uploaded photographs, so a dose is not guessed."},
  {id:"seed-domspas",name:"Domspas Suspension",type:"Pharma/Brand",generic:"Domperidone + Dicyclomine Hydrochloride + Dimethicone",category:"Syrup/Suspension",form:"Oral Suspension",batch:"PHZ26003",expiry:"2028-03-01",stock:3,minStock:0,notes:"Prescription paediatric suspension for selected gastrointestinal symptoms. Exact component strengths are not legible in the uploaded photographs; verify the label before use. Domperidone has important cardiac/QT and age-related restrictions; use only when clinically appropriate.",use:"Selected paediatric gastrointestinal symptoms such as nausea/vomiting with abdominal discomfort or spasm where this combination is specifically indicated.",dose:"Exact strengths are not legible in the uploaded photographs; verify product label and calculate/confirm age- and weight-appropriate dose before use."},
  {id:"seed-abd-plus",name:"ABD-Plus Suspension",type:"Pharma/Brand",generic:"Albendazole + Ivermectin suspension",category:"Syrup/Suspension",form:"Oral Suspension",batch:"SAMLO40",expiry:"2027-10-01",stock:7,minStock:0,notes:"Prescription anthelmintic combination. Exact strengths are not legible in the uploaded photographs, so they are intentionally not guessed. Use only when the indication, age/weight and product strength are appropriate.",use:"Treatment of selected intestinal worm/parasitic infections where albendazole plus ivermectin is clinically indicated.",dose:"Exact strengths and patient-specific dose are not legible in the uploaded photographs; verify the bottle label and calculate/confirm dose based on indication, age and weight before use."},
  {id:"seed-onn-syrup",name:"ONN Syrup",type:"Pharma/Brand",generic:"Ondansetron oral solution",category:"Syrup/Suspension",form:"Oral Solution",batch:"26F-3107",expiry:"2028-01-01",stock:11,minStock:0,notes:"Paediatric prescription antiemetic. The uploaded photographs do not show the ondansetron strength clearly, so strength is intentionally not guessed. Shake well before use; use only under appropriate clinical direction.",use:"Prevention and treatment of nausea and vomiting in paediatric patients where ondansetron is clinically indicated.",dose:"Exact strength is not legible in the uploaded photographs; verify the bottle/label before calculating a paediatric dose."},
  {id:"seed-almefkem-spas",name:"Almefkem-Spas",type:"Pharma/Brand",generic:"Mefenamic Acid + Dicyclomine Hydrochloride",category:"Tablet/Capsule",form:"Tablet",batch:"AIT25049PK",expiry:"2028-11-01",stock:200,minStock:0,notes:"Prescription analgesic-antispasmodic combination. Exact strengths are not visible in the uploaded photographs; verify strip/pack before prescribing. Consider NSAID-related GI/renal risks and anticholinergic effects.",use:"Pain associated with smooth-muscle spasm, including selected abdominal/menstrual cramp conditions where clinically appropriate.",dose:"Exact strengths and patient-specific dose are not visible in the uploaded photographs; verify product label before prescribing."},
  {id:"seed-ondiron-md",name:"Ondiron-MD",type:"Pharma/Brand",generic:"Ondansetron orally disintegrating tablet",category:"Tablet/Capsule",form:"Orally Disintegrating Tablet",batch:"3P4260732",expiry:"2028-04-01",stock:100,minStock:0,notes:"Prescription antiemetic. Strength is not legible in the uploaded photographs, so it is intentionally not guessed; verify the strip/pack before prescribing. Consider QT-prolongation and drug-interaction risks.",use:"Prevention and treatment of nausea and vomiting where ondansetron is clinically indicated.",dose:"Exact strength is not legible in the uploaded photographs; verify the pack/strip before prescribing. Patient-specific dose depends on indication, age and clinical setting."},
  {id:"seed-medistrip",name:"Mehta's Medistrip",type:"Medical Supply",generic:"Medicated first-aid dressing; turmeric (Curcuma longa) 0.12% w/w in medicated pad",category:"Medical Supply",form:"Medicated Adhesive Dressing Strip",batch:"",expiry:"2027-05-01",stock:90,minStock:0,notes:"Medicated first-aid dressing for minor cuts/scratches and superficial injuries. Apply the medicated centre to clean, dry skin; single-use dressing.",use:"First-aid protection of minor cuts, scratches and superficial wounds.",dose:"Not applicable; apply one strip to a cleaned, dry affected area as required. Replace as needed; do not reuse."},
  {id:"seed-dolonic-gel",name:"DoloNic Gel",type:"Pharma/Brand",generic:"Diclofenac Diethylamine + Linseed Oil + Methyl Salicylate + Menthol Gel",category:"Gel/Cream",form:"Topical Gel",batch:"2EF75",expiry:"2028-04-01",stock:7,minStock:0,notes:"Topical analgesic/anti-inflammatory gel for localized musculoskeletal pain. External use only; avoid eyes, mucosal surfaces and broken skin.",use:"Localized muscle/joint pain, sprains, strains and other superficial musculoskeletal pain where topical NSAID therapy is appropriate.",dose:"Apply a thin layer to the affected area as directed; frequency should follow the product label/clinical indication. Wash hands after application and avoid broken skin."},
  {id:"seed-mbldine-ointment",name:"MBLDINE Ointment",type:"Pharma/Brand",generic:"Povidone-Iodine 5% w/w",category:"Cream/Ointment",form:"Ointment",batch:"25020",expiry:"2027-10-01",stock:3,minStock:0,notes:"Topical povidone-iodine antiseptic ointment for appropriate superficial wound/skin antisepsis. For external use; avoid eyes and prolonged/large-area use without appropriate assessment.",use:"Antisepsis of minor cuts, superficial wounds and skin lesions where topical povidone-iodine is appropriate.",dose:"Apply a thin layer to the affected area as directed; frequency depends on wound/skin condition. External use only."},
  {id:"seed-ferglow-5",name:"Ferglow",type:"Pharma/Brand",generic:"Folic Acid 5 mg",category:"Tablet/Capsule",form:"Tablet",batch:"B26025",expiry:"2028-12-01",stock:80,minStock:0,notes:"Folic acid supplement; use according to indication and patient-specific folate requirement.",use:"Folate supplementation and prevention/treatment of folate deficiency; commonly used in pregnancy and folate-deficiency states where indicated.",dose:"Pack: as directed by physician. Dose depends on indication; verify patient-specific folate requirement before use."},
  {id:"seed-flutris-20",name:"Flutris 20",type:"Pharma/Brand",generic:"Fluoxetine 20 mg",category:"Tablet/Capsule",form:"Capsule",batch:"",expiry:"2027-03-01",stock:40,minStock:0,notes:"Prescription SSRI antidepressant. Use only under appropriate psychiatric/medical assessment; monitor for suicidality, serotonin syndrome, interactions and other patient-specific risks.",use:"Major depressive disorder and other selected psychiatric indications where fluoxetine is clinically indicated.",dose:"Pack: as directed by physician. Patient-specific dose and duration depend on indication, age and clinical response; do not self-start or stop abruptly without medical guidance."},
  {id:"seed-neseclo-nf",name:"Neseclo NF",type:"Pharma/Brand",generic:"Sodium Sulphate + Beclomethasone Dipropionate + Lignocaine Hydrochloride + Clotrimazole (label composition; strength not legible)",category:"Eye/Ear Drops",form:"Ear Drops",batch:"",expiry:"",stock:1,minStock:0,notes:"Prescription otic preparation. Strengths and batch/expiry details were not reliably legible in the uploaded photographs, so they are left unfilled rather than guessed. Verify the bottle label before dispensing.",use:"Ear conditions where the specific combination is clinically indicated; diagnosis and tympanic-membrane status should be assessed before use.",dose:"Exact strength and patient-specific dose not legible in the provided photographs; verify product label/prescription before use."},
  {id:"seed-festive-dee-optic",name:"Festive-Dee Optic",type:"Pharma/Brand",generic:"Ofloxacin + Dexamethasone",category:"Eye/Ear Drops",form:"Eye/Ear Drops",batch:"",expiry:"2028-06-01",stock:30,minStock:0,notes:"Prescription ophthalmic/otic antibiotic-corticosteroid combination. External use only and not for injection. Use only when a steroid-containing antibiotic drop is clinically appropriate; avoid unsupervised use in undiagnosed red eye or suspected viral/fungal infection.",use:"Selected bacterial eye/ear infections with inflammation where a topical fluoroquinolone plus corticosteroid is specifically indicated.",dose:"Exact strengths and patient-specific dose are not legible in the uploaded photographs; verify the bottle label/prescription before use."},
  {id:"seed-coldfree-ds-suspension",name:"Coldfree-DS Suspension",type:"Pharma/Brand",generic:"Paracetamol + Chlorpheniramine Maleate + Phenylephrine Hydrochloride",category:"Syrup/Suspension",form:"Paediatric Oral Suspension",batch:"",expiry:"2027-12-01",stock:3,minStock:0,notes:"Paediatric prescription cold-symptom combination. Exact strengths and batch/expiry details are not sufficiently legible in the uploaded photographs; verify the bottle/label before dispensing. Avoid duplicate paracetamol-containing products.",use:"Short-term symptomatic relief of fever/pain with runny or blocked nose and other cold symptoms where clinically appropriate.",dose:"Exact strengths and patient-specific dose not visible in the provided photographs; verify the product label and calculate paediatric dose by age/weight before use."},
  {id:"seed-oneclav-suspension",name:"Oneclav Suspension",type:"Pharma/Brand",generic:"Amoxicillin 200 mg + Clavulanic Acid 28.5 mg per 5 mL",category:"Syrup/Suspension",form:"Paediatric Oral Suspension",batch:"AD25325",expiry:"2027-04-01",stock:2,minStock:0,notes:"Prescription penicillin-class antibiotic suspension. Use only for confirmed/strongly suspected susceptible bacterial infection; check penicillin allergy. Reconstitute with sterile water as directed, shake well and follow product storage/discard instructions.",use:"Susceptible bacterial infections in paediatric patients, including selected respiratory, ENT, urinary, skin and soft-tissue infections.",dose:"No patient-specific dose entered; paediatric amoxicillin/clavulanate dosing should be calculated by weight and indication. Product strength is 200 mg amoxicillin + 28.5 mg clavulanic acid per 5 mL."},
  {id:"seed-ceebru-plus",name:"Ceebru-Plus",type:"Pharma/Brand",generic:"Ibuprofen + Paracetamol",category:"Syrup/Suspension",form:"Oral Suspension",batch:"ALG5228",expiry:"2027-08-01",stock:1,minStock:0,notes:"Paediatric analgesic/antipyretic suspension. Pack warns that ibuprofen may precipitate bronchospasm in susceptible patients and should be avoided in aspirin/NSAID-sensitive asthma; avoid duplicate paracetamol/NSAID products.",use:"Pain and fever relief in appropriate paediatric patients.",dose:"Exact strengths per 5 mL are not legible in the uploaded photographs; verify the label before calculating an age/weight-based dose."},
  {id:"seed-neurovit-syrup",name:"Neurovit Syrup",type:"Health Supplement",generic:"Multivitamin + Multimineral + L-Lysine syrup",category:"Syrup/Suspension",form:"Syrup",batch:"RHH-070",expiry:"2027-10-01",stock:2,minStock:0,notes:"Dietary/nutritional supplement containing vitamins, minerals and L-lysine. Pack states NOT FOR MEDICINAL USE; use as a nutritional supplement.",use:"Nutritional supplementation, including support for dietary vitamin/mineral intake and appetite/energy support.",dose:"Pack recommended usage: 5 mL three times a day after meals; do not exceed the recommended serving size."},
  {id:"seed-ferroclide-xt",name:"Ferroclide-XT",type:"Pharma/Brand",generic:"Ferrous Ascorbate equivalent to Elemental Iron 100 mg + Folic Acid 1.5 mg",category:"Tablet/Capsule",form:"Tablet",batch:"TL252015",expiry:"2027-11-01",stock:20,minStock:0,notes:"Iron-folic acid supplement for iron deficiency/anaemia; use according to clinical assessment and avoid unnecessary duplicate iron therapy.",use:"Iron deficiency and iron-deficiency anaemia; iron-folate supplementation where clinically indicated.",dose:"Pack: as directed by physician. Verify haemoglobin/iron status, age, pregnancy status and total iron intake before use."},
  {id:"seed-montas-l",name:"Montas-L",type:"Pharma/Brand",generic:"Montelukast 10 mg + Levocetirizine 5 mg",category:"Tablet/Capsule",form:"Tablet",batch:"K2503066",expiry:"2027-11-01",stock:125,minStock:0,notes:"Prescription antiallergic combination; use for appropriate allergic rhinitis/airway-related indications. Avoid duplicate montelukast or levocetirizine therapy.",use:"Allergic rhinitis and allergy-related respiratory symptoms; montelukast-containing therapy should be used for an appropriate indication.",dose:"Pack: as directed by physician. Verify age, indication and patient-specific contraindications before use."},
  {id:"seed-leocet-m",name:"Leocet-M Syrup",type:"Pharma/Brand",generic:"Montelukast Sodium + Levocetirizine Hydrochloride",category:"Syrup/Suspension",form:"Syrup",batch:"DL25195",expiry:"2027-10-01",stock:6,minStock:0,notes:"Paediatric prescription syrup; use for appropriate allergic/respiratory indications. Exact strengths per 5 mL are not legible in the provided photos.",use:"Allergic symptoms and selected respiratory/allergic conditions where clinically appropriate.",dose:"Exact strength and age/weight-specific dose not visible in the provided photographs; verify label and calculate paediatric dose before use."},
  {id:"seed-kold2kold",name:"Kold 2 Kold Drops",type:"Pharma/Brand",generic:"Paracetamol + Phenylephrine HCl + Chlorpheniramine Maleate",category:"Syrup/Drops",form:"Paediatric oral drops",batch:"2FG-3073",expiry:"2027-06-01",stock:4,minStock:0,notes:"Paediatric cough/cold drops; pack warns about overdose-related severe liver injury and allergic reactions. Avoid duplicate paracetamol-containing products.",use:"Symptomatic relief of cough/cold symptoms in children where clinically appropriate.",dose:"Exact ingredient strengths and a specific dose are not legible in the provided photographs/current clinic reference; verify product label and age/weight-specific dosing before prescribing."},
  {id:"seed-montiride-fxa",name:"Montiride FXA",type:"Pharma/Brand",generic:"Acebrophylline SR + Montelukast + Fexofenadine Hydrochloride",category:"Tablet/Capsule",form:"Tablet",batch:"IE154009",expiry:"2026-11-01",stock:1,minStock:0,notes:"Respiratory/allergic symptom combination; use only for an appropriate documented indication.",use:"Selected respiratory/allergic conditions with cough, bronchospasm or allergic symptoms where clinically appropriate.",dose:"Product-specific dose not documented in the current clinic reference files; use the documented protocol for the diagnosed condition rather than inventing a dose."},
  {id:"seed-zukamin-plus",name:"Zukamin Plus Drops",type:"Pharma/Brand",generic:"Paracetamol + Phenylephrine HCl + Chlorpheniramine Maleate",category:"Syrup/Drops",form:"Paediatric oral drops",batch:"ZPL26006RH",expiry:"2028-01-01",stock:5,minStock:0,notes:"Paediatric cough/cold drops. Exact ingredient strengths were not legible on the provided photographs; avoid duplicate paracetamol-containing products and verify age-specific suitability.",use:"Symptomatic relief of cough/cold symptoms in children where clinically appropriate.",dose:"Exact strengths and a specific dose are not documented clearly enough in the provided photos/current clinic reference; verify product label and use age/weight-specific dosing before prescribing."},
  {id:"seed-oflokem-oz-plus",name:"Oflokem-OZ+ Suspension",type:"Pharma/Brand",generic:"Ofloxacin + Metronidazole + Simethicone (strengths not legible on photographed pack)",category:"Syrup/Drops",form:"Paediatric Oral Suspension",batch:"OFL26006RH",expiry:"2028-01-01",stock:12,minStock:0,notes:"Paediatric prescription antimicrobial combination. Exact composition strengths were not legible from the provided photographs; verify pack label before clinical use.",use:"Selected gastrointestinal/infective conditions where this combination is specifically indicated.",dose:"Not specified because the exact strength is not legible and no specific dose for this product is documented in the current clinic reference files."},
];

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
function loadInventory(){try{const s=JSON.parse(localStorage.getItem(INVENTORY_KEY));const base=Array.isArray(s)?s:[];const legacySeedIds=new Set(["seed-prevent-n","seed-naproxen-250","seed-naproxen-500"]);let cleaned=base.filter(m=>!legacySeedIds.has(m?.id));let changed=cleaned.length!==base.length;for(const seed of starterInventory){if(!cleaned.some(m=>m?.id===seed.id)){cleaned.push({...seed});changed=true}}if(changed||!Array.isArray(s))localStorage.setItem(INVENTORY_KEY,JSON.stringify(cleaned));return cleaned}catch{return starterInventory.map(m=>({...m}))}}
function saveInventory(items){localStorage.setItem(INVENTORY_KEY,JSON.stringify(items))}
function loadHistory(){try{const s=JSON.parse(localStorage.getItem(HISTORY_KEY));return Array.isArray(s)?s:[]}catch{return []}}
function saveHistory(items){localStorage.setItem(HISTORY_KEY,JSON.stringify(items))}
let inventory=loadInventory();
let settings=loadSettings();

function loadSettings(){try{return JSON.parse(localStorage.getItem(SETTINGS_KEY))||{expiryDays:90}}catch{return{expiryDays:90}}}
function saveSettings(){localStorage.setItem(SETTINGS_KEY,JSON.stringify(settings))}
function daysUntil(date){if(!date)return Infinity;const d=new Date(date+"T23:59:59");return Math.ceil((d-Date.now())/86400000)}
function sixMonthExpiryCutoff(){
  const d=new Date();
  d.setHours(23,59,59,999);
  d.setMonth(d.getMonth()+6);
  return d;
}
function expiryTimeLabel(m){
  const d=daysUntil(m.expiry);
  if(!Number.isFinite(d))return"—";
  if(d<0)return"EXPIRED";
  if(d<30)return"Less than 1 month";
  const months=Math.max(1,Math.round(d/30.44));
  return months+" month"+(months===1?"":"s")+" left";
}
function stockStatus(m){const n=Number(m.stock)||0, min=Number(m.minStock)||0;return n<=0?"out":n<=min?"low":"ok"}
function expiryStatus(m){
  if(!m.expiry)return"none";
  const d=daysUntil(m.expiry);
  if(!Number.isFinite(d))return"none";
  if(d<0)return"expired";
  const expiryDate=new Date(m.expiry+"T23:59:59");
  return expiryDate<=sixMonthExpiryCutoff()?"near":"ok";
}
function getReorder(){return inventory.filter(m=>stockStatus(m)!=="ok")}
function getExpiryAlerts(){return inventory.filter(m=>["expired","near"].includes(expiryStatus(m))).sort((a,b)=>daysUntil(a.expiry)-daysUntil(b.expiry))}
function medicineRow(m,mode="inventory"){
  const status=stockStatus(m), exp=expiryStatus(m), need=Math.max(0,(Number(m.minStock)||0)-(Number(m.stock)||0));
  return {m,status,exp,need};
}
function renderDashboard(){
  const reorder=getReorder(), expiry=getExpiryAlerts().sort((a,b)=>daysUntil(a.expiry)-daysUntil(b.expiry));
  const today=new Date().toISOString().slice(0,10), history=loadHistory();
  const todayCases=history.filter(x=>x.dateKey===today);
  const due=history.filter(x=>x.followupDate&&x.followupDate<=today);
  if($("statTodayCases"))$("statTodayCases").textContent=todayCases.length;
  if($("statFollowups"))$("statFollowups").textContent=due.length;
  if($("dashboardFollowups"))$("dashboardFollowups").innerHTML=due.length?due.slice(0,12).map(x=>'<div class="alert-row"><strong>'+esc(x.patientName||"Unnamed patient")+'</strong><span>'+esc(x.followupDate||"—")+' • '+esc(x.mobile||"")+' • '+esc(x.complaint||"")+'</span></div>').join(""):'<div class="empty-list">No follow-ups due.</div>';
  $("statTotal").textContent=inventory.length;
  $("statLow").textContent=reorder.filter(x=>stockStatus(x)==="low").length;
  $("statOut").textContent=reorder.filter(x=>stockStatus(x)==="out").length;
  $("statExpiry").textContent=expiry.length;
  $("statExpired").textContent=expiry.filter(m=>expiryStatus(m)==="expired").length;
  $("statUnits").textContent=inventory.reduce((sum,m)=>sum+(Number(m.stock)||0),0);
  $("dashboardReorder").innerHTML=reorder.length?reorder.map(m=>`<div class="alert-row"><strong>${esc(m.name)}</strong><span>${m.stock||0} / min ${m.minStock||0} • Need ${Math.max(0,(Number(m.minStock)||0)-(Number(m.stock)||0))}</span></div>`).join(""):'<div class="empty-list">No reorder items.</div>';
  $("dashboardExpiry").innerHTML=expiry.length?expiry.map(m=>`<div class="alert-row ${expiryStatus(m)==="expired"?"expired":""}"><strong>${esc(m.name)}</strong><span>${esc(m.batch||"No batch")} • ${expiryStatus(m)==="expired"?"EXPIRED":expiryTimeLabel(m)+" days"} • ${esc(m.expiry||"—")}</span></div>`).join(""):'<div class="empty-list">No expiry alerts.</div>';
}
function renderRequired(){
  const rows=getReorder();
  $("requiredTable").innerHTML=rows.length?`<table><thead><tr><th>Medicine</th><th>Stock</th><th>Minimum</th><th>Suggested order</th><th>Status</th><th>Expiry</th></tr></thead><tbody>${rows.map(m=>`<tr><td><strong>${esc(m.name)}</strong></td><td>${m.stock||0}</td><td>${m.minStock||0}</td><td>${Math.max(0,(Number(m.minStock)||0)-(Number(m.stock)||0))}</td><td><span class="status-tag ${stockStatus(m)}">${stockStatus(m)==="out"?"OUT": "REORDER"}</span></td><td>${esc(m.expiry||"—")}</td></tr>`).join("")}</tbody></table>`:'<div class="empty-list">No medicines currently require reorder.</div>';
}
function renderExpiry(){
  const rows=getExpiryAlerts();
  $("expiryTable").innerHTML=rows.length?`<table><thead><tr><th>Medicine</th><th>Batch</th><th>Expiry</th><th>Time Left</th><th>Stock</th><th>Status</th></tr></thead><tbody>${rows.map(m=>`<tr><td><strong>${esc(m.name)}</strong></td><td>${esc(m.batch||"—")}</td><td>${esc(m.expiry||"—")}</td><td>${expiryTimeLabel(m)}</td><td>${m.stock||0}</td><td><span class="status-tag ${expiryStatus(m)}">${expiryStatus(m)==="expired"?"EXPIRED":"NEAR EXPIRY"}</span></td></tr>`).join("")}</tbody></table>`:'<div class="empty-list">No near-expiry or expired batches.</div>';
}
function refreshAll(){renderDashboard();renderRequired();renderExpiry();renderStoreTablets();renderUseShelves()}

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
  if(b.dataset.tab==="required")renderRequired();
  if(b.dataset.tab==="expiry")renderExpiry();
  if(b.dataset.tab==="history")renderHistory();
  if(b.dataset.tab==="storeTablets")renderStoreTablets();
  if(b.dataset.tab==="diseaseShelf")renderUseShelves();
}));

function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
const USE_SHELVES=[
  {id:"all",name:"All Medicines",icon:"💊",keys:[]},
  {id:"fever-pain",name:"Fever & Pain",icon:"🌡️",keys:["fever","pain","headache","migraine","analges","antipyret","body ache"]},
  {id:"gastric",name:"Acidity, Gas & Digestion",icon:"🫄",keys:["acidity","heartburn","gas","antacid","gastric","reflux","indigestion","ulcer","digest"]},
  {id:"nausea",name:"Nausea & Vomiting",icon:"🤢",keys:["nausea","vomit","antiemetic"]},
  {id:"constipation",name:"Constipation & Bowel",icon:"🚽",keys:["constipation","laxative","diarr","diarrhoea","diarrhea","bowel","stool"]},
  {id:"cough-cold",name:"Cough, Cold & Allergy",icon:"🤧",keys:["cough","cold","allerg","rhinitis","nasal","sneez","antihistamine","mucus"]},
  {id:"respiratory",name:"Respiratory / Asthma",icon:"🫁",keys:["asthma","respir","bronch","airway","wheez","breath"]},
  {id:"infection",name:"Bacterial / Infective Conditions",icon:"🦠",keys:["antibiotic","bacterial","infect","infection","antimicrobial"]},
  {id:"musculoskeletal",name:"Muscle, Joint & Spasm",icon:"🦴",keys:["musculoskeletal","joint","arthritis","muscle","spasm","sprain","strain","stiffness","inflamm"]},
  {id:"skin-wound",name:"Skin, Cuts & Wounds",icon:"🩹",keys:["wound","cut","skin","antiseptic","topical","dressing","lesion"]},
  {id:"eye-ear",name:"Eye & Ear",icon:"👁️",keys:["eye","ear","otic","ophthalm","red eye"]},
  {id:"nutrition",name:"Vitamins, Iron & Nutrition",icon:"🥗",keys:["vitamin","mineral","iron","folic","nutri","anaemia","anemia","supplement","lysine"]},
  {id:"worms",name:"Worm / Parasite Treatment",icon:"🪱",keys:["worm","helminth","parasite","anthelmint"]},
  {id:"women",name:"Women's Health",icon:"👩",keys:["pregnancy","pregnant","pcod","pcos","menstrual","dysmen","mastalgia","gynaec","gynec","folate"]},
  {id:"mental-health",name:"Mental Health",icon:"🧠",keys:["depress","psychiatric","ssri","mental"]},
  {id:"other",name:"Other / Review",icon:"📦",keys:[]}
];
let activeUseShelf="all";
function shelfText(m){return [m.name,m.generic,m.use,m.notes,m.category,m.form].join(" ").toLowerCase()}
function medicineMatchesShelf(m,shelf){
  if(shelf.id==="all")return true;
  if(shelf.id==="other")return !USE_SHELVES.some(x=>x.id!=="all"&&x.id!=="other"&&x.keys.some(k=>shelfText(m).includes(k)));
  return shelf.keys.some(k=>shelfText(m).includes(k));
}
function renderUseShelves(){
  const shelvesEl=$("diseaseShelves"),listEl=$("diseaseShelfList"),titleEl=$("diseaseShelfTitle"),subEl=$("diseaseShelfSub"),countEl=$("diseaseShelfCount");
  if(!shelvesEl||!listEl)return;
  const shelf=USE_SHELVES.find(x=>x.id===activeUseShelf)||USE_SHELVES[0];
  const rows=inventory.filter(m=>medicineMatchesShelf(m,shelf)).sort((x,y)=>x.name.localeCompare(y.name));
  shelvesEl.innerHTML=USE_SHELVES.map(x=>{
    const count=inventory.filter(m=>medicineMatchesShelf(m,x)).length;
    return '<button class="disease-shelf '+(x.id===activeUseShelf?"active":"")+'" data-shelf="'+x.id+'"><span class="disease-shelf-icon">'+x.icon+'</span><span><strong>'+esc(x.name)+'</strong><small>'+count+' medicine'+(count===1?"":"s")+'</small></span></button>';
  }).join("");
  titleEl.textContent=shelf.name;
  subEl.textContent=rows.length+" medicine"+(rows.length===1?"":"s");
  countEl.textContent=inventory.length+" medicines";
  listEl.innerHTML=rows.length?rows.map(m=>'<div class="disease-medicine"><div><strong>'+esc(m.name)+'</strong><small>'+esc(m.generic||"")+'</small></div><div class="disease-use"><b>Use:</b> '+esc(m.use||m.notes||"Not specified")+'</div><div class="disease-stock"><span>'+esc(m.form||m.category||"Medicine")+'</span><strong>'+((Number(m.stock)||0)>0?(m.stock+" available"):"Out of stock")+'</strong></div></div>').join(""):'<div class="empty-list">No medicines are currently classified in this shelf.</div>';
  shelvesEl.querySelectorAll("[data-shelf]").forEach(b=>b.addEventListener("click",()=>{activeUseShelf=b.dataset.shelf;renderUseShelves()}));
}

function stockClass(v){const n=Number(v);if(!Number.isFinite(n))return "";if(n<=0)return"stock-out";if(n<=5)return"stock-low";return"stock-ok"}

function renderInventory(){
  const q=$("inventorySearch").value.trim().toLowerCase(),cat=$("inventoryCategory").value,status=$("inventoryStatus").value;
  const rows=inventory.filter(m=>(!q||[m.name,m.category,m.form,m.notes,m.batch].join(" ").toLowerCase().includes(q))&&(!cat||m.category===cat)&&(!status||stockStatus(m)===status));
  if(!rows.length){$("inventoryTable").innerHTML='<div class="empty-list">No medicines added yet. Add the verified clinic inventory to enable inventory-aware suggestions.</div>';return}
  $("inventoryTable").innerHTML='<table><thead><tr><th>Medicine</th><th>Category</th><th>Batch</th><th>Expiry</th><th>Stock</th><th>Min</th><th>Status</th><th></th></tr></thead><tbody>'+ 
    rows.map(m=>'<tr><td><strong>'+esc(m.name)+'</strong><br><small>'+esc(m.form)+'</small></td><td>'+esc(m.category)+'</td><td>'+esc(m.batch||"—")+'</td><td>'+esc(m.expiry||"—")+'</td><td class="'+stockClass(m.stock)+'">'+(Number.isFinite(Number(m.stock))?m.stock:"—")+'</td><td>'+esc(m.minStock||0)+'</td><td><span class="status-tag '+stockStatus(m)+'">'+stockStatus(m).toUpperCase()+'</span></td><td><button class="btn ghost remove-medicine" data-id="'+esc(m.id)+'">Remove</button></td></tr>').join("")+
    '</tbody></table>';
}
$("storeTabletSearch").addEventListener("input",renderStoreTablets);$("storeTabletStock").addEventListener("change",renderStoreTablets);

$("expirySettings").addEventListener("click",()=>{alert("Expiry alerts are fixed to medicines expiring within 6 months, with nearest expiry shown first.")});
$("exportPurchase").addEventListener("click",()=>{const rows=getReorder();const header="Medicine,Current Stock,Minimum Stock,Suggested Order,Status";const body=rows.map(m=>[m.name,m.stock||0,m.minStock||0,Math.max(0,(Number(m.minStock)||0)-(Number(m.stock)||0)),stockStatus(m)].map(v=>`"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");const csv=header+"\n"+body;const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="clinic-reorder-list.csv";a.click();URL.revokeObjectURL(a.href)});

const OPD_SHELVES=[
  {id:"fever-pain",label:"Fever / Pain",keys:["fever","pain","headache","migraine","body ache","dental","joint","analges"]},
  {id:"gastric",label:"GI / Acidity / Gas",keys:["gas","acidity","heartburn","gastric","reflux","indigestion","abdomen","abdominal","diarr","constipation","vomit","nausea","stool"]},
  {id:"respiratory",label:"Cough / Cold / Respiratory",keys:["cough","cold","allerg","rhinitis","nasal","sputum","phlegm","asthma","respir","wheez","bronch"]},
  {id:"infection",label:"Infective / Antibiotic",keys:["infection","infective","bacterial","typhoid","sinusitis","uti","urinary","diarr","antibiotic"]},
  {id:"musculoskeletal",label:"Muscle / Joint / Spasm",keys:["muscle","joint","arthritis","spasm","sprain","strain","stiffness","sciatica","inflamm"]},
  {id:"skin-wound",label:"Skin / Wound",keys:["wound","cut","skin","rash","lesion","antiseptic","dressing"]},
  {id:"eye-ear",label:"Eye / Ear",keys:["eye","ear","otic","ophthalm","red eye"]},
  {id:"women",label:"Women's Health",keys:["pregnan","pcod","pcos","menstrual","dysmen","mastalgia","vaginal","leucorr","aubu","bleeding"]},
  {id:"nutrition",label:"Anaemia / Nutrition",keys:["anaemia","anemia","iron","folic","vitamin","mineral","nutrition"]},
  {id:"worms",label:"Worm / Parasite",keys:["worm","parasite","helminth","anthelmint"]}
];
const MARWARI_CLINICAL_ALIASES={
  "बुखार":"fever","ताव":"fever","ज्वर":"fever","बुखार चढ़":"fever",
  "खांसी":"cough","खासी":"cough","खांस":"cough","खांसी रोके कोनी":"persistent cough",
  "जुकाम":"cold","नाक बहे":"runny nose","नक बह":"runny nose","नाक बंद":"nasal congestion",
  "गला दुखे":"sore throat","गला दुख":"sore throat","गला में पीड़":"sore throat",
  "सिर दुखे":"headache","सिर दुख":"headache","सिर में पीड़":"headache","चक्कर आवे":"dizziness","चक्कर आ":"dizziness",
  "पेट दुखे":"abdominal pain","पेट दुख":"abdominal pain","पेट में पीड़":"abdominal pain","पेट साफ कोनी":"constipation",
  "उल्टी":"vomiting","ओक":"vomiting","जी मचल":"nausea","जी मिचल":"nausea",
  "दस्त":"diarrhoea","जुलाब":"diarrhoea","पातळ दस्त":"diarrhoea",
  "पेशाब में जलन":"urinary burning","पेशाब जळे":"urinary burning","पेशाब में पीड़":"urinary pain",
  "कमर दुखे":"back pain","कमर में पीड़":"back pain","जोड़ दुखे":"joint pain","जोड़ में पीड़":"joint pain",
  "शरीर दुखे":"body ache","सारा शरीर दुखे":"body ache","बदन दुखे":"body ache",
  "सांस फूल":"breathlessness","सांस चढ़":"breathlessness","दम घुट":"breathlessness",
  "सीने में दर्द":"chest pain","छाती में दर्द":"chest pain",
  "खुजली":"itching","खारिश":"itching","दाने":"rash",
  "कान दुखे":"ear pain","आंख दुखे":"eye pain","आंख लाल":"red eye"
};
const MARWARI_LATIN_ALIASES={
  "bukhar":"fever","taav":"fever","tap":"fever","khansi":"cough","khasi":"cough","jukam":"cold","nak bahe":"runny nose","gala dukhe":"sore throat","gala dukhe hai":"sore throat",
  "sir dukhe":"headache","sir dukh":"headache","chakkar aave":"dizziness","pet dukhe":"abdominal pain","pet dukh":"abdominal pain","pet saaf koni":"constipation","pet saaf nahi":"constipation",
  "ulti":"vomiting","ok":"vomiting","ji michlawe":"nausea","ji machlawe":"nausea","dast":"diarrhoea","julaab":"diarrhoea",
  "peshab me jalan":"urinary burning","pesab me jalan":"urinary burning","kamar me peer":"back pain","kamar me peed":"back pain","jod dukhe":"joint pain",
  "badan dukhe":"body ache","sara badan dukhe":"body ache","saans foole":"breathlessness","saans chadhe":"breathlessness","dam ghute":"breathlessness",
  "chhati me dard":"chest pain","sine me dard":"chest pain","khujli":"itching","kharish":"itching","daane":"rash","kaan dukhe":"ear pain","aankh dukhe":"eye pain","aankh laal":"red eye"
};
function expandMarwariClinicalText(value){
  let s=(value||"").toLowerCase();
  const aliases={...MARWARI_CLINICAL_ALIASES,...MARWARI_LATIN_ALIASES};
  Object.entries(aliases).sort((a,b)=>b[0].length-a[0].length).forEach(([k,v])=>{if(s.includes(k))s+=" "+v});
  return s;
}
function opdText(d){return expandMarwariClinicalText([d.complaint,d.history,d.exam,d.redFlags].join(" "))}
function medicineRelevance(m,d){
  const t=opdText(d), mt=shelfText(m);
  let score=0, reasons=[];
  OPD_SHELVES.forEach(s=>{const patientMatch=s.keys.some(k=>t.includes(k));const medMatch=s.keys.some(k=>mt.includes(k));if(patientMatch&&medMatch){score+=3;reasons.push(s.label)}});
  if(t && m.use && m.use.toLowerCase().split(/[,.;:]/).some(x=>x.trim().length>3&&t.includes(x.trim())))score+=2;
  if(t.includes("fever")&&mt.includes("fever"))score+=4;
  if((t.includes("cough")||t.includes("cold"))&&(mt.includes("cough")||mt.includes("cold")||mt.includes("respir")))score+=4;
  if((t.includes("gas")||t.includes("acidity"))&&(mt.includes("gas")||mt.includes("acid")||mt.includes("gastric")))score+=4;
  if((t.includes("vomit")||t.includes("nausea"))&&(mt.includes("vomit")||mt.includes("nausea")||mt.includes("antiemetic")))score+=4;
  if((t.includes("pain")||t.includes("headache"))&&(mt.includes("pain")||mt.includes("analges")||mt.includes("headache")))score+=3;
  return {score,reasons:[...new Set(reasons)]};
}
function ageWarnings(m,d){
  const t=opdText(d), out=[];
  if(Number(d.age)<18 && /antibiotic|prescription|ssri|thiocolch|nimesulide|fluoroquinolone|ibuprofen|aceclofenac|etoricoxib/.test((m.generic+" "+m.notes).toLowerCase()))out.push("Paediatric use: verify age/weight and product-specific suitability before use.");
  if(/pregnan/.test(t) && /nsaid|aceclofenac|ibuprofen|nimesulide|etoricoxib/.test((m.generic+" "+m.notes).toLowerCase()))out.push("Pregnancy context: review medicine-specific pregnancy safety before use.");
  return out;
}
function buildAssessment(d){
  const t=opdText(d);
  const urgentTerms=["severe breathlessness","respiratory distress","chest pain","unconscious","altered sensorium","shock","severe bleeding","seizure","cyanosis","anaphylaxis"];
  const urgent=urgentTerms.some(x=>t.includes(x));
  const matches=inventory.map(m=>({...m,_match:medicineRelevance(m,d)})).filter(m=>m._match.score>0).sort((a,b)=>b._match.score-a._match.score||a.name.localeCompare(b.name));
  const oral=matches.filter(m=>["Tablet/Capsule","Syrup/Drops","Cream/Gel/Ointment","Syrup/Suspension","Gel/Cream","Medical Supply"].includes(m.category));
  const injectable=matches.filter(m=>["Injection","IV Fluid","Respule"].includes(m.category));
  const checks=["Confirm allergy history and current medicines before prescribing.","Check age/weight, pregnancy status when relevant, renal/hepatic status and contraindications.","Record vitals and examination findings for every symptomatic patient.","Use only medicines from the verified clinic inventory.","Dose and route must be confirmed against the clinic protocol / product information before administration."];
  if(Number(d.age)<18)checks.unshift("Paediatric case: confirm weight and use a verified age/weight-specific reference before dosing.");
  if(d.redFlags.trim())checks.unshift("Reported red flags: "+d.redFlags.trim());
  if(urgent)checks.unshift("Urgent red flag detected: this may need urgent referral / further investigation. Do not delay emergency care for this tool.");
  const possible=d.complaint?"Possible clinical considerations based on the entered complaint/history: "+d.complaint+". Correlate with history, examination and investigations before assigning a diagnosis.":"Insufficient information for a meaningful clinical consideration.";
  const protocolMatches=(clinicProtocols||[]).filter(p=>[p.title,p.category,p.summary].join(" ").toLowerCase().split(/[,/ ]+/).filter(x=>x.length>3).some(k=>t.includes(k))).slice(0,3);
  return {urgent,possible,protocolMatches,matches,oral,injectable,checks,summary:["Age: "+(d.age||"Not recorded"),"Sex: "+(d.sex||"Not recorded"),"Chief complaint: "+(d.complaint||"Not recorded"),"Symptoms/history: "+(d.history||"Not recorded"),"Vitals/examination: "+(d.exam||"Not recorded"),"Red flags: "+(d.redFlags||"None recorded")].join("\n")};
}

function normalizeRxText(v){return String(v||"").toLowerCase().replace(/[^a-z0-9+.#%/ -]/g," ")}
function inventoryCandidateMatch(m,c){
  const hay=normalizeRxText([m.name,m.generic,m.use,m.notes].join(" "));
  const terms=(c.match||[]).map(normalizeRxText);
  return terms.some(term=>term && hay.includes(term));
}
function findProtocolForCase(d){
  const t=opdText(d);
  let best=null,bestScore=0;
  (clinicRxProtocols||[]).forEach(p=>{
    const score=(p.keywords||[]).reduce((n,k)=>n+(t.includes(String(k).toLowerCase())?1:0),0);
    if(score>bestScore){best=p;bestScore=score}
  });
  return bestScore>0?best:null;
}
function buildInventoryPrescription(d){
  const p=findProtocolForCase(d);
  if(!p)return {protocol:null,items:[],notes:["No clinic-reference pathway matched confidently."]};
  const items=[];
  (p.medicines||[]).forEach(rx=>{
    const m=inventory.find(x=>(Number(x.stock)||0)>0&&!["expired"].includes(expiryStatus(x))&&inventoryCandidateMatch(x,rx));
    if(m)items.push({...m,rxPhase:rx.phase||prescriptionPhase(m),rxDose:rx.dose||m.dose||"",rxFreq:rx.frequency||"",rxDuration:rx.duration||"",rxInstruction:rx.instruction||"",rxSource:p.title});
  });
  const missing=(p.medicines||[]).filter(rx=>!items.some(x=>inventoryCandidateMatch(x,rx))).map(x=>x.label);
  const notes=[];
  if(missing.length)notes.push("Reference pathway medicines not currently available in recorded stock: "+missing.join(", ")+". No substitute medicine is auto-invented.");
  if(p.note)notes.push(p.note);
  return {protocol:p,items,notes};
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
  $("medicineMatchInfo").innerHTML=a.matches.length?'<span>Only medicines recorded in the current clinic inventory are shown.</span> <span>Auto-draft uses the stored clinic case reference when a stock match exists.</span>':"<span>No inventory medicine was matched confidently to the entered complaint.</span>";
  $("phase1").innerHTML=a.oral.length?a.oral.map(medCard).join(""):'<div class="empty-list">No relevant verified oral/topical medicines matched this case.</div>';
  $("phase2").innerHTML=a.injectable.length?a.injectable.map(medCard).join(""):'<div class="empty-list">No relevant verified injections/IV fluids/respules matched this case.</div>';
  $("checks").innerHTML=a.checks.map(x=>"<li>"+esc(x)+"</li>").join("");
  $("summary").textContent=a.summary;
  if(a.rx?.items?.length){
    selectedPrescriptions=a.rx.items.map(x=>({...x}));
  }else if(recordHistory){
    selectedPrescriptions=[];
  }
  renderPrescription();
}
function runLiveAssessment(){
  const name=$("patientName")?.value.trim(), age=$("age")?.value, complaint=$("complaint")?.value.trim();
  if(!name||!age||!complaint)return;
  currentCaseData={patientName:name,age,sex:$("sex").value,mobile:$("mobile").value.trim(),village:$("village").value.trim(),complaint,history:$("history").value.trim(),bp:$("bp").value.trim(),bloodSugar:$("bloodSugar").value.trim(),pulse:$("pulse").value,spo2:$("spo2").value,temperature:$("temperature").value,exam:$("exam").value.trim(),redFlags:$("redFlags").value.trim(),followupDate:$("followupDate").value};
  const a=buildAssessment(currentCaseData);
  renderAssessmentView(a,currentCaseData,false);
}
function duplicateSafetyWarnings(matches){
  const text=matches.map(m=>(m.generic+" "+m.use+" "+m.notes).toLowerCase()).join(" ");
  const warnings=[];
  const para=matches.filter(m=>/paracetamol/.test((m.generic+" "+m.notes).toLowerCase()));
  const nsaid=matches.filter(m=>/aceclofenac|ibuprofen|nimesulide|etoricoxib|mefenamic|diclofenac|naproxen/.test((m.generic+" "+m.notes).toLowerCase()));
  const abx=matches.filter(m=>/antibiotic|ciprofloxacin|cefixime|cefpodoxime|azithromycin|amoxicillin|ofloxacin|metronidazole|norfloxacin/.test((m.generic+" "+m.notes+" "+m.use).toLowerCase()));
  if(para.length>1)warnings.push("Multiple paracetamol-containing medicines matched. Check total daily paracetamol exposure and avoid duplicate combination products.");
  if(nsaid.length>1)warnings.push("Multiple NSAID/anti-inflammatory medicines matched. Avoid duplicate NSAID therapy unless specifically justified.");
  if(abx.length>1)warnings.push("Multiple antimicrobial medicines matched. Do not combine antibiotics routinely; confirm indication, site, allergy, renal/hepatic factors and antimicrobial appropriateness.");
  if(text.includes("nimesulide"))warnings.push("Nimesulide-containing products require short-term, indication-specific use and liver-risk review.");
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
function renderPrescription(){
  const list=$("selectedPrescriptionList"), warnEl=$("prescriptionWarnings");
  if(!list)return;
  list.innerHTML=selectedPrescriptions.length?selectedPrescriptions.map((m,i)=>{
    const phase=prescriptionPhase(m);
    const defaultDuration=phase==="2"&&!m.rxDuration?"2–3 days":"";
    return '<div class="rx-row"><div><strong>'+esc(m.name)+'</strong><small>'+esc(m.generic||"")+'</small></div><div class="rx-fields"><select data-rx-phase="'+i+'"><option value="1" '+(phase==="1"?"selected":"")+'>Phase 1 — Regular medicines</option><option value="2" '+(phase==="2"?"selected":"")+'>Phase 2 — Injection + short-course</option></select><input data-rx-dose="'+i+'" placeholder="Dose / strength" value="'+esc(m.rxDose||"")+'"><select data-rx-route="'+i+'"><option value="">Route</option><option '+(m.rxRoute==="IM"?"selected":"")+'>IM</option><option '+(m.rxRoute==="IV"?"selected":"")+'>IV</option><option '+(m.rxRoute==="SC"?"selected":"")+'>SC</option><option '+(m.rxRoute==="Oral"?"selected":"")+'>Oral</option><option '+(m.rxRoute==="Topical"?"selected":"")+'>Topical</option></select><input data-rx-freq="'+i+'" placeholder="Frequency" value="'+esc(m.rxFreq||"")+'"><input data-rx-duration="'+i+'" placeholder="'+(phase==="2"?"2–3 days / as indicated":"Duration")+'" value="'+esc(m.rxDuration||defaultDuration)+'"><input data-rx-instruction="'+i+'" placeholder="Instructions" value="'+esc(m.rxInstruction||"")+'"><input data-rx-compat="'+i+'" placeholder="IV/Drip compatibility — verify before mixing" value="'+esc(m.rxCompat||"")+'"><button type="button" class="btn danger-outline remove-rx" data-rx-remove="'+i+'">Remove</button></div></div>';
  }).join(""):'<div class="empty-list">Assessment se medicine par “Add to prescription” click karein. Phase 1 regular medicines ke liye hai; Phase 2 injection/IV ke saath 2–3 din ka short-course medicine bhi rakh sakte hain.</div>';
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
function buildAssessment(d){
  const t=opdText(d);
  const urgentTerms=["severe breathlessness","respiratory distress","chest pain","unconscious","altered sensorium","shock","severe bleeding","seizure","cyanosis","anaphylaxis"];
  const urgent=urgentTerms.some(x=>t.includes(x));
  const matches=inventory.map(m=>({...m,_match:medicineRelevance(m,d)})).filter(m=>m._match.score>0).sort((a,b)=>b._match.score-a._match.score||a.name.localeCompare(b.name));
  const oral=matches.filter(m=>["Tablet/Capsule","Syrup/Drops","Cream/Gel/Ointment","Syrup/Suspension","Gel/Cream","Medical Supply"].includes(m.category));
  const injectable=matches.filter(m=>["Injection","IV Fluid","Respule"].includes(m.category));
  const checks=["Confirm allergy history and current medicines before prescribing.","Check age/weight, pregnancy status when relevant, renal/hepatic status and contraindications.","Record the available vital signs and examination findings.","Use only medicines from the verified clinic inventory.","Dose and route must be confirmed against the clinic protocol / product information before administration."];
  if(Number(d.age)<18)checks.unshift("Paediatric case: confirm weight and use a verified age/weight-specific reference before dosing.");
  if(d.redFlags.trim())checks.unshift("Reported red flags: "+d.redFlags.trim());
  if(urgent)checks.unshift("Urgent red flag detected: this may need urgent referral / further investigation. Do not delay emergency care for this tool.");
  const safety=duplicateSafetyWarnings(matches);
  safety.forEach(x=>checks.unshift(x));
  const possible=d.complaint?"Possible clinical considerations based on the entered complaint/history: "+d.complaint+". Correlate with history, examination and investigations before assigning a diagnosis.":"Insufficient information for a meaningful clinical consideration.";
  const protocolMatches=(clinicProtocols||[]).filter(p=>[p.title,p.category,p.summary].join(" ").toLowerCase().split(/[,/ ]+/).filter(x=>x.length>3).some(k=>t.includes(k))).slice(0,3);
  return {urgent,possible,protocolMatches,matches,oral,injectable,checks,safety,summary:["Patient: "+(d.patientName||"Not recorded"),"Age: "+(d.age||"Not recorded"),"Sex: "+(d.sex||"Not recorded"),"Mobile: "+(d.mobile||"Not recorded"),"Village: "+(d.village||"Not recorded"),"Chief complaint: "+(d.complaint||"Not recorded"),"Symptoms/history: "+(d.history||"Not recorded"),"BP: "+(d.bp||"Not recorded"),"Blood sugar: "+(d.bloodSugar||"Not recorded"),"Pulse: "+(d.pulse||"Not recorded"),"SpO₂: "+(d.spo2||"Not recorded"),"Temperature: "+(d.temperature||"Not recorded"),"Examination: "+(d.exam||"Not recorded"),"Red flags: "+(d.redFlags||"None recorded"),"Follow-up: "+(d.followupDate||"Not scheduled")].join("\n")};
}

$("caseForm").addEventListener("submit",e=>{
  e.preventDefault();
  currentCaseData={patientName:$("patientName").value.trim(),age:$("age").value,sex:$("sex").value,mobile:$("mobile").value.trim(),village:$("village").value.trim(),complaint:$("complaint").value.trim(),history:$("history").value.trim(),bp:$("bp").value.trim(),bloodSugar:$("bloodSugar").value.trim(),pulse:$("pulse").value,spo2:$("spo2").value,temperature:$("temperature").value,exam:$("exam").value.trim(),redFlags:$("redFlags").value.trim(),followupDate:$("followupDate").value};
  const a=buildAssessment(currentCaseData);
  $("emptyResult").classList.add("hidden");$("result").classList.remove("hidden");
  $("resultState").textContent=a.urgent?"Referral review":"Generated";
  $("triageStatus").className="status-tag "+(a.urgent?"expired":"ok");$("triageStatus").textContent=a.urgent?"URGENT REVIEW":"ROUTINE REVIEW";
  $("referralBox").innerHTML=a.urgent?'<div class="referral"><strong>Urgent review:</strong> This may need urgent referral / further investigation. Do not delay emergency care for this tool.</div>':"";
  $("clinicalSnapshot").innerHTML='<div><span>Patient</span><strong>'+esc(currentCaseData.patientName||"—")+'</strong></div><div><span>Age / Sex</span><strong>'+esc(currentCaseData.age||"—")+" / "+esc(currentCaseData.sex||"—")+'</strong></div><div><span>Vitals</span><strong>BP '+esc(currentCaseData.bp||"—")+' • Sugar '+esc(currentCaseData.bloodSugar||"—")+' • Pulse '+esc(currentCaseData.pulse||"—")+' • SpO₂ '+esc(currentCaseData.spo2||"—")+' • Temp '+esc(currentCaseData.temperature||"—")+'</strong></div><div><span>Complaint</span><strong>'+esc(currentCaseData.complaint||"—")+'</strong></div>';
  $("possibleDiagnosis").innerHTML=esc(a.possible)+(a.protocolMatches?.length?'<div class="protocol-inline"><b>Relevant clinic reference:</b> '+a.protocolMatches.map(p=>esc(p.title)).join(" • ")+'</div>':"");
  $("medicineMatchCount").textContent=a.matches.length+" matched";
  $("medicineMatchInfo").innerHTML=a.matches.length?'<span>Matched from the current clinic inventory using complaint/history keywords and recorded medicine uses.</span> <span>Review each medicine clinically before use.</span>':"<span>No inventory medicine was matched confidently to the entered complaint.</span>";
  $("phase1").innerHTML=a.oral.length?a.oral.map(medCard).join(""):'<div class="empty-list">No relevant verified oral/topical medicines matched this case.</div>';
  $("phase2").innerHTML=a.injectable.length?a.injectable.map(medCard).join(""):'<div class="empty-list">No relevant verified injections/IV fluids/respules matched this case.</div>';
  $("checks").innerHTML=a.checks.map(c=>"<li>"+esc(c)+"</li>").join("");
  $("summary").textContent=a.summary;
  selectedPrescriptions=[];renderPrescription();
  const h=loadHistory();h.unshift({id:crypto.randomUUID(),createdAt:new Date().toLocaleString(),dateKey:new Date().toISOString().slice(0,10),followupDate:currentCaseData.followupDate,patientName:currentCaseData.patientName,mobile:currentCaseData.mobile,village:currentCaseData.village,complaint:currentCaseData.complaint,age:currentCaseData.age,sex:currentCaseData.sex,data:{...currentCaseData},summary:a.summary});saveHistory(h.slice(0,100));
  logAudit("OPD case recorded",(currentCaseData.patientName||"Unnamed patient")+" • "+(currentCaseData.complaint||"Unnamed complaint"));
  renderHistory();renderDashboard();
});

$("printSummary").addEventListener("click",()=>{const text=$("summary")?.textContent||"";const w=window.open("","_blank");if(!w)return;w.document.write("<pre style=\"font:14px Arial;padding:30px;white-space:pre-wrap\">"+esc(text)+"</pre>");w.document.close();w.print()});
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
$("ivMedicineSelect")?.addEventListener("change",()=>{$("ivCompatibilityResult").innerHTML='<div class="empty-list">Select the diluent, then press Check compatibility.</div>'});
$("ivDiluentSelect")?.addEventListener("change",()=>{$("ivCompatibilityResult").innerHTML='<div class="empty-list">Press Check compatibility to verify this pair.</div>'});
$("checkIvCompatibility")?.addEventListener("click",checkIvCompatibility);
$("pediatricForm")?.addEventListener("submit",e=>{e.preventDefault();calculatePediatric();});
$("backupAll")?.addEventListener("click",backupAll);
$("restoreBackup")?.addEventListener("change",e=>{if(e.target.files[0])restoreBackupFile(e.target.files[0])});
$("clearAudit")?.addEventListener("click",()=>{if(confirm("Clear local audit log?")){localStorage.removeItem(AUDIT_KEY);renderAudit()}});
$("exportReport")?.addEventListener("click",()=>downloadJson("clinic-report.json",{generatedAt:new Date().toISOString(),inventory,nearExpiry:inventory.filter(m=>expiryStatus(m)==="near"),expired:inventory.filter(m=>expiryStatus(m)==="expired"),lowStock:inventory.filter(m=>stockStatus(m)==="low"),cases:loadHistory()}));
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{if(b.dataset.tab==="protocols")renderProtocols();if(b.dataset.tab==="pediatric")renderPedMedicineOptions();if(b.dataset.tab==="reports")renderReports();if(b.dataset.tab==="dataCenter")renderAudit()}));
document.addEventListener("click",e=>{const b=e.target.closest(".medicine-item[data-med-id]");if(b)openMedicineModal(b.dataset.medId)});

refreshAll();renderReports();renderAudit();loadProtocols();alert("Backup restored successfully.");}catch(e){alert("Backup could not be restored. Please select a valid My Medical Assistant backup.");}};r.readAsText(file);
}


function buildAssessment(d){
  const t=opdText(d);
  const urgentTerms=["severe breathlessness","respiratory distress","chest pain","unconscious","altered sensorium","shock","severe bleeding","seizure","cyanosis","anaphylaxis"];
  const urgent=urgentTerms.some(x=>t.includes(x));
  const matches=inventory.map(m=>({...m,_match:medicineRelevance(m,d)})).filter(m=>m._match.score>0).sort((a,b)=>b._match.score-a._match.score||a.name.localeCompare(b.name));
  const oral=matches.filter(m=>["Tablet/Capsule","Syrup/Drops","Cream/Gel/Ointment","Syrup/Suspension","Gel/Cream","Medical Supply"].includes(m.category));
  const injectable=matches.filter(m=>["Injection","IV Fluid","Respule"].includes(m.category));
  const checks=["Confirm allergy history and current medicines before prescribing.","Check age/weight, pregnancy status when relevant, renal/hepatic status and contraindications.","Record the available vital signs and examination findings.","Use only medicines from the verified clinic inventory.","Dose and route must be confirmed against the clinic protocol / product information before administration."];
  if(Number(d.age)<18)checks.unshift("Paediatric case: confirm weight and use a verified age/weight-specific reference before dosing.");
  if(d.redFlags.trim())checks.unshift("Reported red flags: "+d.redFlags.trim());
  if(urgent)checks.unshift("Urgent red flag detected: this may need urgent referral / further investigation. Do not delay emergency care for this tool.");
  const safety=duplicateSafetyWarnings(matches); safety.forEach(x=>checks.unshift(x));
  const rx=buildInventoryPrescription(d);
  const possible=d.complaint?"Possible clinical considerations based on the entered complaint/history: "+d.complaint+". Correlate with history, examination and investigations before assigning a diagnosis.":"Insufficient information for a meaningful clinical consideration.";
  const protocolMatches=(clinicProtocols||[]).filter(p=>[p.title,p.category,p.summary].join(" ").toLowerCase().split(/[,/ ]+/).filter(x=>x.length>3).some(k=>t.includes(k))).slice(0,3);
  return {urgent,possible,protocolMatches,matches,oral,injectable,checks,safety,rx,summary:["Patient: "+(d.patientName||"Not recorded"),"Age: "+(d.age||"Not recorded"),"Sex: "+(d.sex||"Not recorded"),"Mobile: "+(d.mobile||"Not recorded"),"Village: "+(d.village||"Not recorded"),"Chief complaint: "+(d.complaint||"Not recorded"),"Symptoms/history: "+(d.history||"Not recorded"),"BP: "+(d.bp||"Not recorded"),"Blood sugar: "+(d.bloodSugar||"Not recorded"),"Pulse: "+(d.pulse||"Not recorded"),"SpO₂: "+(d.spo2||"Not recorded"),"Temperature: "+(d.temperature||"Not recorded"),"Examination: "+(d.exam||"Not recorded"),"Red flags: "+(d.redFlags||"None recorded"),"Follow-up: "+(d.followupDate||"Not scheduled")].join("\n")};
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
refreshAll();renderReports();renderAudit();loadProtocols();loadClinicRxProtocols();loadIvCompatibility();setupLiveOpd();
