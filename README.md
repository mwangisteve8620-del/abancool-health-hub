# Abancool Health Hub

# ABANCOOL HOSPITAL — COMPLETE HOSPITAL MANAGEMENT SYSTEM

Build a production-quality, highly polished hospital website + hospital management system called:

# ABANCOOL HOSPITAL

The goal is NOT to create a simple hospital marketing website.

Build a complete, realistic, end-to-end **Hospital Information Management System (HIMS)** with a beautiful public-facing hospital website, authenticated staff dashboards, patient portal, clinical workflows, billing, insurance, pharmacy, laboratory, radiology, theatre, appointments, admissions, inventory, HR, reporting, notifications and administration.

The first version must be a **fully functional frontend demo** using realistic mock/local data and simulated API calls.

The architecture must be deliberately designed so that the frontend can later connect cleanly to a **Laravel REST API backend** without redesigning the application.

---

# 1. CORE PRODUCT REQUIREMENT

Create a complete hospital ecosystem with these three major areas:

## A. PUBLIC WEBSITE

Professional hospital website for patients and visitors.

## B. HOSPITAL STAFF MANAGEMENT SYSTEM

Secure role-based dashboard for hospital employees.

## C. PATIENT PORTAL

Patients can log in and manage their healthcare journey.

Everything should feel like one coherent enterprise healthcare product.

---

# 2. BRAND

Hospital name:

**ABANCOOL HOSPITAL**

Create a premium, trustworthy healthcare identity.

Visual direction:

* modern private hospital
* premium but not flashy
* clean medical interface
* sophisticated typography
* excellent spacing
* subtle shadows
* professional cards
* strong information hierarchy
* accessible contrast
* responsive design
* desktop-first enterprise dashboard
* excellent mobile experience
* no generic AI-looking layouts

Avoid:

* excessive gradients
* excessive rounded cards
* childish illustrations
* generic stock-dashboard appearance
* excessive animations
* neon colors
* template-looking sections

Use a refined medical color system built around:

* deep medical blue
* white
* cool neutral backgrounds
* restrained teal/green accents
* semantic red/orange for warnings
* clear status colors

Use consistent design tokens throughout the entire application.

---

# 3. PUBLIC WEBSITE

Create the following pages.

## HOME

Hero section:

"Compassionate Care. Advanced Medicine. Better Outcomes."

Supporting text describing Abancool Hospital.

Primary CTA:

"Book an Appointment"

Secondary CTA:

"Find a Specialist"

Include:

* emergency contact
* appointment CTA
* departments
* featured specialists
* services
* health packages
* insurance partners
* patient testimonials
* hospital statistics
* facilities
* latest health articles
* contact information
* location
* opening hours

---

# 4. PUBLIC WEBSITE NAVIGATION

Navigation:

* Home
* About
* Departments
* Doctors
* Services
* Health Packages
* Insurance
* Patient Information
* Careers
* News & Health Tips
* Contact
* Patient Portal
* Book Appointment

Add a prominent:

**Emergency: Call Now**

button.

---

# 5. DEPARTMENTS

Create a department directory.

Departments should include:

1. Emergency & Casualty
2. Outpatient Department
3. Inpatient / Wards
4. ICU
5. Theatre / Surgery
6. Maternity
7. Pediatrics
8. Obstetrics & Gynecology
9. General Medicine
10. General Surgery
11. Orthopedics
12. Dental
13. ENT
14. Ophthalmology
15. Cardiology
16. Neurology
17. Dermatology
18. Psychiatry / Mental Health
19. Radiology
20. Laboratory
21. Pharmacy
22. Physiotherapy
23. Nutrition & Dietetics
24. Renal / Dialysis
25. Oncology
26. Ambulance Services

Each department needs:

* description
* services
* doctors
* operating hours
* contact
* appointment CTA
* related services

---

# 6. DOCTOR DIRECTORY

Create a searchable doctor directory.

Doctor profile must include:

* photograph/avatar
* full name
* title
* specialty
* department
* qualifications
* years of experience
* languages
* consultation fee
* availability
* appointment slots
* biography
* services
* reviews
* location

Filters:

* specialty
* department
* gender
* availability
* consultation fee

Search should work.

---

# 7. APPOINTMENT BOOKING

Create a complete appointment workflow.

Patient chooses:

1. Department
2. Doctor
3. Service
4. Date
5. Available time
6. Patient details
7. Insurance/self-pay
8. Reason for visit
9. Confirmation

Generate:

* appointment ID
* confirmation page
* appointment status

Statuses:

* Requested
* Confirmed
* Checked In
* In Consultation
* Completed
* Cancelled
* No Show

Staff should be able to modify appointment status.

---

# 8. AUTHENTICATION

Create realistic authentication flows.

Login:

* email/phone
* password

Registration:

* full name
* DOB
* gender
* phone
* email
* national ID/passport
* password

Also provide demo accounts for different roles.

IMPORTANT:

The demo should allow easy role switching.

Create a visible development/demo selector:

"Login as..."

Roles:

* Super Admin
* Hospital Administrator
* Doctor
* Nurse
* Receptionist
* Cashier
* Pharmacist
* Laboratory Technician
* Radiologist
* Radiology Technician
* Theatre Nurse
* Insurance Officer
* HR
* Procurement
* Inventory Manager
* Patient

---

# 9. STAFF DASHBOARD

Create a serious enterprise hospital dashboard.

Sidebar:

Dashboard
Patients
Appointments
Queue
OPD
Inpatient
Emergency
Doctors
Nursing
Laboratory
Radiology
Pharmacy
Theatre
Maternity
Pediatrics
Billing
Insurance
Claims
Payments
Inventory
Procurement
HR
Reports
Notifications
Settings

Sidebar should change according to user role.

---

# 10. ADMIN DASHBOARD

Create an executive dashboard.

Display:

* today's patients
* today's appointments
* admissions
* discharges
* emergency visits
* available beds
* occupied beds
* revenue today
* outstanding balances
* insurance claims
* pending lab orders
* pending radiology orders
* pharmacy prescriptions
* theatre schedule
* staff attendance

Charts:

* patient volume
* revenue
* admissions/discharges
* department activity
* insurance claims
* appointment trends

Include date filtering.

---

# 11. PATIENT MANAGEMENT

Patient registry.

Table:

* Patient ID
* Name
* DOB
* Gender
* Phone
* Insurance
* Last Visit
* Status
* Actions

Actions:

* View
* Edit
* Register Visit
* Book Appointment
* Admit
* Billing
* Medical Record

Patient profile should have tabs:

Overview
Demographics
Visits
Medical History
Diagnoses
Allergies
Medications
Prescriptions
Lab Results
Radiology
Procedures
Admissions
Discharges
Invoices
Payments
Insurance
Documents
Notes

---

# 12. UNIQUE PATIENT NUMBER

Generate patient numbers such as:

ABH-000001
ABH-000002
ABH-000003

Appointment numbers:

APT-2026-000001

Invoice:

INV-2026-000001

Lab:

LAB-2026-000001

Radiology:

RAD-2026-000001

Prescription:

RX-2026-000001

Insurance claim:

CLM-2026-000001

Use consistent ID generation throughout the demo.

---

# 13. RECEPTION WORKFLOW

Receptionist dashboard.

Workflow:

Patient arrives
↓
Search existing patient
↓
Register new patient if necessary
↓
Select department
↓
Select service
↓
Select payment/insurance
↓
Create visit
↓
Generate queue number
↓
Send patient to waiting area
↓
Doctor/Nurse calls patient
↓
Consultation begins

Create a working queue screen.

Example:

OPD-001
OPD-002
OPD-003

Buttons:

* Call Next
* Recall
* Skip
* Start Consultation
* Complete

---

# 14. DOCTOR WORKFLOW

Doctor dashboard.

Show:

* today's appointments
* waiting patients
* active consultations
* completed consultations
* pending results

Doctor opens patient.

Create clinical encounter.

Sections:

Chief Complaint
History of Present Illness
Past Medical History
Family History
Social History
Allergies
Vitals
Examination
Assessment
Diagnosis
Treatment Plan
Orders
Prescription
Follow-up

Diagnosis should support:

* ICD-style diagnosis selection
* search
* multiple diagnoses
* primary diagnosis
* secondary diagnosis

---

# 15. VITALS

Record:

* temperature
* blood pressure
* pulse
* respiratory rate
* oxygen saturation
* weight
* height
* BMI
* pain score

Display historical vitals graph.

---

# 16. CLINICAL ORDERS

Doctors can order:

Laboratory
Radiology
Medication
Procedures
Referral

Orders must appear in the relevant department dashboard.

Example:

Doctor orders CBC.

It immediately appears in:

Laboratory → Pending Orders.

Doctor orders Chest X-Ray.

It immediately appears in:

Radiology → Pending Orders.

Prescription appears in:

Pharmacy → Pending Prescriptions.

This must be demonstrated with shared application state/mock API data.

---

# 17. LABORATORY MODULE

Dashboard:

* pending samples
* collected
* processing
* completed
* urgent

Workflow:

Doctor orders test
↓
Lab receives order
↓
Sample collection
↓
Sample processing
↓
Results entry
↓
Technician verifies
↓
Doctor receives result
↓
Patient sees result

Create test catalog:

CBC
U&E
LFT
HbA1c
Malaria
Urinalysis
Pregnancy Test
Lipid Profile
Blood Group
Creatinine
CRP
etc.

Result entry interface should support:

* parameter
* value
* unit
* reference range
* abnormal flag
* comments

---

# 18. RADIOLOGY MODULE

Dashboard:

* pending requests
* scheduled
* in progress
* awaiting report
* completed

Modalities:

X-Ray
Ultrasound
CT
MRI
Mammography
OPG / Dental X-Ray

Workflow:

Order
→ Schedule
→ Perform
→ Attach report
→ Radiologist verifies
→ Doctor receives result

Create radiology report screen.

---

# 19. PHARMACY

Dashboard:

* pending prescriptions
* dispensed today
* low stock
* expiring drugs
* revenue

Prescription workflow:

Doctor prescribes
↓
Pharmacy receives
↓
Pharmacist reviews
↓
Dispense
↓
Stock deducted
↓
Invoice updated

Medication fields:

* drug name
* generic name
* strength
* dosage
* frequency
* route
* duration
* quantity
* instructions

Inventory must update automatically in the demo.

---

# 20. INVENTORY

Inventory dashboard.

Categories:

Pharmaceuticals
Medical Supplies
Laboratory Supplies
Surgical Supplies
Consumables
Office Supplies
Equipment

Features:

* stock levels
* stock movement
* receiving
* issuing
* adjustments
* expiry tracking
* reorder levels
* suppliers
* purchase orders

Statuses:

In Stock
Low Stock
Out of Stock
Expired
Near Expiry

---

# 21. PROCUREMENT

Workflow:

Department Request
↓
Approval
↓
Purchase Order
↓
Supplier
↓
Goods Received
↓
Stock Updated
↓
Invoice

Create realistic procurement screens.

---

# 22. THEATRE / SURGERY

Theatre dashboard.

Show:

* today's surgeries
* upcoming procedures
* theatre availability
* surgeon
* anesthetist
* theatre nurse
* patient
* procedure
* start time
* estimated duration
* status

Statuses:

Scheduled
Pre-op
In Theatre
Recovery
Completed
Cancelled

Create surgery booking workflow.

---

# 23. INPATIENT / WARDS

Bed management.

Create:

* wards
* rooms
* beds
* bed status

Bed statuses:

Available
Occupied
Reserved
Cleaning
Maintenance

Admission workflow:

Doctor requests admission
↓
Bed allocated
↓
Admission created
↓
Nursing care
↓
Doctor rounds
↓
Medication
↓
Lab/Radiology
↓
Discharge

---

# 24. NURSING DASHBOARD

Nurse dashboard:

* assigned patients
* vitals due
* medication due
* nursing tasks
* care plans
* observations

Create nursing observation form.

Include:

* vitals
* intake/output
* pain
* consciousness
* nursing notes
* medication administration
* tasks

---

# 25. EMERGENCY DEPARTMENT

Create an emergency dashboard.

Triage categories:

RED
ORANGE
YELLOW
GREEN

Emergency workflow:

Arrival
→ Triage
→ Vitals
→ Doctor assessment
→ Orders
→ Treatment
→ Observation
→ Admission / Discharge / Referral

Display an emergency board.

---

# 26. MATERNITY

Create maternity dashboard.

Modules:

* antenatal
* labor
* delivery
* postnatal
* newborn
* maternal records

Delivery record:

* mother
* baby
* delivery date/time
* delivery type
* birth weight
* APGAR
* complications
* attending doctor
* midwife

---

# 27. PEDIATRICS

Include:

* pediatric patients
* growth chart
* immunization
* weight
* height
* head circumference
* pediatric medication dosing fields

---

# 28. DENTAL

Dental module.

Include:

* dental patient profile
* odontogram
* dental procedures
* treatment plan
* dental imaging
* appointments
* billing

Create a visual interactive tooth chart.

---

# 29. BILLING

Create a complete billing system.

Billable items:

Consultation
Laboratory
Radiology
Procedures
Medication
Bed charges
Theatre
Doctor fees
Nursing
Other services

Invoice workflow:

Service performed
↓
Charge generated
↓
Invoice
↓
Insurance/self-pay
↓
Payment
↓
Receipt

Invoice fields:

* invoice number
* patient
* date
* items
* quantity
* unit price
* subtotal
* discount
* tax if applicable
* total
* paid
* balance
* status

Statuses:

Draft
Pending
Partially Paid
Paid
Cancelled

---

# 30. PAYMENTS

Support demo payment methods:

Cash
Card
Mobile Money
Bank
Insurance

Create payment screen.

Receipt generation should work in the demo.

---

# 31. INSURANCE MANAGEMENT

This is extremely important.

Create a complete insurance module designed for future integration with real insurance APIs.

Insurance dashboard:

* active policies
* eligibility checks
* authorizations
* claims
* rejected claims
* pending claims
* paid claims
* outstanding claims

Patient insurance profile:

* insurer
* member number
* policy number
* principal member
* relationship
* coverage
* expiry
* status

---

# 32. INSURANCE ELIGIBILITY

Create an interactive demo eligibility check.

Button:

"Check Eligibility"

Show:

* member verified
* policy active
* coverage status
* outpatient coverage
* inpatient coverage
* maternity
* dental
* optical
* pharmacy
* annual limit
* remaining balance

Important:

This is a DEMO integration.

Do not pretend to connect to a real insurer.

Create a clear abstraction layer for future API integration.

---

# 33. INSURANCE PRE-AUTHORIZATION

Workflow:

Doctor requests procedure
↓
Insurance officer reviews
↓
Preauthorization submitted
↓
Pending
↓
Approved / Rejected / More Information Required

Show authorization number.

---

# 34. INSURANCE CLAIMS

Claim workflow:

Services rendered
↓
Claim generated
↓
Claim validation
↓
Claim submission
↓
Submitted
↓
Processing
↓
Approved
↓
Paid

Possible statuses:

Draft
Validated
Submitted
Pending
Approved
Partially Approved
Rejected
Paid

Create a claims table with:

Claim ID
Patient
Insurer
Invoice
Amount
Submitted
Status
Actions

---

# 35. INSURANCE API ARCHITECTURE

Design the frontend so insurance integrations can later be connected through Laravel.

Create service interfaces conceptually:

InsuranceProvider
EligibilityService
AuthorizationService
ClaimsService
RemittanceService

Frontend should call abstract endpoints such as:

GET /api/v1/insurance/providers
POST /api/v1/insurance/eligibility/check
POST /api/v1/insurance/authorizations
GET /api/v1/insurance/claims
POST /api/v1/insurance/claims
GET /api/v1/insurance/claims/{id}

Do NOT hard-code insurer-specific logic into UI components.

---

# 36. REPORTING

Create reports dashboard.

Reports:

Patient Statistics
Revenue
Appointments
Admissions
Discharges
Emergency
Laboratory
Radiology
Pharmacy
Inventory
Insurance Claims
Doctor Performance
Department Activity
Outstanding Balances
Payments
Stock
Procurement

Filters:

* today
* yesterday
* this week
* this month
* custom date range

Charts should update based on selected filters.

---

# 37. HR MODULE

Employee management:

* employee ID
* name
* department
* role
* employment status
* phone
* email
* joining date

Include:

* attendance
* leave
* shifts
* payroll summary
* documents

---

# 38. USER & ROLE MANAGEMENT

Admin can manage:

Users
Roles
Permissions

Create permission matrix.

Example:

Doctor:
Patients: View/Edit
Appointments: View
Clinical Records: Create/Edit
Billing: View

Pharmacist:
Pharmacy: Full
Patients: View
Billing: View

Receptionist:
Patients: Create/Edit
Appointments: Full
Billing: Create

Admin:
Everything

---

# 39. AUDIT LOG

Create audit log.

Record:

* user
* action
* module
* record
* timestamp
* IP/device placeholder
* previous value
* new value

Example:

"Dr. John updated patient ABH-000024 diagnosis."

---

# 40. NOTIFICATIONS

Create notification center.

Notifications:

* new appointment
* appointment reminder
* lab result available
* radiology report available
* prescription ready
* payment received
* insurance approved
* claim rejected
* low stock
* critical patient alert

Support read/unread.

---

# 41. PATIENT PORTAL

Patient dashboard:

Welcome, John Doe.

Cards:

Upcoming Appointment
Outstanding Balance
Insurance
Prescriptions
Lab Results
Radiology
Medical Records

Patient can:

* book appointment
* cancel appointment
* view appointments
* view results
* view prescriptions
* view invoices
* pay demo invoice
* download receipts
* view insurance
* update profile
* message hospital

---

# 42. PATIENT TIMELINE

Create beautiful medical timeline:

Registration
Appointment
Consultation
Diagnosis
Lab
Radiology
Prescription
Payment
Admission
Discharge

Each event opens details.

---

# 43. DOCUMENT MANAGEMENT

Allow demo upload interfaces for:

* national ID
* insurance card
* referral letter
* lab reports
* radiology reports
* medical documents
* discharge summaries

Use mock file storage for demo.

---

# 44. SEARCH

Global search.

Search:

Patients
Doctors
Appointments
Invoices
Lab Orders
Radiology
Prescriptions
Claims

Keyboard shortcut:

CMD/CTRL + K

Create a command palette.

---

# 45. RESPONSIVE DESIGN

Desktop:

Enterprise dashboard layout.

Tablet:

Adaptive sidebar.

Mobile:

Bottom navigation where appropriate.

Public website must be excellent on mobile.

---

# 46. DESIGN QUALITY

The interface must look like it was designed by a senior product design team.

Use:

* 8px spacing system
* consistent typography
* clear hierarchy
* subtle borders
* restrained shadows
* high-quality tables
* excellent forms
* proper empty states
* skeleton loading
* confirmation dialogs
* toast notifications
* breadcrumbs
* command menus
* keyboard-friendly interactions

Every page must have:

* loading state
* empty state
* error state
* success feedback

Do not create dead buttons.

Every major button should perform a meaningful demo action.

---

# 47. DEMO DATA

Populate the application with realistic demo data.

At least:

50 patients
20 doctors
15 departments
100 appointments
50 invoices
30 prescriptions
50 laboratory orders
30 radiology orders
20 insurance claims
100 inventory items
20 suppliers
20 employees

Use realistic Kenyan context where appropriate.

Currency:

KES

Examples:

Consultation:
KES 1,000

Use realistic but clearly demo pricing elsewhere.

---

# 48. DEMO SCENARIO

Create a complete demonstrable patient journey.

Example:

Patient:
Mary Wanjiku

1. Patient books appointment.
2. Receptionist sees appointment.
3. Patient checks in.
4. Queue number generated.
5. Nurse records vitals.
6. Doctor opens consultation.
7. Doctor records diagnosis.
8. Doctor orders CBC.
9. Doctor orders Chest X-Ray.
10. Doctor creates prescription.
11. Insurance eligibility is checked.
12. Preauthorization is requested if necessary.
13. Lab receives order.
14. Lab enters results.
15. Radiology receives order.
16. Radiologist enters report.
17. Pharmacy receives prescription.
18. Pharmacist dispenses medicine.
19. Billing generates charges.
20. Insurance claim is generated.
21. Claim submitted.
22. Patient portal updates.
23. Patient sees results.
24. Payment/insurance balance updates.

This entire scenario must work inside the demo.

---

# 49. STATE MANAGEMENT

Use a clean centralized state/data layer.

The demo should behave as though it communicates with a backend.

Create API-style service modules:

authService
patientService
appointmentService
clinicalService
laboratoryService
radiologyService
pharmacyService
billingService
insuranceService
inventoryService
theatreService
admissionService
notificationService
reportService

Initially these services use mock/local data.

The UI must NOT directly manipulate random mock objects everywhere.

---

# 50. API CONTRACT PREPARATION

Design the frontend around RESTful Laravel API conventions.

Base URL:

/api/v1

Authentication:

Laravel Sanctum or token-based authentication.

Standard response:

{
"success": true,
"message": "...",
"data": {},
"meta": {}
}

Error:

{
"success": false,
"message": "...",
"errors": {}
}

Pagination:

{
"data": [],
"meta": {
"current_page": 1,
"last_page": 10,
"per_page": 20,
"total": 200
}
}

Prepare frontend types/interfaces for:

User
Role
Permission
Patient
Doctor
Department
Appointment
Encounter
Vital
Diagnosis
LabOrder
LabResult
RadiologyOrder
RadiologyReport
Prescription
Medication
InventoryItem
Admission
Bed
Procedure
Invoice
Payment
InsuranceProvider
InsurancePolicy
EligibilityCheck
Authorization
Claim
Notification
AuditLog

---

# 51. LARAVEL BACKEND CONTRACT

Generate a dedicated API CONTRACT document inside the project.

Include:

Authentication endpoints
User endpoints
Role endpoints
Patient endpoints
Doctor endpoints
Department endpoints
Appointment endpoints
Queue endpoints
Encounter endpoints
Diagnosis endpoints
Laboratory endpoints
Radiology endpoints
Pharmacy endpoints
Inventory endpoints
Admission endpoints
Theatre endpoints
Billing endpoints
Payment endpoints
Insurance endpoints
Claims endpoints
Reports endpoints
Notifications endpoints
Audit endpoints

For each endpoint define:

HTTP method
URL
Authentication
Permissions
Request payload
Validation
Response payload
HTTP status codes
Error responses

---

# 52. EXAMPLE API CONTRACT

POST

/api/v1/appointments

Request:

{
"patient_id": 24,
"doctor_id": 8,
"department_id": 3,
"appointment_date": "2026-10-01",
"appointment_time": "10:30",
"reason": "Follow-up consultation"
}

Response:

{
"success": true,
"message": "Appointment created successfully",
"data": {
"id": 1001,
"appointment_number": "APT-2026-001001",
"status": "confirmed"
}
}

---

# 53. SECURITY

Build security-aware frontend patterns.

Include:

* role-based access
* permission checks
* protected routes
* session handling
* logout
* idle timeout placeholder
* audit logging
* confirmation for destructive actions
* no sensitive data exposed in URLs
* no hardcoded passwords
* environment-based configuration

Clearly mark demo-only authentication.

---

# 54. SETTINGS

Admin settings:

Hospital Profile
Departments
Services
Doctors
Appointment Settings
Billing Settings
Insurance Providers
Payment Methods
Notification Settings
User Management
Roles
Permissions
System Preferences

---

# 55. HOSPITAL PROFILE

Create:

Hospital name
Logo
Address
Phone
Email
Emergency contact
Opening hours
Social links
Tax/business details
Payment details

---

# 56. UX DETAILS

Add:

Toast notifications
Modal dialogs
Confirmation dialogs
Dropdown menus
Date pickers
Search
Filters
Sorting
Pagination
Tabs
Drawers
Breadcrumbs
Status badges
Tooltips
Keyboard shortcuts
Responsive tables

Make forms pleasant and fast.

---

# 57. ACCESSIBILITY

Implement:

* semantic HTML
* keyboard navigation
* visible focus
* accessible labels
* good contrast
* ARIA where appropriate
* readable font sizes
* screen-reader friendly controls

---

# 58. PERFORMANCE

Avoid unnecessarily heavy components.

Use:

* lazy loading
* efficient state updates
* pagination
* reusable components
* reusable tables
* reusable form controls

---

# 59. ARCHITECTURE

Organize the frontend cleanly.

Suggested structure:

src/
components/
layouts/
pages/
modules/
services/
api/
types/
hooks/
store/
utils/
mock/
constants/

Group domain-specific components logically.

Example:

modules/
patients/
appointments/
laboratory/
radiology/
pharmacy/
billing/
insurance/
inventory/
theatre/
inpatient/
emergency/

---

# 60. IMPORTANT: DO NOT MAKE A STATIC MOCKUP

This is critical.

Do NOT create pages that only look functional.

Interactions must work.

Examples:

Creating a patient must add the patient.

Booking an appointment must appear in appointments.

Checking in a patient must update the queue.

Calling a patient must update queue status.

Doctor diagnosis must appear in medical history.

Creating a lab order must appear in the laboratory dashboard.

Entering lab results must make them visible to the doctor and patient.

Creating a prescription must appear in pharmacy.

Dispensing medication must reduce stock.

Creating an invoice must update the patient's balance.

Recording payment must update the invoice.

Insurance eligibility must return a realistic demo response.

Submitting a claim must change claim status.

Bed allocation must change bed status.

Notifications must appear when relevant events occur.

Use centralized demo state/local persistence so the workflow survives page navigation and refresh where practical.

---

# 61. DEMO MODE

Add a clearly labeled:

"DEMO MODE"

indicator.

Provide:

"Reset Demo Data"

button.

Provide:

"Load Full Patient Journey"

button.

When clicked, automatically populate the system with a complete realistic workflow.

---

# 62. DASHBOARD QUICK ACTIONS

Admin:

Register Patient
Book Appointment
Admit Patient
Create Invoice
Check Insurance
View Claims
Add Inventory
View Reports

Doctor:

Start Consultation
View Queue
Order Lab
Order Radiology
Prescribe
Refer Patient

Nurse:

Record Vitals
Medication Round
Nursing Note
View Patients

Reception:

Register Patient
Book Appointment
Check In
View Queue

Pharmacy:

View Prescriptions
Dispense
Receive Stock
Stock Adjustment

Lab:

Pending Orders
Collect Sample
Enter Results
Verify Results

Insurance:

Eligibility
Authorization
Claims
Remittance

---

# 63. PUBLIC WEBSITE CONTENT

Use realistic professional copy.

Do not use lorem ipsum.

Create professional text for:

About Abancool Hospital
Mission
Vision
Values
Departments
Services
Doctors
Patient information
Insurance
Contact
Emergency services

---

# 64. FOOTER

Include:

Abancool Hospital

Quick Links
Departments
Services
Patient Portal
Appointments
Insurance
Contact

Emergency contact

Address

Phone

Email

Opening hours

Privacy Policy
Terms
Patient Rights

---

# 65. ERROR HANDLING

Create polished error states.

404 page:

"Page not found"

403:

"You don't have permission to access this page."

500:

"Something went wrong."

Network error:

"Unable to connect. Please try again."

---

# 66. FINAL ACCEPTANCE TEST

Before considering the build complete, manually test the following demo workflow:

LOGIN
→ DASHBOARD
→ REGISTER PATIENT
→ BOOK APPOINTMENT
→ CHECK IN
→ QUEUE
→ NURSE VITALS
→ DOCTOR CONSULTATION
→ DIAGNOSIS
→ LAB ORDER
→ RADIOLOGY ORDER
→ PRESCRIPTION
→ INSURANCE ELIGIBILITY
→ AUTHORIZATION
→ LAB RESULT
→ RADIOLOGY REPORT
→ PHARMACY DISPENSING
→ BILLING
→ PAYMENT
→ INSURANCE CLAIM
→ PATIENT PORTAL
→ REPORTING

Every stage must visibly affect the next stage.

Fix broken navigation, dead buttons, console errors, layout issues, inconsistent terminology and missing states before completion.

---

# 67. VISUAL QUALITY BAR

The finished application should resemble a serious modern healthcare SaaS/HIMS product.

Think:

enterprise healthcare
+
premium private hospital
+
modern financial dashboard quality
+
excellent clinical UX

It must look custom-designed for:

# ABANCOOL HOSPITAL

Do not make it look like a generic admin template.

Use realistic hospital terminology.

Maintain consistent naming throughout the entire system.

---

# 68. BUILD PRIORITY

Prioritize in this order:

1. Application architecture
2. Design system
3. Authentication and roles
4. Dashboard shell
5. Patient management
6. Appointments/queue
7. Clinical workflow
8. Laboratory
9. Radiology
10. Pharmacy
11. Billing
12. Insurance
13. Inpatient
14. Emergency
15. Theatre
16. Inventory
17. Reports
18. Patient portal
19. Public website
20. API contract documentation
21. Final QA

Do not sacrifice functional workflows merely to add more decorative pages.

---

# 69. FINAL DELIVERABLE

Deliver a polished, fully navigable Abancool Hospital system where I can log in as different hospital roles and demonstrate a complete patient journey from registration through consultation, diagnostics, pharmacy, billing and insurance claims.

The frontend demo must be functional now.

The architecture must make it straightforward to replace the mock service layer with Laravel API calls later.

Do not claim real insurance integration.

Clearly separate:

DEMO MOCK SERVICES

from:

FUTURE LARAVEL API SERVICES

The result should feel like a real hospital operating system rather than a collection of screenshots.

# END OF SPECIFICATION

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/7f035ab1-2959-40f4-bddd-d829f4e3ecfa).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
