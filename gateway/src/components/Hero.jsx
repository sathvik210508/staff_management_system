import React from "react";
import {
  Calendar,
  ArrowRight,
  ShieldCheck,
  Award,
  Stethoscope,
  HeartPulse,
  Clock,
  Sparkles,
  CheckCircle2,
  PhoneCall
} from "lucide-react";

export default function Hero() {
  const patientUrl = import.meta.env.VITE_PATIENT_PORTAL_URL || "http://localhost:5173";

  const scrollToSpecialties = (e) => {
    e.preventDefault();
    const el = document.getElementById("specialties");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      style={{
        padding: "4.5rem 0 3.5rem 0",
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAF5FF 65%, #FAFAFF 100%)",
        borderBottom: "1px solid #EDE9FE",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Decorative gradient glow */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-100px",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, rgba(124, 58, 237, 0) 70%)",
          pointerEvents: "none"
        }}
      />

      <div className="container">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.15fr 0.85fr",
            gap: "3.5rem",
            alignItems: "center"
          }}
          className="hero-grid"
        >
          {/* Left Column: Headlines & Actions */}
          <div>
            {/* Pill Tag */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 0.95rem",
                backgroundColor: "#F5F3FF",
                border: "1.5px solid #DDD6FE",
                borderRadius: "9999px",
                fontSize: "0.825rem",
                fontWeight: 700,
                color: "#7C3AED",
                marginBottom: "1.5rem"
              }}
            >
              <ShieldCheck size={14} color="#7C3AED" />
              <span>OFFICIAL HOSPITAL GATEWAY & PATIENT CARE</span>
            </div>

            {/* Main Headline */}
            <h1
              style={{
                fontSize: "3.2rem",
                fontWeight: 800,
                lineHeight: 1.15,
                color: "#111827",
                letterSpacing: "-0.03em",
                marginBottom: "1.25rem"
              }}
              className="hero-title"
            >
              Exceptional Care.{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
              >
                Trusted Doctors.
              </span>{" "}
              Better Health.
            </h1>

            {/* Supporting Text */}
            <p
              style={{
                fontSize: "1.18rem",
                lineHeight: 1.65,
                color: "#4B5563",
                marginBottom: "2.25rem",
                maxWidth: "600px"
              }}
            >
              Discover quality healthcare, experienced medical professionals, and convenient appointment booking—all in one place.
            </p>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                flexWrap: "wrap",
                marginBottom: "2.5rem"
              }}
            >
              <a
                href={patientUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
                style={{
                  fontSize: "1.05rem",
                  padding: "0.85rem 1.85rem",
                  textDecoration: "none"
                }}
              >
                <Calendar size={18} />
                <span>Book an Appointment</span>
                <ArrowRight size={17} />
              </a>

              <button
                onClick={scrollToSpecialties}
                className="btn-secondary"
                style={{
                  fontSize: "1.05rem",
                  padding: "0.85rem 1.85rem"
                }}
              >
                <span>Explore Our Specialties</span>
              </button>
            </div>

            {/* Verified Trust Strip */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "1.25rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid #E5E7EB"
              }}
              className="hero-stats-row"
            >
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#7C3AED" }}>12 Specialties</div>
                <div style={{ fontSize: "0.825rem", color: "#6B7280", fontWeight: 600 }}>Multi-Disciplinary Care</div>
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#059669" }}>Direct Booking</div>
                <div style={{ fontSize: "0.825rem", color: "#6B7280", fontWeight: 600 }}>Zero Waiting Queue Triage</div>
              </div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#2563EB" }}>24/7 Support</div>
                <div style={{ fontSize: "0.825rem", color: "#6B7280", fontWeight: 600 }}>Pharmacy & Emergency Care</div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Hospital Welcome Card */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                background: "#FFFFFF",
                border: "1.5px solid #E5E7EB",
                borderRadius: "24px",
                padding: "2rem",
                boxShadow: "0 20px 40px -10px rgba(124, 58, 237, 0.12), 0 4px 12px rgba(0, 0, 0, 0.04)",
                position: "relative"
              }}
            >
              {/* Card Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1.5rem",
                  paddingBottom: "1rem",
                  borderBottom: "1px solid #F3F4F6"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10B981" }} />
                  <span style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827" }}>
                    Patient Outpatient Services
                  </span>
                </div>
                <span className="badge-live">
                  <span className="badge-live-pulse"></span>
                  Slots Available Today
                </span>
              </div>

              {/* Patient Care Pillars */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.95rem 1.15rem",
                    borderRadius: "14px",
                    backgroundColor: "#FAF5FF",
                    border: "1.5px solid #DDD6FE"
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      backgroundColor: "#FFFFFF",
                      color: "#7C3AED",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(124, 58, 237, 0.15)"
                    }}
                  >
                    <Stethoscope size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}>
                      Senior Specialist Consultants
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                      Accredited physicians across 12 clinical faculties
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.95rem 1.15rem",
                    borderRadius: "14px",
                    backgroundColor: "#ECFDF5",
                    border: "1.5px solid #A7F3D0"
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      backgroundColor: "#FFFFFF",
                      color: "#059669",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(5, 150, 105, 0.15)"
                    }}
                  >
                    <Calendar size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}>
                      Convenient Slot Selection
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                      Choose morning or afternoon outpatient consultations
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "0.95rem 1.15rem",
                    borderRadius: "14px",
                    backgroundColor: "#EFF6FF",
                    border: "1.5px solid #BFDBFE"
                  }}
                >
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      backgroundColor: "#FFFFFF",
                      color: "#2563EB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(37, 99, 235, 0.15)"
                    }}
                  >
                    <Clock size={22} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}>
                      Zero Waiting Reception Triage
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                      Automated token allocation upon arrival at the hospital
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Direct CTA */}
              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid #F3F4F6",
                  textAlign: "center"
                }}
              >
                <a
                  href={patientUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "12px",
                    backgroundColor: "#7C3AED",
                    color: "#FFFFFF",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 4px 14px rgba(124, 58, 237, 0.3)",
                    transition: "all 0.2s ease"
                  }}
                  className="hero-card-cta"
                >
                  <span>Start Patient Appointment Booking</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-card-cta:hover {
          background-color: #6D28D9 !important;
          transform: translateY(-2px);
        }
        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .hero-title {
            font-size: 2.4rem !important;
          }
        }
        @media (max-width: 640px) {
          .hero-stats-row {
            grid-template-columns: 1fr !important;
            gap: 0.75rem !important;
          }
          .hero-title {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
