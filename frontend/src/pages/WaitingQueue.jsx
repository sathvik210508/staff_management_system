import React, { useState, useEffect } from "react";
import {
  ListOrdered,
  Clock,
  UserCheck,
  Send,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  UserX,
  Stethoscope,
  ChevronRight,
  ShieldAlert,
  Play,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import Badge from "../components/Badge.jsx";
import Modal from "../components/Modal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { queueApi, doctorApi } from "../api/client.js";

export const WaitingQueue = ({ onOpenCheckInModal }) => {
  const [queue, setQueue] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [doctorFilter, setDoctorFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchQueue = async () => {
    try {
      const params = {};
      if (doctorFilter !== "All") params.doctorId = doctorFilter;
      if (statusFilter !== "All") params.status = statusFilter;

      const res = await queueApi.getLiveQueue(params);
      if (res.success) {
        setQueue(res.queue || []);
      }
    } catch (e) {
      console.error("Queue fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await doctorApi.getDoctors();
      if (res.success) {
        setDoctors(res.doctors || []);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchDoctors();
    fetchQueue();
  }, [doctorFilter, statusFilter]);

  // Live Auto-Refresh every 12 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchQueue, 12000);
    return () => clearInterval(interval);
  }, [autoRefresh, doctorFilter, statusFilter]);

  // Actions
  const handleNotifyDoctor = async (item) => {
    try {
      const res = await queueApi.notifyDoctor(item.id);
      if (res.success) {
        showToast(res.message);
        fetchQueue();
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleUpdateStatus = async (item, newStatus, notes = "") => {
    try {
      const res = await queueApi.updateStatus(item.id, newStatus, notes);
      if (res.success) {
        showToast(`Queue #${item.queueNumber} marked '${newStatus}'`);
        fetchQueue();
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const filteredQueue = queue.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.patientName || "").toLowerCase().includes(q) ||
      (item.queueNumber || "").toLowerCase().includes(q) ||
      (item.doctorName || "").toLowerCase().includes(q) ||
      (item.patientId || "").toLowerCase().includes(q)
    );
  });

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

      {/* Page Title & Check-in Launcher */}
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
            Live OPD Waiting Room & Patient Queue
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
            Real-time triage queue management, consultation transitions, and doctor notification coordination.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="btn btn-primary"
            onClick={onOpenCheckInModal}
            style={{ gap: 8 }}
          >
            <UserCheck size={18} />
            <span>Check In Patient to Queue</span>
          </button>
        </div>
      </div>

      {/* Queue Toolbar & Auto-refresh status */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          marginBottom: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14
        }}
      >
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 260 }}>
          <Search size={18} color="#7C3AED" />
          <input
            type="text"
            className="form-input"
            placeholder="Search patient name, Token #Q-01, or doctor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: "8px 12px", fontSize: "0.85rem" }}
          />
        </div>

        {/* Filters & Refresh */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 150, padding: "8px 12px", fontSize: "0.84rem" }}
          >
            <option value="All">All Queue States</option>
            <option value="Checked In">Checked In</option>
            <option value="Waiting">Waiting</option>
            <option value="With Doctor">With Doctor</option>
            <option value="Completed">Completed</option>
            <option value="Left">Left Hospital</option>
          </select>

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

          {/* Auto Refresh Toggle */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              cursor: "pointer",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "#5B21B6",
              backgroundColor: "#FAF5FF",
              padding: "7px 12px",
              borderRadius: 8,
              border: "1px solid #E9D5FF"
            }}
          >
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            <span>Auto Sync</span>
          </label>

          <button
            className="btn btn-secondary btn-sm"
            onClick={fetchQueue}
            title="Refresh Live Queue"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Live Queue Cards / Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {filteredQueue.length === 0 ? (
          <EmptyState
            title="Waiting Lounge Empty"
            description="There are currently no patients waiting in the outpatient queue."
            actionText="Check In Arriving Patient"
            onAction={onOpenCheckInModal}
          />
        ) : (
          <div className="table-container" style={{ border: "none", boxShadow: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Token #</th>
                  <th>Patient Identity</th>
                  <th>Assigned Doctor & Cabin</th>
                  <th>Arrival & Wait Duration</th>
                  <th>Priority</th>
                  <th>Queue Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredQueue.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor:
                        item.status === "With Doctor"
                          ? "#F5F3FF"
                          : item.isDelayed
                          ? "#FFFBEB"
                          : "transparent"
                    }}
                  >
                    <td>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 12,
                          backgroundColor: "#FAF5FF",
                          border: "1.5px solid #DDD6FE",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "1.05rem",
                          color: "#7C3AED",
                          boxShadow: "0 2px 6px rgba(124, 58, 237, 0.08)"
                        }}
                      >
                        {item.queueNumber}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 800, color: "#1E293B", fontSize: "0.95rem" }}>
                        {item.patientName}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "#64748B" }}>
                        ID: {item.patientId} • {item.age}y/{item.gender} • Slot: {item.appointmentTime}
                      </div>
                      {item.receptionNotes && (
                        <div style={{ fontSize: "0.72rem", color: "#7C3AED", fontStyle: "italic", marginTop: 2 }}>
                          "{item.receptionNotes}"
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: "#4C1D95" }}>
                        {item.doctorName}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "#64748B" }}>
                        {item.cabin || "OPD Cabin"} • {item.department}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Clock size={14} color={item.isDelayed ? "#B45309" : "#7C3AED"} />
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: "0.95rem",
                            color: item.isDelayed ? "#B45309" : "#1E293B"
                          }}
                        >
                          {item.waitingMinutes} mins
                        </span>
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "#64748B" }}>
                        Check-in: {new Date(item.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </td>

                    <td>
                      <Badge status={item.priority || "Normal"} />
                    </td>

                    <td>
                      <Badge status={item.status} />
                      <div style={{ fontSize: "0.72rem", color: "#64748B", marginTop: 4 }}>
                        {item.nextAction}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        {/* Notify Doctor button */}
                        {item.status !== "Completed" && item.status !== "Left" && (
                          <button
                            className="btn btn-outline btn-sm"
                            onClick={() => handleNotifyDoctor(item)}
                            title="Send Arrival Notification to Doctor's Screen"
                            style={{ padding: "5px 9px", fontSize: "0.76rem", gap: 4 }}
                          >
                            <Send size={13} />
                            <span>Notify</span>
                          </button>
                        )}

                        {/* Mark Waiting */}
                        {item.status === "Checked In" && (
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleUpdateStatus(item, "Waiting")}
                            style={{ padding: "5px 9px", fontSize: "0.76rem" }}
                          >
                            <span>Move to Lounge</span>
                          </button>
                        )}

                        {/* Mark With Doctor */}
                        {item.status === "Waiting" && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleUpdateStatus(item, "With Doctor")}
                            style={{ padding: "5px 9px", fontSize: "0.76rem", gap: 4 }}
                          >
                            <Stethoscope size={13} />
                            <span>Send to Cabin</span>
                          </button>
                        )}

                        {/* Mark Completed */}
                        {item.status === "With Doctor" && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => handleUpdateStatus(item, "Completed")}
                            style={{ padding: "5px 9px", fontSize: "0.76rem", gap: 4 }}
                          >
                            <CheckCircle size={13} />
                            <span>Complete</span>
                          </button>
                        )}

                        {/* Patient Left */}
                        {item.status !== "Completed" && item.status !== "Left" && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleUpdateStatus(item, "Left", "Patient left before consultation")}
                            title="Patient left hospital before consultation"
                            style={{ padding: "5px 8px" }}
                          >
                            <UserX size={13} />
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
    </div>
  );
};

export default WaitingQueue;
