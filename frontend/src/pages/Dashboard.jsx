import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  UserCheck,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Stethoscope,
  PhoneCall,
  UserPlus,
  ArrowRight,
  RefreshCw,
  Bell,
  ChevronRight,
  ListOrdered,
  Plus
} from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import Badge from "../components/Badge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { appointmentApi, queueApi, doctorApi, communicationApi, notificationApi } from "../api/client.js";

export const Dashboard = ({ onNavigate, onFilterAppointments, onOpenQuickCheckin, onOpenBookModal }) => {
  const [filterPeriod, setFilterPeriod] = useState("today");
  const [customDate, setCustomDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Data states
  const [appointments, setAppointments] = useState([]);
  const [queue, setQueue] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [pendingCalls, setPendingCalls] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const params = filterPeriod === "custom" && customDate ? { date: customDate } : { filterPeriod };

      const [aptRes, queueRes, docRes, callRes, notifRes] = await Promise.allSettled([
        appointmentApi.getAppointments(params),
        queueApi.getLiveQueue(),
        doctorApi.getDoctors(),
        communicationApi.getCallList(),
        notificationApi.getNotifications()
      ]);

      if (aptRes.status === "fulfilled" && aptRes.value.success) {
        setAppointments(aptRes.value.appointments || []);
      }
      if (queueRes.status === "fulfilled" && queueRes.value.success) {
        setQueue(queueRes.value.queue || []);
      }
      if (docRes.status === "fulfilled" && docRes.value.success) {
        setDoctors(docRes.value.doctors || []);
      }
      if (callRes.status === "fulfilled" && callRes.value.success) {
        setPendingCalls(callRes.value.callList || []);
      }
      if (notifRes.status === "fulfilled" && notifRes.value.success) {
        setNotifications(notifRes.value.notifications || []);
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filterPeriod, customDate]);

  // Compute metrics from real stored records
  const totalToday = appointments.length;
  const upcomingCount = appointments.filter(
    (a) => a.status === "Booked" || a.status === "Scheduled" || a.status === "Confirmed"
  ).length;
  const checkedInCount = queue.filter((q) => q.status === "Checked In").length;
  const waitingCount = queue.filter((q) => q.status === "Waiting").length;
  const withDoctorCount = queue.filter((q) => q.status === "With Doctor").length;
  const completedCount = appointments.filter((a) => a.status === "Completed").length;
  const cancelledCount = appointments.filter((a) => a.status === "Cancelled").length;
  const missedCount = appointments.filter((a) => a.status === "No Show" || a.status === "Missed").length;

  const delayedQueue = queue.filter((q) => q.isDelayed || q.waitingMinutes > 20);

  const handleCardClick = (filterStatus) => {
    if (onFilterAppointments) {
      onFilterAppointments(filterStatus);
    } else {
      onNavigate("appointments");
    }
  };

  return (
    <div>
      {/* Top Banner & Date Switcher */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 24
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", color: "#4C1D95", marginBottom: 4 }}>
            Hospital Front Desk Operations
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
            Real-time patient check-ins, waiting lounge tracking, and doctor schedule coordination.
          </p>
        </div>

        {/* Date Filter Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
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
              onClick={() => setFilterPeriod("today")}
              style={{
                padding: "6px 14px",
                borderRadius: 9,
                border: "none",
                backgroundColor: filterPeriod === "today" ? "#7C3AED" : "transparent",
                color: filterPeriod === "today" ? "#FFFFFF" : "#64748B",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.18s"
              }}
            >
              Today
            </button>
            <button
              onClick={() => setFilterPeriod("tomorrow")}
              style={{
                padding: "6px 14px",
                borderRadius: 9,
                border: "none",
                backgroundColor: filterPeriod === "tomorrow" ? "#7C3AED" : "transparent",
                color: filterPeriod === "tomorrow" ? "#FFFFFF" : "#64748B",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.18s"
              }}
            >
              Tomorrow
            </button>
            <button
              onClick={() => setFilterPeriod("all")}
              style={{
                padding: "6px 14px",
                borderRadius: 9,
                border: "none",
                backgroundColor: filterPeriod === "all" ? "#7C3AED" : "transparent",
                color: filterPeriod === "all" ? "#FFFFFF" : "#64748B",
                fontWeight: 700,
                fontSize: "0.82rem",
                cursor: "pointer",
                transition: "all 0.18s"
              }}
            >
              All Dates
            </button>
          </div>

          <input
            type="date"
            className="form-input"
            value={customDate}
            onChange={(e) => {
              setCustomDate(e.target.value);
              setFilterPeriod("custom");
            }}
            style={{ width: 145, padding: "7px 10px", fontSize: "0.82rem" }}
          />

          <button
            className="btn btn-secondary btn-sm"
            onClick={fetchDashboardData}
            title="Refresh Live Data"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Delayed Appointments Alert Banner (if any) */}
      {delayedQueue.length > 0 && (
        <div
          style={{
            backgroundColor: "#FFFBEB",
            border: "1px solid #FDE68A",
            borderRadius: 14,
            padding: "14px 20px",
            marginBottom: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            boxShadow: "0 2px 8px rgba(180, 83, 9, 0.05)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                backgroundColor: "#FEF3C7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#B45309",
                flexShrink: 0
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: "#92400E", fontSize: "0.92rem" }}>
                Attention: {delayedQueue.length} Patient{delayedQueue.length > 1 ? "s" : ""} Waiting Over 20 Minutes
              </div>
              <div style={{ color: "#B45309", fontSize: "0.82rem" }}>
                {delayedQueue.map((q) => `${q.patientName} (${q.waitingMinutes}m for ${q.doctorName})`).join(" • ")}
              </div>
            </div>
          </div>
          <button
            className="btn btn-sm"
            onClick={() => onNavigate("queue")}
            style={{ backgroundColor: "#B45309", color: "#FFFFFF", border: "none" }}
          >
            Manage Queue
          </button>
        </div>
      )}

      {/* 8 Core Summary Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 28
        }}
      >
        <StatCard
          title="Total Today"
          value={totalToday}
          subtitle="Scheduled visits"
          icon={Calendar}
          color="primary"
          onClick={() => handleCardClick("All")}
        />
        <StatCard
          title="Upcoming"
          value={upcomingCount}
          subtitle="Pending arrivals"
          icon={Clock}
          color="sky"
          onClick={() => handleCardClick("Upcoming")}
        />
        <StatCard
          title="Checked In"
          value={checkedInCount}
          subtitle="At reception"
          icon={UserCheck}
          color="violet"
          onClick={() => onNavigate("queue")}
        />
        <StatCard
          title="Waiting"
          value={waitingCount}
          subtitle="In OPD lounge"
          icon={Users}
          color="amber"
          badge={waitingCount > 0 ? `${waitingCount} in queue` : null}
          onClick={() => onNavigate("queue")}
        />
        <StatCard
          title="With Doctors"
          value={withDoctorCount}
          subtitle="Active consults"
          icon={Stethoscope}
          color="primary"
          onClick={() => onNavigate("queue")}
        />
        <StatCard
          title="Completed"
          value={completedCount}
          subtitle="Visits concluded"
          icon={CheckCircle2}
          color="emerald"
          onClick={() => handleCardClick("Completed")}
        />
        <StatCard
          title="Cancelled"
          value={cancelledCount}
          subtitle="With reasons"
          icon={XCircle}
          color="rose"
          onClick={() => handleCardClick("Cancelled")}
        />
        <StatCard
          title="Missed / No-Show"
          value={missedCount}
          subtitle="Absent patients"
          icon={AlertTriangle}
          color="amber"
          onClick={() => handleCardClick("No Show")}
        />
      </div>

      {/* Quick Action Toolbar */}
      <div
        style={{
          backgroundColor: "#FAF5FF",
          border: "1px solid #E9D5FF",
          borderRadius: 16,
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 28
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontWeight: 800, color: "#5B21B6", fontSize: "0.92rem" }}>
            Quick Actions:
          </div>
          <span style={{ color: "#807A8A", fontSize: "0.82rem" }}>
            Common front-desk workflows
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={onOpenQuickCheckin}
            style={{ gap: 6 }}
          >
            <UserCheck size={16} /> Check In Arrived Patient
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onOpenBookModal}
            style={{ gap: 6 }}
          >
            <Calendar size={16} /> Book Appointment
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onNavigate("reception")}
            style={{ gap: 6 }}
          >
            <UserPlus size={16} /> Register New Patient
          </button>
          <button
            className="btn btn-outline btn-sm"
            onClick={() => onNavigate("calls")}
            style={{ gap: 6 }}
          >
            <PhoneCall size={16} /> Confirmation Calls
          </button>
        </div>
      </div>

      {/* 2-Column Operational Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 24, marginBottom: 28 }}>
        {/* Left Column: Live Waiting Queue Snapshot */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <ListOrdered size={20} color="#7C3AED" />
              <span>Live OPD Waiting Queue</span>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate("queue")}
              style={{ fontSize: "0.78rem", gap: 4 }}
            >
              <span>View Full Queue</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {queue.length === 0 ? (
            <EmptyState
              title="No patients in queue"
              description="No patients are currently checked in or waiting."
              actionText="Check In Patient"
              onAction={onOpenQuickCheckin}
            />
          ) : (
            <div className="table-container" style={{ border: "none", boxShadow: "none" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Wait Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {queue.slice(0, 5).map((q) => (
                    <tr key={q.id}>
                      <td>
                        <span style={{ fontWeight: 800, color: "#7C3AED" }}>
                          {q.queueNumber}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 700, color: "#1E293B" }}>{q.patientName}</div>
                        <div style={{ fontSize: "0.74rem", color: "#64748B" }}>
                          {q.patientId} • Slot {q.appointmentTime}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{q.doctorName}</div>
                        <div style={{ fontSize: "0.74rem", color: "#64748B" }}>{q.department}</div>
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color: q.waitingMinutes > 20 ? "#BE123C" : "#4C1D95"
                          }}
                        >
                          {q.waitingMinutes}m
                        </span>
                      </td>
                      <td>
                        <Badge status={q.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Column: Doctor Availability Snapshot */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Stethoscope size={20} color="#7C3AED" />
              <span>Doctor OPD Availability</span>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate("doctors")}
              style={{ fontSize: "0.78rem", gap: 4 }}
            >
              <span>All Doctors</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {doctors.slice(0, 4).map((doc) => (
              <div
                key={doc.id || doc.doctorId}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  backgroundColor: "#FAF5FF",
                  border: "1px solid #E9D5FF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img
                    src={doc.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"}
                    alt={doc.name}
                    style={{ width: 38, height: 38, borderRadius: "50%", objectFit: "cover" }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, color: "#4C1D95", fontSize: "0.88rem" }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: "0.74rem", color: "#64748B" }}>
                      {doc.department || doc.specialization}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>
                    <Badge
                      status={
                        doc.currentStatus === "consulting"
                          ? "With Doctor"
                          : doc.currentStatus === "scheduled"
                          ? "Waiting"
                          : "Completed"
                      }
                    >
                      {doc.currentStatus === "consulting"
                        ? "Consulting"
                        : doc.currentStatus === "scheduled"
                        ? "In OPD"
                        : "Available"}
                    </Badge>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#64748B", marginTop: 4 }}>
                    {doc.todayAppointmentCount || 0} visits today
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section: Confirmation Calls & Today's Schedule */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        {/* Pending Confirmation Calls */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <PhoneCall size={19} color="#7C3AED" />
              <span>Pending Confirmation Calls ({pendingCalls.filter((c) => c.needsConfirmation).length})</span>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate("calls")}
              style={{ fontSize: "0.78rem", gap: 4 }}
            >
              <span>Call Center</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {pendingCalls.filter((c) => c.needsConfirmation).length === 0 ? (
            <EmptyState
              title="All calls completed"
              description="There are no pending confirmation calls at this time."
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {pendingCalls
                .filter((c) => c.needsConfirmation)
                .slice(0, 4)
                .map((call) => (
                  <div
                    key={call.appointmentId}
                    style={{
                      padding: "10px 14px",
                      borderRadius: 12,
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E9D5FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 800, color: "#1E293B", fontSize: "0.88rem" }}>
                        {call.patientName}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "#64748B" }}>
                        Slot: {call.appointmentDate} at {call.appointmentTime} • {call.doctorName}
                      </div>
                    </div>

                    <a
                      href={`tel:${call.patientPhone}`}
                      className="btn btn-secondary btn-sm"
                      style={{ gap: 6, fontSize: "0.78rem", textDecoration: "none" }}
                    >
                      <PhoneCall size={14} color="#7C3AED" />
                      <span>{call.patientPhone || "Call"}</span>
                    </a>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Notifications & System Alerts Snapshot */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Bell size={19} color="#7C3AED" />
              <span>Front Desk Activity & Alerts</span>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate("notifications")}
              style={{ fontSize: "0.78rem", gap: 4 }}
            >
              <span>All Alerts</span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {notifications.slice(0, 4).map((n) => (
              <div
                key={n.id}
                onClick={() => onNavigate("notifications")}
                style={{
                  padding: "10px 14px",
                  borderRadius: 12,
                  backgroundColor: n.isRead ? "#FFFFFF" : "#FAF5FF",
                  border: n.isRead ? "1px solid #E2E8F0" : "1px solid #DDD6FE",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: n.isRead ? "#94A3B8" : "#7C3AED",
                    marginTop: 5,
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#4C1D95" }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: "0.76rem", color: "#64748B", marginTop: 2 }}>
                    {n.message}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
