import db from "../config/db.js";

export const getAuditLogs = (req, res) => {
  try {
    const { action, staffId, search } = req.query;
    let logs = db.find("auditLogs", () => true);

    if (action && action !== "All") {
      logs = logs.filter((l) => l.action.toLowerCase() === action.toLowerCase());
    }

    if (staffId && staffId !== "All") {
      logs = logs.filter((l) => (l.performedBy || "").includes(staffId));
    }

    if (search) {
      const q = search.toLowerCase().trim();
      logs = logs.filter(
        (l) =>
          (l.description || "").toLowerCase().includes(q) ||
          (l.target || "").toLowerCase().includes(q) ||
          (l.performedBy || "").toLowerCase().includes(q) ||
          (l.action || "").toLowerCase().includes(q)
      );
    }

    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.status(200).json({
      success: true,
      count: logs.length,
      auditLogs: logs
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
