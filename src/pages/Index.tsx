import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Sprout } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import MailingListPopup from "@/components/MailingListPopup";
import ContactPopup, { type ContactTab } from "@/components/ContactPopup";
import HostingPopup from "@/components/HostingPopup";
import heroBg from "@/assets/hero-bg.jpg";
import lectureBg from "@/assets/woman-beach.jpg";
import projectsBg from "@/assets/woman-beach-projects.jpg";
import podcastCover from "@/assets/podcast-cover.png";
import contactBg from "@/assets/contact-coffee.jpg";
import contactHeart from "@/assets/contact-heart.png";
import { blogPosts as allBlogPosts } from "@/data/blogPosts";

const podcastEpisodes = [
  { num: "1", title: "על חיבור לגוף עם נעם ארז" },
  { num: "2", title: 'על הקשבה לגוף עם ד"ר מיכל פרנסט' },
  { num: "3", title: "על חרדה והימנעות עם דורית בנגד אלבד" },
  { num: "4", title: 'על התהליך עצמו עם ד"ר ירדנה היימן' },
];


type ProjectButton = {
  label: string;
  href?: string;
  action?: "mailing" | "hosting";
};

const projectCards: Array<{
  title: string;
  paragraphs: string[];
  buttons: ProjectButton[];
}> = [
  {
    title: "אחותי כלה- פרויקט חדשני לרווקות מאוחרת",
    paragraphs: [
      "אחותי כלה הוא פרויקט יוזמי-קהילתי שנבנה מתוך הקשבה עמוקה לצורך ממשי, חי ופועם. מעטפת חדשנית לנשים רווקות מהמגזר החרדי מעל גיל 28, הפרויקט נולד מתוך הקשבה לצורך ממשי, עמוק ומתמשך - צורך שלא קיבל מענה מערכתי, רגשי וקהילתי, על אף היקפו הרחב.",
      "היוזמה אינה תוצר של מבנה ארגוני קיים, אלא תהליך יוזמי מודע שנבנה צעד-צעד: מתוך אפיון עמוק של הצרכים, הקשבה מתמשכת לנשים עצמן, עבודה עם אמפתיה ודיוק עצמי - והתאמה מתמדת של הפתרונות תוך כדי תנועה. זהו ביטוי חי ליזמות קשובה: יזמות שאינה מתחילה בפתרון, אלא בהבנה. לא במודל מראש, אלא בנכונות לשהות בשאלה, לדייק, ולהנהיג תהליך שיש בו אחריות, עומק וראייה אנושית.",
      "כיום, אחותי כלה היא תנועה חיה של קרוב ל-1,000 נשים, תנועה שמתרחבת הודות לכוח המיוחד של השותפות לפרויקט הזה ומתמשכת מתוך הקשבה, דיוק והליכה עקבית בדרך.",
    ],
    buttons: [
      { label: "להצטרפות לתפוצה", href: "https://achotikala.com/#grup" },
      { label: "בקרי באתר אחותי כלה", href: "https://achotikala.com/" },
    ],
  },
  {
    title: "שימור פוריות - מוצאות בתוכנו דרך להתחבר לזה.\nפרויקט שנולד מתוך מחקר אקדמי, הקשבה ויישום בשטח.",
    paragraphs: [
      "הפרויקט צמח מתוך עבודת התזה שלי, שעסקה בשימור פוריות ובחוויה הנפשית של נשים ושאלה שאלה בסיסית שעוד לא נשאלה: איך אישה מרגישה אחרי שימור פוריות?",
      "המחקר חשף את האתגרים הרגשיים והחרדה המלווים את התהליך, והצביע על הצורך בליווי, החזקה וכלים שיאפשרו לנשים להיות בתוך התהליך ולא להישאר בו לבד. כיישום של המחקר, אני מפתחת ומובילה פרויקטים המשלבים הבנה פסיכולוגית, מחקר אקדמי ויישום מדויק בשדה.",
      "בין הפרויקטים: פודקאסט ייעודי, קובץ מידע נגיש, מקרר תרופות שיתופי, יזמות ליווי קהילתיות, פעילות לשינוי מדיניות, והכשרת צוותים רפואיים על החוויה הנפשית בתהליכי שימור פוריות.",
    ],
    buttons: [
      {
        label: "קובץ מידע",
        href: "https://docs.google.com/presentation/d/1-otESJad2269asNVzACA9m952hkQFx9lx2kXZkL9r0A/present?slide=id.g38683e446e7_2_75",
      },
      {
        label: "הפודקאסט",
        href: "https://open.spotify.com/show/2FIal7yOO7htlBkKUwCbxW?si=dtVPb1AQQomBBOTazo3hWA",
      },
      {
        label: "מקרר התרופות השיתופי",
        href: "https://docs.google.com/spreadsheets/d/1fgakciTdJORHhOip1MwBzUrU4k0H15f5IZY6Liewdi0/edit?gid=0#gid=0&fvid=709051320",
      },
    ],
  },
  {
    title: "רפואה רגישה: כשידע רפואי פוגש חוויה אנושית",
    paragraphs: [
      "סדנאות והרצאות לצוותות רפואיים המלווים תהליכים נשיים ותהליכי פריון - בהם מחלקות IVF, צוותי אולטרסאונד, מרפאות נשים וצוותים רב-מקצועיים בבתי חולים. העבודה מבוססת על מחקר, ידע פסיכולוגי וחשיבה מערכתית, וממוקדת בהבנת החוויה הנפשית של נשים בתוך תהליכים רפואיים אינטנסיביים. הסדנאות מעניקות כלים להקשבה, הכלה ותקשורת מותאמת, מתוך הבנה שהמפגש האנושי משפיע באופן ישיר על איכות הטיפול, שיתוף הפעולה וההתליך הרפואי כולו.",
      "העבודה מותאמת לצרכים הייחודיים של כל צוות - במטרה לאפשר טיפול מקצועי, אנושי ומדויק יותר. מתאים לישיבות צוות, כנסים אירועים מחלקתיים או הרצאת אורח כחלק מתהליך עומק.",
    ],
    buttons: [{ label: "אשמח להתארח אצלכם במחלקה", action: "hosting" }],
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

const blogPosts = allBlogPosts.slice(0, 3);

const topNav = [
  { label: "אודות", href: "#about" },
  { label: "יזמות קשובה", href: "#entrepreneurship" },
  { label: "הפרויקטים שלי", href: "#projects" },
  { label: "הרצאות", href: "#lectures" },
  { label: "סדנאות", href: "#workshops" },
  { label: "בלוג", href: "/blog" },
  { label: "פודקאסט", href: "/podcast" },
];

const inlineSchema = z.object({
  name: z.string().trim().min(1, "נא להזין שם").max(100, "שם ארוך מדי"),
  email: z.string().trim().email("כתובת מייל לא תקינה").max(255, "מייל ארוך מדי"),
});

const Index = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactTab, setContactTab] = useState<ContactTab>("general");
  const [inlineForm, setInlineForm] = useState({ name: "", email: "" });
  const [inlineSubmitting, setInlineSubmitting] = useState(false);

  const handleInlineSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = inlineSchema.safeParse(inlineForm);
    if (!result.success) {
      toast({ title: "שגיאה", description: result.error.issues[0].message, variant: "destructive" });
      return;
    }
    setInlineSubmitting(true);
    const { error } = await supabase.from("leads").insert({ email: result.data.email });
    setInlineSubmitting(false);
    if (error) {
      toast({ title: "שגיאה", description: "אירעה שגיאה, נסי שוב", variant: "destructive" });
      return;
    }
    toast({ title: "תודה!", description: "נרשמת בהצלחה לתפוצה." });
    setInlineForm({ name: "", email: "" });
  };

  const openContact = (tab: ContactTab) => {
    setContactTab(tab);
    setContactOpen(true);
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Top navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between px-10 py-5">
          {/* Logo */}
          <a href="#top" className="text-foreground text-xl font-semibold tracking-tight">
            חגית מועלם
          </a>

          {/* Center nav */}
          <nav className="flex items-center gap-10">
          {topNav.map((item) => {
            const isInternal = item.href.startsWith("/");
            const Cmp: any = isInternal ? Link : "a";
            const linkProps = isInternal ? { to: item.href } : { href: item.href };
            return (
              <Cmp
                key={item.label}
                {...linkProps}
                className="text-sm font-normal text-foreground hover:text-primary transition-colors relative pb-1"
              >
                {item.label}
              </Cmp>
            );
          })}
          </nav>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setPopupOpen(true)}
              className="px-5 py-2.5 rounded-lg bg-muted text-foreground/70 text-sm font-light hover:bg-muted/80 transition-colors"
            >
              להצטרפות לתפוצה
            </button>
            <button
              onClick={() => openContact("general")}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-glow))] transition-colors"
            >
              דברו איתי
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative w-full h-[640px] group">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={heroBg}
            alt="חגית מועלם - פסיכולוגית קלינית"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-end text-center px-6 pb-[88px]">
          <p className="text-white/90 text-base font-light mb-[2px]">
            חגית מועלם פסיכולוגית בהתמחות קלינית
          </p>
          <h1 className="text-white text-5xl md:text-6xl font-light tracking-wide mb-[14px]">
            כשחיבור מחולל תנועה
          </h1>
          <p className="text-white/90 text-lg md:text-xl font-light max-w-4xl whitespace-nowrap leading-relaxed">
            על התפתחות, יזמות, קהילה ושינוי שנולדים מעומק נפשי-רוחני וחיבור לייעוד ולמשמעות
          </p>
        </div>

        {/* Floating mailing list signup bar */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[min(1000px,94%)] z-20">
          <div className="bg-card rounded-2xl shadow-[0_15px_50px_-10px_hsl(0_0%_0%_/_0.15)] px-6 py-5 md:px-8 md:py-6 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="text-center md:text-right shrink-0">
              <p className="text-foreground text-base md:text-lg font-light leading-tight">
                בואי להתחבר לעצמך דרך תוכן איכותי
              </p>
              <p className="text-foreground/60 text-xs md:text-sm font-light leading-tight mt-1">
                הצטרפי לתפוצה השקטה שלי
              </p>
            </div>
            <form
              onSubmit={handleInlineSubscribe}
              className="flex flex-col sm:flex-row items-stretch gap-2 w-full md:w-auto md:flex-1 md:max-w-[560px]"
            >
              <input
                type="text"
                placeholder="שם"
                value={inlineForm.name}
                onChange={(e) => setInlineForm({ ...inlineForm, name: e.target.value })}
                className="flex-1 min-w-0 bg-muted/50 border border-transparent rounded-full px-5 py-2.5 text-sm font-light text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/40 focus:bg-background transition-colors text-right"
              />
              <input
                type="email"
                placeholder="כתובת מייל"
                value={inlineForm.email}
                onChange={(e) => setInlineForm({ ...inlineForm, email: e.target.value })}
                className="flex-1 min-w-0 bg-muted/50 border border-transparent rounded-full px-5 py-2.5 text-sm font-light text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/40 focus:bg-background transition-colors text-right"
              />
              <button
                type="submit"
                disabled={inlineSubmitting}
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm md:text-base font-light hover:bg-[hsl(var(--primary-glow))] transition-all whitespace-nowrap shadow-sm shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {inlineSubmitting ? "שולחת..." : "הצטרפות"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Spacer to account for floating bar */}
      <div className="h-28 md:h-24" />

      {/* About section */}
      <section id="about" className="w-full py-20 px-6">

        <div className="w-[min(1000px,72%)] mx-auto"><div className="w-[min(720px,76%)] mr-0 text-right">
          <h2 className="text-foreground text-4xl md:text-5xl font-light leading-tight mb-8">
            נעים מאוד, חגית מועלם פסיכולוגית בהתמחות קלינית, מרצה ויזמת.
          </h2>

          <div className="space-y-6 text-foreground/80 text-base font-light leading-relaxed">
            <p>
              העוגן המקצועי והאישי שלי נטוע בגישה דינמית-אינטגרטיבית, בשילוב גישות עכשוויות
              המבוססות על ערכים, משמעות וקבלה, ובחיבור חי ומשמעותי למקורות יהודיים.
            </p>
            <p>
              אני מאמינה שחיבור עמוק לעצמנו ולייעוד הגבוה שלנו הוא הבסיס לתנועה שיש בה משמעות –
              בחיים האישיים, בעשייה מקצועית, ביזמות ובהנהגה. כש"הסנטר" הפנימי שלנו ברור, התנועה
              שנובעת מתוכנו אל העולם נעשית מדויקת יותר, יציבה יותר ובעלת השפעה עמוקה.
            </p>
          </div>

          <div className="mt-8 flex justify-start">
            <Heart className="text-primary" size={36} strokeWidth={1.5} fill="hsl(var(--primary) / 0.15)" aria-hidden="true" />
          </div>
        </div></div>
      </section>

      {/* Movement section */}
      <section id="entrepreneurship" className="w-full py-20 px-6">

        <div className="w-[min(1000px,72%)] mx-auto"><div className="w-[min(720px,76%)] mr-0 text-right">
          <h2 className="text-foreground text-4xl md:text-5xl font-light leading-tight mb-8">
            אני מאמינה בכוח של יצירה ועשייה מתוך קשיבות ותוך כדי תנועה
          </h2>

          <div className="space-y-6 text-foreground/80 text-base font-light leading-relaxed">
            <p>
              העשייה שלי נעה בין עומק נפשי לפעולה בעולם: יזמות חברתית, אקטיביזם, הרצאות
              ותהליכי ליווי. אני מאמינה ביצירה תוך כדי תנועה – לא כהמתנה לבהירות מושלמת, אלא
              כהיכרות מתמשכת עם עצמנו דרך בחירה, עשייה והליכה בדרך. עבורי, תנועה, חיבור
              לייעוד והעמקה נפשית אינם שלבים נפרדים, אלא תהליך אחד חי ומתפתח – שמאפשר שינוי
              אישי, קהילתי וחברתי.
            </p>
            <p>
              אני מאמינה ביזמות קשובה – יזמות שמחוברת לשטח, נובעת מתוך צורך אמיתי, חותרת
              לפתרון נקודות כאב, וקשובה לעצמה תוך כדי תנועה ומתוך דיוק מתמשך. זו יזמות שלא
              ממהרת לייצר פתרונות מהירים, אלא עוצרת להקשיב, להבין לעומק את האנשים וההקשר,
              ולפעול מתוך אחריות וחיבור. היא מתפתחת יחד עם המציאות, לומדת ממנה, ומשתנה
              בהתאם – מתוך מחויבות אמיתית ליצירת ערך, רלוונטיות והשפעה.
            </p>
          </div>

          <div className="mt-8 flex justify-start">
            <Sprout className="text-primary" size={36} strokeWidth={1.5} aria-hidden="true" />
          </div>
        </div></div>
      </section>

      {/* Projects section - Listening Entrepreneurship */}
      <section id="projects" className="relative w-full py-24 px-6 overflow-hidden">
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
              <span className="font-light">יזמות קשובה</span>
              <span className="mx-3 font-light">|</span>
              <span className="font-light">פרויקטים</span>
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
                        className="px-7 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-glow))] transition-colors"
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

      {/* Lecture hero section */}
      <section id="lectures" className="relative w-full h-[680px] mt-10">
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
              <span className="font-light">להעיר את הכוח מבפנים</span>
              <span className="mx-3 font-light">|</span>
              <span className="font-light">הרצאת הדגל</span>
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
            <div className="bg-card rounded-3xl shadow-[0_20px_60px_-15px_hsl(0_0%_0%_/_0.18)] px-32 py-20 transition-all duration-500 ease-out hover:shadow-[0_28px_70px_-15px_hsl(var(--primary)/0.25)] hover:-translate-y-1">
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
                <button
                  onClick={() => openContact("lecture")}
                  className="px-8 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-glow))] transition-colors"
                >
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
            <span className="font-light">הרצאות</span>
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
                className="bg-card rounded-3xl shadow-[0_15px_40px_-15px_hsl(0_0%_0%_/_0.12)] px-12 py-14 text-right flex flex-col transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_25px_50px_-15px_hsl(var(--primary)/0.25)] cursor-pointer"
              >
                <h3 className="text-foreground text-2xl font-bold leading-tight mb-1 whitespace-pre-line">
                  {card.title}
                </h3>
                <p className="text-foreground text-sm font-medium leading-relaxed mb-0.5">
                  {card.subtitle}
                </p>
                <p className="text-foreground/70 text-sm font-light leading-relaxed mb-1 flex-1">
                  {card.desc}
                </p>
                <div className="mb-6">
                  <h4 className="text-foreground text-sm font-semibold mb-2">קהל יעד</h4>
                  <p className="text-foreground/70 text-sm font-light leading-relaxed">
                    {card.audience}
                  </p>
                </div>
                <div className="flex justify-start mt-auto">
                  <button
                    onClick={() => openContact("lecture")}
                    className="px-8 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-glow))] transition-colors"
                  >
                    להזמנת הרצאה
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Unique offering - Bibliotherapy gradient section */}
      <section id="workshops" className="w-full py-20 px-6">
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
                <span className="font-light">סדנאות ביבליותרפיה</span>
                <br />
                <span className="font-light">הנבנות בקשב לצורך שלכם</span>
              </h2>

              <p className="text-white/95 text-sm md:text-base font-light leading-relaxed mb-6">
                מחפשים מרחב עמוק, חי ולא שגרתי לעבודה קבוצתית?
              </p>

              <p className="text-white/95 text-sm md:text-base font-light leading-relaxed mb-6">
                סדנאות ביבליותרפיה המבוססות על קריאה משותפת של טקסטים והנחיה של שיח קבוצתי
                משמעותי. הטקסטים אינם רק תוכן - הם שער: פותחים רגשות, שאלות ונקודות כאב,
                ומאפשרים תנועה אמיתית בקבוצה.
              </p>

              <p className="text-white/95 text-sm md:text-base font-light leading-relaxed mb-6">
                כל סדנה נבנית במיוחד עבורכם, מתוך הקשבה לצורך, לאנשים ולשלב שבו אתם נמצאים.
                אני משלבת טקסטים מעולמות הפסיכולוגיה, הספרות וההגות, לצד מקורות מן המחשבה
                היהודית - מפגש ייחודי בין עומק רגשי, משמעות ושיח אמוני־רוחני. ניתן גם לבנות
                סדנאות עם דגש ייעודי על מקורות אלו.
              </p>

              <p className="text-white/95 text-sm md:text-base font-light leading-relaxed mb-10">
                הסדנאות אינטימיות (עד 20 משתתפים), ומתאימות לצוותים, לקבוצות עומק ולארגונים
                שמבקשים לגעת לעומק, לחדד תהליכים ולהניע שינוי דרך הקשבה, טקסט ושיח מונחה.
              </p>

              <button
                onClick={() => openContact("workshop")}
                className="px-10 py-3 rounded-lg bg-white text-foreground text-sm md:text-base font-light shadow-md hover:bg-primary hover:text-primary-foreground hover:shadow-lg transition-all"
              >
                בואו נתכנן לכם סדנא
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog section */}
      <section id="blog" className="w-full py-20 px-6">
        <div className="w-[min(1000px,72%)] mx-auto" dir="rtl">
          <div className="text-right mb-12">
            <h2 className="text-foreground text-4xl md:text-5xl font-light leading-tight mb-3">
              <span className="font-light">מרחב פנימי</span>
              <span className="mx-3 font-light">|</span>
              <span className="font-light">בלוג</span>
            </h2>
            <p className="text-foreground/80 text-base md:text-lg font-light">
              על נפש, תנועה ומשמעות כפי שהן פוגשות חיים.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Link
                to={`/blog/${post.slug}`}
                key={post.slug}
                className="group bg-card rounded-3xl shadow-[0_15px_40px_-15px_hsl(0_0%_0%_/_0.12)] overflow-hidden text-right flex flex-col transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_25px_50px_-15px_hsl(var(--primary)/0.25)] cursor-pointer"
              >
                <div className="h-44 overflow-hidden bg-accent">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-8 py-8 flex flex-col flex-1">
                  <div className="mb-4">
                    <span className="inline-block px-4 py-1.5 rounded-md bg-accent text-primary text-xs font-light">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-foreground text-lg md:text-xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-foreground/75 text-sm font-light leading-relaxed mb-6 flex-1">
                    {post.subtitle}
                  </p>
                  <span className="text-primary text-sm font-medium group-hover:text-[hsl(var(--primary-glow))] transition-colors text-right">
                    להמשיך לקרוא ←
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link to="/blog" className="px-10 py-3 rounded-lg bg-primary text-primary-foreground text-sm md:text-base font-light hover:bg-[hsl(var(--primary-glow))] transition-colors">
              לכל הפוסטים
            </Link>
          </div>
        </div>
      </section>


      {/* Podcast section */}
      <section id="podcast" className="w-full py-20 overflow-hidden">
        <div className="w-[min(1000px,72%)] mx-auto" dir="rtl">
          <div className="text-right mb-12">
            <h2 className="text-foreground text-4xl md:text-5xl font-light leading-tight mb-3">
              <span className="font-light">יודעת</span>
              <span className="mx-3 font-light">|</span>
              <span className="font-light">פודקאסט</span>
            </h2>
            <p className="text-foreground/80 text-base md:text-lg font-light">
              פודקאסט על שימור פוריות וחוויה נפשית - בואי לרכוש ידע, חיבור, כוח ויכולת להיות על התהליך.
            </p>
          </div>
        </div>

        {/* Cards row - aligned to same container as header */}
        <div className="w-[min(1000px,72%)] mx-auto" dir="rtl">
          <div className="grid grid-cols-3 gap-6">
            {podcastEpisodes.map((ep, idx) => (
              <a
                href="#"
                key={idx}
                className="flex flex-col group cursor-pointer transition-all duration-300 ease-out hover:scale-[1.03]"
              >
                <img
                  src={podcastCover}
                  alt="יודעת פודקאסט"
                  loading="lazy"
                  width={1080}
                  height={607}
                  className="w-full h-auto rounded-3xl shadow-[0_15px_40px_-15px_hsl(0_0%_0%_/_0.15)] transition-shadow duration-300 group-hover:shadow-[0_25px_50px_-15px_hsl(var(--primary)/0.3)]"
                />
                <div className="mt-5 text-right text-foreground text-sm md:text-base">
                  <span className="font-bold">פרק {ep.num}</span>
                  <span className="text-foreground/50 mx-2">|</span>
                  <span className="font-light group-hover:text-primary transition-colors">{ep.title}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <button className="px-10 py-3 rounded-lg bg-primary text-primary-foreground text-sm md:text-base font-light hover:bg-[hsl(var(--primary-glow))] transition-colors">
              לכל הפרקים
            </button>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section id="contact" className="relative w-full bg-white">
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

              {/* Left side - CTA buttons */}
              <div className="text-right space-y-4 self-center">
                <button
                  onClick={() => openContact("lecture")}
                  className="w-full py-4 px-6 rounded-xl bg-primary text-primary-foreground text-base font-light hover:bg-[hsl(var(--primary-glow))] transition-all shadow-md shadow-primary/20 active:scale-[0.99]"
                >
                  להזמנת הרצאה
                </button>
                <button
                  onClick={() => openContact("workshop")}
                  className="w-full py-4 px-6 rounded-xl bg-white border border-primary/30 text-foreground text-base font-light hover:bg-accent hover:border-primary transition-all shadow-sm active:scale-[0.99]"
                >
                  בואו נתכנן לכם סדנת ביבליותרפיה
                </button>
                <button
                  onClick={() => setPopupOpen(true)}
                  className="w-full py-4 px-6 rounded-xl bg-muted text-foreground/80 text-base font-light hover:bg-muted/80 transition-all active:scale-[0.99]"
                >
                  הצטרפות לתפוצה
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MailingListPopup open={popupOpen} onOpenChange={setPopupOpen} />
      <ContactPopup open={contactOpen} onOpenChange={setContactOpen} defaultTab={contactTab} />
    </div>
  );
};

export default Index;
