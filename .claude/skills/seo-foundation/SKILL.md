---
name: seo-foundation
description: Implement SEO essentials (metadata per page, canonical, OG/Twitter, sitemap.xml, robots.txt, headings rules).
disable-model-invocation: true
---
Implement SEO foundation across all routes:
- Unique title (<60 chars) + meta description (<160 chars) per route.
- Canonical URLs.
- OpenGraph + Twitter card metadata.
- robots.txt + sitemap.xml.
- Enforce: one H1 per page.
- Add a “direct answer” paragraph near top of every solution page.

Verification:
- Validate sitemap/robots exist in build output.
- Build succeeds.