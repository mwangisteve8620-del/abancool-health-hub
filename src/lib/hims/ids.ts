/** Consistent hospital identifier generation (demo + future API parity). */

export const ID_YEAR = 2026;

export function pad(n: number, width: number) {
  return String(n).padStart(width, "0");
}

export function patientNumber(seq: number) {
  return `ABH-${pad(seq, 6)}`;
}
export function appointmentNumber(seq: number) {
  return `APT-${ID_YEAR}-${pad(seq, 6)}`;
}
export function invoiceNumber(seq: number) {
  return `INV-${ID_YEAR}-${pad(seq, 6)}`;
}
export function labNumber(seq: number) {
  return `LAB-${ID_YEAR}-${pad(seq, 6)}`;
}
export function radiologyNumber(seq: number) {
  return `RAD-${ID_YEAR}-${pad(seq, 6)}`;
}
export function prescriptionNumber(seq: number) {
  return `RX-${ID_YEAR}-${pad(seq, 6)}`;
}
export function claimNumber(seq: number) {
  return `CLM-${ID_YEAR}-${pad(seq, 6)}`;
}
export function receiptNumber(seq: number) {
  return `RCP-${ID_YEAR}-${pad(seq, 6)}`;
}
export function admissionNumber(seq: number) {
  return `ADM-${ID_YEAR}-${pad(seq, 5)}`;
}
export function caseNumber(prefix: string, seq: number) {
  return `${prefix}-${ID_YEAR}-${pad(seq, 5)}`;
}
export function authorizationNumber(seq: number) {
  return `AUTH-${ID_YEAR}-${pad(seq, 5)}`;
}
export function poNumber(seq: number) {
  return `PO-${ID_YEAR}-${pad(seq, 5)}`;
}
export function employeeNumber(seq: number) {
  return `EMP-${pad(seq, 4)}`;
}
export function queueNumber(prefix: string, seq: number) {
  return `${prefix}-${pad(seq, 3)}`;
}

let uidCounter = 0;
/** Local record id. Deterministic during seeding, monotonic afterwards. */
export function uid(prefix: string) {
  uidCounter += 1;
  return `${prefix}_${uidCounter.toString(36)}${Date.now().toString(36).slice(-4)}`;
}

export function formatKES(amount: number) {
  return `KES ${Math.round(amount).toLocaleString("en-KE")}`;
}
