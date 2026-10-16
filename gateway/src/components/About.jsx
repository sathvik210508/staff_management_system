import React from "react";
import {
  Building2,
  Heart,
  Target,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles
} from "lucide-react";

export default function About() {
  const patientUrl = import.meta.env.VITE_PATIENT_PORTAL_URL || "http://localhost:5173";

  const values = [
    {
      title: "Patient-Centered Care",
      desc: "Putting patient dignity, safety, and comfort at the center of every clinical consultation and treatment pathway.",
      icon: Heart,
      color: "#EC4899",
      bg: "#FDF2F8"
    },
    {
      title: "Clinical Integrity",
      desc: "Delivering evidence-based medical diagnostics and rational therapeutic prescriptions through experienced consultants.",
      icon: ShieldCheck,
      color: "#7C3AED",
      bg: "#FAF5FF"
    },
    {
      title: "Modern Diagnostics",
      desc: "Integrating digital laboratories, automated imaging, and synchronized health records for reliable diagnostic accuracy.",
      icon: Target,
      color: "#059669",
      bg: "#ECFDF5"
    },
    {
      title: "Zero-Wait Coordination",
      desc: "Streamlining outpatient registration and queue token management to eliminate chaotic waiting room delays.",
      icon: Eye,
      color: "#2563EB",
      bg: "#EFF6FF"
    }
  ];

  return (
    <section
      id="about"
      className="section"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB"
      }}
    >
      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: "3.5rem",
            alignItems: "center"
          }}
          className="about-grid"
        >
          {/* Left Column: Hospital Overview & Mission */}
          <div>
            <div className="section-tag">
              <Building2 size={14} />
              <span>ABOUT LIORA HOSPITALS</span>
            </div>

            <h2
              style={{
                fontSize: "2.35rem",
                fontWeight: 800,
                color: "#111827",
                letterSpacing: "-0.025em",
                lineHeight: 1.25,
                marginBottom: "1.25rem"
              }}
            >
              Excellence in Healthcare, Compassion in Every Care Journey
            </h2>

            <p
              style={{
                fontSize: "1.05rem",
                lineHeight: 1.7,
                color: "#4B5563",
                marginBottom: "1.25rem"
              }}
            >
              LIORA HOSPITALS is a dedicated multidisciplinary healthcare facility committed to delivering world-class outpatient consultations, precision diagnostics, and compassionate clinical care. Founded on the principle that modern medicine should be transparent, accessible, and coordinated, we serve individuals and families across all stages of health.
            </p>

            <p
              style={{
                fontSize: "0.95rem",
                lineHeight: 1.65,
                color: "#6B7280",
                marginBottom: "2rem"
              }}
            >
              Our healthcare philosophy emphasizes personalized attention, preventive screenings, and clear communication between patients and their physicians. Through digital appointment booking, integrated diagnostic labs, and 12 clinical specialties, we ensure that every visitor receives timely and attentive medical attention.
            </p>

            {/* Mission & Vision Strip */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.25rem",
                marginBottom: "2rem"
              }}
              className="mission-vision-grid"
            >
              <div
                style={{
                  padding: "1.25rem",
                  borderRadius: "14px",
                  backgroundColor: "#FAF5FF",
                  border: "1.5px solid #DDD6FE"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <Target size={18} color="#7C3AED" />
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#5B21B6" }}>Our Mission</h3>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#4B5563", lineHeight: 1.55 }}>
                  To provide accessible, high-standard outpatient healthcare through accredited specialists, modern diagnostics, and respectful patient support.
                </p>
              </div>

              <div
                style={{
                  padding: "1.25rem",
                  borderRadius: "14px",
                  backgroundColor: "#ECFDF5",
                  border: "1.5px solid #A7F3D0"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <Eye size={18} color="#059669" />
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#065F46" }}>Our Vision</h3>
                </div>
                <p style={{ fontSize: "0.85rem", color: "#4B5563", lineHeight: 1.55 }}>
                  To be the trusted healthcare destination recognized for clinical safety, patient transparency, and innovative digital appointment workflows.
                </p>
              </div>
            </div>

            {/* Direct Booking Link */}
            <div>
              <a
                href={patientUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{ textDecoration: "none" }}
              >
                <Calendar size={16} />
                <span>Book a Consultation with Us</span>
              </a>
            </div>
          </div>

          {/* Right Column: 4 Core Healthcare Pillars */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.25rem"
            }}
            className="pillars-grid"
          >
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: "#FAFAFF",
                    border: "1.5px solid #F3F4F6",
                    borderRadius: "18px",
                    padding: "1.75rem 1.4rem",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
                    transition: "all 0.22s ease"
                  }}
                  className="about-pillar-card"
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      backgroundColor: val.bg,
                      color: val.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem"
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h4
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: "0.45rem"
                    }}
                  >
                    {val.title}
                  </h4>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "#6B7280",
                      lineHeight: 1.55
                    }}
                  >
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .about-pillar-card:hover {
          border-color: #DDD6FE !important;
          transform: translateY(-3px);
          box-shadow: 0 10px 20px -3px rgba(124, 58, 237, 0.08) !important;
        }
        @media (max-width: 960px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
        @media (max-width: 580px) {
          .mission-vision-grid, .pillars-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
