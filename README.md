# MeandRobo.com.qa

Production-ready Next.js website for MeandRobo's AI business automation services in Qatar.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3
- **Language**: TypeScript (strict mode)
- **Database**: Firebase Firestore (leads collection)
- **Auth**: Firebase Admin SDK (server-side only)
- **Hosting**: Hostinger (Node.js)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx                # Root layout (Navbar, Footer, JSON-LD)
│   ├── page.tsx                  # Home page
│   ├── about/page.tsx            # About page
│   ├── contact/page.tsx          # Contact page
│   ├── solutions/page.tsx        # Solutions hub
│   ├── case-studies/page.tsx     # Case studies (placeholder)
│   ├── insights/                 # Blog
│   │   ├── page.tsx              # Blog index
│   │   └── [slug]/page.tsx       # Individual blog posts
│   ├── erp-pfp-qatar/            # Solution pages
│   ├── ai-customer-agent-qatar/
│   ├── ai-call-center-agent-qatar/
│   ├── ai-creative-studio-qatar/
│   ├── ai-website-chatbot-qatar/
│   ├── api/leads/route.ts        # Lead submission API
│   ├── api/chat/route.ts         # Gemini chatbot API
│   ├── sitemap.ts                # Generated sitemap.xml
│   └── robots.ts                 # Generated robots.txt
├── components/                   # Reusable components
│   ├── Navbar.tsx                # Sticky nav with mobile menu
│   ├── Hero.tsx                  # Hero section with CTAs
│   ├── Section.tsx               # Section wrappers
│   ├── SolutionCard.tsx          # Solution preview cards
│   ├── SolutionPage.tsx          # Solution page template
│   ├── Steps.tsx                 # "How it works" steps
│   ├── FAQAccordion.tsx          # ARIA-compliant FAQ
│   ├── LeadForm.tsx              # Lead capture form
│   ├── CTABanner.tsx             # Call-to-action banner
│   ├── Footer.tsx                # Multi-column footer
│   ├── WhatsAppButton.tsx        # Floating WhatsApp button
│   ├── ChatWidget.tsx            # AI chat assistant widget
│   ├── Badge.tsx                 # Tag/label component
│   └── JsonLd.tsx                # JSON-LD injector
└── lib/                          # Shared utilities
    ├── firebase.ts               # Client-side Firebase
    ├── firebase-admin.ts         # Server-side Firebase Admin
    ├── solutions-data.ts         # Solution page content
    ├── blog-data.ts              # Blog post content
    └── chat/knowledge.ts         # Chatbot knowledge base
```

## Environment Variables

Create a `.env.local` file with:

```env
# Public (safe for browser)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_SITE_URL=https://meandrobo.com.qa

# Server-only (NEVER prefix with NEXT_PUBLIC_)
MB_FIREBASE_ADMIN_JSON={"project_id": "..."}
MB_GEMINI_API_KEY=
```

### Encoding the Firebase Service Account Key

```bash
# Save your exact downloaded JSON into a single line string to put in MB_FIREBASE_ADMIN_JSON.
```

## Hostinger Deployment

1. Push to GitHub: `git push origin main`
2. In Hostinger panel → Websites → Node.js
3. Set Node.js version: **18.x**
4. Set startup command: `npm start`
5. Set build command: `npm install && npm run build`
6. Add all environment variables from `.env.local`
7. Map domain: `meandrobo.com.qa`
8. Enable SSL

## API Security

The `/api/leads` endpoint includes:
- **Rate limiting**: Max 5 submissions per IP per 15 minutes
- **Honeypot field**: Invisible field to catch bots
- **Payload validation**: Strict field validation and sanitization
- **Size limit**: 10KB max payload
- **Server-only secrets**: Firebase Admin key never exposed to client

The `/api/chat` endpoint includes:
- **Rate limiting**: Max 10 requests per IP per 15 minutes
- **Payload validation**: Message required, max 1000 chars
- **Size limit**: 10KB max payload
- **Safety filters**: Gemini safety settings set to BLOCK_LOW_AND_ABOVE
- **Server-only secrets**: Gemini API key never exposed to client

## SEO Features

- Unique `<title>` and meta description per page
- Canonical URLs on all pages
- OpenGraph and Twitter Card meta tags
- Generated `sitemap.xml` with all routes
- Generated `robots.txt`
- JSON-LD structured data (Organization, WebSite, Service, FAQPage)
- One H1 per page
- Direct-answer paragraphs on solution pages

## Gemini Chatbot Setup

The site includes an AI chat assistant (Scope: services & booking only).

### 1. Get an API Key

1. Go to [Google AI Studio](https://aistudio.google.com/apikey)
2. Create or select a project
3. Generate a Gemini API key

### 2. Configure Locally

Add to your `.env.local`:

```env
MB_GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ Never prefix with `NEXT_PUBLIC_` — the key must stay server-side only.

### 3. Configure on Hostinger

1. In Hostinger panel → Websites → Node.js → Environment Variables
2. Add `MB_GEMINI_API_KEY` with your key value
3. Rebuild/restart the app

### 4. Test

```bash
# Via curl
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What solutions does MeandRobo offer?"}'

# Or open browser DevTools → Console:
fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: 'Tell me about your services' }),
}).then(r => r.json()).then(console.log)
```

### Scope

The chatbot answers questions about MeandRobo's five AI solutions and guides users to book a consultation. It does NOT provide general AI/ERP education, pricing, or legal advice. See `src/lib/chat/knowledge.ts` for the full knowledge base.

## License

All rights reserved. MEANDROBO ARTIFICIAL INTELLIGENCE SOLUTIONS.
