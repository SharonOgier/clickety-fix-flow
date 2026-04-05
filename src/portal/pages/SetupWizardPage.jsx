import React, { useState } from "react";

const STEPS = [
  { key: "welcome", label: "Welcome" },
  { key: "business", label: "Business Details" },
  { key: "personal", label: "Your Details" },
  { key: "preferences", label: "Preferences" },
];

export default function SetupWizardPage(props) {
  const {
    wizardForm = {},
    setWizardForm = () => {},
    wizardSaving = false,
    colours = {},
    cardStyle = {},
    buttonPrimary = {},
    buttonSecondary = {},
    inputStyle = {},
    labelStyle = {},
    completeSetupWizard = () => {},
    authUser = {},
  } = props;

  const [step, setStep] = useState(0);

  const update = (field, value) => setWizardForm((f) => ({ ...f, [field]: value }));

  const canProceedFromBusiness = (wizardForm.businessName || "").trim().length > 0;
  const canProceedFromPersonal = (wizardForm.firstName || "").trim().length > 0;

  const purple = colours.purple || "#6A1B9A";
  const teal = colours.teal || "#00897B";
  const navy = colours.navy || "#14202B";

  const progressBar = (
    <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 32 }}>
      {STEPS.map((s, i) => {
        const active = step === i;
        const done = step > i;
        return (
          <React.Fragment key={s.key}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif",
                  background: done ? teal : active ? purple : (colours.border || "#E2E8F0"),
                  color: done || active ? "#fff" : (colours.muted || "#64748B"),
                  transition: "all 0.3s ease",
                  boxShadow: active ? `0 4px 16px ${purple}44` : "none",
                }}
              >
                {done ? "✓" : i + 1}
              </div>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: active ? 800 : 600,
                  color: active ? purple : done ? teal : (colours.muted || "#64748B"),
                  fontFamily: "'DM Sans', sans-serif",
                  letterSpacing: 0.2,
                }}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 3,
                  borderRadius: 3,
                  background: step > i ? teal : (colours.border || "#E2E8F0"),
                  transition: "background 0.3s ease",
                  marginTop: -18,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const fieldGroup = (label, field, placeholder, type = "text", extra) => (
    <div style={{ display: "grid", gap: 4 }}>
      <label style={{ ...labelStyle, fontFamily: "'DM Sans', sans-serif" }}>{label}</label>
      <input
        style={{ ...inputStyle, fontFamily: "'DM Sans', sans-serif" }}
        type={type}
        value={wizardForm[field] || ""}
        onChange={(e) => update(field, e.target.value)}
        placeholder={placeholder}
      />
      {extra && <span style={{ fontSize: 12, color: colours.muted || "#64748B", lineHeight: 1.5 }}>{extra}</span>}
    </div>
  );

  const stepContent = () => {
    switch (step) {
      case 0:
        return (
          <div style={{ textAlign: "center", display: "grid", gap: 20 }}>
            <div style={{ fontSize: 56, marginBottom: 4 }}>🚀</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: navy, margin: 0 }}>
              Welcome to your portal!
            </h2>
            <p style={{ fontSize: 15, color: colours.muted || "#64748B", lineHeight: 1.8, maxWidth: 480, margin: "0 auto" }}>
              Let's get your business set up in just a few steps. We'll collect your business details,
              personal information, and preferences so everything is ready for invoicing, quoting, and
              financial reporting.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginTop: 8 }}>
              {[
                ["📄", "Invoices & Quotes", "Professional documents with your branding"],
                ["📊", "Financial Insights", "Live dashboards and BAS-ready reports"],
                ["💼", "Client Management", "Track clients, expenses, and income sources"],
              ].map(([icon, title, desc]) => (
                <div
                  key={title}
                  style={{
                    background: `${purple}08`,
                    border: `1px solid ${purple}18`,
                    borderRadius: 16,
                    padding: 18,
                    textAlign: "left",
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 14, color: navy, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 12, color: colours.muted || "#64748B", lineHeight: 1.6 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div style={{ display: "grid", gap: 20 }}>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: navy, margin: "0 0 6px" }}>
                Business Details
              </h3>
              <p style={{ fontSize: 14, color: colours.muted || "#64748B", lineHeight: 1.7, margin: 0 }}>
                This information will appear on your invoices, quotes, and official documents.
              </p>
            </div>
            {fieldGroup("Business Name *", "businessName", "e.g. Sharon's Accounting Service")}
            {fieldGroup("Legal Business Name", "legalBusinessName", "e.g. Sharon Ogier Pty Ltd", "text", "Leave blank if same as business name")}
            {fieldGroup("ABN", "abn", "e.g. 12 345 678 901", "text", "Your Australian Business Number")}
            {fieldGroup("Business Address", "address", "e.g. 123 Main St, Sydney NSW 2000")}
            <div style={{ display: "grid", gap: 4 }}>
              <label style={{ ...labelStyle, fontFamily: "'DM Sans', sans-serif" }}>GST Registered?</label>
              <div style={{ display: "flex", gap: 12 }}>
                {[true, false].map((val) => (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => update("gstRegistered", val)}
                    style={{
                      padding: "10px 24px",
                      borderRadius: 10,
                      border: `2px solid ${wizardForm.gstRegistered === val ? purple : (colours.border || "#E2E8F0")}`,
                      background: wizardForm.gstRegistered === val ? `${purple}12` : "#fff",
                      color: wizardForm.gstRegistered === val ? purple : (colours.muted || "#64748B"),
                      fontWeight: 700,
                      fontSize: 14,
                      fontFamily: "'DM Sans', sans-serif",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {val ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div style={{ display: "grid", gap: 20 }}>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: navy, margin: "0 0 6px" }}>
                Your Details
              </h3>
              <p style={{ fontSize: 14, color: colours.muted || "#64748B", lineHeight: 1.7, margin: 0 }}>
                Tell us a bit about yourself. This is used for correspondence and document signing.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {fieldGroup("First Name *", "firstName", "First name")}
              {fieldGroup("Last Name", "lastName", "Last name")}
            </div>
            {fieldGroup("Preferred Name", "preferredName", "What should we call you?", "text", "Displayed in greetings and quick notes")}
            {fieldGroup("Email", "email", authUser?.email || "you@example.com", "email")}
            {fieldGroup("Phone", "phone", "e.g. 0412 345 678")}
            {fieldGroup("Work Type", "workType", "e.g. Financial / Management Accountant")}
          </div>
        );

      case 3:
        return (
          <div style={{ display: "grid", gap: 20 }}>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 900, color: navy, margin: "0 0 6px" }}>
                Almost done!
              </h3>
              <p style={{ fontSize: 14, color: colours.muted || "#64748B", lineHeight: 1.7, margin: 0 }}>
                Review your details below and hit "Complete Setup" to launch your portal.
              </p>
            </div>
            <div
              style={{
                background: `${purple}06`,
                border: `1px solid ${purple}14`,
                borderRadius: 16,
                padding: 20,
                display: "grid",
                gap: 12,
              }}
            >
              {[
                ["Business", wizardForm.businessName || "—"],
                ["Legal Name", wizardForm.legalBusinessName || "(same as business)"],
                ["ABN", wizardForm.abn || "—"],
                ["Address", wizardForm.address || "—"],
                ["GST Registered", wizardForm.gstRegistered ? "Yes" : "No"],
                ["Name", [wizardForm.firstName, wizardForm.lastName].filter(Boolean).join(" ") || "—"],
                ["Preferred Name", wizardForm.preferredName || "—"],
                ["Email", wizardForm.email || authUser?.email || "—"],
                ["Phone", wizardForm.phone || "—"],
                ["Work Type", wizardForm.workType || "—"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, color: colours.muted || "#64748B" }}>{label}</span>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: navy, textAlign: "right" }}>{value}</span>
                </div>
              ))}
            </div>
            <div
              style={{
                background: `${teal}10`,
                border: `1px solid ${teal}22`,
                borderRadius: 14,
                padding: 16,
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
              }}
            >
              <span style={{ fontSize: 22 }}>💡</span>
              <span style={{ fontSize: 13, color: colours.muted || "#64748B", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                You can update any of these details later from <strong>Settings → Profile</strong>.
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${colours.bg || "#F8FAFC"} 0%, #EEF4FF 60%, ${purple}08 100%)`,
        padding: 24,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22,
              fontWeight: 900,
              color: purple,
              marginBottom: 4,
            }}
          >
            {wizardForm.businessName || "Your Portal"}
          </div>
          <div style={{ fontSize: 13, color: colours.muted || "#64748B" }}>Account Setup</div>
        </div>

        {/* Progress */}
        {progressBar}

        {/* Card */}
        <div
          style={{
            ...cardStyle,
            padding: 32,
            borderRadius: 24,
            boxShadow: "0 20px 60px rgba(15,23,42,0.08)",
          }}
        >
          {stepContent()}

          {/* Navigation buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: step === 0 ? "flex-end" : "space-between",
              alignItems: "center",
              marginTop: 28,
              gap: 12,
            }}
          >
            {step > 0 && (
              <button
                type="button"
                style={{ ...buttonSecondary, fontFamily: "'DM Sans', sans-serif" }}
                onClick={() => setStep((s) => s - 1)}
              >
                ← Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                style={{
                  ...buttonPrimary,
                  fontFamily: "'DM Sans', sans-serif",
                  opacity:
                    (step === 1 && !canProceedFromBusiness) || (step === 2 && !canProceedFromPersonal)
                      ? 0.5
                      : 1,
                }}
                disabled={(step === 1 && !canProceedFromBusiness) || (step === 2 && !canProceedFromPersonal)}
                onClick={() => setStep((s) => s + 1)}
              >
                Continue →
              </button>
            ) : (
              <button
                type="button"
                style={{
                  ...buttonPrimary,
                  fontFamily: "'DM Sans', sans-serif",
                  opacity: wizardSaving ? 0.6 : 1,
                }}
                disabled={wizardSaving}
                onClick={completeSetupWizard}
              >
                {wizardSaving ? "Setting up..." : "🚀 Complete Setup"}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: colours.muted || "#94A3B8" }}>
          Need help? Contact your administrator or check the portal guide.
        </div>
      </div>
    </div>
  );
}
