import React from "react";
import {
  HeartPulse,
  Sparkles,
  Activity,
  Brain,
  Users2,
  Stethoscope,
  Baby,
  ShieldAlert,
  Flame,
  Droplet,
  Wind,
  Layers,
  ArrowRight,
  Calendar,
  CheckCircle2
} from "lucide-react";
import { SPECIALTIES_DATA } from "../data/specialties.js";

const iconMap = {
  HeartPulse,
  Sparkles,
  Activity,
  Brain,
  Users2,
  Stethoscope,
  Baby,
  ShieldAlert,
  Flame,
  Droplet,
  Wind,
  Layers
};

export default function Specialties() {
  const patientUrl = import.meta.env.VITE_PATIENT_PORTAL_URL || "http://localhost:5173";

  return (
    <section
      id="specialties"
      className="section"
      style={{
        backgroundColor: "#FAFAFF",
        borderBottom: "1px solid #EDE9FE"
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header-center">
          <div className="section-tag">
            <Activity size={14} />
            <span>CLINICAL EXCELLENCE</span>
          </div>
          <h2 className="section-title">Specialties & Medical Services</h2>
          <p className="section-desc">
            Explore our 12 specialized outpatient faculties led by accredited medical doctors. Choose your specialty below to schedule a consultation through our Patient Portal.
          </p>
        </div>

        {/* 12 Specialties Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1.75rem"
          }}
          className="specialties-grid"
        >
          {SPECIALTIES_DATA.map((spec) => {
            const Icon = iconMap[spec.icon] || Activity;
            const bookingLink = `${patientUrl}?specialty=${encodeURIComponent(spec.shortName)}&action=book`;

            return (
              <div
                key={spec.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid #F3F4F6",
                  borderRadius: "20px",
                  padding: "1.85rem 1.6rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 14px rgba(0, 0, 0, 0.03)",
                  transition: "all 0.22s ease",
                  position: "relative"
                }}
                className="specialty-card"
              >
                <div>
                  {/* Top Bar: Icon and OPD Location */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "1.25rem"
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "14px",
                        backgroundColor: "#FAF5FF",
                        color: "#7C3AED",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #DDD6FE"
                      }}
                    >
                      <Icon size={26} />
                    </div>

                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "#6B7280",
                        backgroundColor: "#F9FAFB",
                        padding: "0.3rem 0.65rem",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB"
                      }}
                    >
                      {spec.room}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "#111827",
                      marginBottom: "0.35rem",
                      letterSpacing: "-0.01em"
                    }}
                  >
                    {spec.name}
                  </h3>

                  <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#7C3AED", marginBottom: "0.85rem" }}>
                    Lead Consultant: {spec.leadDoctor}
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "0.88rem",
                      lineHeight: 1.6,
                      color: "#4B5563",
                      marginBottom: "1.25rem"
                    }}
                  >
                    {spec.description}
                  </p>

                  {/* Treatments list */}
                  <div
                    style={{
                      backgroundColor: "#F9FAFB",
                      borderRadius: "12px",
                      padding: "0.85rem 1rem",
                      marginBottom: "1.5rem",
                      border: "1px solid #F3F4F6"
                    }}
                  >
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", marginBottom: "0.5rem" }}>
                      Key Treatments & Diagnostics
                    </div>
                    <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      {spec.treatments.map((t, idx) => (
                        <li key={idx} style={{ display: "flex", alignItems: "center", gap: "0.45rem", fontSize: "0.8rem", color: "#374151" }}>
                          <CheckCircle2 size={13} color="#7C3AED" style={{ flexShrink: 0 }} />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Action: Book Appointment for this Specialty */}
                <div>
                  <a
                    href={bookingLink}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                      width: "100%",
                      padding: "0.75rem 1rem",
                      borderRadius: "12px",
                      backgroundColor: "#FAF5FF",
                      color: "#7C3AED",
                      border: "1.5px solid #DDD6FE",
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      textDecoration: "none",
                      transition: "all 0.2s ease"
                    }}
                    className="spec-action-btn"
                  >
                    <Calendar size={15} />
                    <span>Book Appointment in {spec.shortName}</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .specialty-card:hover {
          border-color: #DDD6FE !important;
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -4px rgba(124, 58, 237, 0.1) !important;
        }
        .spec-action-btn:hover {
          background-color: #7C3AED !important;
          color: #FFFFFF !important;
          border-color: #7C3AED !important;
        }
        @media (max-width: 1024px) {
          .specialties-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 680px) {
          .specialties-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
