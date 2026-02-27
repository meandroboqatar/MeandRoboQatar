# Launch Checklist — meandrobo.com.qa

## Pre-Launch

### Content
- [ ] Replace SVG placeholder logo with actual brand logo (`public/images/logo.svg` → `logo.png`)
- [ ] Replace SVG placeholder robot mascot with actual asset (`public/images/robot-mascot.svg`)
- [ ] Add OG image (`public/images/og-default.png` — 1200×630)
- [ ] Review all page copy for accuracy
- [ ] Verify all phone numbers and email addresses

### SEO
- [ ] Verify unique `<title>` on every page (< 60 chars)
- [ ] Verify unique meta description on every page (< 160 chars)
- [ ] Verify one H1 per page
- [ ] Verify canonical URLs resolve correctly
- [ ] Test `sitemap.xml` generation at `/sitemap.xml`
- [ ] Test `robots.txt` at `/robots.txt`
- [ ] Validate JSON-LD with [Google Rich Results Test](https://search.google.com/test/rich-results)

### Structured Data
- [ ] Organization schema on homepage
- [ ] WebSite schema on homepage
- [ ] Service schema on each solution page
- [ ] FAQPage schema on each solution page
- [ ] Verify all schema with [Schema Markup Validator](https://validator.schema.org/)

### Forms & Conversion
- [ ] Test lead form submission (all fields)
- [ ] Verify Firestore writes to `leads` collection
- [ ] Test form validation (required fields, email format, phone)
- [ ] Test honeypot field (should silently reject bots)
- [ ] Test rate limiting (6th submission within 15 min should be blocked)
- [ ] Test mailto fallback on API failure
- [ ] Verify WhatsApp button links to `wa.me/97477558819`
- [ ] Verify click-to-call links (`tel:+97477558819`)
- [ ] Verify email links (`mailto:info@meandrobo.com.qa`)

### Firebase
- [ ] Set `FIREBASE_SERVICE_ACCOUNT_KEY_B64` in Hostinger env
- [ ] Set all `NEXT_PUBLIC_FIREBASE_*` env vars
- [ ] Verify Firestore security rules allow server-side writes only
- [ ] Test lead submission in production

### Performance
- [ ] Run Lighthouse audit (target: 90+ on all categories)
- [ ] Verify images use `next/image` optimization
- [ ] Verify Inter font loads with `display: swap`
- [ ] Check no layout shifts (CLS < 0.1)

### Accessibility
- [ ] Keyboard navigation works on all interactive elements
- [ ] FAQ accordion is keyboard accessible
- [ ] Mobile menu is keyboard accessible
- [ ] All images have descriptive alt text
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible

### Responsiveness
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1280px+ width)
- [ ] Mobile menu opens/closes correctly
- [ ] Lead form is usable on mobile

### Hosting
- [ ] Domain `meandrobo.com.qa` points to Hostinger
- [ ] SSL certificate active
- [ ] Node.js version set to 18.x
- [ ] Build command: `npm install && npm run build`
- [ ] Start command: `npm start`
- [ ] All environment variables configured

## Post-Launch
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Monitor Firestore for incoming leads
- [ ] Set up Google Analytics (optional)
- [ ] Monitor Core Web Vitals
- [ ] Test all pages indexed within 1 week
