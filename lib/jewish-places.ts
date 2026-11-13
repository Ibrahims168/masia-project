import { p, type Pair } from "./i18n";

// Where each Jewish quarter is (map pin + directions), its photo, and 3 kosher places to eat.
// Researched October 2026 from community and travel guides. Kosher supervision and opening
// hours change often: re-check before recommending a place to a client.
// tag: "k" = kosher-supervised restaurant/shop, "order" = meals ordered in advance (Chabad, community).
type Food = { n: string; d: Pair; area: string; tag: "k" | "order" };
export type Place = { img: string; cap: string; lat: number; lon: number; where: Pair; go: Pair; food: Food[] };

const k = "k" as const, order = "order" as const;

export const PLACES: Record<string, Place> = {
  prague: { img: "jw/prague", cap: "Old-New Synagogue", lat: 50.0901, lon: 14.4187,
    where: p("Old Town (Staré Město), between Old Town Square and the river, around Široká and Pařížská streets.", "البلدة القديمة (ستاريه مييستو)، بين ساحة البلدة القديمة والنهر، حول شارعي شيروكا وباريجسكا.", "העיר העתיקה (סטארה מסטו), בין כיכר העיר העתיקה לנהר, סביב הרחובות שירוקה ופרז׳סקה."),
    go: p("Metro line A to Staroměstská, then a 5-minute walk.", "المترو الخط A إلى محطة ستاروميستسكا، ثم 5 دقائق مشياً.", "מטרו קו A לתחנת סטארומסטסקה, ואז 5 דקות הליכה."),
    food: [
      { n: "King Solomon", d: p("Czech-Jewish, glatt kosher meat; Shabbat meals to order", "مطبخ تشيكي يهودي، لحوم غلات كوشير؛ وجبات السبت بالطلب", "מטבח צ׳כי-יהודי, בשרי גלאט כשר; סעודות שבת בהזמנה"), area: "Široká 8", tag: k },
      { n: "Dinitz", d: p("Mediterranean & Israeli, glatt kosher", "مطبخ متوسطي وإسرائيلي، غلات كوشير", "ים-תיכוני וישראלי, גלאט כשר"), area: "Bílkova, Josefov", tag: k },
      { n: "Chabad Kosher Grill", d: p("Middle Eastern grill under Chabad supervision", "مشويات شرقية بإشراف حاباد", "גריל מזרחי בהשגחת חב״ד"), area: "Josefov", tag: k },
    ] },
  budapest: { img: "jw/budapest", cap: "Dohány Street Synagogue", lat: 47.4958, lon: 19.0604,
    where: p("District VII, just behind Deák tér: Dohány, Rumbach and Kazinczy streets.", "الحي السابع خلف ساحة دياك مباشرة: شوارع دوهاني ورومباخ وكازينتسي.", "רובע 7, ממש מאחורי כיכר דאק: הרחובות דוהאני, רומבך וקאזינצי."),
    go: p("Metro M2 to Astoria, or M1/M2/M3 to Deák Ferenc tér.", "المترو M2 إلى أستوريا، أو M1/M2/M3 إلى ساحة دياك فيرينتس.", "מטרו M2 לאסטוריה, או M1/M2/M3 לכיכר דאק פרנץ."),
    food: [
      { n: "Carmel", d: p("Hungarian-Jewish dishes, glatt kosher meat", "أطباق مجرية يهودية، لحوم غلات كوشير", "מנות הונגריות-יהודיות, בשרי גלאט כשר"), area: "Kazinczy u. 31", tag: k },
      { n: "Hanna", d: p("Run by the Orthodox community, glatt kosher", "يديره المجتمع الأرثوذكسي، غلات كوشير", "בניהול הקהילה האורתודוקסית, גלאט כשר"), area: "District VII", tag: k },
      { n: "Tel Aviv Café", d: p("Israeli breakfast & brunch, dairy", "فطور وبرانش إسرائيلي، ألبان", "ארוחות בוקר ובראנץ׳ ישראליים, חלבי"), area: "Kazinczy u. 28", tag: k },
    ] },
  rome: { img: "jw/rome", cap: "Great Synagogue of Rome", lat: 41.8920, lon: 12.4776,
    where: p("On the Tiber bank facing Trastevere, between Largo Argentina and Tiber Island.", "على ضفة نهر التيبر مقابل تراستيفيري، بين ساحة لارغو أرجنتينا وجزيرة التيبر.", "על גדת הטיבר מול טרסטוורה, בין לארגו ארג׳נטינה לאי טיבר."),
    go: p("Tram 8 or buses to Largo Argentina, then a 5-minute walk.", "الترام 8 أو الحافلات إلى لارغو أرجنتينا، ثم 5 دقائق مشياً.", "חשמלית 8 או אוטובוסים ללארגו ארג׳נטינה, ואז 5 דקות הליכה."),
    food: [
      { n: "Ba'Ghetto", d: p("Roman-Jewish & Middle Eastern, meat", "مطبخ يهودي روماني وشرقي، لحوم", "יהודי-רומי ומזרחי, בשרי"), area: "Via del Portico d'Ottavia 57", tag: k },
      { n: "Renato al Ghetto", d: p("Roman-Jewish classics, Shabbat meals", "أطباق يهودية رومانية كلاسيكية، ووجبات السبت", "קלאסיקות יהודיות-רומיות, סעודות שבת"), area: "Via del Portico d'Ottavia 5", tag: k },
      { n: "Ba'Ghetto Milky", d: p("Dairy & fish", "ألبان وأسماك", "חלבי ודגים"), area: "Via del Portico d'Ottavia 2/A", tag: k },
    ] },
  venice: { img: "jw/venice", cap: "Campo del Ghetto Novo", lat: 45.4447, lon: 12.3263,
    where: p("Cannaregio, in north-west Venice, about 10 minutes' walk from Santa Lucia station.", "حي كاناريجو شمال غرب البندقية، على بعد 10 دقائق مشياً من محطة سانتا لوتشيا.", "רובע קנרג׳ו בצפון-מערב ונציה, כ-10 דקות הליכה מתחנת סנטה לוצ׳יה."),
    go: p("Vaporetto to the Guglie stop, or walk from the train station.", "الحافلة المائية (فابوريتو) إلى محطة غوليه، أو مشياً من محطة القطار.", "ואפורטו לתחנת גוליה, או ברגל מתחנת הרכבת."),
    food: [
      { n: "Gam Gam", d: p("Sephardic-Italian, glatt kosher; Chabad Shabbat dinners", "مطبخ سفاردي إيطالي، غلات كوشير؛ عشاء السبت لدى حاباد", "ספרדי-איטלקי, גלאט כשר; ארוחות שבת של חב״ד"), area: "Ghetto Vecchio 1122", tag: k },
      { n: "Ba'Ghetto Venezia", d: p("Roman-Jewish with Venetian flavours", "مطبخ يهودي روماني بنكهات البندقية", "יהודי-רומי בטעמים ונציאניים"), area: "Cannaregio 2873/c", tag: k },
      { n: "Gam Gam Goodies", d: p("Kosher café and bakery", "مقهى ومخبز كوشير", "בית קפה ומאפייה כשרים"), area: "Ghetto, Cannaregio", tag: k },
    ] },
  amsterdam: { img: "jw/amsterdam", cap: "Portuguese Synagogue", lat: 52.3676, lon: 4.9050,
    where: p("Around Waterlooplein, just east of the old centre; kosher shops are mostly in Buitenveldert.", "حول ساحة واترلو، شرق المركز القديم مباشرة؛ ومعظم متاجر الكوشير في بويتنفلدرت.", "סביב ווטרלופליין, ממש מזרחית למרכז הישן; רוב החנויות הכשרות בבויטנפלדרט."),
    go: p("Metro 51, 53 or 54 to Waterlooplein.", "المترو 51 أو 53 أو 54 إلى محطة واترلوبلين.", "מטרו 51, 53 או 54 לווטרלופליין."),
    food: [
      { n: "Meat Me", d: p("Glatt kosher grill", "مشويات غلات كوشير", "גריל גלאט כשר"), area: "Kastelenstraat 65", tag: k },
      { n: "Machane Yehuda", d: p("Dairy: pizza and Israeli dishes", "ألبان: بيتزا وأطباق إسرائيلية", "חלבי: פיצה ומנות ישראליות"), area: "Amsterdam-Zuid", tag: k },
      { n: "La Basta", d: p("Middle Eastern street food", "طعام شارع شرقي", "אוכל רחוב מזרחי"), area: "De Clercqstraat 16H", tag: k },
    ] },
  paris: { img: "jw/paris", cap: "Rue des Rosiers, Le Marais", lat: 48.8573, lon: 2.3590,
    where: p("Le Marais, 4th arrondissement, around Rue des Rosiers and Rue Pavée.", "حي لو ماريه في الدائرة الرابعة، حول شارع دي روزييه وشارع بافيه.", "הרובע לה מארה, רובע 4, סביב רחוב דה רוזייה ורחוב פאווה."),
    go: p("Metro line 1 to Saint-Paul, then a 3-minute walk.", "المترو الخط 1 إلى محطة سان بول، ثم 3 دقائق مشياً.", "מטרו קו 1 לתחנת סן-פול, ואז 3 דקות הליכה."),
    food: [
      { n: "L'As du Fallafel", d: p("The famous falafel of the Marais", "الفلافل الأشهر في حي ماريه", "הפלאפל המפורסם של המארה"), area: "34 Rue des Rosiers", tag: k },
      { n: "Guefen", d: p("Modern Israeli cuisine by chef Ohad Amzallag", "مطبخ إسرائيلي حديث للشيف أوهاد أمزالاغ", "מטבח ישראלי מודרני של השף אוהד אמזלג"), area: "Le Marais", tag: k },
      { n: "Kavod", d: p("Upscale kosher dining", "مطعم كوشير راقٍ", "מסעדה כשרה יוקרתית"), area: "Near the Champs-Élysées", tag: k },
    ] },
  krakow: { img: "jw/krakow", cap: "Remuh Synagogue", lat: 50.0531, lon: 19.9486,
    where: p("Kazimierz, just south of the Old Town, around Szeroka Street.", "حي كازيمييرز جنوب البلدة القديمة مباشرة، حول شارع شيروكا.", "קז׳ימייז׳, ממש דרומית לעיר העתיקה, סביב רחוב שרוקה."),
    go: p("15–20 minutes' walk from the Main Square, or tram to Miodowa.", "15–20 دقيقة مشياً من الساحة الرئيسية، أو الترام إلى محطة ميودوفا.", "15–20 דקות הליכה מהכיכר המרכזית, או חשמלית לתחנת מיודובה."),
    food: [
      { n: "Chabad of Kraków", d: p("Shabbat and glatt meals, ordered in advance", "وجبات السبت ووجبات غلات، بالطلب المسبق", "סעודות שבת וארוחות גלאט, בהזמנה מראש"), area: "Kazimierz", tag: order },
      { n: "JCC Kraków", d: p("Kosher catering to order and Friday-night dinners", "تموين كوشير بالطلب وعشاء ليلة السبت", "קייטרינג כשר בהזמנה וארוחות ליל שבת"), area: "Kazimierz", tag: order },
      { n: "Hotel Eden", d: p("Poland's only fully kosher hotel, certified meals", "الفندق الكوشير بالكامل الوحيد في بولندا، بوجبات معتمدة", "המלון הכשר היחיד בפולין, ארוחות בהשגחה"), area: "Kazimierz", tag: k },
    ] },
  vienna: { img: "jw/vienna", cap: "Seitenstettengasse & Stadttempel", lat: 48.2116, lon: 16.3746,
    where: p("Seitenstettengasse and Judenplatz in the old centre; across the canal, Leopoldstadt around Taborstraße.", "شارع زايتنشتيتنغاسه وساحة اليهود في المركز القديم؛ وعبر القناة حي ليوبولدشتات حول شارع تابور.", "סייטנשטטנגאסה ויודנפלאץ במרכז הישן; מעבר לתעלה, לאופולדשטאט סביב טבורשטראסה."),
    go: p("U1/U4 to Schwedenplatz; U2 to Taborstraße for Leopoldstadt.", "U1/U4 إلى شفيدنبلاتس؛ وU2 إلى تابورشتراسه لحي ليوبولدشتات.", "U1/U4 לשוודנפלאץ; U2 לטבורשטראסה ללאופולדשטאט."),
    food: [
      { n: "Bahur Tov", d: p("Israeli-Bukharian, kosher meat", "مطبخ إسرائيلي بخاري، لحوم كوشير", "ישראלי-בוכרי, בשרי כשר"), area: "Taborstraße 19", tag: k },
      { n: "Alef Alef", d: p("Jewish & Austrian, meat; next to the Stadttempel", "مطبخ يهودي ونمساوي، لحوم؛ بجانب شتات تمبل", "יהודי ואוסטרי, בשרי; ליד השטאדטטמפל"), area: "Seitenstettengasse 2", tag: k },
      { n: "Simchas", d: p("Sephardic kosher kitchen", "مطبخ سفاردي كوشير", "מטבח ספרדי כשר"), area: "Taborstraße 47", tag: k },
    ] },
  berlin: { img: "jw/berlin", cap: "New Synagogue", lat: 52.5248, lon: 13.3945,
    where: p("Mitte, around Oranienburger Straße (the Scheunenviertel).", "حي ميته حول شارع أورانينبورغر (شوينينفيرتل).", "מיטה, סביב רחוב אורנינבורגר (השוינפירטל)."),
    go: p("S-Bahn S1, S2 or S25 to Oranienburger Straße.", "قطار S-Bahn الخطوط S1 أو S2 أو S25 إلى أورانينبورغر شتراسه.", "רכבת S1, S2 או S25 לאורנינבורגר שטראסה."),
    food: [
      { n: "Balaboosta", d: p("Israeli restaurant, bakery & kosher market (Chabad)", "مطعم إسرائيلي ومخبز وسوق كوشير (حاباد)", "מסעדה ישראלית, מאפייה ומרכול כשר (חב״ד)"), area: "Charlottenburg", tag: k },
      { n: "Bobbe Speisesalon", d: p("Israeli-Mediterranean restaurant & bar", "مطعم وبار إسرائيلي متوسطي", "מסעדה ובר ישראלי-ים-תיכוני"), area: "Motzstraße, Wilmersdorf", tag: k },
      { n: "Shabbat dinner, Joachimstaler Straße", d: p("Traditional Friday-night dinner at the Orthodox synagogue", "عشاء ليلة السبت التقليدي في الكنيس الأرثوذكسي", "ארוחת ליל שבת מסורתית בבית הכנסת האורתודוקסי"), area: "Joachimstaler Str. 13", tag: order },
    ] },
  london: { img: "jw/london", cap: "Bevis Marks Synagogue", lat: 51.5724, lon: -0.1940,
    where: p("Golders Green in North London for kosher food and synagogues; Bevis Marks is in the City.", "غولدرز غرين في شمال لندن للطعام الكوشير والكُنُس؛ وكنيس بيفيس ماركس في حي السيتي.", "גולדרס גרין בצפון לונדון לאוכל כשר ולבתי כנסת; בוויס מרקס נמצא בסיטי."),
    go: p("Northern line to Golders Green; Liverpool Street or Aldgate for Bevis Marks.", "خط نورذرن إلى غولدرز غرين؛ ومحطة ليفربول ستريت أو ألدغيت لكنيس بيفيس ماركس.", "קו נורת׳רן לגולדרס גרין; ליברפול סטריט או אולדגייט לבוויס מרקס."),
    food: [
      { n: "Pita", d: p("Falafel bar & Middle Eastern grill", "فلافل ومشويات شرقية", "פלאפל וגריל מזרחי"), area: "Golders Green Road", tag: k },
      { n: "Taboon", d: p("Shawarma & Israeli grill", "شاورما ومشويات إسرائيلية", "שווארמה וגריל ישראלי"), area: "Golders Green", tag: k },
      { n: "Novellino", d: p("Italian-style kosher restaurant", "مطعم كوشير بطابع إيطالي", "מסעדה כשרה בסגנון איטלקי"), area: "Golders Green", tag: k },
    ] },
  thailand: { img: "jw/thailand", cap: "Khao San Road, Bangkok", lat: 13.7589, lon: 100.4974,
    where: p("Around Khao San Road in Banglamphu, old Bangkok; a second Jewish hub is on Sukhumvit.", "حول شارع كاو سان في حي بانغلامفو ببانكوك القديمة؛ ومركز يهودي آخر في سوخومفيت.", "סביב רחוב קאו סאן בבנגלמפו, בנגקוק העתיקה; מרכז יהודי נוסף בסוקומוויט."),
    go: p("Taxi, or the Chao Phraya Express boat to Phra Arthit pier.", "سيارة أجرة، أو قارب تشاو فرايا السريع إلى رصيف فرا أرتيت.", "מונית, או סירת צ׳או פראיה אקספרס למזח פרה ארתית."),
    food: [
      { n: "Chabad House Khao San", d: p("Kosher meat restaurant; delivers to hotels", "مطعم لحوم كوشير؛ يوصل إلى الفنادق", "מסעדה בשרית כשרה; משלוחים למלונות"), area: "Khao San", tag: k },
      { n: "Chabad Dairy Café & Market", d: p("Dairy café with a kosher mini-market", "مقهى ألبان مع سوق كوشير صغير", "בית קפה חלבי עם מינימרקט כשר"), area: "Khao San", tag: k },
      { n: "JCafe", d: p("Dairy café, bakery and kosher shop", "مقهى ألبان ومخبز ومتجر كوشير", "בית קפה חלבי, מאפייה וחנות כשרה"), area: "Sukhumvit", tag: k },
    ] },
  japan: { img: "jw/japan", cap: "Chiune Sugihara Memorial Hall", lat: 35.6500, lon: 139.7220,
    where: p("Hiroo in Shibuya, home of the Jewish Community of Japan; Chabad has centres in Tokyo.", "حي هيرو في شيبويا، مقر الجالية اليهودية في اليابان؛ ولحاباد مراكز في طوكيو.", "הירואו בשיבויה, ביתה של הקהילה היהודית ביפן; לחב״ד יש מרכזים בטוקיו."),
    go: p("Tokyo Metro Hibiya line to Hiroo.", "مترو طوكيو خط هيبيا إلى محطة هيرو.", "מטרו טוקיו קו היביה לתחנת הירואו."),
    food: [
      { n: "David's Deli", d: p("Kosher deli under Chabad of Tokyo supervision", "مطعم ديلي كوشير بإشراف حاباد طوكيو", "דלי כשר בהשגחת חב״ד טוקיו"), area: "Tokyo", tag: k },
      { n: "Chabad of Tokyo", d: p("Shabbat meals and kosher food delivery", "وجبات السبت وتوصيل الطعام الكوشير", "סעודות שבת ומשלוחי אוכל כשר"), area: "Tokyo", tag: order },
      { n: "Kosher Delica", d: p("Chabad-supervised meals and delivery", "وجبات وتوصيل بإشراف حاباد", "ארוחות ומשלוחים בהשגחת חב״ד"), area: "Tokyo", tag: order },
    ] },
  singapore: { img: "jw/singapore", cap: "Maghain Aboth Synagogue", lat: 1.2988, lon: 103.8506,
    where: p("Waterloo Street in the Bras Basah area, city centre.", "شارع واترلو في منطقة براس باسا، وسط المدينة.", "רחוב ווטרלו באזור בראס בסה, מרכז העיר."),
    go: p("MRT to Bras Basah or Bencoolen, then a 5-minute walk.", "قطار MRT إلى براس باسا أو بنكولين، ثم 5 دقائق مشياً.", "רכבת MRT לבראס בסה או בנקולן, ואז 5 דקות הליכה."),
    food: [
      { n: "Awafi", d: p("Middle Eastern, meat; closed Friday and Saturday", "مطبخ شرقي، لحوم؛ مغلق الجمعة والسبت", "מזרחי, בשרי; סגור בשישי ובשבת"), area: "Jacob Ballas Centre, 6th floor", tag: k },
      { n: "Elite Kosher Mart", d: p("Kosher grocery for self-catering", "بقالة كوشير لمن يطهو بنفسه", "מכולת כשרה למי שמבשל בעצמו"), area: "Jacob Ballas Centre", tag: k },
      { n: "Community Shabbat meals", d: p("Friday-night and Shabbat lunch, booked online", "عشاء ليلة السبت وغداء السبت، بالحجز عبر الإنترنت", "ארוחת ליל שבת וצהרי שבת, בהזמנה מקוונת"), area: "Maghain Aboth", tag: order },
    ] },
};

export const jwp = {
  tabs: {
    sites: p("Synagogues", "الكُنُس", "בתי כנסת"),
    food: p("Kosher food", "طعام كوشير", "אוכל כשר"),
    map: p("Jewish quarter", "الحي اليهودي", "הרובע היהודי"),
  },
  where: p("Where is the Jewish quarter?", "أين يقع الحي اليهودي؟", "איפה נמצא הרובע היהודי?"),
  go: p("Getting there", "كيف تصل", "איך מגיעים"),
  maps: p("Open in Google Maps", "افتح في خرائط Google", "פתחו ב-Google Maps"),
  food: p("3 kosher places we recommend", "3 أماكن كوشير ننصح بها", "3 מקומות כשרים שאנחנו ממליצים עליהם"),
  tags: { k: p("Kosher supervised", "كوشير بإشراف", "בהשגחה"), order: p("Order ahead", "بالطلب المسبق", "בהזמנה מראש") },
  foodNote: p("Supervision and opening hours change: check the kashrut certificate and Shabbat hours before you go. We confirm everything when we plan your trip.", "قد تتغير جهة الإشراف ومواعيد العمل: تحقق من شهادة الكشروت ومواعيد السبت قبل الذهاب. ونحن نؤكد كل شيء عند تخطيط رحلتك.", "ההשגחה ושעות הפתיחה משתנות: בדקו את תעודת הכשרות ואת שעות השבת לפני שהולכים. אנחנו מאשרים הכול כשאנחנו מתכננים את הטיול."),
};
