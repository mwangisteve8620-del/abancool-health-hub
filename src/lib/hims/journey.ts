/**
 * "Load Full Patient Journey" — runs the complete Abancool demo scenario for
 * Mary Wanjiku end to end, touching every module through the service layer.
 */

import {
  admissionService,
  appointmentService,
  billingService,
  clinicalService,
  insuranceService,
  laboratoryService,
  pharmacyService,
  queueService,
  radiologyService,
} from "./services";
import { getState } from "./store";
import { DRUGS } from "./catalog";

export interface JourneyStep {
  label: string;
  detail: string;
}

export async function runFullPatientJourney(onStep?: (s: JourneyStep) => void): Promise<JourneyStep[]> {
  const steps: JourneyStep[] = [];
  const step = (label: string, detail: string) => {
    const s = { label, detail };
    steps.push(s);
    onStep?.(s);
  };

  const s0 = getState();
  const patient = s0.patients.find((p) => p.first_name === "Mary" && p.last_name === "Wanjiku") ?? s0.patients[0]!;
  const doctor = s0.doctors.find((d) => d.specialty === "Internal Medicine") ?? s0.doctors[0]!;
  const today = new Date().toISOString().slice(0, 10);

  const apt = await appointmentService.create({
    patient_id: patient.id,
    doctor_id: doctor.id,
    department_id: doctor.department_id,
    service: "General Consultation",
    date: today,
    time: "10:30",
    reason: "Fever, headache and general body weakness for three days",
    payer: patient.payer,
    status: "Confirmed",
  });
  step("Appointment booked", `${apt.data.appointment_number} with ${doctor.name}`);

  const checkin = await appointmentService.checkIn(apt.data.id);
  step("Patient checked in", `Queue number ${checkin.data.ticket.number} issued at reception`);

  await queueService.setStatus(checkin.data.ticket.id, "Called");
  step("Called to consultation room", `${checkin.data.ticket.number} called`);

  await clinicalService.recordVitals({
    patient_id: patient.id,
    temperature: 38.4,
    systolic: 118,
    diastolic: 76,
    pulse: 96,
    respiratory_rate: 20,
    spo2: 97,
    weight: 64.5,
    height: 1.63,
    pain_score: 4,
    notes: "Febrile on arrival, otherwise stable.",
  });
  step("Nurse recorded vitals", "Temp 38.4°C · BP 118/76 · Pulse 96 · SpO₂ 97%");

  const enc = await clinicalService.createEncounter({
    patient_id: patient.id,
    doctor_id: doctor.id,
    department_id: doctor.department_id,
    appointment_id: apt.data.id,
    date: today,
    chief_complaint: "Fever, headache and body weakness for three days",
    hpi: "Gradual onset fever with chills, frontal headache and generalised body aches. No cough, no diarrhoea. Took paracetamol at home with partial relief.",
    past_medical_history: "No chronic illness. No previous admissions.",
    family_history: "Mother has hypertension.",
    social_history: "Non-smoker, occasional alcohol. Works in Nairobi CBD.",
    examination: "Febrile, not pale, not jaundiced. Chest clear. Abdomen soft with mild epigastric tenderness.",
    assessment: "Clinical suspicion of malaria with possible early gastritis.",
    diagnoses: [
      { code: "B54", label: "Unspecified malaria", type: "Primary" },
      { code: "K29.7", label: "Gastritis, unspecified", type: "Secondary" },
    ],
    treatment_plan: "Confirm with blood slide, start antimalarial once confirmed, symptomatic treatment, review in 3 days.",
    follow_up: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
  });
  step("Doctor recorded consultation", "Chief complaint, examination and plan documented");
  step("Diagnosis recorded", "B54 Unspecified malaria (primary) · K29.7 Gastritis (secondary)");

  await billingService.addChargeForPatient(patient.id, {
    description: `Consultation — ${doctor.name}`,
    category: "Consultation",
    quantity: 1,
    unit_price: doctor.consultation_fee,
  });

  const lab = await laboratoryService.order({ patient_id: patient.id, doctor_id: doctor.id, encounter_id: enc.data.id, test_code: "CBC", priority: "Urgent" });
  step("Laboratory order created", `${lab.data.order_number} · Complete Blood Count (Urgent)`);

  const rad = await radiologyService.order({
    patient_id: patient.id,
    doctor_id: doctor.id,
    encounter_id: enc.data.id,
    study: "Chest X-Ray (PA)",
    clinical_notes: "Febrile illness, rule out chest infection.",
    priority: "Routine",
  });
  step("Radiology request created", `${rad.data.order_number} · Chest X-Ray (PA)`);

  const coartem = DRUGS.find((d) => d.generic.startsWith("Artemether"))!;
  const panadol = DRUGS.find((d) => d.generic === "Paracetamol")!;
  const rx = await pharmacyService.prescribe({
    patient_id: patient.id,
    doctor_id: doctor.id,
    encounter_id: enc.data.id,
    items: [
      { drug_name: coartem.name, generic_name: coartem.generic, strength: coartem.strength, dosage: "4 tablets", frequency: "Twice daily", route: "Oral", duration: "3 days", quantity: 24, instructions: "Take with fatty food or milk", unit_price: coartem.price },
      { drug_name: panadol.name, generic_name: panadol.generic, strength: panadol.strength, dosage: "2 tablets", frequency: "Three times daily", route: "Oral", duration: "3 days", quantity: 18, instructions: "Take after meals", unit_price: panadol.price },
    ],
  });
  step("Prescription sent to pharmacy", `${rx.data.prescription_number} · 2 medications`);

  const policy = getState().policies.find((p) => p.patient_id === patient.id);
  if (policy) {
    const elig = await insuranceService.checkEligibility(policy.id);
    step("Insurance eligibility checked (demo)", `Member verified · remaining balance KES ${elig.data.remaining_balance.toLocaleString()}`);
    const auth = await insuranceService.requestAuthorization({
      patient_id: patient.id,
      policy_id: policy.id,
      procedure: "Outpatient investigation & treatment",
      estimated_cost: 12000,
      requested_by: doctor.id,
    });
    await insuranceService.setAuthorizationStatus(auth.data.id, "Approved", "Approved for outpatient benefit (demo response).");
    step("Pre-authorization approved (demo)", auth.data.authorization_number);
  }

  await laboratoryService.setStatus(lab.data.id, "Sample Collected");
  await laboratoryService.setStatus(lab.data.id, "Processing");
  await laboratoryService.enterResults(
    lab.data.id,
    [
      { parameter: "WBC", value: "11.8", unit: "10^9/L", reference: "4.0 – 11.0", flag: "High" },
      { parameter: "RBC", value: "4.7", unit: "10^12/L", reference: "4.5 – 5.9", flag: "Normal" },
      { parameter: "Haemoglobin", value: "11.2", unit: "g/dL", reference: "12.0 – 16.0", flag: "Low" },
      { parameter: "Haematocrit", value: "35", unit: "%", reference: "36 – 48", flag: "Low" },
      { parameter: "Platelets", value: "132", unit: "10^9/L", reference: "150 – 450", flag: "Low" },
    ],
    "Findings consistent with acute malarial infection. Recommend clinical correlation.",
  );
  await laboratoryService.verify(lab.data.id);
  step("Laboratory results verified", `${lab.data.order_number} released to the doctor and patient portal`);

  await radiologyService.setStatus(rad.data.id, "Scheduled", new Date().toISOString());
  await radiologyService.setStatus(rad.data.id, "In Progress");
  await radiologyService.report(
    rad.data.id,
    "Lung fields are clear with no focal consolidation, effusion or pneumothorax. Cardiomediastinal contours normal. Bony thorax intact.",
    "Normal chest radiograph. No acute cardiopulmonary abnormality.",
  );
  step("Radiology report published", `${rad.data.order_number} reported and billed`);

  await pharmacyService.review(rx.data.id);
  await pharmacyService.dispense(rx.data.id);
  step("Pharmacy dispensed medication", "Stock levels reduced and medication billed");

  const invoice = getState().invoices.find((i) => i.patient_id === patient.id && i.status !== "Paid" && i.status !== "Cancelled");
  if (invoice) {
    step("Invoice updated", `${invoice.invoice_number} now carries every charge from this visit`);
    await billingService.recordPayment(invoice.id, 2000, "Mobile Money", "MPESA-DEMO-0001");
    step("Co-payment received", "KES 2,000 paid by Mobile Money · receipt issued");
    const claim = await insuranceService.createClaim(invoice.id);
    await insuranceService.setClaimStatus(claim.data.id, "Validated");
    await insuranceService.setClaimStatus(claim.data.id, "Submitted");
    step("Insurance claim submitted (demo)", `${claim.data.claim_number} submitted to the insurer`);
  }

  const availableBed = getState().beds.find((b) => b.status === "Available");
  if (availableBed) {
    step("Bed reserved for observation", `Bed ${availableBed.label} held for short-stay observation`);
    await admissionService.setBedStatus(availableBed.id, "Reserved");
  }

  step("Patient portal updated", "Mary can now see her results, prescription, invoice and claim");
  return steps;
}
