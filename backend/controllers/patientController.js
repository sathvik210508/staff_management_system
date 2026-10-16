import db from "../config/db.js";

export const getPatients = (req, res) => {
  try {
    const { search } = req.query;
    let patients = db.find("patients", () => true);

    if (search) {
      const q = search.toLowerCase().trim();
      patients = patients.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const id = (p.patientId || "").toLowerCase();
        const phone = (p.phone || "").toLowerCase();
        const email = (p.email || "").toLowerCase();
        return name.includes(q) || id.includes(q) || phone.includes(q) || email.includes(q);
      });
    }

    return res.status(200).json({
      success: true,
      count: patients.length,
      patients
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPatientById = (req, res) => {
  try {
    const { id } = req.params;
    const patient = db.findOne("patients", (p) => p.id === id || p.patientId === id);

    if (!patient) {
      return res.status(404).json({ success: false, message: "Patient not found." });
    }

    // Get patient's appointments (past and upcoming)
    const appointments = db.find("appointments", (a) => a.patientId === patient.patientId || a.patientPhone === patient.phone);

    // Get call logs for patient
    const callLogs = db.find("callLogs", (c) => c.patientId === patient.patientId || c.patientPhone === patient.phone);

    // Active queue entry if any
    const activeQueue = db.findOne("waitingQueue", (q) => q.patientId === patient.patientId && q.status !== "Completed" && q.status !== "Left");

    return res.status(200).json({
      success: true,
      patient,
      appointments,
      callLogs,
      activeQueue
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const checkDuplicates = (req, res) => {
  try {
    const { phone, email, name } = req.query;

    const matches = db.find("patients", (p) => {
      const phoneMatch = phone && p.phone && p.phone.replace(/\D/g, "") === phone.replace(/\D/g, "");
      const emailMatch = email && p.email && p.email.toLowerCase() === email.toLowerCase();
      const nameMatch = name && p.name && p.name.toLowerCase() === name.toLowerCase();
      return phoneMatch || emailMatch || nameMatch;
    });

    return res.status(200).json({
      success: true,
      hasDuplicates: matches.length > 0,
      count: matches.length,
      duplicates: matches
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const registerPatient = (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      age,
      gender,
      bloodGroup,
      emergencyContact,
      address,
      receptionNotes
    } = req.body;

    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Patient full name and phone number are required."
      });
    }

    // 1. Strict Duplicate Check on Phone
    const cleanPhone = phone.trim();
    const existing = db.findOne("patients", (p) => p.phone === cleanPhone);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Duplicate record found: Patient ${existing.name} is already registered with phone ${cleanPhone} (Patient ID: ${existing.patientId}).`,
        existingPatient: existing
      });
    }

    // 2. Generate Patient ID
    const patientId = `PAT${Math.floor(1000 + Math.random() * 9000)}`;

    const newPatient = {
      id: `pat-${Date.now()}`,
      patientId,
      name: name.trim(),
      phone: cleanPhone,
      email: email ? email.trim().toLowerCase() : `${patientId.toLowerCase()}@liorahospitals.com`,
      age: age ? Number(age) : 30,
      gender: gender || "Male",
      bloodGroup: bloodGroup || "O+",
      emergencyContact: emergencyContact || "Not provided",
      address: address || "Bengaluru, India",
      allergies: "None documented at front desk",
      currentCondition: "Registered at OPD Reception",
      receptionNotes: receptionNotes || "Registered by front-desk staff.",
      registeredByStaffId: req.staff?.staffId || "STAFF101",
      registeredByStaffName: req.staff?.name || "Staff Reception",
      createdAt: new Date().toISOString()
    };

    db.insert("patients", newPatient);

    // Audit log
    db.audit(
      "PATIENT_REGISTER",
      `Registered new patient ${newPatient.name} (${patientId})`,
      req.staff?.staffId || "STAFF101",
      patientId,
      { phone: cleanPhone, age, gender }
    );

    return res.status(201).json({
      success: true,
      message: `Patient ${newPatient.name} registered successfully with ID ${patientId}.`,
      patient: newPatient
    });
  } catch (error) {
    console.error("[Patient Registration Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDemographics = (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      phone,
      email,
      age,
      gender,
      bloodGroup,
      emergencyContact,
      address,
      receptionNotes
    } = req.body;

    // Notice: We strictly permit ONLY demographic and reception fields.
    // Prescriptions, diagnoses, clinical notes cannot be altered here.
    const updated = db.update(
      "patients",
      (p) => p.id === id || p.patientId === id,
      (existing) => ({
        ...existing,
        ...(name ? { name: name.trim() } : {}),
        ...(phone ? { phone: phone.trim() } : {}),
        ...(email ? { email: email.trim().toLowerCase() } : {}),
        ...(age ? { age: Number(age) } : {}),
        ...(gender ? { gender } : {}),
        ...(bloodGroup ? { bloodGroup } : {}),
        ...(emergencyContact ? { emergencyContact } : {}),
        ...(address ? { address } : {}),
        ...(receptionNotes !== undefined ? { receptionNotes } : {}),
        updatedAt: new Date().toISOString()
      })
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Patient not found." });
    }

    db.audit(
      "PATIENT_UPDATE_DEMOGRAPHICS",
      `Updated contact and demographic details for patient ${updated.name} (${updated.patientId})`,
      req.staff?.staffId || "STAFF101",
      updated.patientId
    );

    return res.status(200).json({
      success: true,
      message: "Demographic details updated successfully.",
      patient: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
