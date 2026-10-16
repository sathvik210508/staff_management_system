import db from "../config/db.js";

// Webhook receiver when appointment status is updated in Doctor Portal or Patient Portal
export const updateAppointmentStatusFromExternal = (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Status is required." });
    }

    const appt = db.findOne("appointments", (a) => a.id === id || a.appointmentId === id);

    if (!appt) {
      return res.status(404).json({ success: false, message: "Appointment not found in Staff Portal." });
    }

    const updated = db.update(
      "appointments",
      (a) => a.id === id || a.appointmentId === id,
      (existing) => ({
        ...existing,
        status,
        notes: notes !== undefined ? notes : existing.notes,
        updatedAt: new Date().toISOString(),
        history: [
          ...(existing.history || []),
          {
            status,
            changedBy: "Doctor Portal / External System",
            timestamp: new Date().toISOString(),
            notes: notes || `Synchronized status: ${status}`
          }
        ]
      })
    );

    // Also update waitingQueue if status transitioned (e.g. In Consultation or Completed)
    let queueStatus = null;
    if (status === "In Consultation" || status === "With Doctor") queueStatus = "With Doctor";
    if (status === "Completed") queueStatus = "Completed";
    if (status === "Waiting") queueStatus = "Waiting";

    if (queueStatus) {
      db.update(
        "waitingQueue",
        (q) => q.appointmentId === appt.appointmentId,
        (existing) => ({
          ...existing,
          status: queueStatus,
          ...(queueStatus === "With Doctor" ? { withDoctorAt: new Date().toISOString() } : {}),
          ...(queueStatus === "Completed" ? { completedAt: new Date().toISOString() } : {})
        })
      );
    }

    // Add Staff Notification
    db.insert("staffNotifications", {
      id: `snotif-${Date.now()}`,
      title: `Status Sync: ${appt.patientName}`,
      message: `Appointment ${appt.appointmentId} status updated to ${status} by Doctor Portal.`,
      type: "sync",
      priority: "normal",
      isRead: false,
      link: "/staff/queue",
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      success: true,
      message: `Staff Portal synchronized appointment ${id} to ${status}.`,
      appointment: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Webhook receiver when a patient books an appointment in Patient Portal
export const receiveAppointmentFromExternal = (req, res) => {
  try {
    const {
      appointmentId,
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
      reason,
      status
    } = req.body;

    if (!appointmentId || !doctorId || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields."
      });
    }

    const doctor = db.findOne("doctors", (d) => d.doctorId === doctorId || d.id === doctorId);

    const newAppointment = {
      id: `apt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      appointmentId,
      patientId: patientId || "PAT1021",
      patientName: patientName || "Patient",
      patientPhone: patientPhone || "",
      patientAge: patientAge ? Number(patientAge) : 35,
      patientGender: patientGender || "Other",
      doctorId,
      doctorName: doctorName || (doctor ? doctor.name : "Assigned Doctor"),
      department: department || (doctor ? doctor.department : "General"),
      date,
      time,
      appointmentType: "Portal Booking",
      status: status || "Booked",
      consultationStatus: "Scheduled",
      reasonForVisit: reason || "Online Patient Booking",
      notes: "Booked via Liora Patient Portal.",
      history: [
        {
          status: "Booked",
          changedBy: "Patient Portal",
          timestamp: new Date().toISOString(),
          notes: "Online booking received"
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.insert("appointments", newAppointment);

    db.insert("staffNotifications", {
      id: `snotif-${Date.now()}`,
      title: `New Online Booking: ${newAppointment.patientName}`,
      message: `${newAppointment.patientName} booked appointment ${appointmentId} with ${newAppointment.doctorName} on ${date} at ${time}.`,
      type: "booking",
      priority: "normal",
      isRead: false,
      link: "/staff/appointments",
      timestamp: new Date().toISOString()
    });

    return res.status(201).json({
      success: true,
      message: "Appointment saved to Staff Portal.",
      appointment: newAppointment
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
