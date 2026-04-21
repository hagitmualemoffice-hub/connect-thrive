import heroBg from "@/assets/hero-bg.jpg";
import lectureBg from "@/assets/woman-beach.jpg";

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
            <button className="px-5 py-2.5 rounded-full bg-muted text-foreground/70 text-sm font-light hover:bg-muted/80 transition-colors">
              להצטרפות לתפוצה
            </button>
            <button className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-dark))] transition-colors">
              דברו איתי
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative w-full h-[640px]">
        <img
          src={heroBg}
          alt="חגית מועלם - פסיכולוגית קלינית"
          className="absolute inset-0 w-full h-full object-cover"
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
        <div className="w-[min(780px,65%)] mx-auto text-right">
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
            <button className="px-10 py-3 rounded-full bg-primary text-primary-foreground text-base font-light hover:bg-[hsl(var(--primary-dark))] transition-colors">
              לקרוא עוד
            </button>
          </div>
        </div>
      </section>

      {/* Movement section */}
      <section className="w-full py-20 px-6">
        <div className="w-[min(780px,65%)] mx-auto text-right">
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
            <button className="px-10 py-3 rounded-full bg-primary text-primary-foreground text-base font-light hover:bg-[hsl(var(--primary-dark))] transition-colors">
              לקרוא עוד
            </button>
          </div>
        </div>
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
        <div className="absolute inset-x-0 bottom-[380px] z-10 px-6">
          <div className="w-[min(780px,65%)] mx-auto text-right" dir="rtl">
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
          <div className="w-[min(780px,65%)] mx-auto">
            <div className="bg-card rounded-3xl shadow-[0_20px_60px_-15px_hsl(0_0%_0%_/_0.18)] px-24 py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-right" dir="rtl">
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
                <button className="px-8 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-dark))] transition-colors">
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
        <div className="w-[min(780px,65%)] mx-auto text-right mb-14" dir="rtl">
          <h2 className="text-foreground text-4xl md:text-5xl font-light leading-tight mb-3">
            <span className="font-extralight">מפרט</span>{" "}
            <span className="font-semibold">הרצאות</span>
          </h2>
          <p className="text-base md:text-lg font-light">
            <span className="text-primary font-normal">פסיכולוגיה של עשייה -</span>
            <span className="text-foreground/80 mx-2">הנהגה פנימית ותנועה בעולם של יזמות ועשייה</span>
          </p>
        </div>

        <div className="max-w-6xl mx-auto" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lectureCards.map((card) => (
              <div
                key={card.title}
                className="bg-card rounded-3xl shadow-[0_15px_40px_-15px_hsl(0_0%_0%_/_0.12)] p-10 text-right flex flex-col"
              >
                <h3 className="text-foreground text-2xl font-bold leading-tight mb-4 whitespace-pre-line">
                  {card.title}
                </h3>
                <p className="text-foreground text-sm font-medium leading-relaxed mb-4">
                  {card.subtitle}
                </p>
                <p className="text-foreground/70 text-sm font-light leading-relaxed mb-6 flex-1">
                  {card.desc}
                </p>
                <div className="mb-6">
                  <h4 className="text-foreground text-sm font-semibold mb-2">קהל יעד</h4>
                  <p className="text-foreground/70 text-sm font-light leading-relaxed">
                    {card.audience}
                  </p>
                </div>
                <div className="flex justify-start mt-auto">
                  <button className="px-8 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-dark))] transition-colors">
                    להזמנת הרצאה
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
