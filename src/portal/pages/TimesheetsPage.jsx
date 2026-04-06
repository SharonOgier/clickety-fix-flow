import React, { useState, useMemo } from "react";
import { exportToCSV } from "../PortalHelpers";

const pad = (n) => String(n).padStart(2, "0");
const fmtDate = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fmtDateAU = (iso) => { if (!iso) return "—"; const p = iso.split("-"); return `${p[2]}/${p[1]}/${p[0]}`; };

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - (day === 0 ? 6 : day - 1)); // Mon start
  d.setHours(0,0,0,0);
  return d;
};

const getWeekDates = (weekStart) => {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });
};

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

const calcHours = (start, end) => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);
  const diff = (eh * 60 + em) - (sh * 60 + sm);
  return diff > 0 ? Math.round(diff / 60 * 100) / 100 : 0;
};

export default function TimesheetsPage({
  jobs = [], clients = [], colours = {}, cardStyle = {}, buttonPrimary = {}, buttonSecondary = {},
  inputStyle = {}, labelStyle = {}, currency = v => `$${Number(v||0).toFixed(2)}`,
  DashboardHero = ({ children }) => <div>{children}</div>,
  InsightChip = () => null, MetricCard = () => null,
  SectionCard = ({ title, children, right }) => <section><div style={{ display: "flex", justifyContent: "space-between" }}><h3>{title}</h3>{right}</div>{children}</section>,
  EmptyState = ({ icon, title, message }) => <div>{icon} {title} {message}</div>,
  saveJob, profile = {},
}) {
  const today = new Date();
  const [weekStart, setWeekStart] = useState(getWeekStart(today));
  const weekDates = getWeekDates(weekStart);
  const weekEnd = weekDates[6];
  const [selectedStaff, setSelectedStaff] = useState("all");
  const [editingCell, setEditingCell] = useState(null); // { jobId, dateStr }
  const [editHours, setEditHours] = useState("");

  const weekLabel = `${fmtDateAU(fmtDate(weekStart))} – ${fmtDateAU(fmtDate(weekEnd))}`;

  const prevWeek = () => { const d = new Date(weekStart); d.setDate(d.getDate() - 7); setWeekStart(d); };
  const nextWeek = () => { const d = new Date(weekStart); d.setDate(d.getDate() + 7); setWeekStart(d); };
  const goThisWeek = () => setWeekStart(getWeekStart(today));

  // Build client map
  const clientMap = useMemo(() => Object.fromEntries(clients.map(c => [String(c.id), c])), [clients]);

  // Collect all unique staff from jobs
  const allStaff = useMemo(() => {
    const set = new Set();
    jobs.forEach(j => {
      if (j.assignedTo) set.add(j.assignedTo);
      // Also check timeEntries for staff names
      (j.timeEntries || []).forEach(te => { if (te.staff) set.add(te.staff); });
    });
    // Add the owner/profile name
    const ownerName = profile.businessName || profile.name || "Owner";
    set.add(ownerName);
    return Array.from(set).sort();
  }, [jobs, profile]);

  // Filter jobs that fall within the selected week
  const weekJobs = useMemo(() => {
    const ws = fmtDate(weekStart);
    const we = fmtDate(weekEnd);
    return jobs.filter(j => {
      const jStart = j.startDate || "";
      const jEnd = j.endDate || jStart;
      // Job overlaps with week if job start <= week end AND job end >= week start
      return jStart <= we && jEnd >= ws;
    });
  }, [jobs, weekStart, weekEnd]);

  // Build timesheet data: for each job, for each day, calculate hours
  const timesheetData = useMemo(() => {
    const ownerName = profile.businessName || profile.name || "Owner";
    const data = []; // { jobId, jobTitle, clientName, assignedTo, days: { dateStr: hours }, totalHours }

    const filteredJobs = selectedStaff === "all" ? weekJobs : weekJobs.filter(j => {
      const assigned = j.assignedTo || ownerName;
      return assigned === selectedStaff;
    });

    filteredJobs.forEach(j => {
      const assigned = j.assignedTo || ownerName;
      const clientName = clientMap[String(j.clientId)]?.name || "—";
      const days = {};
      let totalHours = 0;

      weekDates.forEach(d => {
        const dateStr = fmtDate(d);
        let hrs = 0;

        // Check manual time entries first
        const te = (j.timeEntries || []).find(t => t.date === dateStr && (!selectedStaff || selectedStaff === "all" || t.staff === selectedStaff));
        if (te) {
          hrs = Number(te.hours || 0);
        } else if (j.startDate === dateStr || (j.startDate <= dateStr && (j.endDate || j.startDate) >= dateStr)) {
          // Auto-calculate from job start/end times
          hrs = calcHours(j.startTime, j.endTime);
        }

        days[dateStr] = hrs;
        totalHours += hrs;
      });

      if (totalHours > 0 || filteredJobs.length <= 20) {
        data.push({ jobId: j.id, jobTitle: j.title || "Untitled", clientName, assignedTo: assigned, days, totalHours, hourlyRate: j.hourlyRate || 0 });
      }
    });

    return data;
  }, [weekJobs, weekDates, selectedStaff, clientMap, profile]);

  // Totals per day
  const dayTotals = useMemo(() => {
    const totals = {};
    weekDates.forEach(d => { totals[fmtDate(d)] = 0; });
    timesheetData.forEach(row => {
      Object.entries(row.days).forEach(([k, v]) => { totals[k] = (totals[k] || 0) + v; });
    });
    return totals;
  }, [timesheetData, weekDates]);

  const grandTotal = timesheetData.reduce((s, r) => s + r.totalHours, 0);

  // Staff summary for metrics
  const staffSummary = useMemo(() => {
    const map = {};
    timesheetData.forEach(row => {
      if (!map[row.assignedTo]) map[row.assignedTo] = 0;
      map[row.assignedTo] += row.totalHours;
    });
    return Object.entries(map).map(([name, hours]) => ({ name, hours })).sort((a, b) => b.hours - a.hours);
  }, [timesheetData]);

  // Save manual time entry
  const saveTimeEntry = async (jobId, dateStr, hours) => {
    const job = jobs.find(j => String(j.id) === String(jobId));
    if (!job || !saveJob) return;
    const entries = [...(job.timeEntries || [])];
    const idx = entries.findIndex(t => t.date === dateStr);
    const entry = { date: dateStr, hours: Number(hours) || 0, staff: selectedStaff !== "all" ? selectedStaff : (job.assignedTo || profile.businessName || "Owner"), updatedAt: new Date().toISOString() };
    if (idx >= 0) entries[idx] = entry; else entries.push(entry);
    await saveJob({ ...job, timeEntries: entries });
    setEditingCell(null);
  };

  // CSV Export
  const exportTimesheet = () => {
    const rows = timesheetData.map(row => {
      const r = {
        "Staff": row.assignedTo,
        "Job": row.jobTitle,
        "Client": row.clientName,
      };
      weekDates.forEach((d, i) => { r[DAYS[i] + " " + fmtDateAU(fmtDate(d))] = row.days[fmtDate(d)] || 0; });
      r["Total Hours"] = row.totalHours;
      if (row.hourlyRate) r["Rate"] = row.hourlyRate;
      if (row.hourlyRate) r["Amount"] = (row.totalHours * row.hourlyRate).toFixed(2);
      return r;
    });
    // Add totals row
    const totalsRow = { "Staff": "", "Job": "TOTALS", "Client": "" };
    weekDates.forEach((d, i) => { totalsRow[DAYS[i] + " " + fmtDateAU(fmtDate(d))] = dayTotals[fmtDate(d)] || 0; });
    totalsRow["Total Hours"] = grandTotal;
    rows.push(totalsRow);

    const headers = Object.keys(rows[0] || {});
    const csvContent = [headers.join(","), ...rows.map(r => headers.map(h => {
      const v = r[h];
      return typeof v === "string" && v.includes(",") ? `"${v}"` : v;
    }).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `timesheet_${fmtDate(weekStart)}_to_${fmtDate(weekEnd)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <DashboardHero
        title="Timesheets"
        subtitle="Weekly time tracking per staff member per job. Click any cell to enter hours manually."
        highlight={`${grandTotal.toFixed(1)}h`}
      >
        <InsightChip label="This Week" value={weekLabel} />
        <InsightChip label="Staff" value={String(staffSummary.length)} />
        <InsightChip label="Jobs" value={String(timesheetData.length)} />
      </DashboardHero>

      {/* Staff summary cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {staffSummary.slice(0, 6).map(s => (
          <MetricCard key={s.name} title={s.name} value={`${s.hours.toFixed(1)}h`} subtitle="this week" accent={colours.purple} />
        ))}
        <MetricCard title="Total Hours" value={`${grandTotal.toFixed(1)}h`} subtitle="all staff this week" accent={colours.teal} />
      </div>

      {/* Controls */}
      <SectionCard title="Weekly Timesheet" right={
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <select style={{ ...inputStyle, width: "auto", minWidth: 140 }} value={selectedStaff} onChange={e => setSelectedStaff(e.target.value)}>
            <option value="all">All Staff</option>
            {allStaff.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button style={buttonSecondary} onClick={exportTimesheet}>📥 Export CSV</button>
        </div>
      }>
        {/* Week navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <button style={{ ...buttonSecondary, padding: "6px 14px" }} onClick={prevWeek}>◀ Prev</button>
          <button style={{ ...buttonSecondary, padding: "6px 14px", fontWeight: 800 }} onClick={goThisWeek}>Today</button>
          <button style={{ ...buttonSecondary, padding: "6px 14px" }} onClick={nextWeek}>Next ▶</button>
          <span style={{ fontSize: 15, fontWeight: 700, color: colours.text }}>{weekLabel}</span>
        </div>

        {timesheetData.length === 0 ? (
          <EmptyState icon="⏱️" title="No time recorded this week" message="Jobs with scheduled times will appear here automatically. You can also click any cell to log hours manually." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={thStyle}>Staff</th>
                  <th style={thStyle}>Job</th>
                  <th style={thStyle}>Client</th>
                  {weekDates.map((d, i) => {
                    const isToday = fmtDate(d) === fmtDate(today);
                    const isWeekend = i >= 5;
                    return (
                      <th key={i} style={{ ...thStyle, textAlign: "center", minWidth: 60, background: isToday ? "#E8F5E9" : isWeekend ? "#FFF8E1" : undefined }}>
                        <div style={{ fontSize: 11, fontWeight: 600 }}>{DAYS[i]}</div>
                        <div style={{ fontSize: 10, color: colours.muted }}>{fmtDate(d).slice(8)}/{fmtDate(d).slice(5,7)}</div>
                      </th>
                    );
                  })}
                  <th style={{ ...thStyle, textAlign: "center", minWidth: 70, background: "#F5ECFB" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {timesheetData.map((row, ri) => (
                  <tr key={row.jobId + "-" + ri} style={{ background: ri % 2 === 0 ? "#FFFFFF" : "#FAFBFC" }}>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 600, color: colours.text }}>{row.assignedTo}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 700, color: colours.purple }}>{row.jobTitle}</span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: colours.muted }}>{row.clientName}</span>
                    </td>
                    {weekDates.map((d, i) => {
                      const dateStr = fmtDate(d);
                      const hrs = row.days[dateStr] || 0;
                      const isEditing = editingCell?.jobId === row.jobId && editingCell?.dateStr === dateStr;
                      const isToday = dateStr === fmtDate(today);
                      const isWeekend = i >= 5;
                      return (
                        <td key={i} style={{ ...tdStyle, textAlign: "center", cursor: "pointer", background: isToday ? "#E8F5E9" : isWeekend ? "#FFF8E1" : undefined, padding: 4 }}
                          onClick={() => { if (!isEditing) { setEditingCell({ jobId: row.jobId, dateStr }); setEditHours(String(hrs || "")); } }}
                        >
                          {isEditing ? (
                            <input
                              type="number" step="0.25" min="0" max="24"
                              style={{ ...inputStyle, width: 50, textAlign: "center", padding: "4px", fontSize: 13 }}
                              value={editHours}
                              onChange={e => setEditHours(e.target.value)}
                              onBlur={() => saveTimeEntry(row.jobId, dateStr, editHours)}
                              onKeyDown={e => { if (e.key === "Enter") saveTimeEntry(row.jobId, dateStr, editHours); if (e.key === "Escape") setEditingCell(null); }}
                              autoFocus
                            />
                          ) : (
                            <span style={{ fontWeight: hrs > 0 ? 700 : 400, color: hrs > 0 ? colours.text : "#CBD5E1", fontSize: 13 }}>
                              {hrs > 0 ? hrs.toFixed(hrs % 1 === 0 ? 0 : 1) : "–"}
                            </span>
                          )}
                        </td>
                      );
                    })}
                    <td style={{ ...tdStyle, textAlign: "center", fontWeight: 800, color: colours.purple, background: "#F5ECFB" }}>
                      {row.totalHours.toFixed(row.totalHours % 1 === 0 ? 0 : 1)}
                    </td>
                  </tr>
                ))}
                {/* Totals row */}
                <tr style={{ borderTop: `3px solid ${colours.purple || "#6A1B9A"}` }}>
                  <td colSpan={3} style={{ ...tdStyle, fontWeight: 800, color: colours.text, fontSize: 14 }}>TOTALS</td>
                  {weekDates.map((d, i) => {
                    const dateStr = fmtDate(d);
                    const total = dayTotals[dateStr] || 0;
                    const isToday = dateStr === fmtDate(today);
                    const isWeekend = i >= 5;
                    return (
                      <td key={i} style={{ ...tdStyle, textAlign: "center", fontWeight: 800, fontSize: 14, color: colours.text, background: isToday ? "#C8E6C9" : isWeekend ? "#FFF3E0" : "#F1F5F9" }}>
                        {total > 0 ? total.toFixed(total % 1 === 0 ? 0 : 1) : "–"}
                      </td>
                    );
                  })}
                  <td style={{ ...tdStyle, textAlign: "center", fontWeight: 900, fontSize: 16, color: "#FFFFFF", background: colours.purple || "#6A1B9A", borderRadius: "0 0 8px 0" }}>
                    {grandTotal.toFixed(grandTotal % 1 === 0 ? 0 : 1)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "10px 12px",
  borderBottom: "2px solid #E2E8F0",
  fontSize: 12,
  fontWeight: 700,
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: 0.3,
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "10px 12px",
  borderBottom: "1px solid #F1F5F9",
  whiteSpace: "nowrap",
};
