import React from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  UserPlus,
  ListOrdered,
  Stethoscope,
  PhoneCall,
  Bell,
  BarChart3,
  History,
  UserCheck,
  Settings,
  LogOut,
  Hospital
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export const Sidebar = ({ activeTab, onSelectTab, badgeCounts = {} }) => {
  const { staff, logout } = useAuth();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, section: "Overview" },

    { id: "appointments", label: "Appointments", icon: CalendarCheck, section: "Front Desk & Queue", badge: badgeCounts.appointments },
    { id: "reception", label: "Patient Reception", icon: UserPlus, section: "Front Desk & Queue" },
    { id: "queue", label: "Waiting Queue", icon: ListOrdered, section: "Front Desk & Queue", badge: badgeCounts.queue, badgeColor: "amber" },

    { id: "doctors", label: "Doctors & Schedules", icon: Stethoscope, section: "Coordination" },
    { id: "calls", label: "Calls & Communication", icon: PhoneCall, section: "Coordination", badge: badgeCounts.callbacks, badgeColor: "primary" },

    { id: "notifications", label: "Notifications", icon: Bell, section: "Hospital Intelligence", badge: badgeCounts.notifications },
    { id: "reports", label: "Reports & Analytics", icon: BarChart3, section: "Hospital Intelligence" },
    { id: "activity", label: "Activity History", icon: History, section: "Hospital Intelligence" },

    { id: "profile", label: "My Profile", icon: UserCheck, section: "Account & Settings" },
    { id: "settings", label: "Settings", icon: Settings, section: "Account & Settings" }
  ];

  const sections = ["Overview", "Front Desk & Queue", "Coordination", "Hospital Intelligence", "Account & Settings"];

  return (
    <aside
      className="app-sidebar"
      style={{
        width: 268,
        backgroundColor: "#FFFFFF",
        borderRight: "1px solid #E9D5FF",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
        flexShrink: 0
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          padding: "18px 22px",
          borderBottom: "1px solid #E9D5FF",
          display: "flex",
          alignItems: "center",
          gap: 12
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "12px",
            backgroundColor: "#FAF5FF",
            border: "1px solid #E9D5FF",
            color: "#7C3AED",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(124, 58, 237, 0.08)"
          }}
        >
          <Hospital size={20} color="#7C3AED" />
        </div>
        <div>
          <div
            style={{
              fontFamily: "var(--font-family)",
              fontSize: "1.12rem",
              fontWeight: 800,
              color: "#5B21B6",
              letterSpacing: "-0.4px",
              lineHeight: 1.2
            }}
          >
            LIORA HOSPITALS
          </div>
          <div
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "#7C3AED",
              textTransform: "uppercase",
              letterSpacing: "0.08em"
            }}
          >
            Staff & Front Desk Portal
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px 14px"
        }}
      >
        {sections.map((section) => {
          const items = navItems.filter((item) => item.section === section);
          if (items.length === 0) return null;

          return (
            <div key={section} style={{ marginBottom: 18 }}>
              <div
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  color: "#A098AE",
                  letterSpacing: "0.06em",
                  padding: "4px 12px 8px"
                }}
              >
                {section}
              </div>

              {items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 12px",
                      borderRadius: 10,
                      border: "none",
                      backgroundColor: isActive ? "#F3E8FF" : "transparent",
                      color: isActive ? "#5B21B6" : "#475569",
                      fontWeight: isActive ? 800 : 600,
                      fontSize: "0.86rem",
                      cursor: "pointer",
                      transition: "all 0.18s ease",
                      marginBottom: 2
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "#FAF5FF";
                        e.currentTarget.style.color = "#7C3AED";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#475569";
                      }
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Icon size={18} color={isActive ? "#7C3AED" : "#64748B"} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        style={{
                          backgroundColor:
                            item.badgeColor === "amber"
                              ? "#FEF3C7"
                              : item.badgeColor === "rose"
                              ? "#FFE4E6"
                              : "#EDE9FE",
                          color:
                            item.badgeColor === "amber"
                              ? "#B45309"
                              : item.badgeColor === "rose"
                              ? "#BE123C"
                              : "#6D28D9",
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          padding: "2px 7px",
                          borderRadius: 8
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Staff Identity Footer */}
      <div
        style={{
          padding: "14px 16px",
          borderTop: "1px solid #E9D5FF",
          backgroundColor: "#FAF5FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              backgroundColor: "#7C3AED",
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "0.85rem"
            }}
          >
            {staff?.name ? staff.name.charAt(0) : "S"}
          </div>
          <div>
            <div style={{ fontSize: "0.83rem", fontWeight: 800, color: "#4C1D95", lineHeight: 1.1 }}>
              {staff?.name || "Staff Reception"}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
              ID: {staff?.staffId || "STAFF101"}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          title="Sign Out"
          style={{
            background: "none",
            border: "none",
            color: "#64748B",
            cursor: "pointer",
            padding: 6,
            borderRadius: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#BE123C";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#64748B";
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
