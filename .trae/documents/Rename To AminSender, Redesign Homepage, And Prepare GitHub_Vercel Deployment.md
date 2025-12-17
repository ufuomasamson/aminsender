## Scope
- Rename brand from "ZoMail Pro" to "AminSender" across codebase and docs.
- Redesign the public homepage with professional, conversion‑focused content.
- Add essential public pages (Privacy, Terms, Contact) for SES production.
- Prepare GitHub repository and CI (GitHub Actions) for Vercel deployment.

## Changes
### 1) Brand Rename (AminSender)
- Code: Replace display strings and defaults
  - `lib/ses.ts` default sender name in footers and test sends
  - UI copy in `app/admin/*` pages and components (headers, banners)
- Docs: Update references
  - `README.md`, `PROJECT_SUMMARY.md`, any guides mentioning ZoMail Pro

### 2) Homepage Redesign (app/page.tsx)
- Modern hero: concise value prop + CTA ("Start Sending"), trust badges
- Feature grid: Deliverability, List management, Campaign builder, Analytics, Compliance
- How it works: 3 steps (Verify domain → Upload list → Send & track)
- Testimonials strip (placeholder cards)
- Pricing teaser: Free trial + Pro (link to Contact or Settings)
- Compliance footer: links to Unsubscribe, Privacy, Terms, Contact
- SEO: Page‑level `metadata` (title, description, Open Graph)

### 3) Public Compliance Pages
- `app/privacy/page.tsx`: privacy policy content
- `app/terms/page.tsx`: terms of service
- `app/contact/page.tsx`: contact form (static email mailto or simple form stub)
- Footer links wired from homepage

### 4) GitHub & CI Setup
- Initialize Git repository (locally; you will push to GitHub)
- Add GitHub Actions workflow: `.github/workflows/ci.yml`
  - Matrix: Node 18
  - Steps: checkout → setup‑node → install → typecheck → lint → build
- Optional: `.github/ISSUE_TEMPLATE` (bug/feature) for repo hygiene

### 5) Vercel Deployment Prep
- Verify `vercel.json` and Next build config
- Document deployment steps: connect GitHub repo, set env vars, production build
- Ensure `NEXT_PUBLIC_SITE_URL` points to Vercel URL post‑deploy

## Validation
- Run dev server; check homepage renders, links work, metadata present
- Confirm brand name updated everywhere
- CI: Run workflow locally (dry run) and ensure build succeeds
- Prepare checklist for SES production request (live URL, company info, compliance pages present)

## Deliverables
- Updated homepage and brand
- New compliance pages
- CI workflow for GitHub
- Deployment instructions for Vercel

On approval, I will implement these changes and verify locally. 