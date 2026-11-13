import { p } from "./i18n";

// ---- About us / team -------------------------------------------------------------------
// Replace these placeholders with Masia's real team, then set TEAM_IS_SAMPLE = false.
// name = shown as the card title ("" = the role is used as the title). photo = file in public/team/ (e.g. "dana.jpg"), square, at least 400×400. Leave "" to show initials.
// While TEAM_IS_SAMPLE is true the section shows a small "example" note, so placeholders are
// never presented as real people.
export const TEAM_IS_SAMPLE = true;

export const TEAM: { name: string; photo: string; role: ReturnType<typeof p>; years: number; focus: ReturnType<typeof p> }[] = [
  { name: "", photo: "member-3.png", years: 0,
    role: p("Client relations manager", "مديرة علاقات العملاء", "מנהלת קשרי לקוחות"),
    focus: p("24/7 WhatsApp support", "دعم واتساب على مدار الساعة", "תמיכה בוואטסאפ 24/7") },
  { name: "", photo: "member-1.png", years: 0,
    role: p("Founder & trip designer", "المؤسس ومصمم الرحلات", "מייסד ומתכנן טיולים"),
    focus: p("Thailand & Japan", "تايلاند واليابان", "תאילנד ויפן") },
  { name: "", photo: "member-2.png", years: 0,
    role: p("Europe specialist", "متخصص أوروبا", "מומחה לאירופה"),
    focus: p("Kosher & Jewish-heritage trips", "رحلات كوشير وتراث يهودي", "טיולים כשרים ומורשת יהודית") },
];

export const ab = {
  tag: p("About us", "من نحن", "מי אנחנו"),
  h: p("People who plan your trip like it's their own", "أشخاص يخططون لرحلتك كأنها رحلتهم", "אנשים שמתכננים את הטיול שלכם כאילו הוא שלהם"),
  l: p(
    "Masia is a small team of travellers who know Asia and Europe first-hand. We pick every hotel, route and transfer ourselves, and we stay on WhatsApp with you from the first idea until you land back home.",
    "ماسيا فريق صغير من المسافرين يعرفون آسيا وأوروبا عن قرب. نختار كل فندق ومسار وتنقّل بأنفسنا، ونبقى معك على واتساب من الفكرة الأولى حتى عودتك إلى البيت.",
    "Masia הוא צוות קטן של מטיילים שמכירים את אסיה ואירופה מקרוב. אנחנו בוחרים בעצמנו כל מלון, מסלול והסעה, ונשארים איתכם בוואטסאפ מהרעיון הראשון ועד הנחיתה בבית.",
  ),
  values: [
    { e: "🧭", t: p("We've been there", "زرناها بأنفسنا", "היינו שם בעצמנו"), d: p("Hotels and routes we know, not just a booking engine.", "فنادق ومسارات نعرفها، لا مجرد محرك حجز.", "מלונות ומסלולים שאנחנו מכירים, לא סתם מנוע הזמנות.") },
    { e: "🤝", t: p("One person, start to finish", "شخص واحد من البداية للنهاية", "איש קשר אחד מההתחלה ועד הסוף"), d: p("The same planner answers you before, during and after.", "نفس المخطط يرد عليك قبل الرحلة وخلالها وبعدها.", "אותו מתכנן עונה לכם לפני, במהלך ואחרי.") },
    { e: "💬", t: p("Clear, honest quotes", "عروض أسعار واضحة وصادقة", "הצעות מחיר ברורות והוגנות"), d: p("Everything written down. No surprises at the airport.", "كل شيء مكتوب. بلا مفاجآت في المطار.", "הכול בכתב. בלי הפתעות בשדה.") },
  ],
  years: p("years planning trips", "سنوات في تخطيط الرحلات", "שנות ניסיון בתכנון טיולים"),
  sample: p("Example team: replace with Masia's real team before launch", "فريق توضيحي: استبدله بفريق ماسيا الحقيقي قبل الإطلاق", "צוות לדוגמה: יש להחליף בצוות האמיתי של Masia לפני ההשקה"),
};
