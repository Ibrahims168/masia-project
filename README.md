# Masia website (Next.js + Tailwind CSS)

Trilingual (Arabic RTL / Hebrew RTL / English) travel-agency site. Next.js 15 (App Router), Tailwind CSS 3, TypeScript.

## Run locally
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Deploy to Vercel
1. Push this folder to a GitHub repo (`git init && git add . && git commit -m "Masia v1"`).
2. On vercel.com choose **Add New → Project**, import the repo. Framework is detected as Next.js, no settings needed.
3. Click **Deploy**. Then add the Masia domain under **Settings → Domains** and point the DNS records Vercel shows you.

(or from a terminal: `npx vercel` then `npx vercel --prod`)

## Where things are
- `lib/i18n.ts`: all texts in Arabic + English, and the form endpoint (FormSubmit).
- `components/Hero.tsx`: nav, hero and the search card (it pre-fills the contact form).
- `components/Sections.tsx`: features, destinations, info, packages, how it works, FAQ, contact, footer.
- `public/img/`: photos. Replace with your own (same file names) for sharper hero images.
- `tailwind.config.ts`: the Masia navy/gold palette (sampled from the logo).

## Config you must edit (`lib/config.ts`)
- `WHATSAPP`: your number (international format, no "+"), or set the `NEXT_PUBLIC_WHATSAPP` env var in Vercel. Until set, the gold button sends the request to the contact form instead.
- `PACKAGES`: names live in `lib/i18n.ts`; prices/nights are sample values from the mockup.
- `PARTNERS` / `SHOW_PARTNERS`: remove airlines you do not really partner with, or hide the strip.
- `DEPARTURES`: departure cities in the search card.

## Before going live
- The contact form posts to FormSubmit; the first submission sends an "Activate Form" email that must be confirmed.
- Check every claim in `lib/i18n.ts` (support during trip, reply within a working day, tips and months).

## Masia brand settings (`lib/config.ts`)
- `FORM_ENDPOINT`: where the contact and newsletter forms send (e.g. `https://formsubmit.co/ajax/you@masia.com`), or set `NEXT_PUBLIC_FORM_ENDPOINT`. Empty = forms show an error.
- `SITE_URL`: the live domain (or `NEXT_PUBLIC_SITE_URL`).
- `SOCIAL`: Instagram / Facebook links; empty ones are hidden.
- Logo: drawn in code (`Wordmark` and `Mark` in `components/Top.tsx`); the original artwork is in `public/brand/masia-logo.jpg`.
