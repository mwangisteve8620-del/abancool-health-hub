/** Roles, demo accounts, permission matrix and role-aware navigation. */

import type { PermissionLevel, PermissionModule, Role, User } from "./types";

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: "Super Admin",
  hospital_admin: "Hospital Administrator",
  doctor: "Doctor",
  nurse: "Nurse",
  receptionist: "Receptionist",
  cashier: "Cashier",
  pharmacist: "Pharmacist",
  lab_technician: "Laboratory Technician",
  radiologist: "Radiologist",
  radiology_technician: "Radiology Technician",
  theatre_nurse: "Theatre Nurse",
  insurance_officer: "Insurance Officer",
  hr: "HR",
  procurement: "Procurement",
  inventory_manager: "Inventory Manager",
  patient: "Patient",
};

/** Demo-only accounts. No real passwords are stored — see SECURITY note in README. */
export const DEMO_USERS: User[] = [
  { id: "usr_1", name: "Aisha Abdalla", email: "superadmin@abancool.demo", phone: "+254700820101", role: "super_admin", avatar_initials: "AA", title: "System Owner" },
  { id: "usr_2", name: "Charles Mwenda", email: "admin@abancool.demo", phone: "+254700820102", role: "hospital_admin", avatar_initials: "CM", title: "Hospital Administrator" },
  { id: "usr_3", name: "Dr. Samuel Kiptoo", email: "doctor@abancool.demo", phone: "+254700820103", role: "doctor", staff_id: "doc_4", avatar_initials: "SK", title: "Consultant Physician" },
  { id: "usr_4", name: "Joyce Mueni", email: "nurse@abancool.demo", phone: "+254700820104", role: "nurse", avatar_initials: "JM", title: "Registered Nurse" },
  { id: "usr_5", name: "Brenda Akinyi", email: "reception@abancool.demo", phone: "+254700820105", role: "receptionist", avatar_initials: "BA", title: "Front Office" },
  { id: "usr_6", name: "Paul Kimeu", email: "cashier@abancool.demo", phone: "+254700820106", role: "cashier", avatar_initials: "PK", title: "Cashier" },
  { id: "usr_7", name: "Halima Noor", email: "pharmacy@abancool.demo", phone: "+254700820107", role: "pharmacist", avatar_initials: "HN", title: "Pharmacist" },
  { id: "usr_8", name: "Alex Kimani", email: "lab@abancool.demo", phone: "+254700820108", role: "lab_technician", avatar_initials: "AK", title: "Laboratory Technologist" },
  { id: "usr_9", name: "Dr. Felix Ochieng", email: "radiologist@abancool.demo", phone: "+254700820109", role: "radiologist", staff_id: "doc_19", avatar_initials: "FO", title: "Consultant Radiologist" },
  { id: "usr_10", name: "Titus Mwangi", email: "radtech@abancool.demo", phone: "+254700820110", role: "radiology_technician", avatar_initials: "TM", title: "Radiographer" },
  { id: "usr_11", name: "Susan Chelimo", email: "theatre@abancool.demo", phone: "+254700820111", role: "theatre_nurse", avatar_initials: "SC", title: "Theatre Nurse" },
  { id: "usr_12", name: "George Ndungu", email: "insurance@abancool.demo", phone: "+254700820112", role: "insurance_officer", avatar_initials: "GN", title: "Insurance Officer" },
  { id: "usr_13", name: "Lilian Wairimu", email: "hr@abancool.demo", phone: "+254700820113", role: "hr", avatar_initials: "LW", title: "HR Manager" },
  { id: "usr_14", name: "Kelvin Otieno", email: "procurement@abancool.demo", phone: "+254700820114", role: "procurement", avatar_initials: "KO", title: "Procurement Officer" },
  { id: "usr_15", name: "Nancy Wafula", email: "stores@abancool.demo", phone: "+254700820115", role: "inventory_manager", avatar_initials: "NW", title: "Inventory Manager" },
  { id: "usr_16", name: "Mary Wanjiku", email: "patient@abancool.demo", phone: "+254712345678", role: "patient", patient_id: "pat_1", avatar_initials: "MW", title: "Patient" },
];

const FULL: PermissionLevel = "full";

function matrix(entries: Partial<Record<PermissionModule, PermissionLevel>>): Record<PermissionModule, PermissionLevel> {
  const base = {} as Record<PermissionModule, PermissionLevel>;
  (
    [
      "dashboard", "patients", "appointments", "queue", "opd", "inpatient", "emergency", "doctors", "nursing",
      "laboratory", "radiology", "pharmacy", "theatre", "maternity", "pediatrics", "dental", "billing", "insurance",
      "claims", "payments", "inventory", "procurement", "hr", "reports", "notifications", "audit", "settings", "portal",
    ] as PermissionModule[]
  ).forEach((m) => {
    base[m] = "none";
  });
  return { ...base, ...entries };
}

const EVERYTHING = matrix(
  Object.fromEntries(
    ([
      "dashboard", "patients", "appointments", "queue", "opd", "inpatient", "emergency", "doctors", "nursing",
      "laboratory", "radiology", "pharmacy", "theatre", "maternity", "pediatrics", "dental", "billing", "insurance",
      "claims", "payments", "inventory", "procurement", "hr", "reports", "notifications", "audit", "settings",
    ] as PermissionModule[]).map((m) => [m, FULL]),
  ),
);

export const PERMISSIONS: Record<Role, Record<PermissionModule, PermissionLevel>> = {
  super_admin: EVERYTHING,
  hospital_admin: { ...EVERYTHING, audit: "view" },
  doctor: matrix({
    dashboard: "view", patients: "edit", appointments: "view", queue: "edit", opd: "full", inpatient: "edit",
    emergency: "edit", nursing: "view", laboratory: "edit", radiology: "edit", pharmacy: "edit", theatre: "view",
    maternity: "edit", pediatrics: "edit", dental: "edit", billing: "view", insurance: "view", reports: "view",
    notifications: "full", doctors: "view",
  }),
  nurse: matrix({
    dashboard: "view", patients: "view", appointments: "view", queue: "edit", nursing: "full", inpatient: "edit",
    emergency: "edit", maternity: "edit", pediatrics: "view", pharmacy: "view", laboratory: "view", notifications: "full",
  }),
  receptionist: matrix({
    dashboard: "view", patients: "full", appointments: "full", queue: "full", billing: "edit", insurance: "view",
    doctors: "view", notifications: "full",
  }),
  cashier: matrix({ dashboard: "view", patients: "view", billing: "full", payments: "full", insurance: "view", reports: "view", notifications: "full" }),
  pharmacist: matrix({ dashboard: "view", patients: "view", pharmacy: "full", inventory: "edit", billing: "view", notifications: "full" }),
  lab_technician: matrix({ dashboard: "view", patients: "view", laboratory: "full", inventory: "view", notifications: "full" }),
  radiologist: matrix({ dashboard: "view", patients: "view", radiology: "full", notifications: "full", reports: "view" }),
  radiology_technician: matrix({ dashboard: "view", patients: "view", radiology: "edit", notifications: "full" }),
  theatre_nurse: matrix({ dashboard: "view", patients: "view", theatre: "full", inpatient: "view", inventory: "view", notifications: "full" }),
  insurance_officer: matrix({ dashboard: "view", patients: "view", insurance: "full", claims: "full", billing: "view", reports: "view", notifications: "full" }),
  hr: matrix({ dashboard: "view", hr: "full", reports: "view", notifications: "full" }),
  procurement: matrix({ dashboard: "view", procurement: "full", inventory: "edit", reports: "view", notifications: "full" }),
  inventory_manager: matrix({ dashboard: "view", inventory: "full", procurement: "edit", reports: "view", notifications: "full" }),
  patient: matrix({ portal: "full" }),
};

export function can(role: Role, module: PermissionModule, level: PermissionLevel = "view") {
  const order: PermissionLevel[] = ["none", "view", "edit", "full"];
  return order.indexOf(PERMISSIONS[role][module]) >= order.indexOf(level);
}

export interface NavItem {
  label: string;
  to: string;
  icon: string;
  module: PermissionModule;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", to: "/app", icon: "LayoutDashboard", module: "dashboard" },
  { label: "Patients", to: "/app/patients", icon: "Users", module: "patients" },
  { label: "Appointments", to: "/app/appointments", icon: "CalendarDays", module: "appointments" },
  { label: "Queue", to: "/app/queue", icon: "ListOrdered", module: "queue" },
  { label: "OPD Consultations", to: "/app/opd", icon: "Stethoscope", module: "opd" },
  { label: "Inpatient & Beds", to: "/app/inpatient", icon: "BedDouble", module: "inpatient" },
  { label: "Emergency", to: "/app/emergency", icon: "Siren", module: "emergency" },
  { label: "Nursing", to: "/app/nursing", icon: "HeartPulse", module: "nursing" },
  { label: "Laboratory", to: "/app/laboratory", icon: "FlaskConical", module: "laboratory" },
  { label: "Radiology", to: "/app/radiology", icon: "ScanLine", module: "radiology" },
  { label: "Pharmacy", to: "/app/pharmacy", icon: "Pill", module: "pharmacy" },
  { label: "Theatre", to: "/app/theatre", icon: "Scissors", module: "theatre" },
  { label: "Maternity", to: "/app/maternity", icon: "Baby", module: "maternity" },
  { label: "Billing", to: "/app/billing", icon: "ReceiptText", module: "billing" },
  { label: "Insurance", to: "/app/insurance", icon: "ShieldCheck", module: "insurance" },
  { label: "Claims", to: "/app/claims", icon: "FileCheck2", module: "claims" },
  { label: "Inventory", to: "/app/inventory", icon: "Boxes", module: "inventory" },
  { label: "Procurement", to: "/app/procurement", icon: "Truck", module: "procurement" },
  { label: "HR", to: "/app/hr", icon: "UserCog", module: "hr" },
  { label: "Reports", to: "/app/reports", icon: "BarChart3", module: "reports" },
  { label: "Audit Log", to: "/app/audit", icon: "History", module: "audit" },
  { label: "Notifications", to: "/app/notifications", icon: "Bell", module: "notifications" },
  { label: "Settings", to: "/app/settings", icon: "Settings", module: "settings" },
];

export function navForRole(role: Role) {
  return NAV_ITEMS.filter((i) => can(role, i.module, "view"));
}
