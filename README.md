# 🏥 LIORA HOSPITALS — STAFF & RECEPTION PORTAL

> Dedicated, enterprise-grade outpatient reception, appointment management, patient triage, live waiting queue, and clinical coordination portal for **Liora Hospitals**.

---

## 🌟 Executive Summary

The **Staff Portal** is the third integrated portal in the **Liora Hospitals Management System**, purpose-built for:
- Front-desk receptionists
- Outpatient triage coordinators
- Appointment booking and rescheduling officers
- Patient calling and care communicators
- Front-desk administration leads

It operates as an independent client application on its own dedicated port and session boundary while sharing the central hospital database and cross-portal synchronization infrastructure with the **Doctor Portal** and **Patient Portal**.

---

## 🏛️ Tri-Portal Unified Architecture

```
                             ┌──────────────────────────────────────┐
                             │       LIORA HOSPITALS CORE           │
                             │      Shared Enterprise DB            │
                             │ (Appointments, Patients, Doctors)    │
                             └──────────────────┬───────────────────┘
                                                │
         ┌──────────────────────────────────────┼──────────────────────────────────────┐
         ▼                                      ▼                                      ▼
┌─────────────────────────┐            ┌─────────────────────────┐            ┌─────────────────────────┐
│     PATIENT PORTAL      │            │      DOCTOR PORTAL      │            │      STAFF PORTAL       │
│  http://localhost:5173  │            │  http://localhost:5175  │            │  http://localhost:5174  │
│  (API: Port 5000)       │            │  (API: Port 5001)       │            │  (API: Port 5002)       │
│                         │            │                         │            │                         │
│ • Patient self-booking  │◄──Cross───►│ • Clinical consults     │◄──Cross───►│ • Front-desk check-in   │
│ • Medical history & Rx  │   Portal   │ • E-Prescriptions       │   Portal   │ • Live waiting queue    │
│ • Health records        │   Sync     │ • Diagnostic notes      │   Sync     │ • Device phone dialer   │
│ • Online appointments   │            │ • Practice availability │            │ • Schedule coordination│
└─────────────────────────┘            └─────────────────────────┘            └─────────────────────────┘
```

---

## 🔑 Default Staff Credentials

Staff users authenticate with their designated Staff ID and password:

| Staff ID | Name | Role & Department | Station / Desk | Password |
| :--- | :--- | :--- | :--- | :--- |
| `STAFF101` | Priya Nambiar | Front Desk Receptionist (OPD Triage) | Counter 2 — Main OPD Lobby | `password123` |
| `STAFF102` | Kavita Sen | Appointment Coordinator (Outpatient Scheduling) | Desk 4 — Coordination Wing | `password123` |
| `STAFF100` | Arun Mehta | Front Desk Lead & Supervisor (Admin) | Supervisor Office — Ground Floor | `password123` |

---

## 📋 Comprehensive Module Overview

### 1. Staff Operations Dashboard
- **8 Core Real-Time Metric Cards**:
  1. *Total Appointments Today*: All scheduled outpatient visits.
  2. *Upcoming Appointments*: Pending arrivals.
  3. *Patients Checked In*: Arrived at hospital reception.
  4. *Patients Currently Waiting*: In OPD waiting lounge.
  5. *Patients With Doctors*: Active clinical consultations.
  6. *Completed Appointments*: Concluded visits.
  7. *Cancelled Appointments*: Cancellations with recorded reasons.
  8. *Missed Appointments / No-Show*: Absent visits.
- Every metric card is clickable and opens the relevant filtered view.
- **Date Switcher**: Seamless toggle between *Today*, *Tomorrow*, and *Custom Date* picker.
- **Delayed Appointments Alert**: Automatic warning banner when patients wait > 20 minutes.
- **Live Waiting Queue Snapshot**: Quick 5-patient live queue with wait duration timer.
- **Doctor Availability Snapshot**: Real-time consultant duty states and visit counts.
- **Pending Confirmation Calls Widget**: Immediate access to patients needing confirmation.
- **Quick Action Bar**: One-click launchers for Check-in, Book Appointment, Register Patient, and Confirmation Calls.

### 2. Appointment Management
- Searchable and filterable table with full-text search across:
  - Patient Name
  - Patient ID
  - Phone Number
  - Consultant Doctor
  - Appointment ID / Token
- Multi-dimensional filters: Status, Doctor, Department, and Date.
- **Book Appointment**:
  - Validates doctor slot availability against Doctor Portal in real time.
  - Prevents double-booking.
  - Supports new patient registration or existing patient lookup.
- **Reschedule Modal**: Slot collision detection and recorded rescheduling reason.
- **Cancel Appointment**: Requires mandatory administrative reason, logs to audit trail, and notifies Doctor and Patient Portals.
- **Confirm Appointment**: Marks appointment as attendance verified.
- **Fast Check-in**: Issues Queue ticket (e.g. `Q-01`) and marks arrival.
- **Appointment Dossier**: Complete audit trail showing chronological status transitions and staff signatures.

### 3. Patient Reception & Registration
- Register new patients with demographics: Name, Phone, Age, Gender, Blood Group, Emergency Contact, Address, and Reception Notes.
- **Real-Time Duplicate Detection**: Warns if a patient with the same phone or email already exists.
- **Role-Based Security Boundary**: Receptionists can update demographic and contact details, but clinical diagnoses and electronic prescriptions are strictly read-only / physician-exclusive.
- Direct check-in to OPD Queue from patient dossier.
- Chronological patient visit history view.

### 4. Live OPD Waiting Queue
- Dedicated waiting lounge monitor with:
  - Queue Token Number (e.g. `Q-01`, `Q-02`)
  - Patient Name & Demographics
  - Assigned Doctor & Cabin Location
  - Check-in Time & Live Wait Duration in Minutes
  - Triage Priority (`Normal`, `Senior Citizen`, `Urgent`, `Emergency`)
  - Current Status (`Checked In`, `Waiting`, `With Doctor`, `Completed`, `Delayed`, `Left`)
  - Contextual Next Action indicator
- **Doctor Notification**: Dispatches alert directly to the physician's Doctor Portal.
- Status progression: `Checked In` ➔ `Waiting` ➔ `With Doctor` ➔ `Completed`.
- Handles patients who leave before consultation with audit trail logging.
- Auto-refresh toggle with 12-second live polling.
- Privacy compliant: No sensitive clinical diagnoses exposed on public screens.

### 5. Doctor & Department Coordination
- Consultant Directory with real-time duty state:
  - `Available`: Ready for consults.
  - `In Consultation`: Currently treating an active patient.
  - `In OPD / Scheduled`: Has patients waiting in lounge.
- Metrics per doctor: Today's visits, patients currently waiting, estimated wait time.
- Next scheduled patient display.
- **Consultation Slots Viewer**: Daily slot grid showing open vs. booked intervals.

### 6. Calls & Patient Communication
- Worklist of upcoming appointments requiring phone confirmation.
- **Native Device Calling**: Clickable `tel:` phone links trigger device dialer / softphone.
- **Recorded Call Dispositions**:
  - `Appointment Confirmed` (automatically updates appointment status to Confirmed)
  - `Answered` (spoke with patient)
  - `Callback Requested` (schedules follow-up date/time)
  - `Reschedule Requested`
  - `No Answer / Left Voicemail`
  - `Line Busy`
  - `Invalid / Disconnected Number`
- Automated appointment reminder simulation with carrier gateway bridge readiness.
- Call audit history table with staff signatures.

### 7. Staff Notification Center
- Categorized operational alerts:
  - Arrived Patients
  - Doctor Delays & Consultations
  - Long Wait Warnings (>20 mins)
  - Scheduled Callback Reminders
  - New Bookings
- Mark single alert read or "Mark All as Read".
- Direct navigation links to relevant queue or appointment views.

### 8. Reports & Analytics
- Computed KPI metrics from real stored records:
  - Confirmation Rate %
  - Cancellation Rate %
  - No-Show Rate %
  - Average Waiting Time in minutes
  - Doctor-wise Appointment Volume
  - Departmental Volume
  - Call Disposition Breakdown
- **CSV Export**: One-click download of `liora_hospital_staff_report.csv` for hospital administration.

### 9. Activity History & Audit Trail
- Immutable chronological record of all administrative front-desk operations:
  - `PATIENT_CHECKIN`
  - `APPOINTMENT_CREATE`
  - `APPOINTMENT_RESCHEDULE`
  - `APPOINTMENT_CANCEL`
  - `CALL_LOGGED`
  - `STATUS_CHANGE`
  - `PATIENT_REGISTER`
- Captures staff member ID, timestamp, target record, and detailed payload.

### 10. Profile & Settings
- Staff account settings, assigned desk, and department information.
- Password change with bcrypt hashing verification.
- Customizable queue auto-refresh intervals (10s, 15s, 30s, 60s).
- Configurable long-wait warning thresholds (15m, 20m, 30m).
- Cross-portal connectivity health indicators.

---

## 🚀 Running the System

### Prerequisites
- Node.js v18+ (tested on Node v22.23.3)
- npm v9+

### Starting Staff Portal (Port 5174 / Backend 5002)

From the `staff portal` workspace directory:

```bash
# Terminal 1 — Start Staff Backend (Port 5002)
cd backend
npm run dev

# Terminal 2 — Start Staff Frontend (Port 5174)
cd frontend
npm run dev
```

Or from the root directory:
```bash
npm run dev:backend
npm run dev:frontend
```

Open **http://localhost:5174** in your browser to access the Staff Portal.

---

## 🎨 Design System & Aesthetics
- **Typography**: Google Fonts *Plus Jakarta Sans* (`wght@400;500;600;700;800`).
- **Color Palette**:
  - Primary Purple: `#7C3AED` (Hover: `#6D28D9`, Deep: `#4C1D95`)
  - Lavender Surfaces: `#FAF5FF`, `#F5EEFF`, `#F3F0FF`
  - Borders: `#E9D5FF`
  - Status Pills: Emerald (`#10B981`), Amber (`#F59E0B`), Rose (`#EF4444`), Sky (`#0284C7`)
- Visual consistency guaranteed with Liora Hospitals Doctor and Patient Portals.
