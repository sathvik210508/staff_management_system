import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  PhoneCall,
  Calendar,
  Clock,
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const patientUrl = import.meta.env.VITE_PATIENT_PORTAL_URL || "http://localhost:5173";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.96)" : "#FFFFFF",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        borderBottom: `1px solid ${isScrolled ? "#E5E7EB" : "#F3F4F6"}`,
        boxShadow: isScrolled ? "0 4px 20px -2px rgba(0, 0, 0, 0.05)" : "none",
        transition: "all 0.22s ease"
      }}
    >
      {/* Top Patient Information & Emergency Bar */}
      <div
        style={{
          backgroundColor: "#5B21B6",
          color: "#EDE9FE",
          fontSize: "0.825rem",
          padding: "0.4rem 1.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "0.5rem"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <ShieldCheck size={15} color="#A7F3D0" />
          <span>Official Hospital Website — Welcome to LIORA HOSPITALS</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", fontSize: "0.8rem" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <PhoneCall size={13} color="#FBBF24" />
            24/7 Helpline: <strong>+91 40 4567 4567</strong>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <Clock size={13} color="#A7F3D0" />
            OPD Hours: 8:00 AM – 8:00 PM
          </span>
        </div>
      </div>

      <div className="container" style={{ padding: "0.85rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Hospital Logo & Brand */}
          <a
            href="#home"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              textDecoration: "none"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                boxShadow: "0 4px 12px rgba(124, 58, 237, 0.3)"
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
                <path d="M12 5v6"/>
                <path d="M9 8h6"/>
              </svg>
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.02em", color: "#111827" }}>
                  LIORA
                </span>
                <span style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#7C3AED" }}>
                  HOSPITALS
                </span>
              </div>
              <p style={{ fontSize: "0.7rem", color: "#6B7280", fontWeight: 600, letterSpacing: "0.03em" }}>
                CENTER OF MEDICAL EXCELLENCE
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.6rem"
            }}
            className="desktop-nav"
          >
            <a href="#home" style={navLinkStyle}>Home</a>
            <a href="#about" style={navLinkStyle}>About Us</a>
            <a href="#specialties" style={navLinkStyle}>Specialties</a>
            <a href="#doctors" style={navLinkStyle}>Our Doctors</a>
            <a href="#facilities" style={navLinkStyle}>Facilities</a>
            <a href="#awards" style={navLinkStyle}>Awards</a>
            <a href="#locations" style={navLinkStyle}>Locations</a>
            <a href="#faqs" style={navLinkStyle}>FAQs</a>
            <a href="#contact" style={navLinkStyle}>Contact</a>
          </nav>

          {/* Desktop Primary Action: Book an Appointment */}
          <div className="desktop-actions">
            <a
              href={patientUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.55rem",
                padding: "0.65rem 1.4rem",
                borderRadius: "10px",
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "#FFFFFF",
                background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
                boxShadow: "0 4px 14px rgba(124, 58, 237, 0.28)",
                transition: "all 0.2s ease",
                textDecoration: "none"
              }}
              className="book-btn"
            >
              <Calendar size={16} />
              <span>Book an Appointment</span>
            </a>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "none",
              padding: "0.5rem",
              borderRadius: "8px",
              color: "#374151"
            }}
            className="mobile-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              paddingTop: "1.25rem",
              paddingBottom: "1rem",
              borderTop: "1px solid #F3F4F6",
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.85rem"
            }}
          >
            <a href="#home" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Home</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>About Us</a>
            <a href="#specialties" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Specialties</a>
            <a href="#doctors" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Our Doctors</a>
            <a href="#facilities" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Facilities</a>
            <a href="#awards" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Awards & Recognition</a>
            <a href="#locations" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Hospital Locations</a>
            <a href="#faqs" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Frequently Asked Questions</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Contact Us</a>

            <div style={{ marginTop: "0.75rem" }}>
              <a
                href={patientUrl}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.6rem",
                  padding: "0.85rem 1rem",
                  borderRadius: "10px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  backgroundColor: "#7C3AED",
                  textDecoration: "none"
                }}
              >
                <Calendar size={18} />
                <span>Book an Appointment</span>
              </a>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .book-btn:hover {
          background: linear-gradient(135deg, #6D28D9 0%, #5B21B6 100%) !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(124, 58, 237, 0.38) !important;
        }
        @media (max-width: 980px) {
          .desktop-nav, .desktop-actions {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </header>
  );
}

const navLinkStyle = {
  fontSize: "0.9rem",
  fontWeight: 600,
  color: "#4B5563",
  transition: "color 0.2s ease"
};

const mobileLinkStyle = {
  fontSize: "1rem",
  fontWeight: 600,
  color: "#1F2937",
  padding: "0.35rem 0"
};
