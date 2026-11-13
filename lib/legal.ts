// Text of the legal pages. Hebrew is the binding version; English is a courtesy translation
// (Arabic visitors see the Hebrew text). These are templates: have them reviewed by a lawyer
// and fill BUSINESS in lib/config.ts. {name}, {reg}, {address}, {email}, {phone}, {contact}
// are replaced with those values (or a visible "to be completed" marker).
export type Doc = { title: string; intro: string; sections: { h: string; p: string[] }[] };
export type DocKey = "accessibility" | "privacy" | "terms";

export const LEGAL: Record<DocKey, { he: Doc; en: Doc }> = {
  accessibility: {
    he: {
      title: "הצהרת נגישות",
      intro: "{name} רואה חשיבות רבה במתן שירות שוויוני לכלל הלקוחות, ובכלל זה לאנשים עם מוגבלות. אנו פועלים להנגשת האתר בהתאם לחוק שוויון זכויות לאנשים עם מוגבלות, התשנ״ח-1998, לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע״ג-2013, ולתקן הישראלי ת״י 5568 ברמה AA.",
      sections: [
        { h: "מה עשינו באתר", p: [
          "האתר בנוי בעברית מימין לשמאל, וזמין גם בערבית ובאנגלית.",
          "ניתן לנווט בכל חלקי האתר באמצעות המקלדת, עם סימון ברור של הרכיב הפעיל.",
          "לתמונות משמעותיות יש תיאור טקסטואלי, ולכפתורים ולשדות יש תוויות.",
          "צבעי הטקסט והרקע נבחרו לניגודיות קריאה, והאתר מותאם לטלפונים, לטאבלטים ולמחשבים.",
          "האתר מכבד את הגדרת ״הפחתת תנועה״ במכשיר ומפסיק אנימציות בהתאם.",
        ] },
        { h: "תפריט הנגישות", p: [
          "בכל עמוד יש כפתור נגישות קבוע (סמל כיסא גלגלים). בתפריט ניתן להגדיל טקסט, להפעיל ניגודיות גבוהה או גווני אפור, להדגיש קישורים, לעבור לגופן קריא, להדגיש את הרכיב הממוקד ולעצור אנימציות. ההגדרות נשמרות בדפדפן לביקור הבא.",
        ] },
        { h: "מגבלות ידועות", p: [
          "למרות מאמצינו, ייתכן שחלקים מסוימים באתר אינם נגישים במלואם, למשל תוכן של צד שלישי כמו מפות מוטמעות וקישורים לאתרים רשמיים חיצוניים. אם נתקלתם בקושי, נשמח שתעדכנו אותנו ונפעל לתקן.",
        ] },
        { h: "נגישות השירות במשרד", p: [
          "פרטי הנגישות של המשרד הפיזי (חניה, כניסה, שירותים) יפורסמו כאן. כתובת: {address}.",
        ] },
        { h: "פנייה לרכז/ת הנגישות", p: [
          "שם: {contact}",
          "טלפון / וואטסאפ: {phone}",
          "דוא״ל: {email}",
          "נשתדל לחזור אליכם בתוך 3 ימי עסקים.",
        ] },
      ],
    },
    en: {
      title: "Accessibility statement",
      intro: "{name} is committed to giving equal service to all customers, including people with disabilities. We work to make this website accessible in line with Israel's Equal Rights for Persons with Disabilities Law (1998), the Service Accessibility Regulations (2013) and Israeli Standard IS 5568 at level AA.",
      sections: [
        { h: "What we have done", p: [
          "The site is built right-to-left in Hebrew and is also available in Arabic and English.",
          "Every part of the site can be used with a keyboard, with a clear focus outline.",
          "Meaningful images have text descriptions; buttons and form fields have labels.",
          "Text and background colours were chosen for readable contrast, and the layout adapts to phones, tablets and computers.",
          "The site respects your device's \"reduce motion\" setting.",
        ] },
        { h: "Accessibility menu", p: [
          "Every page has a fixed accessibility button (wheelchair icon). It lets you enlarge text, switch to high contrast or greyscale, highlight links, use a readable font, highlight the focused element and stop animations. Your choices are saved in your browser.",
        ] },
        { h: "Known limitations", p: [
          "Despite our efforts, some parts may not be fully accessible, for example third-party content such as embedded maps and links to official external websites. If you run into a problem, please tell us and we will fix it.",
        ] },
        { h: "Office accessibility", p: ["Accessibility details for our office (parking, entrance, restrooms) will be published here. Address: {address}."] },
        { h: "Contact our accessibility coordinator", p: ["Name: {contact}", "Phone / WhatsApp: {phone}", "Email: {email}", "We aim to reply within 3 business days."] },
      ],
    },
  },

  privacy: {
    he: {
      title: "מדיניות פרטיות",
      intro: "מדיניות זו מסבירה איזה מידע {name} (ח.פ./ע.מ. {reg}) אוספת באתר, למה, ואילו זכויות יש לכם. אנו פועלים בהתאם לחוק הגנת הפרטיות, התשמ״א-1981, והתקנות שלפיו.",
      sections: [
        { h: "איזה מידע אנחנו אוספים", p: [
          "פרטים שאתם מוסרים בטופס יצירת הקשר או בהרשמה לעדכונים: שם, דוא״ל, טלפון, יעד, תאריכים ותוכן ההודעה.",
          "תשובות לשאלון ״מצאו את הטיול המושלם״ והדרכון שבחרתם, הנשמרים בדפדפן שלכם בלבד (localStorage) כדי לזכור את ההתקדמות.",
          "כשאתם פונים אלינו בוואטסאפ, ההתכתבות מתנהלת בשירות של WhatsApp ובכפוף למדיניות שלו.",
        ] },
        { h: "למה אנחנו משתמשים במידע", p: [
          "כדי לחזור אליכם, לתכנן את הטיול, לשלוח הצעת מחיר ולתאם הזמנות מול ספקים (חברות תעופה, מלונות, הסעות).",
          "כדי לשלוח עדכונים ומבצעים, רק אם נרשמתם לכך. ניתן להסיר את ההרשמה בכל עת.",
          "איננו מוכרים את המידע שלכם לאף גורם.",
        ] },
        { h: "עם מי המידע משותף", p: [
          "עם ספקי שירותי התיירות הדרושים להזמנה שלכם, ורק במידה הנדרשת.",
          "עם ספק שירות שליחת הטפסים שלנו, המעביר את הפניות לתיבת הדוא״ל של המשרד.",
          "עם רשויות, כאשר הדבר נדרש לפי דין.",
        ] },
        { h: "אבטחה ושמירה", p: [
          "אנו נוקטים אמצעים סבירים לאבטחת המידע. המידע נשמר רק כל עוד הוא נחוץ למטרות שלשמן נאסף או כנדרש לפי דין.",
        ] },
        { h: "הזכויות שלכם", p: [
          "אתם רשאים לבקש לעיין במידע שנשמר עליכם, לתקן אותו או לבקש למחוק אותו. פנו אלינו בדוא״ל {email} או בטלפון {phone}.",
        ] },
        { h: "עוגיות ואחסון בדפדפן", p: [
          "האתר שומר בדפדפן את שפת התצוגה, את הגדרות הנגישות ואת התקדמות השאלון. ניתן למחוק מידע זה דרך הגדרות הדפדפן. אם נוסיף כלי מדידה (כגון Google Analytics), נעדכן מדיניות זו.",
        ] },
        { h: "יצירת קשר", p: ["{name} · {address} · {email} · {phone}"] },
      ],
    },
    en: {
      title: "Privacy policy",
      intro: "This policy explains what information {name} (reg. no. {reg}) collects on this website, why, and what rights you have. We act in accordance with Israel's Protection of Privacy Law (1981) and its regulations.",
      sections: [
        { h: "What we collect", p: [
          "Details you give in the contact or newsletter form: name, email, phone, destination, dates and your message.",
          "Your answers to the trip finder and the passport you chose, stored only in your own browser (localStorage) to remember your progress.",
          "If you message us on WhatsApp, that conversation runs on WhatsApp's service and under its policy.",
        ] },
        { h: "How we use it", p: [
          "To reply to you, plan your trip, send a quote and arrange bookings with suppliers (airlines, hotels, transfers).",
          "To send news and offers, only if you signed up. You can unsubscribe at any time.",
          "We never sell your information.",
        ] },
        { h: "Who we share it with", p: [
          "The travel suppliers needed for your booking, and only as much as needed.",
          "Our form-delivery provider, which forwards your request to our office inbox.",
          "Authorities, when required by law.",
        ] },
        { h: "Security and retention", p: ["We take reasonable measures to protect your information and keep it only as long as needed for its purpose or as required by law."] },
        { h: "Your rights", p: ["You may ask to see, correct or delete the information we hold about you. Contact us at {email} or {phone}."] },
        { h: "Cookies and browser storage", p: ["The site stores your language, accessibility settings and trip-finder progress in your browser. You can clear this in your browser settings. If we add analytics tools (such as Google Analytics) we will update this policy."] },
        { h: "Contact", p: ["{name} · {address} · {email} · {phone}"] },
      ],
    },
  },

  terms: {
    he: {
      title: "תנאי שימוש",
      intro: "ברוכים הבאים לאתר של {name}. השימוש באתר כפוף לתנאים הבאים. הפנייה בלשון רבים מתייחסת לכל המינים.",
      sections: [
        { h: "מטרת האתר", p: [
          "האתר מציג מידע על יעדים, חבילות ושירותי תיירות, ומאפשר לפנות אלינו לקבלת הצעת מחיר. אין באתר עצמו ביצוע הזמנה או תשלום; כל הזמנה מאושרת רק בהצעת מחיר ובאישור בכתב מהמשרד.",
        ] },
        { h: "דיוק המידע", p: [
          "מידע על טיסות, זמני טיסה, מחירים משוערים, עונות, ויזות ותנאי כניסה מוצג להתרשמות ולתכנון בלבד, ועשוי להשתנות. האחריות לבדוק את תנאי הכניסה, תוקף הדרכון והוויזות מוטלת על הנוסע; אנו נשמח לסייע ולאשר את הפרטים בעת ההזמנה.",
          "המידע באתר אינו מהווה ייעוץ משפטי.",
        ] },
        { h: "מחירים והזמנות", p: [
          "המחירים נקבעים בהצעת מחיר אישית לפי תאריכים, זמינות והרכב הנוסעים. תנאי התשלום, הביטול והשינוי של כל הזמנה יפורטו בהצעת המחיר ובהתאם לתנאי הספקים (חברות תעופה, מלונות וכו׳) ולחוק הגנת הצרכן, התשמ״א-1981.",
        ] },
        { h: "קניין רוחני", p: [
          "התכנים, העיצוב והלוגו באתר שייכים ל-{name} או לבעלי הזכויות בהם (לרבות תמונות ברישיון חופשי המפורטות בקרדיטים בתחתית העמוד), ואין להעתיקם ללא רשות.",
        ] },
        { h: "קישורים לאתרים אחרים", p: [
          "האתר מקשר לאתרים רשמיים ולשירותים של צד שלישי (כגון אתרי ויזה, מפות ווואטסאפ). איננו אחראים לתוכן או לזמינות שלהם.",
        ] },
        { h: "הגבלת אחריות", p: [
          "{name} פועלת כסוכנות נסיעות ומתווכת בין הלקוח לספקי השירות. האחריות לביצוע השירותים עצמם חלה על הספקים, בכפוף לדין.",
        ] },
        { h: "דין וסמכות שיפוט", p: ["על השימוש באתר יחולו דיני מדינת ישראל, וסמכות השיפוט הבלעדית תהיה לבתי המשפט המוסמכים בישראל."] },
        { h: "יצירת קשר", p: ["{name} · ח.פ./ע.מ. {reg} · {address} · {email} · {phone}"] },
      ],
    },
    en: {
      title: "Terms of use",
      intro: "Welcome to the {name} website. Using the site is subject to the following terms.",
      sections: [
        { h: "Purpose of the site", p: ["The site presents destinations, packages and travel services and lets you contact us for a quote. No booking or payment is made on the site itself; every booking is confirmed only by a quote and written confirmation from our office."] },
        { h: "Accuracy", p: [
          "Information about flights, flight times, estimated prices, seasons, visas and entry rules is for planning only and may change. Checking entry rules, passport validity and visas is the traveller's responsibility; we are happy to help and confirm details when booking.",
          "Nothing on the site is legal advice.",
        ] },
        { h: "Prices and bookings", p: ["Prices are set in a personal quote based on dates, availability and travellers. Payment, cancellation and change terms for each booking are stated in the quote and follow the suppliers' terms and Israel's Consumer Protection Law (1981)."] },
        { h: "Intellectual property", p: ["The content, design and logo belong to {name} or their rights holders (including freely licensed photos listed in the credits at the bottom of the page) and may not be copied without permission."] },
        { h: "Links to other sites", p: ["The site links to official and third-party services (visa sites, maps, WhatsApp). We are not responsible for their content or availability."] },
        { h: "Limitation of liability", p: ["{name} acts as a travel agency between the customer and service suppliers. Responsibility for performing the services lies with the suppliers, subject to law."] },
        { h: "Governing law", p: ["These terms are governed by the laws of the State of Israel, and the competent courts in Israel have exclusive jurisdiction."] },
        { h: "Contact", p: ["{name} · reg. {reg} · {address} · {email} · {phone}"] },
      ],
    },
  },
};

export const legalUi = {
  back: { he: "חזרה לאתר", en: "Back to the site", ar: "العودة إلى الموقع" },
  updated: { he: "עודכן", en: "Updated", ar: "آخر تحديث" },
  todo: { he: "[להשלמה]", en: "[to be completed]", ar: "[للاستكمال]" },
  links: {
    accessibility: { he: "הצהרת נגישות", en: "Accessibility", ar: "إمكانية الوصول" },
    privacy: { he: "מדיניות פרטיות", en: "Privacy policy", ar: "سياسة الخصوصية" },
    terms: { he: "תנאי שימוש", en: "Terms of use", ar: "شروط الاستخدام" },
  },
  consent: { he: "בשליחת הטופס אתם מאשרים את", en: "By sending this form you agree to the", ar: "بإرسال النموذج فإنك توافق على" },
};
