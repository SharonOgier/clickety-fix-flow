import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "signin";

  const [authMode, setAuthMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSubmit = () => {
    // Will be connected to Lovable Cloud auth later
    alert(`${authMode === "signup" ? "Sign up" : "Sign in"} with ${email} — auth will be connected soon!`);
  };

  const handlePasswordReset = () => {
    if (email) {
      setShowResetModal(true);
    } else {
      alert("Please enter your email first.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen p-6" style={{ background: "var(--gradient-page)" }}>
      {/* Reset sent modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[99999] bg-foreground/50 flex items-center justify-center p-5">
          <div className="bg-card rounded-lg p-9 w-full max-w-[420px] shadow-brand text-center">
            <div className="text-5xl mb-4">📧</div>
            <div className="text-xl font-extrabold text-foreground mb-3">Check your email</div>
            <div className="text-sm text-muted-foreground leading-relaxed mb-2">A password reset link has been sent to</div>
            <div className="text-[15px] font-bold text-primary mb-5">{email}</div>
            <div className="text-sm text-muted-foreground/70 leading-relaxed mb-7">
              Click the link in the email to set a new password. Check your spam folder if it doesn't arrive within a few minutes.
            </div>
            <button
              onClick={() => setShowResetModal(false)}
              className="w-full bg-primary text-primary-foreground border-none rounded-md py-3 px-8 text-[15px] font-bold cursor-pointer"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1180px] mx-auto grid gap-5">
        {/* Header */}
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <Link to="/" className="text-2xl font-black text-primary font-serif">
            Sharon's Accounting Service
          </Link>
          <Link
            to="/landing"
            className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-md px-5 py-3 font-extrabold text-sm shadow-brand"
          >
            ← Back to Landing
          </Link>
        </div>

        {/* Auth layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_minmax(320px,460px)] gap-6 items-stretch">
          {/* Left promo panel */}
          <div
            className="rounded-xl p-8 text-primary-foreground shadow-brand flex flex-col justify-between min-h-[520px]"
            style={{ background: "var(--gradient-cta)" }}
          >
            <div className="grid gap-5">
              <span className="inline-flex items-center gap-2 bg-primary-foreground/15 px-3 py-2 rounded-full text-xs font-extrabold tracking-wide w-fit">
                Client portal access
              </span>
              <h1 className="text-3xl lg:text-[44px] leading-[1.05] font-black max-w-[560px]">
                Login to your portal from the landing page
              </h1>
              <p className="text-base leading-relaxed opacity-90 max-w-[620px]">
                View invoices, quotes, expenses, documents and financial reports from one secure portal.
              </p>
            </div>

            <div className="grid gap-3.5 mt-6">
              {[
                ["Invoices & quotes", "Create, send and review client billing documents."],
                ["Financial reporting", "View live insights, receivables, cash flow and BAS support."],
                ["Secure access", "Sign-in with password reset and account setup flow."],
              ].map(([title, copy]) => (
                <div key={title} className="bg-primary-foreground/15 border border-primary-foreground/15 rounded-lg p-4">
                  <div className="text-[15px] font-extrabold">{title}</div>
                  <div className="text-sm leading-relaxed opacity-90 mt-1">{copy}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right auth form */}
          <div className="bg-card border border-border rounded-xl p-7 shadow-brand flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-black text-foreground mb-2 font-sans">
                {authMode === "signup" ? "Create your portal account" : "Portal login"}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sign in to access invoices, quotes, expenses, reports and client records.
              </p>
            </div>

            <div className="grid gap-3.5">
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full border border-border rounded-md px-4 py-3 text-sm bg-card text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-foreground mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={authMode === "signup" ? "Minimum 8 characters, upper/lowercase and a number" : "Enter your password"}
                  autoComplete={authMode === "signup" ? "new-password" : "current-password"}
                  className="w-full border border-border rounded-md px-4 py-3 text-sm bg-card text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                />
              </div>
              {authMode === "signup" && (
                <div>
                  <label className="block text-sm font-bold text-foreground mb-1.5">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Repeat your password"
                    className="w-full border border-border rounded-md px-4 py-3 text-sm bg-card text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-shadow"
                  />
                </div>
              )}
            </div>

            {authMode === "signup" && (
              <p className="text-xs text-muted-foreground leading-relaxed">
                Use at least 8 characters with upper-case, lower-case and a number.
              </p>
            )}

            <div className="grid gap-2.5">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full flex justify-center items-center py-3 px-6 rounded-md font-extrabold bg-primary text-primary-foreground text-sm"
              >
                {authMode === "signup" ? "Create Account" : "Login to Portal"}
              </button>
              <div className="flex gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setAuthMode((prev) => (prev === "signup" ? "signin" : "signup"))}
                  className="flex-1 min-w-[150px] flex justify-center items-center py-2.5 px-4 rounded-md font-bold bg-card text-primary border border-border text-sm"
                >
                  {authMode === "signup" ? "Use Sign In" : "Create Account"}
                </button>
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="flex-1 min-w-[150px] flex justify-center items-center py-2.5 px-4 rounded-md font-bold bg-card text-primary border border-border text-sm"
                >
                  Reset Password
                </button>
              </div>
            </div>

            <div className="bg-background rounded-lg p-4 text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Note:</strong> Authentication will be connected to the backend once Lovable Cloud is enabled.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
