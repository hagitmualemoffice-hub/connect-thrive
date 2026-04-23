import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Mic, Mail, MessageCircle, Menu, X, FolderOpen, Mic2, Home, Info } from "lucide-react";
import MailingListPopup from "@/components/MailingListPopup";
import ContactPopup from "@/components/ContactPopup";

const WHATSAPP_URL = "https://wa.me/972585528233";

const sectionLinks = [
  { label: "בית", href: "/" },
  { label: "אודות", href: "/#about" },
  { label: "יזמות קשובה", href: "/#entrepreneurship" },
  { label: "סדנאות", href: "/#workshops" },
  { label: "בלוג", href: "/blog" },
  { label: "פודקאסט", href: "/podcast" },
];

// WhatsApp glyph (brand-recognizable)
const WhatsAppIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.595 5.385l.36.572-1.002 3.66 3.749-.984-.213.668zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01a1.094 1.094 0 0 0-.793.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413z"/>
  </svg>
);

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
          <a
            href="/"
            className="flex flex-col items-center justify-center gap-0.5 text-foreground/70 hover:text-primary transition-colors"
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-light">בית</span>
          </a>
          <a
            href="/#projects"
            className="flex flex-col items-center justify-center gap-0.5 text-foreground/70 hover:text-primary transition-colors"
          >
            <FolderOpen className="h-5 w-5" />
            <span className="text-[10px] font-light">פרויקטים</span>
          </a>
          <a
            href="/#lectures"
            className="flex flex-col items-center justify-center gap-0.5 text-foreground/70 hover:text-primary transition-colors"
          >
            <Mic2 className="h-5 w-5" />
            <span className="text-[10px] font-light">הרצאות</span>
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-0.5 text-[#25D366] hover:opacity-80 transition-opacity"
            aria-label="וואטסאפ"
          >
            <WhatsAppIcon className="h-5 w-5" />
            <span className="text-[10px] font-light">וואטסאפ</span>
          </a>
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
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-muted" />
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
                const baseClasses =
                  "py-3 px-4 rounded-xl bg-white text-foreground text-sm font-light text-right border-2 border-border hover:border-primary hover:text-primary transition-colors";
                if (isInternal) {
                  return (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={baseClasses}
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
                    className={baseClasses}
                  >
                    {item.label}
                  </a>
                );
              })}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setContactOpen(true);
                }}
                className="py-3 px-4 rounded-xl bg-white text-foreground text-sm font-light text-right border-2 border-border hover:border-primary hover:text-primary transition-colors col-span-2"
              >
                דברו איתי
              </button>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="w-full mb-2 py-3 rounded-xl bg-[#25D366] text-white text-sm font-light flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <WhatsAppIcon className="h-4 w-4" />
              שלחו לי הודעה בוואטסאפ
            </a>
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
