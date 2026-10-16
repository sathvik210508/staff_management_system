import React, { useState, useEffect } from "react";
import {
  History,
  Search,
  Filter,
  UserCheck,
  Calendar,
  Clock,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import Badge from "../components/Badge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { auditApi } from "../api/client.js";

export const ActivityHistory = () => {
  const [logs, setLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (actionFilter !== "All") params.action = actionFilter;
      if (searchQuery) params.search = searchQuery;

      const res = await auditApi.getAuditLogs(params);
      if (res.success) {
        setLogs(res.auditLogs || []);
      }
    } catch (e) {
      console.error("Fetch audit logs error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [actionFilter, searchQuery]);

  const actionColors = {
    APPOINTMENT_CREATE: "#0369A1",
    APPOINTMENT_RESCHEDULE: "#7C3AED",
    APPOINTMENT_CANCEL: "#BE123C",
    PATIENT_CHECKIN: "#15803D",
    CALL_LOGGED: "#B45309",
    STATUS_CHANGE: "#5B21B6",
    PATIENT_REGISTER: "#047857"
  };

  return (
    <div>
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
            Staff Activity History & Audit Trail
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
            Immutable chronological record of front-desk operations, patient check-ins, appointment modifications, and call dispositions.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={fetchLogs}>
          <RefreshCw size={15} />
          <span>Refresh Audit</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          marginBottom: 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 260 }}>
          <Search size={18} color="#7C3AED" />
          <input
            type="text"
            className="form-input"
            placeholder="Search action, staff member, or target patient..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: "8px 12px" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <select
            className="form-select"
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            style={{ width: 220, padding: "8px 12px", fontSize: "0.84rem" }}
          >
            <option value="All">All Audit Actions</option>
            <option value="PATIENT_CHECKIN">Patient Check-in</option>
            <option value="APPOINTMENT_CREATE">Appointment Create</option>
            <option value="APPOINTMENT_RESCHEDULE">Reschedule</option>
            <option value="APPOINTMENT_CANCEL">Cancellation</option>
            <option value="CALL_LOGGED">Call Outcome Logged</option>
            <option value="STATUS_CHANGE">Status Transition</option>
            <option value="PATIENT_REGISTER">Patient Registration</option>
          </select>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {logs.length === 0 ? (
          <EmptyState
            title="No activity records"
            description="No audit records match your search criteria."
          />
        ) : (
          <div className="table-container" style={{ border: "none", boxShadow: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action Type</th>
                  <th>Description</th>
                  <th>Performed By</th>
                  <th>Target Record</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: "#1E293B" }}>
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                      <div style={{ fontSize: "0.74rem", color: "#64748B" }}>
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 800,
                          padding: "4px 8px",
                          borderRadius: 6,
                          backgroundColor: "#FAF5FF",
                          border: "1px solid #E9D5FF",
                          color: actionColors[log.action] || "#4C1D95"
                        }}
                      >
                        {log.action}
                      </span>
                    </td>

                    <td>
                      <div style={{ fontWeight: 600, color: "#1E293B", fontSize: "0.86rem" }}>
                        {log.description}
                      </div>
                      {log.details && Object.keys(log.details).length > 0 && (
                        <div style={{ fontSize: "0.74rem", color: "#64748B", marginTop: 2 }}>
                          {JSON.stringify(log.details)}
                        </div>
                      )}
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: "#4C1D95", fontSize: "0.84rem" }}>
                        {log.performedBy}
                      </div>
                    </td>

                    <td>
                      <span style={{ fontWeight: 700, color: "#7C3AED", fontSize: "0.84rem" }}>
                        {log.target || "System"}
                      </span>
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

export default ActivityHistory;
