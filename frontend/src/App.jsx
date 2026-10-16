import React, { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Layout from "./components/Layout.jsx";
import Modal from "./components/Modal.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Appointments from "./pages/Appointments.jsx";
import PatientReception from "./pages/PatientReception.jsx";
import WaitingQueue from "./pages/WaitingQueue.jsx";
import DoctorCoordination from "./pages/DoctorCoordination.jsx";
import CallsCommunication from "./pages/CallsCommunication.jsx";
import Notifications from "./pages/Notifications.jsx";
import Reports from "./pages/Reports.jsx";
import ActivityHistory from "./pages/ActivityHistory.jsx";
import Profile from "./pages/Profile.jsx";
import Settings from "./pages/Settings.jsx";
import { queueApi, doctorApi, appointmentApi } from "./api/client.js";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const StaffPortalApp = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [appointmentFilter, setAppointmentFilter] = useState("All");

  // Global Quick Check-in Modal State
  const [isQuickCheckinOpen, setIsQuickCheckinOpen] = useState(false);
  const [quickCheckinData, setQuickCheckinData] = useState({
    patientName: "",
    patientPhone: "",
    doctorId: "",
    priority: "Normal",
    receptionNotes: ""
  });
  const [doctorsList, setDoctorsList] = useState([]);
  const [quickCheckinLoading, setQuickCheckinLoading] = useState(false);
  const [quickCheckinToast, setQuickCheckinToast] = useState(null);

  // Sync route with URL
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname.replace(/^\/staff\/?/, "").replace(/^\//, "");
      const validTabs = [
        "dashboard",
        "appointments",
        "reception",
        "queue",
        "doctors",
        "calls",
        "notifications",
        "reports",
        "activity",
        "profile",
        "settings"
      ];
      if (validTabs.includes(path)) {
        setActiveTab(path);
      }
    };

    handleLocationChange();
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, []);

  useEffect(() => {
    doctorApi.getDoctors().then((res) => {
      if (res.success && res.doctors?.length > 0) {
        setDoctorsList(res.doctors);
        if (!quickCheckinData.doctorId) {
          setQuickCheckinData((prev) => ({ ...prev, doctorId: res.doctors[0].doctorId }));
        }
      }
    });
  }, []);

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    window.history.pushState({}, "", `/staff/${tabId}`);
  };

  const handleFilterAppointmentsFromDashboard = (status) => {
    setAppointmentFilter(status);
    handleSelectTab("appointments");
  };

  const handleQuickCheckinSubmit = async (e) => {
    e.preventDefault();
    if (!quickCheckinData.patientName.trim()) return;
    setQuickCheckinLoading(true);

    try {
      const res = await queueApi.checkIn({
        patientName: quickCheckinData.patientName,
        patientPhone: quickCheckinData.patientPhone,
        doctorId: quickCheckinData.doctorId,
        priority: quickCheckinData.priority,
        receptionNotes: quickCheckinData.receptionNotes || "Fast triage check-in from top bar"
      });

      if (res.success) {
        setQuickCheckinToast(`Check-in complete! Assigned Token ${res.queueItem.queueNumber}`);
        setTimeout(() => setQuickCheckinToast(null), 3500);
        setIsQuickCheckinOpen(false);
        setQuickCheckinData({
          patientName: "",
          patientPhone: "",
          doctorId: doctorsList[0]?.doctorId || "DOC1001",
          priority: "Normal",
          receptionNotes: ""
        });
        handleSelectTab("queue");
      }
    } catch (err) {
      alert(err.message || "Check-in failed");
    } finally {
      setQuickCheckinLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FAF5FF",
          fontFamily: "var(--font-family)",
          fontSize: "1.1rem",
          fontWeight: 800,
          color: "#4C1D95"
        }}
      >
        Initializing Liora Hospitals Staff Portal...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Login
        onLoginSuccess={() => {
          handleSelectTab("dashboard");
        }}
      />
    );
  }

  return (
    <>
      {quickCheckinToast && (
        <div className="toast-container">
          <div className="toast toast-success">
            <CheckCircle2 size={18} color="#10B981" />
            <span>{quickCheckinToast}</span>
          </div>
        </div>
      )}

      <Layout
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        onOpenQuickCheckin={() => setIsQuickCheckinOpen(true)}
      >
        {activeTab === "dashboard" && (
          <Dashboard
            onNavigate={handleSelectTab}
            onFilterAppointments={handleFilterAppointmentsFromDashboard}
            onOpenQuickCheckin={() => setIsQuickCheckinOpen(true)}
            onOpenBookModal={() => {
              setAppointmentFilter("All");
              handleSelectTab("appointments");
            }}
          />
        )}

        {activeTab === "appointments" && (
          <Appointments initialStatusFilter={appointmentFilter} />
        )}

        {activeTab === "reception" && (
          <PatientReception onCheckInSuccess={() => handleSelectTab("queue")} />
        )}

        {activeTab === "queue" && (
          <WaitingQueue onOpenCheckInModal={() => setIsQuickCheckinOpen(true)} />
        )}

        {activeTab === "doctors" && (
          <DoctorCoordination
            onBookWithDoctor={(doc) => {
              handleSelectTab("appointments");
            }}
          />
        )}

        {activeTab === "calls" && <CallsCommunication />}

        {activeTab === "notifications" && (
          <Notifications onNavigate={handleSelectTab} />
        )}

        {activeTab === "reports" && <Reports />}

        {activeTab === "activity" && <ActivityHistory />}

        {activeTab === "profile" && <Profile />}

        {activeTab === "settings" && <Settings />}
      </Layout>

      {/* GLOBAL FAST CHECK-IN MODAL */}
      <Modal
        isOpen={isQuickCheckinOpen}
        onClose={() => setIsQuickCheckinOpen(false)}
        title="Fast Patient Check-In to OPD Queue"
      >
        <form onSubmit={handleQuickCheckinSubmit}>
          <div className="form-group">
            <label className="form-label">Patient Full Name *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. David Fernandez"
              value={quickCheckinData.patientName}
              onChange={(e) => setQuickCheckinData({ ...quickCheckinData, patientName: e.target.value })}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                className="form-input"
                placeholder="+91 98765 00000"
                value={quickCheckinData.patientPhone}
                onChange={(e) => setQuickCheckinData({ ...quickCheckinData, patientPhone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Consultant Doctor *</label>
              <select
                className="form-select"
                required
                value={quickCheckinData.doctorId}
                onChange={(e) => setQuickCheckinData({ ...quickCheckinData, doctorId: e.target.value })}
              >
                {doctorsList.map((d) => (
                  <option key={d.doctorId} value={d.doctorId}>
                    {d.name} ({d.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Triage Priority</label>
            <select
              className="form-select"
              value={quickCheckinData.priority}
              onChange={(e) => setQuickCheckinData({ ...quickCheckinData, priority: e.target.value })}
            >
              <option value="Normal">Normal Queue</option>
              <option value="Senior Citizen">Senior Citizen / Pediatric</option>
              <option value="Urgent">Urgent Review</option>
              <option value="Emergency">Emergency Triage</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Reception Notes</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Arrived on time, ID verified, vitals recorded"
              value={quickCheckinData.receptionNotes}
              onChange={(e) => setQuickCheckinData({ ...quickCheckinData, receptionNotes: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsQuickCheckinOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={quickCheckinLoading}
            >
              {quickCheckinLoading ? "Assigning Token..." : "Issue Queue Token & Check In"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export const App = () => {
  return (
    <AuthProvider>
      <StaffPortalApp />
    </AuthProvider>
  );
};

export default App;
