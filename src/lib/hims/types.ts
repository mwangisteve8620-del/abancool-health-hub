/**
 * ABANCOOL HOSPITAL — domain types.
 *
 * These interfaces mirror the payload shapes of the future Laravel REST API
 * (see docs/API_CONTRACT.md). The mock service layer in `src/lib/hims/services`
 * returns exactly these shapes, so swapping mock -> HTTP requires no UI change.
 */

export type ID = string;

export type Role =
  | "super_admin"
  | "hospital_admin"
  | "doctor"
  | "nurse"
  | "receptionist"
  | "cashier"
  | "pharmacist"
  | "lab_technician"
  | "radiologist"
  | "radiology_technician"
  | "theatre_nurse"
  | "insurance_officer"
  | "hr"
  | "procurement"
  | "inventory_manager"
  | "patient";

export type PermissionModule =
  | "dashboard"
  | "patients"
  | "appointments"
  | "queue"
  | "opd"
  | "inpatient"
  | "emergency"
  | "doctors"
  | "nursing"
  | "laboratory"
  | "radiology"
  | "pharmacy"
  | "theatre"
  | "maternity"
  | "pediatrics"
  | "dental"
  | "billing"
  | "insurance"
  | "claims"
  | "payments"
  | "inventory"
  | "procurement"
  | "hr"
  | "reports"
  | "notifications"
  | "audit"
  | "settings"
  | "portal";

export type PermissionLevel = "none" | "view" | "edit" | "full";

export interface User {
  id: ID;
  name: string;
  email: string;
  phone: string;
  role: Role;
  department_id?: ID;
  staff_id?: ID;
  patient_id?: ID;
  avatar_initials: string;
  title?: string;
}

export interface Department {
  id: ID;
  slug: string;
  name: string;
  summary: string;
  description: string;
  services: string[];
  hours: string;
  phone: string;
  icon: string;
  is_clinical: boolean;
}

export interface Doctor {
  id: ID;
  name: string;
  title: string;
  gender: "Male" | "Female";
  specialty: string;
  department_id: ID;
  qualifications: string;
  experience_years: number;
  languages: string[];
  consultation_fee: number;
  availability: string[];
  bio: string;
  services: string[];
  rating: number;
  reviews: number;
  location: string;
  initials: string;
}

export type PatientStatus = "Active" | "Admitted" | "Inactive";

export interface Patient {
  id: ID;
  patient_number: string;
  first_name: string;
  last_name: string;
  dob: string;
  gender: "Male" | "Female";
  phone: string;
  email: string;
  national_id: string;
  address: string;
  county: string;
  blood_group: string;
  allergies: string[];
  chronic_conditions: string[];
  next_of_kin: { name: string; relationship: string; phone: string };
  payer: "Self Pay" | "Insurance";
  insurance_policy_id?: ID;
  status: PatientStatus;
  registered_at: string;
  last_visit?: string;
}

export type AppointmentStatus =
  | "Requested"
  | "Confirmed"
  | "Checked In"
  | "In Consultation"
  | "Completed"
  | "Cancelled"
  | "No Show";

export interface Appointment {
  id: ID;
  appointment_number: string;
  patient_id: ID;
  doctor_id: ID;
  department_id: ID;
  service: string;
  date: string;
  time: string;
  reason: string;
  payer: "Self Pay" | "Insurance";
  status: AppointmentStatus;
  created_at: string;
}

export interface QueueTicket {
  id: ID;
  number: string;
  patient_id: ID;
  department_id: ID;
  doctor_id?: ID;
  appointment_id?: ID;
  status: "Waiting" | "Called" | "In Consultation" | "Completed" | "Skipped";
  created_at: string;
  called_at?: string;
}

export interface Vital {
  id: ID;
  patient_id: ID;
  encounter_id?: ID;
  recorded_at: string;
  recorded_by: string;
  temperature: number;
  systolic: number;
  diastolic: number;
  pulse: number;
  respiratory_rate: number;
  spo2: number;
  weight: number;
  height: number;
  bmi: number;
  pain_score: number;
  notes?: string;
}

export interface Diagnosis {
  code: string;
  label: string;
  type: "Primary" | "Secondary";
}

export interface Encounter {
  id: ID;
  patient_id: ID;
  doctor_id: ID;
  department_id: ID;
  appointment_id?: ID;
  date: string;
  chief_complaint: string;
  hpi: string;
  past_medical_history: string;
  family_history: string;
  social_history: string;
  examination: string;
  assessment: string;
  diagnoses: Diagnosis[];
  treatment_plan: string;
  follow_up: string;
  status: "Open" | "Completed";
}

export type LabStatus =
  | "Pending"
  | "Sample Collected"
  | "Processing"
  | "Awaiting Verification"
  | "Completed"
  | "Cancelled";

export interface LabResultLine {
  parameter: string;
  value: string;
  unit: string;
  reference: string;
  flag: "Normal" | "High" | "Low" | "Critical";
}

export interface LabOrder {
  id: ID;
  order_number: string;
  patient_id: ID;
  doctor_id: ID;
  encounter_id?: ID;
  test_code: string;
  test_name: string;
  priority: "Routine" | "Urgent";
  status: LabStatus;
  ordered_at: string;
  collected_at?: string;
  results: LabResultLine[];
  comments?: string;
  verified_by?: string;
  price: number;
}

export type RadiologyStatus =
  | "Pending"
  | "Scheduled"
  | "In Progress"
  | "Awaiting Report"
  | "Completed"
  | "Cancelled";

export interface RadiologyOrder {
  id: ID;
  order_number: string;
  patient_id: ID;
  doctor_id: ID;
  encounter_id?: ID;
  modality: "X-Ray" | "Ultrasound" | "CT" | "MRI" | "Mammography" | "OPG";
  study: string;
  clinical_notes: string;
  priority: "Routine" | "Urgent";
  status: RadiologyStatus;
  ordered_at: string;
  scheduled_for?: string;
  findings?: string;
  impression?: string;
  reported_by?: string;
  price: number;
}

export interface MedicationLine {
  drug_name: string;
  generic_name: string;
  strength: string;
  dosage: string;
  frequency: string;
  route: string;
  duration: string;
  quantity: number;
  instructions: string;
  item_id?: ID;
  unit_price: number;
}

export interface Prescription {
  id: ID;
  prescription_number: string;
  patient_id: ID;
  doctor_id: ID;
  encounter_id?: ID;
  items: MedicationLine[];
  status: "Pending" | "Reviewed" | "Dispensed" | "Cancelled";
  created_at: string;
  dispensed_at?: string;
  dispensed_by?: string;
  notes?: string;
}

export type InventoryCategory =
  | "Pharmaceuticals"
  | "Medical Supplies"
  | "Laboratory Supplies"
  | "Surgical Supplies"
  | "Consumables"
  | "Office Supplies"
  | "Equipment";

export interface InventoryItem {
  id: ID;
  sku: string;
  name: string;
  generic_name?: string;
  category: InventoryCategory;
  unit: string;
  quantity: number;
  reorder_level: number;
  unit_price: number;
  expiry_date?: string;
  supplier_id: ID;
  location: string;
}

export interface StockMovement {
  id: ID;
  item_id: ID;
  type: "Receive" | "Issue" | "Adjustment" | "Dispense";
  quantity: number;
  reference: string;
  created_at: string;
  user: string;
}

export interface Supplier {
  id: ID;
  name: string;
  contact_person: string;
  phone: string;
  email: string;
  category: string;
  status: "Active" | "Inactive";
}

export interface PurchaseOrder {
  id: ID;
  po_number: string;
  supplier_id: ID;
  department: string;
  items: { item_id: ID; name: string; quantity: number; unit_price: number }[];
  total: number;
  status: "Requested" | "Approved" | "Ordered" | "Received" | "Cancelled";
  created_at: string;
}

export interface Ward {
  id: ID;
  name: string;
  type: string;
  floor: string;
}

export type BedStatus = "Available" | "Occupied" | "Reserved" | "Cleaning" | "Maintenance";

export interface Bed {
  id: ID;
  ward_id: ID;
  room: string;
  label: string;
  status: BedStatus;
  patient_id?: ID;
  daily_rate: number;
}

export interface Admission {
  id: ID;
  admission_number: string;
  patient_id: ID;
  doctor_id: ID;
  bed_id: ID;
  ward_id: ID;
  reason: string;
  admitted_at: string;
  discharged_at?: string;
  status: "Admitted" | "Discharged";
  discharge_summary?: string;
}

export interface Surgery {
  id: ID;
  case_number: string;
  patient_id: ID;
  surgeon_id: ID;
  anesthetist: string;
  theatre_nurse: string;
  theatre: string;
  procedure: string;
  scheduled_at: string;
  duration_minutes: number;
  status: "Scheduled" | "Pre-op" | "In Theatre" | "Recovery" | "Completed" | "Cancelled";
  notes?: string;
}

export interface EmergencyCase {
  id: ID;
  case_number: string;
  patient_id: ID;
  arrival_at: string;
  complaint: string;
  triage: "RED" | "ORANGE" | "YELLOW" | "GREEN";
  stage: "Arrival" | "Triage" | "Assessment" | "Treatment" | "Observation" | "Disposed";
  disposition?: "Admitted" | "Discharged" | "Referred";
  attending: string;
}

export interface MaternityRecord {
  id: ID;
  patient_id: ID;
  stage: "Antenatal" | "Labor" | "Delivery" | "Postnatal";
  gestation_weeks?: number;
  delivery_at?: string;
  delivery_type?: "Normal (SVD)" | "Caesarean" | "Assisted";
  baby_sex?: "Male" | "Female";
  birth_weight_kg?: number;
  apgar?: string;
  complications?: string;
  doctor_id: ID;
  midwife: string;
}

export interface NursingNote {
  id: ID;
  patient_id: ID;
  created_at: string;
  nurse: string;
  observation: string;
  intake_ml: number;
  output_ml: number;
  consciousness: "Alert" | "Drowsy" | "Unresponsive";
  medication_given?: string;
}

export type InvoiceStatus = "Draft" | "Pending" | "Partially Paid" | "Paid" | "Cancelled";

export interface InvoiceItem {
  description: string;
  category:
    | "Consultation"
    | "Laboratory"
    | "Radiology"
    | "Procedure"
    | "Medication"
    | "Bed Charges"
    | "Theatre"
    | "Nursing"
    | "Other";
  quantity: number;
  unit_price: number;
}

export interface Invoice {
  id: ID;
  invoice_number: string;
  patient_id: ID;
  date: string;
  items: InvoiceItem[];
  discount: number;
  tax: number;
  paid: number;
  payer: "Self Pay" | "Insurance";
  status: InvoiceStatus;
}

export interface Payment {
  id: ID;
  receipt_number: string;
  invoice_id: ID;
  patient_id: ID;
  amount: number;
  method: "Cash" | "Card" | "Mobile Money" | "Bank" | "Insurance";
  reference: string;
  created_at: string;
  received_by: string;
}

export interface InsuranceProvider {
  id: ID;
  name: string;
  code: string;
  type: "Public" | "Private";
  contact: string;
  claim_turnaround_days: number;
  active: boolean;
}

export interface InsurancePolicy {
  id: ID;
  patient_id: ID;
  provider_id: ID;
  member_number: string;
  policy_number: string;
  principal_member: string;
  relationship: "Principal" | "Spouse" | "Child" | "Dependant";
  scheme: string;
  annual_limit: number;
  used_amount: number;
  expiry: string;
  status: "Active" | "Expired" | "Suspended";
}

export interface EligibilityCheck {
  id: ID;
  policy_id: ID;
  patient_id: ID;
  checked_at: string;
  member_verified: boolean;
  policy_active: boolean;
  coverage: {
    outpatient: boolean;
    inpatient: boolean;
    maternity: boolean;
    dental: boolean;
    optical: boolean;
    pharmacy: boolean;
  };
  annual_limit: number;
  remaining_balance: number;
  reference: string;
}

export interface Authorization {
  id: ID;
  authorization_number: string;
  patient_id: ID;
  policy_id: ID;
  procedure: string;
  estimated_cost: number;
  requested_by: ID;
  requested_at: string;
  status: "Pending" | "Approved" | "Rejected" | "More Information Required";
  notes?: string;
}

export type ClaimStatus =
  | "Draft"
  | "Validated"
  | "Submitted"
  | "Pending"
  | "Approved"
  | "Partially Approved"
  | "Rejected"
  | "Paid";

export interface Claim {
  id: ID;
  claim_number: string;
  patient_id: ID;
  provider_id: ID;
  invoice_id: ID;
  amount: number;
  approved_amount?: number;
  submitted_at?: string;
  status: ClaimStatus;
  remarks?: string;
  created_at: string;
}

export interface Employee {
  id: ID;
  employee_number: string;
  name: string;
  department_id: ID;
  role: string;
  employment_status: "Permanent" | "Contract" | "Locum" | "Intern";
  phone: string;
  email: string;
  joined_at: string;
  shift: "Day" | "Night" | "Rotating";
  leave_balance: number;
  gross_salary: number;
  attendance_today: "Present" | "Absent" | "On Leave";
}

export interface Notification {
  id: ID;
  title: string;
  body: string;
  type:
    | "appointment"
    | "lab"
    | "radiology"
    | "pharmacy"
    | "payment"
    | "insurance"
    | "inventory"
    | "critical";
  created_at: string;
  read: boolean;
  audience: Role[] | "all";
  link?: string;
}

export interface AuditLog {
  id: ID;
  user: string;
  action: string;
  module: string;
  record: string;
  timestamp: string;
  device: string;
  previous_value?: string;
  new_value?: string;
}

export interface PatientDocument {
  id: ID;
  patient_id: ID;
  name: string;
  type:
    | "National ID"
    | "Insurance Card"
    | "Referral Letter"
    | "Lab Report"
    | "Radiology Report"
    | "Discharge Summary"
    | "Other";
  size_kb: number;
  uploaded_at: string;
  uploaded_by: string;
}

export interface HospitalProfile {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  emergency_phone: string;
  email: string;
  hours: string;
  kra_pin: string;
  paybill: string;
  socials: { label: string; url: string }[];
}

export interface HimsState {
  version: number;
  departments: Department[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  queue: QueueTicket[];
  encounters: Encounter[];
  vitals: Vital[];
  labOrders: LabOrder[];
  radiologyOrders: RadiologyOrder[];
  prescriptions: Prescription[];
  inventory: InventoryItem[];
  stockMovements: StockMovement[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  wards: Ward[];
  beds: Bed[];
  admissions: Admission[];
  surgeries: Surgery[];
  emergencyCases: EmergencyCase[];
  maternity: MaternityRecord[];
  nursingNotes: NursingNote[];
  invoices: Invoice[];
  payments: Payment[];
  providers: InsuranceProvider[];
  policies: InsurancePolicy[];
  eligibilityChecks: EligibilityCheck[];
  authorizations: Authorization[];
  claims: Claim[];
  employees: Employee[];
  notifications: Notification[];
  auditLogs: AuditLog[];
  documents: PatientDocument[];
  hospital: HospitalProfile;
  counters: Record<string, number>;
  session: { user_id: ID | null };
}

/** Standard Laravel-style envelopes used by every service call. */
export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  success: false;
  message: string;
  errors: Record<string, string[]>;
}

export interface Paginated<T> {
  data: T[];
  meta: { current_page: number; last_page: number; per_page: number; total: number };
}
