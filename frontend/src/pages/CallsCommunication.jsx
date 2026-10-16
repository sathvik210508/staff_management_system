import React, { useState, useEffect } from "react";
import {
  PhoneCall,
  Phone,
  PhoneForwarded,
  Search,
  CheckCircle2,
  Calendar,
  Clock,
  User,
  AlertCircle,
  FileText,
  Send,
  RefreshCw,
  PhoneOff,
  PhoneMissed,
  History,
  ShieldCheck,
  Check
} from "lucide-react";
import Badge from "../components/Badge.jsx";
import Modal from "../components/Modal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { communicationApi } from "../api/client.js";

export const CallsCommunication = () => {
  const [activeTab, setActiveTab] = useState("callList"); // "callList" or "history"
  const [callList, setCallList] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Log Call Outcome Modal
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedCallTarget, setSelectedCallTarget] = useState(null);
  const [callFormData, setCallFormData] = useState({
    outcome: "appointment_confirmed",
    notes: "",
    callbackScheduled: "",
    confirmAppointment: true
  });
  const [logLoading, setLogLoading] = useState(false);

  // Send Reminder Modal
  const [isReminderOpen, setIsReminderOpen] = useState(false);
  const [reminderTarget, setReminderTarget] = useState(null);
  const [reminderLoading, setReminderLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCallList = async () => {
    setIsLoading(true);
    try {
      const res = await communicationApi.getCallList({ search: searchQuery });
      if (res.success) {
        setCallList(res.callList || []);
      }
    } catch (e) {
      console.error("Fetch call list error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await communicationApi.getCallHistory();
      if (res.success) {
        setCallHistory(res.callLogs || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (activeTab === "callList") {
      fetchCallList();
    } else {
      fetchHistory();
    }
  }, [activeTab, searchQuery]);

  const openLogCallModal = (target) => {
    setSelectedCallTarget(target);
    setCallFormData({
      outcome: "appointment_confirmed",
      notes: "",
      callbackScheduled: "",
      confirmAppointment: true
    });
    setIsLogModalOpen(true);
  };

  const handleLogCallSubmit = async (e) => {
    e.preventDefault();
    setLogLoading(true);

    try {
      const res = await communicationApi.logCall({
        appointmentId: selectedCallTarget.appointmentId,
        patientId: selectedCallTarget.patientId,
        patientName: selectedCallTarget.patientName,
        patientPhone: selectedCallTarget.patientPhone,
        callType: "Appointment Confirmation",
        outcome: callFormData.outcome,
        notes: callFormData.notes,
        callbackScheduled: callFormData.callbackScheduled || null,
        confirmAppointment: callFormData.confirmAppointment
      });

      if (res.success) {
        showToast("Call outcome logged and appointment record updated!");
        setIsLogModalOpen(false);
        fetchCallList();
        fetchHistory();
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLogLoading(false);
    }
  };

  const handleSendReminder = async () => {
    if (!reminderTarget) return;
    setReminderLoading(true);
    try {
      const res = await communicationApi.sendReminder({
        appointmentId: reminderTarget.appointmentId,
        patientPhone: reminderTarget.patientPhone,
        patientName: reminderTarget.patientName
      });
      if (res.success) {
        showToast(res.message);
        setIsReminderOpen(false);
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setReminderLoading(false);
    }
  };

  const outcomeLabels = {
    answered: "Answered (Spoke with patient)",
    no_answer: "No Answer",
    busy: "Line Busy",
    callback_requested: "Callback Requested",
    appointment_confirmed: "Appointment Confirmed",
    reschedule_requested: "Reschedule Requested",
    invalid_number: "Invalid / Disconnected Number"
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? <CheckCircle2 size={18} color="#10B981" /> : <AlertCircle size={18} color="#EF4444" />}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Header */}
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
            Patient Calling & Communication
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
            Reach scheduled outpatients via device dialer, record call dispositions, and schedule callbacks.
          </p>
        </div>

        {/* Tab Switcher */}
        <div
          style={{
            display: "flex",
            backgroundColor: "#FAF5FF",
            borderRadius: 12,
            border: "1px solid #E9D5FF",
            padding: 3
          }}
        >
          <button
            onClick={() => setActiveTab("callList")}
            style={{
              padding: "7px 16px",
              borderRadius: 9,
              border: "none",
              backgroundColor: activeTab === "callList" ? "#7C3AED" : "transparent",
              color: activeTab === "callList" ? "#FFFFFF" : "#64748B",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            Pending Calls ({callList.filter((c) => c.needsConfirmation).length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            style={{
              padding: "7px 16px",
              borderRadius: 9,
              border: "none",
              backgroundColor: activeTab === "history" ? "#7C3AED" : "transparent",
              color: activeTab === "history" ? "#FFFFFF" : "#64748B",
              fontWeight: 700,
              fontSize: "0.85rem",
              cursor: "pointer"
            }}
          >
            Call Audit History
          </button>
        </div>
      </div>

      {/* Information Banner on Real Dialing vs Outcome Confirmation */}
      <div
        style={{
          backgroundColor: "#FAF5FF",
          border: "1px solid #DDD6FE",
          borderRadius: 14,
          padding: "12px 18px",
          marginBottom: 22,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontSize: "0.84rem",
          color: "#5B21B6"
        }}
      >
        <ShieldCheck size={20} color="#7C3AED" style={{ flexShrink: 0 }} />
        <div>
          <strong>Enterprise Telephony Compliance:</strong> Clicking the patient's phone initiates a call via the device dialer or registered softphone (<code>tel:</code> link). After speaking with the patient, click <strong>"Log Outcome"</strong> to record verified attendance, request callbacks, or confirm appointments.
        </div>
      </div>

      {/* Search Bar */}
      <div
        className="card"
        style={{
          padding: "14px 20px",
          marginBottom: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
          <Search size={18} color="#7C3AED" />
          <input
            type="text"
            className="form-input"
            placeholder="Search patient name, phone number, or doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: "8px 12px" }}
          />
        </div>

        <button
          className="btn btn-secondary btn-sm"
          onClick={activeTab === "callList" ? fetchCallList : fetchHistory}
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* TAB 1: CALL LIST */}
      {activeTab === "callList" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {callList.length === 0 ? (
            <EmptyState
              title="No upcoming calls"
              description="All patient appointments have been verified and confirmed."
            />
          ) : (
            <div className="table-container" style={{ border: "none", boxShadow: "none" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Phone / Device Call</th>
                    <th>Appointment Slot</th>
                    <th>Doctor</th>
                    <th>Status</th>
                    <th>Last Interaction</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {callList.map((target) => (
                    <tr key={target.appointmentId}>
                      <td>
                        <div style={{ fontWeight: 800, color: "#1E293B" }}>
                          {target.patientName}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "#64748B" }}>
                          ID: {target.patientId} • Appt: {target.appointmentId}
                        </div>
                      </td>

                      <td>
                        {target.patientPhone ? (
                          <a
                            href={`tel:${target.patientPhone}`}
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              padding: "6px 12px",
                              borderRadius: 8,
                              backgroundColor: "#FAF5FF",
                              border: "1px solid #E9D5FF",
                              color: "#7C3AED",
                              fontWeight: 700,
                              textDecoration: "none",
                              fontSize: "0.85rem"
                            }}
                            title="Click to dial via device/system phone"
                          >
                            <Phone size={14} />
                            <span>{target.patientPhone}</span>
                          </a>
                        ) : (
                          <span style={{ color: "#94A3B8", fontStyle: "italic", fontSize: "0.8rem" }}>
                            No phone listed
                          </span>
                        )}
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, color: "#4C1D95" }}>
                          {target.appointmentDate}
                        </div>
                        <div style={{ fontSize: "0.76rem", color: "#64748B" }}>
                          {target.appointmentTime}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 600 }}>{target.doctorName}</div>
                        <div style={{ fontSize: "0.74rem", color: "#64748B" }}>{target.department}</div>
                      </td>

                      <td>
                        <Badge status={target.status} />
                      </td>

                      <td>
                        {target.latestCall ? (
                          <div>
                            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#4C1D95" }}>
                              {outcomeLabels[target.latestCall.outcome] || target.latestCall.outcome}
                            </div>
                            <div style={{ fontSize: "0.72rem", color: "#64748B" }}>
                              {new Date(target.latestCall.createdAt).toLocaleDateString()} by {target.latestCall.staffName}
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.76rem", color: "#94A3B8" }}>Not yet called</span>
                        )}
                      </td>

                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => openLogCallModal(target)}
                            style={{ padding: "5px 10px", fontSize: "0.78rem", gap: 4 }}
                          >
                            <FileText size={13} />
                            <span>Log Outcome</span>
                          </button>

                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setReminderTarget(target);
                              setIsReminderOpen(true);
                            }}
                            title="Dispatch SMS / Notification Reminder"
                            style={{ padding: "5px 8px" }}
                          >
                            <Send size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CALL AUDIT HISTORY */}
      {activeTab === "history" && (
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {callHistory.length === 0 ? (
            <EmptyState
              title="No call logs"
              description="No phone interactions have been recorded yet."
            />
          ) : (
            <div className="table-container" style={{ border: "none", boxShadow: "none" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Patient Name & Phone</th>
                    <th>Outcome Recorded</th>
                    <th>Notes & Dispositions</th>
                    <th>Scheduled Callback</th>
                    <th>Staff Member</th>
                  </tr>
                </thead>
                <tbody>
                  {callHistory.map((log) => (
                    <tr key={log.id}>
                      <td>
                        <div style={{ fontWeight: 700 }}>
                          {new Date(log.createdAt).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: "0.74rem", color: "#64748B" }}>
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>

                      <td>
                        <div style={{ fontWeight: 800, color: "#1E293B" }}>{log.patientName}</div>
                        <div style={{ fontSize: "0.76rem", color: "#64748B" }}>{log.patientPhone}</div>
                      </td>

                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color:
                              log.outcome === "appointment_confirmed"
                                ? "#15803D"
                                : log.outcome === "callback_requested"
                                ? "#B45309"
                                : "#4C1D95",
                            fontSize: "0.84rem"
                          }}
                        >
                          {outcomeLabels[log.outcome] || log.outcome}
                        </span>
                      </td>

                      <td>
                        <div style={{ fontSize: "0.84rem", color: "#334155" }}>
                          {log.notes || "—"}
                        </div>
                      </td>

                      <td>
                        {log.callbackScheduled ? (
                          <div style={{ color: "#B45309", fontWeight: 700, fontSize: "0.82rem" }}>
                            {new Date(log.callbackScheduled).toLocaleString()}
                          </div>
                        ) : (
                          <span style={{ color: "#94A3B8", fontSize: "0.78rem" }}>None</span>
                        )}
                      </td>

                      <td>
                        <div style={{ fontWeight: 700, color: "#4C1D95", fontSize: "0.84rem" }}>
                          {log.staffName}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#64748B" }}>
                          ID: {log.staffId}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* LOG CALL OUTCOME MODAL */}
      <Modal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        title={`Record Call Disposition: ${selectedCallTarget?.patientName}`}
      >
        <form onSubmit={handleLogCallSubmit}>
          <div
            style={{
              backgroundColor: "#FAF5FF",
              padding: "12px 16px",
              borderRadius: 12,
              border: "1px solid #E9D5FF",
              marginBottom: 16
            }}
          >
            <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "#4C1D95" }}>
              Patient: {selectedCallTarget?.patientName} ({selectedCallTarget?.patientPhone})
            </div>
            <div style={{ fontSize: "0.78rem", color: "#64748B", marginTop: 2 }}>
              Appointment: {selectedCallTarget?.appointmentDate} at {selectedCallTarget?.appointmentTime} with {selectedCallTarget?.doctorName}
            </div>
          </div>

          {/* Outcome Selector */}
          <div className="form-group">
            <label className="form-label">Call Outcome / Disposition *</label>
            <select
              className="form-select"
              required
              value={callFormData.outcome}
              onChange={(e) => setCallFormData({ ...callFormData, outcome: e.target.value })}
            >
              <option value="appointment_confirmed">Appointment Confirmed (Patient confirmed attendance)</option>
              <option value="answered">Answered (General query / Spoke with patient)</option>
              <option value="callback_requested">Callback Requested (Patient asked to call later)</option>
              <option value="reschedule_requested">Reschedule Requested (Patient requested new time)</option>
              <option value="no_answer">No Answer / Left Voicemail</option>
              <option value="busy">Line Busy</option>
              <option value="invalid_number">Invalid / Wrong Number</option>
            </select>
          </div>

          {/* Auto Confirm Checkbox */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.86rem", color: "#1E293B", cursor: "pointer", fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={callFormData.confirmAppointment}
                onChange={(e) => setCallFormData({ ...callFormData, confirmAppointment: e.target.checked })}
              />
              <span>Mark Appointment status as "Confirmed" in Hospital Management System</span>
            </label>
          </div>

          {/* Schedule Callback */}
          <div className="form-group">
            <label className="form-label">Schedule Follow-up Callback (Optional)</label>
            <input
              type="datetime-local"
              className="form-input"
              value={callFormData.callbackScheduled}
              onChange={(e) => setCallFormData({ ...callFormData, callbackScheduled: e.target.value })}
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Call Notes / Comments</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. Patient confirmed they will bring previous lab reports. Arriving by taxi."
              value={callFormData.notes}
              onChange={(e) => setCallFormData({ ...callFormData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsLogModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={logLoading}
            >
              {logLoading ? "Saving Log..." : "Save Call Disposition"}
            </button>
          </div>
        </form>
      </Modal>

      {/* DISPATCH REMINDER MODAL */}
      <Modal
        isOpen={isReminderOpen}
        onClose={() => setIsReminderOpen(false)}
        title="Dispatch Appointment Reminder"
      >
        <div>
          <p style={{ color: "#475569", fontSize: "0.9rem", marginBottom: 16 }}>
            Send an automated reminder notification to <strong>{reminderTarget?.patientName}</strong> at <strong>{reminderTarget?.patientPhone}</strong> for their upcoming visit on {reminderTarget?.appointmentDate} at {reminderTarget?.appointmentTime}.
          </p>

          <div
            style={{
              padding: "12px 16px",
              backgroundColor: "#FAF5FF",
              borderRadius: 12,
              border: "1px solid #E9D5FF",
              fontSize: "0.82rem",
              color: "#5B21B6",
              marginBottom: 20
            }}
          >
            <strong>Gateway Simulation:</strong> In standard development mode, reminder dispatch will be logged in the audit trail. When production carrier SMS/WhatsApp gateway credentials are configured, live carrier delivery occurs.
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              className="btn btn-secondary"
              onClick={() => setIsReminderOpen(false)}
            >
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={handleSendReminder}
              disabled={reminderLoading}
            >
              {reminderLoading ? "Dispatching..." : "Send Reminder Notification"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CallsCommunication;
