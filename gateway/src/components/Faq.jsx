import React, { useState } from "react";
import { HelpCircle, ChevronDown, MessageSquare, PhoneCall, Calendar } from "lucide-react";
import { FAQS_DATA } from "../data/faqs.js";

export default function Faq() {
  const [openId, setOpenId] = useState("faq-1");
  const patientUrl = import.meta.env.VITE_PATIENT_PORTAL_URL || "http://localhost:5173";

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="faqs"
      className="section"
      style={{
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E5E7EB"
      }}
    >
      <div className="container" style={{ maxWidth: "980px" }}>
        {/* Header */}
        <div className="section-header-center">
          <div className="section-tag">
            <HelpCircle size={14} />
            <span>PATIENT ASSISTANCE</span>
          </div>
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-desc">
            Find prompt answers about appointment booking, patient registration, visit confirmations, and hospital consultation procedures.
          </p>
        </div>

        {/* Expandable Accordion */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
          {FAQS_DATA.map((faq) => {
            const isOpen = openId === faq.id;

            return (
              <div
                key={faq.id}
                style={{
                  border: `1.5px solid ${isOpen ? "#DDD6FE" : "#F3F4F6"}`,
                  borderRadius: "16px",
                  backgroundColor: isOpen ? "#FAF5FF" : "#FFFFFF",
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  boxShadow: isOpen ? "0 4px 14px rgba(124, 58, 237, 0.06)" : "none"
                }}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1.25rem 1.5rem",
                    textAlign: "left",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    gap: "1rem"
                  }}
                  aria-expanded={isOpen}
                >
                  <span
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: isOpen ? "#5B21B6" : "#111827"
                    }}
                  >
                    {faq.question}
                  </span>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: isOpen ? "#7C3AED" : "#F3F4F6",
                      color: isOpen ? "#FFFFFF" : "#6B7280",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <ChevronDown size={16} />
                  </div>
                </button>

                {isOpen && (
                  <div
                    style={{
                      padding: "0 1.5rem 1.4rem 1.5rem",
                      fontSize: "0.925rem",
                      lineHeight: 1.65,
                      color: "#4B5563",
                      borderTop: "1px solid rgba(221, 214, 254, 0.4)"
                    }}
                  >
                    <div style={{ paddingTop: "0.75rem" }}>
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Strip if question is not answered */}
        <div
          style={{
            backgroundColor: "#F9FAFB",
            border: "1.5px solid #E5E7EB",
            borderRadius: "18px",
            padding: "1.75rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1.25rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#FAF5FF",
                color: "#7C3AED",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #DDD6FE"
              }}
            >
              <MessageSquare size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#111827", marginBottom: "0.2rem" }}>
                Have a different question?
              </h4>
              <p style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                Our reception coordination desk is available 24/7 to assist with your medical queries.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <a
              href="#contact"
              className="btn-secondary"
              style={{ padding: "0.6rem 1.25rem", fontSize: "0.88rem" }}
            >
              <PhoneCall size={15} />
              <span>Contact Desk</span>
            </a>

            <a
              href={patientUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
              style={{ padding: "0.6rem 1.25rem", fontSize: "0.88rem", textDecoration: "none" }}
            >
              <Calendar size={15} />
              <span>Book Appointment</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
