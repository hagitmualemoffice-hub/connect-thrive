import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, MessageCircle, Sparkles, Heart, Compass, Feather, Quote } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import ContactPopup, { type ContactTab } from "@/components/ContactPopup";
import MobileBottomNav from "@/components/MobileBottomNav";
import workshopsHero from "@/assets/workshops-hero.jpeg.asset.json";


const audiences = [
  {
    icon: Users,
    title: "צוותים וארגונים",
    desc: "ימי גיבוש, ימי עיון, שיח על שייכות, שחיקה, משמעות בעבודה וערכים משותפים.",
  },
  {
    icon: Heart,
    title: "קבוצות עומק וקהילות",
    desc: "מעגלי נשים, קבוצות תמיכה, קהילות לומדות ומפגשים שמבקשים נוכחות אמיתית.",
  },
  {
    icon: Compass,
    title: "מתמודדים בצומת",
    desc: "קבוצות שעוברות שינוי, אובדן, מעבר חיים או חיפוש דרך - וזקוקות למרחב מכיל.",
  },
  {
    icon: Feather,
    title: "מוסדות חינוך ולמידה",
    desc: "סגלי הוראה, סטודנטים, מדריכים - שיח על זהות, שליחות והקשבה פנימית.",
  },
];

const flow = [
  {
    n: "01",
    title: "פתיחה ועיגון",
    desc: "מתחילים בנוכחות. הכרות עדינה, יצירת מרחב בטוח, וכניסה אל הקצב המשותף של הקבוצה.",
  },
  {
    n: "02",
    title: "מפגש עם הטקסט",
    desc: "קוראים יחד טקסט שנבחר בקפידה - תוכן מקצועי , קטע הגותי או מקור יהודי. הטקסט הוא שער.",
  },
  {
    n: "03",
    title: "תהודה אישית",
    desc: "כל אחת ואחד פוגשים את עצמם בתוך הטקסט. מה עולה? איפה זה נוגע? מה זה מזכיר?",
  },
  {
    n: "04",
    title: "שיח קבוצתי מונחה",
    desc: "השיח נפתח. בעדינות, בלי ללחוץ, בלי להכריח. הקבוצה הופכת לכלי שמחזיק ומעמיק.",
  },
  {
    n: "05",
    title: "תובנה וסגירה",
    desc: "מסכמים את התנועה. מה נגע בנו? מה לוקחים איתנו? איך ממשיכים מכאן?",
  },
];

const buildSteps = [
  {
    title: "שיחת היכרות",
    desc: "אנחנו נעשה שיחה מקדימה. ונדבר על הקבוצה שלכם, על השלב שבו אתם נמצאים, ועל מה שהייתם רוצים שהמפגש יעורר.",
  },
  {
    title: "מיפוי הצורך",
    desc: "מזקקים יחד את הנושא המרכזי - לפעמים הוא ברור, ולפעמים מתגלה תוך כדי השיחה.",
  },
  {
    title: "בחירת טקסטים",
    desc: "אני בוחרת טקסטים שמדברים בדיוק למקום הזה. טקסטים מקצועיים, פסיכולוגיה, שירה, מקורות יהודיים - או שילוב.",
  },
  {
    title: "תפירת מבנה",
    desc: "בונים את הקצב, את שאלות ההנחיה, את המעברים. כל סדנה היא יצירה ייחודית.",
  },
  {
    title: "המפגש עצמו",
    desc: "מגיעים, נוכחים, מקשיבים, מנחים. המקום הופך למרחב שונה לשעות הקרובות.",
  },
];

const gains = [
  "שפה משותפת לדברים שקשה לדבר עליהם",
  "מרחב בטוח לרגש, לשאלה ולשתיקה",
  "הקשבה עמוקה - לעצמי ולאחר",
  "תנועה אמיתית בתוך הקבוצה",
  "פרספקטיבה חדשה דרך עיני הטקסט",
  "חיבור בין עולמות - רגש, רוח, משמעות",
];

const Workshops = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactTab, setContactTab] = useState<ContactTab>("workshop");

  const openContact = (tab: ContactTab = "workshop") => {
    setContactTab(tab);
    setContactOpen(true);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground font-light pb-20 md:pb-0 overflow-x-hidden">
      <div className="hidden md:block">
        <SiteHeader />
      </div>

      {/* Mobile header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-center px-5 py-3">
          <Link to="/" className="text-foreground text-base font-semibold tracking-tight">
            חגית מועלם
          </Link>
        </div>
      </header>

      <div className="h-12 md:h-20" />

      {/* Hero with background image (≈ 75vh) */}
      <section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
        <img
          src={workshopsHero.url}
          alt="ספרים פתוחים, פרחים ויד אוחזת בדף - מרחב של ביבליותרפיה"
          className="absolute inset-0 w-full h-full object-cover [object-position:50%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/55 via-black/30 to-black/15" />

        <div className="relative z-10 h-full flex items-end pb-10 md:pb-16 px-[30px] md:px-6">
          <div className="w-full md:w-[min(1100px,82%)] mx-auto text-right">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-white/85 hover:text-white mb-5 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה לדף הבית
            </Link>
            <h1 className="text-white text-[1.75rem] md:text-6xl font-light tracking-tight leading-tight mb-3 md:mb-4">
              מילים שפוגשות חיים | <br /> סדנאות ביבליותרפיה
            </h1>
            <p className="text-white/90 text-sm md:text-xl font-light max-w-2xl leading-relaxed mb-6 md:mb-8">
              סדנאות ביבליותרפיה הנבנות בקשב לצורך שלכם. מחפשים מרחב עמוק, חי ולא שגרתי לעבודה קבוצתית? סדנאות המבוססות על קריאה משותפת של טקסטים והנחיה של שיח קבוצתי משמעותי.
            </p>
            <button
              onClick={() => openContact("workshop")}
              className="inline-flex items-center gap-2 px-7 md:px-9 py-3 md:py-3.5 rounded-full bg-primary text-primary-foreground text-sm md:text-base font-medium shadow-md hover:bg-[hsl(var(--primary-glow))] hover:-translate-y-0.5 transition-all duration-300"
            >
              בואו נתכנן לכם סדנה
            </button>
          </div>
        </div>
      </section>


      {/* INTRO / WHAT IS IT */}
      <section className="w-full py-16 md:py-28 px-[30px] md:px-6">
        <div className="w-full md:w-[min(900px,82%)] mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/10 mb-6">
            <BookOpen className="w-6 h-6 md:w-7 md:h-7 text-primary" />
          </div>
          <h2 className="text-foreground text-2xl md:text-4xl font-light leading-tight mb-6 md:mb-8">
            הטקסטים אינם רק תוכן.
            <br />
            <span className="text-primary">הם שער.</span>
          </h2>
          <p className="text-foreground/75 text-base md:text-lg font-light leading-relaxed max-w-2xl mx-auto">
            הטקסטים פותחים רגשות, שאלות ונקודות כאב, ומאפשרים תנועה אמיתית בקבוצה.
            הם מאפשרים לנו לגעת במקומות עדינים בלי לחשוף את עצמנו ישירות, ולגלות שדווקא דרך מילים של מישהו אחר - אנחנו פוגשים את עצמנו ואת מי שלצידנו.
          </p>
        </div>
      </section>


      {/* AUDIENCES - bento-style */}
      <section className="w-full py-12 md:py-20 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto">
          <div className="text-right mb-10 md:mb-14 max-w-2xl">
            <span className="text-primary text-sm md:text-base font-semibold tracking-widest uppercase">למי זה מיועד</span>
            <h2 className="text-foreground text-3xl md:text-5xl font-light leading-tight mt-3 mb-4">
              קבוצות שמבקשות לגעת לעומק
            </h2>
            <p className="text-foreground/70 text-base md:text-lg font-light leading-relaxed">
              הסדנאות אינטימיות - עד 20 משתתפים - ומתאימות לצוותים, לקבוצות עומק ולארגונים שמבקשים לחדד תהליכים ולהניע שינוי דרך הקשבה, טקסט ושיח מונחה.
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {audiences.map((a, i) => {
              const Icon = a.icon;
              return (
                <article
                  key={a.title}
                  className="group relative bg-card rounded-2xl md:rounded-3xl p-7 md:p-10 shadow-[0_15px_40px_-15px_hsl(0_0%_0%_/_0.10)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_25px_50px_-15px_hsl(var(--primary)/0.20)] overflow-hidden"
                >
                  <div
                    className="absolute -top-12 -left-12 w-40 h-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-3xl"
                    style={{
                      background:
                        i % 2 === 0
                          ? "hsl(331 75% 75% / 0.4)"
                          : "hsl(172 60% 70% / 0.4)",
                    }}
                  />
                  <div className="relative flex items-start gap-4 md:gap-5">
                    <div className="shrink-0 inline-flex items-center justify-center w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary">
                      <Icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-foreground text-lg md:text-xl font-semibold mb-1.5">
                        {a.title}
                      </h3>
                      <p className="text-foreground/70 text-sm md:text-base font-light leading-relaxed">
                        {a.desc}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* FLOW - what happens in a workshop */}
      <section className="w-full py-16 md:py-24 px-[30px] md:px-6 bg-gradient-to-b from-background via-accent/30 to-background">
        <div className="w-full md:w-[min(1000px,82%)] mx-auto">
          <div className="text-right mb-12 md:mb-16">
            <span className="text-primary text-sm md:text-base font-semibold tracking-widest uppercase">מה קורה בסדנה</span>
            <h2 className="text-foreground text-3xl md:text-5xl font-light leading-tight mt-3">
              חמש תחנות במסע משותף
            </h2>
          </div>

          <div className="relative">
            {/* vertical line */}
            <div
              className="absolute right-[22px] md:right-[35px] top-2 bottom-2 w-px bg-primary/30"
            />

            <div className="space-y-8 md:space-y-12">
              {flow.map((step, i) => (
                <div key={step.n} className="relative flex items-start gap-5 md:gap-8">
                  <div
                    className="relative z-10 shrink-0 w-11 h-11 md:w-[70px] md:h-[70px] rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs md:text-base font-medium text-primary"
                  >
                    {step.n}
                  </div>
                  <div className="flex-1 pt-1.5 md:pt-3">
                    <h3 className="text-foreground text-lg md:text-2xl font-medium mb-1.5 md:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-foreground/70 text-sm md:text-base font-light leading-relaxed max-w-xl">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="w-full py-16 md:py-24 px-[30px] md:px-6">
        <div className="w-full md:w-[min(900px,82%)] mx-auto">
          <div
            className="relative rounded-3xl md:rounded-[40px] px-7 md:px-20 py-12 md:py-20 overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, hsl(172 79% 79%) 0%, hsl(325 75% 69%) 100%)",
            }}
          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            <div className="relative">
              <Quote className="absolute top-0 right-0 md:-top-2 md:-right-2 w-10 h-10 md:w-16 md:h-16 text-white/40" />
              <blockquote className="text-white text-xl md:text-3xl font-light italic leading-relaxed text-right max-w-3xl mr-auto">
                "טקסט טוב לא נותן תשובות. הוא פותח שאלות חדשות -
                ובתוך הקבוצה, השאלות האלו מתחילות לחיות."
              </blockquote>
            </div>
          </div>

        </div>
      </section>

      {/* HOW WE BUILD - process */}
      <section className="w-full py-16 md:py-24 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto">
          <div className="text-right mb-12 md:mb-16 max-w-2xl">
            <span className="text-primary text-xs md:text-sm font-medium tracking-widest uppercase">איך בונים את התוכן</span>
            <h2 className="text-foreground text-2xl md:text-4xl font-light leading-tight mt-2 mb-4">
              כל סדנה נבנית במיוחד עבורכם
            </h2>
            <p className="text-foreground/70 text-base md:text-lg font-light leading-relaxed">
              מתוך הקשבה לצורך, לאנשים ולשלב שבו אתם נמצאים. אני משלבת טקסטים מעולמות הפסיכולוגיה, הספרות וההגות, לצד מקורות מן המחשבה היהודית - מפגש ייחודי בין עומק רגשי, משמעות ושיח אמוני־רוחני. ניתן גם לבנות סדנאות עם דגש ייעודי על מקורות אלו.
            </p>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-3">
            {buildSteps.map((s, i) => (
              <div
                key={s.title}
                className="group relative bg-card rounded-2xl p-6 md:p-7 text-right border border-border/60 hover:border-primary/40 transition-all duration-300 hover:shadow-[0_15px_40px_-20px_hsl(var(--primary)/0.30)]"
              >
                <div className="text-primary/40 group-hover:text-primary text-3xl md:text-4xl font-light mb-3 transition-colors">
                  0{i + 1}
                </div>
                <h3 className="text-foreground text-base md:text-lg font-semibold mb-2 leading-tight">
                  {s.title}
                </h3>
                <p className="text-foreground/65 text-xs md:text-sm font-light leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GAINS */}
      <section className="w-full py-16 md:py-24 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 items-start">
            <div className="md:col-span-5 text-right md:sticky md:top-28">
              <Sparkles className="w-7 h-7 text-primary mb-4" />
              <span className="text-primary text-xs md:text-sm font-medium tracking-widest uppercase">מה זה ייתן לכם</span>
              <h2 className="text-foreground text-2xl md:text-4xl font-light leading-tight mt-2 mb-5">
                לא רק מפגש -
                <br />
                <span className="text-primary italic">חוויה שנשארת</span>
              </h2>
              <p className="text-foreground/70 text-base md:text-lg font-light leading-relaxed">
                ביבליותרפיה איכותית פותחת משהו בתוך הקבוצה, ובתוך כל אחד ואחת. החוויה הזו ממשיכה להדהד הרבה אחרי שהמפגש מסתיים.
              </p>
            </div>

            <div className="md:col-span-7">
              <ul className="space-y-3 md:space-y-4">
                {gains.map((g, i) => (
                  <li
                    key={g}
                    className="group flex items-center gap-4 bg-card rounded-2xl px-5 md:px-7 py-4 md:py-5 shadow-[0_8px_25px_-15px_hsl(0_0%_0%_/_0.10)] hover:shadow-[0_15px_35px_-15px_hsl(var(--primary)/0.20)] hover:translate-x-[-4px] transition-all duration-300"
                  >
                    <span className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium bg-primary text-primary-foreground">
                      0{i + 1}
                    </span>
                    <span className="text-foreground text-sm md:text-base font-light leading-snug">

                      {g}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full py-16 md:py-24 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto">
          <div
            className="relative rounded-3xl md:rounded-[40px] px-7 md:px-20 py-14 md:py-24 text-center overflow-hidden"
            style={{
              background:
                "linear-gradient(90deg, hsl(172 79% 79%) 0%, hsl(325 75% 69%) 100%)",
            }}

          >
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]" />
            <div className="relative">
              <MessageCircle className="w-10 h-10 md:w-12 md:h-12 text-white mx-auto mb-5" />
              <h2 className="text-white text-2xl md:text-5xl font-light leading-tight mb-4 md:mb-6">
                יש לכם קבוצה שמחכה למפגש כזה?
              </h2>
              <p className="text-white/95 text-base md:text-xl font-light max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
                בואו נדבר. נכיר את הקבוצה שלכם, נבין מה אתם מחפשים, ונבנה יחד סדנה שתישאר איתכם.
              </p>
              <button
                onClick={() => openContact("workshop")}
                className="px-9 md:px-12 py-3.5 md:py-4 rounded-full bg-white text-foreground text-sm md:text-base font-medium shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                בואו נתכנן לכם סדנה
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="md:hidden h-20" />
      <MobileBottomNav />
      <ContactPopup open={contactOpen} onOpenChange={setContactOpen} defaultTab={contactTab} />
    </div>
  );
};

export default Workshops;
