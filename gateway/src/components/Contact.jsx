import React, { useState } from "react";
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Calendar,
  Building
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryTopic: "Appointment Booking & Scheduling",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section
      id="contact"
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
            <PhoneCall size={14} />
            <span>COMMUNICATION & HELPDESK</span>
          </div>
          <h2 className="section-title">Hospital Contact & Helpdesk</h2>
          <p className="section-desc">
            Reach out to our centralized front-desk patient reception for appointment assistance, doctor schedules, or general medical inquiries.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: "3rem",
            alignItems: "start"
          }}
          className="contact-grid"
        >
          {/* Left Column: Hospital Contact Details */}
          <div>
            <h3
              style={{
                fontSize: "1.45rem",
                fontWeight: 800,
                color: "#111827",
                marginBottom: "0.75rem"
              }}
            >
              Liora Hospitals — Central Campus
            </h3>
            <p
              style={{
                fontSize: "0.95rem",
                color: "#4B5563",
                lineHeight: 1.6,
                marginBottom: "2rem"
              }}
            >
              Located in Jubilee Hills, Hyderabad, our multidisciplinary facility operates continuous front-desk patient coordination, outpatient consultation suites, and 24/7 emergency care.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginBottom: "2rem" }}>
              {/* Address */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1rem 1.15rem",
                  backgroundColor: "#FAFAFF",
                  borderRadius: "14px",
                  border: "1px solid #E5E7EB"
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    backgroundColor: "#FAF5FF",
                    color: "#7C3AED",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  <MapPin size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" }}>
                    Hospital Address
                  </div>
                  <div style={{ fontWeight: 700, color: "#111827", fontSize: "0.95rem" }}>
                    Road No. 36, Jubilee Hills
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                    Hyderabad, Telangana 500033, India (Opp. Metro Pillar 1642)
                  </div>
                </div>
              </div>

              {/* Phone Helpline */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1rem 1.15rem",
                  backgroundColor: "#FAFAFF",
                  borderRadius: "14px",
                  border: "1px solid #E5E7EB"
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    backgroundColor: "#ECFDF5",
                    color: "#059669",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  <PhoneCall size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" }}>
                    Appointments & Reception Helpline
                  </div>
                  <div style={{ fontWeight: 700, color: "#111827", fontSize: "0.95rem" }}>
                    +91 40 4567 4567 / +91 40 4567 4568
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#059669", fontWeight: 600 }}>
                    Emergency Helpline: 1066 (24/7 Available)
                  </div>
                </div>
              </div>

              {/* Email */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1rem 1.15rem",
                  backgroundColor: "#FAFAFF",
                  borderRadius: "14px",
                  border: "1px solid #E5E7EB"
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    backgroundColor: "#EFF6FF",
                    color: "#2563EB",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  <Mail size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" }}>
                    Patient Support Email
                  </div>
                  <div style={{ fontWeight: 700, color: "#111827", fontSize: "0.95rem" }}>
                    care@liorahospitals.com
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                    General Inquiries: info@liorahospitals.com
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1rem 1.15rem",
                  backgroundColor: "#FAFAFF",
                  borderRadius: "14px",
                  border: "1px solid #E5E7EB"
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "10px",
                    backgroundColor: "#FEF3C7",
                    color: "#D97706",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  <Clock size={20} />
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase" }}>
                    Consultation & Reception Hours
                  </div>
                  <div style={{ fontWeight: 700, color: "#111827", fontSize: "0.95rem" }}>
                    OPD Consultation: Mon – Sat (8:00 AM – 8:00 PM)
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "#6B7280" }}>
                    Emergency Admission & Pharmacy: 24 Hours / 7 Days
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Patient Inquiry Form */}
          <div
            style={{
              backgroundColor: "#FAFAFF",
              border: "1.5px solid #E5E7EB",
              borderRadius: "22px",
              padding: "2.25rem",
              boxShadow: "0 10px 25px -4px rgba(0, 0, 0, 0.04)"
            }}
          >
            <h3
              style={{
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "#111827",
                marginBottom: "0.35rem"
              }}
            >
              Send a Note to Our Front Desk
            </h3>
            <p
              style={{
                fontSize: "0.88rem",
                color: "#6B7280",
                marginBottom: "1.5rem"
              }}
            >
              Have a query regarding specialist availability, medical reports, or visiting instructions? Fill in your details below and our patient care team will get back to you promptly.
            </p>

            {submitted ? (
              <div
                style={{
                  backgroundColor: "#ECFDF5",
                  border: "1.5px solid #A7F3D0",
                  borderRadius: "16px",
                  padding: "2rem",
                  textAlign: "center"
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "#10B981",
                    color: "#FFFFFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem auto"
                  }}
                >
                  <CheckCircle2 size={26} />
                </div>
                <h4 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#065F46", marginBottom: "0.5rem" }}>
                  Inquiry Received!
                </h4>
                <p style={{ fontSize: "0.88rem", color: "#047857", marginBottom: "1.25rem" }}>
                  Thank you, <strong>{formData.name}</strong>. Our front-desk coordinator will review your request regarding <em>{formData.inquiryTopic}</em> and contact you at <strong>{formData.phone || formData.email}</strong>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", phone: "", inquiryTopic: "Appointment Booking & Scheduling", message: "" });
                  }}
                  className="btn-outline-purple"
                  style={{ fontSize: "0.85rem" }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                    Inquiry Topic
                  </label>
                  <select
                    value={formData.inquiryTopic}
                    onChange={(e) => setFormData({ ...formData, inquiryTopic: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Appointment Booking & Scheduling">Appointment Booking & Scheduling</option>
                    <option value="Specialist Doctor Availability">Specialist Doctor Availability</option>
                    <option value="Diagnostic Lab & Imaging Reports">Diagnostic Lab & Imaging Reports</option>
                    <option value="Health Checkup Packages">Health Checkup Packages</option>
                    <option value="Hospital Facilities & Directions">Hospital Facilities & Directions</option>
                    <option value="General Hospital Query">General Patient Inquiry</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.825rem", fontWeight: 700, color: "#374151", marginBottom: "0.35rem" }}>
                    Your Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Please specify your query or assistance requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    padding: "0.85rem",
                    fontSize: "0.95rem"
                  }}
                >
                  <Send size={16} />
                  <span>{isSending ? "Submitting Inquiry..." : "Submit Inquiry to Front Desk"}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </section>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.65rem 0.85rem",
  borderRadius: "10px",
  border: "1.5px solid #E5E7EB",
  backgroundColor: "#FFFFFF",
  fontSize: "0.9rem",
  color: "#111827",
  outline: "none",
  fontFamily: "inherit"
};
