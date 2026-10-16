import db from "../config/db.js";

export const getStaffNotifications = (req, res) => {
  try {
    const notifications = db.find("staffNotifications", () => true);

    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markNotificationRead = (req, res) => {
  try {
    const { id } = req.params;

    const updated = db.update(
      "staffNotifications",
      (n) => n.id === id,
      (existing) => ({
        ...existing,
        isRead: true
      })
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    return res.status(200).json({
      success: true,
      notification: updated
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const markAllNotificationsRead = (req, res) => {
  try {
    const data = db.getDB();
    if (data.staffNotifications) {
      data.staffNotifications.forEach((n) => {
        n.isRead = true;
      });
      db.saveDB();
    }

    return res.status(200).json({
      success: true,
      message: "All staff notifications marked as read."
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
