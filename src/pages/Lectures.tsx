import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mic, Sparkles } from "lucide-react";
import ContactPopup, { type ContactTab } from "@/components/ContactPopup";
import MobileBottomNav from "@/components/MobileBottomNav";
import lectureBg from "@/assets/woman-beach.jpg";

type Item = {
  title: string;
  lines: [string, string];
  type: "lecture" | "workshop";
};

const items: Item[] = [
  {
    title: "חיים בגלים",
    lines: [
      "על תקופות שמשתנות בקצב משלהן",
      "ואיך מוצאים יציבות בתוך תנועה",
    ],
    type: "lecture",
  },
  {
    title: "להרוג חלומות",
    lines: [
      "על הפרידה ממה שדמיינו לעצמנו",
      "ועל מה שנפתח כשמשחררים",
    ],
    type: "lecture",
  },
  {
    title: "חיבור לייעוד",
    lines: [
      "על הקשבה לקול הפנימי",
      "ובחירה בדרך שמרגישה נכונה",
    ],
    type: "lecture",
  },
  {
    title: "תנועה מתוך חרדה",
    lines: [
      "על איך לפעול גם כשהפחד נוכח",
      "ולא לתת לו להחליט בשבילנו",
    ],
    type: "lecture",
  },
  {
    title: "לחיות את הרגע הזה",
    lines: [
      "על נוכחות בתוך חיים מלאים",
      "ועל המתנה שיש בקטן והיומיומי",
    ],
    type: "lecture",
  },
  {
    title: "סדנת חיבור ותנועה",
    lines: [
      "מרחב קבוצתי לחשיבה משותפת",
      "על מציאות מורכבת ופעולה מתוכה",
    ],
    type: "workshop",
  },
];

const Lectures = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactTab, setContactTab] = useState<ContactTab>("lecture");

  const openContact = (tab: ContactTab) => {
    setContactTab(tab);
    setContactOpen(true);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground font-light">
      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={lectureBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/75 to-background/40" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-16 md:py-24 w-full">
          <div className="text-right max-w-2xl ml-auto">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-foreground/60 hover:text-primary mb-6 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה לדף הבית
            </Link>
            <div className="w-12 h-px bg-primary mb-5 ml-auto" />
            <h1 className="text-3xl md:text-5xl font-light leading-tight tracking-tight mb-4">
              הרצאות וסדנאות
            </h1>
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed">
              שיחות ומרחבים על איך חיים, בוחרים ונעים
              <br />
              בתוך מציאות שלא תמיד מסתדרת
            </p>
          </div>
        </div>
      </section>

      {/* LIST */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4 md:space-y-5">
            {items.map((item) => {
              const Icon = item.type === "lecture" ? Mic : Sparkles;
              const tag = item.type === "lecture" ? "הרצאה" : "סדנה";
              return (
                <article
                  key={item.title}
                  className="group bg-card border border-border/60 rounded-2xl p-6 md:p-8 hover:border-primary/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-start gap-5 text-right">
                    <div className="shrink-0 w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-3 mb-2">
                        <h3 className="text-lg md:text-xl font-light tracking-tight">
                          {item.title}
                        </h3>
                        <span className="shrink-0 text-[11px] uppercase tracking-widest text-primary/70">
                          {tag}
                        </span>
                      </div>
                      <p className="text-sm md:text-base text-foreground/70 leading-relaxed">
                        {item.lines[0]}
                        <br />
                        {item.lines[1]}
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-card/40">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-px bg-primary mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-4">
            רוצים להזמין הרצאה או סדנה?
          </h2>
          <p className="text-foreground/70 text-sm md:text-base leading-relaxed mb-8">
            אשמח לשמוע על הקהל, האירוע והנושא שמעניין אתכם
            <br />
            ולהתאים יחד את המפגש.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => openContact("lecture")}
              className="px-7 py-3 rounded-full bg-primary text-primary-foreground hover:bg-[hsl(var(--primary-glow))] transition-all duration-500 shadow-md shadow-primary/20 text-sm tracking-wide"
            >
              להזמנת הרצאה
            </button>
            <button
              onClick={() => openContact("workshop")}
              className="px-7 py-3 rounded-full border border-primary/40 text-foreground hover:bg-primary/5 transition-all duration-500 text-sm tracking-wide"
            >
              להזמנת סדנה
            </button>
          </div>
        </div>
      </section>

      <div className="md:hidden h-20" />
      <MobileBottomNav />
      <ContactPopup open={contactOpen} onOpenChange={setContactOpen} defaultTab={contactTab} />
    </div>
  );
};

export default Lectures;
