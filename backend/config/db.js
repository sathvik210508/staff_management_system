import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  initialStaffMembers,
  initialWaitingQueue,
  initialCallLogs,
  initialStaffNotifications,
  initialAuditLogs
} from "../services/initialStaffData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Primary shared database from doctor-portal / hospital management system
const SHARED_DB_PATH = path.resolve(
  __dirname,
  "../../../doctor management system/doctor-portal/database/db.json"
);
// Fallback local database in staff portal
const LOCAL_DB_DIR = path.resolve(__dirname, "../data");
const LOCAL_DB_PATH = path.join(LOCAL_DB_DIR, "db.json");

let activeDbFile = null;
let memoryCache = null;

// Persistent in-memory staff collections so external portal saves never wipe staff data
let preservedStaff = [...initialStaffMembers];
let preservedWaitingQueue = [...initialWaitingQueue];
let preservedCallLogs = [...initialCallLogs];
let preservedStaffNotifications = [...initialStaffNotifications];
let preservedAuditLogs = [...initialAuditLogs];

const ensureStaffCollections = (data) => {
  if (!data) data = {};

  if (!data.staff || data.staff.length === 0) {
    data.staff = preservedStaff;
  } else {
    preservedStaff = data.staff;
  }

  if (!data.waitingQueue || data.waitingQueue.length === 0) {
    data.waitingQueue = preservedWaitingQueue;
  } else {
    preservedWaitingQueue = data.waitingQueue;
  }

  if (!data.callLogs || data.callLogs.length === 0) {
    data.callLogs = preservedCallLogs;
  } else {
    preservedCallLogs = data.callLogs;
  }

  if (!data.staffNotifications || data.staffNotifications.length === 0) {
    data.staffNotifications = preservedStaffNotifications;
  } else {
    preservedStaffNotifications = data.staffNotifications;
  }

  if (!data.auditLogs || data.auditLogs.length === 0) {
    data.auditLogs = preservedAuditLogs;
  } else {
    preservedAuditLogs = data.auditLogs;
  }

  if (!data.appointments) data.appointments = [];
  if (!data.patients) data.patients = [];
  if (!data.doctors) data.doctors = [];

  return data;
};

export const initDB = () => {
  try {
    if (fs.existsSync(SHARED_DB_PATH)) {
      activeDbFile = SHARED_DB_PATH;
      console.log(`[Staff Portal DB] Connected directly to Shared Hospital Database at: ${SHARED_DB_PATH}`);
    } else {
      activeDbFile = LOCAL_DB_PATH;
      if (!fs.existsSync(LOCAL_DB_DIR)) {
        fs.mkdirSync(LOCAL_DB_DIR, { recursive: true });
      }
      console.log(`[Staff Portal DB] Shared path not reachable. Using Staff Database at: ${LOCAL_DB_PATH}`);
    }

    if (fs.existsSync(activeDbFile)) {
      const content = fs.readFileSync(activeDbFile, "utf8");
      memoryCache = JSON.parse(content);
    } else {
      memoryCache = {};
    }

    ensureStaffCollections(memoryCache);
    saveDB();
  } catch (err) {
    console.error("[Staff Portal DB] Error initializing database:", err);
    memoryCache = ensureStaffCollections({});
  }
};

export const getDB = () => {
  try {
    if (activeDbFile && fs.existsSync(activeDbFile)) {
      const content = fs.readFileSync(activeDbFile, "utf8");
      memoryCache = JSON.parse(content);
    } else if (!memoryCache) {
      initDB();
    }
  } catch (e) {
    if (!memoryCache) initDB();
  }
  return ensureStaffCollections(memoryCache);
};

export const saveDB = () => {
  try {
    if (!activeDbFile) {
      activeDbFile = fs.existsSync(SHARED_DB_PATH) ? SHARED_DB_PATH : LOCAL_DB_PATH;
    }
    const targetDir = path.dirname(activeDbFile);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const dataToSave = ensureStaffCollections(memoryCache);
    fs.writeFileSync(activeDbFile, JSON.stringify(dataToSave, null, 2), "utf8");
  } catch (err) {
    console.error("[Staff Portal DB] Error persisting database:", err);
  }
};

export const db = {
  getDB,
  saveDB,

  find(collection, predicate = () => true) {
    const data = getDB();
    if (!data[collection]) return [];
    return data[collection].filter(predicate);
  },

  findOne(collection, predicate) {
    const data = getDB();
    if (!data[collection]) return null;
    return data[collection].find(predicate) || null;
  },

  insert(collection, item) {
    const data = getDB();
    if (!data[collection]) {
      data[collection] = [];
    }
    data[collection].push(item);
    if (collection === "staff") preservedStaff = data.staff;
    if (collection === "waitingQueue") preservedWaitingQueue = data.waitingQueue;
    if (collection === "callLogs") preservedCallLogs = data.callLogs;
    if (collection === "staffNotifications") preservedStaffNotifications = data.staffNotifications;
    if (collection === "auditLogs") preservedAuditLogs = data.auditLogs;
    saveDB();
    return item;
  },

  update(collection, predicate, updater) {
    const data = getDB();
    if (!data[collection]) return null;
    const index = data[collection].findIndex(predicate);
    if (index === -1) return null;

    const existing = data[collection][index];
    const updated = typeof updater === "function" ? updater(existing) : { ...existing, ...updater };
    data[collection][index] = updated;

    if (collection === "staff") preservedStaff = data.staff;
    if (collection === "waitingQueue") preservedWaitingQueue = data.waitingQueue;
    if (collection === "callLogs") preservedCallLogs = data.callLogs;
    if (collection === "staffNotifications") preservedStaffNotifications = data.staffNotifications;
    if (collection === "auditLogs") preservedAuditLogs = data.auditLogs;

    saveDB();
    return updated;
  },

  remove(collection, predicate) {
    const data = getDB();
    if (!data[collection]) return false;
    const initialLen = data[collection].length;
    data[collection] = data[collection].filter((item) => !predicate(item));
    const removed = data[collection].length < initialLen;
    if (removed) {
      if (collection === "staff") preservedStaff = data.staff;
      if (collection === "waitingQueue") preservedWaitingQueue = data.waitingQueue;
      if (collection === "callLogs") preservedCallLogs = data.callLogs;
      if (collection === "staffNotifications") preservedStaffNotifications = data.staffNotifications;
      if (collection === "auditLogs") preservedAuditLogs = data.auditLogs;
      saveDB();
    }
    return removed;
  },

  audit(action, description, performedBy = "Staff System", target = "", details = {}) {
    const logEntry = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      description,
      performedBy,
      target,
      details,
      timestamp: new Date().toISOString()
    };
    return this.insert("auditLogs", logEntry);
  }
};

export default db;
