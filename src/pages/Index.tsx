import heroBg from "@/assets/hero-bg.jpg";

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
            <button className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-light hover:bg-primary/90 transition-colors">
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
          <h1 className="text-white text-5xl md:text-6xl font-extralight tracking-wide mb-[2px]">
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
        <div className="max-w-3xl mx-auto text-right">
          <h2 className="text-foreground text-4xl md:text-5xl font-extralight leading-tight mb-8">
            נעים מאוד, חגית מועלם
            <br />
            פסיכולוגית בהתמחות קלינית, מרצה ויזמת.
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

          <div className="mt-10 flex justify-center">
            <button className="px-10 py-3 rounded-full bg-primary text-primary-foreground text-base font-light hover:bg-primary/90 transition-colors">
              לקרוא עוד
            </button>
          </div>
        </div>
      </section>

      {/* Movement section */}
      <section className="w-full py-20 px-6">
        <div className="max-w-3xl mx-auto text-right">
          <h2 className="text-foreground text-4xl md:text-5xl font-extralight leading-tight mb-8 text-center">
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

          <div className="mt-10 flex justify-center">
            <button className="px-10 py-3 rounded-full bg-primary text-primary-foreground text-base font-light hover:bg-primary/90 transition-colors">
              לקרוא עוד
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
