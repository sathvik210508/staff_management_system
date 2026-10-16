import React from "react";
import { Award, ShieldCheck, CheckCircle2, BookmarkCheck } from "lucide-react";
import { AWARDS_DATA } from "../data/awards.js";

export default function Awards() {
  return (
    <section
      id="awards"
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
            <Award size={14} />
            <span>ACCREDITATION & STANDARDS</span>
          </div>
          <h2 className="section-title">Awards & Quality Certifications</h2>
          <p className="section-desc">
            Our clinical practices and outpatient workflows adhere strictly to recognized national healthcare protocols and ISO quality standards.
          </p>
        </div>

        {/* 4 Awards Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.75rem"
          }}
          className="awards-grid"
        >
          {AWARDS_DATA.map((award) => (
            <div
              key={award.id}
              style={{
                backgroundColor: "#FAFAFF",
                border: "1.5px solid #F3F4F6",
                borderRadius: "20px",
                padding: "2rem 1.6rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 14px rgba(0, 0, 0, 0.02)",
                transition: "all 0.22s ease"
              }}
              className="award-card"
            >
              <div>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    backgroundColor: "#FAF5FF",
                    color: "#7C3AED",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #DDD6FE",
                    marginBottom: "1.25rem"
                  }}
                >
                  <BookmarkCheck size={24} />
                </div>

                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    color: "#7C3AED",
                    backgroundColor: "#F5F3FF",
                    border: "1px solid #DDD6FE",
                    padding: "0.25rem 0.65rem",
                    borderRadius: "9999px",
                    marginBottom: "0.75rem",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase"
                  }}
                >
                  {award.badge}
                </span>

                <h3
                  style={{
                    fontSize: "1.18rem",
                    fontWeight: 800,
                    color: "#111827",
                    marginBottom: "0.45rem",
                    lineHeight: 1.3
                  }}
                >
                  {award.title}
                </h3>

                <div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#6B7280", marginBottom: "0.85rem" }}>
                  {award.issuer}
                </div>

                <p
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: 1.55,
                    color: "#4B5563"
                  }}
                >
                  {award.description}
                </p>
              </div>

              <div
                style={{
                  marginTop: "1.5rem",
                  paddingTop: "0.85rem",
                  borderTop: "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#059669"
                }}
              >
                <CheckCircle2 size={14} />
                <span>{award.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .award-card:hover {
          border-color: #DDD6FE !important;
          transform: translateY(-3px);
          box-shadow: 0 10px 24px -2px rgba(124, 58, 237, 0.08) !important;
        }
        @media (max-width: 1024px) {
          .awards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .awards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
