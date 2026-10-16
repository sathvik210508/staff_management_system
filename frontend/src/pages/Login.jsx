import React, { useState } from "react";
import { Hospital, ShieldCheck, ArrowRight, UserCheck, KeyRound, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export const Login = ({ onLoginSuccess }) => {
  const { login } = useAuth();
  const [staffId, setStaffId] = useState("STAFF101");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(staffId, password);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message || "Invalid Staff ID or Password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemo = (id) => {
    setStaffId(id);
    setPassword("password123");
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAF5FF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          backgroundColor: "#FFFFFF",
          borderRadius: 24,
          border: "1px solid #E9D5FF",
          boxShadow: "0 20px 40px rgba(124, 58, 237, 0.1)",
          padding: "36px 32px"
        }}
      >
        {/* Brand Icon & Heading */}
        <div style={{ textAlign: "center", marginBottom: 26 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              backgroundColor: "#FAF5FF",
              border: "1.5px solid #DDD6FE",
              color: "#7C3AED",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
              boxShadow: "0 4px 14px rgba(124, 58, 237, 0.12)"
            }}
          >
            <Hospital size={30} color="#7C3AED" />
          </div>

          <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#4C1D95", letterSpacing: "-0.5px" }}>
            LIORA HOSPITALS
          </h2>
          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>
            Staff & Front Desk Portal
          </div>
          <p style={{ color: "#64748B", fontSize: "0.84rem", marginTop: 6 }}>
            Reception, Patient Triage & Appointment Operations
          </p>
        </div>

        {/* Quick Demo Selector */}
        <div
          style={{
            backgroundColor: "#FAF5FF",
            borderRadius: 14,
            border: "1px solid #E9D5FF",
            padding: "12px 14px",
            marginBottom: 20
          }}
        >
          <div style={{ fontSize: "0.72rem", fontWeight: 800, color: "#6D28D9", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <ShieldCheck size={14} /> Quick Demo Staff Accounts
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
            <button
              type="button"
              onClick={() => handleSelectDemo("STAFF101")}
              style={{
                padding: "6px 4px",
                borderRadius: 8,
                border: staffId === "STAFF101" ? "1.5px solid #7C3AED" : "1px solid #E9D5FF",
                backgroundColor: staffId === "STAFF101" ? "#FFFFFF" : "transparent",
                color: "#4C1D95",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              STAFF101<br/><span style={{ fontSize: "0.65rem", color: "#7C3AED", fontWeight: 600 }}>Reception</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectDemo("STAFF102")}
              style={{
                padding: "6px 4px",
                borderRadius: 8,
                border: staffId === "STAFF102" ? "1.5px solid #7C3AED" : "1px solid #E9D5FF",
                backgroundColor: staffId === "STAFF102" ? "#FFFFFF" : "transparent",
                color: "#4C1D95",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              STAFF102<br/><span style={{ fontSize: "0.65rem", color: "#7C3AED", fontWeight: 600 }}>Coordinator</span>
            </button>
            <button
              type="button"
              onClick={() => handleSelectDemo("STAFF100")}
              style={{
                padding: "6px 4px",
                borderRadius: 8,
                border: staffId === "STAFF100" ? "1.5px solid #7C3AED" : "1px solid #E9D5FF",
                backgroundColor: staffId === "STAFF100" ? "#FFFFFF" : "transparent",
                color: "#4C1D95",
                fontSize: "0.75rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              STAFF100<br/><span style={{ fontSize: "0.65rem", color: "#7C3AED", fontWeight: 600 }}>Lead Admin</span>
            </button>
          </div>
        </div>

        {error && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              backgroundColor: "#FFF1F2",
              border: "1px solid #FECDD3",
              color: "#BE123C",
              fontSize: "0.82rem",
              fontWeight: 600,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 8
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <UserCheck size={14} color="#7C3AED" /> Staff ID / Work Email
            </label>
            <input
              type="text"
              className="form-input"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              placeholder="e.g. STAFF101"
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 22 }}>
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <KeyRound size={14} color="#7C3AED" /> Password
            </label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ width: "100%", padding: "12px", fontSize: "0.95rem", gap: 8 }}
          >
            <span>{isLoading ? "Authenticating Staff..." : "Sign In to Staff Portal"}</span>
            {!isLoading && <ArrowRight size={17} />}
          </button>
        </form>

        <div style={{ marginTop: 18, textAlign: "center" }}>
          <a
            href="http://localhost:5170"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "0.825rem",
              fontWeight: 700,
              color: "#7C3AED",
              textDecoration: "none",
              padding: "6px 12px",
              borderRadius: 8,
              backgroundColor: "#FAF5FF",
              border: "1px solid #E9D5FF"
            }}
          >
            ← Return to Main Hospital Gateway
          </a>
        </div>

        <div style={{ marginTop: 18, textAlign: "center", fontSize: "0.76rem", color: "#94A3B8" }}>
          Liora Hospitals Enterprise HIS • Unified Cross-Portal Infrastructure
        </div>
      </div>
    </div>
  );
};

export default Login;
