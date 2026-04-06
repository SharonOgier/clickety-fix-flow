import React, { useState, useMemo, useRef, useCallback } from "react";
import JobCostingPanel, { computeJobFinancials } from "./JobCostingPanel";
import { writeJobSheetPreviewToWindow } from "../PortalDocumentBuilders";
import { supabase } from "@/integrations/supabase/client";

/* ─── helpers ──────────────────────────────────────────────────────────── */
const VIEWS = ["month", "week", "day", "list"];
const STATUS_OPTIONS = ["Scheduled", "In Progress", "Completed", "Cancelled"];
const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"];
const COLOUR_OPTIONS = [
  { label: "Purple", value: "#6A1B9A" },
  { label: "Teal",   value: "#006D6D" },
  { label: "Blue",   value: "#1E88E5" },
  { label: "Orange", value: "#E65100" },
  { label: "Green",  value: "#2E7D32" },
  { label: "Red",    value: "#C62828" },
];

const pad = (n) => String(n).padStart(2, "0");
const fmtDate = (d) => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const fmtDateAU = (iso) => { if (!iso) return "—"; const p = iso.split("-"); return `${p[2]}/${p[1]}/${p[0]}`; };
const fmtTime = (t) => { if (!t) return ""; const [h,m] = t.split(":"); const hh = +h; return `${hh > 12 ? hh-12 : hh || 12}:${m} ${hh >= 12 ? "pm" : "am"}`; };

const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay(); // 0=Sun

const getWeekDates = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Mon start
  const mon = new Date(d.setDate(diff));
  return Array.from({ length: 7 }, (_, i) => {
    const dd = new Date(mon);
    dd.setDate(mon.getDate() + i);
    return dd;
  });
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

/* ─── status badge ────────────────────────────────────────────────────── */
const StatusBadge = ({ status, colours }) => {
  const map = {
    Scheduled: { bg: "#E3F2FD", color: "#1565C0" },
    "In Progress": { bg: "#FFF3E0", color: "#E65100" },
    Completed: { bg: "#E8F5E9", color: "#2E7D32" },
    Cancelled: { bg: "#FFEBEE", color: "#C62828" },
  };
  const s = map[status] || { bg: colours.lightPurple, color: colours.purple };
  return <span style={{ padding: "2px 10px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>{status}</span>;
};

const PriorityBadge = ({ priority }) => {
  const map = { Low: "#64748B", Medium: "#1E88E5", High: "#E65100", Urgent: "#C62828" };
  return <span style={{ fontSize: 11, fontWeight: 700, color: map[priority] || "#64748B" }}>● {priority}</span>;
};

/* ═══════════════════════════════════════════════════════════════════════ */
export default function SchedulingPage({
  jobs = [], clients = [], properties = [], quotes = [], invoices = [], colours: c, cardStyle, buttonPrimary, buttonSecondary,
  inputStyle, labelStyle, DashboardHero, InsightChip, MetricCard, SectionCard, DataTable, EmptyState,
  saveJob, deleteJob, confirm, setActivePage, currency = (v) => `$${Number(v||0).toFixed(2)}`,
  authUser, profile = {},
}) {
  const colours = c;
  const today = new Date();
  const [viewDate, setViewDate] = useState(today);
  const [view, setView] = useState("month");
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [detailJob, setDetailJob] = useState(null);
  const [detailTab, setDetailTab] = useState("info");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const blankJob = {
    title: "", description: "", status: "Scheduled", priority: "Medium",
    startDate: fmtDate(today), startTime: "09:00", endDate: fmtDate(today), endTime: "17:00",
    clientId: "", propertyId: "", subLocationId: "", assignedTo: "", colour: "#6A1B9A", notes: "",
  };
  const [form, setForm] = useState(blankJob);

  const clientMap = useMemo(() => Object.fromEntries(clients.map(c => [String(c.id), c])), [clients]);
  const propertyMap = useMemo(() => Object.fromEntries(properties.map(p => [String(p.id), p])), [properties]);

  const getClientName = (id) => clientMap[String(id)]?.name || "—";
  const getPropertyName = (id) => propertyMap[String(id)]?.name || "—";
  const getSubLocations = (propId) => {
    const p = propertyMap[String(propId)];
    return p?.subLocations || [];
  };

  /* ── filter + search ─────────────────────────────────────── */
  const filtered = useMemo(() => {
    let list = jobs;
    if (filterStatus !== "all") list = list.filter(j => j.status === filterStatus);
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(j =>
        (j.title || "").toLowerCase().includes(q) ||
        getClientName(j.clientId).toLowerCase().includes(q) ||
        getPropertyName(j.propertyId).toLowerCase().includes(q) ||
        (j.assignedTo || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [jobs, filterStatus, searchTerm]);

  /* ── stats ───────────────────────────────────────────────── */
  const stats = useMemo(() => ({
    total: jobs.length,
    scheduled: jobs.filter(j => j.status === "Scheduled").length,
    inProgress: jobs.filter(j => j.status === "In Progress").length,
    completed: jobs.filter(j => j.status === "Completed").length,
  }), [jobs]);

  /* ── calendar nav ────────────────────────────────────────── */
  const navPrev = () => {
    const d = new Date(viewDate);
    if (view === "month") d.setMonth(d.getMonth() - 1);
    else if (view === "week") d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setViewDate(d);
  };
  const navNext = () => {
    const d = new Date(viewDate);
    if (view === "month") d.setMonth(d.getMonth() + 1);
    else if (view === "week") d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setViewDate(d);
  };
  const goToday = () => setViewDate(new Date());

  /* ── job helpers ─────────────────────────────────────────── */
  const jobsOnDate = (dateStr) => filtered.filter(j => j.startDate === dateStr);

  const openNew = () => { setForm(blankJob); setEditingJob(null); setShowForm(true); };
  const openEdit = (job) => { setForm({ ...blankJob, ...job }); setEditingJob(job); setShowForm(true); setDetailJob(null); };
  const closeForm = () => { setShowForm(false); setEditingJob(null); setForm(blankJob); };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    const payload = { ...form, id: editingJob?.id || Date.now() };
    await saveJob(payload);
    closeForm();
  };

  const handleDelete = (job) => {
    confirm({
      title: "Delete Job",
      message: `Delete "${job.title}"? This cannot be undone.`,
      onConfirm: () => deleteJob(job.id),
    });
    setDetailJob(null);
  };

  /* ── drag-and-drop helpers ──────────────────────────────── */
  const [dragOverDate, setDragOverDate] = useState(null);

  const handleDragStart = (e, job) => {
    e.dataTransfer.setData("application/json", JSON.stringify(job));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = async (e, targetDateStr) => {
    e.preventDefault();
    setDragOverDate(null);
    try {
      const job = JSON.parse(e.dataTransfer.getData("application/json"));
      if (job.startDate === targetDateStr) return; // same date, no-op
      // compute day offset and shift both start and end dates
      const oldStart = new Date(job.startDate + "T00:00:00");
      const newStart = new Date(targetDateStr + "T00:00:00");
      const diffMs = newStart - oldStart;
      const newEnd = job.endDate ? new Date(new Date(job.endDate + "T00:00:00").getTime() + diffMs) : newStart;
      const updated = { ...job, startDate: targetDateStr, endDate: fmtDate(newEnd) };
      await saveJob(updated);
    } catch (_) { /* ignore bad data */ }
  };

  const handleDragOver = (e, dateStr) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverDate !== dateStr) setDragOverDate(dateStr);
  };

  const handleDragLeave = () => setDragOverDate(null);

  /* ── job card (mini) ─────────────────────────────────────── */
  const JobPill = ({ job }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, job)}
      onClick={(e) => { e.stopPropagation(); setDetailJob(job); }}
      style={{
        background: job.colour || colours.purple, color: "#fff", borderRadius: 6,
        padding: "2px 6px", fontSize: 11, fontWeight: 600, cursor: "grab",
        marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}
      title={`Drag to reschedule: ${job.title}`}
    >
      {fmtTime(job.startTime)} {job.title}
    </div>
  );

  /* ═══════ MONTH VIEW ═══════ */
  const MonthView = () => {
    const y = viewDate.getFullYear(), m = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(y, m);
    let firstDay = getFirstDayOfMonth(y, m) - 1; // shift Sun=0 → Mon=0
    if (firstDay < 0) firstDay = 6;
    const cells = [];
    // fill blanks before 1st
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    // fill blanks at end
    while (cells.length % 7 !== 0) cells.push(null);

    const todayStr = fmtDate(today);

    return (
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, minWidth: 700 }}>
          {DAYS_SHORT.map(d => (
            <div key={d} style={{ padding: "8px 4px", textAlign: "center", fontWeight: 700, fontSize: 12, color: colours.muted, background: "#F1F5F9" }}>{d}</div>
          ))}
          {cells.map((day, i) => {
            if (day === null) return <div key={`e${i}`} style={{ minHeight: 90, background: "#FAFAFA" }} />;
            const dateStr = `${y}-${pad(m+1)}-${pad(day)}`;
            const dayJobs = jobsOnDate(dateStr);
            const isToday = dateStr === todayStr;
            const isDragOver = dragOverDate === dateStr;
            return (
              <div key={i}
                onClick={() => { setViewDate(new Date(y, m, day)); setView("day"); }}
                onDragOver={(e) => handleDragOver(e, dateStr)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, dateStr)}
                style={{ minHeight: 90, padding: 4, background: isDragOver ? "#E8D5F5" : isToday ? colours.lightPurple : "#fff", cursor: "pointer", border: isDragOver ? `2px dashed ${colours.purple}` : "1px solid #F1F5F9", position: "relative", transition: "background 0.15s" }}>
                <div style={{ fontSize: 12, fontWeight: isToday ? 800 : 500, color: isToday ? colours.purple : colours.text, marginBottom: 2,
                  ...(isToday ? { background: colours.purple, color: "#fff", borderRadius: 99, width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center" } : {}) }}>
                  {day}
                </div>
                {dayJobs.slice(0, 3).map(j => <JobPill key={j.id} job={j} />)}
                {dayJobs.length > 3 && <div style={{ fontSize: 10, color: colours.muted, fontWeight: 600 }}>+{dayJobs.length - 3} more</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ═══════ WEEK VIEW ═══════ */
  const WeekView = () => {
    const weekDates = getWeekDates(viewDate);
    const todayStr = fmtDate(today);
    return (
      <div style={{ overflowX: "auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, minWidth: 700 }}>
          {weekDates.map((d, i) => {
            const dateStr = fmtDate(d);
            const dayJobs = jobsOnDate(dateStr);
            const isToday = dateStr === todayStr;
            const isDragOver = dragOverDate === dateStr;
            return (
              <div key={i}
                onDragOver={(e) => handleDragOver(e, dateStr)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, dateStr)}
                style={{ minHeight: 200, background: isDragOver ? "#E8D5F5" : isToday ? colours.lightPurple : "#fff", border: isDragOver ? `2px dashed ${colours.purple}` : "1px solid #F1F5F9", padding: 6, transition: "background 0.15s" }}>
                <div style={{ textAlign: "center", marginBottom: 6 }}>
                  <div style={{ fontSize: 11, color: colours.muted, fontWeight: 600 }}>{DAYS_SHORT[i]}</div>
                  <div style={{ fontSize: 18, fontWeight: isToday ? 800 : 600, color: isToday ? colours.purple : colours.text }}>{d.getDate()}</div>
                </div>
                {dayJobs.map(j => <JobPill key={j.id} job={j} />)}
                {dayJobs.length === 0 && <div style={{ fontSize: 11, color: "#CBD5E1", textAlign: "center", marginTop: 20 }}>—</div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* ═══════ DAY VIEW (timeline) ═══════ */
  const DayView = () => {
    const dateStr = fmtDate(viewDate);
    const dayJobs = jobsOnDate(dateStr).sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
    const hours = Array.from({ length: 13 }, (_, i) => i + 6); // 6am–6pm

    return (
      <div style={{ position: "relative", marginTop: 8 }}>
        {hours.map(h => {
          const timeStr = `${pad(h)}:00`;
          const slotJobs = dayJobs.filter(j => {
            const jh = parseInt((j.startTime || "09:00").split(":")[0], 10);
            return jh === h;
          });
          return (
            <div key={h} style={{ display: "flex", minHeight: 60, borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ width: 60, flexShrink: 0, fontSize: 12, color: colours.muted, fontWeight: 600, paddingTop: 4 }}>{fmtTime(timeStr)}</div>
              <div style={{ flex: 1, padding: "4px 8px", display: "flex", flexWrap: "wrap", gap: 4, alignItems: "flex-start" }}>
                {slotJobs.map(j => (
                  <div key={j.id} onClick={() => setDetailJob(j)}
                    style={{ background: j.colour || colours.purple, color: "#fff", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 13, fontWeight: 600, minWidth: 120 }}>
                    <div>{j.title}</div>
                    <div style={{ fontSize: 11, opacity: 0.85 }}>{fmtTime(j.startTime)} – {fmtTime(j.endTime)}</div>
                    {j.clientId && <div style={{ fontSize: 10, opacity: 0.7 }}>👤 {getClientName(j.clientId)}</div>}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {dayJobs.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: colours.muted }}>
            No jobs scheduled for {fmtDateAU(dateStr)}
          </div>
        )}
      </div>
    );
  };

  /* ═══════ LIST VIEW ═══════ */
  const ListView = () => {
    const sorted = [...filtered].sort((a, b) => (a.startDate || "").localeCompare(b.startDate || "") || (a.startTime || "").localeCompare(b.startTime || ""));
    if (sorted.length === 0) return <EmptyState icon="📅" title="No jobs found" subtitle="Create your first job to get started" />;

    return (
      <DataTable
        columns={[
          { key: "title", label: "Job Title" },
          { key: "startDate", label: "Date", render: (_v, r) => fmtDateAU(r.startDate) },
          { key: "startTime", label: "Time", render: (_v, r) => fmtTime(r.startTime) },
          { key: "clientId", label: "Contact", render: (_v, r) => getClientName(r.clientId) },
          { key: "propertyId", label: "Property", render: (_v, r) => getPropertyName(r.propertyId) },
          { key: "status", label: "Status", render: (_v, r) => <StatusBadge status={r.status} colours={colours} /> },
          { key: "priority", label: "Priority", render: (_v, r) => <PriorityBadge priority={r.priority} /> },
        ]}
        rows={sorted}
      />
    );
  };

  /* ═══════ view title ═══════ */
  const viewTitle = () => {
    if (view === "month") return `${MONTHS[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
    if (view === "week") {
      const wd = getWeekDates(viewDate);
      return `${fmtDateAU(fmtDate(wd[0]))} – ${fmtDateAU(fmtDate(wd[6]))}`;
    }
    if (view === "day") return fmtDateAU(fmtDate(viewDate));
    return "All Jobs";
  };

  /* ═══════ RENDER ═══════ */
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* Hero */}
      <DashboardHero title="Scheduling" subtitle="Plan, schedule, and track jobs. Link them to contacts and properties.">
        <InsightChip label="Scheduled" value={stats.scheduled} />
        <InsightChip label="In Progress" value={stats.inProgress} />
        <InsightChip label="Completed" value={stats.completed} />
      </DashboardHero>

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <MetricCard label="TOTAL JOBS" value={stats.total} sub="All scheduled work" colour={colours.purple} />
        <MetricCard label="SCHEDULED" value={stats.scheduled} sub="Upcoming jobs" colour="#1E88E5" />
        <MetricCard label="IN PROGRESS" value={stats.inProgress} sub="Currently active" colour="#E65100" />
        <MetricCard label="COMPLETED" value={stats.completed} sub="Finished jobs" colour="#2E7D32" />
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: 16 }}>
        <button style={buttonPrimary} onClick={openNew}>+ Add Job</button>

        <div style={{ display: "flex", gap: 2, background: "#F1F5F9", borderRadius: 10, padding: 3 }}>
          {VIEWS.map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: "6px 14px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
                background: view === v ? colours.purple : "transparent", color: view === v ? "#fff" : colours.muted }}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>

        {view !== "list" && (
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={navPrev} style={{ ...buttonSecondary, padding: "6px 12px" }}>◀</button>
            <button onClick={goToday} style={{ ...buttonSecondary, padding: "6px 12px", fontWeight: 700 }}>Today</button>
            <button onClick={navNext} style={{ ...buttonSecondary, padding: "6px 12px" }}>▶</button>
            <span style={{ fontWeight: 700, fontSize: 15, color: colours.text, marginLeft: 6 }}>{viewTitle()}</span>
          </div>
        )}

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <select style={{ ...inputStyle, width: "auto", minWidth: 130 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input style={{ ...inputStyle, width: 180 }} placeholder="Search jobs…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* Calendar / list area */}
      <div style={{ ...cardStyle, padding: view === "list" ? 0 : 12 }}>
        {view === "month" && <MonthView />}
        {view === "week" && <WeekView />}
        {view === "day" && <DayView />}
        {view === "list" && <ListView />}
      </div>

      {/* ═══ JOB DETAIL PANEL ═══ */}
      {detailJob && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", justifyContent: "flex-end" }} onClick={() => { setDetailJob(null); setDetailTab("info"); }}>
          <div style={{ background: "rgba(0,0,0,0.25)", position: "absolute", inset: 0 }} />
          <div onClick={e => e.stopPropagation()}
            style={{ position: "relative", width: 560, maxWidth: "95vw", background: "#fff", height: "100vh", overflowY: "auto", padding: 28, boxShadow: "-4px 0 24px rgba(0,0,0,0.12)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ width: 40, height: 6, borderRadius: 3, background: detailJob.colour || colours.purple, marginBottom: 10 }} />
                <h2 style={{ fontSize: 22, fontWeight: 800, color: colours.text, margin: 0 }}>{detailJob.title}</h2>
              </div>
              <button onClick={() => { setDetailJob(null); setDetailTab("info"); }} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: colours.muted }}>✕</button>
            </div>

            {/* Tab bar */}
            <div style={{ display: "flex", gap: 2, background: "#F1F5F9", borderRadius: 10, padding: 3, marginBottom: 16 }}>
              {["info", "costs"].map(t => (
                <button key={t} onClick={() => setDetailTab(t)}
                  style={{ padding: "6px 16px", borderRadius: 8, border: "none", fontWeight: 700, fontSize: 13, cursor: "pointer",
                    background: detailTab === t ? colours.purple : "transparent", color: detailTab === t ? "#fff" : colours.muted }}>
                  {t === "info" ? "Details" : "Costs & Financials"}
                </button>
              ))}
            </div>

            {detailTab === "info" && (<>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <StatusBadge status={detailJob.status} colours={colours} />
                <PriorityBadge priority={detailJob.priority} />
              </div>

              {/* Quick financial summary */}
              {(() => {
                const fin = computeJobFinancials(detailJob);
                return (fin.quotedTotal > 0 || fin.totalCost > 0) ? (
                  <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                    {fin.quotedTotal > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: colours.purple, background: colours.lightPurple || "#F3E5F5", padding: "4px 12px", borderRadius: 99 }}>Quoted: {currency(fin.quotedTotal)}</span>}
                    {fin.totalCost > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: "#1565C0", background: "#E3F2FD", padding: "4px 12px", borderRadius: 99 }}>Cost: {currency(fin.totalCost)}</span>}
                    {fin.quotedTotal > 0 && <span style={{ fontSize: 12, fontWeight: 700, color: fin.grossMarginPct >= 20 ? "#2E7D32" : "#E65100", background: fin.grossMarginPct >= 20 ? "#E8F5E9" : "#FFF3E0", padding: "4px 12px", borderRadius: 99 }}>Margin: {fin.grossMarginPct.toFixed(0)}%</span>}
                  </div>
                ) : null;
              })()}

              <div style={{ display: "grid", gap: 12, fontSize: 14 }}>
                <div><span style={{ color: colours.muted, fontWeight: 600 }}>📅 Date</span><br/>{fmtDateAU(detailJob.startDate)}{detailJob.endDate && detailJob.endDate !== detailJob.startDate ? ` – ${fmtDateAU(detailJob.endDate)}` : ""}</div>
                <div><span style={{ color: colours.muted, fontWeight: 600 }}>🕐 Time</span><br/>{fmtTime(detailJob.startTime)} – {fmtTime(detailJob.endTime)}</div>
                {detailJob.clientId && <div><span style={{ color: colours.muted, fontWeight: 600 }}>👤 Contact</span><br/>{getClientName(detailJob.clientId)}</div>}
                {detailJob.propertyId && <div><span style={{ color: colours.muted, fontWeight: 600 }}>🏠 Property</span><br/>{getPropertyName(detailJob.propertyId)}{detailJob.subLocationId ? ` › ${getSubLocations(detailJob.propertyId).find(s => s.id === detailJob.subLocationId)?.name || ""}` : ""}</div>}
                {detailJob.assignedTo && <div><span style={{ color: colours.muted, fontWeight: 600 }}>👷 Assigned to</span><br/>{detailJob.assignedTo}</div>}
                {detailJob.description && <div><span style={{ color: colours.muted, fontWeight: 600 }}>📝 Description</span><br/>{detailJob.description}</div>}
                {detailJob.notes && <div><span style={{ color: colours.muted, fontWeight: 600 }}>📌 Notes</span><br/>{detailJob.notes}</div>}
              </div>

              <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
                <button style={buttonPrimary} onClick={() => openEdit(detailJob)}>Edit Job</button>
                <button style={{ ...buttonSecondary, color: "#C62828" }} onClick={() => handleDelete(detailJob)}>Delete</button>
                <button style={buttonSecondary} onClick={() => setDetailTab("costs")}>View Costs</button>
                <button style={{ ...buttonSecondary, color: "#6A1B9A", borderColor: "#6A1B9A" }} onClick={() => {
                  const w = window.open("", "_blank");
                  if (w) writeJobSheetPreviewToWindow(w, detailJob, { profile, clients, properties });
                }}>📄 Job Sheet</button>
              </div>
            </>)}

            {detailTab === "costs" && (
              <JobCostingPanel
                job={detailJob}
                onUpdate={async (updated) => { await saveJob(updated); setDetailJob(updated); }}
                colours={colours} cardStyle={cardStyle} inputStyle={inputStyle} labelStyle={labelStyle}
                buttonPrimary={buttonPrimary} buttonSecondary={buttonSecondary}
                currency={currency} quotes={quotes} invoices={invoices}
                authUser={authUser}
              />
            )}
          </div>
        </div>
      )}

      {/* ═══ JOB FORM MODAL ═══ */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "rgba(0,0,0,0.35)", position: "absolute", inset: 0 }} onClick={closeForm} />
          <div style={{ position: "relative", background: "#fff", borderRadius: 18, padding: 32, width: 560, maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: colours.text, marginBottom: 20 }}>{editingJob ? "Edit Job" : "New Job"}</h2>

            <div style={{ display: "grid", gap: 14 }}>
              {/* Title */}
              <div>
                <label style={labelStyle}>Job Title *</label>
                <input style={inputStyle} value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. Fence repair at Smith Farm" />
              </div>

              {/* Date/Time row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Start Date</label>
                  <input type="date" style={inputStyle} value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Start Time</label>
                  <input type="time" style={inputStyle} value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>End Date</label>
                  <input type="date" style={inputStyle} value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>End Time</label>
                  <input type="time" style={inputStyle} value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} />
                </div>
              </div>

              {/* Status + Priority */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select style={inputStyle} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Priority</label>
                  <select style={inputStyle} value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                    {PRIORITY_OPTIONS.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Contact */}
              <div>
                <label style={labelStyle}>Link to Contact</label>
                <select style={inputStyle} value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}>
                  <option value="">— none —</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Property + Sub-location */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Link to Property</label>
                  <select style={inputStyle} value={form.propertyId} onChange={e => setForm(f => ({ ...f, propertyId: e.target.value, subLocationId: "" }))}>
                    <option value="">— none —</option>
                    {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                {form.propertyId && getSubLocations(form.propertyId).length > 0 && (
                  <div>
                    <label style={labelStyle}>Sub-location</label>
                    <select style={inputStyle} value={form.subLocationId} onChange={e => setForm(f => ({ ...f, subLocationId: e.target.value }))}>
                      <option value="">— none —</option>
                      {getSubLocations(form.propertyId).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Assigned + Colour */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={labelStyle}>Assigned To</label>
                  <input style={inputStyle} value={form.assignedTo} onChange={e => setForm(f => ({ ...f, assignedTo: e.target.value }))} placeholder="Staff name" />
                </div>
                <div>
                  <label style={labelStyle}>Colour</label>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    {COLOUR_OPTIONS.map(c => (
                      <div key={c.value} onClick={() => setForm(f => ({ ...f, colour: c.value }))}
                        style={{ width: 28, height: 28, borderRadius: 8, background: c.value, cursor: "pointer",
                          border: form.colour === c.value ? "3px solid #333" : "2px solid transparent" }}
                        title={c.label} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, minHeight: 60 }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Job details…" />
              </div>

              {/* Notes */}
              <div>
                <label style={labelStyle}>Notes</label>
                <textarea style={{ ...inputStyle, minHeight: 50 }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Internal notes…" />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
              <button style={buttonSecondary} onClick={closeForm}>Cancel</button>
              <button style={buttonPrimary} onClick={handleSave}>{editingJob ? "Save Changes" : "Create Job"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
