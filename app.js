const INVENTORY_KEY="mma_inventory_v2";
const SETTINGS_KEY="mma_settings_v1";
const HISTORY_KEY="mma_history_v1";
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
function refreshAll(){renderDashboard();renderRequired();renderExpiry();renderStoreTablets()}

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
$("storeTabletSearch").addEventListener("input",renderStoreTablets);$("storeTabletStock").addEventListener("change",renderStoreTablets);

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
