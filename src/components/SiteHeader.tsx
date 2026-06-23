import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MailingListPopup from "@/components/MailingListPopup";
import ContactPopup from "@/components/ContactPopup";

const navItems = [
  { label: "אודות", href: "/#about" },
  { label: "הפרויקטים שלי", href: "/projects" },
  { label: "הרצאות", href: "/lectures" },
  { label: "סדנאות", href: "/workshops" },
  { label: "בלוג", href: "/blog" },
  { label: "פודקאסט", href: "/podcast" },
];

const SiteHeader = () => {
  const [mailingOpen, setMailingOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return location.pathname === href || location.pathname.startsWith(href + "/");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between px-10 py-5">
          <Link
            to="/"
            onDoubleClick={() => navigate("/admin/login")}
            className="text-foreground text-xl font-semibold tracking-tight select-none"
          >
            חגית מועלם
          </Link>

          <nav className="flex items-center gap-10">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className={`text-sm font-normal transition-colors relative pb-1 ${
                  isActive(item.href) ? "text-primary" : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMailingOpen(true)}
              className="px-5 py-2.5 rounded-lg bg-muted text-foreground/70 text-sm font-light hover:bg-muted/80 transition-colors"
            >
              להצטרפות לתפוצה
            </button>
            <button
              onClick={() => setContactOpen(true)}
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-glow))] transition-colors"
            >
              דברו איתי
            </button>
          </div>
        </div>
      </header>

      <MailingListPopup open={mailingOpen} onOpenChange={setMailingOpen} />
      <ContactPopup open={contactOpen} onOpenChange={setContactOpen} defaultTab="general" />
    </>
  );
};

export default SiteHeader;
