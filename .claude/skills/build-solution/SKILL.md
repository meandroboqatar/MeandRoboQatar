---
name: build-solution
description: End-to-end build pipeline for a single Solution page (content + SEO + schema + conversion), then verify build.
disable-model-invocation: true
---

# build-solution — Orchestrator Skill

## Purpose
Build or update ONE solution page end-to-end, including:
- page structure + AI-friendly content sections
- SEO metadata + sitemap/robots/canonical updates
- JSON-LD schema (Service + FAQPage)
- conversion elements (CTAs, lead form, WhatsApp)
- final verification (lint/build)

## Inputs (ask user if missing)
- Solution page route slug (one of):
  - /erp-pfp-qatar
  - /ai-customer-agent-qatar
  - /ai-call-center-agent-qatar
  - /ai-creative-studio-qatar
  - /ai-website-chatbot-qatar
- Optional: any specific copy preferences or features to emphasize.

## Execution Plan (must follow in order)

### Step 1 — Apply Solution Page Template
- Use the same structure across all solution pages:
  1) H1 (exactly one)
  2) Direct answer paragraph (2–4 sentences)
  3) What it is
  4) How it works (step-by-step)
  5) Key capabilities
  6) Outcomes
  7) Use cases by industry (restaurant, coffee shop, salon, rent-a-car)
  8) Implementation approach (on-site Qatar + remote support)
  9) FAQ (8–10 Q&As, AI-friendly)
  10) CTA section + embedded lead form
- Enforce: English only, no pricing.
- Add internal links to other solution pages + /contact.

### Step 2 — SEO Foundation Update
- Ensure unique title (<60 chars) + meta description (<160 chars) for this route.
- Ensure canonical URL is correct.
- Ensure OpenGraph + Twitter metadata exists.
- Ensure sitemap.xml and robots.txt include/allow this route.

### Step 3 — Structured Data (JSON-LD)
- Add Service schema for this solution page:
  - areaServed: Qatar
  - provider: MeandRobo
- Add FAQPage schema generated from the FAQ content.
- Ensure JSON is valid and embedded in final HTML.

### Step 4 — Conversion Consistency
- Ensure sitewide CTAs exist on the page:
  - Primary: “Book Free Consultation”
  - Secondary: “Request On-Site Assessment”
- Ensure LeadForm is present and matches the global fields:
  Full name, Company, Industry dropdown, Phone, Email,
  Interested solution (multi-select), Message.
- Ensure WhatsApp floating button exists sitewide and works.

### Step 5 — Verification
Run and report results:
- lint (if configured)
- build/export (required)
- confirm the page renders without runtime errors

If any step fails:
- fix it immediately and re-run verification.

## Output Requirements
- List the files changed.
- Show the final route title + meta description.
- Confirm schema added (Service + FAQPage).
- Confirm build succeeded and provide the command output summary.