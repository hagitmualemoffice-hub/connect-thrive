import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import MailingListPopup from "@/components/MailingListPopup";
import HostingPopup from "@/components/HostingPopup";
import ContactPopup from "@/components/ContactPopup";
import MobileBottomNav from "@/components/MobileBottomNav";
import ExpandableText from "@/components/ExpandableText";
import projectsBg from "@/assets/woman-beach-projects.jpg";
import { projectCards } from "@/data/projects";

const Projects = () => {
  const [mailingOpen, setMailingOpen] = useState(false);
  const [hostingOpen, setHostingOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground font-light">
      {/* HERO */}
      <section className="relative w-full h-[440px] md:h-[560px] overflow-hidden">
        <img
          src={projectsBg}
          alt="הפרויקטים שלי - יזמות קשובה"
          className="absolute inset-0 w-full h-full object-cover [object-position:center_15%]"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background/95 via-background/55 to-background/20" />

        <div className="relative z-10 h-full flex items-end pb-14 md:pb-20 px-[30px] md:px-6">
          <div className="w-full md:w-[min(1100px,82%)] mx-auto text-right">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-primary mb-5 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה לדף הבית
            </Link>
            <div className="w-12 h-px bg-primary mb-5" />
            <h1 className="text-foreground text-[2rem] md:text-5xl font-light leading-tight mb-3">
              <span className="font-light">יזמות קשובה</span>
              <span className="mx-3 font-light text-foreground/40">|</span>
              <span className="font-light">הפרויקטים שלי</span>
            </h1>
            <p className="text-sm md:text-lg font-light leading-relaxed max-w-2xl">
              <span className="text-primary font-normal">אמפתיה, הקשבה ויצירתיות -</span>
              <span className="text-foreground/80 mx-1">פתרונות שנולדים מתוך צורך אמיתי.</span>
            </p>
          </div>
        </div>
      </section>

      {/* PROJECT CARDS */}
      <section className="w-full py-14 md:py-20 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto">
          <div className="space-y-6 md:space-y-10">
            {projectCards.map((card, idx) => (
              <article
                key={idx}
                className="bg-card rounded-2xl md:rounded-3xl shadow-[0_20px_60px_-15px_hsl(0_0%_0%_/_0.18)] px-7 md:px-20 py-8 md:py-16 text-right w-full transition-all duration-500 hover:shadow-[0_28px_70px_-15px_hsl(var(--primary)/0.18)] hover:-translate-y-1"
              >
                <div className="w-full md:w-[min(696px,100%)] mr-0 ml-auto">
                  <div className="flex items-center gap-3 mb-4 md:mb-5">
                    <span className="text-primary text-[11px] md:text-xs font-medium tracking-widest uppercase">
                      פרויקט {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="h-px flex-1 bg-primary/20" />
                  </div>
                  <h2 className="text-foreground text-xl md:text-3xl font-bold leading-tight mb-4 md:mb-6 whitespace-pre-line">
                    {card.title}
                  </h2>
                  <ExpandableText
                    mobileLines={8}
                    className="text-foreground/80 text-sm md:text-base font-light leading-relaxed mb-6 md:mb-8"
                  >
                    <div className="space-y-3 md:space-y-4">
                      {card.paragraphs.map((p, i) => (
                        <p key={i}>{p}</p>
                      ))}
                    </div>
                  </ExpandableText>
                  <div className="flex flex-wrap justify-start gap-2 md:gap-3">
                    {card.buttons.map((btn) => {
                      const cls =
                        "px-7 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-glow))] transition-colors";
                      if (btn.href) {
                        return (
                          <a
                            key={btn.label}
                            href={btn.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cls}
                          >
                            {btn.label}
                          </a>
                        );
                      }
                      return (
                        <button
                          key={btn.label}
                          onClick={() => {
                            if (btn.action === "hosting") setHostingOpen(true);
                            else if (btn.action === "mailing") setMailingOpen(true);
                          }}
                          className={cls}
                        >
                          {btn.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full pb-20 md:pb-28 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto">
          <div
            className="rounded-2xl md:rounded-[40px] px-6 md:px-20 py-10 md:py-16 text-right"
            style={{
              background: "linear-gradient(90deg, hsl(172 79% 79%) 0%, hsl(325 75% 69%) 100%)",
            }}
          >
            <div className="w-full md:w-[min(640px,75%)] mr-0">
              <h2 className="text-white text-[1.5rem] md:text-4xl font-light leading-tight mb-3 md:mb-5">
                יש לכם צורך שמחפש פתרון?
              </h2>
              <p className="text-white/95 text-sm md:text-base font-light leading-relaxed mb-6 md:mb-8">
                אשמח לשמוע, להקשיב, ולחשוב יחד אם וכיצד אוכל להיות שותפה.
              </p>
              <button
                onClick={() => setContactOpen(true)}
                className="px-8 md:px-10 py-3 rounded-lg bg-white text-foreground text-sm md:text-base font-light shadow-md hover:bg-primary hover:text-primary-foreground hover:shadow-lg transition-all"
              >
                דברו איתי
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="md:hidden h-20" />
      <MobileBottomNav />
      <MailingListPopup open={mailingOpen} onOpenChange={setMailingOpen} />
      <HostingPopup open={hostingOpen} onOpenChange={setHostingOpen} />
      <ContactPopup open={contactOpen} onOpenChange={setContactOpen} defaultTab="general" />
    </div>
  );
};

export default Projects;
