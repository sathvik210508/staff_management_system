import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  Clock,
  User,
  Phone,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  CalendarDays,
  Plus,
  RefreshCw,
  Eye,
  Edit3,
  UserCheck,
  Stethoscope,
  ChevronRight,
  ShieldAlert
} from "lucide-react";
import Badge from "../components/Badge.jsx";
import Modal from "../components/Modal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { appointmentApi, doctorApi, patientApi, queueApi } from "../api/client.js";

export const Appointments = ({ initialStatusFilter = "All" }) => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Book Appointment Modal
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [bookFormData, setBookFormData] = useState({
    patientType: "existing", // "existing" or "new"
    patientId: "",
    patientName: "",
    patientPhone: "",
    patientAge: "35",
    patientGender: "Male",
    doctorId: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00 AM",
    appointmentType: "In-Person Consultation",
    reasonForVisit: "Routine Consultation",
    notes: ""
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookingError, setBookingError] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Reschedule Modal
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ newDate: "", newTime: "", reason: "" });
  const [rescheduleLoading, setRescheduleLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState("");

  // Cancel Modal
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text, type = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (statusFilter !== "All") params.status = statusFilter;
      if (doctorFilter !== "All") params.doctorId = doctorFilter;
      if (periodFilter === "today") params.filterPeriod = "today";
      if (periodFilter === "tomorrow") params.filterPeriod = "tomorrow";
      if (dateFilter) params.date = dateFilter;
      if (searchQuery) params.search = searchQuery;

      const res = await appointmentApi.getAppointments(params);
      if (res.success) {
        setAppointments(res.appointments || []);
      }
    } catch (e) {
      console.error("Fetch appointments error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await doctorApi.getDoctors();
      if (res.success) {
        setDoctors(res.doctors || []);
        if (res.doctors?.length > 0 && !bookFormData.doctorId) {
          setBookFormData((prev) => ({ ...prev, doctorId: res.doctors[0].doctorId }));
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, doctorFilter, periodFilter, dateFilter, searchQuery]);

  // Fetch slots when doctor or date changes in booking modal
  useEffect(() => {
    if (isBookModalOpen && bookFormData.doctorId && bookFormData.date) {
      doctorApi.getSlots(bookFormData.doctorId, bookFormData.date).then((res) => {
        if (res.success && res.slots) {
          setAvailableSlots(res.slots);
          const firstAvail = res.slots.find((s) => s.available);
          if (firstAvail) {
            setBookFormData((prev) => ({ ...prev, time: firstAvail.time }));
          }
        }
      });
    }
  }, [isBookModalOpen, bookFormData.doctorId, bookFormData.date]);

  // Handle Book Submit
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setBookingError("");
    setBookingLoading(true);

    try {
      const res = await appointmentApi.create(bookFormData);
      if (res.success) {
        showToast(`Appointment ${res.appointment.appointmentId} booked successfully!`);
        setIsBookModalOpen(false);
        fetchAppointments();
      }
    } catch (err) {
      setBookingError(err.message || "Failed to book appointment");
    } finally {
      setBookingLoading(false);
    }
  };

  // Handle Quick Confirm
  const handleConfirm = async (appt) => {
    try {
      const res = await appointmentApi.updateStatus(appt.appointmentId, "Confirmed", "Confirmed by staff reception.");
      if (res.success) {
        showToast(`Appointment ${appt.appointmentId} marked Confirmed!`);
        fetchAppointments();
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Handle Check-in / Arrived
  const handleCheckin = async (appt) => {
    try {
      const res = await queueApi.checkIn({
        appointmentId: appt.appointmentId,
        priority: "Normal",
        receptionNotes: "Patient arrived at reception counter."
      });
      if (res.success) {
        showToast(`Patient checked in! Queue Ticket ${res.queueItem.queueNumber}`);
        fetchAppointments();
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  // Open Reschedule Modal
  const openRescheduleModal = (appt) => {
    setSelectedAppointment(appt);
    setRescheduleData({
      newDate: appt.date || new Date().toISOString().split("T")[0],
      newTime: appt.time || "10:00 AM",
      reason: ""
    });
    setRescheduleError("");
    setIsRescheduleOpen(true);
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    setRescheduleError("");
    setRescheduleLoading(true);
    try {
      const res = await appointmentApi.reschedule(
        selectedAppointment.appointmentId,
        rescheduleData.newDate,
        rescheduleData.newTime,
        rescheduleData.reason
      );
      if (res.success) {
        showToast(`Appointment rescheduled to ${rescheduleData.newDate} at ${rescheduleData.newTime}!`);
        setIsRescheduleOpen(false);
        fetchAppointments();
      }
    } catch (err) {
      setRescheduleError(err.message || "Rescheduling failed");
    } finally {
      setRescheduleLoading(false);
    }
  };

  // Open Cancel Modal
  const openCancelModal = (appt) => {
    setSelectedAppointment(appt);
    setCancelReason("");
    setIsCancelOpen(true);
  };

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;
    setCancelLoading(true);
    try {
      const res = await appointmentApi.cancel(selectedAppointment.appointmentId, cancelReason);
      if (res.success) {
        showToast(`Appointment cancelled. Reason logged.`);
        setIsCancelOpen(false);
        fetchAppointments();
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className={`toast toast-${toastMessage.type}`}>
            {toastMessage.type === "success" ? <CheckCircle size={18} color="#10B981" /> : <AlertCircle size={18} color="#EF4444" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Page Title & Booking Button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", color: "#4C1D95", marginBottom: 4 }}>
            Appointment Management
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
            Schedule, confirm, reschedule, check in, and manage patient visits across all hospital specialties.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setIsBookModalOpen(true)}
          style={{ gap: 8 }}
        >
          <Plus size={18} />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          marginBottom: 22,
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, minWidth: 260 }}>
          <Search size={18} color="#7C3AED" />
          <input
            type="text"
            className="form-input"
            placeholder="Search patient name, ID, phone, doctor, or token..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: "8px 12px", fontSize: "0.86rem" }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {/* Status Filter */}
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 140, padding: "8px 12px", fontSize: "0.84rem" }}
          >
            <option value="All">All Statuses</option>
            <option value="Booked">Booked</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Checked In">Checked In</option>
            <option value="Waiting">Waiting</option>
            <option value="With Doctor">With Doctor</option>
            <option value="Completed">Completed</option>
            <option value="Rescheduled">Rescheduled</option>
            <option value="Cancelled">Cancelled</option>
            <option value="No Show">No Show</option>
          </select>

          {/* Doctor Filter */}
          <select
            className="form-select"
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            style={{ width: 170, padding: "8px 12px", fontSize: "0.84rem" }}
          >
            <option value="All">All Doctors</option>
            {doctors.map((d) => (
              <option key={d.doctorId} value={d.doctorId}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Period Toggle */}
          <div
            style={{
              display: "flex",
              backgroundColor: "#FAF5FF",
              borderRadius: 10,
              border: "1px solid #E9D5FF",
              padding: 2
            }}
          >
            <button
              onClick={() => {
                setPeriodFilter("today");
                setDateFilter("");
              }}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
                backgroundColor: periodFilter === "today" ? "#7C3AED" : "transparent",
                color: periodFilter === "today" ? "#FFFFFF" : "#64748B",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer"
              }}
            >
              Today
            </button>
            <button
              onClick={() => {
                setPeriodFilter("all");
                setDateFilter("");
              }}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
                backgroundColor: periodFilter === "all" ? "#7C3AED" : "transparent",
                color: periodFilter === "all" ? "#FFFFFF" : "#64748B",
                fontWeight: 700,
                fontSize: "0.8rem",
                cursor: "pointer"
              }}
            >
              All
            </button>
          </div>

          {/* Date Picker */}
          <input
            type="date"
            className="form-input"
            value={dateFilter}
            onChange={(e) => {
              setDateFilter(e.target.value);
              setPeriodFilter("custom");
            }}
            style={{ width: 140, padding: "7px 10px", fontSize: "0.82rem" }}
          />

          <button
            className="btn btn-secondary btn-sm"
            onClick={fetchAppointments}
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {appointments.length === 0 ? (
          <EmptyState
            title="No appointments found"
            description="No appointments match your search criteria or date filter."
            actionText="Book New Appointment"
            onAction={() => setIsBookModalOpen(true)}
          />
        ) : (
          <div className="table-container" style={{ border: "none", boxShadow: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Appt ID</th>
                  <th>Patient Details</th>
                  <th>Doctor & Specialty</th>
                  <th>Schedule</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.appointmentId || appt.id}>
                    <td>
                      <span style={{ fontWeight: 800, color: "#7C3AED" }}>
                        {appt.appointmentId || appt.id}
                      </span>
                      <div style={{ fontSize: "0.72rem", color: "#64748B" }}>
                        {appt.appointmentType || "Visit"}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: "#1E293B" }}>
                        {appt.patientName}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "#64748B" }}>
                        ID: {appt.patientId || "—"} • {appt.patientPhone || "No phone"}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: "#4C1D95" }}>
                        {appt.doctorName || appt.doctor}
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "#64748B" }}>
                        {appt.department || appt.specialty}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                        <Calendar size={13} color="#7C3AED" />
                        <span>{appt.date}</span>
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "#64748B", display: "flex", alignItems: "center", gap: 4 }}>
                        <Clock size={13} color="#8B5CF6" />
                        <span>{appt.time}</span>
                      </div>
                    </td>

                    <td>
                      <Badge status={appt.status} />
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {/* Confirm Button */}
                        {appt.status !== "Confirmed" && appt.status !== "Completed" && appt.status !== "Cancelled" && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleConfirm(appt)}
                            title="Confirm Patient Attendance"
                            style={{ padding: "5px 9px", fontSize: "0.76rem" }}
                          >
                            <CheckCircle size={14} color="#059669" />
                            <span>Confirm</span>
                          </button>
                        )}

                        {/* Check-in / Arrived Button */}
                        {appt.status !== "Checked In" && appt.status !== "Waiting" && appt.status !== "Completed" && appt.status !== "Cancelled" && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleCheckin(appt)}
                            title="Check-in to Live Waiting Queue"
                            style={{ padding: "5px 9px", fontSize: "0.76rem" }}
                          >
                            <UserCheck size={14} />
                            <span>Check In</span>
                          </button>
                        )}

                        {/* Details Modal */}
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setSelectedAppointment(appt);
                            setIsDetailsOpen(true);
                          }}
                          title="View Details & History"
                          style={{ padding: "5px 8px" }}
                        >
                          <Eye size={14} />
                        </button>

                        {/* Reschedule */}
                        {appt.status !== "Completed" && appt.status !== "Cancelled" && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => openRescheduleModal(appt)}
                            title="Reschedule Appointment"
                            style={{ padding: "5px 8px" }}
                          >
                            <CalendarDays size={14} />
                          </button>
                        )}

                        {/* Cancel */}
                        {appt.status !== "Completed" && appt.status !== "Cancelled" && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => openCancelModal(appt)}
                            title="Cancel with Recorded Reason"
                            style={{ padding: "5px 8px" }}
                          >
                            <XCircle size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* BOOK APPOINTMENT MODAL */}
      <Modal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        title="Schedule Patient Appointment"
        size="lg"
      >
        <form onSubmit={handleBookSubmit}>
          {bookingError && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                backgroundColor: "#FFF1F2",
                border: "1px solid #FECDD3",
                color: "#BE123C",
                fontSize: "0.85rem",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8
              }}
            >
              <AlertCircle size={16} />
              <span>{bookingError}</span>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Patient Name */}
            <div className="form-group">
              <label className="form-label">Patient Full Name *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Anand Mahindra"
                value={bookFormData.patientName}
                onChange={(e) => setBookFormData({ ...bookFormData, patientName: e.target.value })}
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label className="form-label">Patient Contact Mobile *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="+91 98765 00000"
                value={bookFormData.patientPhone}
                onChange={(e) => setBookFormData({ ...bookFormData, patientPhone: e.target.value })}
              />
            </div>

            {/* Age & Gender */}
            <div className="form-group">
              <label className="form-label">Age & Gender</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input
                  type="number"
                  className="form-input"
                  min="1"
                  max="120"
                  value={bookFormData.patientAge}
                  onChange={(e) => setBookFormData({ ...bookFormData, patientAge: e.target.value })}
                  placeholder="Age"
                />
                <select
                  className="form-select"
                  value={bookFormData.patientGender}
                  onChange={(e) => setBookFormData({ ...bookFormData, patientGender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Doctor Selection */}
            <div className="form-group">
              <label className="form-label">Consultant Doctor *</label>
              <select
                className="form-select"
                required
                value={bookFormData.doctorId}
                onChange={(e) => setBookFormData({ ...bookFormData, doctorId: e.target.value })}
              >
                {doctors.map((d) => (
                  <option key={d.doctorId} value={d.doctorId}>
                    {d.name} ({d.department || d.specialization})
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="form-group">
              <label className="form-label">Appointment Date *</label>
              <input
                type="date"
                className="form-input"
                required
                value={bookFormData.date}
                onChange={(e) => setBookFormData({ ...bookFormData, date: e.target.value })}
              />
            </div>

            {/* Time Slot Picker */}
            <div className="form-group">
              <label className="form-label">Available Slot *</label>
              <select
                className="form-select"
                required
                value={bookFormData.time}
                onChange={(e) => setBookFormData({ ...bookFormData, time: e.target.value })}
              >
                {availableSlots.map((s) => (
                  <option key={s.time} value={s.time} disabled={!s.available}>
                    {s.time} {s.available ? "— (Available)" : "— (Booked)"}
                  </option>
                ))}
              </select>
            </div>

            {/* Appointment Type */}
            <div className="form-group">
              <label className="form-label">Appointment Type</label>
              <select
                className="form-select"
                value={bookFormData.appointmentType}
                onChange={(e) => setBookFormData({ ...bookFormData, appointmentType: e.target.value })}
              >
                <option value="In-Person Consultation">In-Person Consultation</option>
                <option value="Follow-up Consultation">Follow-up Consultation</option>
                <option value="Specialist Referral">Specialist Referral</option>
                <option value="Diagnostic Review">Diagnostic Review</option>
                <option value="Pre-Operative Clearance">Pre-Operative Clearance</option>
              </select>
            </div>

            {/* Reason for Visit */}
            <div className="form-group">
              <label className="form-label">Reason for Visit / Symptoms</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Chest discomfort, routine BP check"
                value={bookFormData.reasonForVisit}
                onChange={(e) => setBookFormData({ ...bookFormData, reasonForVisit: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Front Desk Administrative Notes</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Patient requested morning slot, reports attached at counter"
              value={bookFormData.notes}
              onChange={(e) => setBookFormData({ ...bookFormData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsBookModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={bookingLoading}
            >
              {bookingLoading ? "Confirming Booking..." : "Confirm & Book"}
            </button>
          </div>
        </form>
      </Modal>

      {/* RESCHEDULE MODAL */}
      <Modal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        title={`Reschedule Appointment: ${selectedAppointment?.appointmentId}`}
      >
        <form onSubmit={handleRescheduleSubmit}>
          {rescheduleError && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                backgroundColor: "#FFF1F2",
                border: "1px solid #FECDD3",
                color: "#BE123C",
                fontSize: "0.85rem",
                marginBottom: 16
              }}
            >
              <AlertCircle size={16} />
              <span>{rescheduleError}</span>
            </div>
          )}

          <p style={{ color: "#64748B", fontSize: "0.88rem", marginBottom: 16 }}>
            Currently scheduled: <strong style={{ color: "#4C1D95" }}>{selectedAppointment?.date} at {selectedAppointment?.time}</strong> with {selectedAppointment?.doctorName}.
          </p>

          <div className="form-group">
            <label className="form-label">New Appointment Date *</label>
            <input
              type="date"
              className="form-input"
              required
              value={rescheduleData.newDate}
              onChange={(e) => setRescheduleData({ ...rescheduleData, newDate: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Time Slot *</label>
            <select
              className="form-select"
              required
              value={rescheduleData.newTime}
              onChange={(e) => setRescheduleData({ ...rescheduleData, newTime: e.target.value })}
            >
              {["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Rescheduling Reason *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Patient requested afternoon slot / Doctor in emergency surgery"
              value={rescheduleData.reason}
              onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsRescheduleOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={rescheduleLoading}
            >
              {rescheduleLoading ? "Rescheduling..." : "Save New Schedule"}
            </button>
          </div>
        </form>
      </Modal>

      {/* CANCEL MODAL */}
      <Modal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        title={`Cancel Appointment: ${selectedAppointment?.appointmentId}`}
      >
        <form onSubmit={handleCancelSubmit}>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 12,
              backgroundColor: "#FFF1F2",
              border: "1px solid #FECDD3",
              color: "#991B1B",
              fontSize: "0.85rem",
              marginBottom: 16
            }}
          >
            <strong>Warning:</strong> Cancelling will record the cancellation reason in the audit trail and update the Doctor and Patient Portals.
          </div>

          <div className="form-group">
            <label className="form-label">Mandatory Cancellation Reason *</label>
            <textarea
              className="form-textarea"
              required
              placeholder="Record reason (e.g. Patient called to cancel / No longer in town / Symptoms resolved)..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsCancelOpen(false)}
            >
              Back
            </button>
            <button
              type="submit"
              className="btn btn-danger"
              disabled={cancelLoading}
            >
              {cancelLoading ? "Cancelling..." : "Confirm Cancellation"}
            </button>
          </div>
        </form>
      </Modal>

      {/* DETAILS & AUDIT HISTORY MODAL */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={`Appointment Dossier: ${selectedAppointment?.appointmentId}`}
        size="lg"
      >
        {selectedAppointment && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                backgroundColor: "#FAF5FF",
                padding: "16px 20px",
                borderRadius: 14,
                border: "1px solid #E9D5FF",
                marginBottom: 20
              }}
            >
              <div>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                  Patient Information
                </span>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#4C1D95", marginTop: 2 }}>
                  {selectedAppointment.patientName}
                </div>
                <div style={{ fontSize: "0.82rem", color: "#64748B" }}>
                  Patient ID: {selectedAppointment.patientId} • Phone: {selectedAppointment.patientPhone || "—"}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>
                  Consultant & Department
                </span>
                <div style={{ fontSize: "1.05rem", fontWeight: 800, color: "#4C1D95", marginTop: 2 }}>
                  {selectedAppointment.doctorName || selectedAppointment.doctor}
                </div>
                <div style={{ fontSize: "0.82rem", color: "#64748B" }}>
                  {selectedAppointment.department} • Slot: {selectedAppointment.date} at {selectedAppointment.time}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#4C1D95", marginBottom: 6 }}>
                Reason for Visit
              </div>
              <div style={{ padding: "10px 14px", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: "0.86rem" }}>
                {selectedAppointment.reasonForVisit || "Routine consultation"}
              </div>
            </div>

            {selectedAppointment.notes && (
              <div style={{ marginBottom: 18 }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#4C1D95", marginBottom: 6 }}>
                  Front Desk Notes
                </div>
                <div style={{ padding: "10px 14px", backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: 10, fontSize: "0.86rem" }}>
                  {selectedAppointment.notes}
                </div>
              </div>
            )}

            {/* Status History Trail */}
            <div>
              <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#4C1D95", marginBottom: 10 }}>
                Status Progression & Audit History
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(selectedAppointment.history || [
                  { status: selectedAppointment.status, changedBy: "System", timestamp: selectedAppointment.createdAt, notes: "Record created" }
                ]).map((hist, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "8px 12px",
                      borderRadius: 10,
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E9D5FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontSize: "0.82rem"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Badge status={hist.status} />
                      <span style={{ color: "#1E293B", fontWeight: 600 }}>{hist.notes}</span>
                    </div>
                    <div style={{ color: "#64748B", fontSize: "0.76rem" }}>
                      {hist.changedBy} • {new Date(hist.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Appointments;
