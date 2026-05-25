import { Link } from "react-router-dom";
import SiteHeader from "@/components/SiteHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import pesachFreedom from "@/assets/blog-pesach-freedom.jpg";
import bereshitImg from "@/assets/blog-bereshit.jpg";
import lagBaomerImg from "@/assets/blog-lag-baomer.jpg";
import akedaTearsImg from "@/assets/blog-akeda-tears.jpg";
import whenLifeHitsImg from "@/assets/blog-when-life-hits-hard.jpg";
import anxietyMeetingsImg from "@/assets/blog-anxiety-meetings.jpg";

const featuredPost = {
  category: "חרדה",
  date: "מאי 2026",
  title: "פגישות עם חרדה | פרק ראשון - מה החרדה לוקחת מאיתנו",
  excerpt:
    "אני פותחת את הסדרה הזאת עם הבהרה קטנה - זו לא סדרה על טיפול בחרדה ברמה הקלינית. זו סדרה על החרדה שפוגשת את רובנו ביום־יום, זו שלא תמיד תקבל אבחנה אבל מצליחה להקשות, להגביל ולגרום לנו להצטמצם בדרכים שקטות. על מה החרדה לוקחת מאיתנו, ומי אנחנו יכולות להיות אם נפסיק לתת לה להחליט בשבילנו.",
  image: anxietyMeetingsImg,
  slug: "anxiety-meetings-part-1",
};

const posts = [
  {
    category: "מימוש עצמי",
    date: "מאי 2026",
    title: "כשמשהו בחיים פוגש אותנו חזק מדי",
    excerpt:
      "אם היה לך רגע כזה השבוע שהוציא אותך מאיזון - שיחה אחת שנכנסה ללב, רגש שלא הצלחת להחזיק, רגע של קנאה, ייאוש, עצב או כעס שלא כל כך אהבת לפגוש בעצמך. כמה מחשבות על מה אפשר לעשות עם כאב, ואיך להישאר רגע בתוכו בלי לברוח.",
    image: whenLifeHitsImg,
    slug: "when-life-hits-hard",
  },
  {
    category: "פרשה ופסיכולוגיה",
    date: "אפריל 2026",
    title: "במחשבה נוספת - נקודת מבט פסיכולוגית",
    excerpt:
      "לפני שעם ישראל יוצאים ממצרים, הקב״ה מצווה אותם לשחוט קרבן פסח - את אלוהי מצרים. זו אולי החשיפה הראשונה הכי מהירה לפחד שהייתה בהיסטוריה. מבט פסיכולוגי על גאולה פנימית, על חרדה, ועל הכוח לעשות מעשה לפני שאנחנו מרגישות מוכנות.",
    image: pesachFreedom,
    slug: "pesach-freedom",
  },
  {
    category: "פרשה ופסיכולוגיה",
    date: "מרץ 2026",
    title: "מסיימות חומש בראשית - על סטנדרטים, נסיונות ואהבה",
    excerpt:
      "לאברהם אבינו היה ילד בגיל 100. יצחק התחתן בגיל 40, יעקב 87. מאיפה נגזר הסטנדרט שלנו? מחשבות על סיום חומש בראשית, על החיים האישיים שלנו ועל ההבנה שנסיונות לא באים כי השם כועס - אלא כי הוא אוהב.",
    image: bereshitImg,
    slug: "bereshit-end",
  },
  {
    category: "פרשה ופסיכולוגיה",
    date: "מאי 2026",
    title: "ל״ג בעומר - כוח האהבה של רשב״י",
    excerpt:
      "ל״ג בעומר - יום שכל עם ישראל מתחבר אליו. מה הכוח המיוחד של רשב״י? על היכולת לראות את האור בכל יהודי, על השנה הנוספת במערה, ועל הרגעים בחיים שבהם נדמה שחזרנו אחורה - אבל באמת זו תנועה עמוקה יותר פנימה.",
    image: lagBaomerImg,
    slug: "lag-baomer-rashbi",
  },
  {
    category: "פרשה ופסיכולוגיה",
    date: "נובמבר 2025",
    title: "עין במר בוכה ולב שמח - על עקדת יצחק",
    excerpt:
      "״עין במר בוכה ולב שמח״ - הפיוט הזה על עקדת יצחק נושא בתוכו אמת עמוקה. עמידה בניסיון אינה מחיקה של הרגש, אלא היכולת להרגיש את הכאב ולבחור בו זמנית בשמחה.",
    image: akedaTearsImg,
    slug: "akeda-ayin-bochah",
  },
];

const categories = ["הכל", "פרשה ופסיכולוגיה", "חרדה", "מימוש עצמי", "יזמות קשובה"];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0" dir="rtl">
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

      {/* Hero / Page header */}
      <section className="w-full pt-6 pb-8 md:pt-20 md:pb-12 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto text-right">
          <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <span className="block w-1 h-8 md:h-12 bg-primary rounded-full" />
            <h1 className="text-foreground text-[1.75rem] md:text-6xl font-light tracking-tight leading-tight">
              מרחב פנימי - הבלוג
            </h1>
          </div>
          <p className="text-foreground/70 text-sm md:text-xl font-light max-w-2xl pr-3 md:pr-5 leading-relaxed">
            על נפש, תנועה ומשמעות כפי שהן פוגשות חיים.
          </p>
        </div>
      </section>

      {/* Category filters */}
      <section className="w-full pb-8 md:pb-10 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto">
          <div className="flex flex-wrap items-center gap-2 md:gap-3 justify-start">
            {categories.map((cat, idx) => (
              <button
                key={cat}
                className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-light transition-all ${
                  idx === 0
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card text-foreground/70 hover:bg-accent hover:text-accent-foreground border border-border"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured post */}
      <section className="w-full pb-10 md:pb-16 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto">
          <Link
            to={`/blog/${featuredPost.slug}`}
            className="group block bg-card rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_15px_50px_-15px_hsl(0_0%_0%_/_0.12)] hover:shadow-[0_25px_60px_-15px_hsl(var(--primary)/0.25)] transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="relative h-[220px] md:h-[420px] overflow-hidden bg-accent">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-7 md:p-14 text-right flex flex-col justify-center">
                <div className="flex items-center gap-3 justify-start mb-4 md:mb-5">
                  <span className="inline-block px-3 md:px-4 py-1 md:py-1.5 rounded-full bg-accent text-primary text-xs font-light">
                    פוסט מומלץ
                  </span>
                  <span className="text-foreground/50 text-xs md:text-sm font-light">{featuredPost.date}</span>
                </div>
                <span className="inline-block self-start px-3 py-1 rounded-md text-primary text-xs font-light mb-3 md:mb-4">
                  {featuredPost.category}
                </span>
                <h2 className="text-foreground text-xl md:text-3xl font-light leading-tight mb-4 md:mb-5 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-foreground/70 text-sm md:text-base font-light leading-relaxed mb-6 md:mb-8">
                  {featuredPost.excerpt}
                </p>
                <div className="self-start">
                  <span className="text-primary text-sm font-medium border-b border-primary pb-0.5 group-hover:text-[hsl(var(--primary-glow))] group-hover:border-[hsl(var(--primary-glow))] transition-colors">
                    להמשיך לקרוא ←
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Posts grid */}
      <section className="w-full pb-16 md:pb-24 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {posts.map((post: any, idx) => (
              <Link
                to={post.slug ? `/blog/${post.slug}` : `/blog/${idx + 1}`}
                key={idx}
                className="group bg-card rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_10px_30px_-15px_hsl(0_0%_0%_/_0.1)] hover:shadow-[0_20px_45px_-15px_hsl(var(--primary)/0.22)] transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-44 md:h-52 overflow-hidden bg-accent">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6 md:p-7 text-right flex flex-col flex-1">
                  <div className="flex items-center justify-start gap-3 mb-3">
                    <span className="inline-block px-3 py-1 rounded-md bg-accent text-primary text-xs font-light">
                      {post.category}
                    </span>
                    <span className="text-foreground/50 text-xs font-light">{post.date}</span>
                  </div>
                  <h3 className="text-foreground text-base md:text-xl font-light leading-tight mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-foreground/70 text-sm font-light leading-relaxed mb-5 md:mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  <span className="self-start text-primary text-sm font-medium group-hover:text-[hsl(var(--primary-glow))] transition-colors">
                    להמשיך לקרוא ←
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="w-full pb-16 md:pb-24 px-[30px] md:px-6">
        <div className="w-full md:w-[min(1100px,82%)] mx-auto">
          <div
            className="rounded-2xl md:rounded-[40px] px-7 md:px-20 py-10 md:py-20 text-right"
            style={{
              background: "linear-gradient(90deg, hsl(172 79% 79%) 0%, hsl(325 75% 69%) 100%)",
            }}
          >
            <div className="w-full md:w-[min(680px,90%)] mr-0">
              <h2 className="text-white text-[1.5rem] md:text-4xl font-light leading-tight mb-4 md:mb-5">
                רוצה לקבל פוסטים חדשים ישר למייל?
              </h2>
              <p className="text-white/95 text-sm md:text-lg font-light leading-relaxed mb-6 md:mb-8">
                הצטרפי למרחב שקט של נשימה וציפורים שנאספות בקפידה אל תיבת המייל שלך.
              </p>
              <Link
                to="/"
                className="inline-block px-8 md:px-10 py-3 rounded-lg bg-white text-foreground text-sm md:text-base font-light shadow-md hover:bg-primary hover:text-primary-foreground transition-all"
              >
                להצטרפות לתפוצה
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MobileBottomNav />
    </div>
  );
};

export default Blog;
