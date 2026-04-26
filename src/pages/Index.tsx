import { useState } from "react";
import { Link } from "react-router-dom";
import { Sprout, Lightbulb, Users } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import MailingListPopup from "@/components/MailingListPopup";
import ContactPopup, { type ContactTab } from "@/components/ContactPopup";
import HostingPopup from "@/components/HostingPopup";
import MobileBottomNav from "@/components/MobileBottomNav";
import ExpandableText from "@/components/ExpandableText";
import heroBg from "@/assets/hero-bg.jpg";
import lectureBg from "@/assets/woman-beach.jpg";
import projectsBg from "@/assets/woman-beach-projects.jpg";
import podcastCover from "@/assets/podcast-cover.png";
import contactHeart from "@/assets/contact-heart.png";
import { blogPosts as allBlogPosts } from "@/data/blogPosts";

const podcastEpisodes = [
  {
    num: "1",
    title: "על חיבור לגוף עם נעם ארז",
    driveUrl: "https://drive.google.com/file/d/1kEgTm8iRMiUmhaZ6Si4HXalrsmF2HKR5/view?usp=drive_link",
  },
  {
    num: "2",
    title: 'על הקשבה לגוף עם ד"ר מיכל פרנסט',
    driveUrl: "https://drive.google.com/file/d/1w628JudX26Cx5_1szSSlCpO4mOGlolo7/view?usp=sharing",
  },
  {
    num: "3",
    title: "על חרדה והימנעות עם דורית בנגד אלבד",
    driveUrl: "https://drive.google.com/file/d/1sobWuQQdj3UCgq0z40kI2zZxSchr1pyQ/view?usp=drive_link",
  },
  {
    num: "4",
    title: 'על התהליך עצמו עם ד"ר ירדנה היימן',
    driveUrl: "https://drive.google.com/file/d/1E6uK-c1ABAzDFdKcBvgJRcXMAIPskOxk/view?usp=drive_link",
  },
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

type LectureCard = {
  title: string;
  subtitle: string;
  desc: string;
  audience: string;
  badges?: string[];
};

const lectureCards: LectureCard[] = [
  {
    title: "החיים שנועדו לי",
    subtitle: "אמונה, ביטחון וחיבור לייעוד ככוח לחיים מאושרים ומימוש עצמי עמוק",
    desc: "הרצאה על הקשר בין אמונה, ביטחון והיכולת לחיות חיים מלאים - לא כמצב יציב, אלא כתנועה בגלים, בין בהירות לחוסר ודאות ובין שמחה לקושי.",
    audience: "קבוצות מתמודדות, ארגונים, מוסדות לימוד, ימי עיון, צעירים, גיל זהב.",
  },
  {
    title: "יזמות קשובה",
    subtitle: "על יזמות שנובעת מהקשבה, מצורך אמיתי ומדיוק מתמשך",
    desc: "הרצאה על יזמות שמתחילה בהבנה ולא בפתרון - על הקשבה לשטח, זיהוי נקודות כאב, ועל בניית פתרונות שצומחים יחד עם המציאות.",
    audience: "ארגונים, פעילות חברתיות, צוותים יזמיים, קהילות עשייה.",
    badges: ["הרצאה מומלצת"],
  },
  {
    title: "להרוג חלומות",
    subtitle: "איך מגיעים להגשמה בלי לדעת מראש לאן הולכים.",
    desc: "הרצאה על קיפאון, פחד משינוי, החלטות לא מושלמות, תנועה שמחזירה חיים והרגע שהו החיים מזמינים אותנו לזוז",
    audience: "צעירים, יזמים, ארגונים, אנשים באמצע קריירה, קבוצות חיפוש דרך.",
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
  const [hostingOpen, setHostingOpen] = useState(false);
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
      <header className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
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

      {/* Mobile-only header logo strip */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-center px-5 py-3">
          <a href="#top" className="text-foreground text-base font-semibold tracking-tight">
            חגית מועלם
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative w-full h-[88vh] md:h-[640px] group">
        {/* Mobile: image takes 86% of section so pill sits at midpoint of image bottom */}
        <div className="absolute top-0 left-0 right-0 h-[86%] md:h-full overflow-hidden md:inset-0">
          <img
            src={heroBg}
            alt="חגית מועלם - פסיכולוגית קלינית"
            className="absolute inset-0 w-full h-full object-cover scale-110 md:scale-100 [object-position:center_top] md:[object-position:center] transition-transform duration-[2500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Mobile: title block over the image */}
        <div className="md:hidden absolute top-0 left-0 right-0 h-[86%] z-10 flex flex-col items-center justify-end text-center px-6 pb-[68px]">
          <p className="text-white/90 text-[16px] font-light leading-snug mb-1">
            חגית מועלם
            <br />
            פסיכולוגית בהתמחות קלינית
          </p>
          <h1 className="text-white text-[2.15rem] font-light tracking-wide leading-[1.1]">
            איך לבנות את עצמך
            <br />
            מתוך המציאות
            <br />
            כפי שהיא
          </h1>
          <p className="text-white/90 text-[1.05rem] font-light leading-snug mt-3">
            כן, גם כשהיא מורכבת
          </p>
        </div>

        {/* Mobile: white pill positioned half on image, half on white background */}
        <div className="md:hidden absolute top-[86%] left-0 right-0 z-20 -translate-y-1/4 -mt-[15px] px-[30px]">
          <div className="relative bg-white/95 backdrop-blur-sm rounded-xl px-4 pt-4 pb-4 shadow-md mx-auto">
            <p className="text-foreground text-[15px] font-light leading-relaxed text-center mb-3">
              <strong className="font-semibold text-[16px]">הרצאות · סדנאות · תוכן</strong>
              <br />
              <span className="whitespace-nowrap text-[13px]">על חיים בתוך מורכבות ותנועה מתוך חוסר ודאות</span>
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => openContact("lecture")}
                className="w-full px-3 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-glow))] transition-all shadow-sm shadow-primary/20"
              >
                להזמנת הרצאה
              </button>
              <button
                onClick={() => setPopupOpen(true)}
                className="w-full px-3 py-2.5 rounded-full border border-border text-foreground text-sm font-light hover:bg-muted/40 transition-all"
              >
                הצטרפות לתפוצה
              </button>
            </div>
          </div>
        </div>

        {/* Desktop hero content */}
        <div className="hidden md:flex relative z-10 h-full flex-col items-center justify-end text-center px-6 pb-[88px]">
          <p className="text-white/90 text-base font-light mb-[2px]">
            חגית מועלם פסיכולוגית בהתמחות קלינית
          </p>
          <h1 className="text-white text-5xl lg:text-6xl font-light tracking-wide mb-[10px] leading-tight">
            איך לבנות את עצמך
            <br />
            מתוך המציאות כפי שהיא
          </h1>
          <p className="text-white/90 text-2xl lg:text-3xl font-light">
            כן, גם כשהיא מורכבת
          </p>
        </div>

        {/* Floating CTA bar - desktop/tablet only */}
        <div className="hidden md:block absolute -bottom-12 left-1/2 -translate-x-1/2 w-[min(1000px,94%)] z-20">
          <div className="bg-card rounded-2xl shadow-[0_15px_50px_-10px_hsl(0_0%_0%_/_0.15)] px-6 py-5 md:px-8 md:py-6 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="text-center md:text-right">
              <p className="text-foreground text-base md:text-lg font-light leading-snug">
                הרצאות · סדנאות · תוכן
              </p>
              <p className="text-foreground/60 text-xs md:text-sm font-light leading-snug mt-1">
                על חיים בתוך מורכבות ותנועה מתוך חוסר ודאות
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full md:w-auto">
              <button
                onClick={() => openContact("lecture")}
                className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm md:text-base font-light hover:bg-[hsl(var(--primary-glow))] transition-all whitespace-nowrap shadow-sm shadow-primary/20"
              >
                להזמנת הרצאה
              </button>
              <button
                onClick={() => setPopupOpen(true)}
                className="px-6 py-2.5 rounded-full border border-primary/40 text-foreground text-sm md:text-base font-light hover:bg-primary/5 transition-all whitespace-nowrap"
              >
                הצטרפות לתפוצה
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer to account for floating bar - desktop only */}
      <div className="hidden md:block h-28 md:h-24" />

      {/* About section */}
      <section id="about" className="w-full pt-10 pb-16 md:py-20 px-[30px] md:px-6 mt-0 md:mt-0">

        <div className="w-full md:w-[min(1000px,72%)] mx-auto"><div className="w-full md:w-[min(720px,76%)] mr-0 text-right">
          <h2 className="text-foreground text-[1.75rem] md:text-5xl font-light leading-tight mb-5 md:mb-8">
            מה קורה כאן?
          </h2>

          <ExpandableText
            mobileLines={4}
            className="text-foreground/80 text-sm md:text-base font-light leading-relaxed"
          >
            <div className="space-y-4 md:space-y-6">
              <p>
                זה מרחב להתבונן על החיים כפי שהם - בלי לעקוף, בלי למהר לפתור.
              </p>
              <p>
                על רגעים של חוסר ודאות,
                <br />
                על מצבים שאין בהם תשובה אחת נכונה,
                <br />
                על תקופות של כאב - ואיך מחזיקים בהן,
                <br />
                על הפער בין הרצון לבין המציאות.
              </p>
              <p>
                ואיך, דווקא מתוך כל זה -
                <br />
                ממשיכים לנוע, לבחור, ולבנות דרך.
              </p>
            </div>
          </ExpandableText>

        </div></div>
      </section>

      {/* Where to meet me section */}
      <section id="meet" className="w-full pt-2 pb-12 md:pb-20 md:pt-6 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1000px,72%)] mx-auto" dir="rtl">
          <div className="text-right mb-6 md:mb-10">
            <h2 className="text-foreground text-[1.75rem] md:text-5xl font-light leading-tight">
              איפה פוגשים אותי
            </h2>
            <div className="mt-3 md:mt-4 h-px w-16 bg-primary/40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 items-stretch">
            {[
              {
                tag: "מפגש חי",
                title: "הרצאות",
                body: (
                  <>
                    מפגש עם חשיבה על החיים כפי שהם - על קבלת החלטות במצבים מורכבים, ועל האפשרות לנוע גם כשאין בהירות מלאה.
                    <br />
                    <br />
                    אם אתם מחפשים שיחה שמצליחה לגעת גם במורכב - זו הזמנה להיפגש.
                  </>
                ),
                Icon: Lightbulb,
                cta: { label: "להזמנת הרצאה", action: () => openContact("lecture") },
              },
              {
                tag: "תהליך קבוצתי",
                title: "סדנאות ביבליותרפיה",
                body: (
                  <>
                    עבודה דרך טקסטים, שיחה והתבוננות משותפת - שמאפשרת לפגוש את מה שקורה בפנים, ולנוע ממנו אל פעולה בעולם.
                    <br />
                    <br />
                    לקבוצות שמבקשות תהליך עמוק, שמתחיל מבפנים ונוגע גם בחוץ.
                  </>
                ),
                Icon: Users,
                cta: { label: "להזמנת סדנה", action: () => openContact("workshop") },
              },
              {
                tag: "כתיבה",
                title: "תוכן",
                body: (
                  <>
                    כתיבה על החיים כפי שהם - דרך זווית פסיכולוגית ורוחנית־יהודית.
                    <br />
                    <br />
                    בלוג שפותח מרחב לחשוב, להרגיש ולהתחבר - ומזמין אותך לפגוש את החיים מזווית אחרת.
                  </>
                ),
                Icon: Sprout,
                cta: { label: "לקריאה בבלוג", to: "/blog" },
              },
            ].map((card, idx) => {
              return (
                <div
                  key={idx}
                  className="group relative bg-gradient-to-b from-card to-[hsl(var(--accent)/0.35)] rounded-2xl md:rounded-3xl shadow-[0_15px_45px_-15px_hsl(0_0%_0%_/_0.12)] px-6 md:px-7 pt-8 md:pt-9 pb-7 md:pb-8 text-right flex flex-col transition-all duration-500 ease-out hover:shadow-[0_25px_60px_-15px_hsl(var(--primary)/0.28)] hover:-translate-y-1.5 border border-primary/5"
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 right-8 h-1 w-12 bg-gradient-to-l from-primary to-[hsl(var(--primary-glow))] rounded-b-full" />

                  <span className="text-primary text-[11px] md:text-xs font-medium tracking-wide uppercase mb-1.5">
                    {card.tag}
                  </span>
                  <h3 className="text-foreground text-xl md:text-2xl font-bold leading-tight mb-3 md:mb-4">
                    {card.title}
                  </h3>

                  {/* Subtle divider */}
                  <div className="h-px w-8 bg-primary/30 mb-3 md:mb-4" />

                  <ExpandableText
                    mobileLines={5}
                    className="text-foreground/75 text-sm md:text-[15px] font-light leading-relaxed mb-5 md:mb-6 flex-1"
                  >
                    <p>{card.body}</p>
                  </ExpandableText>
                  <div className="flex justify-start">
                    {card.cta.to ? (
                      <Link
                        to={card.cta.to}
                        className="px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-light hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {card.cta.label}
                      </Link>
                    ) : (
                      <button
                        onClick={card.cta.action}
                        className="px-5 py-2 rounded-full bg-primary/10 text-primary text-sm font-light hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        {card.cta.label}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Projects section - Listening Entrepreneurship */}
      <section id="projects" className="relative w-full py-12 md:py-24 px-[30px] md:px-6 overflow-hidden">
        {/* Background image - only top portion (ends ~1/3 into 2nd card) */}
        <div className="absolute top-0 left-0 right-0 h-[420px] md:h-[820px] overflow-hidden">
          <img
            src={projectsBg}
            alt="יזמות קשובה - פרויקטים"
            className="absolute inset-0 w-full h-full object-cover [object-position:center_15%]"
          />
        </div>

        <div className="relative z-10 w-full md:w-[min(1000px,72%)] mx-auto" dir="rtl">
          <div className="text-right mb-[24px] md:mb-10 px-1 mt-[20px] md:mt-0">
            <h2 className="text-foreground text-[1.75rem] md:text-5xl font-light leading-tight">
              הפרויקטים שלי
            </h2>
          </div>

          <div
            className="bg-card rounded-2xl md:rounded-3xl shadow-[0_20px_60px_-15px_hsl(0_0%_0%_/_0.18)] px-7 md:px-20 py-8 md:py-16 text-right w-full"
          >
            <div className="w-full md:w-[min(696px,100%)] mr-0 ml-auto">
              <div className="flex items-center gap-3 mb-4 md:mb-5">
                <span className="text-primary text-[11px] md:text-xs font-medium tracking-widest uppercase">
                  יזמות חברתית
                </span>
                <div className="h-px flex-1 bg-primary/20" />
              </div>
              <h3 className="text-foreground text-xl md:text-3xl font-bold leading-tight mb-4 md:mb-6">
                <span>יזמות קשובה</span>
                <span className="mx-2 md:mx-3 text-primary/60 font-light">|</span>
                <span className="font-light text-foreground/85">אמפתיה, הקשבה ויצירתיות - פתרונות שנולדים מתוך צורך אמיתי</span>
              </h3>
              <div className="space-y-4 md:space-y-5 text-foreground/80 text-sm md:text-base font-light leading-relaxed mb-6 md:mb-8">
                <p>
                  לצד העבודה הקלינית, אני מפתחת פתרונות עבור קהלים ומצבים שלא מקבלים מענה רגשי או חברתי מספק.
                </p>
                <p>
                  אני משלבת הבנה פסיכולוגית עם חשיבה מערכתית, ומתרגמת צרכים מהשטח ליוזמות, שירותים ומענים שמייצרים שינוי ממשי ומחזקים אנשים וקהילות בהתמודדות עם מציאות חיים מורכבת.
                </p>
              </div>
              <div className="flex flex-wrap justify-start gap-2 md:gap-3">
                <Link
                  to="/projects"
                  className="px-7 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-glow))] transition-colors"
                >
                  להכיר את הפרויקט
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Lecture details section */}
      <section id="lectures" className="w-full pt-2 pb-12 md:py-20 px-[30px] md:px-6">
        <div className="hidden md:block w-full md:w-[min(1000px,72%)] mx-auto text-right mb-4 md:mb-8 px-1" dir="rtl">
          <h2 className="text-foreground text-[1.75rem] md:text-5xl font-light leading-tight mb-2 md:mb-3">
            <span className="font-light">הרצאות וסדנאות</span>
          </h2>
          <p className="text-sm md:text-lg font-light">
            <span className="text-primary font-normal">לארגונים, צוותים, קהילות וקבוצות</span>
            <br />
            <span className="text-foreground/80">הרצאות וסדנאות שמזמינות לחשוב, להרגיש ולהעמיק</span>
          </p>
        </div>

        <div className="w-full md:w-[min(1000px,72%)] mx-auto" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {lectureCards.map((card) => (
              <div
                key={card.title}
                className="bg-card rounded-2xl md:rounded-3xl shadow-[0_15px_40px_-15px_hsl(0_0%_0%_/_0.12)] px-7 md:px-12 py-9 md:py-14 text-right flex flex-col transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_25px_50px_-15px_hsl(var(--primary)/0.25)] cursor-pointer"
              >
                <div className="h-7 mb-3 flex flex-wrap gap-2 justify-start">
                  {card.badges?.map((b) => (
                    <span
                      key={b}
                      className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] md:text-xs font-medium leading-none"
                    >
                      {b}
                    </span>
                  ))}
                </div>
                <h3 className="text-foreground text-xl md:text-2xl font-bold leading-tight mb-1">
                  {card.title}
                </h3>
                <p className="text-foreground text-xs md:text-sm font-medium leading-relaxed mb-0.5">
                  {card.subtitle}
                </p>
                <ExpandableText
                  mobileLines={4}
                  className="text-foreground/70 text-xs md:text-sm font-light leading-relaxed mb-2 md:mb-1 flex-1"
                >
                  {card.desc}
                </ExpandableText>
                <div className="mb-5 md:mb-6">
                  <h4 className="text-foreground text-xs md:text-sm font-semibold mb-1.5 md:mb-2">קהל יעד</h4>
                  <p className="text-foreground/70 text-xs md:text-sm font-light leading-relaxed">
                    {card.audience}
                  </p>
                </div>
                <div className="flex justify-start mt-auto">
                  <button
                    onClick={() => openContact("lecture")}
                    className="px-6 md:px-8 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-glow))] transition-colors"
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
      <section id="workshops" className="w-full pt-4 pb-12 md:py-20 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1200px,82%)] mx-auto">
          <div
            className="rounded-2xl md:rounded-[40px] px-6 md:px-24 py-10 md:py-24 text-right"
            dir="rtl"
            style={{
              background: "linear-gradient(90deg, hsl(172 79% 79%) 0%, hsl(325 75% 69%) 100%)",
            }}
          >
            <div className="w-full md:w-[min(720px,75%)] mr-0">
              <h2 className="text-white text-[1.75rem] md:text-5xl font-light leading-tight mb-5 md:mb-10">
                <span className="font-light">סדנאות ביבליותרפיה</span>
                <br />
                <span className="font-light">הנבנות בקשב לצורך שלכם</span>
              </h2>

              <ExpandableText
                mobileLines={5}
                className="text-white/95 text-sm md:text-base font-light leading-relaxed mb-6 md:mb-10"
              >
                <div className="space-y-4 md:space-y-6">
                  <p>
                    מחפשים מרחב עמוק, חי ולא שגרתי לעבודה קבוצתית? סדנאות ביבליותרפיה המבוססות
                    על קריאה משותפת של טקסטים והנחיה של שיח קבוצתי משמעותי. הטקסטים אינם רק
                    תוכן - הם שער: פותחים רגשות, שאלות ונקודות כאב, ומאפשרים תנועה אמיתית בקבוצה.
                  </p>
                  <p>
                    כל סדנה נבנית במיוחד עבורכם, מתוך הקשבה לצורך, לאנשים ולשלב שבו אתם נמצאים.
                    אני משלבת טקסטים מעולמות הפסיכולוגיה, הספרות וההגות, לצד מקורות מן המחשבה
                    היהודית - מפגש ייחודי בין עומק רגשי, משמעות ושיח אמוני־רוחני. ניתן גם לבנות
                    סדנאות עם דגש ייעודי על מקורות אלו.
                  </p>
                  <p>
                    הסדנאות אינטימיות (עד 20 משתתפים), ומתאימות לצוותים, לקבוצות עומק ולארגונים
                    שמבקשים לגעת לעומק, לחדד תהליכים ולהניע שינוי דרך הקשבה, טקסט ושיח מונחה.
                  </p>
                </div>
              </ExpandableText>

              <button
                onClick={() => openContact("workshop")}
                className="px-8 md:px-10 py-3 rounded-lg bg-white text-foreground text-sm md:text-base font-light shadow-md hover:bg-primary hover:text-primary-foreground hover:shadow-lg transition-all"
              >
                בואו נתכנן לכם סדנא
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog section */}
      <section id="blog" className="w-full py-12 md:py-20 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1000px,72%)] mx-auto" dir="rtl">
          <div className="text-right mb-6 md:mb-12 px-1">
            <h2 className="text-foreground text-[1.75rem] md:text-5xl font-light leading-tight mb-2 md:mb-3">
              <span className="font-light">מרחב פנימי</span>
              <span className="mx-2 md:mx-3 font-light">|</span>
              <span className="font-light">בלוג</span>
            </h2>
            <p className="text-foreground/80 text-sm md:text-lg font-light">
              על נפש, תנועה ומשמעות כפי שהן פוגשות חיים.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {blogPosts.map((post) => (
              <Link
                to={`/blog/${post.slug}`}
                key={post.slug}
                className="group bg-card rounded-2xl md:rounded-3xl shadow-[0_15px_40px_-15px_hsl(0_0%_0%_/_0.12)] overflow-hidden text-right flex flex-col transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_25px_50px_-15px_hsl(var(--primary)/0.25)] cursor-pointer"
              >
                <div className="h-40 md:h-44 overflow-hidden bg-accent">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="px-5 md:px-8 py-5 md:py-8 flex flex-col flex-1">
                  <div className="mb-3 md:mb-4">
                    <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 rounded-md bg-accent text-primary text-[10px] md:text-xs font-light">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-foreground text-base md:text-xl font-bold leading-tight mb-2 md:mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <ExpandableText
                    mobileLines={4}
                    className="text-foreground/75 text-xs md:text-sm font-light leading-relaxed mb-4 md:mb-6 flex-1"
                  >
                    {post.subtitle}
                  </ExpandableText>
                  <span className="text-primary text-xs md:text-sm font-medium group-hover:text-[hsl(var(--primary-glow))] transition-colors text-right">
                    להמשיך לקרוא ←
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 md:mt-12 flex justify-center">
            <Link to="/blog" className="px-8 md:px-10 py-3 rounded-lg bg-primary text-primary-foreground text-sm md:text-base font-light hover:bg-[hsl(var(--primary-glow))] transition-colors">
              לכל הפוסטים
            </Link>
          </div>
        </div>
      </section>


      {/* Podcast section */}
      <section id="podcast" className="w-full py-12 md:py-20 px-[30px] md:px-0 overflow-hidden">
        <div className="w-full md:w-[min(1000px,72%)] mx-auto" dir="rtl">
          <div className="text-right mb-6 md:mb-12 px-1 md:px-0">
            <h2 className="text-foreground text-[1.75rem] md:text-5xl font-light leading-tight mb-2 md:mb-3">
              <span className="font-light">יודעת</span>
              <span className="mx-2 md:mx-3 font-light">|</span>
              <span className="font-light">פודקאסט</span>
            </h2>
            <p className="text-foreground/80 text-sm md:text-lg font-light">
              פודקאסט על שימור פוריות וחוויה נפשית - בואי לרכוש ידע, חיבור, כוח ויכולת להיות על התהליך.
            </p>
          </div>
        </div>

        {/* Cards row - aligned to same container as header */}
        <div className="w-full md:w-[min(1000px,72%)] mx-auto" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {podcastEpisodes.slice(0, 3).map((ep, idx) => (
              <a
                href={ep.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                key={idx}
                className="flex flex-col group cursor-pointer transition-all duration-300 ease-out hover:scale-[1.03]"
              >
                <img
                  src={podcastCover}
                  alt="יודעת פודקאסט"
                  loading="lazy"
                  width={1080}
                  height={607}
                  className="w-full h-auto rounded-2xl md:rounded-3xl shadow-[0_15px_40px_-15px_hsl(0_0%_0%_/_0.15)] transition-shadow duration-300 group-hover:shadow-[0_25px_50px_-15px_hsl(var(--primary)/0.3)]"
                />
                <div className="mt-3 md:mt-5 text-right text-foreground text-sm md:text-base">
                  <span className="font-bold">פרק {ep.num}</span>
                  <span className="text-foreground/50 mx-2">|</span>
                  <span className="font-light group-hover:text-primary transition-colors">{ep.title}</span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-8 md:mt-12 flex justify-center">
            <Link
              to="/podcast"
              className="px-8 md:px-10 py-3 rounded-lg bg-primary text-primary-foreground text-sm md:text-base font-light hover:bg-[hsl(var(--primary-glow))] transition-colors"
            >
              לכל הפרקים
            </Link>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section id="contact" className="w-full bg-background py-12 md:py-24 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto" dir="rtl">
          <div className="bg-card rounded-2xl md:rounded-[40px] shadow-[0_20px_60px_-20px_hsl(0_0%_0%_/_0.12)] px-6 md:px-20 py-8 md:py-20">
            {/* Top: heart + heading centered */}
            <div className="text-center mb-8 md:mb-12">
              <div className="flex justify-center mb-4 md:mb-5">
                <img
                  src={contactHeart}
                  alt="דברו איתי"
                  width={160}
                  height={120}
                  className="w-20 md:w-28 h-auto"
                />
              </div>
              <h2 className="text-foreground text-[1.75rem] md:text-5xl font-light mb-3 md:mb-4">
                דברו איתי
              </h2>
              <p className="text-foreground/70 text-sm md:text-lg font-light leading-relaxed max-w-[52ch] mx-auto">
                כאן לכל שאלה, להזמנת הרצאה, בניית סדנה מותאמת אליכם או שיתופי פעולה לפרויקטים שלי.
              </p>
            </div>

            {/* Bottom: 4 CTA buttons in a row, all unified style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 max-w-4xl mx-auto">
              <button
                onClick={() => openContact("general")}
                className="py-3 md:py-4 px-5 md:px-6 rounded-xl bg-card border border-primary/30 text-foreground text-sm md:text-base font-light hover:bg-accent hover:border-primary transition-all shadow-sm active:scale-[0.99]"
              >
                יצירת קשר
              </button>
              <button
                onClick={() => openContact("lecture")}
                className="py-3 md:py-4 px-5 md:px-6 rounded-xl bg-card border border-primary/30 text-foreground text-sm md:text-base font-light hover:bg-accent hover:border-primary transition-all shadow-sm active:scale-[0.99]"
              >
                להזמנת הרצאה
              </button>
              <button
                onClick={() => openContact("workshop")}
                className="py-3 md:py-4 px-5 md:px-6 rounded-xl bg-card border border-primary/30 text-foreground text-sm md:text-base font-light hover:bg-accent hover:border-primary transition-all shadow-sm active:scale-[0.99]"
              >
                בואו נתכנן סדנת ביבליותרפיה
              </button>
              <button
                onClick={() => setPopupOpen(true)}
                className="py-3 md:py-4 px-5 md:px-6 rounded-xl bg-card border border-primary/30 text-foreground text-sm md:text-base font-light hover:bg-accent hover:border-primary transition-all shadow-sm active:scale-[0.99]"
              >
                הצטרפות לתפוצה
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile-only: inline mailing list at bottom (replaces the floating hero form on mobile) */}
      <section className="md:hidden w-full px-[30px] pb-24">
        <div className="bg-card rounded-2xl shadow-[0_15px_50px_-10px_hsl(0_0%_0%_/_0.15)] px-5 py-6">
          <div className="text-center mb-4">
            <p className="text-foreground text-base font-light leading-tight">
              בואו להתחבר לעצמכם דרך תוכן איכותי
            </p>
            <p className="text-foreground/60 text-xs font-light leading-tight mt-1">
              הצטרפו לתפוצה השקטה שלי
            </p>
          </div>
          <form onSubmit={handleInlineSubscribe} className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="שם"
              value={inlineForm.name}
              onChange={(e) => setInlineForm({ ...inlineForm, name: e.target.value })}
              className="bg-muted/50 border border-transparent rounded-full px-5 py-2.5 text-sm font-light text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/40 focus:bg-background transition-colors text-right"
            />
            <input
              type="email"
              placeholder="כתובת מייל"
              value={inlineForm.email}
              onChange={(e) => setInlineForm({ ...inlineForm, email: e.target.value })}
              className="bg-muted/50 border border-transparent rounded-full px-5 py-2.5 text-sm font-light text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/40 focus:bg-background transition-colors text-right"
            />
            <button
              type="submit"
              disabled={inlineSubmitting}
              className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-glow))] transition-all whitespace-nowrap shadow-sm shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {inlineSubmitting ? "שולחת..." : "הצטרפות"}
            </button>
          </form>
        </div>
      </section>

      <MailingListPopup open={popupOpen} onOpenChange={setPopupOpen} />
      <ContactPopup open={contactOpen} onOpenChange={setContactOpen} defaultTab={contactTab} />
      <HostingPopup open={hostingOpen} onOpenChange={setHostingOpen} />
      <MobileBottomNav />
    </div>
  );
};

export default Index;
