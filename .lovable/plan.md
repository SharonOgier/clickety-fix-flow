
## Portal Design Unification Plan

### 1. Add Brand Fonts (Playfair Display + DM Sans)
- Import Google Fonts in `index.html`
- Update the portal's global `<style>` block in `SharonPortalWebsite.jsx` to use DM Sans as the base font and Playfair Display for headings (hero titles, section titles, page headers)

### 2. Unify Buttons & Form Inputs
- Standardise `buttonPrimary` and `buttonSecondary` in `PortalHelpers.jsx` with consistent font-size (14px), height, border-radius (12px), and transitions
- Add a `buttonDanger` style for delete buttons (currently each page hardcodes red styling differently)
- Ensure `inputStyle` has consistent padding, border-radius, and focus states across all pages

### 3. Polish Page Headers & Hero Banners
- Ensure all pages use the `DashboardHero` component consistently (same gradient, same layout)
- Apply Playfair Display to hero titles
- Standardise the `InsightChip` sizing and spacing in hero sections

### 4. Uniform Tables & Data Lists
- Refine `DataTable` component in `PortalComponents.jsx` with better row hover states, consistent font sizing, and cleaner action button alignment
- Add alternating row backgrounds for better readability
- Ensure all action button groups in table rows use uniform styling (gap, size, wrapping)

### 5. Sidebar & Navigation Polish
- Refine sidebar styling with brand colours: active item gets a left accent bar, smoother transitions
- Add nav icons using Lucide icons for each section
- Polish the mobile hamburger menu appearance
- Add a subtle footer to the sidebar with app branding

### Impact
All changes are visual/CSS only — no business logic changes. The design tokens and shared styles in `PortalHelpers.jsx` and `PortalComponents.jsx` will be updated so all pages automatically inherit the improvements.
