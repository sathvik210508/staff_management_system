import React from "react";
import { X, Shield, FileText, CheckCircle2 } from "lucide-react";

export default function TermsPrivacyModal({ type, isOpen, onClose }) {
  if (!isOpen) return null;

  const isPrivacy = type === "privacy";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "rgba(17, 24, 39, 0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem"
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "85vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          position: "relative"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "1.5rem 2rem",
            borderBottom: "1px solid #E5E7EB",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                backgroundColor: "#FAF5FF",
                color: "#7C3AED",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              {isPrivacy ? <Shield size={20} /> : <FileText size={20} />}
            </div>
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#111827" }}>
                {isPrivacy ? "Patient Data Privacy Policy" : "Hospital Terms of Service"}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "#6B7280" }}>
                LIORA HOSPITALS — Clinical Operations & Data Governance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "#F3F4F6",
              color: "#6B7280",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div
          style={{
            padding: "1.75rem 2rem",
            overflowY: "auto",
            fontSize: "0.9rem",
            color: "#4B5563",
            lineHeight: 1.65
          }}
        >
          {isPrivacy ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <h4 style={{ fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>1. Commitment to Health Data Security</h4>
                <p>LIORA HOSPITALS is dedicated to maintaining the absolute confidentiality of every patient’s electronic medical records, appointment schedules, and diagnostic notes.</p>
              </div>

              <div>
                <h4 style={{ fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>2. Role-Based Access Isolation</h4>
                <p>Only verified attending physicians and authorized front-desk coordinators may view relevant patient appointment records. Data transmission between portals is encrypted and validated.</p>
              </div>

              <div>
                <h4 style={{ fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>3. Data Retention and Sync Integrity</h4>
                <p>All clinical records and consultation logs are stored securely in compliance with healthcare data management guidelines. Patients have the right to request access to their outpatient consultation histories.</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <h4 style={{ fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>1. Outpatient Consultations & Appointments</h4>
                <p>Appointment booking through the Patient Portal reserves a consultation slot with the designated specialist. Patients are requested to report to the front desk at least 15 minutes before their scheduled time.</p>
              </div>

              <div>
                <h4 style={{ fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>2. Queue Management and Triage Policy</h4>
                <p>Upon check-in, reception staff assign numbered queue tokens (e.g., Q-01). While appointment slots are adhered to closely, urgent clinical emergencies may take medical precedence.</p>
              </div>

              <div>
                <h4 style={{ fontWeight: 700, color: "#111827", marginBottom: "0.35rem" }}>3. Data Privacy and Access Authorization</h4>
                <p>Medical records and outpatient consultation details are safeguarded. Access to hospital systems requires verified identity, and tampering with clinical data is strictly prohibited.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "1.25rem 2rem",
            borderTop: "1px solid #E5E7EB",
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ fontSize: "0.9rem", padding: "0.55rem 1.4rem" }}
          >
            I Understand & Close
          </button>
        </div>
      </div>
    </div>
  );
}
