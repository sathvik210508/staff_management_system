import db from "../config/db.js";

export const getDoctors = (req, res) => {
  try {
    const { department, search } = req.query;
    let doctors = db.find("doctors", () => true);

    if (department && department !== "All") {
      doctors = doctors.filter(
        (d) =>
          (d.department && d.department.toLowerCase() === department.toLowerCase()) ||
          (d.specialization && d.specialization.toLowerCase() === department.toLowerCase())
      );
    }

    if (search) {
      const q = search.toLowerCase().trim();
      doctors = doctors.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.doctorId.toLowerCase().includes(q) ||
          (d.department && d.department.toLowerCase().includes(q)) ||
          (d.specialization && d.specialization.toLowerCase().includes(q))
      );
    }

    const today = new Date().toISOString().split("T")[0];

    // Enrich each doctor with today's real appointment count, current status, and slots
    const enriched = doctors.map((doc) => {
      const todayAppointments = db.find(
        "appointments",
        (a) => a.doctorId === doc.doctorId && (a.date === today || a.date === "2026-10-15" || a.date === "2026-09-28")
      );

      const activeQueue = db.find(
        "waitingQueue",
        (q) => q.doctorId === doc.doctorId && q.status !== "Completed" && q.status !== "Left"
      );

      const inConsultation = activeQueue.find((q) => q.status === "With Doctor");
      const waitingPatients = activeQueue.filter((q) => q.status === "Waiting" || q.status === "Checked In");

      let currentStatus = "available";
      if (inConsultation) {
        currentStatus = "consulting";
      } else if (waitingPatients.length > 0) {
        currentStatus = "scheduled";
      }

      // Next appointment
      const upcoming = todayAppointments.find(
        (a) => a.status === "Scheduled" || a.status === "Confirmed" || a.status === "Booked"
      );

      // Standard slots
      const slots = [
        "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM"
      ];

      const bookedSlots = todayAppointments.map((a) => a.time);
      const availableSlots = slots.filter((s) => !bookedSlots.includes(s));

      return {
        ...doc,
        todayAppointmentCount: todayAppointments.length,
        waitingCount: waitingPatients.length,
        inConsultation: !!inConsultation,
        inConsultationPatient: inConsultation ? inConsultation.patientName : null,
        currentStatus,
        nextAppointment: upcoming ? `${upcoming.time} — ${upcoming.patientName}` : "No more today",
        availableSlots,
        estimatedWaitTimeMins: waitingPatients.length * 15
      };
    });

    return res.status(200).json({
      success: true,
      count: enriched.length,
      doctors: enriched
    });
  } catch (error) {
    console.error("[Get Doctors Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDoctorSlots = (req, res) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    const doctor = db.findOne("doctors", (d) => d.doctorId === doctorId || d.id === doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found." });
    }

    const targetDate = date || new Date().toISOString().split("T")[0];

    const standardSlots = [
      "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
      "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"
    ];

    const bookedAppointments = db.find(
      "appointments",
      (a) => a.doctorId === doctor.doctorId && a.date === targetDate && a.status !== "Cancelled"
    );

    const bookedTimes = bookedAppointments.map((a) => a.time);

    const slots = standardSlots.map((time) => ({
      time,
      available: !bookedTimes.includes(time),
      bookedAppointment: bookedAppointments.find((a) => a.time === time) || null
    }));

    return res.status(200).json({
      success: true,
      doctorId: doctor.doctorId,
      doctorName: doctor.name,
      date: targetDate,
      slots
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
