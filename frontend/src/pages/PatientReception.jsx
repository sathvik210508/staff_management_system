import React, { useState, useEffect } from "react";
import {
  Search,
  UserPlus,
  Users,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Edit,
  Clock,
  ShieldCheck,
  FileText,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import Badge from "../components/Badge.jsx";
import Modal from "../components/Modal.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { patientApi, queueApi, appointmentApi } from "../api/client.js";

export const PatientReception = ({ onCheckInSuccess }) => {
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Registration Modal
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [regFormData, setRegFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "32",
    gender: "Male",
    bloodGroup: "O+",
    emergencyContact: "",
    address: "",
    receptionNotes: ""
  });
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState("");

  // Edit Demographics Modal
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);

  // View Dossier Modal
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const res = await patientApi.getPatients(searchQuery);
      if (res.success) {
        setPatients(res.patients || []);
      }
    } catch (e) {
      console.error("Fetch patients error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [searchQuery]);

  // Live duplicate checking when phone input changes
  const handlePhoneChange = async (val) => {
    setRegFormData((prev) => ({ ...prev, phone: val }));
    if (val.length >= 8) {
      try {
        const res = await patientApi.checkDuplicates(val);
        if (res.hasDuplicates) {
          setDuplicateWarning(res.duplicates[0]);
        } else {
          setDuplicateWarning(null);
        }
      } catch (e) {}
    } else {
      setDuplicateWarning(null);
    }
  };

  // Submit Patient Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegLoading(true);

    try {
      const res = await patientApi.register(regFormData);
      if (res.success) {
        showToast(`Patient ${res.patient.name} registered with ID ${res.patient.patientId}!`);
        setIsRegisterOpen(false);
        setRegFormData({
          name: "",
          phone: "",
          email: "",
          age: "32",
          gender: "Male",
          bloodGroup: "O+",
          emergencyContact: "",
          address: "",
          receptionNotes: ""
        });
        setDuplicateWarning(null);
        fetchPatients();
      }
    } catch (err) {
      setRegError(err.message || "Registration failed");
    } finally {
      setRegLoading(false);
    }
  };

  // Open Edit Demographics Modal
  const openEditModal = (patient) => {
    setEditFormData({
      id: patient.id || patient.patientId,
      name: patient.name || "",
      phone: patient.phone || "",
      email: patient.email || "",
      age: patient.age || 30,
      gender: patient.gender || "Male",
      bloodGroup: patient.bloodGroup || "O+",
      emergencyContact: patient.emergencyContact || "",
      address: patient.address || "",
      receptionNotes: patient.receptionNotes || ""
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await patientApi.updateDemographics(editFormData.id, editFormData);
      if (res.success) {
        showToast("Demographic and contact information updated!");
        setIsEditOpen(false);
        fetchPatients();
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setEditLoading(false);
    }
  };

  // Open Details Modal
  const openDetailsModal = async (patient) => {
    setSelectedPatient(patient);
    setIsDetailsOpen(true);
    try {
      const res = await patientApi.getById(patient.patientId || patient.id);
      if (res.success) {
        setPatientDetails(res);
      }
    } catch (e) {}
  };

  // Direct check-in from patient card
  const handleDirectCheckin = async (patient) => {
    try {
      const res = await queueApi.checkIn({
        patientId: patient.patientId,
        priority: "Normal",
        receptionNotes: "Patient arrived for reception triage check-in."
      });
      if (res.success) {
        showToast(`Checked in ${patient.name}! Assigned Ticket ${res.queueItem.queueNumber}`);
        if (onCheckInSuccess) onCheckInSuccess();
      }
    } catch (err) {
      showToast(err.message, "error");
    }
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

      {/* Header & Registration Button */}
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
            Patient Reception & Registration
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
            Search registered hospital patients, register new arrivals with duplicate prevention, and check in.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => {
            setRegError("");
            setDuplicateWarning(null);
            setIsRegisterOpen(true);
          }}
          style={{ gap: 8 }}
        >
          <UserPlus size={18} />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div
        className="card"
        style={{
          padding: "16px 20px",
          marginBottom: 24,
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
            placeholder="Search patient by name, Phone number, or Patient ID (e.g. PAT1021)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: "8px 14px" }}
          />
        </div>

        <button className="btn btn-secondary btn-sm" onClick={fetchPatients}>
          <RefreshCw size={15} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Patients Table */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {patients.length === 0 ? (
          <EmptyState
            title="No patients found"
            description="No registered patient records match your search criteria."
            actionText="Register Patient"
            onAction={() => setIsRegisterOpen(true)}
          />
        ) : (
          <div className="table-container" style={{ border: "none", boxShadow: "none" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Patient ID</th>
                  <th>Patient Name & Demographics</th>
                  <th>Contact Information</th>
                  <th>Emergency Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((p) => (
                  <tr key={p.patientId || p.id}>
                    <td>
                      <span style={{ fontWeight: 800, color: "#7C3AED" }}>
                        {p.patientId}
                      </span>
                      <div style={{ fontSize: "0.72rem", color: "#64748B" }}>
                        Registered: {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Active"}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: 700, color: "#1E293B", fontSize: "0.92rem" }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: "0.76rem", color: "#64748B" }}>
                        {p.age} yrs • {p.gender} • Blood: <strong style={{ color: "#BE123C" }}>{p.bloodGroup || "—"}</strong>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.84rem", color: "#1E293B", fontWeight: 600 }}>
                        <Phone size={13} color="#7C3AED" />
                        <span>{p.phone}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "0.76rem", color: "#64748B", marginTop: 2 }}>
                        <Mail size={13} color="#8B5CF6" />
                        <span>{p.email || "No email"}</span>
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: "0.82rem", color: "#475569" }}>
                        {p.emergencyContact || "Family Contact"}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#64748B" }}>
                        {p.address || "Bengaluru"}
                      </div>
                    </td>

                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleDirectCheckin(p)}
                          title="Check in this patient"
                          style={{ padding: "5px 10px", fontSize: "0.76rem" }}
                        >
                          <UserCheck size={14} />
                          <span>Check In</span>
                        </button>

                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => openDetailsModal(p)}
                          title="View Patient Appointments & Profile"
                          style={{ padding: "5px 8px" }}
                        >
                          <FileText size={14} />
                        </button>

                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => openEditModal(p)}
                          title="Edit Demographics & Contact Only"
                          style={{ padding: "5px 8px" }}
                        >
                          <Edit size={14} />
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

      {/* REGISTER NEW PATIENT MODAL */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Register New Patient (Reception Module)"
        size="lg"
      >
        <form onSubmit={handleRegisterSubmit}>
          {duplicateWarning && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                backgroundColor: "#FFFBEB",
                border: "1px solid #FDE68A",
                color: "#92400E",
                fontSize: "0.85rem",
                marginBottom: 16,
                display: "flex",
                alignItems: "flex-start",
                gap: 10
              }}
            >
              <AlertTriangle size={18} color="#B45309" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong>Potential Duplicate Detected:</strong> A patient with this phone number is already registered:
                <br />
                <strong>{duplicateWarning.name}</strong> (Patient ID: <strong>{duplicateWarning.patientId}</strong>)
                <div style={{ marginTop: 4, fontSize: "0.78rem" }}>
                  Please search for this patient to avoid creating redundant hospital dossiers.
                </div>
              </div>
            </div>
          )}

          {regError && (
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
              <AlertCircle size={16} /> {regError}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Patient Full Name *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Rohini Sen"
                value={regFormData.name}
                onChange={(e) => setRegFormData({ ...regFormData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Mobile Number *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="+91 98765 11223"
                value={regFormData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="patient@example.com"
                value={regFormData.email}
                onChange={(e) => setRegFormData({ ...regFormData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Age & Gender *</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <input
                  type="number"
                  className="form-input"
                  required
                  min="1"
                  max="120"
                  value={regFormData.age}
                  onChange={(e) => setRegFormData({ ...regFormData, age: e.target.value })}
                />
                <select
                  className="form-select"
                  value={regFormData.gender}
                  onChange={(e) => setRegFormData({ ...regFormData, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-select"
                value={regFormData.bloodGroup}
                onChange={(e) => setRegFormData({ ...regFormData, bloodGroup: e.target.value })}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Contact Name & Phone</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Ramesh Sen (Spouse) - 98765 00000"
                value={regFormData.emergencyContact}
                onChange={(e) => setRegFormData({ ...regFormData, emergencyContact: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Residential Address</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. #42, 3rd Cross, Indiranagar, Bengaluru"
              value={regFormData.address}
              onChange={(e) => setRegFormData({ ...regFormData, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Reception Notes</label>
            <textarea
              className="form-textarea"
              placeholder="e.g. First time visitor, referred by Dr. Sarah Jenkins"
              value={regFormData.receptionNotes}
              onChange={(e) => setRegFormData({ ...regFormData, receptionNotes: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsRegisterOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={regLoading}
            >
              {regLoading ? "Registering..." : "Complete Registration"}
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT DEMOGRAPHICS ONLY MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Update Patient Demographics: ${editFormData?.name}`}
      >
        {editFormData && (
          <form onSubmit={handleEditSubmit}>
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                backgroundColor: "#FAF5FF",
                border: "1px solid #E9D5FF",
                color: "#5B21B6",
                fontSize: "0.82rem",
                marginBottom: 16
              }}
            >
              <ShieldCheck size={16} style={{ verticalAlign: "middle", marginRight: 6 }} />
              <strong>Role Protected:</strong> Front-desk staff can modify demographic and contact details only. Clinical notes and prescriptions are restricted to certified physicians.
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-input"
                  value={editFormData.age}
                  onChange={(e) => setEditFormData({ ...editFormData, age: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <input
                  type="text"
                  className="form-input"
                  value={editFormData.bloodGroup}
                  onChange={(e) => setEditFormData({ ...editFormData, bloodGroup: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Contact</label>
              <input
                type="text"
                className="form-input"
                value={editFormData.emergencyContact}
                onChange={(e) => setEditFormData({ ...editFormData, emergencyContact: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                className="form-input"
                value={editFormData.address}
                onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 18 }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={editLoading}
              >
                {editLoading ? "Updating..." : "Save Demographics"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* PATIENT APPOINTMENT HISTORY DOSSIER */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title={`Patient Reception Record: ${selectedPatient?.name} (${selectedPatient?.patientId})`}
        size="lg"
      >
        {selectedPatient && (
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
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#4C1D95" }}>
                  {selectedPatient.name}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#64748B", marginTop: 4 }}>
                  Age: {selectedPatient.age} • Gender: {selectedPatient.gender} • Blood Group: {selectedPatient.bloodGroup || "—"}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#1E293B", marginTop: 4 }}>
                  Phone: {selectedPatient.phone}
                </div>
              </div>

              <div>
                <div style={{ fontSize: "0.85rem", color: "#64748B" }}>
                  Emergency Contact: <strong>{selectedPatient.emergencyContact || "—"}</strong>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#64748B", marginTop: 4 }}>
                  Address: {selectedPatient.address || "Bengaluru, India"}
                </div>
                <div style={{ fontSize: "0.85rem", color: "#7C3AED", fontWeight: 700, marginTop: 4 }}>
                  {selectedPatient.allergies && `Allergies: ${selectedPatient.allergies}`}
                </div>
              </div>
            </div>

            {/* Patient Appointments History */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#4C1D95", marginBottom: 10 }}>
                Patient Appointments History ({patientDetails?.appointments?.length || 0})
              </div>

              {(!patientDetails?.appointments || patientDetails.appointments.length === 0) ? (
                <div style={{ color: "#64748B", fontSize: "0.86rem", padding: "12px 0" }}>
                  No prior appointments on record for this patient.
                </div>
              ) : (
                <div className="table-container" style={{ border: "1px solid #E9D5FF" }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Doctor</th>
                        <th>Department</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patientDetails.appointments.map((a) => (
                        <tr key={a.appointmentId || a.id}>
                          <td>
                            <div style={{ fontWeight: 700 }}>{a.date}</div>
                            <div style={{ fontSize: "0.74rem", color: "#64748B" }}>{a.time}</div>
                          </td>
                          <td>{a.doctorName || a.doctor}</td>
                          <td>{a.department || a.specialty}</td>
                          <td><Badge status={a.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PatientReception;
