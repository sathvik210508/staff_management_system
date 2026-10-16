import React from "react";

export const Badge = ({ status, variant, children, className = "" }) => {
  const normalized = (variant || status || "").toLowerCase().replace(/\s+/g, "-");

  let badgeClass = "badge-normal";
  if (["scheduled", "booked", "upcoming"].includes(normalized)) badgeClass = "badge-scheduled";
  if (["confirmed"].includes(normalized)) badgeClass = "badge-confirmed";
  if (["checked-in", "arrived"].includes(normalized)) badgeClass = "badge-checked-in";
  if (["waiting", "pending"].includes(normalized)) badgeClass = "badge-waiting";
  if (["with-doctor", "in-consultation", "in-progress"].includes(normalized)) badgeClass = "badge-with-doctor";
  if (["completed", "approved", "present"].includes(normalized)) badgeClass = "badge-completed";
  if (["cancelled", "rejected", "no-show", "missed", "absent", "declined"].includes(normalized)) badgeClass = "badge-cancelled";
  if (["rescheduled"].includes(normalized)) badgeClass = "badge-rescheduled";
  if (["urgent", "emergency"].includes(normalized)) badgeClass = "badge-urgent";
  if (["priority", "important", "senior-citizen"].includes(normalized)) badgeClass = "badge-priority";

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      {children || status}
    </span>
  );
};

export default Badge;
