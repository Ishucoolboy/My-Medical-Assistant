const INVENTORY_KEY="mma_inventory_v2";
const SETTINGS_KEY="mma_settings_v1";
const HISTORY_KEY="mma_history_v1";
const starterInventory=[
  {id:"seed-prevent-n",name:"Prevent-N",category:"Tablet/Capsule",form:"Tablet",batch:"",expiry:"",stock:0,minStock:0,notes:"Verified clinic inventory item."},
  {id:"seed-naproxen-250",name:"Naproxen 250 mg",category:"Tablet/Capsule",form:"Tablet",batch:"",expiry:"",stock:0,minStock:0,notes:"Verified clinic inventory item."},
  {id:"seed-naproxen-500",name:"Naproxen 500 mg",category:"Tablet/Capsule",form:"Tablet",batch:"",expiry:"",stock:0,minStock:0,notes:"Verified clinic inventory item."}
];

const $=id=>document.getElementById(id);
function loadInventory(){try{const s=JSON.parse(localStorage.getItem(INVENTORY_KEY));return Array.isArray(s)?s:starterInventory}catch{return starterInventory}}
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
function refreshAll(){renderInventory();renderDashboard();renderRequired();renderExpiry()}

document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(x=>x.classList.remove("active"));
  b.classList.add("active"); $(b.dataset.tab).classList.add("active");
  if(b.dataset.tab==="dashboard")renderDashboard();
  if(b.dataset.tab==="inventory")renderInventory();
  if(b.dataset.tab==="required")renderRequired();
  if(b.dataset.tab==="expiry")renderExpiry();
  if(b.dataset.tab==="history")renderHistory();
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

$("addMedicine").addEventListener("click",()=>{
  const name=prompt("Verified medicine name:");if(!name?.trim())return;
  const category=prompt("Category: Tablet/Capsule, Syrup/Drops, Cream/Gel/Ointment, Respule, Injection, IV Fluid, Other")||"Other";
  const form=prompt("Form / strength (optional):")||"";
  const batch=prompt("Batch number (optional):")||"";
  const expiry=prompt("Expiry date YYYY-MM-DD (optional):")||"";
  const stockRaw=prompt("Current stock quantity:")||"0";
  const minRaw=prompt("Minimum stock / reorder level:")||"0";
  const notes=prompt("Verified clinic note / indication (optional):")||"";
  const stock=Number(stockRaw),minStock=Number(minRaw);
  inventory.push({id:crypto.randomUUID(),name:name.trim(),category:category.trim(),form:form.trim(),batch:batch.trim(),expiry:expiry.trim(),stock:Number.isFinite(stock)?stock:0,minStock:Number.isFinite(minStock)?minStock:0,notes:notes.trim()});
  saveInventory(inventory);refreshAll();
});
$("resetInventory").addEventListener("click",()=>{if(confirm("Reset local inventory changes?")){inventory=starterInventory.slice();saveInventory(inventory);refreshAll()}});
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
function medCard(m){return '<div class="medicine-item"><strong>'+esc(m.name)+'</strong><small>'+esc(m.category||"")+(m.form?" • "+esc(m.form):"")+(m.notes?" • "+esc(m.notes):"")+'</small></div>'}

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