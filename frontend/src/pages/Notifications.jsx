import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PhoneCall,
  CalendarCheck,
  RefreshCw,
  CheckCheck,
  ExternalLink
} from "lucide-react";
import Badge from "../components/Badge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import { notificationApi } from "../api/client.js";

export const Notifications = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const res = await notificationApi.getNotifications();
      if (res.success) {
        setNotifications(res.notifications || []);
      }
    } catch (e) {
      console.error("Fetch notifications error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await notificationApi.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (e) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationApi.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {}
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filterType === "unread") return !n.isRead;
    if (filterType !== "all") return n.type === filterType;
    return true;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case "delay":
        return <AlertTriangle size={18} color="#B45309" />;
      case "callback":
        return <PhoneCall size={18} color="#7C3AED" />;
      case "checkin":
        return <CheckCircle2 size={18} color="#15803D" />;
      case "booking":
        return <CalendarCheck size={18} color="#0369A1" />;
      default:
        return <Bell size={18} color="#7C3AED" />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.75rem", color: "#4C1D95", marginBottom: 4 }}>
            Staff Notification Center
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
            Operational hospital alerts, patient check-in notifications, delay warnings, and scheduled callback reminders.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleMarkAllRead}
            style={{ gap: 6 }}
          >
            <CheckCheck size={16} />
            <span>Mark All as Read</span>
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={fetchNotifications}
            title="Refresh"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: "flex",
          backgroundColor: "#FAF5FF",
          borderRadius: 12,
          border: "1px solid #E9D5FF",
          padding: 3,
          marginBottom: 22,
          width: "fit-content"
        }}
      >
        {[
          { id: "all", label: `All (${notifications.length})` },
          { id: "unread", label: `Unread (${notifications.filter((n) => !n.isRead).length})` },
          { id: "delay", label: "Delays" },
          { id: "callback", label: "Callbacks" },
          { id: "checkin", label: "Check-ins" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            style={{
              padding: "7px 16px",
              borderRadius: 9,
              border: "none",
              backgroundColor: filterType === tab.id ? "#7C3AED" : "transparent",
              color: filterType === tab.id ? "#FFFFFF" : "#64748B",
              fontWeight: 700,
              fontSize: "0.84rem",
              cursor: "pointer"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="card" style={{ padding: "8px 0" }}>
        {filteredNotifications.length === 0 ? (
          <EmptyState
            title="No notifications"
            description="You have no notifications matching this filter."
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  padding: "16px 22px",
                  borderBottom: "1px solid #FAF5FF",
                  backgroundColor: notif.isRead ? "#FFFFFF" : "#FAF5FF",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 16,
                  transition: "background-color 0.2s"
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: notif.isRead ? "#F1F5F9" : "#EDE9FE",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0
                    }}
                  >
                    {getNotificationIcon(notif.type)}
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: "0.92rem",
                          fontWeight: notif.isRead ? 700 : 800,
                          color: "#1E293B"
                        }}
                      >
                        {notif.title}
                      </span>
                      {notif.priority === "urgent" && <Badge status="Urgent" />}
                      {!notif.isRead && (
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: "#7C3AED"
                          }}
                        />
                      )}
                    </div>

                    <p style={{ color: "#475569", fontSize: "0.85rem", lineHeight: 1.4, margin: "0 0 6px" }}>
                      {notif.message}
                    </p>

                    <div style={{ fontSize: "0.74rem", color: "#94A3B8" }}>
                      {new Date(notif.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {notif.link && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        handleMarkRead(notif.id);
                        if (notif.link.includes("queue")) onNavigate("queue");
                        else if (notif.link.includes("calls")) onNavigate("calls");
                        else onNavigate("appointments");
                      }}
                      style={{ padding: "5px 10px", fontSize: "0.76rem", gap: 4 }}
                    >
                      <span>View</span>
                      <ExternalLink size={12} />
                    </button>
                  )}

                  {!notif.isRead && (
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleMarkRead(notif.id)}
                      style={{ padding: "5px 10px", fontSize: "0.76rem" }}
                    >
                      Mark Read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
