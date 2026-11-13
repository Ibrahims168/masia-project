import { p, t } from "./i18n";

// ---- Reviews ---------------------------------------------------------------------
// Replace these with REAL reviews from Masia's travellers (with their permission), then set
// REVIEWS_ARE_SAMPLES = false. While it is true the section shows an "example reviews" label,
// so placeholder text is never presented as genuine customer feedback.
export const REVIEWS_ARE_SAMPLES = true;

// lang = the language the review was written in (shown as written, not translated).
export const REVIEWS: { name: string; from: string; trip: string; rating: number; date: string; lang: "ar" | "en" | "he"; text: string; to: string[] }[] = [
  { name: "Sample traveller", from: "Amman", trip: "Phuket & Krabi", to: ["th"], rating: 5, date: "2026-09", lang: "ar",
    text: "مثال على تقييم: كل شيء كان منظماً من المطار حتى الفندق، والرد على واتساب كان سريعاً طوال الرحلة." },
  { name: "Sample traveller", from: "Tel Aviv", trip: "Prague & Budapest", to: ["cz","hu"], rating: 5, date: "2026-08", lang: "he",
    text: "דוגמה לביקורת: מלון במרחק הליכה מבית הכנסת, סעודות שבת מסודרות וסיור מעולה ברובע היהודי." },
  { name: "Sample traveller", from: "Dubai", trip: "Paris & Rome", to: ["fr","it"], rating: 5, date: "2026-07", lang: "en",
    text: "Example review: two cities, one smooth plan. Hotels were central and the Paris to Rome flight was all arranged for us." },
  { name: "Sample traveller", from: "Cairo", trip: "Tokyo & Kyoto", to: ["jp"], rating: 5, date: "2026-05", lang: "ar",
    text: "مثال على تقييم: خطة واضحة وفنادق ممتازة، وتذكرة القطار السريع كانت جاهزة عند وصولنا." },
  { name: "Sample traveller", from: "Haifa", trip: "Santorini honeymoon", to: ["gr"], rating: 5, date: "2026-06", lang: "he",
    text: "דוגמה לביקורת: ירח דבש מושלם, חדר עם נוף לקלדרה וארוחת שקיעה שהוזמנה מראש." },
  { name: "Sample traveller", from: "London", trip: "Swiss Alps", to: ["ch"], rating: 5, date: "2026-02", lang: "en",
    text: "Example review: the trains, the hotels and the ski passes were all sorted before we landed." },
];

export const rv = {
  tag: p("Reviews", "التقييمات", "ביקורות"),
  h: p("What our travellers say", "ماذا يقول مسافرونا", "מה המטיילים שלנו אומרים"),
  l: p("Real trips, real people. Travelled with us? We'd love to hear from you.", "رحلات حقيقية وأشخاص حقيقيون. سافرت معنا؟ يسعدنا أن نسمع رأيك.", "טיולים אמיתיים, אנשים אמיתיים. טיילתם איתנו? נשמח לשמוע מכם."),
  sample: p("Example reviews: replace with real ones before launch", "تقييمات توضيحية: استبدلها بتقييمات حقيقية قبل الإطلاق", "ביקורות לדוגמה: יש להחליף בביקורות אמיתיות לפני ההשקה"),
  avg: p("average rating", "متوسط التقييم", "דירוג ממוצע"),
  count: p("reviews", "تقييمات", "ביקורות"),
  write: p("Write a review", "اكتب تقييمك", "כתבו ביקורת"),
  fName: p("Your name", "اسمك", "השם שלכם"),
  fTrip: p("Where did you travel?", "إلى أين سافرت؟", "לאן טסתם?"),
  fRating: p("Your rating", "تقييمك", "הדירוג שלכם"),
  fText: p("Tell us about your trip", "حدثنا عن رحلتك", "ספרו לנו על הטיול"),
  send: p("Send review", "إرسال التقييم", "שליחת ביקורת"),
  thanks: p("Thank you! We'll publish your review after a quick check.", "شكراً لك! سننشر تقييمك بعد مراجعة سريعة.", "תודה! נפרסם את הביקורת אחרי בדיקה קצרה."),
};

// Menu links (kept as a list so sections can be hidden here if ever needed).
export const NAV = t.nav;
