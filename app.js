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
  $("statTotal").textContent=inventory.length;
  $("statLow").textContent=reorder.filter(x=>stockStatus(x)==="low").length;
  $("statOut").textContent=reorder.filter(x=>stockStatus(x)==="out").length;
  $("statExpiry").textContent=expiry.length;
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

$("expirySettings").addEventListener("click",()=>{const n=prompt("Near-expiry alert days:",settings.expiryDays);if(n!==null&&Number(n)>0){settings.expiryDays=Number(n);saveSettings();refreshAll()}});
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
function opdText(d){return [d.complaint,d.history,d.exam,d.redFlags].join(" ").toLowerCase()}
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
  return {urgent,possible,matches,oral,injectable,checks,summary:["Age: "+(d.age||"Not recorded"),"Sex: "+(d.sex||"Not recorded"),"Chief complaint: "+(d.complaint||"Not recorded"),"Symptoms/history: "+(d.history||"Not recorded"),"Vitals/examination: "+(d.exam||"Not recorded"),"Red flags: "+(d.redFlags||"None recorded")].join("\n")};
}
function medCard(m){
  const dose=m.dose||Object.entries(DOSE_GUIDE).find(([k])=>m.name.toLowerCase().includes(k.toLowerCase())||k.toLowerCase().includes(m.name.toLowerCase()))?.[1]||"Dose not specified in the provided clinic reference files.";
  const stock=Number(m.stock)||0, exp=expiryStatus(m);
  const warn=ageWarnings(m,currentCaseData||{});
  return '<div class="medicine-item"><div class="medicine-item-top"><div><strong>'+esc(m.name)+'</strong><small>'+esc(m.generic||"")+'</small></div><span class="tablet-availability '+(stock>0?"available":"unavailable")+'">'+stock+' available</span></div><small>'+esc(m.category||"")+(m.form?" • "+esc(m.form):"")+'</small><div class="medicine-dose"><b>Reference:</b> '+esc(dose)+'</div><div class="medicine-use"><b>Use:</b> '+esc(m.use||m.notes||"Not specified")+'</div>'+(m.expiry?'<div class="medicine-meta"><span>Expiry: '+esc(m.expiry)+'</span><span class="'+(exp==="expired"?"expiry-bad":"")+'">'+(exp==="expired"?"EXPIRED":expiryTimeLabel(m))+'</span></div>':"")+(warn.length?'<div class="medicine-warning">'+warn.map(x=>esc(x)).join(" ")+'</div>':"")+'</div>';
}
let currentCaseData=null;

$("caseForm").addEventListener("submit",e=>{
  e.preventDefault();
  currentCaseData={age:$("age").value,sex:$("sex").value,complaint:$("complaint").value.trim(),history:$("history").value.trim(),exam:$("exam").value.trim(),redFlags:$("redFlags").value.trim()};
  const d=currentCaseData,a=buildAssessment(d);
  $("emptyResult").classList.add("hidden");$("result").classList.remove("hidden");
  $("resultState").textContent=a.urgent?"Referral review":"Generated";
  $("triageStatus").className="status-tag "+(a.urgent?"expired":"ok");$("triageStatus").textContent=a.urgent?"URGENT REVIEW":"ROUTINE REVIEW";
  $("referralBox").innerHTML=a.urgent?'<div class="referral"><strong>Urgent review:</strong> This may need urgent referral / further investigation. Do not delay emergency care for this tool.</div>':"";
  $("clinicalSnapshot").innerHTML='<div><span>Age</span><strong>'+esc(d.age||"—")+'</strong></div><div><span>Sex</span><strong>'+esc(d.sex||"—")+'</strong></div><div><span>Complaint</span><strong>'+esc(d.complaint||"—")+'</strong></div><div><span>Vitals / Exam</span><strong>'+esc(d.exam||"Not recorded")+'</strong></div>';
  $("possibleDiagnosis").textContent=a.possible;
  $("medicineMatchCount").textContent=a.matches.length+" matched";
  $("medicineMatchInfo").innerHTML=a.matches.length?'<span>Matched from the current clinic inventory using complaint/history keywords and recorded medicine uses.</span> <span>Review each medicine clinically before use.</span>':'<span>No inventory medicine was matched confidently to the entered complaint.</span>';
  $("phase1").innerHTML=a.oral.length?a.oral.map(medCard).join(""):'<div class="empty-list">No relevant verified oral/topical medicines matched this case.</div>';
  $("phase2").innerHTML=a.injectable.length?a.injectable.map(medCard).join(""):'<div class="empty-list">No relevant verified injections/IV fluids/respules matched this case.</div>';
  $("checks").innerHTML=a.checks.map(c=>"<li>"+esc(c)+"</li>").join("");$("summary").textContent=a.summary;
  const h=loadHistory();h.unshift({id:crypto.randomUUID(),createdAt:new Date().toLocaleString(),complaint:d.complaint,age:d.age,sex:d.sex,summary:a.summary});saveHistory(h.slice(0,30));
});
$("printSummary").addEventListener("click",()=>{const text=$("summary")?.textContent||"";const w=window.open("","_blank");if(!w)return;w.document.write("<pre style=\"font:14px Arial;padding:30px;white-space:pre-wrap\">"+esc(text)+"</pre>");w.document.close();w.print()});
$("clearCase").addEventListener("click",()=>{$("caseForm").reset();$("emptyResult").classList.remove("hidden");$("result").classList.add("hidden");$("resultState").textContent="Waiting"});

function renderHistory(){const h=loadHistory();$("historyList").innerHTML=h.length?h.map(x=>'<div class="history-item"><strong>'+esc(x.complaint||"Unnamed complaint")+'</strong><small>'+esc(x.createdAt)+" • Age: "+esc(x.age||"—")+" • Sex: "+esc(x.sex||"—")+"</small></div>").join(""):'<div class="empty-list">No cases stored in this browser yet.</div>'}
$("clearHistory").addEventListener("click",()=>{if(confirm("Clear locally stored case history?")){localStorage.removeItem(HISTORY_KEY);renderHistory()}});

refreshAll();
