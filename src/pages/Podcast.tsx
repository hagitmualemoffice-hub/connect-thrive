import { Link } from "react-router-dom";
import { Play, ExternalLink } from "lucide-react";
import podcastCover from "@/assets/podcast-cover.png";
import SiteHeader from "@/components/SiteHeader";

const SPOTIFY_SHOW =
  "https://open.spotify.com/show/2FIal7yOO7htlBkKUwCbxW?si=dtVPb1AQQomBBOTazo3hWA";

const episodes = [
  {
    num: "01",
    title: "על חיבור לגוף עם נעם ארז",
    description:
      "על חיבור לגוף, למה שימור פוריות ואיך את יכולה לעשות את התהליך מתוך חיבור ובחירה.",
    duration: "47 דק׳",
    date: "מרץ 2026",
    spotifyUrl: SPOTIFY_SHOW,
    driveUrl:
      "https://drive.google.com/file/d/1kEgTm8iRMiUmhaZ6Si4HXalrsmF2HKR5/view?usp=drive_link",
  },
  {
    num: "02",
    title: 'על הקשבה לגוף עם ד"ר מיכל פרנסט',
    description:
      "על הקשבה לגוף בתהליך שימור פוריות, ואיך זו יכולת שיכולה לעזור לך בתהליך.",
    duration: "52 דק׳",
    date: "פברואר 2026",
    spotifyUrl: SPOTIFY_SHOW,
    driveUrl:
      "https://drive.google.com/file/d/1w628JudX26Cx5_1szSSlCpO4mOGlolo7/view?usp=sharing",
  },
  {
    num: "03",
    title: "על חרדה והימנעות עם דורית בנגד אלבד",
    description:
      "על חרדה והימנעות בתהליך שימור פוריות, ואיך את יכולה לעזור לעצמך עם זה.",
    duration: "58 דק׳",
    date: "ינואר 2026",
    spotifyUrl: SPOTIFY_SHOW,
    driveUrl:
      "https://drive.google.com/file/d/1sobWuQQdj3UCgq0z40kI2zZxSchr1pyQ/view?usp=drive_link",
  },
  {
    num: "04",
    title: 'על התהליך עצמו עם ד"ר ירדנה היימן',
    description:
      'כל מה שאת רוצה לדעת על ההליך עצמו. ד"ר היימן עם הסבר בהיר ומענה לכל השאלות.',
    duration: "44 דק׳",
    date: "דצמבר 2025",
    spotifyUrl: SPOTIFY_SHOW,
    driveUrl:
      "https://drive.google.com/file/d/1E6uK-c1ABAzDFdKcBvgJRcXMAIPskOxk/view?usp=drive_link",
  },
];

const Podcast = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SiteHeader />

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
            פודקאסט על שימור פוריות וחוויה נפשית.
          </p>

          {/* Platform links */}
          <div className="flex flex-wrap gap-3 mt-8 justify-start">
            <a
              href={SPOTIFY_SHOW}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-card border border-border text-foreground text-sm font-light hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              האזנה ב-Spotify
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
              <div className="grid grid-cols-1 md:grid-cols-[420px_1fr] gap-0">
                {/* Cover */}
                <div className="relative h-72 md:h-auto md:min-h-[360px] overflow-hidden bg-accent">
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
                      צפייה ב-Drive
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
                רוצות לדעת מתי עולה פרק חדש?
              </h2>
              <p className="text-white/95 text-base md:text-lg font-light leading-relaxed mb-8">
                הצטרפו למרחב שקט של נשימה ותוכן שנאסף בקפידה אל תיבת המייל שלכן.
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
