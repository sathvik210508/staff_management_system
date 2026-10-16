import React from "react";
import { Calendar, ArrowRight, PhoneCall, ShieldCheck, Clock } from "lucide-react";

export default function BookingCtaBanner() {
  const patientUrl = import.meta.env.VITE_PATIENT_PORTAL_URL || "http://localhost:5173";

  return (
    <section
      style={{
        padding: "4.5rem 0",
        background: "linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #4C1D95 100%)",
        color: "#FFFFFF",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background shapes */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          pointerEvents: "none"
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-60px",
          left: "-60px",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          backgroundColor: "rgba(255, 255, 255, 0.04)",
          pointerEvents: "none"
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "860px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.35rem 0.95rem",
            borderRadius: "9999px",
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(6px)",
            fontSize: "0.825rem",
            fontWeight: 700,
            color: "#EDE9FE",
            marginBottom: "1.25rem",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}
        >
          <ShieldCheck size={14} color="#A7F3D0" />
          <span>EASY DIGITAL OUTPATIENT BOOKING</span>
        </div>

        <h2
          style={{
            fontSize: "2.6rem",
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: "-0.025em",
            marginBottom: "1.25rem",
            color: "#FFFFFF"
          }}
          className="cta-title"
        >
          Ready to Consult with Our Specialist Doctors?
        </h2>

        <p
          style={{
            fontSize: "1.15rem",
            lineHeight: 1.65,
            color: "#EDE9FE",
            marginBottom: "2.25rem",
            maxWidth: "680px",
            margin: "0 auto 2.25rem auto"
          }}
        >
          Reserve your in-person consultation slot across 12 clinical specialties in minutes. Instant booking confirmation, zero registration fee, and transparent queue arrival.
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.25rem",
            flexWrap: "wrap",
            marginBottom: "2rem"
          }}
        >
          <a
            href={patientUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.95rem 2.25rem",
              borderRadius: "14px",
              backgroundColor: "#FFFFFF",
              color: "#5B21B6",
              fontSize: "1.05rem",
              fontWeight: 800,
              textDecoration: "none",
              boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.25)",
              transition: "all 0.2s ease"
            }}
            className="cta-book-button"
          >
            <Calendar size={18} color="#7C3AED" />
            <span>Book an Appointment Now</span>
            <ArrowRight size={17} color="#7C3AED" />
          </a>

          <a
            href="tel:+914045674567"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              padding: "0.95rem 1.85rem",
              borderRadius: "14px",
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              color: "#FFFFFF",
              fontSize: "1rem",
              fontWeight: 700,
              textDecoration: "none",
              border: "1.5px solid rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(6px)"
            }}
          >
            <PhoneCall size={17} color="#FBBF24" />
            <span>Call Helpline: +91 40 4567 4567</span>
          </a>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.75rem",
            fontSize: "0.85rem",
            color: "#DDD6FE",
            flexWrap: "wrap"
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <Clock size={14} color="#A7F3D0" /> OPD Hours: 8:00 AM – 8:00 PM
          </span>
          <span>•</span>
          <span>No Credit Card Required</span>
          <span>•</span>
          <span>Instant Confirmation</span>
        </div>
      </div>

      <style>{`
        .cta-book-button:hover {
          transform: translateY(-2px);
          background-color: #F5F3FF !important;
          box-shadow: 0 14px 30px -4px rgba(0, 0, 0, 0.3) !important;
        }
        @media (max-width: 640px) {
          .cta-title {
            font-size: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}
