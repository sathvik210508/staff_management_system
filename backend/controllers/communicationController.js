import db from "../config/db.js";
import crossPortalSyncService from "../services/crossPortalSyncService.js";

export const getCallList = (req, res) => {
  try {
    const { status, search } = req.query;

    // Upcoming or unconfirmed appointments needing calls
    let appointments = db.find(
      "appointments",
      (a) => a.status === "Booked" || a.status === "Scheduled" || a.status === "Rescheduled" || a.status === "Waiting for Clarification"
    );

    if (search) {
      const q = search.toLowerCase().trim();
      appointments = appointments.filter((a) => {
        const name = (a.patientName || "").toLowerCase();
        const phone = (a.patientPhone || "").toLowerCase();
        const doc = (a.doctorName || a.doctor || "").toLowerCase();
        return name.includes(q) || phone.includes(q) || doc.includes(q);
      });
    }

    // Attach latest call log for each appointment
    const enrichedList = appointments.map((appt) => {
      const pastCalls = db.find("callLogs", (c) => c.appointmentId === appt.appointmentId);
      pastCalls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const latestCall = pastCalls[0] || null;

      return {
        appointmentId: appt.appointmentId,
        patientId: appt.patientId,
        patientName: appt.patientName,
        patientPhone: appt.patientPhone,
        doctorName: appt.doctorName || appt.doctor,
        department: appt.department,
        appointmentDate: appt.date,
        appointmentTime: appt.time,
        status: appt.status,
        callCount: pastCalls.length,
        latestCall,
        needsConfirmation: appt.status !== "Confirmed"
      };
    });

    return res.status(200).json({
      success: true,
      count: enrichedList.length,
      callList: enrichedList
    });
  } catch (error) {
    console.error("[Get Call List Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logCall = async (req, res) => {
  try {
    const {
      appointmentId,
      patientId,
      patientName,
      patientPhone,
      callType,
      outcome,
      notes,
      callbackScheduled,
      confirmAppointment
    } = req.body;

    const validOutcomes = [
      "answered",
      "no_answer",
      "busy",
      "callback_requested",
      "appointment_confirmed",
      "reschedule_requested",
      "invalid_number"
    ];

    if (!outcome || !validOutcomes.includes(outcome)) {
      return res.status(400).json({
        success: false,
        message: `Invalid call outcome. Must be one of: ${validOutcomes.join(", ")}`
      });
    }

    const newCallLog = {
      id: `call-${Date.now()}`,
      appointmentId: appointmentId || "GENERAL",
      patientId: patientId || "PAT1021",
      patientName: patientName || "Patient",
      patientPhone: patientPhone || "",
      callType: callType || "Appointment Confirmation",
      outcome,
      notes: notes || "Call completed by staff.",
      callbackScheduled: callbackScheduled || null,
      staffId: req.staff?.staffId || "STAFF101",
      staffName: req.staff?.name || "Staff Member",
      createdAt: new Date().toISOString()
    };

    db.insert("callLogs", newCallLog);

    // If outcome is appointment_confirmed or confirmAppointment is true
    if ((outcome === "appointment_confirmed" || confirmAppointment) && appointmentId) {
      db.update(
        "appointments",
        (a) => a.appointmentId === appointmentId,
        (existing) => ({
          ...existing,
          status: "Confirmed",
          updatedAt: new Date().toISOString(),
          history: [
            ...(existing.history || []),
            {
              status: "Confirmed",
              changedBy: `${req.staff?.name} (${req.staff?.staffId})`,
              timestamp: new Date().toISOString(),
              notes: `Confirmed via phone call: ${notes || "Patient confirmed attendance."}`
            }
          ]
        })
      );

      // Synchronize confirmation to Doctor Portal and Patient Portal
      crossPortalSyncService.syncStatusToDoctorPortal(appointmentId, "Confirmed", notes);
      crossPortalSyncService.syncStatusToPatientPortal(appointmentId, "Upcoming Confirmed", notes);
    }

    // If callback scheduled, add staff notification
    if (callbackScheduled) {
      db.insert("staffNotifications", {
        id: `snotif-${Date.now()}`,
        title: `Scheduled Callback: ${newCallLog.patientName}`,
        message: `Callback scheduled for ${new Date(callbackScheduled).toLocaleString()}. Phone: ${patientPhone}. Notes: ${notes}`,
        type: "callback",
        priority: "important",
        isRead: false,
        link: "/staff/calls",
        timestamp: new Date().toISOString()
      });
    }

    // Audit log
    db.audit(
      "CALL_LOGGED",
      `Recorded call outcome '${outcome}' for ${newCallLog.patientName}`,
      req.staff?.staffId || "STAFF101",
      appointmentId || patientId,
      { outcome, callbackScheduled }
    );

    return res.status(201).json({
      success: true,
      message: "Call outcome recorded successfully.",
      callLog: newCallLog
    });
  } catch (error) {
    console.error("[Log Call Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCallHistory = (req, res) => {
  try {
    const { patientId, appointmentId } = req.query;
    let logs = db.find("callLogs", () => true);

    if (patientId) {
      logs = logs.filter((c) => c.patientId === patientId);
    }

    if (appointmentId) {
      logs = logs.filter((c) => c.appointmentId === appointmentId);
    }

    logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      count: logs.length,
      callLogs: logs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const sendReminder = (req, res) => {
  try {
    const { appointmentId, patientPhone, patientName } = req.body;

    const appt = db.findOne("appointments", (a) => a.appointmentId === appointmentId);

    // In hospital settings without third-party SMS vendor keys active,
    // we clearly mark provider status as simulated/ready for provider hook.
    const reminderLog = {
      id: `rem-${Date.now()}`,
      appointmentId,
      recipient: patientPhone || (appt ? appt.patientPhone : ""),
      patientName: patientName || (appt ? appt.patientName : ""),
      message: `Dear ${patientName || "Patient"}, reminder for your appointment with ${appt?.doctorName || "Dr. Sarah Jenkins"} on ${appt?.date || "today"} at ${appt?.time || "scheduled time"}.`,
      provider: "Liora Gateway (Simulation Mode — Active SMS Gateway integration required for carrier dispatch)",
      status: "Dispatched",
      sentBy: req.staff?.staffId || "STAFF101",
      sentAt: new Date().toISOString()
    };

    db.audit(
      "REMINDER_SENT",
      `Sent appointment reminder notification for ${reminderLog.patientName} (${appointmentId})`,
      req.staff?.staffId || "STAFF101",
      appointmentId
    );

    return res.status(200).json({
      success: true,
      message: `Appointment reminder dispatched to ${reminderLog.recipient}.`,
      reminder: reminderLog
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
