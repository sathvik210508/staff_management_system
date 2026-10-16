import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar.jsx";
import Header from "./Header.jsx";
import { appointmentApi, queueApi, notificationApi, communicationApi } from "../api/client.js";

export const Layout = ({ activeTab, onSelectTab, onOpenQuickCheckin, children }) => {
  const [badgeCounts, setBadgeCounts] = useState({
    appointments: 0,
    queue: 0,
    notifications: 0,
    callbacks: 0
  });

  const refreshBadges = async () => {
    try {
      const [aptRes, queueRes, notifRes, callRes] = await Promise.allSettled([
        appointmentApi.getAppointments({ filterPeriod: "today" }),
        queueApi.getLiveQueue({ status: "Waiting" }),
        notificationApi.getNotifications(),
        communicationApi.getCallList()
      ]);

      const counts = {
        appointments:
          aptRes.status === "fulfilled" && aptRes.value.success
            ? aptRes.value.appointments.filter((a) => a.status === "Booked" || a.status === "Scheduled").length
            : 0,
        queue: queueRes.status === "fulfilled" && queueRes.value.success ? queueRes.value.count : 0,
        notifications: notifRes.status === "fulfilled" && notifRes.value.success ? notifRes.value.unreadCount : 0,
        callbacks:
          callRes.status === "fulfilled" && callRes.value.success
            ? callRes.value.callList.filter((c) => c.needsConfirmation).length
            : 0
      };

      setBadgeCounts(counts);
    } catch (e) {
      console.warn("Badge update warning:", e);
    }
  };

  useEffect(() => {
    refreshBadges();
    const interval = setInterval(refreshBadges, 20000);
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} onSelectTab={onSelectTab} badgeCounts={badgeCounts} />
      <div className="main-content">
        <Header onNavigate={onSelectTab} onOpenQuickCheckin={onOpenQuickCheckin} />
        <main className="content-body">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
