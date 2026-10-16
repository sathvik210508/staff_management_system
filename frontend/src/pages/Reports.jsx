import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Download,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PhoneCall,
  Users,
  RefreshCw,
  TrendingUp,
  FileSpreadsheet
} from "lucide-react";
import StatCard from "../components/StatCard.jsx";
import { reportApi } from "../api/client.js";

export const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const res = await reportApi.getMetrics();
      if (res.success) {
        setReportData(res);
      }
    } catch (e) {
      console.error("Fetch reports error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExportCSV = () => {
    window.open("/api/reports/export/csv", "_blank");
  };

  const metrics = reportData?.metrics || {
    totalAppointments: 0,
    confirmationRate: 0,
    cancellationRate: 0,
    noShowRate: 0,
    avgWaitingTime: 0,
    pendingCallbacksCount: 0,
    checkedInCount: 0
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
            Front Desk Reports & Operational Analytics
          </h1>
          <p style={{ color: "#64748B", fontSize: "0.9rem" }}>
            Real-time computed hospital KPI analytics, patient waiting intervals, and attendance conversion rates.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button
            className="btn btn-primary"
            onClick={handleExportCSV}
            style={{ gap: 8 }}
          >
            <FileSpreadsheet size={16} />
            <span>Export CSV Report</span>
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={fetchReports}
            title="Refresh Metrics"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* 4 Core Performance KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 16,
          marginBottom: 28
        }}
      >
        <StatCard
          title="Confirmation Rate"
          value={`${metrics.confirmationRate}%`}
          subtitle="Attendance verified"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Average Wait Time"
          value={`${metrics.avgWaitingTime}m`}
          subtitle="Reception to cabin"
          icon={Clock}
          color="primary"
        />
        <StatCard
          title="Cancellation Rate"
          value={`${metrics.cancellationRate}%`}
          subtitle="Recorded reasons"
          icon={XCircle}
          color="rose"
        />
        <StatCard
          title="No-Show Rate"
          value={`${metrics.noShowRate}%`}
          subtitle="Absent appointments"
          icon={AlertTriangle}
          color="amber"
        />
      </div>

      {/* 2-Column Analytics Grids */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
        {/* Doctor-wise Patient Load */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <Users size={19} color="#7C3AED" />
              <span>Doctor-wise Appointment Distribution</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(reportData?.doctorBreakdown || []).map((doc) => {
              const maxCount = Math.max(1, ...(reportData?.doctorBreakdown || []).map((d) => d.total));
              const pct = Math.round((doc.total / maxCount) * 100);

              return (
                <div key={doc.doctorId}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: "#1E293B" }}>{doc.doctorName}</span>
                    <span style={{ fontWeight: 800, color: "#7C3AED" }}>{doc.total} visits</span>
                  </div>
                  <div style={{ height: 8, backgroundColor: "#FAF5FF", borderRadius: 4, overflow: "hidden", border: "1px solid #E9D5FF" }}>
                    <div style={{ width: `${pct}%`, height: "100%", backgroundColor: "#7C3AED", borderRadius: 4 }} />
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#64748B", marginTop: 2 }}>
                    {doc.department} • {doc.completed} completed
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Department-wise Distribution */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <BarChart3 size={19} color="#7C3AED" />
              <span>Departmental OPD Volume</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(reportData?.departmentBreakdown || []).map((dept) => {
              const maxDept = Math.max(1, ...(reportData?.departmentBreakdown || []).map((d) => d.count));
              const pct = Math.round((dept.count / maxDept) * 100);

              return (
                <div key={dept.department}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, color: "#1E293B" }}>{dept.department}</span>
                    <span style={{ fontWeight: 800, color: "#4C1D95" }}>{dept.count} visits</span>
                  </div>
                  <div style={{ height: 8, backgroundColor: "#FAF5FF", borderRadius: 4, overflow: "hidden", border: "1px solid #E9D5FF" }}>
                    <div style={{ width: `${pct}%`, height: "100%", backgroundColor: "#8B5CF6", borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Call Outcomes & Disposition Analysis */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">
            <PhoneCall size={19} color="#7C3AED" />
            <span>Call Outcomes & Patient Contact Success Rates</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {(reportData?.callOutcomes || []).map((item) => (
            <div
              key={item.outcome}
              style={{
                backgroundColor: "#FAF5FF",
                borderRadius: 14,
                padding: "16px",
                border: "1px solid #E9D5FF",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "0.76rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
                {item.outcome.replace(/_/g, " ")}
              </div>
              <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "#4C1D95", marginTop: 4 }}>
                {item.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
