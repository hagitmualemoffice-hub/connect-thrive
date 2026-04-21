import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.jpg";
import lectureBg from "@/assets/woman-beach.jpg";
import projectsBg from "@/assets/woman-beach-projects.jpg";
import podcastCover from "@/assets/podcast-cover.png";
import contactBg from "@/assets/contact-coffee.jpg";
import contactHeart from "@/assets/contact-heart.png";

const podcastEpisodes = [
  { num: "1", title: "על חיבור לגוף עם נועם ארז" },
  { num: "2", title: "על חיבור לגוף עם נועם ארז" },
  { num: "3", title: "על חרדה והימנעות עם דנה לוי" },
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "נא להזין שם").max(100, "שם ארוך מדי"),
  email: z.string().trim().email("כתובת מייל לא תקינה").max(255, "מייל ארוך מדי"),
  phone: z.string().trim().min(1, "נא להזין טלפון").max(20, "טלפון ארוך מדי"),
  message: z.string().trim().min(1, "נא לכתוב הודעה").max(1000, "הודעה ארוכה מדי"),
});

const projectCards = [
  {
    title: "אחותי כלה- פרויקט חדשני לרווקות מאוחרת",
    paragraphs: [
      "אחותי כלה הוא פרויקט יוזמי-קהילתי שנבנה מתוך הקשבה עמוקה לצורך ממשי, חי ופועם. מעטפת חדשנית לנשים רווקות מהמגזר החרדי מעל גיל 28, הפרויקט נולד מתוך הקשבה לצורך ממשי, עמוק ומתמשך - צורך שלא קיבל מענה מערכתי, רגשי וקהילתי, על אף היקפו הרחב.",
      "היוזמה אינה תוצר של מבנה ארגוני קיים, אלא תהליך יוזמי מודע שנבנה צעד-צעד: מתוך אפיון עמוק של הצרכים, הקשבה מתמשכת לנשים עצמן, עבודה עם אמפתיה ודיוק עצמי - והתאמה מתמדת של הפתרונות תוך כדי תנועה. זהו ביטוי חי ליזמות קשובה: יזמות שאינה מתחילה בפתרון, אלא בהבנה. לא במודל מראש, אלא בנכונות לשהות בשאלה, לדייק, ולהנהיג תהליך שיש בו אחריות, עומק וראייה אנושית.",
      "כיום, אחותי כלה היא תנועה חיה של קרוב ל-1,000 נשים, תנועה שמתרחבת הודות לכוח המיוחד של השותפות לפרויקט הזה ומתמשכת מתוך הקשבה, דיוק והליכה עקבית בדרך.",
    ],
    buttons: ["להצטרף לתפוצה", "בקרו באתר אחותי כלה"],
  },
  {
    title: "שימור פוריות - מוצאות בתוכנו דרך להתחבר לזה.\nפרויקט שנולד מתוך מחקר אקדמי, הקשבה ויישום בשטח.",
    paragraphs: [
      "הפרויקט צמח מתוך עבודת התזה שלי, שעסקה בשימור פוריות ובחוויה הנפשית של נשים ושאלה שאלה בסיסית שעוד לא נשאלה: איך אישה מרגישה אחרי שימור פוריות?",
      "המחקר חשף את האתגרים הרגשיים והחרדה המלווים את התהליך, והצביע על הצורך בליווי, החזקה וכלים שיאפשרו לנשים להיות בתוך התהליך ולא להישאר בו לבד. כיישום של המחקר, אני מפתחת ומובילה פרויקטים המשלבים הבנה פסיכולוגית, מחקר אקדמי ויישום מדויק בשדה.",
      "בין הפרויקטים: פודקאסט ייעודי, קובץ מידע נגיש, מקרר תרופות שיתופי, יזמות ליווי קהילתיות, פעילות לשינוי מדיניות, והכשרת צוותים רפואיים על החוויה הנפשית בתהליכי שימור פוריות.",
    ],
    buttons: ["מקרר התרופות השיתופי", "קובץ מידע", "הפודקאסט"],
  },
  {
    title: "רפואה רגישה: כשידע רפואי פוגש חוויה אנושית",
    paragraphs: [
      "סדנאות והרצאות לצוותות רפואיים המלווים תהליכים נשיים ותהליכי פריון - בהם מחלקות IVF, צוותי אולטרסאונד, מרפאות נשים וצוותים רב-מקצועיים בבתי חולים. העבודה מבוססת על מחקר, ידע פסיכולוגי וחשיבה מערכתית, וממוקדת בהבנת החוויה הנפשית של נשים בתוך תהליכים רפואיים אינטנסיביים. הסדנאות מעניקות כלים להקשבה, הכלה ותקשורת מותאמת, מתוך הבנה שהמפגש האנושי משפיע באופן ישיר על איכות הטיפול, שיתוף הפעולה וההתליך הרפואי כולו.",
      "העבודה מותאמת לצרכים הייחודיים של כל צוות - במטרה לאפשר טיפול מקצועי, אנושי ומדויק יותר. מתאים לישיבות צוות, כנסים אירועים מחלקתיים או הרצאת אורח כחלק מתהליך עומק.",
    ],
    buttons: ["אשמח להתארח אצלכם במחלקה"],
  },
];

const lectureCards = [
  {
    title: "הנהגה שמתחילה\nמבפנים",
    subtitle: "הנהגה פנימית, ביקורת, ובניית ערך עצמי שלא תלוי באישור חיצוני",
    desc: "הרצאה מקרקעת על המתח בין קבלה עצמית לצמיחה, ועל הובלה מבפנים והחזקה לאורך זמן.",
    audience: "נשים יזמיות, פעילות חברתיות, סדנאות עומק, קבוצות הנהגה נשית.",
  },
  {
    title: "כשחרדה עובדת\nבשבילך",
    subtitle: "יזמות נשית, חוסן, והמתח בין הקשבה לעצמך לפריצת גבולות",
    desc: 'הרצאה שמחליפה את השאלה "איך נפטרים מחרדה" ב-"איך משתמשים בה בלי שהיא תנהל אותנו".',
    audience: "יזמיות, פעילות חברתיות, צוותים יזמיים, קהילות עשייה.",
  },
  {
    title: "להרוג\nחלומות",
    subtitle: "איך מגיעים להגשמה בלי לדעת מראש לאן הולכים.",
    desc: "הרצאה על קיפאון, פחד משינוי, החלטות לא מושלמות, תנועה שמחזירה חיים והרגע שהו החיים מזמינים אותנו לזוז",
    audience: "צעירות, יזמיות, אנשים בתחילת או אמצע קריירה, קבוצות חיפוש דרך.",
  },
];

const blogPosts = [
  {
    category: "פרשה ופסיכולוגיה",
    title: "פרשת וארא\nופתיחת הלב",
    body: "קבוצת  כתיבה יצירתית\nאתגרי כתיבה דו שבועיים, סדנאות\nמקצועיות תערוכות ומרחב וירטואלי",
  },
  {
    category: "טיפול בחרדה",
    title: "הרצון הפנימי\nלהימנע",
    body: "קבוצת  כתיבה יצירתית\nאתגרי כתיבה דו שבועיים, סדנאות\nמקצועיות תערוכות ומרחב וירטואלי",
  },
  {
    category: "מימוש עצמי",
    title: "פרשת וארא\nופתיחת הלב",
    body: "קבוצת  כתיבה יצירתית\nאתגרי כתיבה דו שבועיים, סדנאות\nמקצועיות תערוכות ומרחב וירטואלי",
  },
];

const topNav = [
  { label: "הסנטר שלי", active: true },
  { label: "יזמות קשובה" },
  { label: "הפרוייקטים שלי" },
  { label: "סדנאות והרצאות" },
  { label: "בלוג" },
  { label: "פודקאסט" },
];

const heroNav = ["הרצאות", "סדנאות", "יזמות קשובה", "בלוג", "פודקאסט"];

const Index = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast({ title: "שגיאה", description: result.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({ email: result.data.email });
    setSubmitting(false);
    if (error) {
      toast({ title: "שגיאה", description: "אירעה שגיאה, נסי שוב", variant: "destructive" });
      return;
    }
    toast({ title: "תודה!", description: "ההודעה נשלחה, אחזור אלייך בהקדם." });
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Top navigation */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-white">
        <div className="flex items-center justify-between px-10 py-5">
          {/* Logo */}
          <div className="text-foreground text-xl font-semibold tracking-tight">
            חגית מועלם
          </div>

          {/* Center nav */}
          <nav className="flex items-center gap-10">
          {topNav.map((item) => (
              <button
                key={item.label}
                className={`text-sm font-normal transition-colors relative pb-1 ${
                  item.active
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
                {item.active && (
                  <span className="absolute bottom-0 right-0 left-0 h-px bg-primary" />
                )}
              </button>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 rounded-lg bg-muted text-foreground/70 text-sm font-light hover:bg-muted/80 transition-colors">
              להצטרפות לתפוצה
            </button>
            <button className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-dark))] transition-colors">
              דברו איתי
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative w-full h-[640px] overflow-hidden group">
        <img
          src={heroBg}
          alt="חגית מועלם - פסיכולוגית קלינית"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/25" />

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-6 pb-[88px]">
          <p className="text-white/90 text-base font-light mb-[2px]">
            חגית מועלם פסיכולוגית בהתמחות קלינית
          </p>
          <h1 className="text-white text-5xl md:text-6xl font-extralight tracking-wide mb-[14px]">
            כשחיבור מחולל תנועה
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-light max-w-4xl whitespace-nowrap leading-relaxed">
            על התפתחות, יזמות, קהילה ושינוי שנולדים מעומק נפשי-רוחני וחיבור לייעוד ולמשמעות
          </p>
        </div>

        {/* Floating bottom nav bar */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[min(900px,75%)] z-20">
          <div className="bg-card rounded-2xl shadow-[0_15px_50px_-10px_hsl(0_0%_0%_/_0.15)] px-12 py-[31px] flex items-center justify-center gap-8">
            {heroNav.map((label, idx) => (
              <div key={label} className="flex items-center gap-8">
                <button className="text-foreground/80 hover:text-primary transition-colors text-base font-light">
                  {label}
                </button>
                {idx < heroNav.length - 1 && (
                  <span className="text-border">|</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Spacer to account for floating bar */}
      <div className="h-24" />

      {/* About section */}
      <section className="w-full py-20 px-6">
        <div className="w-[min(1000px,72%)] mx-auto"><div className="w-[min(720px,76%)] mr-0 text-right">
          <h2 className="text-foreground text-4xl md:text-5xl font-extralight leading-tight mb-8">
            נעים מאוד, חגית מועלם פסיכולוגית בהתמחות קלינית, מרצה ויזמת.
          </h2>

          <div className="space-y-6 text-foreground/80 text-base font-light leading-relaxed">
            <p>
              העוגן המקצועי והאישי שלי נטוע בפסיכולוגיה של העצמי של קוהוט, בגישות אינטגרטיביות
              עכשוויות המבוססות על ערכים, משמעות וקבלה, ובחיבורים חיים ומשמעותיים למקורות יהודיים.
            </p>
            <p>
              אני מאמינה שחיבור עמוק לעצמנו - לרגשות, תכונות, תחושות גוף ולייעוד הגבוה שלנו- הוא
              הבסיס לתנועה שיש בה משמעות-בחיים האישיים, בעשייה מקצועית, ביזמות ובהנהגה.
              <br />
              כש"הסנטר" הפנימי שלנו ברור, כשיש חיבור למהות ולערכים, התנועה שאנחנו מחוללות בתוכנו
              ומתוכה בעולם נעשית מדויקת, יציבה ומשפיעה.
            </p>
          </div>

          <div className="mt-10 flex justify-start">
            <button className="px-10 py-3 rounded-lg bg-primary text-primary-foreground text-base font-light hover:bg-[hsl(var(--primary-dark))] transition-colors">
              לקרוא עוד
            </button>
          </div>
        </div></div>
      </section>

      {/* Movement section */}
      <section className="w-full py-20 px-6">
        <div className="w-[min(1000px,72%)] mx-auto"><div className="w-[min(720px,76%)] mr-0 text-right">
          <h2 className="text-foreground text-4xl md:text-5xl font-extralight leading-tight mb-8">
            של יצירה ועשייה תוך כדי תנועה
          </h2>

          <div className="space-y-6 text-foreground/80 text-base font-light leading-relaxed">
            <p>
              העשייה שלי נעה בין עומק נפשי לפעולה בעולם: הרצאות, יוזמות חברתיות, אקטיביזם
              ותהליכי ליווי. אני מאמינה ביצירה תוך כדי תנועה - לא כהמתנה לבהירות מושלמת, אלא
              כהיכרות מתמשכת עם עצמנו דרך בחירה, עשייה והליכה בדרך.
            </p>
            <p>
              עבורי, תנועה, חיבור לייעוד והעמקה נפשית אינם שלבים נפרדים, אלא תהליך אחד חי
              ומתפתח - שמאפשר שינוי אישי, קהילתי וחברתי.
            </p>
            <p>
              מבחינה טיפולית, אני עובדת בגישה דינמית-אינטגרטיבית, עם התמחות בליווי תהליכי
              חרדה.העבודה משלבת עומק רגשי, קשב לחוויה ולגוף, וכלים המותאמים לאדם ולשלב שבו
              הוא נמצא - מתוך ראייה רחבה של הנפש והחיים.
            </p>
          </div>

          <div className="mt-10 flex justify-start">
            <button className="px-10 py-3 rounded-lg bg-primary text-primary-foreground text-base font-light hover:bg-[hsl(var(--primary-dark))] transition-colors">
              לקרוא עוד
            </button>
          </div>
        </div></div>
      </section>

      {/* Lecture hero section */}
      <section className="relative w-full h-[680px] mt-10">
        <img
          src={lectureBg}
          alt="הרצאות - להעיר את הכוח מבפנים"
          className="absolute inset-0 w-full h-full object-cover [object-position:5%_center]"
        />
        <div className="absolute inset-0 bg-black/25" />

        {/* Title + Card aligned to same right edge as upper sections */}
        <div className="absolute inset-x-0 bottom-[390px] z-10 px-6">
          <div className="w-[min(1000px,72%)] mx-auto text-right" dir="rtl">
            <h2 className="text-white text-4xl md:text-5xl font-light tracking-wide">
              <span className="font-semibold">הרצאות</span>
              <span className="mx-3 font-extralight">|</span>
              <span className="font-extralight">להעיר את הכוח מבפנים</span>
            </h2>
            <p className="mt-3 text-white/95 text-base md:text-lg font-light">
              <span className="text-primary font-normal">אמונה, פסיכולוגיה וייעוד</span>
              <span className="mx-3">הנהגה פנימית ותנועה מתוך משמעות ומימוש</span>
            </p>
          </div>
        </div>

        {/* Floating white card */}
        <div className="absolute -bottom-16 right-0 left-0 z-20 px-6">
          <div className="w-[min(1000px,72%)] mx-auto">
            <div className="bg-card rounded-3xl shadow-[0_20px_60px_-15px_hsl(0_0%_0%_/_0.18)] px-32 py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-right" dir="rtl">
                {/* Right column */}
                <div>
                  <h3 className="text-foreground text-2xl font-bold mb-2">החיים שנועדו לי</h3>
                  <p className="text-foreground text-sm font-medium leading-relaxed mb-4">
                    אמונה, ביטחון וחיבור לייעוד ככוח לחיים מאושרים ומימוש עצמי עמוק
                  </p>
                  <p className="text-foreground/75 text-sm font-light leading-relaxed">
                    הרצאה על הקשר העמוק בין אמונה, ביטחון והיכולת לחיות חיים מלאים - כאלה שיש בהם גם שמחה, גם משמעות, וגם תנועה בעולם. לא כוויתור על עשייה, אלא כעשייה שנובעת מחיבור, הקשבה ואמון.
                  </p>
                </div>

                {/* Left column */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-foreground text-base font-semibold mb-1.5">קהל יעד</h4>
                    <p className="text-foreground/75 text-sm font-light leading-relaxed">
                      נשים, ארגונים, קהילות עומק, ימי כיף, ערבי השראה, צעירות, קבוצות מתמודדות
                    </p>
                  </div>
                  <div>
                    <h4 className="text-foreground text-base font-semibold mb-1.5">סוג פעילות</h4>
                    <div className="text-foreground/75 text-sm font-light space-y-0.5">
                      <p>הרצאה <span className="mx-2 text-border">|</span> עד 1.5 שעות</p>
                      <p>סדנה אינטימית <span className="mx-2 text-border">|</span> עד שעתיים</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-start" dir="rtl">
                <button className="px-8 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-dark))] transition-colors">
                  להזמנת הרצאה
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer for floating card */}
      <div className="h-32" />

      {/* Lecture details section */}
      <section className="w-full py-20 px-6">
        <div className="w-[min(1000px,72%)] mx-auto text-right mb-8" dir="rtl">
          <h2 className="text-foreground text-4xl md:text-5xl font-light leading-tight mb-3">
            <span className="font-extralight">מפרט</span>{" "}
            <span className="font-semibold">הרצאות</span>
          </h2>
          <p className="text-base md:text-lg font-light">
            <span className="text-primary font-normal">פסיכולוגיה של עשייה -</span>
            <span className="text-foreground/80 mx-2">הנהגה פנימית ותנועה בעולם של יזמות ועשייה</span>
          </p>
        </div>

        <div className="w-[min(1000px,72%)] mx-auto" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lectureCards.map((card) => (
              <div
                key={card.title}
                className="bg-card rounded-3xl shadow-[0_15px_40px_-15px_hsl(0_0%_0%_/_0.12)] px-12 py-14 text-right flex flex-col"
              >
                <h3 className="text-foreground text-2xl font-bold leading-tight mb-6 whitespace-pre-line">
                  {card.title}
                </h3>
                <p className="text-foreground text-sm font-medium leading-relaxed mb-2">
                  {card.subtitle}
                </p>
                <p className="text-foreground/70 text-sm font-light leading-relaxed mb-4 flex-1">
                  {card.desc}
                </p>
                <div className="mb-6">
                  <h4 className="text-foreground text-sm font-semibold mb-2">קהל יעד</h4>
                  <p className="text-foreground/70 text-sm font-light leading-relaxed">
                    {card.audience}
                  </p>
                </div>
                <div className="flex justify-start mt-auto">
                  <button className="px-8 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-dark))] transition-colors">
                    להזמנת הרצאה
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique offering - Bibliotherapy gradient section */}
      <section className="w-full py-20 px-6">
        <div className="w-[min(1200px,82%)] mx-auto">
          <div
            className="rounded-[40px] px-16 md:px-24 py-20 md:py-24 text-right"
            dir="rtl"
            style={{
              background: "linear-gradient(90deg, hsl(172 79% 79%) 0%, hsl(325 75% 69%) 100%)",
            }}
          >
            <div className="w-[min(720px,75%)] mr-0">
              <h2 className="text-white text-3xl md:text-5xl font-light leading-tight mb-10">
                <span className="font-bold">מוצר ייחודי-</span>{" "}
                <span className="font-light">סדנאות ביבליותרפיה</span>
                <br />
                <span className="font-light">הנבנות בקשב לצורך שלכם</span>
              </h2>

              <p className="text-white/95 text-sm md:text-base font-light leading-relaxed mb-8">
                סדנאות אינטימיות לקבוצות קטנות של עד 20 משתתפים, המאפשרות מרחב בטוח להתפתחות,
                חשיבה ועבודה משותפת. הטקסטים נבחרים אחרי שיחה משותפת ומקדימה ומותאמים בקפידה
                לצורך ולתנועה הספציפית של הקבוצה, ומשלבים מקורות פסיכולוגיים, ספרי הגות וטקסטים
                מן המחשבה היהודית - כבסיס לשיח, הקשבה ותהליך.
              </p>

              <h3 className="text-white text-base md:text-lg font-bold mb-2">
                איך תדעו אם זה מתאים לכם?
              </h3>
              <p className="text-white/95 text-sm md:text-base font-light leading-relaxed mb-10">
                אם אתם מחפשים מרחב שמאפשר לעצור לרגע, להעמיק ולהניע שינוי - זה כנראה בשבילכם.
                הסדנאות מתאימות לצוותים, לקבוצות עומק, ולספרינטים קצרים עבור ארגונים המבקשים
                לחולל תנועה, חיבור ודיוק דרך הקשבה, טקסט ושיח.
              </p>

              <button className="px-10 py-3 rounded-lg bg-white text-foreground text-sm md:text-base font-light shadow-md hover:bg-primary hover:text-primary-foreground hover:shadow-lg transition-all">
                בואו נתכנן לכם סדנא
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog section */}
      <section className="w-full py-20 px-6">
        <div className="w-[min(1000px,72%)] mx-auto" dir="rtl">
          <div className="flex items-start justify-between gap-8 mb-12">
            <div className="text-right">
              <h2 className="text-foreground text-4xl md:text-5xl font-light leading-tight mb-3">
                <span className="font-extralight">מרחב פנימי</span>{" "}
                <span className="font-bold">בלוג</span>
              </h2>
              <p className="text-foreground/80 text-base md:text-lg font-light">
                על נפש, תנועה ומשמעות כפי שהן פוגשות חיים.
              </p>
            </div>
            <button className="px-10 py-3 rounded-lg bg-primary text-primary-foreground text-sm md:text-base font-light hover:bg-[hsl(var(--primary-dark))] transition-colors shrink-0">
              לכל הפוסטים
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post, idx) => (
              <article
                key={idx}
                className="bg-card rounded-3xl shadow-[0_15px_40px_-15px_hsl(0_0%_0%_/_0.12)] px-10 py-12 text-right flex flex-col"
              >
                <div className="mb-6">
                  <span className="inline-block px-4 py-1.5 rounded-md bg-accent text-primary text-xs font-light">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-foreground text-xl md:text-2xl font-bold leading-tight mb-5 whitespace-pre-line">
                  {post.title}
                </h3>
                <p className="text-foreground/75 text-sm font-light leading-relaxed mb-8 whitespace-pre-line flex-1">
                  {post.body}
                </p>
                <a
                  href="#"
                  className="text-primary text-sm font-medium hover:text-[hsl(var(--primary-dark))] transition-colors text-right"
                >
                  להמשיך לקרוא
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Projects section - Listening Entrepreneurship */}
      <section className="relative w-full py-24 px-6 overflow-hidden">
        {/* Background image - only top portion (ends ~1/3 into 2nd card) */}
        <div className="absolute top-0 left-0 right-0 h-[820px] overflow-hidden">
          <img
            src={projectsBg}
            alt="יזמות קשובה - פרויקטים"
            className="absolute inset-0 w-full h-full object-cover [object-position:center_15%]"
          />
        </div>

        <div className="relative z-10 w-[min(1000px,72%)] mx-auto" dir="rtl">
          <div className="text-right mb-10">
            <h2 className="text-foreground text-4xl md:text-5xl font-light leading-tight mb-3">
              <span className="font-extralight">יזמות קשובה</span>{" "}
              <span className="font-bold">פרויקטים</span>
            </h2>
            <p className="text-base md:text-lg font-light">
              <span className="text-primary font-normal">אמפתיה, הקשבה ויצירתיות -</span>
              <span className="text-foreground/80 mx-1">פתרונות שנולדים מתוך צורך אמיתי.</span>
            </p>
          </div>

          <div className="space-y-10">
            {projectCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-card rounded-3xl shadow-[0_20px_60px_-15px_hsl(0_0%_0%_/_0.18)] px-12 md:px-20 py-14 md:py-16 text-right w-full"
              >
                <div className="w-[min(696px,100%)] mr-0 ml-auto">
                  <h3 className="text-foreground text-2xl md:text-3xl font-bold leading-tight mb-6 whitespace-pre-line">
                    {card.title}
                  </h3>
                  <div className="space-y-4 text-foreground/80 text-sm md:text-base font-light leading-relaxed mb-8">
                    {card.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                  <div className="flex flex-wrap justify-start gap-3">
                    {card.buttons.map((btn) => (
                      <button
                        key={btn}
                        className="px-7 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-dark))] transition-colors"
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Podcast section */}
      <section className="w-full py-20 overflow-hidden">
        <div className="w-[min(1000px,72%)] mx-auto" dir="rtl">
          <div className="text-right mb-12">
            <h2 className="text-foreground text-4xl md:text-5xl font-light leading-tight mb-3">
              <span className="font-extralight">יודעת</span>{" "}
              <span className="font-bold">פודקאסט</span>
            </h2>
            <p className="text-foreground/80 text-base md:text-lg font-light mb-8">
              פודקאסט על שימור פוריות וחוויה נפשית - בואי לרכוש ידע, חיבור, כוח ויכולת להיות על התהליך.
            </p>
            <button className="px-10 py-3 rounded-lg bg-primary text-primary-foreground text-sm md:text-base font-light hover:bg-[hsl(var(--primary-dark))] transition-colors">
              לכל הפרקים
            </button>
          </div>
        </div>

        {/* Cards row - aligned to same container as header */}
        <div className="w-[min(1000px,72%)] mx-auto" dir="rtl">
          <div className="grid grid-cols-3 gap-6">
            {podcastEpisodes.map((ep, idx) => (
              <div key={idx} className="flex flex-col">
                <img
                  src={podcastCover}
                  alt="יודעת פודקאסט"
                  loading="lazy"
                  width={1080}
                  height={607}
                  className="w-full h-auto rounded-3xl shadow-[0_15px_40px_-15px_hsl(0_0%_0%_/_0.15)]"
                />
                <div className="mt-5 text-right text-foreground text-sm md:text-base">
                  <span className="font-bold">פרק {ep.num}</span>
                  <span className="text-foreground/50 mx-2">|</span>
                  <span className="font-light">{ep.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="relative w-full bg-white">
        {/* Background image - only top ~half */}
        <div
          className="w-full bg-cover bg-center h-[360px] md:h-[560px]"
          style={{ backgroundImage: `url(${contactBg})` }}
        />
        {/* White card overlapping - covers ~half of bg image */}
        <div className="w-[min(900px,60%)] mx-auto -mt-40 md:-mt-72 relative z-10" dir="rtl">
          <div className="bg-white rounded-t-[32px] shadow-[0_-15px_40px_-15px_hsl(0_0%_0%_/_0.15)] px-12 md:px-24 py-12 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
              {/* Right side - icon + heading */}
              <div className="text-right">
                <div className="flex justify-start mb-6">
                  <img
                    src={contactHeart}
                    alt="דברי איתי"
                    width={160}
                    height={120}
                    className="w-28 md:w-36 h-auto"
                  />
                </div>
                <h2 className="text-foreground text-4xl md:text-5xl font-light mb-5">
                  דברי איתי
                </h2>
                <p className="text-foreground/75 text-base md:text-lg font-light leading-relaxed">
                  כאן לכל שאלה, להזמנת הרצאה, בניית סדנה מותאמת אליכם או שיתופי פעולה לפרויקטים שלי.
                </p>
              </div>

              {/* Left side - form */}
              <form onSubmit={handleSubmit} className="text-right space-y-4">
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">השם שלך</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    maxLength={100}
                    className="w-full h-11 px-4 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">כתובת מייל</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    maxLength={255}
                    className="w-full h-11 px-4 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">טלפון</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    maxLength={20}
                    className="w-full h-11 px-4 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">מה תרצי לכתוב לנו</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    maxLength={1000}
                    rows={4}
                    className="w-full px-4 py-3 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-md bg-primary text-primary-foreground text-base font-light hover:bg-[hsl(var(--primary-dark))] transition-colors disabled:opacity-60"
                >
                  {submitting ? "שולח..." : "שליחה"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
