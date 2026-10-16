import dotenv from "dotenv";
dotenv.config();

const DOCTOR_API_URL = process.env.DOCTOR_API_URL || "http://localhost:5001/api";
const PATIENT_API_URL = process.env.PATIENT_API_URL || "http://localhost:5000/api";
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET || "liora_cross_portal_internal_secure_api_secret_2026_x89f";

export const crossPortalSyncService = {
  /**
   * Synchronize appointment status to Doctor Portal
   */
  async syncStatusToDoctorPortal(appointmentId, status, notes = "") {
    try {
      const res = await fetch(`${DOCTOR_API_URL}/internal/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": INTERNAL_API_SECRET
        },
        body: JSON.stringify({ status, notes })
      });
      const data = await res.json().catch(() => ({}));
      return { success: res.ok, data };
    } catch (err) {
      console.warn(`[Staff -> Doctor Sync] Doctor Portal offline or unreachable (${err.message})`);
      return { success: false, error: err.message };
    }
  },

  /**
   * Synchronize appointment status to Patient Portal
   */
  async syncStatusToPatientPortal(appointmentId, status, notes = "") {
    try {
      const res = await fetch(`${PATIENT_API_URL}/internal/appointments/${appointmentId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": INTERNAL_API_SECRET
        },
        body: JSON.stringify({ status, notes })
      });
      const data = await res.json().catch(() => ({}));
      return { success: res.ok, data };
    } catch (err) {
      console.warn(`[Staff -> Patient Sync] Patient Portal offline or unreachable (${err.message})`);
      return { success: false, error: err.message };
    }
  },

  /**
   * Forward newly booked appointment to Doctor Portal
   */
  async syncNewAppointmentToDoctor(apptData) {
    try {
      const res = await fetch(`${DOCTOR_API_URL}/internal/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-secret": INTERNAL_API_SECRET
        },
        body: JSON.stringify(apptData)
      });
      const data = await res.json().catch(() => ({}));
      return { success: res.ok, data };
    } catch (err) {
      console.warn(`[Staff -> Doctor Sync] Unable to sync new appointment to Doctor Portal (${err.message})`);
      return { success: false, error: err.message };
    }
  },

  /**
   * Check slot availability with Doctor Portal
   */
  async checkDoctorSlotAvailability(doctorId, date, time) {
    try {
      const q = new URLSearchParams({ date, time }).toString();
      const res = await fetch(`${DOCTOR_API_URL}/internal/doctors/${doctorId}/check-slot?${q}`, {
        headers: {
          "x-internal-secret": INTERNAL_API_SECRET
        }
      });
      if (res.status === 409) {
        return { available: false, message: "This slot is already booked." };
      }
      const data = await res.json().catch(() => ({}));
      return { available: data.available !== false, message: data.message };
    } catch (err) {
      return { available: true };
    }
  }
};

export default crossPortalSyncService;
