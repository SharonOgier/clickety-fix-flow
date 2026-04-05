import React from "react";

// Stub SetupWizardPage — replace with actual implementation when available
export default function SetupWizardPage(props) {
  const {
    wizardForm = {},
    setWizardForm = () => {},
    wizardSaving = false,
    colours = {},
    cardStyle = {},
    buttonPrimary = {},
    inputStyle = {},
    labelStyle = {},
    completeSetupWizard = () => {},
  } = props;

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(180deg, ${colours.bg || '#F8FAFC'} 0%, #EEF4FF 100%)`, padding: 24 }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <div style={{ ...cardStyle, padding: 32, borderRadius: 24 }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, marginBottom: 16, color: colours.purple || '#6A1B9A' }}>
            Welcome! Let's set up your portal
          </h2>
          <p style={{ color: colours.muted || '#64748B', marginBottom: 24 }}>
            Complete your business profile to get started with invoicing, expenses, and financial reporting.
          </p>
          <div style={{ display: "grid", gap: 16 }}>
            <div>
              <label style={labelStyle}>Business Name</label>
              <input style={inputStyle} value={wizardForm.businessName || ""} onChange={(e) => setWizardForm(f => ({ ...f, businessName: e.target.value }))} placeholder="Your business name" />
            </div>
            <div>
              <label style={labelStyle}>First Name</label>
              <input style={inputStyle} value={wizardForm.firstName || ""} onChange={(e) => setWizardForm(f => ({ ...f, firstName: e.target.value }))} placeholder="First name" />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input style={inputStyle} value={wizardForm.lastName || ""} onChange={(e) => setWizardForm(f => ({ ...f, lastName: e.target.value }))} placeholder="Last name" />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} value={wizardForm.email || ""} onChange={(e) => setWizardForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" />
            </div>
            <div>
              <label style={labelStyle}>ABN</label>
              <input style={inputStyle} value={wizardForm.abn || ""} onChange={(e) => setWizardForm(f => ({ ...f, abn: e.target.value }))} placeholder="Australian Business Number" />
            </div>
            <button
              style={{ ...buttonPrimary, width: "100%", justifyContent: "center", marginTop: 8 }}
              onClick={completeSetupWizard}
              disabled={wizardSaving}
            >
              {wizardSaving ? "Saving..." : "Complete Setup"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
