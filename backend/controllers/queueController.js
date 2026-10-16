import db from "../config/db.js";
import crossPortalSyncService from "../services/crossPortalSyncService.js";

export const getLiveQueue = (req, res) => {
  try {
    const { doctorId, status, department } = req.query;
    let queue = db.find("waitingQueue", () => true);

    if (doctorId && doctorId !== "All") {
      queue = queue.filter((q) => q.doctorId === doctorId);
    }

    if (department && department !== "All") {
      queue = queue.filter(
        (q) => q.department && q.department.toLowerCase() === department.toLowerCase()
      );
    }

    if (status && status !== "All") {
      queue = queue.filter((q) => q.status.toLowerCase() === status.toLowerCase());
    }

    // Calculate real waiting duration in minutes for each active queue item
    const now = Date.now();
    const enrichedQueue = queue.map((item) => {
      const checkInMs = new Date(item.checkInTime).getTime();
      const waitingMinutes = Math.max(0, Math.floor((now - checkInMs) / (60 * 1000)));

      let nextAction = "Call Patient to Cabin";
      if (item.status === "Checked In") nextAction = "Move to Waiting Room / Notify Doctor";
      if (item.status === "Waiting") nextAction = "Direct to Doctor's Cabin";
      if (item.status === "With Doctor") nextAction = "Consultation in progress";
      if (item.status === "Completed") nextAction = "Collect Prescription / Exit";
      if (item.status === "Left") nextAction = "No further action";

      return {
        ...item,
        waitingMinutes,
        isDelayed: waitingMinutes > 20 && item.status === "Waiting",
        nextAction
      };
    });

    // Sort order: active first, then queue number
    enrichedQueue.sort((a, b) => {
      const statusOrder = { "With Doctor": 1, "Waiting": 2, "Checked In": 3, "Delayed": 4, "Completed": 5, "Left": 6 };
      const orderA = statusOrder[a.status] || 99;
      const orderB = statusOrder[b.status] || 99;
      if (orderA !== orderB) return orderA - orderB;
      return (a.queueNumber || "").localeCompare(b.queueNumber || "");
    });

    return res.status(200).json({
      success: true,
      count: enrichedQueue.length,
      queue: enrichedQueue
    });
  } catch (error) {
    console.error("[Get Queue Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const checkInPatient = async (req, res) => {
  try {
    const { appointmentId, patientId, priority, receptionNotes } = req.body;

    let appt = null;
    if (appointmentId) {
      appt = db.findOne("appointments", (a) => a.appointmentId === appointmentId || a.id === appointmentId);
    }

    let patient = null;
    if (appt) {
      patient = db.findOne("patients", (p) => p.patientId === appt.patientId);
    } else if (patientId) {
      patient = db.findOne("patients", (p) => p.patientId === patientId || p.id === patientId);
    }

    if (!appt && !patient) {
      return res.status(400).json({
        success: false,
        message: "Valid appointment ID or patient ID required for check-in."
      });
    }

    // Check if already in queue
    const existingQueue = db.findOne(
      "waitingQueue",
      (q) => (appt && q.appointmentId === appt.appointmentId) && q.status !== "Completed" && q.status !== "Left"
    );

    if (existingQueue) {
      return res.status(409).json({
        success: false,
        message: `Patient is already checked in to queue as ${existingQueue.queueNumber} (Status: ${existingQueue.status}).`,
        queueItem: existingQueue
      });
    }

    // Generate Queue Number
    const queueList = db.find("waitingQueue", () => true);
    const queueNumber = `Q-${String(queueList.length + 1).padStart(2, "0")}`;

    const doctorId = appt ? appt.doctorId : "DOC1001";
    const doctorObj = db.findOne("doctors", (d) => d.doctorId === doctorId);

    const newQueueItem = {
      id: `q-${Date.now()}`,
      queueNumber,
      appointmentId: appt ? appt.appointmentId : `WALK-${Date.now()}`,
      patientId: patient ? patient.patientId : (appt ? appt.patientId : "PAT1021"),
      patientName: patient ? patient.name : (appt ? appt.patientName : "Walk-in Patient"),
      patientPhone: patient ? patient.phone : (appt ? appt.patientPhone : ""),
      age: patient ? patient.age : (appt ? appt.patientAge : 35),
      gender: patient ? patient.gender : (appt ? appt.patientGender : "Male"),
      doctorId,
      doctorName: doctorObj ? doctorObj.name : (appt ? appt.doctorName : "Assigned Consultant"),
      department: doctorObj ? doctorObj.department : (appt ? appt.department : "General Medicine"),
      cabin: doctorObj ? doctorObj.cabin : "Cabin 101",
      appointmentTime: appt ? appt.time : new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      checkInTime: new Date().toISOString(),
      status: "Checked In",
      priority: priority || "Normal",
      receptionNotes: receptionNotes || "Patient checked in at hospital reception.",
      checkedInBy: req.staff?.staffId || "STAFF101"
    };

    db.insert("waitingQueue", newQueueItem);

    // Update appointment status to Checked In
    if (appt) {
      db.update(
        "appointments",
        (a) => a.appointmentId === appt.appointmentId,
        (existing) => ({
          ...existing,
          status: "Checked In",
          consultationStatus: "Pending",
          updatedAt: new Date().toISOString(),
          history: [
            ...(existing.history || []),
            {
              status: "Checked In",
              changedBy: `${req.staff?.name || "Staff"} (${req.staff?.staffId || "STAFF101"})`,
              timestamp: new Date().toISOString(),
              notes: `Checked in. Assigned Queue Number ${queueNumber}.`
            }
          ]
        })
      );

      // Sync to Doctor & Patient portals
      crossPortalSyncService.syncStatusToDoctorPortal(appt.appointmentId, "Waiting", `Patient checked in as ${queueNumber}`);
      crossPortalSyncService.syncStatusToPatientPortal(appt.appointmentId, "Checked In", `Queue ${queueNumber}`);
    }

    // Auto-notify Doctor in Doctor Portal notifications
    db.insert("notifications", {
      id: `notif-${Date.now()}`,
      doctorId,
      title: `Patient Arrived: ${newQueueItem.patientName}`,
      message: `${newQueueItem.patientName} has checked in (Queue ${queueNumber}) for your ${newQueueItem.appointmentTime} slot.`,
      type: "appointment",
      isRead: false,
      timestamp: new Date().toISOString(),
      link: "/doctor/appointments"
    });

    // Staff Notification
    db.insert("staffNotifications", {
      id: `snotif-${Date.now()}`,
      title: `Checked In: ${newQueueItem.patientName} (${queueNumber})`,
      message: `Assigned to ${newQueueItem.doctorName}. Priority: ${newQueueItem.priority}.`,
      type: "checkin",
      priority: priority === "Urgent" || priority === "Emergency" ? "urgent" : "normal",
      isRead: false,
      link: "/staff/queue",
      timestamp: new Date().toISOString()
    });

    // Audit log
    db.audit(
      "PATIENT_CHECKIN",
      `Checked in ${newQueueItem.patientName} (${queueNumber}) for ${newQueueItem.doctorName}`,
      req.staff?.staffId || "STAFF101",
      newQueueItem.appointmentId,
      { queueNumber, priority: newQueueItem.priority }
    );

    return res.status(201).json({
      success: true,
      message: `Patient checked in successfully! Assigned Ticket ${queueNumber}.`,
      queueItem: newQueueItem
    });
  } catch (error) {
    console.error("[Check In Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateQueueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const validStatuses = ["Checked In", "Waiting", "With Doctor", "Completed", "Delayed", "Left"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid queue status. Must be one of: ${validStatuses.join(", ")}`
      });
    }

    const queueItem = db.findOne("waitingQueue", (q) => q.id === id || q.queueNumber === id);
    if (!queueItem) {
      return res.status(404).json({ success: false, message: "Queue entry not found." });
    }

    const updated = db.update(
      "waitingQueue",
      (q) => q.id === id || q.queueNumber === id,
      (existing) => ({
        ...existing,
        status,
        receptionNotes: notes ? `${existing.receptionNotes || ""} | ${notes}` : existing.receptionNotes,
        ...(status === "With Doctor" ? { withDoctorAt: new Date().toISOString() } : {}),
        ...(status === "Completed" ? { completedAt: new Date().toISOString() } : {}),
        ...(status === "Left" ? { leftAt: new Date().toISOString() } : {})
      })
    );

    // Synchronize to appointment if linked
    if (queueItem.appointmentId) {
      let apptStatus = "Waiting";
      if (status === "With Doctor") apptStatus = "In Consultation";
      if (status === "Completed") apptStatus = "Completed";
      if (status === "Left") apptStatus = "Left Before Consultation";

      db.update(
        "appointments",
        (a) => a.appointmentId === queueItem.appointmentId,
        (existing) => ({
          ...existing,
          status: apptStatus,
          updatedAt: new Date().toISOString(),
          history: [
            ...(existing.history || []),
            {
              status: apptStatus,
              changedBy: `${req.staff?.name || "Staff"} (${req.staff?.staffId || "STAFF101"})`,
              timestamp: new Date().toISOString(),
              notes: `Queue ${queueItem.queueNumber} updated to ${status}.`
            }
          ]
        })
      );

      // Sync with Doctor & Patient portals
      crossPortalSyncService.syncStatusToDoctorPortal(queueItem.appointmentId, apptStatus, notes);
      crossPortalSyncService.syncStatusToPatientPortal(queueItem.appointmentId, apptStatus, notes);
    }

    // Audit log
    db.audit(
      "QUEUE_STATUS_CHANGE",
      `Queue ${queueItem.queueNumber} (${queueItem.patientName}) updated to '${status}'`,
      req.staff?.staffId || "STAFF101",
      queueItem.queueNumber,
      { newStatus: status, notes }
    );

    return res.status(200).json({
      success: true,
      message: `Queue status updated to ${status}.`,
      queueItem: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const notifyDoctor = (req, res) => {
  try {
    const { id } = req.params;
    const queueItem = db.findOne("waitingQueue", (q) => q.id === id || q.queueNumber === id);

    if (!queueItem) {
      return res.status(404).json({ success: false, message: "Queue record not found." });
    }

    // Insert notification to Doctor Portal
    db.insert("notifications", {
      id: `notif-${Date.now()}`,
      doctorId: queueItem.doctorId,
      title: `Patient Ready: ${queueItem.patientName} (${queueItem.queueNumber})`,
      message: `Patient ${queueItem.patientName} is waiting in the reception lounge for consultation in ${queueItem.cabin}.`,
      type: "appointment",
      isRead: false,
      timestamp: new Date().toISOString(),
      link: "/doctor/appointments"
    });

    db.update(
      "waitingQueue",
      (q) => q.id === queueItem.id,
      (existing) => ({
        ...existing,
        notifiedDoctorAt: new Date().toISOString(),
        status: existing.status === "Checked In" ? "Waiting" : existing.status
      })
    );

    db.audit(
      "DOCTOR_NOTIFIED",
      `Notified Dr. ${queueItem.doctorName} of patient arrival for Queue ${queueItem.queueNumber}`,
      req.staff?.staffId || "STAFF101",
      queueItem.queueNumber
    );

    return res.status(200).json({
      success: true,
      message: `Notification dispatched to Dr. ${queueItem.doctorName}'s portal!`
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
