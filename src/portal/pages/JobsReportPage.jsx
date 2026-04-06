import React, { useMemo, useState } from "react";
import { computeJobFinancials } from "./JobCostingPanel";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const safe = (v) => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };

export default function JobsReportPage({
  jobs = [], invoices = [], quotes = [], clients = [],
  colours, cardStyle, buttonPrimary, buttonSecondary, inputStyle, labelStyle,
  currency, formatDateAU, safeNumber,
  DashboardHero, InsightChip, MetricCard, SectionCard, DataTable, EmptyState,
  setActivePage,
}) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const clientMap = useMemo(() => Object.fromEntries(clients.map(c => [String(c.id), c])), [clients]);
  const getClientName = (id) => clientMap[String(id)]?.name || "—";

  const filteredJobs = useMemo(() => {
    let list = jobs;
    if (dateFrom) list = list.filter(j => (j.startDate || "") >= dateFrom);
    if (dateTo) list = list.filter(j => (j.startDate || "") <= dateTo);
    return list;
  }, [jobs, dateFrom, dateTo]);

  const report = useMemo(() => {
    let totalRevenue = 0, totalCost = 0, totalSubUnpaid = 0, totalSubPaid = 0;
    const rows = filteredJobs.map(job => {
      const fin = computeJobFinancials(job);
      // Find linked invoice revenue
      const linkedInv = invoices.find(inv => String(inv.jobId) === String(job.id) || String(inv.id) === String(job.invoiceId));
      const invoiceTotal = linkedInv ? safe(linkedInv.total) : 0;
      const invoiceStatus = linkedInv?.status || "No Invoice";
      const revenue = invoiceTotal || fin.quotedTotal;
      totalRevenue += revenue;
      totalCost += fin.totalCost;
      totalSubUnpaid += fin.subUnpaid;
      totalSubPaid += fin.subPaid;
      return { ...job, fin, revenue, invoiceTotal, invoiceStatus, linkedInv };
    });
    const totalMargin = totalRevenue - totalCost;
    const totalMarginPct = totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0;
    return { rows, totalRevenue, totalCost, totalMargin, totalMarginPct, totalSubUnpaid, totalSubPaid };
  }, [filteredJobs, invoices]);

  const PIE_COLORS = [colours.teal || "#006D6D", colours.purple || "#6A1B9A", "#E65100", "#1E88E5", "#64748B"];

  const costBreakdown = useMemo(() => {
    let labour = 0, materials = 0, subcontractor = 0, misc = 0;
    report.rows.forEach(r => { labour += r.fin.labour; materials += r.fin.materials; subcontractor += r.fin.subcontractor; misc += r.fin.misc; });
    return [
      { name: "Labour", value: labour },
      { name: "Materials", value: materials },
      { name: "Subcontractor", value: subcontractor },
      { name: "Misc", value: misc },
    ].filter(x => x.value > 0);
  }, [report]);

  const jobMarginData = useMemo(() =>
    report.rows.filter(r => r.revenue > 0 || r.fin.totalCost > 0).slice(0, 20).map(r => ({
      name: (r.title || "").substring(0, 15),
      Revenue: r.revenue,
      Cost: r.fin.totalCost,
      Margin: r.revenue - r.fin.totalCost,
    }))
  , [report]);

  const tooltipStyle = { background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "10px 14px", fontSize: 13 };

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <DashboardHero title="Jobs Financial Report" subtitle="Revenue, costs, margins, and outstanding payments across all jobs.">
        <InsightChip label="Revenue" value={currency(report.totalRevenue)} />
        <InsightChip label="Margin" value={`${report.totalMarginPct.toFixed(1)}%`} />
        <InsightChip label="Sub Unpaid" value={currency(report.totalSubUnpaid)} />
      </DashboardHero>

      {/* Metric cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <MetricCard label="TOTAL REVENUE" value={currency(report.totalRevenue)} sub="From invoiced/quoted amounts" colour={colours.teal} />
        <MetricCard label="TOTAL COSTS" value={currency(report.totalCost)} sub="Labour + Materials + Subs + Misc" colour="#1E88E5" />
        <MetricCard label="GROSS MARGIN" value={currency(report.totalMargin)} sub={`${report.totalMarginPct.toFixed(1)}% margin`} colour={report.totalMarginPct >= 20 ? "#2E7D32" : "#E65100"} />
        <MetricCard label="SUB UNPAID" value={currency(report.totalSubUnpaid)} sub="Subcontractor invoices owing" colour="#C62828" />
        <MetricCard label="SUB PAID" value={currency(report.totalSubPaid)} sub="Subcontractor invoices settled" colour="#2E7D32" />
      </div>

      {/* Date filter */}
      <div style={{ display: "flex", gap: 10, alignItems: "end", flexWrap: "wrap" }}>
        <div><label style={labelStyle}>From</label><input type="date" style={inputStyle} value={dateFrom} onChange={e => setDateFrom(e.target.value)} /></div>
        <div><label style={labelStyle}>To</label><input type="date" style={inputStyle} value={dateTo} onChange={e => setDateTo(e.target.value)} /></div>
        {(dateFrom || dateTo) && <button style={{ ...buttonSecondary, fontSize: 12 }} onClick={() => { setDateFrom(""); setDateTo(""); }}>Clear</button>}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        {jobMarginData.length > 0 && (
          <div style={{ ...cardStyle, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: colours.text, marginBottom: 12 }}>Revenue vs Cost by Job</div>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobMarginData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: colours.muted }} />
                  <YAxis tick={{ fontSize: 11, fill: colours.muted }} tickFormatter={v => currency(v)} />
                  <Tooltip contentStyle={tooltipStyle} formatter={v => currency(v)} />
                  <Bar dataKey="Revenue" fill={colours.teal} radius={[4,4,0,0]} />
                  <Bar dataKey="Cost" fill={colours.purple} radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        {costBreakdown.length > 0 && (
          <div style={{ ...cardStyle, padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: colours.text, marginBottom: 12 }}>Cost Breakdown</div>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={costBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={100} paddingAngle={3} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                    labelLine={{ stroke: colours.muted, strokeWidth: 1 }}>
                    {costBreakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={v => currency(v)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Jobs table */}
      <SectionCard title="Job-by-Job Breakdown">
        {report.rows.length === 0 ? <EmptyState icon="📊" title="No jobs found" subtitle="Create jobs with costs to see the report" /> : (
          <DataTable
            columns={[
              { key: "title", label: "Job" },
              { key: "clientId", label: "Client", render: (_v, r) => getClientName(r.clientId) },
              { key: "startDate", label: "Date", render: (_v, r) => formatDateAU ? formatDateAU(r.startDate) : r.startDate },
              { key: "revenue", label: "Revenue", render: (_v, r) => currency(r.revenue) },
              { key: "totalCost", label: "Cost", render: (_v, r) => currency(r.fin.totalCost) },
              { key: "margin", label: "Margin", render: (_v, r) => {
                const m = r.revenue - r.fin.totalCost;
                const pct = r.revenue > 0 ? ((m / r.revenue) * 100).toFixed(0) : "0";
                return <span style={{ color: m >= 0 ? "#2E7D32" : "#C62828", fontWeight: 700 }}>{currency(m)} ({pct}%)</span>;
              }},
              { key: "invoiceStatus", label: "Invoice", render: (_v, r) => {
                const statusMap = { Paid: { bg: "#E8F5E9", color: "#2E7D32" }, Sent: { bg: "#E3F2FD", color: "#1565C0" }, Overdue: { bg: "#FFEBEE", color: "#C62828" }, Draft: { bg: "#F1F5F9", color: "#64748B" } };
                const s = statusMap[r.invoiceStatus] || { bg: "#F1F5F9", color: "#64748B" };
                return <span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 11, fontWeight: 700, background: s.bg, color: s.color }}>{r.invoiceStatus}</span>;
              }},
              { key: "subStatus", label: "Sub Payments", render: (_v, r) => {
                const unpaid = r.fin.subUnpaid;
                if ((r.costs?.subcontractor || []).length === 0) return <span style={{ color: "#64748B", fontSize: 11 }}>—</span>;
                return unpaid > 0
                  ? <span style={{ color: "#C62828", fontWeight: 700, fontSize: 12 }}>Owing: {currency(unpaid)}</span>
                  : <span style={{ color: "#2E7D32", fontWeight: 700, fontSize: 12 }}>✓ Paid</span>;
              }},
            ]}
            rows={report.rows}
          />
        )}
      </SectionCard>
    </div>
  );
}
