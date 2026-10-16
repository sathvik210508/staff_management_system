import React from "react";
import { ShieldCheck, Lock, CheckCircle2, HeartHandshake, FileCheck, Stethoscope } from "lucide-react";

export default function PatientTrust() {
  const guarantees = [
    {
      title: "Confidential Health Records",
      desc: "Your personal information and medical consultation summaries remain strictly private, secured by role-based clinical permissions.",
      icon: Lock,
      color: "#7C3AED"
    },
    {
      title: "Direct Specialist Access",
      desc: "Connect directly with certified consultants across 12 clinical specialties without intermediaries or delayed approvals.",
      icon: Stethoscope,
      color: "#059669"
    },
    {
      title: "Transparent Appointment Status",
      desc: "Real-time updates from scheduled to checked-in, complete with automated queue token tracking on arrival.",
      icon: FileCheck,
      color: "#2563EB"
    },
    {
      title: "Continuous Patient Support",
      desc: "24/7 dedicated telephone assistance, round-the-clock emergency desk, and prompt appointment guidance.",
      icon: HeartHandshake,
      color: "#D97706"
    }
  ];

  return (
    <section
      className="section"
      style={{
        backgroundColor: "#FAF5FF",
        borderBottom: "1px solid #EDE9FE"
      }}
    >
      <div className="container">
        <div className="section-header-center" style={{ marginBottom: "2.75rem" }}>
          <div className="section-tag">
            <ShieldCheck size={14} />
            <span>PATIENT TRUST & STANDARDS</span>
          </div>
          <h2 className="section-title">Our Commitment to Patient Care</h2>
          <p className="section-desc">
            We hold ourselves to rigorous clinical, operational, and ethical standards to ensure your healthcare experience is dependable, respectful, and safe.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1.5rem"
          }}
          className="trust-grid"
        >
          {guarantees.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid #DDD6FE",
                  borderRadius: "18px",
                  padding: "1.75rem 1.4rem",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 4px 14px rgba(124, 58, 237, 0.04)"
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "12px",
                    backgroundColor: "#FAF5FF",
                    color: item.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #DDD6FE",
                    marginBottom: "1rem"
                  }}
                >
                  <Icon size={22} />
                </div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111827", marginBottom: "0.45rem" }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: "0.85rem", color: "#6B7280", lineHeight: 1.55 }}>
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .trust-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          .trust-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
