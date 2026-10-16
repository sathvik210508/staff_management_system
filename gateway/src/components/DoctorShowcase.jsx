import React, { useState, useEffect } from "react";
import {
  Stethoscope,
  Search,
  Calendar,
  Clock,
  MapPin,
  Award,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  UserCheck
} from "lucide-react";
import { DOCTORS_DATA } from "../data/doctors.js";

export default function DoctorShowcase() {
  const patientUrl = import.meta.env.VITE_PATIENT_PORTAL_URL || "http://localhost:5173";
  const apiUrl = import.meta.env.VITE_BACKEND_API_URL || "http://localhost:5002/api";

  const [doctors, setDoctors] = useState(DOCTORS_DATA);
  const [selectedDept, setSelectedDept] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch(`${apiUrl}/doctors`)
      .then((res) => {
        if (!res.ok) throw new Error("Network error");
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const enriched = data.map((d, index) => {
            const fallback = DOCTORS_DATA[index] || {};
            return {
              id: d.id || `doc-${index + 1}`,
              name: d.name || fallback.name,
              department: d.department || fallback.department || "General Medicine",
              specialty: d.specialty || fallback.specialty || d.department,
              qualification: d.qualification || fallback.qualification || "MBBS, MD",
              experience: d.experience || fallback.experience || "10+ Years",
              room: fallback.room || `OPD Room ${100 + index * 5}`,
              timing: fallback.timing || "09:00 AM - 02:00 PM",
              rating: fallback.rating || "4.9",
              status: fallback.status || "Available Today"
            };
          });
          setDoctors(enriched);
        }
      })
      .catch(() => {
        setDoctors(DOCTORS_DATA);
      });
  }, [apiUrl]);

  const departments = ["All", ...new Set(doctors.map((d) => d.department.split("&")[0].trim()))];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesDept =
      selectedDept === "All" ||
      doc.department.toLowerCase().includes(selectedDept.toLowerCase());
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.qualification.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <section
      id="doctors"
      className="section"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB"
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header-center">
          <div className="section-tag">
            <Stethoscope size={14} />
            <span>MEDICAL FACULTY</span>
          </div>
          <h2 className="section-title">Meet Our Specialist Doctors</h2>
          <p className="section-desc">
            Consult with accredited, senior medical practitioners across 12 clinical specialties. Select any doctor below to reserve an appointment slot on our Patient Portal.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div
          style={{
            backgroundColor: "#FAFAFF",
            border: "1px solid #E5E7EB",
            borderRadius: "16px",
            padding: "1rem 1.25rem",
            marginBottom: "2.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          {/* Search Input */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: "0.55rem 0.95rem",
              flex: "1",
              minWidth: "260px"
            }}
          >
            <Search size={16} color="#9CA3AF" />
            <input
              type="text"
              placeholder="Search doctor by name, specialty, or qualification..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                width: "100%",
                fontSize: "0.9rem",
                color: "#111827"
              }}
            />
          </div>

          {/* Department pills */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              overflowX: "auto",
              paddingBottom: "2px",
              maxWidth: "100%"
            }}
          >
            {departments.slice(0, 7).map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                style={{
                  padding: "0.45rem 0.9rem",
                  borderRadius: "9999px",
                  fontSize: "0.825rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  backgroundColor: selectedDept === dept ? "#7C3AED" : "#FFFFFF",
                  color: selectedDept === dept ? "#FFFFFF" : "#4B5563",
                  border: selectedDept === dept ? "1px solid #7C3AED" : "1px solid #E5E7EB",
                  transition: "all 0.15s ease"
                }}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.75rem"
          }}
          className="doctors-grid"
        >
          {filteredDoctors.map((doc) => {
            const bookingLink = `${patientUrl}?doctor=${encodeURIComponent(doc.name)}&specialty=${encodeURIComponent(doc.department)}&action=book`;

            return (
              <div
                key={doc.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid #F3F4F6",
                  borderRadius: "20px",
                  padding: "1.85rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.03)",
                  transition: "all 0.22s ease"
                }}
                className="doctor-card"
              >
                <div>
                  {/* Top Bar: Doctor Avatar & Status */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: "1rem"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                      <div
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "16px",
                          backgroundColor: "#F5F3FF",
                          color: "#7C3AED",
                          border: "1.5px solid #DDD6FE",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "1.2rem",
                          boxShadow: "0 2px 6px rgba(124, 58, 237, 0.12)"
                        }}
                      >
                        {doc.name.replace("Dr. ", "").charAt(0)}
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: "1.18rem",
                            fontWeight: 800,
                            color: "#111827",
                            letterSpacing: "-0.01em"
                          }}
                        >
                          {doc.name}
                        </h3>
                        <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#7C3AED" }}>
                          {doc.department}
                        </div>
                      </div>
                    </div>

                    <span className="badge-live" style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem" }}>
                      <span className="badge-live-pulse"></span>
                      Available
                    </span>
                  </div>

                  {/* Qualification & Experience */}
                  <div
                    style={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: "12px",
                      padding: "0.85rem 1rem",
                      marginBottom: "1rem",
                      fontSize: "0.825rem",
                      color: "#4B5563"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.35rem" }}>
                      <Award size={14} color="#7C3AED" />
                      <span style={{ fontWeight: 600, color: "#1F2937" }}>{doc.qualification}</span>
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "#6B7280" }}>
                      Clinical Experience: <strong>{doc.experience}</strong>
                    </div>
                  </div>

                  {/* Consultation Location & Timing */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.4rem",
                      fontSize: "0.8rem",
                      color: "#6B7280",
                      marginBottom: "1.5rem"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <MapPin size={13} color="#9CA3AF" />
                      <span>{doc.room}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
                      <Clock size={13} color="#9CA3AF" />
                      <span>OPD Timing: {doc.timing}</span>
                    </div>
                  </div>
                </div>

                {/* Primary Booking Action: Redirects to Patient Portal preselecting this Doctor */}
                <div>
                  <a
                    href={bookingLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.55rem",
                      width: "100%",
                      padding: "0.75rem 1.25rem",
                      borderRadius: "12px",
                      backgroundColor: "#7C3AED",
                      color: "#FFFFFF",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      boxShadow: "0 4px 14px rgba(124, 58, 237, 0.25)",
                      transition: "all 0.2s ease"
                    }}
                    className="doc-book-btn"
                  >
                    <Calendar size={15} />
                    <span>Book Appointment with {doc.name.split(" ")[1]}</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .doctor-card:hover {
          border-color: #DDD6FE !important;
          transform: translateY(-3px);
          box-shadow: 0 12px 24px -2px rgba(124, 58, 237, 0.1) !important;
        }
        .doc-book-btn:hover {
          background-color: #6D28D9 !important;
          transform: translateY(-1px);
        }
        @media (max-width: 1024px) {
          .doctors-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 680px) {
          .doctors-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
