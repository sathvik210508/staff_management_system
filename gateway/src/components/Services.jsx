import React from "react";
import {
  CalendarCheck,
  Stethoscope,
  UserPlus,
  Clock,
  PhoneCall,
  Layers,
  ArrowRight,
  CheckCircle2,
  Activity
} from "lucide-react";
import { SERVICES_DATA } from "../data/services.js";

const iconMap = {
  CalendarCheck,
  Stethoscope,
  UserPlus,
  Clock,
  PhoneCall,
  Layers
};

export default function Services() {
  return (
    <section
      id="services"
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
            <Activity size={14} />
            <span>OPERATIONAL CAPABILITIES</span>
          </div>
          <h2 className="section-title">Services & Healthcare Solutions</h2>
          <p className="section-desc">
            Explore the core clinical and front-office services supported directly by our unified hospital management system.
          </p>
        </div>

        {/* Services Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "2rem"
          }}
          className="services-grid"
        >
          {SERVICES_DATA.map((service) => {
            const Icon = iconMap[service.icon] || Activity;

            return (
              <div
                key={service.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1.5px solid #F3F4F6",
                  borderRadius: "18px",
                  padding: "2rem 1.75rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.03)",
                  transition: "all 0.22s ease"
                }}
                className="service-card"
              >
                <div>
                  {/* Category and Icon */}
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
                        width: "48px",
                        height: "48px",
                        borderRadius: "14px",
                        backgroundColor: "#FAF5FF",
                        color: "#7C3AED",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid #DDD6FE"
                      }}
                    >
                      <Icon size={24} />
                    </div>

                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "#6B7280",
                        backgroundColor: "#F3F4F6",
                        padding: "0.25rem 0.65rem",
                        borderRadius: "9999px"
                      }}
                    >
                      {service.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "#111827",
                      marginBottom: "0.6rem"
                    }}
                  >
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      color: "#4B5563",
                      marginBottom: "1.25rem"
                    }}
                  >
                    {service.description}
                  </p>

                  {/* Feature checklist */}
                  <ul
                    style={{
                      listStyle: "none",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.45rem",
                      marginBottom: "1.5rem"
                    }}
                  >
                    {service.features.map((feat, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.45rem",
                          fontSize: "0.825rem",
                          color: "#374151"
                        }}
                      >
                        <CheckCircle2 size={14} color="#7C3AED" style={{ flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom link to associated portal */}
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
                    Powered via {service.portal}
                  </span>
                  <a
                    href={service.portalUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                      fontSize: "0.825rem",
                      fontWeight: 700,
                      color: "#7C3AED"
                    }}
                  >
                    <span>Launch</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .service-card:hover {
          border-color: #DDD6FE !important;
          box-shadow: 0 12px 24px -4px rgba(124, 58, 237, 0.1) !important;
          transform: translateY(-3px);
        }
        @media (max-width: 1024px) {
          .services-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 680px) {
          .services-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
