import React from "react";
import {
  MapPin,
  PhoneCall,
  Mail,
  Clock,
  Navigation,
  Calendar,
  ExternalLink,
  Building2
} from "lucide-react";
import { LOCATIONS_DATA } from "../data/locations.js";

export default function Locations() {
  const patientUrl = import.meta.env.VITE_PATIENT_PORTAL_URL || "http://localhost:5173";

  return (
    <section
      id="locations"
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
            <MapPin size={14} />
            <span>CAMPUS NETWORK</span>
          </div>
          <h2 className="section-title">Hospital Locations & Clinics</h2>
          <p className="section-desc">
            Visit our state-of-the-art medical campuses situated in key healthcare corridors across Hyderabad with convenient metro access and parking facilities.
          </p>
        </div>

        {/* Locations Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2.25rem"
          }}
          className="locations-grid"
        >
          {LOCATIONS_DATA.map((loc) => (
            <div
              key={loc.id}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1.5px solid #F3F4F6",
                borderRadius: "22px",
                padding: "2.25rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                boxShadow: "0 4px 18px rgba(0, 0, 0, 0.03)",
                transition: "all 0.22s ease"
              }}
              className="location-card"
            >
              <div>
                {/* Header Tag & Title */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "1rem"
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 800,
                      color: "#7C3AED",
                      backgroundColor: "#F5F3FF",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "9999px",
                      border: "1px solid #DDD6FE"
                    }}
                  >
                    {loc.tag}
                  </span>
                  <span style={{ fontSize: "0.8rem", color: "#059669", fontWeight: 700 }}>
                    ● Open for Consultations
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: "1.38rem",
                    fontWeight: 800,
                    color: "#111827",
                    marginBottom: "0.6rem"
                  }}
                >
                  {loc.name}
                </h3>

                {/* Address & Landmark */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", marginBottom: "1.25rem" }}>
                  <MapPin size={18} color="#7C3AED" style={{ flexShrink: 0, marginTop: "3px" }} />
                  <div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1F2937" }}>
                      {loc.address}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#4B5563" }}>
                      {loc.city}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#6B7280", marginTop: "2px" }}>
                      Landmark: {loc.landmark}
                    </div>
                  </div>
                </div>

                {/* Details List */}
                <div
                  style={{
                    backgroundColor: "#F9FAFB",
                    borderRadius: "14px",
                    padding: "1rem 1.15rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.65rem",
                    marginBottom: "1.5rem",
                    border: "1px solid #F3F4F6",
                    fontSize: "0.85rem"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <PhoneCall size={15} color="#7C3AED" />
                    <span>Reception & Helpline: <strong>{loc.phone}</strong></span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <Clock size={15} color="#D97706" />
                    <span>{loc.hours}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                    <Building2 size={15} color="#2563EB" />
                    <span>{loc.facilities}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.85rem",
                  flexWrap: "wrap"
                }}
              >
                <a
                  href={patientUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    flex: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.25rem",
                    borderRadius: "12px",
                    backgroundColor: "#7C3AED",
                    color: "#FFFFFF",
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)"
                  }}
                  className="loc-book-btn"
                >
                  <Calendar size={15} />
                  <span>Book at this Campus</span>
                </a>

                <a
                  href={loc.directionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45rem",
                    padding: "0.75rem 1.1rem",
                    borderRadius: "12px",
                    backgroundColor: "#FFFFFF",
                    color: "#374151",
                    border: "1.5px solid #E5E7EB",
                    fontSize: "0.88rem",
                    fontWeight: 600,
                    textDecoration: "none"
                  }}
                  className="loc-dir-btn"
                >
                  <Navigation size={15} color="#7C3AED" />
                  <span>Get Directions</span>
                  <ExternalLink size={13} color="#9CA3AF" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .location-card:hover {
          border-color: #DDD6FE !important;
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -4px rgba(124, 58, 237, 0.1) !important;
        }
        .loc-book-btn:hover {
          background-color: #6D28D9 !important;
        }
        .loc-dir-btn:hover {
          border-color: #7C3AED !important;
          color: #7C3AED !important;
        }
        @media (max-width: 900px) {
          .locations-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
