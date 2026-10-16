import React from "react";
import { Inbox } from "lucide-react";

export const EmptyState = ({
  icon: Icon = Inbox,
  title = "No records found",
  description = "There are no entries matching your current filters or search criteria.",
  actionText,
  onAction
}) => {
  return (
    <div
      style={{
        padding: "48px 24px",
        textAlign: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: "16px",
        border: "1px dashed #E9D5FF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "12px 0"
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          backgroundColor: "#FAF5FF",
          border: "1px solid #E9D5FF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#7C3AED",
          marginBottom: 16
        }}
      >
        <Icon size={28} />
      </div>

      <h4 style={{ color: "#4C1D95", fontWeight: 800, fontSize: "1.1rem", marginBottom: 6 }}>
        {title}
      </h4>
      <p style={{ color: "#64748B", fontSize: "0.875rem", maxWidth: 420, margin: "0 auto 18px" }}>
        {description}
      </p>

      {actionText && onAction && (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
