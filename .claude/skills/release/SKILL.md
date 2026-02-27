---
name: release
description: Safe release pipeline (performance → deploy-hostinger → qa-launch). Verifies everything and prints manual git push commands. No automatic pushing.
disable-model-invocation: true
---

# release — Safe Mode Orchestrator

## Purpose
Prepare the repo for deployment without pushing to GitHub automatically.

Pipeline:
1) performance checks/optimizations
2) deploy-hostinger readiness (static output, deep links, docs)
3) qa-launch checks (SEO/schema/forms/indexing checklist)

## Hard Rules
- Do NOT run `git push`.
- Do NOT deploy automatically.
- Only provide instructions + commands for the user to run manually.

## Steps

### Step 1 — Performance
- Execute the tasks described in /performance.
- Ensure images are optimized, lazy loading is correct, and bundle size is reasonable.
- Avoid introducing heavy dependencies.

### Step 2 — Deploy Readiness (Hostinger)
- Execute the tasks described in /deploy-hostinger:
  - Confirm build/export output folder (e.g., dist/ or out/)
  - Confirm deep linking works for static hosting (routing fallback if needed)
  - Confirm sitemap.xml + robots.txt are in the build output
  - Update README with exact Hostinger steps

### Step 3 — QA & Launch Checks
- Execute /qa-launch tasks:
  - Titles/meta/canonical present
  - Exactly one H1 per page
  - Direct answer paragraph on solution pages
  - FAQ present where required
  - Schema present (Organization/WebSite + Service/FAQPage)
  - Forms validate + success state
  - Mobile layout sanity check
  - Provide Search Console submission steps

### Step 4 — Verification Commands
Run and report results:
- lint (if configured)
- build/export (required)
- basic link check if available

If any step fails:
- fix it and re-run verification.

## Output (must include)
1) Summary of what changed.
2) Verification results (commands run + success).
3) Deployment notes: which folder to upload or configure in Hostinger.
4) Manual Git commands to push when user approves:

- git status
- git diff
- git add -A
- git commit -m "Release: <short description>"
- git push origin main

Do NOT execute the git commands automatically.