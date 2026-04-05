import React from "react";

const SERVICES = [
  {
    icon: "🚜",
    title: "Tractor & Harvester Valuations",
    description:
      "Comprehensive market-value assessments for tractors, headers, harvesters, and other primary machinery. Includes condition grading, hours-of-use analysis, and comparable sales data.",
  },
  {
    icon: "🔧",
    title: "Implements & Attachments",
    description:
      "Evaluations covering ploughs, seeders, sprayers, balers, and all bolt-on implements. Each report details wear, remaining service life, and current replacement cost.",
  },
  {
    icon: "🚛",
    title: "Trucks & Transport Equipment",
    description:
      "Valuations for farm trucks, trailers, grain bins on wheels, and livestock transport. Roadworthy status, compliance, and market positioning included.",
  },
  {
    icon: "🏗️",
    title: "Fixed Plant & Infrastructure",
    description:
      "Assessments of silos, augers, irrigation systems, sheds, and other fixed assets. Ideal for insurance, finance, or succession planning purposes.",
  },
  {
    icon: "📋",
    title: "Pre-Purchase Inspections",
    description:
      "Independent inspections before buying or selling farm equipment. Mitchell provides an unbiased written report covering mechanical, structural, and cosmetic condition.",
  },
  {
    icon: "📊",
    title: "Insurance & Finance Reports",
    description:
      "Formal valuation certificates accepted by major insurers and lenders. Suitable for asset-backed lending, agreed-value policies, and lease arrangements.",
  },
];

export default function FarmEquipmentPage(props) {
  const {
    colours = {},
    cardStyle = {},
    buttonPrimary = {},
    buttonSecondary = {},
    DashboardHero,
    InsightChip,
    SectionCard,
    profile = {},
  } = props;

  const purple = colours.purple || "#6A1B9A";
  const teal = colours.teal || "#00897B";
  const navy = colours.navy || "#14202B";

  return (
    <div style={{ display: "grid", gap: 24 }}>
      {/* Hero */}
      {DashboardHero && (
        <DashboardHero
          title="Farm Equipment Evaluations"
          subtitle="Professional valuations and inspections by Mitchell"
        >
          <InsightChip label="Independent Reports" value="✓" />
          <InsightChip label="Insurance Ready" value="✓" />
          <InsightChip label="Finance Approved" value="✓" />
        </DashboardHero>
      )}

      {/* About Mitchell */}
      {SectionCard && (
        <SectionCard title="About Mitchell">
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) minmax(0,1.5fr)", gap: 24, alignItems: "center" }}>
            <div
              style={{
                background: `linear-gradient(135deg, ${navy} 0%, ${purple} 60%, ${teal} 100%)`,
                borderRadius: 20,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                minHeight: 220,
              }}
            >
              <div style={{ fontSize: 64 }}>👨‍🌾</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: "#fff" }}>Mitchell</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600, fontFamily: "'DM Sans', sans-serif", textAlign: "center" }}>
                Farm Equipment Evaluator
              </div>
            </div>
            <div style={{ display: "grid", gap: 14 }}>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: colours.text || "#14202B", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                Mitchell is our specialist farm equipment evaluator with extensive hands-on experience
                in agricultural machinery. He provides independent, professional valuations for a wide
                range of farm equipment — from tractors and harvesters through to fixed plant and
                infrastructure.
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: colours.text || "#14202B", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                Whether you need a valuation for insurance, finance, buying, selling, or succession
                planning, Mitchell delivers thorough, well-documented reports that are trusted by
                lenders, insurers, and industry professionals across the region.
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
                {["Certified Valuations", "On-Site Inspections", "Regional Coverage"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: `${teal}14`,
                      color: teal,
                      border: `1px solid ${teal}30`,
                      borderRadius: 999,
                      padding: "6px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* Services Grid */}
      {SectionCard && (
        <SectionCard title="Evaluation Services">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            {SERVICES.map((svc) => (
              <div
                key={svc.title}
                style={{
                  ...cardStyle,
                  padding: 22,
                  borderRadius: 18,
                  display: "grid",
                  gap: 10,
                  alignContent: "start",
                  transition: "box-shadow 0.2s ease, transform 0.2s ease",
                }}
                className="sas-card-hover"
              >
                <div style={{ fontSize: 32 }}>{svc.icon}</div>
                <div
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 17,
                    fontWeight: 800,
                    color: navy,
                  }}
                >
                  {svc.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: colours.muted || "#64748B",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {svc.description}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* CTA */}
      {SectionCard && (
        <SectionCard title="Request an Evaluation">
          <div
            style={{
              background: `linear-gradient(135deg, ${navy} 0%, ${purple} 70%)`,
              borderRadius: 20,
              padding: 32,
              color: "#fff",
              textAlign: "center",
              display: "grid",
              gap: 14,
            }}
          >
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 900 }}>
              Need a farm equipment evaluation?
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.9, maxWidth: 540, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
              Get in touch to arrange an on-site inspection with Mitchell. We provide formal valuation
              reports for insurance, finance, sale, or internal asset management purposes.
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 8 }}>
              <a
                href={`mailto:${profile.email || "info@sharonogier.com"}?subject=Farm Equipment Evaluation Request`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#fff",
                  color: purple,
                  borderRadius: 12,
                  padding: "12px 28px",
                  fontWeight: 800,
                  fontSize: 14,
                  textDecoration: "none",
                  fontFamily: "'DM Sans', sans-serif",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                }}
              >
                📧 Email Us
              </a>
              {profile.phone && (
                <a
                  href={`tel:${profile.phone}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    background: "rgba(255,255,255,0.15)",
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: 12,
                    padding: "12px 28px",
                    fontWeight: 800,
                    fontSize: 14,
                    textDecoration: "none",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  📞 Call Us
                </a>
              )}
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
