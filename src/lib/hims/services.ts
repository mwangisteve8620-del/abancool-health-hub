/**
 * ===========================================================================
 *  DEMO MOCK SERVICES  (replaceable with FUTURE LARAVEL API SERVICES)
 * ===========================================================================
 *
 * Every function here mirrors one endpoint in docs/API_CONTRACT.md and returns
 * the Laravel envelope { success, message, data, meta }. Swapping to the real
 * backend means replacing the body of each function with an `http()` call to
 * `${API_BASE_URL}/...` — signatures and return shapes stay identical.
 */

import {
  admissionNumber,
  appointmentNumber,
  authorizationNumber,
  caseNumber,
  claimNumber,
  invoiceNumber,
  labNumber,
  patientNumber,
  prescriptionNumber,
  queueNumber,
  radiologyNumber,
  receiptNumber,
  uid,
} from "./ids";
import { LAB_PANELS, LAB_TESTS, RADIOLOGY_STUDIES } from "./catalog";
import { getState, mutate, nextSequence } from "./store";
import { DEMO_USERS } from "./rbac";
import type {
  Admission,
  ApiResponse,
  Appointment,
  AppointmentStatus,
  Authorization,
  Claim,
  ClaimStatus,
  EligibilityCheck,
  EmergencyCase,
  Encounter,
  ID,
  InventoryItem,
  Invoice,
  InvoiceItem,
  LabOrder,
  LabResultLine,
  MedicationLine,
  Notification,
  NursingNote,
  Patient,
  Payment,
  Prescription,
  RadiologyOrder,
  Role,
  Surgery,
  User,
  Vital,
} from "./types";

/** Base URL the Laravel API will live at. Configure via VITE_API_BASE_URL later. */
export const API_BASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_API_BASE_URL"]) || "/api/v1";

export const DEMO_MODE = true;

const latency = () => new Promise<void>((r) => setTimeout(r, 180));

function ok<T>(data: T, message = "Request successful", meta?: Record<string, unknown>): ApiResponse<T> {
  return { success: true, message, data, ...(meta ? { meta } : {}) };
}

function nowISO() {
  return new Date().toISOString();
}

function currentUserName() {
  const s = getState();
  return DEMO_USERS.find((u) => u.id === s.session.user_id)?.name ?? "System";
}

/* ---------------------------------------------------------------- shared -- */

export function logAudit(action: string, module: string, record: string, prev?: string, next?: string) {
  mutate((d) => {
    d.auditLogs = [
      {
        id: uid("aud"),
        user: currentUserName(),
        action,
        module,
        record,
        timestamp: nowISO(),
        device: "192.168.10.x · Demo session",
        previous_value: prev,
        new_value: next,
      },
      ...d.auditLogs,
    ];
  });
}

export function notify(n: Omit<Notification, "id" | "created_at" | "read">) {
  mutate((d) => {
    d.notifications = [{ ...n, id: uid("not"), created_at: nowISO(), read: false }, ...d.notifications];
  });
}

/* ------------------------------------------------------------------ auth -- */

export const authService = {
  async login(email: string, _password: string): Promise<ApiResponse<User> | { success: false; message: string }> {
    await latency();
    const user = DEMO_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) return { success: false, message: "No demo account matches those credentials." };
    mutate((d) => {
      d.session = { user_id: user.id };
    });
    logAudit("Signed in", "Authentication", user.email);
    return ok(user, "Signed in successfully");
  },
  async loginAs(userId: ID): Promise<ApiResponse<User>> {
    await latency();
    const user = DEMO_USERS.find((u) => u.id === userId)!;
    mutate((d) => {
      d.session = { user_id: user.id };
    });
    logAudit("Switched demo role", "Authentication", user.email);
    return ok(user, `Signed in as ${user.name}`);
  },
  async register(input: { name: string; email: string; phone: string; dob: string; gender: "Male" | "Female"; national_id: string }): Promise<ApiResponse<Patient>> {
    await latency();
    const [first, ...rest] = input.name.trim().split(" ");
    const res = await patientService.create({
      first_name: first ?? input.name,
      last_name: rest.join(" ") || "—",
      dob: input.dob,
      gender: input.gender,
      phone: input.phone,
      email: input.email,
      national_id: input.national_id,
      address: "",
      county: "Nairobi",
      payer: "Self Pay",
    });
    return res;
  },
  logout() {
    logAudit("Signed out", "Authentication", currentUserName());
    mutate((d) => {
      d.session = { user_id: null };
    });
  },
  currentUser(): User | null {
    const id = getState().session.user_id;
    return DEMO_USERS.find((u) => u.id === id) ?? null;
  },
};

/* --------------------------------------------------------------- patients -- */

export interface NewPatientInput {
  first_name: string;
  last_name: string;
  dob: string;
  gender: "Male" | "Female";
  phone: string;
  email: string;
  national_id: string;
  address: string;
  county: string;
  blood_group?: string;
  payer: "Self Pay" | "Insurance";
  provider_id?: ID;
  member_number?: string;
  next_of_kin_name?: string;
  next_of_kin_phone?: string;
  next_of_kin_relationship?: string;
  allergies?: string;
}

export const patientService = {
  async list(): Promise<ApiResponse<Patient[]>> {
    await latency();
    return ok(getState().patients);
  },
  async get(id: ID): Promise<ApiResponse<Patient | undefined>> {
    await latency();
    return ok(getState().patients.find((p) => p.id === id));
  },
  async create(input: NewPatientInput): Promise<ApiResponse<Patient>> {
    await latency();
    const seq = nextSequence("patient");
    const id = uid("pat");
    const patient: Patient = {
      id,
      patient_number: patientNumber(seq),
      first_name: input.first_name,
      last_name: input.last_name,
      dob: input.dob,
      gender: input.gender,
      phone: input.phone,
      email: input.email,
      national_id: input.national_id,
      address: input.address,
      county: input.county,
      blood_group: input.blood_group ?? "Unknown",
      allergies: input.allergies ? input.allergies.split(",").map((a) => a.trim()).filter(Boolean) : [],
      chronic_conditions: [],
      next_of_kin: {
        name: input.next_of_kin_name ?? "—",
        relationship: input.next_of_kin_relationship ?? "—",
        phone: input.next_of_kin_phone ?? "—",
      },
      payer: input.payer,
      status: "Active",
      registered_at: nowISO().slice(0, 10),
    };
    mutate((d) => {
      d.patients = [patient, ...d.patients];
      if (input.payer === "Insurance" && input.provider_id) {
        d.policies = [
          {
            id: uid("pol"),
            patient_id: id,
            provider_id: input.provider_id,
            member_number: input.member_number ?? `MEM-${seq}`,
            policy_number: `P/${seq}/2026`,
            principal_member: `${input.first_name} ${input.last_name}`,
            relationship: "Principal",
            scheme: "Individual Plan",
            annual_limit: 500000,
            used_amount: 0,
            expiry: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
            status: "Active",
          },
          ...d.policies,
        ];
        const pol = d.policies[0]!;
        d.patients = d.patients.map((p) => (p.id === id ? { ...p, insurance_policy_id: pol.id } : p));
      }
    });
    logAudit("Registered patient", "Patients", patient.patient_number);
    return ok(patient, `Patient ${patient.patient_number} registered successfully`);
  },
  async update(id: ID, changes: Partial<Patient>): Promise<ApiResponse<Patient>> {
    await latency();
    const updated = mutate((d) => {
      d.patients = d.patients.map((p) => (p.id === id ? { ...p, ...changes } : p));
      return d.patients.find((p) => p.id === id)!;
    });
    logAudit("Updated patient record", "Patients", updated.patient_number);
    return ok(updated, "Patient updated");
  },
  async uploadDocument(patientId: ID, name: string, type: string, sizeKb: number) {
    await latency();
    mutate((d) => {
      d.documents = [
        { id: uid("doc"), patient_id: patientId, name, type: type as never, size_kb: sizeKb, uploaded_at: nowISO(), uploaded_by: currentUserName() },
        ...d.documents,
      ];
    });
    logAudit("Uploaded document", "Documents", name);
    return ok(true, "Document uploaded");
  },
};

/* ----------------------------------------------------------- appointments -- */

export const appointmentService = {
  async list(): Promise<ApiResponse<Appointment[]>> {
    await latency();
    return ok(getState().appointments);
  },
  async create(input: {
    patient_id: ID;
    doctor_id: ID;
    department_id: ID;
    service: string;
    date: string;
    time: string;
    reason: string;
    payer: "Self Pay" | "Insurance";
    status?: AppointmentStatus;
  }): Promise<ApiResponse<Appointment>> {
    await latency();
    const seq = nextSequence("appointment");
    const appointment: Appointment = {
      id: uid("apt"),
      appointment_number: appointmentNumber(seq),
      status: input.status ?? "Requested",
      created_at: nowISO(),
      ...input,
    };
    mutate((d) => {
      d.appointments = [appointment, ...d.appointments];
    });
    const patient = getState().patients.find((p) => p.id === input.patient_id);
    notify({
      title: "New appointment booked",
      body: `${appointment.appointment_number} · ${patient?.first_name ?? "Patient"} ${patient?.last_name ?? ""} on ${appointment.date} at ${appointment.time}.`,
      type: "appointment",
      audience: "all",
      link: "/app/appointments",
    });
    logAudit("Created appointment", "Appointments", appointment.appointment_number);
    return ok(appointment, "Appointment created successfully");
  },
  async updateStatus(id: ID, status: AppointmentStatus): Promise<ApiResponse<Appointment>> {
    await latency();
    const prev = getState().appointments.find((a) => a.id === id)?.status;
    const updated = mutate((d) => {
      d.appointments = d.appointments.map((a) => (a.id === id ? { ...a, status } : a));
      return d.appointments.find((a) => a.id === id)!;
    });
    logAudit("Changed appointment status", "Appointments", updated.appointment_number, prev, status);
    return ok(updated, `Appointment marked ${status}`);
  },
  async checkIn(id: ID): Promise<ApiResponse<{ appointment: Appointment; ticket: ReturnType<typeof buildTicket> }>> {
    await latency();
    const appointment = getState().appointments.find((a) => a.id === id)!;
    const seq = nextSequence("queue");
    const ticket = buildTicket(appointment, seq);
    mutate((d) => {
      d.appointments = d.appointments.map((a) => (a.id === id ? { ...a, status: "Checked In" } : a));
      d.queue = [...d.queue, ticket];
    });
    logAudit("Checked in patient", "Queue", ticket.number);
    return ok({ appointment: { ...appointment, status: "Checked In" }, ticket }, `Checked in — queue number ${ticket.number}`);
  },
};

function buildTicket(appointment: Appointment, seq: number) {
  return {
    id: uid("q"),
    number: queueNumber("OPD", seq),
    patient_id: appointment.patient_id,
    department_id: appointment.department_id,
    doctor_id: appointment.doctor_id,
    appointment_id: appointment.id,
    status: "Waiting" as const,
    created_at: nowISO(),
  };
}

/* ----------------------------------------------------------------- queue -- */

export const queueService = {
  async add(patientId: ID, departmentId: ID, doctorId?: ID) {
    await latency();
    const seq = nextSequence("queue");
    const ticket = {
      id: uid("q"),
      number: queueNumber("OPD", seq),
      patient_id: patientId,
      department_id: departmentId,
      doctor_id: doctorId,
      status: "Waiting" as const,
      created_at: nowISO(),
    };
    mutate((d) => {
      d.queue = [...d.queue, ticket];
    });
    logAudit("Added to queue", "Queue", ticket.number);
    return ok(ticket, `Queue number ${ticket.number} issued`);
  },
  async setStatus(id: ID, status: "Waiting" | "Called" | "In Consultation" | "Completed" | "Skipped") {
    await latency();
    const t = mutate((d) => {
      d.queue = d.queue.map((q) => (q.id === id ? { ...q, status, called_at: status === "Called" ? nowISO() : q.called_at } : q));
      return d.queue.find((q) => q.id === id)!;
    });
    logAudit(`Queue ${status}`, "Queue", t.number);
    return ok(t, `${t.number} — ${status}`);
  },
  async callNext() {
    await latency();
    const next = getState().queue.find((q) => q.status === "Waiting");
    if (!next) return { success: false as const, message: "No patients waiting in the queue." };
    return queueService.setStatus(next.id, "Called");
  },
};

/* -------------------------------------------------------------- clinical -- */

export const clinicalService = {
  async createEncounter(input: Omit<Encounter, "id" | "status">): Promise<ApiResponse<Encounter>> {
    await latency();
    const encounter: Encounter = { ...input, id: uid("enc"), status: "Open" };
    mutate((d) => {
      d.encounters = [encounter, ...d.encounters];
    });
    nextSequence("encounter");
    logAudit("Opened consultation", "Clinical", encounter.id);
    return ok(encounter, "Consultation started");
  },
  async updateEncounter(id: ID, changes: Partial<Encounter>): Promise<ApiResponse<Encounter>> {
    await latency();
    const enc = mutate((d) => {
      d.encounters = d.encounters.map((e) => (e.id === id ? { ...e, ...changes } : e));
      return d.encounters.find((e) => e.id === id)!;
    });
    logAudit("Updated consultation", "Clinical", enc.id, undefined, changes.diagnoses?.map((x) => x.label).join(", "));
    return ok(enc, "Consultation saved");
  },
  async completeEncounter(id: ID) {
    await latency();
    const enc = mutate((d) => {
      d.encounters = d.encounters.map((e) => (e.id === id ? { ...e, status: "Completed" as const } : e));
      return d.encounters.find((e) => e.id === id)!;
    });
    if (enc.appointment_id) await appointmentService.updateStatus(enc.appointment_id, "Completed");
    const ticket = getState().queue.find((q) => q.patient_id === enc.patient_id && q.status !== "Completed");
    if (ticket) await queueService.setStatus(ticket.id, "Completed");
    logAudit("Completed consultation", "Clinical", enc.id);
    return ok(enc, "Consultation completed");
  },
  async recordVitals(input: Omit<Vital, "id" | "bmi" | "recorded_at" | "recorded_by">): Promise<ApiResponse<Vital>> {
    await latency();
    const bmi = input.height > 0 ? Number((input.weight / (input.height * input.height)).toFixed(1)) : 0;
    const vital: Vital = { ...input, id: uid("vit"), bmi, recorded_at: nowISO(), recorded_by: currentUserName() };
    mutate((d) => {
      d.vitals = [vital, ...d.vitals];
    });
    logAudit("Recorded vitals", "Nursing", vital.patient_id);
    return ok(vital, "Vitals recorded");
  },
};

/* ------------------------------------------------------------ laboratory -- */

export const laboratoryService = {
  async order(input: { patient_id: ID; doctor_id: ID; encounter_id?: ID; test_code: string; priority: "Routine" | "Urgent" }): Promise<ApiResponse<LabOrder>> {
    await latency();
    const test = LAB_TESTS.find((t) => t.code === input.test_code)!;
    const seq = nextSequence("lab");
    const order: LabOrder = {
      id: uid("lab"),
      order_number: labNumber(seq),
      patient_id: input.patient_id,
      doctor_id: input.doctor_id,
      encounter_id: input.encounter_id,
      test_code: test.code,
      test_name: test.name,
      priority: input.priority,
      status: "Pending",
      ordered_at: nowISO(),
      results: [],
      price: test.price,
    };
    mutate((d) => {
      d.labOrders = [order, ...d.labOrders];
    });
    notify({ title: "New laboratory order", body: `${order.order_number} · ${test.name} (${input.priority}).`, type: "lab", audience: "all", link: "/app/laboratory" });
    logAudit("Ordered laboratory test", "Laboratory", order.order_number);
    return ok(order, `${test.name} ordered — ${order.order_number}`);
  },
  async setStatus(id: ID, status: LabOrder["status"]) {
    await latency();
    const o = mutate((d) => {
      d.labOrders = d.labOrders.map((x) => (x.id === id ? { ...x, status, collected_at: status === "Sample Collected" ? nowISO() : x.collected_at } : x));
      return d.labOrders.find((x) => x.id === id)!;
    });
    logAudit(`Lab order ${status}`, "Laboratory", o.order_number);
    return ok(o, `${o.order_number} — ${status}`);
  },
  async enterResults(id: ID, results: LabResultLine[], comments?: string) {
    await latency();
    const o = mutate((d) => {
      d.labOrders = d.labOrders.map((x) => (x.id === id ? { ...x, results, comments, status: "Awaiting Verification" as const } : x));
      return d.labOrders.find((x) => x.id === id)!;
    });
    logAudit("Entered lab results", "Laboratory", o.order_number);
    return ok(o, "Results saved and sent for verification");
  },
  async verify(id: ID) {
    await latency();
    const o = mutate((d) => {
      d.labOrders = d.labOrders.map((x) => (x.id === id ? { ...x, status: "Completed" as const, verified_by: currentUserName() } : x));
      return d.labOrders.find((x) => x.id === id)!;
    });
    await billingService.addChargeForPatient(o.patient_id, { description: `Laboratory — ${o.test_name}`, category: "Laboratory", quantity: 1, unit_price: o.price });
    notify({ title: "Lab result available", body: `${o.test_name} results verified for order ${o.order_number}.`, type: "lab", audience: "all", link: "/app/laboratory" });
    logAudit("Verified lab results", "Laboratory", o.order_number);
    return ok(o, "Results verified and released");
  },
  defaultPanel(code: string): LabResultLine[] {
    return (LAB_PANELS[code] ?? []).map((p) => ({ parameter: p.parameter, value: p.normal, unit: p.unit, reference: p.reference, flag: "Normal" as const }));
  },
};

/* ------------------------------------------------------------- radiology -- */

export const radiologyService = {
  async order(input: { patient_id: ID; doctor_id: ID; encounter_id?: ID; study: string; clinical_notes: string; priority: "Routine" | "Urgent" }): Promise<ApiResponse<RadiologyOrder>> {
    await latency();
    const study = RADIOLOGY_STUDIES.find((s) => s.study === input.study)!;
    const seq = nextSequence("radiology");
    const order: RadiologyOrder = {
      id: uid("rad"),
      order_number: radiologyNumber(seq),
      patient_id: input.patient_id,
      doctor_id: input.doctor_id,
      encounter_id: input.encounter_id,
      modality: study.modality,
      study: study.study,
      clinical_notes: input.clinical_notes,
      priority: input.priority,
      status: "Pending",
      ordered_at: nowISO(),
      price: study.price,
    };
    mutate((d) => {
      d.radiologyOrders = [order, ...d.radiologyOrders];
    });
    notify({ title: "New radiology request", body: `${order.order_number} · ${study.study}.`, type: "radiology", audience: "all", link: "/app/radiology" });
    logAudit("Ordered imaging", "Radiology", order.order_number);
    return ok(order, `${study.study} requested — ${order.order_number}`);
  },
  async setStatus(id: ID, status: RadiologyOrder["status"], scheduledFor?: string) {
    await latency();
    const o = mutate((d) => {
      d.radiologyOrders = d.radiologyOrders.map((x) => (x.id === id ? { ...x, status, scheduled_for: scheduledFor ?? x.scheduled_for } : x));
      return d.radiologyOrders.find((x) => x.id === id)!;
    });
    logAudit(`Radiology ${status}`, "Radiology", o.order_number);
    return ok(o, `${o.order_number} — ${status}`);
  },
  async report(id: ID, findings: string, impression: string) {
    await latency();
    const o = mutate((d) => {
      d.radiologyOrders = d.radiologyOrders.map((x) =>
        x.id === id ? { ...x, findings, impression, status: "Completed" as const, reported_by: currentUserName() } : x,
      );
      return d.radiologyOrders.find((x) => x.id === id)!;
    });
    await billingService.addChargeForPatient(o.patient_id, { description: `Radiology — ${o.study}`, category: "Radiology", quantity: 1, unit_price: o.price });
    notify({ title: "Radiology report ready", body: `${o.study} report verified for ${o.order_number}.`, type: "radiology", audience: "all", link: "/app/radiology" });
    logAudit("Published radiology report", "Radiology", o.order_number);
    return ok(o, "Report published");
  },
};

/* -------------------------------------------------------------- pharmacy -- */

export const pharmacyService = {
  async prescribe(input: { patient_id: ID; doctor_id: ID; encounter_id?: ID; items: MedicationLine[]; notes?: string }): Promise<ApiResponse<Prescription>> {
    await latency();
    const seq = nextSequence("prescription");
    const rx: Prescription = {
      id: uid("rx"),
      prescription_number: prescriptionNumber(seq),
      patient_id: input.patient_id,
      doctor_id: input.doctor_id,
      encounter_id: input.encounter_id,
      items: input.items,
      status: "Pending",
      created_at: nowISO(),
      notes: input.notes,
    };
    mutate((d) => {
      d.prescriptions = [rx, ...d.prescriptions];
    });
    notify({ title: "New prescription", body: `${rx.prescription_number} with ${rx.items.length} item(s) awaiting dispensing.`, type: "pharmacy", audience: "all", link: "/app/pharmacy" });
    logAudit("Created prescription", "Pharmacy", rx.prescription_number);
    return ok(rx, `Prescription ${rx.prescription_number} sent to pharmacy`);
  },
  async review(id: ID) {
    await latency();
    const rx = mutate((d) => {
      d.prescriptions = d.prescriptions.map((p) => (p.id === id ? { ...p, status: "Reviewed" as const } : p));
      return d.prescriptions.find((p) => p.id === id)!;
    });
    logAudit("Reviewed prescription", "Pharmacy", rx.prescription_number);
    return ok(rx, "Prescription reviewed");
  },
  async dispense(id: ID): Promise<ApiResponse<Prescription>> {
    await latency();
    const rx = getState().prescriptions.find((p) => p.id === id)!;
    mutate((d) => {
      d.prescriptions = d.prescriptions.map((p) =>
        p.id === id ? { ...p, status: "Dispensed" as const, dispensed_at: nowISO(), dispensed_by: currentUserName() } : p,
      );
      // deduct stock
      d.inventory = d.inventory.map((item) => {
        const line = rx.items.find((l) => l.drug_name === item.name);
        return line ? { ...item, quantity: Math.max(0, item.quantity - line.quantity) } : item;
      });
      d.stockMovements = [
        ...rx.items.map((l) => ({
          id: uid("mov"),
          item_id: d.inventory.find((i) => i.name === l.drug_name)?.id ?? "unknown",
          type: "Dispense" as const,
          quantity: l.quantity,
          reference: rx.prescription_number,
          created_at: nowISO(),
          user: currentUserName(),
        })),
        ...d.stockMovements,
      ];
    });
    const total = rx.items.reduce((s, l) => s + l.quantity * l.unit_price, 0);
    await billingService.addChargeForPatient(rx.patient_id, { description: `Medication — ${rx.prescription_number}`, category: "Medication", quantity: 1, unit_price: total });
    notify({ title: "Prescription dispensed", body: `${rx.prescription_number} dispensed and billed (KES ${total.toLocaleString()}).`, type: "pharmacy", audience: "all", link: "/app/pharmacy" });
    logAudit("Dispensed prescription", "Pharmacy", rx.prescription_number);
    return ok({ ...rx, status: "Dispensed" }, "Medication dispensed and stock updated");
  },
};

/* ------------------------------------------------------------- inventory -- */

export const inventoryService = {
  async adjust(itemId: ID, type: "Receive" | "Issue" | "Adjustment", quantity: number, reference: string) {
    await latency();
    const item = mutate((d) => {
      d.inventory = d.inventory.map((i) =>
        i.id === itemId ? { ...i, quantity: Math.max(0, type === "Receive" ? i.quantity + quantity : i.quantity - quantity) } : i,
      );
      d.stockMovements = [{ id: uid("mov"), item_id: itemId, type, quantity, reference, created_at: nowISO(), user: currentUserName() }, ...d.stockMovements];
      return d.inventory.find((i) => i.id === itemId)!;
    });
    if (item.quantity <= item.reorder_level) {
      notify({ title: "Low stock alert", body: `${item.name} is at ${item.quantity} ${item.unit} (reorder level ${item.reorder_level}).`, type: "inventory", audience: "all", link: "/app/inventory" });
    }
    logAudit(`Stock ${type.toLowerCase()}`, "Inventory", item.sku, undefined, `${quantity} ${item.unit}`);
    return ok(item, `${item.name} updated`);
  },
  async addItem(item: Omit<InventoryItem, "id">) {
    await latency();
    const created = { ...item, id: uid("inv") };
    mutate((d) => {
      d.inventory = [created, ...d.inventory];
    });
    logAudit("Added inventory item", "Inventory", created.sku);
    return ok(created, "Inventory item added");
  },
  async setPurchaseOrderStatus(id: ID, status: "Requested" | "Approved" | "Ordered" | "Received" | "Cancelled") {
    await latency();
    const po = mutate((d) => {
      d.purchaseOrders = d.purchaseOrders.map((p) => (p.id === id ? { ...p, status } : p));
      const found = d.purchaseOrders.find((p) => p.id === id)!;
      if (status === "Received") {
        d.inventory = d.inventory.map((i) => {
          const line = found.items.find((l) => l.item_id === i.id);
          return line ? { ...i, quantity: i.quantity + line.quantity } : i;
        });
      }
      return found;
    });
    logAudit(`Purchase order ${status}`, "Procurement", po.po_number);
    return ok(po, `${po.po_number} — ${status}`);
  },
};

/* --------------------------------------------------------------- billing -- */

export const billingService = {
  async createInvoice(patientId: ID, items: InvoiceItem[], discount = 0): Promise<ApiResponse<Invoice>> {
    await latency();
    const seq = nextSequence("invoice");
    const patient = getState().patients.find((p) => p.id === patientId)!;
    const invoice: Invoice = {
      id: uid("invc"),
      invoice_number: invoiceNumber(seq),
      patient_id: patientId,
      date: nowISO().slice(0, 10),
      items,
      discount,
      tax: 0,
      paid: 0,
      payer: patient.payer,
      status: "Pending",
    };
    mutate((d) => {
      d.invoices = [invoice, ...d.invoices];
    });
    logAudit("Created invoice", "Billing", invoice.invoice_number);
    return ok(invoice, `Invoice ${invoice.invoice_number} created`);
  },
  /** Appends a charge to the patient's open invoice, creating one if needed. */
  async addChargeForPatient(patientId: ID, item: InvoiceItem): Promise<ApiResponse<Invoice>> {
    const open = getState().invoices.find((i) => i.patient_id === patientId && (i.status === "Pending" || i.status === "Draft" || i.status === "Partially Paid"));
    if (!open) return billingService.createInvoice(patientId, [item]);
    const updated = mutate((d) => {
      d.invoices = d.invoices.map((i) => (i.id === open.id ? { ...i, items: [...i.items, item] } : i));
      return d.invoices.find((i) => i.id === open.id)!;
    });
    return ok(updated, `Charge added to ${updated.invoice_number}`);
  },
  async recordPayment(invoiceId: ID, amount: number, method: Payment["method"], reference: string): Promise<ApiResponse<Payment>> {
    await latency();
    const seq = nextSequence("receipt");
    const invoice = getState().invoices.find((i) => i.id === invoiceId)!;
    const payment: Payment = {
      id: uid("pay"),
      receipt_number: receiptNumber(seq),
      invoice_id: invoiceId,
      patient_id: invoice.patient_id,
      amount,
      method,
      reference,
      created_at: nowISO(),
      received_by: currentUserName(),
    };
    mutate((d) => {
      d.payments = [payment, ...d.payments];
      d.invoices = d.invoices.map((i) => {
        if (i.id !== invoiceId) return i;
        const paid = i.paid + amount;
        const total = invoiceTotal(i);
        return { ...i, paid, status: paid >= total ? ("Paid" as const) : ("Partially Paid" as const) };
      });
    });
    notify({ title: "Payment received", body: `KES ${amount.toLocaleString()} received against ${invoice.invoice_number} (${method}).`, type: "payment", audience: "all", link: "/app/billing" });
    logAudit("Recorded payment", "Billing", invoice.invoice_number, undefined, `KES ${amount.toLocaleString()} (${method})`);
    return ok(payment, `Receipt ${payment.receipt_number} issued`);
  },
  async setStatus(invoiceId: ID, status: Invoice["status"]) {
    await latency();
    const inv = mutate((d) => {
      d.invoices = d.invoices.map((i) => (i.id === invoiceId ? { ...i, status } : i));
      return d.invoices.find((i) => i.id === invoiceId)!;
    });
    logAudit(`Invoice ${status}`, "Billing", inv.invoice_number);
    return ok(inv, `${inv.invoice_number} — ${status}`);
  },
};

export function invoiceSubtotal(i: Invoice) {
  return i.items.reduce((s, it) => s + it.quantity * it.unit_price, 0);
}
export function invoiceTotal(i: Invoice) {
  return invoiceSubtotal(i) - i.discount + i.tax;
}
export function invoiceBalance(i: Invoice) {
  return Math.max(0, invoiceTotal(i) - i.paid);
}

/* ------------------------------------------------------------- insurance --
 * DEMO ONLY. No real insurer is contacted. The shapes below match the planned
 * Laravel endpoints so a real EligibilityService/ClaimsService can be plugged
 * in without changing any UI component.
 * ------------------------------------------------------------------------- */

export const insuranceService = {
  /** GET /api/v1/insurance/providers */
  async providers() {
    await latency();
    return ok(getState().providers);
  },
  /** POST /api/v1/insurance/eligibility/check — simulated response. */
  async checkEligibility(policyId: ID): Promise<ApiResponse<EligibilityCheck>> {
    await new Promise((r) => setTimeout(r, 900));
    const policy = getState().policies.find((p) => p.id === policyId)!;
    const check: EligibilityCheck = {
      id: uid("elg"),
      policy_id: policy.id,
      patient_id: policy.patient_id,
      checked_at: nowISO(),
      member_verified: true,
      policy_active: policy.status === "Active",
      coverage: {
        outpatient: true,
        inpatient: true,
        maternity: policy.annual_limit >= 400000,
        dental: policy.annual_limit >= 400000,
        optical: policy.annual_limit >= 500000,
        pharmacy: true,
      },
      annual_limit: policy.annual_limit,
      remaining_balance: Math.max(0, policy.annual_limit - policy.used_amount),
      reference: `ELG-${Date.now().toString().slice(-8)}`,
    };
    mutate((d) => {
      d.eligibilityChecks = [check, ...d.eligibilityChecks];
    });
    logAudit("Checked insurance eligibility", "Insurance", policy.member_number);
    return ok(check, "Eligibility response received (demo)");
  },
  /** POST /api/v1/insurance/authorizations */
  async requestAuthorization(input: { patient_id: ID; policy_id: ID; procedure: string; estimated_cost: number; requested_by: ID }): Promise<ApiResponse<Authorization>> {
    await latency();
    const seq = nextSequence("authorization");
    const auth: Authorization = {
      id: uid("auth"),
      authorization_number: authorizationNumber(seq),
      ...input,
      requested_at: nowISO(),
      status: "Pending",
    };
    mutate((d) => {
      d.authorizations = [auth, ...d.authorizations];
    });
    notify({ title: "Pre-authorization requested", body: `${auth.authorization_number} for ${input.procedure}.`, type: "insurance", audience: "all", link: "/app/insurance" });
    logAudit("Requested pre-authorization", "Insurance", auth.authorization_number);
    return ok(auth, `Pre-authorization ${auth.authorization_number} submitted (demo)`);
  },
  async setAuthorizationStatus(id: ID, status: Authorization["status"], notes?: string) {
    await latency();
    const a = mutate((d) => {
      d.authorizations = d.authorizations.map((x) => (x.id === id ? { ...x, status, notes } : x));
      return d.authorizations.find((x) => x.id === id)!;
    });
    notify({ title: `Authorization ${status.toLowerCase()}`, body: `${a.authorization_number} · ${a.procedure}.`, type: "insurance", audience: "all", link: "/app/insurance" });
    logAudit(`Authorization ${status}`, "Insurance", a.authorization_number);
    return ok(a, `${a.authorization_number} — ${status}`);
  },
  /** POST /api/v1/insurance/claims */
  async createClaim(invoiceId: ID): Promise<ApiResponse<Claim>> {
    await latency();
    const invoice = getState().invoices.find((i) => i.id === invoiceId)!;
    const policy = getState().policies.find((p) => p.patient_id === invoice.patient_id);
    const seq = nextSequence("claim");
    const claim: Claim = {
      id: uid("clm"),
      claim_number: claimNumber(seq),
      patient_id: invoice.patient_id,
      provider_id: policy?.provider_id ?? "ins_1",
      invoice_id: invoiceId,
      amount: invoiceTotal(invoice) - invoice.paid,
      status: "Draft",
      created_at: nowISO(),
    };
    mutate((d) => {
      d.claims = [claim, ...d.claims];
    });
    logAudit("Generated insurance claim", "Claims", claim.claim_number);
    return ok(claim, `Claim ${claim.claim_number} generated`);
  },
  async setClaimStatus(id: ID, status: ClaimStatus, remarks?: string) {
    await latency();
    const c = mutate((d) => {
      d.claims = d.claims.map((x) =>
        x.id === id
          ? {
              ...x,
              status,
              remarks: remarks ?? x.remarks,
              submitted_at: status === "Submitted" ? nowISO() : x.submitted_at,
              approved_amount: status === "Approved" || status === "Paid" ? x.amount : status === "Partially Approved" ? Math.round(x.amount * 0.7) : x.approved_amount,
            }
          : x,
      );
      return d.claims.find((x) => x.id === id)!;
    });
    if (status === "Paid") {
      await billingService.recordPayment(c.invoice_id, c.approved_amount ?? c.amount, "Insurance", c.claim_number);
    }
    notify({ title: `Claim ${status.toLowerCase()}`, body: `${c.claim_number} · KES ${c.amount.toLocaleString()}.`, type: "insurance", audience: "all", link: "/app/claims" });
    logAudit(`Claim ${status}`, "Claims", c.claim_number);
    return ok(c, `${c.claim_number} — ${status}`);
  },
};

/* ------------------------------------------------------- admissions/beds -- */

export const admissionService = {
  async admit(input: { patient_id: ID; doctor_id: ID; bed_id: ID; reason: string }): Promise<ApiResponse<Admission>> {
    await latency();
    const bed = getState().beds.find((b) => b.id === input.bed_id)!;
    const seq = nextSequence("admission");
    const admission: Admission = {
      id: uid("adm"),
      admission_number: admissionNumber(seq),
      patient_id: input.patient_id,
      doctor_id: input.doctor_id,
      bed_id: bed.id,
      ward_id: bed.ward_id,
      reason: input.reason,
      admitted_at: nowISO(),
      status: "Admitted",
    };
    mutate((d) => {
      d.admissions = [admission, ...d.admissions];
      d.beds = d.beds.map((b) => (b.id === bed.id ? { ...b, status: "Occupied" as const, patient_id: input.patient_id } : b));
      d.patients = d.patients.map((p) => (p.id === input.patient_id ? { ...p, status: "Admitted" as const } : p));
    });
    notify({ title: "Patient admitted", body: `${admission.admission_number} · bed ${bed.label}.`, type: "critical", audience: "all", link: "/app/inpatient" });
    logAudit("Admitted patient", "Inpatient", admission.admission_number);
    return ok(admission, `Admitted to bed ${bed.label}`);
  },
  async discharge(id: ID, summary: string) {
    await latency();
    const adm = mutate((d) => {
      d.admissions = d.admissions.map((a) => (a.id === id ? { ...a, status: "Discharged" as const, discharged_at: nowISO(), discharge_summary: summary } : a));
      const found = d.admissions.find((a) => a.id === id)!;
      d.beds = d.beds.map((b) => (b.id === found.bed_id ? { ...b, status: "Cleaning" as const, patient_id: undefined } : b));
      d.patients = d.patients.map((p) => (p.id === found.patient_id ? { ...p, status: "Active" as const } : p));
      return found;
    });
    const bed = getState().beds.find((b) => b.id === adm.bed_id)!;
    const nights = Math.max(1, Math.round((Date.now() - new Date(adm.admitted_at).getTime()) / 86400000));
    await billingService.addChargeForPatient(adm.patient_id, { description: `Bed charges — ${bed.label} (${nights} night(s))`, category: "Bed Charges", quantity: nights, unit_price: bed.daily_rate });
    logAudit("Discharged patient", "Inpatient", adm.admission_number);
    return ok(adm, "Patient discharged and bed released");
  },
  async setBedStatus(bedId: ID, status: "Available" | "Occupied" | "Reserved" | "Cleaning" | "Maintenance") {
    await latency();
    const b = mutate((d) => {
      d.beds = d.beds.map((x) => (x.id === bedId ? { ...x, status } : x));
      return d.beds.find((x) => x.id === bedId)!;
    });
    logAudit(`Bed ${status}`, "Inpatient", b.label);
    return ok(b, `${b.label} — ${status}`);
  },
};

/* ---------------------------------------------------------------- theatre -- */

export const theatreService = {
  async schedule(input: Omit<Surgery, "id" | "case_number" | "status">) {
    await latency();
    const seq = nextSequence("theatre");
    const surgery: Surgery = { ...input, id: uid("sur"), case_number: caseNumber("THE", seq), status: "Scheduled" };
    mutate((d) => {
      d.surgeries = [surgery, ...d.surgeries];
    });
    logAudit("Scheduled surgery", "Theatre", surgery.case_number);
    return ok(surgery, `Surgery ${surgery.case_number} scheduled`);
  },
  async setStatus(id: ID, status: Surgery["status"]) {
    await latency();
    const s = mutate((d) => {
      d.surgeries = d.surgeries.map((x) => (x.id === id ? { ...x, status } : x));
      return d.surgeries.find((x) => x.id === id)!;
    });
    if (status === "Completed") {
      await billingService.addChargeForPatient(s.patient_id, { description: `Theatre — ${s.procedure}`, category: "Theatre", quantity: 1, unit_price: 45000 });
    }
    logAudit(`Theatre case ${status}`, "Theatre", s.case_number);
    return ok(s, `${s.case_number} — ${status}`);
  },
};

/* ------------------------------------------------------------- emergency -- */

export const emergencyService = {
  async register(input: { patient_id: ID; complaint: string; triage: EmergencyCase["triage"]; attending: string }) {
    await latency();
    const seq = nextSequence("emergency");
    const kase: EmergencyCase = {
      id: uid("er"),
      case_number: caseNumber("ER", seq),
      patient_id: input.patient_id,
      arrival_at: nowISO(),
      complaint: input.complaint,
      triage: input.triage,
      stage: "Triage",
      attending: input.attending,
    };
    mutate((d) => {
      d.emergencyCases = [kase, ...d.emergencyCases];
    });
    notify({ title: `Emergency arrival (${input.triage})`, body: `${kase.case_number} · ${input.complaint}.`, type: "critical", audience: "all", link: "/app/emergency" });
    logAudit("Registered emergency case", "Emergency", kase.case_number);
    return ok(kase, `Emergency case ${kase.case_number} created`);
  },
  async setStage(id: ID, stage: EmergencyCase["stage"], disposition?: EmergencyCase["disposition"]) {
    await latency();
    const k = mutate((d) => {
      d.emergencyCases = d.emergencyCases.map((x) => (x.id === id ? { ...x, stage, disposition } : x));
      return d.emergencyCases.find((x) => x.id === id)!;
    });
    logAudit(`Emergency ${stage}`, "Emergency", k.case_number);
    return ok(k, `${k.case_number} — ${stage}`);
  },
};

/* --------------------------------------------------------------- nursing -- */

export const nursingService = {
  async addNote(input: Omit<NursingNote, "id" | "created_at" | "nurse">) {
    await latency();
    const note: NursingNote = { ...input, id: uid("nn"), created_at: nowISO(), nurse: currentUserName() };
    mutate((d) => {
      d.nursingNotes = [note, ...d.nursingNotes];
    });
    logAudit("Recorded nursing note", "Nursing", note.patient_id);
    return ok(note, "Nursing note saved");
  },
};

/* --------------------------------------------------------- notifications -- */

export const notificationService = {
  async markRead(id: ID) {
    mutate((d) => {
      d.notifications = d.notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    });
    return ok(true, "Marked as read");
  },
  async markAllRead() {
    mutate((d) => {
      d.notifications = d.notifications.map((n) => ({ ...n, read: true }));
    });
    return ok(true, "All notifications marked as read");
  },
};

/* ---------------------------------------------------------------- roles --- */

export function usersForRole(role: Role) {
  return DEMO_USERS.filter((u) => u.role === role);
}
