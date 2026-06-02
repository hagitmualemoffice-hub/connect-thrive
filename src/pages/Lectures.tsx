import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import ContactPopup, { type ContactTab } from "@/components/ContactPopup";
import MobileBottomNav from "@/components/MobileBottomNav";
import ExpandableText from "@/components/ExpandableText";
import lectureBg from "@/assets/woman-beach.jpg";
import { lectureCards } from "@/data/lectures";

const Lectures = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const [contactTab, setContactTab] = useState<ContactTab>("lecture");

  const openContact = (tab: ContactTab) => {
    setContactTab(tab);
    setContactOpen(true);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground font-light pb-20 md:pb-0">
      <div className="hidden md:block">
        <SiteHeader />
      </div>

      {/* Mobile-only header logo strip */}
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
          src={lectureBg}
          alt="הרצאות וסדנאות"
          className="absolute inset-0 w-full h-full object-cover [object-position:80%_center] md:[object-position:5%_center]"
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
              להעיר את הכוח מבפנים | <br /> הרצאות וסדנאות
            </h1>
            <p className="text-white/90 text-sm md:text-xl font-light max-w-2xl leading-relaxed">
              <span className="font-normal text-white">לארגונים, צוותים, קהילות וקבוצות</span>
            </p>
          </div>
        </div>
      </section>




      {/* LECTURE GRID */}
      <section className="w-full py-10 md:py-16 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto">


          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {lectureCards.map((card) => (
              <article
                key={card.title}
                className="bg-card rounded-2xl md:rounded-3xl shadow-[0_15px_40px_-15px_hsl(0_0%_0%_/_0.12)] px-7 md:px-10 py-9 md:py-12 text-right flex flex-col transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_25px_50px_-15px_hsl(var(--primary)/0.25)]"
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
                  <h4 className="text-foreground text-xs md:text-sm font-semibold mb-1.5 md:mb-2">
                    קהל יעד
                  </h4>
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
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WORKSHOPS - gradient block */}
      <section className="w-full py-12 md:py-20 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto">
          <div
            className="rounded-2xl md:rounded-[40px] px-6 md:px-24 py-10 md:py-24 text-right"
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

      <div className="md:hidden h-20" />
      <MobileBottomNav />
      <ContactPopup open={contactOpen} onOpenChange={setContactOpen} defaultTab={contactTab} />
    </div>
  );
};

export default Lectures;
