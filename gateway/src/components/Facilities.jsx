import React from "react";
import {
  FlaskConical,
  Scan,
  Pill,
  Scissors,
  HeartHandshake,
  Building,
  ShieldCheck,
  CheckCircle2,
  Calendar
} from "lucide-react";
import { FACILITIES_DATA } from "../data/facilities.js";

const iconMap = {
  FlaskConical,
  Scan,
  Pill,
  Scissors,
  HeartHandshake,
  Building
};

export default function Facilities() {
  const patientUrl = import.meta.env.VITE_PATIENT_PORTAL_URL || "http://localhost:5173";

  return (
    <section
      id="facilities"
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
            <Building size={14} />
            <span>INFRASTRUCTURE & MEDICAL TECHNOLOGY</span>
          </div>
          <h2 className="section-title">World-Class Hospital Facilities</h2>
          <p className="section-desc">
            Equipped with modern clinical technology, sterile surgical corridors, round-the-clock diagnostic laboratories, and dedicated patient lounges.
          </p>
        </div>

        {/* 6 Facilities Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2rem"
          }}
          className="facilities-grid"
        >
          {FACILITIES_DATA.map((fac) => {
            const Icon = iconMap[fac.icon] || Building;

            return (
              <div
                key={fac.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid #F3F4F6",
                  borderRadius: "20px",
                  padding: "2rem 1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.03)",
                  transition: "all 0.22s ease"
                }}
                className="facility-card"
              >
                <div>
                  {/* Top Bar: Icon and Category */}
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
                      {fac.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: "1.22rem",
                      fontWeight: 800,
                      color: "#111827",
                      marginBottom: "0.6rem",
                      lineHeight: 1.3
                    }}
                  >
                    {fac.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "0.88rem",
                      lineHeight: 1.6,
                      color: "#4B5563",
                      marginBottom: "1.5rem"
                    }}
                  >
                    {fac.description}
                  </p>

                  {/* Specs List */}
                  <ul
                    style={{
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.45rem",
                      marginBottom: "1.5rem"
                    }}
                  >
                    {fac.specs.map((spec, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          fontSize: "0.825rem",
                          color: "#374151"
                        }}
                      >
                        <CheckCircle2 size={14} color="#7C3AED" style={{ flexShrink: 0 }} />
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Strip */}
                <div
                  style={{
                    paddingTop: "1rem",
                    borderTop: "1px solid #F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <span style={{ fontSize: "0.78rem", color: "#6B7280", fontWeight: 600 }}>
                    Main Campus • Jubilee Hills
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#059669", fontWeight: 700 }}>
                    Operational 24/7
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .facility-card:hover {
          border-color: #DDD6FE !important;
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -4px rgba(124, 58, 237, 0.1) !important;
        }
        @media (max-width: 1024px) {
          .facilities-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 680px) {
          .facilities-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
