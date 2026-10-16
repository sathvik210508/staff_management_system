import React, { useState, useEffect } from "react";
import {
  Bell,
  Search,
  UserCheck,
  LogOut,
  Hospital,
  Clock,
  ShieldCheck,
  UserPlus,
  Globe
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { notificationApi } from "../api/client.js";

export const Header = ({ onNavigate, onOpenQuickCheckin }) => {
  const { staff, logout } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationApi.getNotifications();
      if (res.success) {
        setUnreadNotifications(res.unreadCount || 0);
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 25000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      style={{
        height: 70,
        backgroundColor: "#FFFFFF",
        borderBottom: "1px solid #E9D5FF",
        padding: "0 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 2px 8px rgba(139, 92, 246, 0.04)"
      }}
    >
      {/* Left: Active Desk & Hospital Live Status */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            backgroundColor: "#FAF5FF",
            padding: "6px 14px",
            borderRadius: 10,
            border: "1px solid #E9D5FF"
          }}
        >
          <Hospital size={17} color="#7C3AED" />
          <span style={{ fontWeight: 800, color: "#4C1D95", fontSize: "0.88rem" }}>
            CENTRAL FRONT DESK
          </span>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: "#10B981",
              boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.2)"
            }}
            title="System Operational"
          />
        </div>

        {/* Live Clock & Date */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            color: "#64748B",
            fontSize: "0.82rem",
            fontWeight: 600
          }}
        >
          <Clock size={15} color="#8B5CF6" />
          <span>
            {currentTime.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <span>•</span>
          <span style={{ color: "#4C1D95", fontWeight: 700 }}>
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>
      </div>

      {/* Right Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {/* Main Hospital Website Gateway Link */}
        <a
          href="http://localhost:5170"
          target="_blank"
          rel="noreferrer"
          title="Open Main Hospital Website Gateway"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 12px",
            borderRadius: 10,
            fontSize: "0.82rem",
            fontWeight: 700,
            color: "#6D28D9",
            backgroundColor: "#FAF5FF",
            border: "1px solid #DDD6FE",
            textDecoration: "none"
          }}
        >
          <Globe size={15} color="#7C3AED" />
          <span>Main Gateway</span>
        </a>

        {/* Quick Check-in Button */}
        {onOpenQuickCheckin && (
          <button
            className="btn btn-primary btn-sm"
            onClick={onOpenQuickCheckin}
            style={{ gap: 6, padding: "7px 14px" }}
          >
            <UserPlus size={16} />
            <span>Fast Check-in</span>
          </button>
        )}

        {/* Notification Bell */}
        <button
          onClick={() => onNavigate("notifications")}
          title="Staff Notifications"
          style={{
            position: "relative",
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: "#FAF5FF",
            border: "1px solid #E9D5FF",
            color: "#7C3AED",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          <Bell size={18} />
          {unreadNotifications > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                backgroundColor: "#EF4444",
                color: "#FFFFFF",
                fontSize: "0.68rem",
                fontWeight: 800,
                width: 18,
                height: 18,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #FFFFFF"
              }}
            >
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </span>
          )}
        </button>

        {/* Staff Identity Pill */}
        <div
          onClick={() => onNavigate("profile")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "5px 12px 5px 6px",
            borderRadius: 12,
            backgroundColor: "#FAF5FF",
            border: "1px solid #E9D5FF",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          <img
            src={staff?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"}
            alt={staff?.name}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              objectFit: "cover",
              border: "1.5px solid #8B5CF6"
            }}
          />
          <div>
            <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "#4C1D95", lineHeight: 1.1 }}>
              {staff?.name || "Staff Member"}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 600 }}>
              {staff?.role || "Front Desk"} • {staff?.desk || "OPD Desk"}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={logout}
          title="Sign Out"
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            backgroundColor: "#FFF1F2",
            border: "1px solid #FECDD3",
            color: "#BE123C",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
};

export default Header;
