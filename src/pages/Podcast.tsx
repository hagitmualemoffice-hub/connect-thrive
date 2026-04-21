import { Link } from "react-router-dom";
import { Play, ExternalLink } from "lucide-react";
import podcastCover from "@/assets/podcast-cover.png";

const episodes = [
  {
    num: "01",
    title: "על חיבור לגוף עם נועם ארז",
    description:
      "שיחה עמוקה על הדרך שבה הגוף שלנו זוכר, מאחסן ומשחרר. נועם ארז מתארחת לשיחה על הקשר בין נפש לגוף ואיך מתחילים להקשיב פנימה.",
    duration: "47 דק׳",
    date: "מרץ 2026",
    spotifyUrl: "#",
    driveUrl: "#",
  },
  {
    num: "02",
    title: "על מימוש עצמי וחלומות שמבקשים להתממש",
    description:
      "מה קורה כשהחלום פוגש את המציאות? שיחה על הצעדים הקטנים שמובילים לתנועה גדולה, ועל הרגעים שבהם אנחנו בוחרות להאמין בעצמנו.",
    duration: "52 דק׳",
    date: "פברואר 2026",
    spotifyUrl: "#",
    driveUrl: "#",
  },
  {
    num: "03",
    title: "על חרדה והימנעות עם דנה לוי",
    description:
      "החרדה היא לא אויב - היא מורה. בפרק הזה נצלול לעולם של הימנעות, מה היא מנסה להגן עלינו ממנו, ואיך מתחילים לזוז גם כשהיא נוכחת.",
    duration: "58 דק׳",
    date: "ינואר 2026",
    spotifyUrl: "#",
    driveUrl: "#",
  },
  {
    num: "04",
    title: "על יזמות קשובה - להקים מהמקום הנכון",
    description:
      "איך בונים יזמות שמרגישה נכונה מבפנים? שיחה על הקצב הפנימי, על קבלת החלטות מתוך חיבור, ועל הדרך לבנות עסק שמשרת אותך.",
    duration: "44 דק׳",
    date: "דצמבר 2025",
    spotifyUrl: "#",
    driveUrl: "#",
  },
];

const Podcast = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Top navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between px-10 py-5">
          <Link to="/" className="text-foreground text-xl font-semibold tracking-tight">
            חגית מועלם
          </Link>
          <nav className="flex items-center gap-10">
            <Link to="/#about" className="text-sm font-normal text-foreground hover:text-primary transition-colors">הסנטר שלי</Link>
            <Link to="/#entrepreneurship" className="text-sm font-normal text-foreground hover:text-primary transition-colors">יזמות קשובה</Link>
            <Link to="/#projects" className="text-sm font-normal text-foreground hover:text-primary transition-colors">הפרוייקטים שלי</Link>
            <Link to="/#lectures" className="text-sm font-normal text-foreground hover:text-primary transition-colors">סדנאות והרצאות</Link>
            <Link to="/blog" className="text-sm font-normal text-foreground hover:text-primary transition-colors">בלוג</Link>
            <Link to="/podcast" className="text-sm font-normal text-primary transition-colors">פודקאסט</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to="/#contact"
              className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-glow))] transition-colors"
            >
              דברו איתי
            </Link>
          </div>
        </div>
      </header>

      <div className="h-20" />

      {/* Page header */}
      <section className="w-full pt-20 pb-12 px-6">
        <div className="w-[min(1100px,82%)] mx-auto text-right">
          <div className="flex items-center gap-4 mb-4 justify-start">
            <span className="block w-1 h-12 bg-primary rounded-full" />
            <h1 className="text-foreground text-5xl md:text-6xl font-light tracking-tight">
              הפודקאסט - יודעת
            </h1>
          </div>
          <p className="text-foreground/70 text-lg md:text-xl font-light max-w-2xl pr-5">
            שיחות שקטות על נפש, גוף ותנועה פנימית. בכל פרק אורחת אחרת, נושא אחר, ותמיד - הקשבה אמיתית.
          </p>

          {/* Platform links */}
          <div className="flex flex-wrap gap-3 mt-8 justify-start">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground text-sm font-light hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              האזנה ב-Spotify
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground text-sm font-light hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              הורדה מ-Google Drive
            </a>
          </div>
        </div>
      </section>

      {/* Episodes list - one full-width card per episode */}
      <section className="w-full pb-24 px-6">
        <div className="w-[min(1100px,82%)] mx-auto space-y-6">
          {episodes.map((ep) => (
            <article
              key={ep.num}
              className="group bg-card rounded-3xl overflow-hidden shadow-[0_10px_30px_-15px_hsl(0_0%_0%_/_0.1)] hover:shadow-[0_20px_45px_-15px_hsl(var(--primary)/0.22)] transition-all duration-300"
            >
              <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-0">
                {/* Cover */}
                <div className="relative h-56 md:h-auto overflow-hidden bg-accent">
                  <img
                    src={podcastCover}
                    alt={ep.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors flex items-center justify-center">
                    <span className="w-14 h-14 rounded-full bg-white/95 shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-6 h-6 text-primary fill-primary mr-0.5" />
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-10 text-right flex flex-col">
                  <div className="flex items-center gap-3 justify-start mb-3">
                    <span className="inline-block px-3 py-1 rounded-md bg-accent text-primary text-xs font-light">
                      פרק {ep.num}
                    </span>
                    <span className="text-foreground/50 text-xs font-light">{ep.date}</span>
                    <span className="text-foreground/30">·</span>
                    <span className="text-foreground/50 text-xs font-light">{ep.duration}</span>
                  </div>

                  <h2 className="text-foreground text-2xl md:text-3xl font-light leading-tight mb-4 group-hover:text-primary transition-colors">
                    {ep.title}
                  </h2>
                  <p className="text-foreground/70 text-base font-light leading-relaxed mb-6 flex-1">
                    {ep.description}
                  </p>

                  <div className="flex flex-wrap gap-3 justify-start">
                    <a
                      href={ep.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-light hover:bg-[hsl(var(--primary-glow))] transition-colors"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      האזנה ב-Spotify
                    </a>
                    <a
                      href={ep.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-card border border-border text-foreground text-sm font-light hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      הורדה מ-Drive
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="w-full pb-24 px-6">
        <div className="w-[min(1100px,82%)] mx-auto">
          <div
            className="rounded-[40px] px-12 md:px-20 py-14 md:py-16 text-right"
            style={{
              background: "linear-gradient(90deg, hsl(172 79% 79%) 0%, hsl(325 75% 69%) 100%)",
            }}
          >
            <div className="w-[min(680px,90%)] mr-0">
              <h2 className="text-white text-3xl md:text-4xl font-light leading-tight mb-5">
                רוצה לקבל הודעה על פרקים חדשים?
              </h2>
              <p className="text-white/95 text-base md:text-lg font-light leading-relaxed mb-8">
                הצטרפי למרחב שקט של נשימה וציפורים שנאספות בקפידה אל תיבת המייל שלך.
              </p>
              <Link
                to="/"
                className="inline-block px-10 py-3 rounded-lg bg-white text-foreground text-base font-light shadow-md hover:bg-primary hover:text-primary-foreground transition-all"
              >
                להצטרפות לתפוצה
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Podcast;
