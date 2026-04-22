import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, BookOpen, Mic, Mail, MessageCircle, Menu, X } from "lucide-react";
import MailingListPopup from "@/components/MailingListPopup";
import ContactPopup from "@/components/ContactPopup";

const sectionLinks = [
  { label: "אודות", href: "/#about" },
  { label: "יזמות קשובה", href: "/#entrepreneurship" },
  { label: "הפרויקטים שלי", href: "/#projects" },
  { label: "הרצאות", href: "/#lectures" },
  { label: "סדנאות", href: "/#workshops" },
  { label: "בלוג", href: "/blog" },
  { label: "פודקאסט", href: "/podcast" },
];

const MobileBottomNav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mailingOpen, setMailingOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      {/* Sticky bottom bar — mobile only */}
      <nav
        dir="rtl"
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-border shadow-[0_-8px_24px_-12px_hsl(0_0%_0%_/_0.12)]"
        aria-label="ניווט תחתון"
      >
        <div className="grid grid-cols-5 h-14">
          <Link
            to="/"
            className="flex flex-col items-center justify-center gap-0.5 text-foreground/70 hover:text-primary transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-light">בית</span>
          </Link>
          <Link
            to="/blog"
            className="flex flex-col items-center justify-center gap-0.5 text-foreground/70 hover:text-primary transition-colors"
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-[10px] font-light">בלוג</span>
          </Link>
          <Link
            to="/podcast"
            className="flex flex-col items-center justify-center gap-0.5 text-foreground/70 hover:text-primary transition-colors"
          >
            <Mic className="h-5 w-5" />
            <span className="text-[10px] font-light">פודקאסט</span>
          </Link>
          <button
            onClick={() => setContactOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-foreground/70 hover:text-primary transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
            <span className="text-[10px] font-light">דברו איתי</span>
          </button>
          <button
            onClick={() => setMenuOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-foreground/70 hover:text-primary transition-colors"
          >
            <Menu className="h-5 w-5" />
            <span className="text-[10px] font-light">תפריט</span>
          </button>
        </div>
      </nav>

      {/* Full menu sheet */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]" dir="rtl">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl pt-3 pb-6 px-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-4">
              <span className="text-foreground text-base font-medium">תפריט</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 -m-2 text-foreground/60"
                aria-label="סגירה"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {sectionLinks.map((item) => {
                const isInternal = !item.href.startsWith("/#");
                if (isInternal) {
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="py-3 px-4 rounded-xl bg-muted text-foreground text-sm font-light text-right hover:bg-accent transition-colors"
                    >
                      {item.label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="py-3 px-4 rounded-xl bg-muted text-foreground text-sm font-light text-right hover:bg-accent transition-colors"
                  >
                    {item.label}
                  </a>
                );
              })}
            </div>
            <button
              onClick={() => {
                setMenuOpen(false);
                setMailingOpen(true);
              }}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-light flex items-center justify-center gap-2 hover:bg-[hsl(var(--primary-glow))] transition-colors"
            >
              <Mail className="h-4 w-4" />
              להצטרפות לתפוצה
            </button>
          </div>
        </div>
      )}

      <MailingListPopup open={mailingOpen} onOpenChange={setMailingOpen} />
      <ContactPopup open={contactOpen} onOpenChange={setContactOpen} defaultTab="general" />
    </>
  );
};

export default MobileBottomNav;
