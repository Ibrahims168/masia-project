// ---- Edit these before going live -------------------------------------------
// WhatsApp number in international format without "+" (e.g. "970599123456").
// Set NEXT_PUBLIC_WHATSAPP in Vercel → Settings → Environment Variables, or type it here.
export const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP || "972552991289"; // 055-299-1289

// Packages shown on the home page. Details (itinerary, inclusions) live in lib/i18n.ts under pkd. No prices shown for now.
export const PACKAGES = [
  { id: "europe", img: "eu/rome", nights: 7 },
  { id: "swiss", img: "eu/swiss", nights: 6 },
  { id: "santorini", img: "eu/santorini", nights: 5 },
  { id: "phuket", img: "phuket", nights: 5 },
  { id: "tokyo", img: "japan", nights: 6 },
] as const;

// "Trusted partners" strip. Only keep airlines/partners you really work with, or set SHOW_PARTNERS = false.
export const SHOW_PARTNERS = true;
// logo = file in public/partners/*.svg; h = display height in px (tuned per logo so they look the same visual size).
export const PARTNERS = [
  { name: "El Al", logo: "elal", h: 22 },
  { name: "Arkia", logo: "arkia", h: 32 },
  { name: "Israir", logo: "israir", h: 26 },
  { name: "Thai Airways", logo: "thai", h: 34 },
  { name: "Singapore Airlines", logo: "sia", h: 18 },
  { name: "Cathay Pacific", logo: "cathay", h: 21 },
  { name: "Japan Airlines", logo: "jal", h: 12 },
  { name: "Emirates", logo: "emirates", h: 50 },
  { name: "Qatar Airways", logo: "qatar", h: 34 },
  { name: "Etihad Airways", logo: "etihad", h: 38 },
  { name: "AirAsia", logo: "airasia", h: 50 },
  { name: "Bangkok Airways", logo: "bangkok", h: 50 },
];

export const DEPARTURES = ["Amman (AMM)", "Tel Aviv (TLV)", "Istanbul (IST)", "Dubai (DXB)", "Cairo (CAI)"];

// ---- Masia brand details: fill these in before going live ---------------------
// Live site address (used for SEO and link previews).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://masia.travel";
// FormSubmit (or similar) endpoint that delivers the contact and newsletter forms to Masia's inbox,
// e.g. "https://formsubmit.co/ajax/you@masia.com". Until set, the forms show an error instead of sending.
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "";
// Social profiles; leave a value empty to hide its icon.
export const SOCIAL = {
  instagram: "https://www.instagram.com/masia_officials",
  facebook: "",
};

// ---- Legal pages (accessibility statement, privacy, terms): fill these in before going live ----
// Empty values show as "[to be completed]" on the pages, so nothing is ever made up.
export const BUSINESS = {
  legalName: "",        // registered business name, e.g. "מסיה טורס בע״מ"
  regNumber: "",        // company / licensed-dealer number (ח.פ. / ע.מ.)
  address: "",          // office address
  email: "",            // contact e-mail for privacy & accessibility requests
  phone: "055-299-1289",
  a11yContact: "",      // name of the accessibility coordinator (רכז/ת נגישות)
  updated: "נובמבר 2026 / November 2026",
};

// Floating accessibility menu (components/A11yMenu.tsx). Hidden for now; set to true to show it.
export const SHOW_A11Y_MENU = false;
