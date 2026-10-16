import bcrypt from "bcryptjs";

// Hash for default password: "password123"
const DEFAULT_PASSWORD_HASH = "$2a$10$w3U6U7x2yJ5uT7K.e2A5b.87eY8gqC4w7O8r3N9z0P1q2R3S4T5U6";

export const initialStaffMembers = [
  {
    id: "staff-1",
    staffId: "STAFF101",
    name: "Priya Nambiar",
    email: "p.nambiar@liorahospitals.com",
    phone: "+91 98765 43220",
    password: DEFAULT_PASSWORD_HASH,
    role: "Front Desk Receptionist",
    department: "Central Reception & OPD Triage",
    desk: "Counter 2 — Main OPD Lobby",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400",
    permissions: [
      "appointments:read",
      "appointments:create",
      "appointments:edit",
      "appointments:reschedule",
      "appointments:cancel",
      "patient:register",
      "patient:checkin",
      "queue:manage",
      "calls:log",
      "notifications:read"
    ],
    isActive: true,
    joinedDate: "2023-04-12"
  },
  {
    id: "staff-2",
    staffId: "STAFF102",
    name: "Kavita Sen",
    email: "k.sen@liorahospitals.com",
    phone: "+91 98765 43221",
    password: DEFAULT_PASSWORD_HASH,
    role: "Appointment Coordinator",
    department: "Outpatient Care Coordination",
    desk: "Desk 4 — Coordination Wing",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400",
    permissions: [
      "appointments:read",
      "appointments:create",
      "appointments:edit",
      "appointments:reschedule",
      "appointments:cancel",
      "calls:log",
      "reports:read",
      "reports:export",
      "notifications:read"
    ],
    isActive: true,
    joinedDate: "2023-08-01"
  },
  {
    id: "staff-3",
    staffId: "STAFF100",
    name: "Arun Mehta",
    email: "a.mehta@liorahospitals.com",
    phone: "+91 98765 43222",
    password: DEFAULT_PASSWORD_HASH,
    role: "Front Desk Lead & Supervisor",
    department: "Patient Administration",
    desk: "Supervisor Office — Ground Floor",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
    permissions: [
      "all",
      "appointments:all",
      "patient:all",
      "queue:all",
      "doctors:schedule",
      "reports:all",
      "audit:read"
    ],
    isActive: true,
    joinedDate: "2022-01-15"
  }
];

export const initialWaitingQueue = [
  {
    id: "q-101",
    queueNumber: "Q-01",
    appointmentId: "APT-2026-0902",
    patientId: "PAT1022",
    patientName: "Priya Nair",
    patientPhone: "+91 98765 43221",
    age: 32,
    gender: "Female",
    doctorId: "DOC1001",
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology & Vascular Medicine",
    cabin: "Cabin 302, 3rd Floor",
    appointmentTime: "10:30 AM",
    checkInTime: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    status: "With Doctor",
    priority: "Normal",
    receptionNotes: "Patient verified ID, vitals taken at triage counter.",
    notifiedDoctorAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    withDoctorAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    checkedInBy: "STAFF101"
  },
  {
    id: "q-102",
    queueNumber: "Q-02",
    appointmentId: "APT-2026-0905",
    patientId: "PAT1025",
    patientName: "David Fernandez",
    patientPhone: "+91 98765 43224",
    age: 58,
    gender: "Male",
    doctorId: "DOC1002",
    doctorName: "Dr. Rajesh Patel",
    department: "Dermatology & Cutaneous Surgery",
    cabin: "Cabin 205, 2nd Floor",
    appointmentTime: "10:00 AM",
    checkInTime: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    status: "Waiting",
    priority: "Senior Citizen",
    receptionNotes: "Senior patient accompanied by daughter. Wheelchair provided.",
    notifiedDoctorAt: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    checkedInBy: "STAFF101"
  },
  {
    id: "q-103",
    queueNumber: "Q-03",
    appointmentId: "APT-2026-0903",
    patientId: "PAT1023",
    patientName: "Amit Verma",
    patientPhone: "+91 98765 43222",
    age: 45,
    gender: "Male",
    doctorId: "DOC1001",
    doctorName: "Dr. Sarah Jenkins",
    department: "Cardiology & Vascular Medicine",
    cabin: "Cabin 302, 3rd Floor",
    appointmentTime: "11:15 AM",
    checkInTime: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    status: "Checked In",
    priority: "Normal",
    receptionNotes: "Early arrival for ECG report verification.",
    notifiedDoctorAt: new Date(Date.now() - 11 * 60 * 1000).toISOString(),
    checkedInBy: "STAFF102"
  }
];

export const initialCallLogs = [
  {
    id: "call-1",
    patientId: "PAT1024",
    patientName: "Meera Kapoor",
    patientPhone: "+91 98765 43223",
    appointmentId: "APT-2026-0904",
    callType: "Appointment Confirmation",
    outcome: "appointment_confirmed",
    notes: "Patient confirmed she will arrive 15 minutes before 02:00 PM appointment.",
    callbackScheduled: null,
    staffId: "STAFF102",
    staffName: "Kavita Sen",
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  },
  {
    id: "call-2",
    patientId: "PAT1026",
    patientName: "Karthik Iyer",
    patientPhone: "+91 98765 43225",
    appointmentId: "APT-2026-0906",
    callType: "Pre-Visit Reminder",
    outcome: "answered",
    notes: "Patient acknowledged appointment. Requested directions to surgical complex.",
    callbackScheduled: null,
    staffId: "STAFF101",
    staffName: "Priya Nambiar",
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString()
  },
  {
    id: "call-3",
    patientId: "PAT1027",
    patientName: "Sunita Desai",
    patientPhone: "+91 98765 43226",
    appointmentId: "APT-2026-0907",
    callType: "Appointment Confirmation",
    outcome: "callback_requested",
    notes: "Patient in transit. Asked to call back at 11:45 AM to confirm status.",
    callbackScheduled: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    staffId: "STAFF102",
    staffName: "Kavita Sen",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
  }
];

export const initialStaffNotifications = [
  {
    id: "snotif-1",
    title: "Patient Checked In: Amit Verma",
    message: "Amit Verma (PAT1023) checked in for Dr. Sarah Jenkins (11:15 AM). Added to queue as Q-03.",
    type: "checkin",
    priority: "normal",
    isRead: false,
    link: "/staff/queue",
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString()
  },
  {
    id: "snotif-2",
    title: "Patient Waiting Exceeding Threshold",
    message: "David Fernandez (Q-02) has been waiting for 25 minutes for Dr. Rajesh Patel.",
    type: "delay",
    priority: "urgent",
    isRead: false,
    link: "/staff/queue",
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: "snotif-3",
    title: "Callback Reminder: Sunita Desai",
    message: "Scheduled follow-up callback due for Sunita Desai (+91 98765 43226).",
    type: "callback",
    priority: "important",
    isRead: false,
    link: "/staff/calls",
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString()
  },
  {
    id: "snotif-4",
    title: "Appointment Requiring Confirmation",
    message: "Meera Kapoor appointment APT-2026-0904 is scheduled for 02:00 PM today.",
    type: "confirmation",
    priority: "normal",
    isRead: true,
    link: "/staff/appointments",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  }
];

export const initialAuditLogs = [
  {
    id: "aud-1",
    action: "PATIENT_CHECKIN",
    description: "Checked in patient Priya Nair for appointment APT-2026-0902 (Queue Q-01)",
    performedBy: "STAFF101 (Priya Nambiar)",
    target: "Priya Nair / APT-2026-0902",
    details: { queueNumber: "Q-01", doctorId: "DOC1001", status: "Checked In" },
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: "aud-2",
    action: "STATUS_TRANSITION",
    description: "Updated Queue Q-01 status to 'With Doctor'",
    performedBy: "STAFF101 (Priya Nambiar)",
    target: "Priya Nair / APT-2026-0902",
    details: { status: "With Doctor" },
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: "aud-3",
    action: "CALL_LOGGED",
    description: "Logged confirmation call outcome 'appointment_confirmed' for Meera Kapoor",
    performedBy: "STAFF102 (Kavita Sen)",
    target: "Meera Kapoor / APT-2026-0904",
    details: { outcome: "appointment_confirmed" },
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  }
];
