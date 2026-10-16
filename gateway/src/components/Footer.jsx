import React from "react";
import {
  Calendar,
  ShieldCheck,
  MapPin,
  PhoneCall,
  Mail,
  ChevronUp,
  ArrowRight,
  HeartHandshake
} from "lucide-react";

export default function Footer({ onOpenTerms, onOpenPrivacy }) {
  const patientUrl = import.meta.env.VITE_PATIENT_PORTAL_URL || "http://localhost:5173";

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      style={{
        backgroundColor: "#111827",
        color: "#E5E7EB",
        padding: "4.5rem 0 2rem 0",
        borderTop: "3px solid #7C3AED"
      }}
    >
      <div className="container">
        {/* Main Footer Columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1.1fr 1.2fr",
            gap: "2.5rem",
            marginBottom: "3.5rem"
          }}
          className="footer-grid"
        >
          {/* Col 1: Brand & Hospital Overview */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF"
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                  <path d="M12 5v6"/>
                  <path d="M9 8h6"/>
                </svg>
              </div>
              <div>
                <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>LIORA </span>
                <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#A78BFA" }}>HOSPITALS</span>
                <p style={{ fontSize: "0.7rem", color: "#9CA3AF", letterSpacing: "0.04em" }}>CENTER OF MEDICAL EXCELLENCE</p>
              </div>
            </div>

            <p style={{ fontSize: "0.88rem", lineHeight: 1.65, color: "#9CA3AF", marginBottom: "1.5rem" }}>
              A multidisciplinary hospital offering accredited outpatient consultations across 12 clinical faculties, 24/7 in-house pharmacy, modern diagnostic imaging, and seamless appointment booking.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.825rem", color: "#A7F3D0" }}>
              <ShieldCheck size={16} />
              <span>NABH Standards & ISO 9001:2015 Compliant</span>
            </div>
          </div>

          {/* Col 2: Hospital Navigation */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.88rem" }}>
              <li><a href="#home" className="footer-link">Home</a></li>
              <li><a href="#about" className="footer-link">About Us</a></li>
              <li><a href="#specialties" className="footer-link">Specialties</a></li>
              <li><a href="#doctors" className="footer-link">Our Doctors</a></li>
              <li><a href="#facilities" className="footer-link">Hospital Facilities</a></li>
              <li><a href="#awards" className="footer-link">Awards & Recognition</a></li>
              <li><a href="#locations" className="footer-link">Campus Locations</a></li>
              <li><a href="#faqs" className="footer-link">Patient FAQs</a></li>
              <li><a href="#contact" className="footer-link">Contact Us</a></li>
            </ul>
          </div>

          {/* Col 3: Key Specialties */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>
              Top Specialties
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.88rem", color: "#D1D5DB" }}>
              <li><a href="#specialties" className="footer-link">Cardiology & Vascular</a></li>
              <li><a href="#specialties" className="footer-link">Orthopedics & Joint Care</a></li>
              <li><a href="#specialties" className="footer-link">Neurology & Neurosciences</a></li>
              <li><a href="#specialties" className="footer-link">Obstetrics & Gynecology</a></li>
              <li><a href="#specialties" className="footer-link">Dermatology & Laser</a></li>
              <li><a href="#specialties" className="footer-link">General Medicine</a></li>
              <li><a href="#specialties" className="footer-link">Pediatrics & Neonatal</a></li>
              <li><a href="#specialties" className="footer-link">Medical Oncology</a></li>
            </ul>
          </div>

          {/* Col 4: Emergency & Patient Booking Action */}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "1.25rem" }}>
              Emergency & Reception
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.85rem", color: "#9CA3AF", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                <MapPin size={16} color="#A78BFA" style={{ flexShrink: 0, marginTop: "2px" }} />
                <span>Road No. 36, Jubilee Hills, Hyderabad 500033</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <PhoneCall size={16} color="#FBBF24" style={{ flexShrink: 0 }} />
                <span style={{ color: "#F3F4F6", fontWeight: 600 }}>Helpline: +91 40 4567 4567</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Mail size={16} color="#60A5FA" style={{ flexShrink: 0 }} />
                <span>care@liorahospitals.com</span>
              </div>
            </div>

            {/* Direct Book Appointment CTA */}
            <a
              href={patientUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                backgroundColor: "#7C3AED",
                color: "#FFFFFF",
                fontSize: "0.88rem",
                fontWeight: 700,
                textDecoration: "none"
              }}
              className="footer-book-btn"
            >
              <Calendar size={15} />
              <span>Book an Appointment</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Bottom Bar: Legal, Privacy & Back To Top */}
        <div
          style={{
            paddingTop: "1.75rem",
            borderTop: "1px solid #374151",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "1rem",
            fontSize: "0.825rem",
            color: "#9CA3AF"
          }}
        >
          <div>
            © 2026 LIORA HOSPITALS. All rights reserved. Official Hospital Website.
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <button
              onClick={onOpenPrivacy}
              style={{ color: "#9CA3AF", fontSize: "0.825rem", background: "none", border: "none", cursor: "pointer" }}
              className="footer-link"
            >
              Patient Privacy Policy
            </button>
            <button
              onClick={onOpenTerms}
              style={{ color: "#9CA3AF", fontSize: "0.825rem", background: "none", border: "none", cursor: "pointer" }}
              className="footer-link"
            >
              Terms of Care
            </button>
            <button
              onClick={scrollToTop}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                color: "#A78BFA",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              <span>Back to Top</span>
              <ChevronUp size={15} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .footer-link:hover {
          color: #A78BFA !important;
          text-decoration: underline;
        }
        .footer-book-btn:hover {
          background-color: #6D28D9 !important;
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 580px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
