import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Database,
  Server
} from "lucide-react";

export const Settings = () => {
  const [autoRefreshSecs, setAutoRefreshSecs] = useState("15");
  const [waitThresholdMins, setWaitThresholdMins] = useState("20");
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.75rem", color: "#4C1D95", marginBottom: 4 }}>
          Front Desk & System Preferences
        </h1>
        <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
          Configure queue update frequencies, patient delay thresholds, and audio-visual reception alert behaviors.
        </p>
      </div>

      <div style={{ maxWidth: 780 }}>
        {isSaved && (
          <div
            style={{
              padding: "12px 18px",
              borderRadius: 12,
              backgroundColor: "#F0FDF4",
              border: "1px solid #BBF7D0",
              color: "#15803D",
              fontSize: "0.88rem",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 20
            }}
          >
            <CheckCircle2 size={18} />
            <span>Preferences saved successfully to local station!</span>
          </div>
        )}

        <form onSubmit={handleSave}>
          {/* Section 1: Queue & Display Settings */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div className="card-title">
                <Clock size={19} color="#7C3AED" />
                <span>Live Queue & Delay Alert Thresholds</span>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Live Queue Auto-Refresh Rate</label>
                <select
                  className="form-select"
                  value={autoRefreshSecs}
                  onChange={(e) => setAutoRefreshSecs(e.target.value)}
                >
                  <option value="10">Every 10 seconds</option>
                  <option value="15">Every 15 seconds (Recommended)</option>
                  <option value="30">Every 30 seconds</option>
                  <option value="60">Every 1 minute</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Long Wait Warning Threshold</label>
                <select
                  className="form-select"
                  value={waitThresholdMins}
                  onChange={(e) => setWaitThresholdMins(e.target.value)}
                >
                  <option value="15">After 15 minutes waiting</option>
                  <option value="20">After 20 minutes waiting (Standard)</option>
                  <option value="30">After 30 minutes waiting</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: "0.88rem", fontWeight: 600, color: "#1E293B" }}>
                <input
                  type="checkbox"
                  checked={soundAlerts}
                  onChange={(e) => setSoundAlerts(e.target.checked)}
                />
                <span>Play subtle chime when arriving patient is assigned to queue</span>
              </label>
            </div>
          </div>

          {/* Section 2: Telephony Integration Status */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-header">
              <div className="card-title">
                <Phone size={19} color="#7C3AED" />
                <span>Telephony & Communication Gateway</span>
              </div>
            </div>

            <div
              style={{
                padding: "14px 18px",
                backgroundColor: "#FAF5FF",
                borderRadius: 12,
                border: "1px solid #E9D5FF",
                marginBottom: 14
              }}
            >
              <div style={{ fontWeight: 800, color: "#4C1D95", fontSize: "0.92rem", marginBottom: 4 }}>
                Active Calling Method: Native Device Protocol (<code>tel:</code> link)
              </div>
              <div style={{ fontSize: "0.82rem", color: "#64748B", lineHeight: 1.45 }}>
                Front desk staff initiate outgoing calls through the device's connected dialer, cellular softphone, or desktop VoIP application. Outgoing call outcomes are logged to the shared hospital audit database.
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", color: "#047857", fontWeight: 700 }}>
              <CheckCircle2 size={16} />
              <span>Gateway Connector Operational • Cloud Telephony / VoIP Bridge Ready</span>
            </div>
          </div>

          {/* Section 3: Hospital System Status */}
          <div className="card" style={{ marginBottom: 24 }}>
            <div className="card-header">
              <div className="card-title">
                <Server size={19} color="#7C3AED" />
                <span>Cross-Portal System Architecture</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "8px 0", borderBottom: "1px solid #FAF5FF" }}>
                <span style={{ color: "#64748B" }}>Staff Portal URL:</span>
                <strong style={{ color: "#4C1D95" }}>http://localhost:5174 (API: 5002)</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "8px 0", borderBottom: "1px solid #FAF5FF" }}>
                <span style={{ color: "#64748B" }}>Doctor Portal Synchronizer:</span>
                <strong style={{ color: "#15803D" }}>http://localhost:5001 (Operational)</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "8px 0", borderBottom: "1px solid #FAF5FF" }}>
                <span style={{ color: "#64748B" }}>Patient Portal Synchronizer:</span>
                <strong style={{ color: "#7C3AED" }}>http://localhost:5000 (Bridged)</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "8px 0" }}>
                <span style={{ color: "#64748B" }}>Shared Database Layer:</span>
                <strong style={{ color: "#4C1D95" }}>Persistent Hospital Database (Atomic File Store)</strong>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: "10px 24px" }}>
            Save Station Preferences
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
