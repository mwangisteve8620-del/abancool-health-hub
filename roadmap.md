# Abancool Hospital HIMS — roadmap

## Foundation
- [x] Design system tokens (medical blue / teal / neutrals)
- [x] Domain types (Laravel-shaped)
- [x] ID generators (ABH-, APT-, INV-, LAB-, RAD-, RX-, CLM-)
- [x] Seeded demo dataset (patients, doctors, departments, appointments, orders, invoices, claims, inventory, HR)
- [x] Central store with localStorage persistence
- [x] Mock service layer (api-style, swappable for Laravel /api/v1)
- [x] Auth + roles + permissions + demo role switcher

## Public website
- [x] Layout (header, emergency CTA, footer)
- [x] Home, About, Departments (+detail), Doctors (+detail), Services, Packages, Insurance, Patient info, Careers, News, Contact
- [x] Appointment booking wizard

## Staff system
- [x] App shell with role-aware sidebar, command palette, notifications
- [x] Dashboard + quick actions
- [x] Patients registry + patient profile tabs + timeline
- [x] Appointments + queue
- [x] Consultation (vitals, diagnosis, orders, prescription)
- [x] Laboratory, Radiology, Pharmacy
- [x] Billing, Payments, Insurance (eligibility, preauth, claims)
- [x] Inpatient/beds, Emergency triage, Theatre, Maternity, Nursing
- [x] Inventory, Procurement, HR, Reports, Audit, Settings

## Patient portal
- [x] Dashboard, appointments, results, prescriptions, invoices, insurance, profile

## Docs
- [x] docs/API_CONTRACT.md
