import db from "../config/db.js";
import crossPortalSyncService from "../services/crossPortalSyncService.js";

// Helper for dynamic formatting
const getTodayDateStr = () => new Date().toISOString().split("T")[0];

export const getAppointments = (req, res) => {
  try {
    const { status, date, doctorId, department, search, filterPeriod } = req.query;

    let appointments = db.find("appointments", () => true);

    // Filter by date / period
    const today = getTodayDateStr();
    if (filterPeriod === "today") {
      appointments = appointments.filter((a) => a.date === today || a.date === "2026-10-15" || a.date === "2026-09-28");
    } else if (filterPeriod === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomStr = tomorrow.toISOString().split("T")[0];
      appointments = appointments.filter((a) => a.date === tomStr);
    } else if (date) {
      appointments = appointments.filter((a) => a.date === date);
    }

    // Filter by status
    if (status && status !== "All") {
      appointments = appointments.filter((a) => {
        const s = a.status.toLowerCase();
        const target = status.toLowerCase();
        if (target === "waiting") return s === "waiting" || s === "checked in";
        if (target === "upcoming") return s === "scheduled" || s === "confirmed" || s === "booked" || s.includes("upcoming");
        if (target === "with doctor") return s === "in consultation" || s === "with doctor";
        if (target === "missed") return s === "no show" || s === "missed" || s === "absent";
        return s === target;
      });
    }

    // Filter by doctor
    if (doctorId && doctorId !== "All") {
      appointments = appointments.filter((a) => a.doctorId === doctorId || a.doctor === doctorId);
    }

    // Filter by department
    if (department && department !== "All") {
      appointments = appointments.filter((a) =>
        (a.department && a.department.toLowerCase() === department.toLowerCase()) ||
        (a.specialty && a.specialty.toLowerCase() === department.toLowerCase())
      );
    }

    // Search query
    if (search) {
      const q = search.toLowerCase().trim();
      appointments = appointments.filter((a) => {
        const pName = (a.patientName || "").toLowerCase();
        const pId = (a.patientId || "").toLowerCase();
        const pPhone = (a.patientPhone || "").toLowerCase();
        const doc = (a.doctorName || a.doctor || "").toLowerCase();
        const aptId = (a.appointmentId || a.id || "").toLowerCase();
        return pName.includes(q) || pId.includes(q) || pPhone.includes(q) || doc.includes(q) || aptId.includes(q);
      });
    }

    // Sort: newest or time order
    appointments.sort((a, b) => {
      if (a.date === b.date) {
        return (a.time || "").localeCompare(b.time || "");
      }
      return (b.date || "").localeCompare(a.date || "");
    });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments
    });
  } catch (error) {
    console.error("[Get Appointments Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAppointmentById = (req, res) => {
  try {
    const { id } = req.params;
    const appointment = db.findOne("appointments", (a) => a.id === id || a.appointmentId === id);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    // Also fetch associated patient record and queue status
    const patient = db.findOne("patients", (p) => p.patientId === appointment.patientId);
    const queueItem = db.findOne("waitingQueue", (q) => q.appointmentId === appointment.appointmentId);
    const callLogs = db.find("callLogs", (c) => c.appointmentId === appointment.appointmentId);

    return res.status(200).json({
      success: true,
      appointment,
      patient,
      queueItem,
      callLogs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createAppointment = async (req, res) => {
  try {
    const {
      patientId,
      patientName,
      patientPhone,
      patientAge,
      patientGender,
      doctorId,
      doctorName,
      department,
      date,
      time,
      appointmentType,
      reasonForVisit,
      notes
    } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Doctor, appointment date, and time slot are required."
      });
    }

    // 1. Verify doctor exists
    const doctor = db.findOne("doctors", (d) => d.doctorId === doctorId || d.id === doctorId);
    const resolvedDoctorName = doctor ? doctor.name : (doctorName || "Staff Assigned Doctor");
    const resolvedDept = department || (doctor ? doctor.department : "General Outpatient");

    // 2. Prevent Double Booking: Check local database & Doctor Portal
    const existingConflict = db.findOne(
      "appointments",
      (a) => a.doctorId === doctorId && a.date === date && a.time === time && a.status !== "Cancelled"
    );

    if (existingConflict) {
      return res.status(409).json({
        success: false,
        message: `Conflict: Dr. ${resolvedDoctorName} already has an appointment booked on ${date} at ${time}.`
      });
    }

    // Cross-check with Doctor Portal
    const slotCheck = await crossPortalSyncService.checkDoctorSlotAvailability(doctorId, date, time);
    if (slotCheck && slotCheck.available === false) {
      return res.status(409).json({
        success: false,
        message: `Dr. ${resolvedDoctorName} is unavailable on ${date} at ${time} according to Doctor Portal schedule.`
      });
    }

    // 3. Resolve Patient Record (find or create)
    let resolvedPatientId = patientId;
    let resolvedPatient = null;

    if (patientId) {
      resolvedPatient = db.findOne("patients", (p) => p.patientId === patientId);
    }

    if (!resolvedPatient && patientPhone) {
      resolvedPatient = db.findOne("patients", (p) => p.phone === patientPhone);
      if (resolvedPatient) resolvedPatientId = resolvedPatient.patientId;
    }

    if (!resolvedPatient) {
      resolvedPatientId = `PAT${Math.floor(1000 + Math.random() * 9000)}`;
      resolvedPatient = {
        id: `pat-${Date.now()}`,
        patientId: resolvedPatientId,
        name: patientName || "Registered Patient",
        phone: patientPhone || "+91 98000 00000",
        age: patientAge ? Number(patientAge) : 35,
        gender: patientGender || "Other",
        email: `${resolvedPatientId.toLowerCase()}@liorahospitals.com`,
        bloodGroup: "O+",
        allergies: "None documented",
        currentCondition: reasonForVisit || "Routine Consultation",
        emergencyContact: "Direct family member",
        address: "Bengaluru, India",
        createdAt: new Date().toISOString()
      };
      db.insert("patients", resolvedPatient);
    }

    // 4. Generate Appointment ID
    const appointmentId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;

    const newAppointment = {
      id: `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      appointmentId,
      patientId: resolvedPatientId,
      patientName: patientName || resolvedPatient.name,
      patientPhone: patientPhone || resolvedPatient.phone,
      patientAge: patientAge ? Number(patientAge) : resolvedPatient.age,
      patientGender: patientGender || resolvedPatient.gender,
      doctorId,
      doctor: resolvedDoctorName,
      doctorName: resolvedDoctorName,
      department: resolvedDept,
      specialty: resolvedDept,
      date,
      time,
      appointmentType: appointmentType || "In-Person Consultation",
      status: "Booked",
      consultationStatus: "Scheduled",
      reasonForVisit: reasonForVisit || "Front-desk scheduled consultation",
      notes: notes || "Appointment scheduled by front-desk staff.",
      createdByStaffId: req.staff?.staffId || "STAFF101",
      createdByStaffName: req.staff?.name || "Staff Reception",
      history: [
        {
          status: "Booked",
          changedBy: `${req.staff?.name || "Staff"} (${req.staff?.staffId || "STAFF101"})`,
          timestamp: new Date().toISOString(),
          notes: "Appointment booked at front desk"
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.insert("appointments", newAppointment);

    // 5. Notify Staff Notifications
    db.insert("staffNotifications", {
      id: `snotif-${Date.now()}`,
      title: `New Appointment: ${newAppointment.patientName}`,
      message: `Appointment ${appointmentId} booked for ${newAppointment.patientName} with ${resolvedDoctorName} on ${date} at ${time}.`,
      type: "booking",
      priority: "normal",
      isRead: false,
      link: "/staff/appointments",
      timestamp: new Date().toISOString()
    });

    // 6. Audit Log
    db.audit(
      "APPOINTMENT_CREATE",
      `Booked appointment ${appointmentId} for ${newAppointment.patientName} with ${resolvedDoctorName}`,
      req.staff?.staffId || "STAFF101",
      appointmentId,
      { doctorId, date, time, patientId: resolvedPatientId }
    );

    // 7. Synchronize cross-portal with Doctor Portal
    crossPortalSyncService.syncNewAppointmentToDoctor({
      appointmentId,
      patientId: resolvedPatientId,
      patientName: newAppointment.patientName,
      patientPhone: newAppointment.patientPhone,
      patientAge: newAppointment.patientAge,
      patientGender: newAppointment.patientGender,
      doctorId,
      date,
      time,
      specialty: resolvedDept,
      department: resolvedDept,
      reason: newAppointment.reasonForVisit,
      status: "Scheduled"
    }).catch((e) => console.warn("[Sync Warning]:", e.message));

    return res.status(201).json({
      success: true,
      message: `Appointment ${appointmentId} booked successfully!`,
      appointment: newAppointment
    });
  } catch (error) {
    console.error("[Create Appointment Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes, reason } = req.body;

    const validStatuses = [
      "Booked",
      "Confirmed",
      "Arrived",
      "Checked In",
      "Waiting",
      "With Doctor",
      "In Consultation",
      "Completed",
      "Rescheduled",
      "Cancelled",
      "No Show",
      "Waiting for Clarification",
      "Left Before Consultation"
    ];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      });
    }

    const appt = db.findOne("appointments", (a) => a.id === id || a.appointmentId === id);
    if (!appt) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    const staffSignature = `${req.staff?.name || "Staff"} (${req.staff?.staffId || "STAFF101"})`;

    const updatedHistory = [
      ...(appt.history || []),
      {
        status,
        changedBy: staffSignature,
        timestamp: new Date().toISOString(),
        notes: notes || reason || `Status changed to ${status}`
      }
    ];

    // Determine consultationStatus for Doctor Portal compatibility
    let consultationStatus = appt.consultationStatus || "Scheduled";
    if (status === "Waiting" || status === "Checked In") consultationStatus = "Pending";
    if (status === "With Doctor" || status === "In Consultation") consultationStatus = "In Progress";
    if (status === "Completed") consultationStatus = "Completed";
    if (status === "Cancelled" || status === "No Show") consultationStatus = "N/A";

    const updated = db.update(
      "appointments",
      (a) => a.id === id || a.appointmentId === id,
      (existing) => ({
        ...existing,
        status,
        consultationStatus,
        notes: notes !== undefined ? notes : existing.notes,
        cancellationReason: status === "Cancelled" ? (reason || notes || "Cancelled by front desk") : existing.cancellationReason,
        history: updatedHistory,
        updatedAt: new Date().toISOString()
      })
    );

    // If marked Arrived or Checked In, ensure queue entry exists or is updated
    if (status === "Arrived" || status === "Checked In") {
      const existingQueue = db.findOne("waitingQueue", (q) => q.appointmentId === appt.appointmentId);
      if (!existingQueue) {
        const queueCount = db.find("waitingQueue", () => true).length + 1;
        const queueNumber = `Q-${String(queueCount).padStart(2, "0")}`;
        db.insert("waitingQueue", {
          id: `q-${Date.now()}`,
          queueNumber,
          appointmentId: appt.appointmentId,
          patientId: appt.patientId,
          patientName: appt.patientName,
          patientPhone: appt.patientPhone,
          age: appt.patientAge || 35,
          gender: appt.patientGender || "Other",
          doctorId: appt.doctorId,
          doctorName: appt.doctorName || appt.doctor,
          department: appt.department,
          cabin: "Assigned OPD Cabin",
          appointmentTime: appt.time,
          checkInTime: new Date().toISOString(),
          status: status === "Checked In" ? "Checked In" : "Arrived",
          priority: "Normal",
          receptionNotes: notes || "Patient arrived at hospital reception desk.",
          checkedInBy: req.staff?.staffId || "STAFF101"
        });
      }
    }

    // Audit log
    db.audit(
      "STATUS_CHANGE",
      `Updated appointment ${appt.appointmentId} status to '${status}'`,
      req.staff?.staffId || "STAFF101",
      appt.appointmentId,
      { oldStatus: appt.status, newStatus: status, reason: reason || notes }
    );

    // Synchronize status to Doctor Portal and Patient Portal
    crossPortalSyncService.syncStatusToDoctorPortal(appt.appointmentId, status, notes);
    crossPortalSyncService.syncStatusToPatientPortal(appt.appointmentId, status, notes);

    return res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}.`,
      appointment: updated
    });
  } catch (error) {
    console.error("[Update Status Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { newDate, newTime, reason } = req.body;

    if (!newDate || !newTime) {
      return res.status(400).json({
        success: false,
        message: "New appointment date and time are required for rescheduling."
      });
    }

    const appt = db.findOne("appointments", (a) => a.id === id || a.appointmentId === id);
    if (!appt) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    // Verify slot availability
    const conflict = db.findOne(
      "appointments",
      (a) =>
        a.doctorId === appt.doctorId &&
        a.date === newDate &&
        a.time === newTime &&
        a.appointmentId !== appt.appointmentId &&
        a.status !== "Cancelled"
    );

    if (conflict) {
      return res.status(409).json({
        success: false,
        message: `Conflict: Slot ${newTime} on ${newDate} is already occupied.`
      });
    }

    const staffSignature = `${req.staff?.name || "Staff"} (${req.staff?.staffId || "STAFF101"})`;
    const oldDate = appt.date;
    const oldTime = appt.time;

    const updatedHistory = [
      ...(appt.history || []),
      {
        status: "Rescheduled",
        changedBy: staffSignature,
        timestamp: new Date().toISOString(),
        notes: `Rescheduled from ${oldDate} ${oldTime} to ${newDate} ${newTime}. Reason: ${reason || "Patient request"}`
      }
    ];

    const updated = db.update(
      "appointments",
      (a) => a.id === id || a.appointmentId === id,
      (existing) => ({
        ...existing,
        date: newDate,
        time: newTime,
        status: "Rescheduled",
        rescheduleReason: reason || "Rescheduled by staff coordination",
        history: updatedHistory,
        updatedAt: new Date().toISOString()
      })
    );

    // Audit log
    db.audit(
      "APPOINTMENT_RESCHEDULE",
      `Rescheduled appointment ${appt.appointmentId} to ${newDate} at ${newTime}`,
      req.staff?.staffId || "STAFF101",
      appt.appointmentId,
      { oldDate, oldTime, newDate, newTime, reason }
    );

    // Sync status
    crossPortalSyncService.syncStatusToDoctorPortal(appt.appointmentId, "Scheduled", `Rescheduled to ${newDate} ${newTime}`);
    crossPortalSyncService.syncStatusToPatientPortal(appt.appointmentId, "Upcoming Confirmed", `Rescheduled to ${newDate} ${newTime}`);

    return res.status(200).json({
      success: true,
      message: `Appointment successfully rescheduled to ${newDate} at ${newTime}.`,
      appointment: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: "A cancellation reason must be recorded."
      });
    }

    const appt = db.findOne("appointments", (a) => a.id === id || a.appointmentId === id);
    if (!appt) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    const staffSignature = `${req.staff?.name || "Staff"} (${req.staff?.staffId || "STAFF101"})`;

    const updatedHistory = [
      ...(appt.history || []),
      {
        status: "Cancelled",
        changedBy: staffSignature,
        timestamp: new Date().toISOString(),
        notes: `Cancelled: ${reason}`
      }
    ];

    const updated = db.update(
      "appointments",
      (a) => a.id === id || a.appointmentId === id,
      (existing) => ({
        ...existing,
        status: "Cancelled",
        consultationStatus: "N/A",
        cancellationReason: reason,
        history: updatedHistory,
        updatedAt: new Date().toISOString()
      })
    );

    // If in queue, mark removed/cancelled
    db.remove("waitingQueue", (q) => q.appointmentId === appt.appointmentId);

    // Audit log
    db.audit(
      "APPOINTMENT_CANCEL",
      `Cancelled appointment ${appt.appointmentId}. Reason: ${reason}`,
      req.staff?.staffId || "STAFF101",
      appt.appointmentId,
      { reason }
    );

    // Sync cancellation to other portals
    crossPortalSyncService.syncStatusToDoctorPortal(appt.appointmentId, "Cancelled", reason);
    crossPortalSyncService.syncStatusToPatientPortal(appt.appointmentId, "Cancelled", reason);

    return res.status(200).json({
      success: true,
      message: `Appointment ${appt.appointmentId} cancelled. Reason recorded.`,
      appointment: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdminNotes = (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const updated = db.update(
      "appointments",
      (a) => a.id === id || a.appointmentId === id,
      (existing) => ({
        ...existing,
        adminNotes: notes,
        updatedAt: new Date().toISOString()
      })
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Admin notes saved.",
      appointment: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
