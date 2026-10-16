import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Clock,
  Calendar,
  Users,
  Search,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Phone,
  MapPin,
  ChevronRight,
  Info
} from "lucide-react";
import Badge from "../components/Badge.jsx";
import Modal from "../components/Modal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { doctorApi } from "../api/client.js";

export const DoctorCoordination = ({ onBookWithDoctor }) => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);

  // Slots Schedule Modal
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [slotsData, setSlotsData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [isSlotsModalOpen, setIsSlotsModalOpen] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (departmentFilter !== "All") params.department = departmentFilter;
      if (searchQuery) params.search = searchQuery;

      const res = await doctorApi.getDoctors(params);
      if (res.success) {
        setDoctors(res.doctors || []);
      }
    } catch (e) {
      console.error("Fetch doctors error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [departmentFilter, searchQuery]);

  const openSlotsModal = async (doctor) => {
    setSelectedDoctor(doctor);
    setIsSlotsModalOpen(true);
    setSlotsLoading(true);
    try {
      const res = await doctorApi.getSlots(doctor.doctorId, selectedDate);
      if (res.success) {
        setSlotsData(res.slots || []);
      }
    } catch (e) {
    } finally {
      setSlotsLoading(false);
    }
  };

  const handleDateChange = async (newDate) => {
    setSelectedDate(newDate);
    if (!selectedDoctor) return;
    setSlotsLoading(true);
    try {
      const res = await doctorApi.getSlots(selectedDoctor.doctorId, newDate);
      if (res.success) {
        setSlotsData(res.slots || []);
      }
    } catch (e) {
    } finally {
      setSlotsLoading(false);
    }
  };

  const departments = Array.from(new Set(doctors.map((d) => d.department).filter(Boolean)));

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
            Doctor & Department Coordination
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
            Monitor live practitioner duty states, available consultation intervals, and OPD patient loads.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={fetchDoctors}>
          <RefreshCw size={15} />
          <span>Refresh Schedules</span>
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
            placeholder="Search doctor by name, specialty, or cabin location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: "8px 12px" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <select
            className="form-select"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            style={{ width: 220, padding: "8px 12px", fontSize: "0.84rem" }}
          >
            <option value="All">All Medical Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: 20
        }}
      >
        {doctors.map((doc) => (
          <div key={doc.doctorId} className="card" style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
              <img
                src={doc.avatar || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"}
                alt={doc.name}
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: "16px",
                  objectFit: "cover",
                  border: "1.5px solid #DDD6FE"
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: "1.05rem", color: "#4C1D95", margin: 0 }}>{doc.name}</h3>
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
                      ? "In Consultation"
                      : doc.currentStatus === "scheduled"
                      ? "In OPD"
                      : "Available"}
                  </Badge>
                </div>
                <div style={{ fontSize: "0.82rem", color: "#7C3AED", fontWeight: 700, marginTop: 2 }}>
                  {doc.department || doc.specialization}
                </div>
                <div style={{ fontSize: "0.75rem", color: "#64748B", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                  <MapPin size={12} />
                  <span>{doc.cabin || "Main OPD Complex"}</span>
                </div>
              </div>
            </div>

            {/* Metrics Chips */}
            <div
              style={{
                backgroundColor: "#FAF5FF",
                borderRadius: 12,
                border: "1px solid #E9D5FF",
                padding: "10px 14px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
                textAlign: "center",
                marginBottom: 14
              }}
            >
              <div>
                <span style={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Today Visits</span>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#4C1D95" }}>{doc.todayAppointmentCount || 0}</div>
              </div>
              <div>
                <span style={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>In Queue</span>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: doc.waitingCount > 0 ? "#B45309" : "#4C1D95" }}>{doc.waitingCount || 0}</div>
              </div>
              <div>
                <span style={{ fontSize: "0.68rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Est. Wait</span>
                <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#4C1D95" }}>{doc.estimatedWaitTimeMins || 0}m</div>
              </div>
            </div>

            {/* Next Appointment */}
            <div style={{ fontSize: "0.82rem", color: "#64748B", marginBottom: 14 }}>
              Next Scheduled: <strong style={{ color: "#1E293B" }}>{doc.nextAppointment || "None pending"}</strong>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => openSlotsModal(doc)}
                style={{ flex: 1, gap: 6 }}
              >
                <Clock size={14} />
                <span>View Slots</span>
              </button>

              {onBookWithDoctor && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onBookWithDoctor(doc)}
                  style={{ flex: 1, gap: 6 }}
                >
                  <Calendar size={14} />
                  <span>Book Slot</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* VIEW SLOTS MODAL */}
      <Modal
        isOpen={isSlotsModalOpen}
        onClose={() => setIsSlotsModalOpen(false)}
        title={`Consultation Slots: ${selectedDoctor?.name}`}
        size="lg"
      >
        {selectedDoctor && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 18,
                backgroundColor: "#FAF5FF",
                padding: "12px 18px",
                borderRadius: 12,
                border: "1px solid #E9D5FF"
              }}
            >
              <div>
                <div style={{ fontWeight: 800, color: "#4C1D95", fontSize: "1rem" }}>
                  {selectedDoctor.name}
                </div>
                <div style={{ fontSize: "0.82rem", color: "#64748B" }}>
                  {selectedDoctor.department} • Room {selectedDoctor.cabin}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#5B21B6" }}>Date:</span>
                <input
                  type="date"
                  className="form-input"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  style={{ width: 145, padding: "6px 10px", fontSize: "0.82rem" }}
                />
              </div>
            </div>

            {slotsLoading ? (
              <div style={{ textAlign: "center", padding: "30px 0", color: "#7C3AED", fontWeight: 700 }}>
                Loading available consultation intervals...
              </div>
            ) : (
              <div>
                <div style={{ fontSize: "0.86rem", fontWeight: 800, color: "#4C1D95", marginBottom: 12 }}>
                  Daily Slot Allocation ({slotsData.filter((s) => s.available).length} slots available)
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                    gap: 10
                  }}
                >
                  {slotsData.map((slot) => (
                    <div
                      key={slot.time}
                      style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: slot.available ? "1.5px solid #BBF7D0" : "1px solid #FECDD3",
                        backgroundColor: slot.available ? "#F0FDF4" : "#FFF1F2",
                        textAlign: "center"
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: "0.88rem",
                          color: slot.available ? "#15803D" : "#BE123C"
                        }}
                      >
                        {slot.time}
                      </div>
                      <div
                        style={{
                          fontSize: "0.72rem",
                          fontWeight: 700,
                          color: slot.available ? "#166534" : "#991B1B",
                          marginTop: 2
                        }}
                      >
                        {slot.available ? "Available" : "Booked"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DoctorCoordination;
