import React, { useState } from "react";
import {
  UserCheck,
  ShieldCheck,
  KeyRound,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { authApi } from "../api/client.js";

export const Profile = () => {
  const { staff, refreshProfile } = useAuth();

  // Profile Edit
  const [profileData, setProfileData] = useState({
    name: staff?.name || "",
    phone: staff?.phone || "",
    desk: staff?.desk || "",
    department: staff?.department || ""
  });
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Toast
  const [toast, setToast] = useState(null);
  const showToast = (text, type = "success") => {
    setToast({ text, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    try {
      const res = await authApi.updateProfile(profileData);
      if (res.success) {
        showToast("Profile details updated successfully!");
        refreshProfile();
      }
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await authApi.changePassword(passwordData.currentPassword, passwordData.newPassword);
      if (res.success) {
        showToast("Password updated successfully!");
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch (err) {
      setPasswordError(err.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div className="toast-container">
          <div className={`toast toast-${toast.type}`}>
            {toast.type === "success" ? <CheckCircle2 size={18} color="#10B981" /> : <AlertCircle size={18} color="#EF4444" />}
            <span>{toast.text}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "1.75rem", color: "#4C1D95", marginBottom: 4 }}>
          Staff Profile & Account Settings
        </h1>
        <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
          Manage your hospital desk identity, personal contact information, and account security credentials.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 24 }}>
        {/* Profile Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <UserCheck size={20} color="#7C3AED" />
              <span>Identity & Department Assignment</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 22 }}>
            <img
              src={staff?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400"}
              alt={staff?.name}
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #8B5CF6",
                boxShadow: "0 4px 14px rgba(124, 58, 237, 0.14)"
              }}
            />
            <div>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#4C1D95" }}>
                {staff?.name}
              </div>
              <div style={{ fontSize: "0.85rem", color: "#7C3AED", fontWeight: 700 }}>
                {staff?.role}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#64748B", marginTop: 2 }}>
                Staff ID: <strong style={{ color: "#1E293B" }}>{staff?.staffId}</strong> • Joined {staff?.joinedDate || "2023"}
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Desk / Station</label>
                <input
                  type="text"
                  className="form-input"
                  value={profileData.desk}
                  onChange={(e) => setProfileData({ ...profileData, desk: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Department / Unit</label>
              <input
                type="text"
                className="form-input"
                value={profileData.department}
                onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={profileLoading}
              style={{ marginTop: 8 }}
            >
              {profileLoading ? "Updating Profile..." : "Save Profile Details"}
            </button>
          </form>

          {/* Permissions Overview */}
          <div style={{ marginTop: 28, borderTop: "1px solid #E9D5FF", paddingTop: 18 }}>
            <div style={{ fontSize: "0.84rem", fontWeight: 800, color: "#4C1D95", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <ShieldCheck size={16} color="#7C3AED" />
              <span>Assigned Role Privileges</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(staff?.permissions || ["appointments:read", "appointments:create", "queue:manage"]).map((perm) => (
                <span
                  key={perm}
                  style={{
                    fontSize: "0.74rem",
                    fontWeight: 700,
                    padding: "4px 8px",
                    borderRadius: 6,
                    backgroundColor: "#FAF5FF",
                    border: "1px solid #E9D5FF",
                    color: "#5B21B6"
                  }}
                >
                  {perm}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <KeyRound size={20} color="#7C3AED" />
              <span>Account Password & Security</span>
            </div>
          </div>

          {passwordError && (
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                backgroundColor: "#FFF1F2",
                border: "1px solid #FECDD3",
                color: "#BE123C",
                fontSize: "0.84rem",
                marginBottom: 16
              }}
            >
              <AlertCircle size={15} style={{ verticalAlign: "middle", marginRight: 6 }} />
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-input"
                required
                placeholder="••••••••"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                required
                placeholder="At least 6 characters"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                required
                placeholder="Repeat new password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              />
            </div>

            <button
              type="submit"
              className="btn btn-secondary"
              disabled={passwordLoading}
              style={{ marginTop: 8 }}
            >
              {passwordLoading ? "Updating Password..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
