## Plan: Rebuild Sharon's Accounting Service

### Phase 1 — Design System & Routing (this session)
1. **Update design system** — Purple/teal/navy color palette from the uploaded files
2. **Create Homepage** (`/`) — Based on index-3.html (portal preview page with sidebar)
3. **Create Landing Page** (`/landing`) — Based on landing.html (marketing page with features, pricing, testimonials)
4. **Create Auth Page** (`/auth`) — Based on AuthPage.jsx (login/signup form)
5. **Wire routing** — Homepage login buttons → Landing page → Auth page login buttons → Auth form

### Phase 2 — Backend & Portal (future)
- Enable Lovable Cloud for Supabase auth
- Build the full accounting portal (dashboard, invoices, clients, expenses, etc.)
- Connect data persistence

### Flow:
```
/ (Homepage) → click "Login" → /landing → click "Sign in" → /auth → login form
```

### Design tokens:
- Primary: #6A1B9A (purple)
- Primary dark: #4A1270
- Accent/teal: #006D6D
- Navy: #2B2F6B
- Fonts: Playfair Display (headings), DM Sans (body)
