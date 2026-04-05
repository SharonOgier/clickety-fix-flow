import { useState } from "react";
import { Link } from "react-router-dom";

const pages = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "about", label: "About" },
  { id: "portal", label: "Portal" },
  { id: "why", label: "Why Sharon" },
  { id: "contact", label: "Contact" },
];

const stats = [
  { title: "Based in Casino NSW", desc: "Serving Casino, Lismore, Ballina and surrounding Northern Rivers region." },
  { title: "Financial clarity", desc: "Reporting, structure and better business visibility." },
  { title: "Operational insight", desc: "Practical support grounded in real experience." },
  { title: "Portal connected", desc: "One place for invoices, expenses and records." },
  { title: "Built to be useful", desc: "Less chaos. Better systems. Clearer decisions." },
];

const services = [
  { num: "01", title: "Bookkeeping & BAS", desc: "Day-to-day books, bank reconciliation, GST tracking and quarterly BAS lodgement. Clean data, on time, every time." },
  { num: "02", title: "Invoicing & Accounts Receivable", desc: "Professional invoicing through the portal, payment tracking, follow-ups and aged receivables reporting." },
  { num: "03", title: "Financial Analysis & Reporting", desc: "Beyond compliance — Sharon analyses what the numbers mean. Profitability, cash flow trends, cost breakdowns and forward planning." },
  { num: "04", title: "Business Structure & Systems", desc: "Helping you set up or improve the financial systems that keep your business running smoothly." },
  { num: "05", title: "Portal Access for Clients", desc: "Every client gets access to the portal — invoices, expenses, documents and reports in one secure place." },
  { num: "06", title: "Farm & Small Business Specialist", desc: "Deep understanding of seasonal cash flow, equipment costs, livestock accounting and the financial realities of running a farm or small business." },
];

export default function HomePage() {
  const [activePage, setActivePage] = useState("home");

  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-page)" }}>
      {/* Top bar */}
      <div className="bg-primary text-primary-foreground py-2 px-6 flex justify-end items-center gap-6 text-sm font-semibold flex-wrap">
        <span>Sharon's Accounting Service</span>
        <span className="opacity-85">📍 Casino NSW &amp; surrounds</span>
        <a href="tel:1300017167" className="text-primary-foreground flex items-center gap-1">📞 1300 017 167</a>
        <a href="mailto:info@sharonogier.com" className="text-primary-foreground flex items-center gap-1">✉ info@sharonogier.com</a>
        <Link to="/landing" className="bg-primary-foreground/20 text-primary-foreground px-4 py-1 rounded-full font-extrabold">
          Portal Login
        </Link>
      </div>

      <div className="max-w-[1380px] mx-auto p-6 grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6 items-start">
        {/* Sidebar */}
        <aside className="lg:sticky lg:top-6 bg-card border border-border rounded-xl p-4 flex flex-col gap-4 shadow-brand">
          <div className="rounded-[22px] p-4 text-primary-foreground text-center" style={{ background: "var(--gradient-brand)" }}>
            <img
              src="https://152367768-799925207664624360.preview.editmysite.com/uploads/1/5/2/3/152367768/logo_orig.png"
              alt="Sharon's Accounting Service logo"
              className="w-full max-w-[130px] mx-auto mb-3 rounded-md bg-primary-foreground/15 p-1"
            />
            <h2 className="text-base font-bold mb-1 font-serif">Sharon's Accounting Service</h2>
            <p className="text-sm opacity-90">Financial clarity and practical business insight for farms and small business.</p>
            <p className="text-xs opacity-85 mt-2">📍 Casino NSW &amp; surrounds</p>
          </div>

          <nav className="grid gap-2">
            {pages.map((page) => (
              <button
                key={page.id}
                onClick={() => setActivePage(page.id)}
                className={`w-full border rounded-md p-3 text-left font-bold transition-colors ${
                  activePage === page.id
                    ? "bg-secondary border-primary/30 text-primary"
                    : "bg-card border-border text-foreground hover:bg-secondary hover:text-primary"
                }`}
              >
                {page.label}
              </button>
            ))}
          </nav>

          <div className="grid gap-3">
            <Link to="/landing" className="flex justify-center items-center w-full py-3 px-4 rounded-md font-extrabold bg-primary text-primary-foreground">
              Portal Login
            </Link>
            <a
              href="https://calendly.com/sharonogier-info"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center w-full py-3 px-4 rounded-md font-extrabold bg-card text-primary border border-border"
            >
              Book a Review
            </a>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0">
          {/* HOME */}
          {activePage === "home" && (
            <section>
              <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] gap-5 mb-5">
                <div className="bg-card border border-border rounded-xl shadow-brand p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-secondary text-primary text-sm font-extrabold mb-4">
                    Bookkeeping &amp; financial analysis — Casino NSW
                  </span>
                  <h1 className="text-3xl lg:text-5xl font-black leading-tight tracking-tight mb-4 text-foreground">
                    Sort your books. Understand your numbers. Run a better business.
                  </h1>
                  <p className="text-muted-foreground leading-relaxed mb-5">
                    Sharon handles the books, the BAS, the invoices and the reporting — and goes further to analyse what the numbers actually mean for your business.
                  </p>
                  <div className="flex gap-3 flex-wrap mb-5">
                    <Link to="/landing" className="inline-flex justify-center items-center px-6 py-3 rounded-md font-extrabold bg-primary text-primary-foreground">
                      Portal Login
                    </Link>
                    <a
                      href="https://calendly.com/sharonogier-info"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex justify-center items-center px-6 py-3 rounded-md font-extrabold bg-card text-primary border border-border"
                    >
                      Book a Review
                    </a>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {stats.map((stat) => (
                      <div key={stat.title} className="bg-card border border-border rounded-lg shadow-brand p-4">
                        <strong className="block text-primary text-sm font-bold mb-1">{stat.title}</strong>
                        <span className="text-muted-foreground text-sm">{stat.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-card border border-border rounded-xl shadow-brand p-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-secondary text-primary text-sm font-extrabold mb-4">
                    Portal preview
                  </span>
                  <h3 className="text-xl font-bold mb-2 text-foreground">Your business dashboard</h3>
                  <p className="text-muted-foreground mb-4">Use the portal to bring records, visibility and day-to-day management into one connected place.</p>
                  <div className="p-3 bg-secondary/50 border border-border rounded-lg">
                    <div className="bg-card rounded-lg border border-border p-6 text-center">
                      <div className="text-4xl mb-3">📊</div>
                      <p className="text-muted-foreground text-sm">Invoices, expenses, clients, documents and financial reports — all in one secure portal.</p>
                      <Link to="/landing" className="inline-flex mt-4 px-5 py-2 rounded-md font-bold bg-primary text-primary-foreground text-sm">
                        Access Portal →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quote box */}
              <div className="rounded-xl p-6 text-primary-foreground shadow-brand mb-5" style={{ background: "var(--gradient-brand)" }}>
                <h3 className="text-lg font-bold mb-2 text-primary-foreground font-serif">Built for real businesses, not templates.</h3>
                <p className="opacity-90 text-sm">Sharon's portal is purpose-built for Australian small businesses and farms. Every feature — from GST calculations to BAS reporting — is designed around how Australian businesses actually work.</p>
              </div>
            </section>
          )}

          {/* SERVICES */}
          {activePage === "services" && (
            <section>
              <div className="bg-card border border-border rounded-xl shadow-brand p-6 mb-5">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-primary text-sm font-extrabold mb-4">What we do</span>
                <h2 className="text-3xl font-black mb-3 text-foreground">Services</h2>
                <p className="text-muted-foreground leading-relaxed">Bookkeeping, financial analysis, reporting and portal access — everything your business needs to stay on top of the numbers.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((s) => (
                  <div key={s.num} className="bg-card border border-border rounded-lg shadow-brand p-5">
                    <div className="w-11 h-11 grid place-items-center rounded-md bg-secondary text-primary font-extrabold mb-3">{s.num}</div>
                    <h3 className="text-lg font-bold mb-2 text-foreground font-sans">{s.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ABOUT */}
          {activePage === "about" && (
            <section>
              <div className="bg-card border border-border rounded-xl shadow-brand p-6">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-primary text-sm font-extrabold mb-4">About</span>
                <h2 className="text-3xl font-black mb-3 text-foreground">About Sharon's Accounting Service</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Sharon Ogier is a qualified accountant based in Casino, NSW. She provides bookkeeping, BAS lodgement, financial analysis and reporting for small businesses and farms across the Northern Rivers region.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  What sets Sharon apart is that she doesn't just process the numbers — she explains what they mean. Her clients get clarity on cash flow, profitability, and where their business is actually heading.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Every client gets access to the portal — a secure, purpose-built system for invoices, expenses, documents and financial reports.
                </p>
              </div>
            </section>
          )}

          {/* PORTAL */}
          {activePage === "portal" && (
            <section>
              <div className="bg-card border border-border rounded-xl shadow-brand p-6 mb-5">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-primary text-sm font-extrabold mb-4">Client Portal</span>
                <h2 className="text-3xl font-black mb-3 text-foreground">Your Portal</h2>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  Access invoices, quotes, expenses, documents and financial reports — all in one secure place. The portal is included with every client engagement.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link to="/landing" className="inline-flex px-6 py-3 rounded-md font-extrabold bg-primary text-primary-foreground">
                    Go to Portal Login
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: "🧾", title: "Invoices & Quotes", desc: "Create, send and manage professional invoices and quotes." },
                  { icon: "💸", title: "Expense Tracking", desc: "Categorise expenses, track GST credits and manage receipts." },
                  { icon: "📊", title: "Financial Reports", desc: "Live insights, receivables, cash flow and BAS support." },
                  { icon: "📁", title: "Document Storage", desc: "Upload and organise business documents securely." },
                ].map((f) => (
                  <div key={f.title} className="bg-card border border-border rounded-lg shadow-brand p-5">
                    <div className="text-2xl mb-3">{f.icon}</div>
                    <h3 className="text-base font-bold mb-1 text-foreground font-sans">{f.title}</h3>
                    <p className="text-muted-foreground text-sm">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* WHY SHARON */}
          {activePage === "why" && (
            <section>
              <div className="bg-card border border-border rounded-xl shadow-brand p-6">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-primary text-sm font-extrabold mb-4">Why choose us</span>
                <h2 className="text-3xl font-black mb-3 text-foreground">Why Sharon</h2>
                <div className="grid gap-4 mt-4">
                  {[
                    "Goes beyond compliance to explain what your numbers actually mean",
                    "Specialises in farms and small businesses in the Northern Rivers",
                    "Every client gets portal access — invoices, reports and documents in one place",
                    "Practical, no-nonsense approach grounded in real business experience",
                    "Combined financial and operational expertise with Mitchell's support",
                  ].map((point, i) => (
                    <div key={i} className="flex items-start gap-3 bg-secondary/50 rounded-md p-4">
                      <span className="text-primary font-bold text-lg">✓</span>
                      <p className="text-foreground text-sm">{point}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* CONTACT */}
          {activePage === "contact" && (
            <section>
              <div className="bg-card border border-border rounded-xl shadow-brand p-6">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-primary text-sm font-extrabold mb-4">Contact</span>
                <h2 className="text-3xl font-black mb-3 text-foreground">Ready to tidy things up?</h2>
                <p className="text-muted-foreground mb-5">Start with a review, then build a better system from there.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-lg shadow-brand p-5">
                    <h3 className="text-lg font-bold mb-3 text-foreground font-sans">Get in touch</h3>
                    <div className="grid gap-3">
                      <div className="bg-secondary rounded-md p-3 text-foreground font-semibold text-sm">Email: info@sharonogier.com</div>
                      <div className="bg-secondary rounded-md p-3 text-foreground font-semibold text-sm">Phone: 1300 017 167</div>
                      <div className="bg-secondary rounded-md p-3 text-foreground font-semibold text-sm">Location: Casino NSW and surrounding areas</div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg shadow-brand p-5">
                    <h3 className="text-lg font-bold mb-3 text-foreground font-sans">Next step</h3>
                    <p className="text-muted-foreground text-sm mb-4">Use the booking link for a review or head straight into the portal if you are already a client.</p>
                    <div className="flex gap-3 flex-wrap">
                      <a href="https://calendly.com/sharonogier-info" target="_blank" rel="noopener noreferrer" className="inline-flex px-5 py-2.5 rounded-md font-bold bg-primary text-primary-foreground text-sm">
                        Book a Review
                      </a>
                      <Link to="/landing" className="inline-flex px-5 py-2.5 rounded-md font-bold bg-card text-primary border border-border text-sm">
                        Portal Login
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
