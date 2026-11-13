import { p } from "./i18n";

// ---- Flights from Ben Gurion (TLV) + rough costs in ₪ ------------------------------------
// Keys match t.dest (k). Routes change every season: CHECK these with the agency before launch
// and update FLIGHTS_UPDATED. direct: "yes" = year-round non-stop, "seasonal" = non-stop in some
// seasons only, "no" = one stop. hours = typical flight time from TLV.
// Costs are rough ranges in shekels: mid-range meal per person, a short taxi ride, a 4★ hotel night.
export const FLIGHTS_UPDATED = p("November 2026", "نوفمبر 2026", "נובמבר 2026");

type Direct = "yes" | "seasonal" | "no";
export const TRAVEL: Record<string, { direct: Direct; hours: string; airlines: string[]; via?: string; meal: string; taxi: string; hotel: string }> = {
  bangkok:   { direct: "yes",      hours: "11",       airlines: ["El Al"],                              meal: "25–60",   taxi: "15–35",   hotel: "250–450" },
  phuket:    { direct: "seasonal", hours: "11.5",     airlines: ["El Al"], via: "BKK",                  meal: "30–70",   taxi: "60–120",  hotel: "300–600" },
  krabi:     { direct: "no",       hours: "13–14",    airlines: ["El Al", "Thai Airways"], via: "BKK",  meal: "25–60",   taxi: "40–90",   hotel: "250–500" },
  japan:     { direct: "seasonal", hours: "12–13",    airlines: ["El Al"], via: "BKK / DXB",            meal: "40–90",   taxi: "60–120",  hotel: "500–900" },
  vietnam:   { direct: "no",       hours: "13–16",    airlines: ["Thai Airways", "Emirates"], via: "BKK / DXB", meal: "15–45", taxi: "10–30", hotel: "150–350" },
  maldives:  { direct: "no",       hours: "8–10",     airlines: ["Emirates", "Etihad"], via: "DXB / AUH", meal: "120–250", taxi: "—",     hotel: "1,500–4,000" },
  paris:     { direct: "yes",      hours: "5",        airlines: ["El Al", "Air France", "Israir"],      meal: "90–160",  taxi: "60–110",  hotel: "800–1,400" },
  rome:      { direct: "yes",      hours: "3.5",      airlines: ["El Al", "ITA Airways", "Israir", "Arkia"], meal: "70–130", taxi: "50–90", hotel: "600–1,100" },
  prague:    { direct: "yes",      hours: "4",        airlines: ["El Al", "Smartwings", "Israir", "Arkia"], meal: "50–100", taxi: "35–70", hotel: "400–750" },
  amsterdam: { direct: "yes",      hours: "5",        airlines: ["El Al", "KLM"],                       meal: "80–150",  taxi: "60–110",  hotel: "800–1,400" },
  swiss:     { direct: "yes",      hours: "4.5",      airlines: ["El Al", "Swiss"],                     meal: "120–200", taxi: "90–160",  hotel: "900–1,600" },
  santorini: { direct: "seasonal", hours: "2.5",      airlines: ["Israir", "Arkia"], via: "ATH",        meal: "80–150",  taxi: "60–120",  hotel: "700–1,600" },
};

export const tr = {
  tag: p("Flights & costs", "الطيران والتكاليف", "טיסות ועלויות"),
  h: p("How do I get there, and what does it cost?", "كيف أصل، وكم يكلّف؟", "איך מגיעים, וכמה זה עולה?"),
  l: p("Direct flights from Ben Gurion and everyday prices in shekels, side by side.", "الرحلات المباشرة من بن غوريون والأسعار اليومية بالشيكل، جنباً إلى جنب.", "טיסות ישירות מנתב״ג ומחירים יומיומיים בשקלים, זה לצד זה."),
  dest: p("Destination", "الوجهة", "יעד"),
  flight: p("Flight from TLV", "الرحلة من TLV", "טיסה מנתב״ג"),
  airlines: p("Airlines", "شركات الطيران", "חברות תעופה"),
  meal: p("Meal", "وجبة", "ארוחה"),
  taxi: p("Taxi ride", "رحلة تاكسي", "נסיעה במונית"),
  hotel: p("Hotel night 4★", "ليلة فندق 4★", "לילה במלון 4★"),
  hours: p("h", "س", "שע׳"),
  direct: {
    yes: p("Direct", "مباشر", "ישירה"),
    seasonal: p("Direct in season", "مباشر موسمياً", "ישירה בעונה"),
    no: p("1 stop", "توقف واحد", "עצירה אחת"),
  },
  via: p("via", "عبر", "דרך"),
  costTitle: p("Rough costs", "تكاليف تقريبية", "עלויות משוערות"),
  flightTitle: p("Flights from Ben Gurion", "رحلات من بن غوريون", "טיסות מנתב״ג"),
  note: p(
    "Approximate, for planning only. Routes, airlines and prices change by season; we confirm everything when we quote your trip. Updated",
    "تقديرية وللتخطيط فقط. تتغير المسارات وشركات الطيران والأسعار حسب الموسم؛ نؤكد كل شيء عند تسعير رحلتك. آخر تحديث",
    "הערכה לתכנון בלבד. מסלולים, חברות תעופה ומחירים משתנים לפי עונה; אנחנו מאשרים הכול בהצעת המחיר. עודכן",
  ),
};

// Practical "good to know" per destination: sockets (vs Israeli 2-pin plugs), local language, tipping.
// adapter: true = an Israeli plug will NOT fit, bring an adapter.
const TH = { plug: "A · B · C · O · 220V", adapter: false,
  lang: p("Thai (English in tourist areas)", "التايلاندية (والإنجليزية في المناطق السياحية)", "תאית (אנגלית באזורי תיירות)"),
  tip: p("Small tips appreciated, ~20–50 baht", "الإكرامية الصغيرة مقدّرة، نحو 20–50 بات", "טיפ קטן מקובל, כ-20–50 באט") };
const EU_TIP_ROUND = p("Service usually included; round up", "الخدمة غالباً مشمولة؛ قرّب المبلغ", "השירות לרוב כלול; מעגלים למעלה");
export const GOOD: Record<string, { plug: string; adapter: boolean; lang: ReturnType<typeof p>; tip: ReturnType<typeof p> }> = {
  bangkok: TH, phuket: TH, krabi: TH,
  japan: { plug: "A · B · 100V", adapter: true, lang: p("Japanese (little English outside cities)", "اليابانية (إنجليزية قليلة خارج المدن)", "יפנית (מעט אנגלית מחוץ לערים)"), tip: p("No tipping, it can be seen as rude", "لا إكرامية، قد تُعدّ غير لائقة", "לא נותנים טיפ, זה עלול להעליב") },
  vietnam: { plug: "A · C · D · 220V", adapter: false, lang: p("Vietnamese (English in tourist areas)", "الفيتنامية (والإنجليزية في المناطق السياحية)", "וייטנאמית (אנגלית באזורי תיירות)"), tip: p("Not expected, but welcome", "غير متوقعة لكنها مرحب بها", "לא חובה, אבל מתקבל בברכה") },
  maldives: { plug: "G · 230V", adapter: true, lang: p("Dhivehi, English widely spoken", "الديفيهية، والإنجليزية منتشرة", "דיבהי, אנגלית נפוצה מאוד"), tip: p("10% service charge usually added", "رسوم خدمة 10% تُضاف عادة", "דמי שירות 10% מתווספים בדרך כלל") },
  paris: { plug: "C · E · 230V", adapter: false, lang: p("French", "الفرنسية", "צרפתית"), tip: EU_TIP_ROUND },
  rome: { plug: "C · F · L · 230V", adapter: false, lang: p("Italian", "الإيطالية", "איטלקית"), tip: p("Cover charge (coperto) often on the bill", "رسم «كوبيرتو» غالباً على الفاتورة", "דמי שולחן (קופרטו) לרוב בחשבון") },
  prague: { plug: "C · E · 230V", adapter: false, lang: p("Czech (English common)", "التشيكية (والإنجليزية شائعة)", "צ׳כית (אנגלית נפוצה)"), tip: p("Around 10% in restaurants", "نحو 10% في المطاعم", "כ-10% במסעדות") },
  amsterdam: { plug: "C · F · 230V", adapter: false, lang: p("Dutch, English everywhere", "الهولندية، والإنجليزية في كل مكان", "הולנדית, אנגלית בכל מקום"), tip: p("Round up or 5–10%", "قرّب المبلغ أو 5–10%", "מעגלים למעלה או 5–10%") },
  swiss: { plug: "C · J · 230V", adapter: false, lang: p("German, French, Italian", "الألمانية والفرنسية والإيطالية", "גרמנית, צרפתית, איטלקית"), tip: EU_TIP_ROUND },
  santorini: { plug: "C · F · 230V", adapter: false, lang: p("Greek (English widely spoken)", "اليونانية (والإنجليزية منتشرة)", "יוונית (אנגלית נפוצה)"), tip: p("5–10% in restaurants", "5–10% في المطاعم", "5–10% במסעדות") },
};
export const goodUi = {
  title: p("Good to know", "معلومات مفيدة", "כדאי לדעת"),
  plug: p("Sockets", "المقابس", "שקעים"),
  adapterYes: p("Bring an adapter", "أحضر محوّلاً", "צריך מתאם"),
  adapterNo: p("Israeli plugs usually fit", "القابس الإسرائيلي يناسب عادة", "תקע ישראלי לרוב מתאים"),
  lang: p("Language", "اللغة", "שפה"),
  tip: p("Tipping", "الإكرامية", "טיפים"),
};
