---
name: schema
description: Add JSON-LD structured data (Organization/WebSite sitewide; Service + FAQPage on solution pages).
disable-model-invocation: true
---
Add JSON-LD:
- Sitewide: Organization + WebSite
- Each solution page: Service schema (areaServed: Qatar, provider: MeandRobo)
- Any page with FAQs: FAQPage schema generated from the FAQ content

Use placeholders:
- Phone: +974 XXXXXXXX
- Email: hello@meandrobo.com.qa
- Address: Doha, Qatar

Verification:
- Ensure JSON-LD is valid JSON and present in rendered HTML output.