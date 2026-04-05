import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const features = [
  { icon: "🧾", title: "Professional invoicing & quotes", desc: "Create polished PDF invoices and quotes in seconds. Send via email with a Stripe payment link so clients can pay instantly.", color: "bg-secondary" },
  { icon: "📊", title: "Automatic GST calculations", desc: "GST is calculated automatically on every invoice, expense and income source. No more manual spreadsheets or calculator errors.", color: "bg-teal-light" },
  { icon: "🇦🇺", title: "ATO-ready reports", desc: "Generate pre-filled income, expense and GST summaries formatted for your tax return. Export directly to share with your accountant.", color: "bg-secondary" },
  { icon: "👥", title: "Client management", desc: "Store all your client details, ABNs, and contact info in one place. Link every invoice and quote to the right client automatically.", color: "bg-secondary" },
  { icon: "💸", title: "Expense tracking", desc: "Categorise expenses, claim GST credits and track deductible business costs. Receipt uploads and bill management included.", color: "bg-teal-light" },
  { icon: "🎯", title: "Safe to Spend dashboard", desc: "See exactly how much money you can safely spend after setting aside GST, tax and expenses — updated in real time.", color: "bg-secondary" },
];

const steps = [
  { num: "1", title: "Create your account", desc: "Sign up with your email and set up your business profile — ABN, bank details, logo and payment terms. Takes under 5 minutes." },
  { num: "2", title: "Add clients & start invoicing", desc: "Add your clients, create your first invoice and send it as a professional PDF. Clients can pay by Stripe or bank transfer." },
  { num: "3", title: "Stay ATO-ready year round", desc: "Track income and expenses as you go. At tax time, export your ATO-ready summary — no scrambling through receipts." },
];

const priceFeatures = [
  "Unlimited invoices & quotes",
  "Automatic GST calculations",
  "ATO-ready income & expense reports",
  "Client management",
  "Professional PDF generation",
  "Stripe payment collection",
  "Safe to Spend dashboard",
  "Email support",
];

const testimonials = [
  { quote: "I used to dread tax time. Now I just export my ATO summary and hand it straight to my accountant. Saves me hours every quarter.", name: "Michael T.", role: "Freelance consultant, Melbourne", initial: "M" },
  { quote: "The GST calculations are spot on. I was making mistakes manually before — now everything is automatic and I know my BAS figures are right.", name: "Sarah K.", role: "Sole trader, Brisbane", initial: "S" },
];

export default function LandingPage() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-in").forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-card">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-10 py-4 bg-card/92 backdrop-blur-xl border-b border-border/80">
        <Link to="/" className="font-serif text-xl font-black text-primary tracking-tight">
          Sharon's Accounting Service
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">How it works</a>
          <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Pricing</a>
          <Link to="/auth?mode=signin" className="text-sm font-bold text-primary bg-secondary border border-primary/20 rounded-md px-4 py-2.5 hover:bg-secondary/80 transition-colors">
            Sign in
          </Link>
          <Link to="/auth?mode=signup" className="text-sm font-bold bg-primary text-primary-foreground rounded-md px-5 py-2.5 hover:opacity-90 transition-opacity">
            Start free trial
          </Link>
        </div>
        <Link to="/auth?mode=signin" className="md:hidden text-sm font-bold text-primary bg-secondary border border-primary/20 rounded-md px-4 py-2.5">
          Login
        </Link>
      </nav>

      {/* HERO */}
      <section className="pt-[140px] pb-20 px-6 lg:px-10 relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-primary/[0.08] rounded-full blur-3xl" />
        <div className="absolute -bottom-[100px] -left-[100px] w-[400px] h-[400px] bg-accent/[0.07] rounded-full blur-3xl" />

        <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="fade-in">
            <div className="inline-flex items-center gap-2 bg-secondary text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
              <span className="w-2 h-2 bg-primary rounded-full inline-block" />
              Built for Australian businesses
            </div>
            <h1 className="text-4xl lg:text-[54px] leading-[1.1] font-black text-foreground mb-5 tracking-tight">
              Accounting made <em className="not-italic text-primary">simple</em> for Australians
            </h1>
            <p className="text-lg leading-relaxed text-muted-foreground font-light mb-9">
              Invoicing, GST calculations and ATO-ready reports — all in one place. No spreadsheets, no confusion, no accountant required for the basics.
            </p>
            <div className="flex gap-3.5 flex-wrap items-center">
              <Link to="/auth?mode=signup" className="inline-flex items-center justify-center rounded-md font-semibold bg-primary text-primary-foreground px-8 py-4 text-base hover:opacity-90 transition-opacity">
                Start your 14-day free trial
              </Link>
              <Link to="/auth?mode=signin" className="inline-flex items-center justify-center rounded-md font-semibold bg-card text-primary border-2 border-primary px-7 py-3.5 text-sm hover:bg-secondary transition-colors">
                Login to Portal
              </Link>
              <span className="w-full text-sm text-muted-foreground">No credit card required</span>
            </div>
          </div>

          <div className="relative fade-in" style={{ transitionDelay: "0.2s" }}>
            <div className="absolute -top-5 -right-5 bg-card rounded-md px-4 py-3 shadow-brand text-sm font-semibold flex items-center gap-2.5 text-green-700 animate-float-chip z-10">
              <span className="text-lg">✓</span> Invoice paid — $2,750.00
            </div>
            <div className="bg-card rounded-[20px] shadow-brand overflow-hidden animate-float border border-border">
              <div className="bg-primary p-4 flex items-center justify-between">
                <span className="text-primary-foreground font-bold text-sm">Invoice #INV-0042</span>
                <span className="text-primary-foreground/70 font-serif text-xl font-black">$2,750.00</span>
              </div>
              <div className="p-5">
                {[
                  { label: "Client", value: "Apex Solutions Pty Ltd" },
                  { label: "Status", value: "Paid", badge: "bg-green-100 text-green-800" },
                  { label: "Subtotal", value: "$2,500.00" },
                  { label: "GST (10%)", value: "$250.00", badge: "bg-teal-light text-accent" },
                  { label: "Safe to spend", value: "$1,843.00", green: true },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between items-center py-2.5 border-b border-border last:border-0 text-sm">
                    <span className="text-muted-foreground">{row.label}</span>
                    {row.badge ? (
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${row.badge}`}>{row.value}</span>
                    ) : (
                      <span className={`font-semibold ${row.green ? "text-green-700" : "text-foreground"}`}>{row.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-5 -left-8 bg-card rounded-md px-4 py-3 shadow-brand text-sm font-semibold flex items-center gap-2.5 text-primary animate-float-chip z-10" style={{ animationDelay: "1.2s" }}>
              <span className="text-lg">📊</span> GST auto-calculated
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6 lg:px-10" id="features">
        <div className="max-w-[1100px] mx-auto">
          <div className="fade-in">
            <p className="text-xs font-bold tracking-[2px] uppercase text-primary mb-4">Features</p>
            <h2 className="text-3xl lg:text-[42px] font-black leading-tight text-foreground mb-4 tracking-tight">
              Everything you need,<br /><em className="not-italic text-primary">nothing you don't</em>
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed font-light max-w-[560px]">
              Built specifically for the Australian tax system — GST, ATO reporting, and BAS-ready figures built in from day one.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {features.map((f, i) => (
              <div key={f.title} className="bg-card border border-border rounded-[20px] p-8 hover:border-primary hover:-translate-y-1 hover:shadow-brand transition-all cursor-default fade-in" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className={`w-[52px] h-[52px] rounded-md flex items-center justify-center text-2xl mb-5 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-2.5 text-foreground font-sans">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 lg:px-10 bg-background" id="how-it-works">
        <div className="max-w-[1100px] mx-auto text-center">
          <div className="fade-in">
            <p className="text-xs font-bold tracking-[2px] uppercase text-primary mb-4">How it works</p>
            <h2 className="text-3xl lg:text-[42px] font-black leading-tight text-foreground tracking-tight">
              Up and running in<br /><em className="not-italic text-primary">minutes</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
            {steps.map((s, i) => (
              <div key={s.num} className="text-center fade-in" style={{ transitionDelay: `${i * 0.15}s` }}>
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground font-serif text-xl font-black flex items-center justify-center mx-auto mb-5">
                  {s.num}
                </div>
                <h3 className="text-lg font-bold mb-2.5 text-foreground font-sans">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed font-light">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-24 px-6 lg:px-10" id="pricing">
        <div className="max-w-[1100px] mx-auto text-center">
          <div className="fade-in">
            <p className="text-xs font-bold tracking-[2px] uppercase text-primary mb-4">Pricing</p>
            <h2 className="text-3xl lg:text-[42px] font-black text-foreground">Simple, honest pricing</h2>
            <p className="text-base text-muted-foreground font-light mt-4 max-w-[560px] mx-auto">One plan. Everything included. No hidden fees, no feature limits, no surprises.</p>
          </div>
          <div className="max-w-[480px] mx-auto mt-14 bg-card border-2 border-primary rounded-xl p-12 shadow-brand relative overflow-hidden fade-in">
            <div className="absolute top-6 -right-8 bg-primary text-primary-foreground text-[10px] font-extrabold tracking-[1.5px] px-10 py-1.5 rotate-45">
              MOST POPULAR
            </div>
            <div className="font-serif text-7xl font-black text-primary leading-none mb-1">$45</div>
            <div className="text-base text-muted-foreground font-light mb-8">per month · cancel anytime</div>
            <div className="bg-teal-light text-accent rounded-lg p-3.5 text-sm font-semibold mb-6">
              🎉 Start with a 14-day free trial — no credit card needed
            </div>
            <ul className="grid gap-3 mb-9 text-left">
              {priceFeatures.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[15px]">
                  <span className="flex items-center justify-center w-[22px] h-[22px] bg-secondary text-primary rounded-full text-xs font-extrabold flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
            <Link to="/auth?mode=signup" className="w-full flex justify-center items-center py-4 px-8 rounded-md font-bold bg-primary text-primary-foreground text-base">
              Start free trial — 14 days free
            </Link>
            <p className="text-sm text-muted-foreground mt-3.5">Then $45/month. Cancel anytime.</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 lg:px-10 bg-navy" id="testimonials">
        <div className="max-w-[1100px] mx-auto">
          <div className="fade-in">
            <p className="text-xs font-bold tracking-[2px] uppercase text-indigo-300 mb-4">Testimonials</p>
            <h2 className="text-3xl lg:text-[42px] font-black text-navy-foreground">Australians love it</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            {testimonials.map((t, i) => (
              <div key={t.name} className="bg-primary-foreground/[0.07] border border-primary-foreground/10 rounded-[20px] p-8 fade-in" style={{ transitionDelay: `${i * 0.15}s` }}>
                <p className="text-[15px] leading-relaxed text-slate-300 mb-6 font-light italic">"{t.quote}"</p>
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-primary flex items-center justify-center font-serif text-lg font-black text-primary-foreground">
                    {t.initial}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-navy-foreground">{t.name}</div>
                    <div className="text-sm text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 lg:px-10 text-center" style={{ background: "var(--gradient-cta)" }}>
        <div className="fade-in">
          <h2 className="font-serif text-3xl lg:text-5xl font-black text-primary-foreground mb-4 tracking-tight">
            Ready to simplify your accounting?
          </h2>
          <p className="text-lg text-primary-foreground/70 font-light mb-10">
            Join hundreds of Australian businesses already saving time with Sharon's Accounting Service.
          </p>
          <Link to="/auth?mode=signup" className="inline-block bg-card text-primary px-10 py-4 text-base font-bold rounded-md hover:-translate-y-0.5 hover:shadow-brand transition-all">
            Start your free trial today
          </Link>
          <p className="text-sm text-primary-foreground/50 mt-4">No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-foreground text-slate-400 py-12 px-6 lg:px-10 text-center">
        <div className="font-serif text-xl font-black text-card mb-4">Sharon's Accounting Service</div>
        <p className="text-sm leading-relaxed">
          Smart accounting tools for Australian small businesses.<br />
          ABN registered · Built in Australia · Data stored securely.
        </p>
        <div className="flex justify-center gap-6 mt-5 flex-wrap">
          <Link to="/" className="text-sm text-slate-500 hover:text-card transition-colors">Home</Link>
          <a href="#features" className="text-sm text-slate-500 hover:text-card transition-colors">Features</a>
          <a href="#pricing" className="text-sm text-slate-500 hover:text-card transition-colors">Pricing</a>
          <Link to="/auth?mode=signin" className="text-sm text-slate-500 hover:text-card transition-colors">Portal Login</Link>
        </div>
        <p className="text-xs text-slate-600 mt-6">© {new Date().getFullYear()} Sharon's Accounting Service. All rights reserved.</p>
      </footer>
    </div>
  );
}
