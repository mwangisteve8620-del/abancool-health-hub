/**
 * Deterministic demo dataset for ABANCOOL HOSPITAL.
 * No Math.random / crypto — a seeded PRNG keeps SSR and client identical.
 */

import {
  DEPARTMENTS,
  DIAGNOSES,
  DRUGS,
  LAB_PANELS,
  LAB_TESTS,
  RADIOLOGY_STUDIES,
} from "./catalog";
import {
  admissionNumber,
  appointmentNumber,
  authorizationNumber,
  caseNumber,
  claimNumber,
  employeeNumber,
  invoiceNumber,
  labNumber,
  patientNumber,
  poNumber,
  prescriptionNumber,
  queueNumber,
  radiologyNumber,
  receiptNumber,
} from "./ids";
import type {
  Admission,
  Appointment,
  AppointmentStatus,
  AuditLog,
  Authorization,
  Bed,
  Claim,
  ClaimStatus,
  Department,
  Doctor,
  Employee,
  EmergencyCase,
  Encounter,
  HimsState,
  InventoryItem,
  Invoice,
  LabOrder,
  MaternityRecord,
  Notification,
  NursingNote,
  Patient,
  Payment,
  Prescription,
  PurchaseOrder,
  QueueTicket,
  RadiologyOrder,
  StockMovement,
  Supplier,
  Surgery,
  Vital,
  Ward,
  InsurancePolicy,
  InsuranceProvider,
} from "./types";

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST_M = ["John", "Peter", "James", "Brian", "Kevin", "Daniel", "Samuel", "Joseph", "Dennis", "Eric", "Collins", "Victor", "Felix", "Anthony", "Stephen"];
const FIRST_F = ["Mary", "Grace", "Faith", "Esther", "Joyce", "Nancy", "Lucy", "Alice", "Caroline", "Mercy", "Beatrice", "Sharon", "Winnie", "Purity", "Agnes"];
const LAST = ["Wanjiku", "Otieno", "Mwangi", "Achieng", "Kamau", "Kiptoo", "Njoroge", "Wafula", "Mutiso", "Chebet", "Omondi", "Njeri", "Kariuki", "Barasa", "Muthoni", "Odhiambo", "Kimani", "Wekesa", "Nyambura", "Maina"];
const COUNTIES = ["Nairobi", "Kiambu", "Machakos", "Kajiado", "Nakuru", "Kisumu", "Mombasa", "Uasin Gishu"];
const ESTATES = ["Ngong Road", "South B", "Kasarani", "Westlands", "Embakasi", "Ruiru", "Kilimani", "Langata", "Donholm", "Kikuyu"];
const BLOOD = ["O+", "A+", "B+", "AB+", "O-", "A-"];

export function todayISO(base = new Date()) {
  return base.toISOString().slice(0, 10);
}
function shiftDays(days: number, base = new Date()) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}
function isoAt(days: number, hour: number, minute = 0, base = new Date()) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

export function buildSeed(): HimsState {
  const rand = mulberry32(20260929);
  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)]!;
  const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min;

  // ---------- departments ----------
  const departments: Department[] = DEPARTMENTS.map((d, i) => ({ ...d, id: `dep_${i + 1}` }));
  const depBySlug = (slug: string) => departments.find((d) => d.slug === slug)!.id;

  // ---------- doctors ----------
  const doctorSpecs: {
    name: string; gender: "Male" | "Female"; specialty: string; dep: string; qual: string; exp: number; fee: number;
  }[] = [
    { name: "Dr. Amina Yusuf", gender: "Female", specialty: "Emergency Medicine", dep: "emergency-casualty", qual: "MBChB (UoN), MMed Emergency Medicine", exp: 12, fee: 3000 },
    { name: "Dr. Peter Njoroge", gender: "Male", specialty: "Emergency Medicine", dep: "emergency-casualty", qual: "MBChB (Moi), Dip. Trauma Care", exp: 8, fee: 2500 },
    { name: "Dr. Grace Wambui", gender: "Female", specialty: "Family Medicine", dep: "outpatient", qual: "MBChB (UoN), MMed Family Medicine", exp: 10, fee: 1500 },
    { name: "Dr. Samuel Kiptoo", gender: "Male", specialty: "Internal Medicine", dep: "general-medicine", qual: "MBChB, MMed Internal Medicine", exp: 15, fee: 3500 },
    { name: "Dr. Lucy Atieno", gender: "Female", specialty: "Diabetology", dep: "general-medicine", qual: "MBChB, MSc Diabetes Care", exp: 9, fee: 3500 },
    { name: "Dr. Brian Mutiso", gender: "Male", specialty: "General Surgery", dep: "general-surgery", qual: "MBChB, MMed Surgery, FCS (ECSA)", exp: 14, fee: 4000 },
    { name: "Dr. Caroline Njeri", gender: "Female", specialty: "Obstetrics & Gynaecology", dep: "obstetrics-gynecology", qual: "MBChB, MMed Obs/Gyn", exp: 13, fee: 4000 },
    { name: "Dr. Esther Mwikali", gender: "Female", specialty: "Obstetrics", dep: "maternity", qual: "MBChB, MMed Obs/Gyn", exp: 11, fee: 4000 },
    { name: "Dr. Daniel Omondi", gender: "Male", specialty: "Paediatrics", dep: "pediatrics", qual: "MBChB, MMed Paediatrics", exp: 12, fee: 3000 },
    { name: "Dr. Faith Chebet", gender: "Female", specialty: "Paediatrics", dep: "pediatrics", qual: "MBChB, MMed Paediatrics", exp: 7, fee: 3000 },
    { name: "Dr. Joseph Kariuki", gender: "Male", specialty: "Orthopaedic Surgery", dep: "orthopedics", qual: "MBChB, MMed Orthopaedics", exp: 16, fee: 4500 },
    { name: "Dr. Winnie Barasa", gender: "Female", specialty: "Dental Surgery", dep: "dental", qual: "BDS (UoN), MSc Restorative Dentistry", exp: 8, fee: 2000 },
    { name: "Dr. Victor Wekesa", gender: "Male", specialty: "ENT Surgery", dep: "ent", qual: "MBChB, MMed ENT", exp: 10, fee: 3800 },
    { name: "Dr. Sharon Mbithe", gender: "Female", specialty: "Ophthalmology", dep: "ophthalmology", qual: "MBChB, MMed Ophthalmology", exp: 9, fee: 3500 },
    { name: "Dr. Anthony Gitau", gender: "Male", specialty: "Cardiology", dep: "cardiology", qual: "MBChB, MMed Internal Medicine, Fellowship Cardiology", exp: 18, fee: 6000 },
    { name: "Dr. Mercy Wanjala", gender: "Female", specialty: "Neurology", dep: "neurology", qual: "MBChB, MMed Neurology", exp: 11, fee: 6000 },
    { name: "Dr. Collins Owuor", gender: "Male", specialty: "Dermatology", dep: "dermatology", qual: "MBChB, MMed Dermatology", exp: 7, fee: 3500 },
    { name: "Dr. Beatrice Nduta", gender: "Female", specialty: "Psychiatry", dep: "psychiatry", qual: "MBChB, MMed Psychiatry", exp: 12, fee: 4500 },
    { name: "Dr. Felix Ochieng", gender: "Male", specialty: "Radiology", dep: "radiology", qual: "MBChB, MMed Radiology", exp: 13, fee: 3000 },
    { name: "Dr. Purity Kilonzo", gender: "Female", specialty: "Nephrology", dep: "renal-dialysis", qual: "MBChB, MMed Internal Medicine, Fellowship Nephrology", exp: 10, fee: 5500 },
  ];

  const doctors: Doctor[] = doctorSpecs.map((d, i) => {
    const dep = departments.find((x) => x.slug === d.dep)!;
    return {
      id: `doc_${i + 1}`,
      name: d.name,
      title: "Consultant",
      gender: d.gender,
      specialty: d.specialty,
      department_id: dep.id,
      qualifications: d.qual,
      experience_years: d.exp,
      languages: i % 3 === 0 ? ["English", "Kiswahili", "French"] : ["English", "Kiswahili"],
      consultation_fee: d.fee,
      availability: i % 2 === 0 ? ["Mon", "Tue", "Wed", "Thu", "Fri"] : ["Mon", "Wed", "Fri", "Sat"],
      bio: `${d.name} is a ${d.specialty.toLowerCase()} specialist at Abancool Hospital with ${d.exp} years of clinical experience. ${d.name.split(" ")[1]} leads the ${dep.name.toLowerCase()} team and is known for careful, unhurried consultations and clear explanations to patients and families.`,
      services: dep.services.slice(0, 4),
      rating: Number((4.3 + rand() * 0.6).toFixed(1)),
      reviews: int(18, 240),
      location: `${dep.name} Clinic, ${["Ground", "1st", "2nd", "3rd"][i % 4]} Floor`,
      initials: d.name.replace("Dr. ", "").split(" ").map((p) => p[0]).join(""),
    };
  });

  // ---------- insurance ----------
  const providers: InsuranceProvider[] = [
    { id: "ins_1", name: "SHA (Social Health Authority)", code: "SHA", type: "Public", contact: "+254 20 272 0000", claim_turnaround_days: 30, active: true },
    { id: "ins_2", name: "AAR Insurance", code: "AAR", type: "Private", contact: "+254 20 289 5000", claim_turnaround_days: 21, active: true },
    { id: "ins_3", name: "Jubilee Health Insurance", code: "JUB", type: "Private", contact: "+254 20 328 1000", claim_turnaround_days: 21, active: true },
    { id: "ins_4", name: "Britam Health", code: "BRT", type: "Private", contact: "+254 20 283 3000", claim_turnaround_days: 25, active: true },
    { id: "ins_5", name: "Madison Health", code: "MAD", type: "Private", contact: "+254 20 272 1970", claim_turnaround_days: 28, active: true },
    { id: "ins_6", name: "CIC Insurance", code: "CIC", type: "Private", contact: "+254 20 282 3000", claim_turnaround_days: 30, active: true },
  ];

  // ---------- patients ----------
  const patients: Patient[] = [];
  const policies: InsurancePolicy[] = [];
  for (let i = 0; i < 50; i++) {
    const gender: "Male" | "Female" = rand() > 0.48 ? "Female" : "Male";
    const first = gender === "Female" ? pick(FIRST_F) : pick(FIRST_M);
    const last = pick(LAST);
    const year = int(1955, 2022);
    const id = `pat_${i + 1}`;
    const insured = rand() > 0.35;
    let policyId: string | undefined;
    if (insured) {
      const provider = pick(providers);
      const limit = pick([200000, 400000, 500000, 1000000, 1500000]);
      policyId = `pol_${i + 1}`;
      policies.push({
        id: policyId,
        patient_id: id,
        provider_id: provider.id,
        member_number: `${provider.code}-${100000 + i * 37}`,
        policy_number: `P/${provider.code}/${2024 + (i % 3)}/${1000 + i}`,
        principal_member: rand() > 0.6 ? `${first} ${last}` : `${pick(FIRST_M)} ${last}`,
        relationship: pick(["Principal", "Principal", "Spouse", "Child", "Dependant"]),
        scheme: pick(["Corporate Scheme", "Family Cover", "Individual Plan", "Civil Servants Scheme"]),
        annual_limit: limit,
        used_amount: Math.round(limit * rand() * 0.45),
        expiry: shiftDays(int(30, 400)),
        status: "Active",
      });
    }
    patients.push({
      id,
      patient_number: patientNumber(i + 1),
      first_name: first,
      last_name: last,
      dob: `${year}-${String(int(1, 12)).padStart(2, "0")}-${String(int(1, 28)).padStart(2, "0")}`,
      gender,
      phone: `+2547${int(10, 99)}${int(100000, 999999)}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.co.ke`,
      national_id: `${int(20000000, 39999999)}`,
      address: `${pick(ESTATES)}, House ${int(1, 90)}`,
      county: pick(COUNTIES),
      blood_group: pick(BLOOD),
      allergies: rand() > 0.75 ? [pick(["Penicillin", "Sulphur drugs", "Peanuts", "Latex", "Aspirin"])] : [],
      chronic_conditions: rand() > 0.7 ? [pick(["Hypertension", "Type 2 Diabetes", "Asthma", "Epilepsy"])] : [],
      next_of_kin: { name: `${pick(FIRST_M)} ${last}`, relationship: pick(["Spouse", "Parent", "Sibling", "Child"]), phone: `+2547${int(10, 99)}${int(100000, 999999)}` },
      payer: insured ? "Insurance" : "Self Pay",
      insurance_policy_id: policyId,
      status: "Active",
      registered_at: shiftDays(-int(20, 900)),
      last_visit: shiftDays(-int(0, 120)),
    });
  }

  // Featured demo patient — Mary Wanjiku (the guided journey).
  patients[0] = {
    ...patients[0]!,
    first_name: "Mary",
    last_name: "Wanjiku",
    gender: "Female",
    dob: "1991-04-17",
    phone: "+254712345678",
    email: "mary.wanjiku@example.co.ke",
    county: "Nairobi",
    address: "Ngong Road, House 24",
    payer: "Insurance",
    insurance_policy_id: "pol_1",
    allergies: ["Penicillin"],
    chronic_conditions: [],
  };
  if (!policies.find((p) => p.id === "pol_1")) {
    policies.unshift({
      id: "pol_1",
      patient_id: "pat_1",
      provider_id: "ins_2",
      member_number: "AAR-100024",
      policy_number: "P/AAR/2026/1001",
      principal_member: "Mary Wanjiku",
      relationship: "Principal",
      scheme: "Corporate Scheme",
      annual_limit: 500000,
      used_amount: 84000,
      expiry: shiftDays(210),
      status: "Active",
    });
  } else {
    const p = policies.find((x) => x.id === "pol_1")!;
    p.patient_id = "pat_1";
    p.provider_id = "ins_2";
    p.principal_member = "Mary Wanjiku";
    p.annual_limit = 500000;
    p.used_amount = 84000;
    p.status = "Active";
  }

  // ---------- appointments ----------
  const statuses: AppointmentStatus[] = ["Requested", "Confirmed", "Checked In", "In Consultation", "Completed", "Cancelled", "No Show"];
  const appointments: Appointment[] = [];
  for (let i = 0; i < 100; i++) {
    const doctor = pick(doctors);
    const patient = pick(patients);
    const offset = int(-25, 14);
    const status: AppointmentStatus =
      offset < 0 ? pick(["Completed", "Completed", "Completed", "Cancelled", "No Show"]) : offset === 0 ? pick(["Confirmed", "Checked In", "In Consultation", "Confirmed"]) : pick(["Requested", "Confirmed", "Confirmed"]);
    appointments.push({
      id: `apt_${i + 1}`,
      appointment_number: appointmentNumber(i + 1),
      patient_id: patient.id,
      doctor_id: doctor.id,
      department_id: doctor.department_id,
      service: pick(["General Consultation", "Specialist Consultation", "Review Visit", "Procedure", "Health Screening"]),
      date: shiftDays(offset),
      time: `${String(int(8, 16)).padStart(2, "0")}:${pick(["00", "15", "30", "45"])}`,
      reason: pick(["Follow-up consultation", "Persistent headache", "Fever and body aches", "Routine check-up", "Chest pain review", "Antenatal visit", "Back pain", "Skin rash"]),
      payer: patient.payer,
      status: statuses.includes(status) ? status : "Confirmed",
      created_at: isoAt(offset - int(1, 10), 9),
    });
  }

  // ---------- queue ----------
  const queue: QueueTicket[] = [];
  const todayAppointments = appointments.filter((a) => a.date === todayISO() && a.status === "Checked In");
  todayAppointments.slice(0, 6).forEach((a, i) => {
    queue.push({
      id: `q_${i + 1}`,
      number: queueNumber("OPD", i + 1),
      patient_id: a.patient_id,
      department_id: a.department_id,
      doctor_id: a.doctor_id,
      appointment_id: a.id,
      status: i === 0 ? "Called" : "Waiting",
      created_at: isoAt(0, 8, i * 7),
      ...(i === 0 ? { called_at: isoAt(0, 9) } : {}),
    });
  });

  // ---------- encounters, vitals ----------
  const encounters: Encounter[] = [];
  const vitals: Vital[] = [];
  const completed = appointments.filter((a) => a.status === "Completed").slice(0, 45);
  completed.forEach((a, i) => {
    const dx = pick(DIAGNOSES);
    encounters.push({
      id: `enc_${i + 1}`,
      patient_id: a.patient_id,
      doctor_id: a.doctor_id,
      department_id: a.department_id,
      appointment_id: a.id,
      date: a.date,
      chief_complaint: a.reason,
      hpi: "Symptoms began a few days prior to presentation, gradually worsening. No known contact with similar illness. Patient reports fair appetite and adequate fluid intake.",
      past_medical_history: "No previous admissions. No known chronic illness unless documented.",
      family_history: "No significant family history reported.",
      social_history: "Non-smoker. Occasional alcohol use. Lives with family.",
      examination: "Alert and oriented. Chest clear on auscultation. Abdomen soft, non-tender. No peripheral oedema.",
      assessment: `Clinical picture consistent with ${dx.label.toLowerCase()}.`,
      diagnoses: [{ code: dx.code, label: dx.label, type: "Primary" }],
      treatment_plan: "Supportive management, prescribed medication as charted, review in one week or earlier if symptoms worsen.",
      follow_up: shiftDays(int(5, 21)),
      status: "Completed",
    });
    vitals.push({
      id: `vit_${i + 1}`,
      patient_id: a.patient_id,
      encounter_id: `enc_${i + 1}`,
      recorded_at: `${a.date}T08:${String(int(10, 59)).padStart(2, "0")}:00.000Z`,
      recorded_by: "Nurse Joyce Mueni",
      temperature: Number((36.2 + rand() * 2).toFixed(1)),
      systolic: int(105, 155),
      diastolic: int(65, 95),
      pulse: int(58, 104),
      respiratory_rate: int(14, 22),
      spo2: int(94, 100),
      weight: Number((48 + rand() * 45).toFixed(1)),
      height: Number((1.5 + rand() * 0.35).toFixed(2)),
      bmi: 0,
      pain_score: int(0, 7),
    });
  });
  vitals.forEach((v) => {
    v.bmi = Number((v.weight / (v.height * v.height)).toFixed(1));
  });

  // ---------- lab orders ----------
  const labOrders: LabOrder[] = [];
  for (let i = 0; i < 50; i++) {
    const enc = pick(encounters);
    const test = pick(LAB_TESTS);
    const status = pick<LabOrder["status"]>(["Pending", "Sample Collected", "Processing", "Awaiting Verification", "Completed", "Completed", "Completed"]);
    const panel = LAB_PANELS[test.code] ?? [];
    labOrders.push({
      id: `lab_${i + 1}`,
      order_number: labNumber(i + 1),
      patient_id: enc.patient_id,
      doctor_id: enc.doctor_id,
      encounter_id: enc.id,
      test_code: test.code,
      test_name: test.name,
      priority: rand() > 0.82 ? "Urgent" : "Routine",
      status,
      ordered_at: isoAt(-int(0, 14), int(8, 16)),
      results:
        status === "Completed" || status === "Awaiting Verification"
          ? panel.map((p) => ({ parameter: p.parameter, value: p.normal, unit: p.unit, reference: p.reference, flag: "Normal" as const }))
          : [],
      ...(status === "Completed" ? { verified_by: "Lab Tech. Alex Kimani" } : {}),
      price: test.price,
    });
  }

  // ---------- radiology ----------
  const radiologyOrders: RadiologyOrder[] = [];
  for (let i = 0; i < 30; i++) {
    const enc = pick(encounters);
    const study = pick(RADIOLOGY_STUDIES);
    const status = pick<RadiologyOrder["status"]>(["Pending", "Scheduled", "In Progress", "Awaiting Report", "Completed", "Completed"]);
    radiologyOrders.push({
      id: `rad_${i + 1}`,
      order_number: radiologyNumber(i + 1),
      patient_id: enc.patient_id,
      doctor_id: enc.doctor_id,
      encounter_id: enc.id,
      modality: study.modality,
      study: study.study,
      clinical_notes: "Rule out underlying pathology. Correlate with clinical findings.",
      priority: rand() > 0.85 ? "Urgent" : "Routine",
      status,
      ordered_at: isoAt(-int(0, 12), int(8, 17)),
      ...(status !== "Pending" ? { scheduled_for: isoAt(int(0, 3), int(9, 16)) } : {}),
      ...(status === "Completed"
        ? {
            findings: "No focal consolidation or effusion. Cardiomediastinal silhouette within normal limits. Bony thorax intact.",
            impression: "No acute cardiopulmonary abnormality.",
            reported_by: "Dr. Felix Ochieng",
          }
        : {}),
      price: study.price,
    });
  }

  // ---------- prescriptions ----------
  const prescriptions: Prescription[] = [];
  for (let i = 0; i < 30; i++) {
    const enc = pick(encounters);
    const count = int(1, 3);
    const items = Array.from({ length: count }, () => {
      const drug = pick(DRUGS);
      const qty = int(6, 30);
      return {
        drug_name: drug.name,
        generic_name: drug.generic,
        strength: drug.strength,
        dosage: pick(["1 tablet", "2 tablets", "5 ml", "1 capsule"]),
        frequency: pick(["Once daily", "Twice daily", "Three times daily", "Every 8 hours"]),
        route: pick(["Oral", "Oral", "Oral", "Topical"]),
        duration: pick(["3 days", "5 days", "7 days", "14 days"]),
        quantity: qty,
        instructions: pick(["Take after meals", "Take with plenty of water", "Complete the full course", "Take at bedtime"]),
        unit_price: drug.price,
      };
    });
    prescriptions.push({
      id: `rx_${i + 1}`,
      prescription_number: prescriptionNumber(i + 1),
      patient_id: enc.patient_id,
      doctor_id: enc.doctor_id,
      encounter_id: enc.id,
      items,
      status: pick(["Pending", "Reviewed", "Dispensed", "Dispensed"]),
      created_at: isoAt(-int(0, 10), int(9, 17)),
    });
  }

  // ---------- suppliers, inventory ----------
  const suppliers: Supplier[] = Array.from({ length: 20 }, (_, i) => ({
    id: `sup_${i + 1}`,
    name: [
      "Medisel Kenya Ltd", "Surgipharm Ltd", "Harleys Limited", "Laborex Kenya", "Phillips Pharmaceuticals",
      "Cosmos Limited", "Dawa Life Sciences", "Biodeal Laboratories", "Universal Corporation", "Regal Pharmaceuticals",
      "KEMSA Supplies", "Crown Healthcare", "MedEquip Africa", "Sterling Medical", "Afya Medical Supplies",
      "Diagnostics Kenya", "Nairobi Surgical", "Rift Valley Medics", "Coast Pharma Distributors", "Bluestar Medical",
    ][i]!,
    contact_person: `${pick(FIRST_M)} ${pick(LAST)}`,
    phone: `+2542${int(10, 99)}${int(100000, 999999)}`,
    email: `sales${i + 1}@supplier.co.ke`,
    category: pick(["Pharmaceuticals", "Medical Supplies", "Laboratory Supplies", "Equipment", "Consumables"]),
    status: rand() > 0.12 ? "Active" : "Inactive",
  }));

  const nonDrugItems = [
    ["Surgical Gloves (Medium)", "Medical Supplies", "Box", 950],
    ["Examination Gloves", "Medical Supplies", "Box", 720],
    ["Face Masks 3-ply", "Consumables", "Box", 480],
    ["N95 Respirator", "Consumables", "Piece", 180],
    ["Syringe 5ml", "Medical Supplies", "Piece", 15],
    ["Syringe 10ml", "Medical Supplies", "Piece", 22],
    ["IV Cannula 18G", "Medical Supplies", "Piece", 60],
    ["Giving Set", "Medical Supplies", "Piece", 95],
    ["Cotton Wool 500g", "Consumables", "Roll", 340],
    ["Gauze Swabs", "Surgical Supplies", "Pack", 260],
    ["Surgical Blade No.11", "Surgical Supplies", "Piece", 35],
    ["Suture Vicryl 2/0", "Surgical Supplies", "Piece", 420],
    ["Surgical Drape", "Surgical Supplies", "Piece", 380],
    ["EDTA Tube", "Laboratory Supplies", "Piece", 25],
    ["Plain Tube", "Laboratory Supplies", "Piece", 22],
    ["Urine Container", "Laboratory Supplies", "Piece", 18],
    ["Glucose Strips", "Laboratory Supplies", "Box", 1800],
    ["Malaria RDT Kit", "Laboratory Supplies", "Box", 2400],
    ["HIV Test Kit", "Laboratory Supplies", "Box", 2900],
    ["Digital Thermometer", "Equipment", "Piece", 1500],
    ["BP Machine (Digital)", "Equipment", "Piece", 8500],
    ["Pulse Oximeter", "Equipment", "Piece", 4200],
    ["Nebuliser Machine", "Equipment", "Piece", 12500],
    ["Wheelchair", "Equipment", "Piece", 24000],
    ["Patient File", "Office Supplies", "Piece", 45],
    ["Printing Paper A4", "Office Supplies", "Ream", 650],
    ["Receipt Rolls", "Office Supplies", "Roll", 120],
    ["Disinfectant 5L", "Consumables", "Jerrican", 1900],
    ["Hand Sanitiser 500ml", "Consumables", "Bottle", 420],
    ["Bed Sheets", "Consumables", "Piece", 1200],
  ] as const;

  const inventory: InventoryItem[] = [];
  DRUGS.forEach((d, i) => {
    const qty = int(0, 400);
    inventory.push({
      id: `inv_${i + 1}`,
      sku: `PHM-${String(i + 1).padStart(4, "0")}`,
      name: d.name,
      generic_name: d.generic,
      category: "Pharmaceuticals",
      unit: d.form,
      quantity: qty,
      reorder_level: 60,
      unit_price: d.price,
      expiry_date: shiftDays(int(-20, 700)),
      supplier_id: pick(suppliers).id,
      location: "Main Pharmacy Store",
    });
  });
  nonDrugItems.forEach((n, i) => {
    const idx = DRUGS.length + i + 1;
    inventory.push({
      id: `inv_${idx}`,
      sku: `GEN-${String(idx).padStart(4, "0")}`,
      name: n[0],
      category: n[1] as InventoryItem["category"],
      unit: n[2],
      quantity: int(0, 300),
      reorder_level: 40,
      unit_price: n[3],
      expiry_date: n[1] === "Equipment" ? undefined : shiftDays(int(30, 900)),
      supplier_id: pick(suppliers).id,
      location: pick(["Central Store", "Theatre Store", "Lab Store", "Ward Store"]),
    });
  });
  // pad to 100 items
  let padIdx = inventory.length;
  while (inventory.length < 100) {
    padIdx += 1;
    const base = nonDrugItems[padIdx % nonDrugItems.length]!;
    inventory.push({
      id: `inv_${padIdx}`,
      sku: `GEN-${String(padIdx).padStart(4, "0")}`,
      name: `${base[0]} (Pack ${Math.ceil(padIdx / 10)})`,
      category: base[1] as InventoryItem["category"],
      unit: base[2],
      quantity: int(0, 250),
      reorder_level: 40,
      unit_price: base[3],
      expiry_date: shiftDays(int(10, 800)),
      supplier_id: pick(suppliers).id,
      location: pick(["Central Store", "Theatre Store", "Lab Store", "Ward Store"]),
    });
  }

  const stockMovements: StockMovement[] = inventory.slice(0, 25).map((item, i) => ({
    id: `mov_${i + 1}`,
    item_id: item.id,
    type: pick(["Receive", "Issue", "Adjustment"]),
    quantity: int(5, 80),
    reference: `GRN-${2026}-${String(i + 1).padStart(4, "0")}`,
    created_at: isoAt(-int(0, 20), int(8, 17)),
    user: "Inventory Officer",
  }));

  const purchaseOrders: PurchaseOrder[] = Array.from({ length: 12 }, (_, i) => {
    const items = Array.from({ length: int(1, 3) }, () => {
      const it = pick(inventory);
      return { item_id: it.id, name: it.name, quantity: int(10, 200), unit_price: it.unit_price };
    });
    return {
      id: `po_${i + 1}`,
      po_number: poNumber(i + 1),
      supplier_id: pick(suppliers).id,
      department: pick(["Pharmacy", "Laboratory", "Theatre", "Wards", "Administration"]),
      items,
      total: items.reduce((s, it) => s + it.quantity * it.unit_price, 0),
      status: pick(["Requested", "Approved", "Ordered", "Received", "Received"]),
      created_at: isoAt(-int(1, 40), 10),
    };
  });

  // ---------- wards & beds ----------
  const wards: Ward[] = [
    { id: "wd_1", name: "General Ward A", type: "General", floor: "1st Floor" },
    { id: "wd_2", name: "General Ward B", type: "General", floor: "1st Floor" },
    { id: "wd_3", name: "Private Wing", type: "Private", floor: "2nd Floor" },
    { id: "wd_4", name: "Maternity Ward", type: "Maternity", floor: "2nd Floor" },
    { id: "wd_5", name: "Paediatric Ward", type: "Paediatric", floor: "3rd Floor" },
    { id: "wd_6", name: "Intensive Care Unit", type: "Critical", floor: "3rd Floor" },
  ];
  const beds: Bed[] = [];
  let bedIdx = 0;
  wards.forEach((w) => {
    const count = w.type === "Critical" ? 12 : w.type === "Private" ? 14 : 20;
    for (let i = 0; i < count; i++) {
      bedIdx += 1;
      beds.push({
        id: `bed_${bedIdx}`,
        ward_id: w.id,
        room: `R${Math.floor(i / 4) + 1}`,
        label: `${w.name.split(" ").map((s) => s[0]).join("")}-${String(i + 1).padStart(2, "0")}`,
        status: pick(["Available", "Available", "Occupied", "Occupied", "Reserved", "Cleaning", "Maintenance"]),
        daily_rate: w.type === "Critical" ? 25000 : w.type === "Private" ? 12000 : 4500,
      });
    }
  });

  const admissions: Admission[] = [];
  beds.filter((b) => b.status === "Occupied").forEach((bed, i) => {
    const patient = patients[(i * 3 + 5) % patients.length]!;
    bed.patient_id = patient.id;
    patient.status = "Admitted";
    admissions.push({
      id: `adm_${i + 1}`,
      admission_number: admissionNumber(i + 1),
      patient_id: patient.id,
      doctor_id: pick(doctors).id,
      bed_id: bed.id,
      ward_id: bed.ward_id,
      reason: pick(["Severe malaria", "Pneumonia", "Post-operative care", "Dehydration", "Observation after trauma", "Delivery"]),
      admitted_at: isoAt(-int(1, 9), int(6, 20)),
      status: "Admitted",
    });
  });

  // ---------- surgeries ----------
  const surgeries: Surgery[] = Array.from({ length: 10 }, (_, i) => ({
    id: `sur_${i + 1}`,
    case_number: caseNumber("THE", i + 1),
    patient_id: pick(patients).id,
    surgeon_id: pick(doctors.filter((d) => d.specialty.includes("Surgery"))).id,
    anesthetist: `Dr. ${pick(FIRST_M)} ${pick(LAST)}`,
    theatre_nurse: `Nurse ${pick(FIRST_F)} ${pick(LAST)}`,
    theatre: `Theatre ${int(1, 4)}`,
    procedure: pick(["Appendectomy", "Caesarean Section", "Hernia Repair", "Open Reduction & Internal Fixation", "Cholecystectomy", "Tonsillectomy", "Cataract Extraction"]),
    scheduled_at: isoAt(int(0, 5), int(8, 16)),
    duration_minutes: pick([45, 60, 90, 120, 180]),
    status: pick(["Scheduled", "Scheduled", "Pre-op", "In Theatre", "Recovery", "Completed"]),
  }));

  // ---------- emergency ----------
  const emergencyCases: EmergencyCase[] = Array.from({ length: 8 }, (_, i) => ({
    id: `er_${i + 1}`,
    case_number: caseNumber("ER", i + 1),
    patient_id: patients[(i * 7 + 2) % patients.length]!.id,
    arrival_at: isoAt(0, int(0, 12), int(0, 59)),
    complaint: pick(["Road traffic accident", "Severe abdominal pain", "Difficulty in breathing", "High fever in child", "Chest pain", "Deep laceration", "Seizure", "Suspected poisoning"]),
    triage: pick(["RED", "ORANGE", "ORANGE", "YELLOW", "YELLOW", "GREEN"]),
    stage: pick(["Triage", "Assessment", "Treatment", "Observation"]),
    attending: pick(["Dr. Amina Yusuf", "Dr. Peter Njoroge"]),
  }));

  // ---------- maternity ----------
  const maternity: MaternityRecord[] = Array.from({ length: 10 }, (_, i) => {
    const stage = pick<MaternityRecord["stage"]>(["Antenatal", "Antenatal", "Labor", "Delivery", "Postnatal"]);
    const female = patients.filter((p) => p.gender === "Female");
    return {
      id: `mat_${i + 1}`,
      patient_id: female[(i * 3) % female.length]!.id,
      stage,
      gestation_weeks: stage === "Antenatal" ? int(8, 39) : 39,
      ...(stage === "Delivery" || stage === "Postnatal"
        ? {
            delivery_at: isoAt(-int(0, 6), int(0, 23)),
            delivery_type: pick(["Normal (SVD)", "Caesarean", "Assisted"] as const),
            baby_sex: pick(["Male", "Female"] as const),
            birth_weight_kg: Number((2.6 + rand() * 1.4).toFixed(2)),
            apgar: `${int(7, 9)}/${int(9, 10)}`,
            complications: rand() > 0.8 ? "Mild postpartum haemorrhage, managed" : "None",
          }
        : {}),
      doctor_id: doctors.find((d) => d.specialty.includes("Obstetric"))!.id,
      midwife: `Midwife ${pick(FIRST_F)} ${pick(LAST)}`,
    };
  });

  const nursingNotes: NursingNote[] = admissions.slice(0, 12).map((a, i) => ({
    id: `nn_${i + 1}`,
    patient_id: a.patient_id,
    created_at: isoAt(0, int(6, 20)),
    nurse: `Nurse ${pick(FIRST_F)} ${pick(LAST)}`,
    observation: pick(["Patient stable, tolerating oral intake.", "Reports reduced pain after analgesia.", "Afebrile overnight, slept well.", "Wound site clean and dry."]),
    intake_ml: int(500, 2200),
    output_ml: int(400, 2000),
    consciousness: "Alert",
    medication_given: pick(["Paracetamol 1g IV", "Ceftriaxone 1g IV", "Normal Saline 500ml", "None"]),
  }));

  // ---------- billing ----------
  const invoices: Invoice[] = [];
  const payments: Payment[] = [];
  let receiptSeq = 0;
  for (let i = 0; i < 50; i++) {
    const patient = pick(patients);
    const items = [
      { description: "Consultation fee", category: "Consultation" as const, quantity: 1, unit_price: pick([1000, 1500, 3000, 3500]) },
      ...(rand() > 0.4 ? [{ description: pick(LAB_TESTS).name, category: "Laboratory" as const, quantity: 1, unit_price: int(500, 3000) }] : []),
      ...(rand() > 0.7 ? [{ description: pick(RADIOLOGY_STUDIES).study, category: "Radiology" as const, quantity: 1, unit_price: int(2500, 18000) }] : []),
      ...(rand() > 0.5 ? [{ description: "Dispensed medication", category: "Medication" as const, quantity: int(1, 3), unit_price: int(200, 1800) }] : []),
    ];
    const subtotal = items.reduce((s, it) => s + it.quantity * it.unit_price, 0);
    const discount = rand() > 0.85 ? Math.round(subtotal * 0.05) : 0;
    const total = subtotal - discount;
    const payChoice = rand();
    const paid = payChoice > 0.55 ? total : payChoice > 0.3 ? Math.round(total * 0.5) : 0;
    const status: Invoice["status"] = paid >= total ? "Paid" : paid > 0 ? "Partially Paid" : "Pending";
    const inv: Invoice = {
      id: `invc_${i + 1}`,
      invoice_number: invoiceNumber(i + 1),
      patient_id: patient.id,
      date: shiftDays(-int(0, 45)),
      items,
      discount,
      tax: 0,
      paid,
      payer: patient.payer,
      status,
    };
    invoices.push(inv);
    if (paid > 0) {
      receiptSeq += 1;
      payments.push({
        id: `pay_${receiptSeq}`,
        receipt_number: receiptNumber(receiptSeq),
        invoice_id: inv.id,
        patient_id: patient.id,
        amount: paid,
        method: pick(["Cash", "Card", "Mobile Money", "Mobile Money", "Bank", "Insurance"]),
        reference: `REF${int(100000, 999999)}`,
        created_at: `${inv.date}T12:00:00.000Z`,
        received_by: "Cashier Desk 1",
      });
    }
  }

  // ---------- claims & authorizations ----------
  const insuredInvoices = invoices.filter((inv) => inv.payer === "Insurance").slice(0, 20);
  const claims: Claim[] = insuredInvoices.map((inv, i) => {
    const policy = policies.find((p) => p.patient_id === inv.patient_id);
    const amount = inv.items.reduce((s, it) => s + it.quantity * it.unit_price, 0) - inv.discount;
    const status = pick<ClaimStatus>(["Draft", "Validated", "Submitted", "Pending", "Approved", "Partially Approved", "Rejected", "Paid", "Paid"]);
    return {
      id: `clm_${i + 1}`,
      claim_number: claimNumber(i + 1),
      patient_id: inv.patient_id,
      provider_id: policy?.provider_id ?? "ins_1",
      invoice_id: inv.id,
      amount,
      approved_amount: status === "Approved" || status === "Paid" ? amount : status === "Partially Approved" ? Math.round(amount * 0.7) : undefined,
      submitted_at: ["Submitted", "Pending", "Approved", "Partially Approved", "Rejected", "Paid"].includes(status) ? isoAt(-int(1, 25), 11) : undefined,
      status,
      remarks: status === "Rejected" ? "Service not covered under the member's outpatient benefit." : undefined,
      created_at: isoAt(-int(2, 30), 10),
    };
  });

  const authorizations: Authorization[] = Array.from({ length: 8 }, (_, i) => {
    const policy = policies[i % policies.length]!;
    return {
      id: `auth_${i + 1}`,
      authorization_number: authorizationNumber(i + 1),
      patient_id: policy.patient_id,
      policy_id: policy.id,
      procedure: pick(["Caesarean Section", "MRI Lumbar Spine", "Appendectomy", "CT Abdomen & Pelvis", "Cataract Surgery", "Inpatient Admission"]),
      estimated_cost: pick([25000, 45000, 90000, 120000, 18000]),
      requested_by: pick(doctors).id,
      requested_at: isoAt(-int(0, 12), int(9, 16)),
      status: pick(["Pending", "Approved", "Approved", "Rejected", "More Information Required"]),
    };
  });

  // ---------- HR ----------
  const employees: Employee[] = Array.from({ length: 20 }, (_, i) => {
    const gender = i % 2 === 0 ? FIRST_F : FIRST_M;
    return {
      id: `emp_${i + 1}`,
      employee_number: employeeNumber(i + 1),
      name: `${pick(gender)} ${pick(LAST)}`,
      department_id: pick(departments).id,
      role: pick(["Medical Officer", "Registered Nurse", "Receptionist", "Cashier", "Pharmacist", "Lab Technologist", "Radiographer", "Theatre Nurse", "Procurement Officer", "HR Officer", "Records Clerk", "Security Officer"]),
      employment_status: pick(["Permanent", "Permanent", "Contract", "Locum", "Intern"]),
      phone: `+2547${int(10, 99)}${int(100000, 999999)}`,
      email: `staff${i + 1}@abancoolhospital.co.ke`,
      joined_at: shiftDays(-int(90, 2500)),
      shift: pick(["Day", "Night", "Rotating"]),
      leave_balance: int(0, 28),
      gross_salary: pick([45000, 62000, 85000, 120000, 180000, 260000]),
      attendance_today: pick(["Present", "Present", "Present", "On Leave", "Absent"]),
    };
  });

  // ---------- notifications & audit ----------
  const notifications: Notification[] = [
    { id: "not_1", title: "Critical lab value", body: "Potassium 6.4 mmol/L for ABH-000012 — notify attending physician immediately.", type: "critical", created_at: isoAt(0, 8, 12), read: false, audience: "all" },
    { id: "not_2", title: "New appointment request", body: "A new appointment request was received for the Cardiology clinic.", type: "appointment", created_at: isoAt(0, 8, 40), read: false, audience: "all", link: "/app/appointments" },
    { id: "not_3", title: "Lab result available", body: "Complete Blood Count results are ready for review.", type: "lab", created_at: isoAt(0, 9, 5), read: false, audience: "all", link: "/app/laboratory" },
    { id: "not_4", title: "Low stock alert", body: "12 inventory items have fallen below their reorder level.", type: "inventory", created_at: isoAt(0, 7, 30), read: true, audience: "all", link: "/app/inventory" },
    { id: "not_5", title: "Insurance claim approved", body: "Claim CLM-2026-000004 was approved by AAR Insurance.", type: "insurance", created_at: isoAt(-1, 16, 10), read: true, audience: "all", link: "/app/claims" },
    { id: "not_6", title: "Payment received", body: "KES 12,400 received against invoice INV-2026-000021.", type: "payment", created_at: isoAt(-1, 14, 0), read: true, audience: "all", link: "/app/billing" },
  ];

  const auditLogs: AuditLog[] = [
    { id: "aud_1", user: "Dr. Samuel Kiptoo", action: "Updated diagnosis", module: "Clinical", record: "ABH-000024", timestamp: isoAt(0, 9, 22), device: "192.168.10.24 · Chrome / Windows", previous_value: "Headache", new_value: "Essential (primary) hypertension" },
    { id: "aud_2", user: "Receptionist Desk 2", action: "Registered patient", module: "Patients", record: "ABH-000050", timestamp: isoAt(0, 8, 15), device: "192.168.10.11 · Edge / Windows" },
    { id: "aud_3", user: "Cashier Desk 1", action: "Recorded payment", module: "Billing", record: "INV-2026-000031", timestamp: isoAt(-1, 15, 44), device: "192.168.10.31 · Chrome / Windows", new_value: "KES 8,500 (Mobile Money)" },
    { id: "aud_4", user: "Lab Tech. Alex Kimani", action: "Verified lab result", module: "Laboratory", record: "LAB-2026-000018", timestamp: isoAt(-1, 11, 2), device: "192.168.10.44 · Firefox / Ubuntu" },
    { id: "aud_5", user: "Insurance Officer", action: "Submitted claim", module: "Insurance", record: "CLM-2026-000009", timestamp: isoAt(-2, 10, 30), device: "192.168.10.52 · Chrome / macOS" },
  ];

  return {
    version: 1,
    departments,
    doctors,
    patients,
    appointments,
    queue,
    encounters,
    vitals,
    labOrders,
    radiologyOrders,
    prescriptions,
    inventory,
    stockMovements,
    suppliers,
    purchaseOrders,
    wards,
    beds,
    admissions,
    surgeries,
    emergencyCases,
    maternity,
    nursingNotes,
    invoices,
    payments,
    providers,
    policies,
    eligibilityChecks: [],
    authorizations,
    claims,
    employees,
    notifications,
    auditLogs,
    documents: [
      { id: "doc_1", patient_id: "pat_1", name: "National ID - Mary Wanjiku.pdf", type: "National ID", size_kb: 412, uploaded_at: isoAt(-30, 10), uploaded_by: "Reception" },
      { id: "doc_2", patient_id: "pat_1", name: "AAR Insurance Card.jpg", type: "Insurance Card", size_kb: 208, uploaded_at: isoAt(-30, 10), uploaded_by: "Reception" },
    ],
    hospital: {
      name: "Abancool Hospital",
      tagline: "Compassionate Care. Advanced Medicine. Better Outcomes.",
      address: "Abancool Medical Centre, Ngong Road, Nairobi, Kenya",
      phone: "+254 700 820 100",
      emergency_phone: "+254 700 911 911",
      email: "info@abancoolhospital.co.ke",
      hours: "Outpatient: Mon–Sat 7:00 AM – 8:00 PM · Emergency: 24 hours",
      kra_pin: "P051234567X",
      paybill: "Paybill 400200 · Account: Patient Number",
      socials: [
        { label: "Facebook", url: "https://facebook.com" },
        { label: "X", url: "https://x.com" },
        { label: "LinkedIn", url: "https://linkedin.com" },
        { label: "Instagram", url: "https://instagram.com" },
      ],
    },
    counters: {
      patient: 50,
      appointment: 100,
      invoice: 50,
      lab: 50,
      radiology: 30,
      prescription: 30,
      claim: 20,
      receipt: receiptSeq,
      admission: admissions.length,
      authorization: 8,
      queue: queue.length,
      encounter: encounters.length,
      theatre: 10,
      emergency: 8,
      po: 12,
      employee: 20,
    },
    session: { user_id: null },
  };
}

export { shiftDays, isoAt };
