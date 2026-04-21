import { Link } from "react-router-dom";
import pesachFreedom from "@/assets/blog-pesach-freedom.jpg";
import bereshitImg from "@/assets/blog-bereshit.jpg";
import lechLechaImg from "@/assets/blog-lech-lecha.jpg";
import akedaTearsImg from "@/assets/blog-akeda-tears.jpg";

const featuredPost = {
  category: "פרשה ופסיכולוגיה",
  date: "אפריל 2026",
  title: "במחשבה נוספת - נקודת מבט פסיכולוגית",
  excerpt:
    "לפני שעם ישראל יוצאים ממצרים, הקב״ה מצווה אותם לשחוט קרבן פסח - את אלוהי מצרים. זו אולי החשיפה הראשונה הכי מהירה לפחד שהייתה בהיסטוריה. מבט פסיכולוגי על גאולה פנימית, על חרדה, ועל הכוח לעשות מעשה לפני שאנחנו מרגישות מוכנות.",
  image: pesachFreedom,
};

const posts = [
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
    date: "נובמבר 2025",
    title: "פרשת לך לך - הינני, השתמש בי",
    excerpt:
      "אברהם אבינו אומר להקב״ה 'הינני'. צ'ארלי קירק תרגם את זה ל-'use me' - תשתמש בי. מבט פסיכולוגי על הרצון שלנו לייעוד בתנאים שלנו, מול היכולת להתבטל לתפקיד כפי שהקב״ה רואה אותו.",
    image: lechLechaImg,
    slug: "lech-lecha-hineni",
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
  {
    category: "טיפול בחרדה",
    date: "4 במרץ 2026",
    title: "הרצון הפנימי להימנע - וכיצד ללמוד לנוע איתו",
    excerpt:
      "הימנעות היא לא חולשה, היא מנגנון הגנה עתיק. במאמר הזה נתבונן על הדרכים שבהן ההימנעות משרתת אותנו, ועל איך אפשר להתחיל לזוז גם כשהיא נוכחת.",
    image: "/placeholder.svg",
  },
  {
    category: "מימוש עצמי",
    date: "20 בפבר׳ 2026",
    title: "להרוג חלומות - על הרגע שבו אנחנו עוצרות לחשוב מחדש",
    excerpt:
      "לפעמים הצמיחה מתחילה דווקא ברגע של עצירה, של הטלת ספק, של בחירה לשחרר חלום ישן ולפנות מקום לחדש.",
    image: "/placeholder.svg",
  },
  {
    category: "יזמות קשובה",
    date: "15 בפבר׳ 2026",
    title: "כשחרדה עובדת בשבילך - על יזמות ופחד שהולכים יחד",
    excerpt:
      "החרדה לא חייבת להיות מכשול ליזמות. אפשר ללמוד להשתמש בה ככלי שמדייק את הדרך, מחדד את הקשב ומחזק את היציבות הפנימית.",
    image: "/placeholder.svg",
  },
  {
    category: "פרשה ופסיכולוגיה",
    date: "1 בפבר׳ 2026",
    title: "פרשת בא - על שחרור פנימי ועל גאולה אישית",
    excerpt:
      "מהי גאולה פנימית? איך מתחילים תהליך של שחרור מהדפוסים שכבר לא משרתים אותנו? מבט על פרשת בא דרך עיניים פסיכולוגיות.",
    image: "/placeholder.svg",
  },
  {
    category: "טיפול בחרדה",
    date: "20 בינו׳ 2026",
    title: "להחזיק את עצמי - על ויסות עצמי ברגעי משבר",
    excerpt:
      "כלים מעשיים מתוך הקליניקה לויסות עצמי, להחזרת תחושת השליטה וליצירת מרחב פנימי בטוח גם ברגעים הקשים.",
    image: "/placeholder.svg",
  },
  {
    category: "מימוש עצמי",
    date: "10 בינו׳ 2026",
    title: "הנהגה שמתחילה מבפנים - על בניית ערך עצמי שלא תלוי באישור",
    excerpt:
      "איך בונים הנהגה פנימית יציבה? איך יוצאים מהתלות באישור החיצוני ומתחילים להוביל מתוך חיבור אמיתי לעצמי?",
    image: "/placeholder.svg",
  },
];

const categories = ["הכל", "פרשה ופסיכולוגיה", "טיפול בחרדה", "מימוש עצמי", "יזמות קשובה"];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Top navigation - same as home */}
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
            <Link to="/blog" className="text-sm font-normal text-primary transition-colors">בלוג</Link>
            <Link to="/podcast" className="text-sm font-normal text-foreground hover:text-primary transition-colors">פודקאסט</Link>
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

      {/* Hero / Page header */}
      <section className="w-full pt-20 pb-12 px-6">
        <div className="w-[min(1100px,82%)] mx-auto text-right">
          <div className="flex items-center gap-4 mb-4">
            <span className="block w-1 h-12 bg-primary rounded-full" />
            <h1 className="text-foreground text-5xl md:text-6xl font-light tracking-tight">
              מרחב פנימי - הבלוג
            </h1>
          </div>
          <p className="text-foreground/70 text-lg md:text-xl font-light max-w-2xl pr-5">
            על נפש, תנועה ומשמעות - כפי שהן פוגשות חיים, יזמות והקשבה פנימית.
          </p>
        </div>
      </section>

      {/* Category filters */}
      <section className="w-full pb-10 px-6">
        <div className="w-[min(1100px,82%)] mx-auto">
          <div className="flex flex-wrap items-center gap-3 justify-start">
            {categories.map((cat, idx) => (
              <button
                key={cat}
                className={`px-5 py-2 rounded-full text-sm font-light transition-all ${
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
      <section className="w-full pb-16 px-6">
        <div className="w-[min(1100px,82%)] mx-auto">
          <Link
            to="/blog/pesach-freedom"
            className="group block bg-card rounded-3xl overflow-hidden shadow-[0_15px_50px_-15px_hsl(0_0%_0%_/_0.12)] hover:shadow-[0_25px_60px_-15px_hsl(var(--primary)/0.25)] transition-all duration-300"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="relative h-[280px] md:h-[420px] overflow-hidden bg-accent">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-10 md:p-14 text-right flex flex-col justify-center">
                <div className="flex items-center gap-3 justify-start mb-5">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-accent text-primary text-xs font-light">
                    פוסט מומלץ
                  </span>
                  <span className="text-foreground/50 text-sm font-light">{featuredPost.date}</span>
                </div>
                <span className="inline-block self-start px-3 py-1 rounded-md text-primary text-xs font-light mb-4">
                  {featuredPost.category}
                </span>
                <h2 className="text-foreground text-2xl md:text-3xl font-light leading-tight mb-5 group-hover:text-primary transition-colors">
                  {featuredPost.title}
                </h2>
                <p className="text-foreground/70 text-base font-light leading-relaxed mb-8">
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
      <section className="w-full pb-24 px-6">
        <div className="w-[min(1100px,82%)] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any, idx) => (
              <Link
                to={post.slug ? `/blog/${post.slug}` : `/blog/${idx + 1}`}
                key={idx}
                className="group bg-card rounded-3xl overflow-hidden shadow-[0_10px_30px_-15px_hsl(0_0%_0%_/_0.1)] hover:shadow-[0_20px_45px_-15px_hsl(var(--primary)/0.22)] transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-52 overflow-hidden bg-accent">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-7 text-right flex flex-col flex-1">
                  <div className="flex items-center justify-start gap-3 mb-3">
                    <span className="inline-block px-3 py-1 rounded-md bg-accent text-primary text-xs font-light">
                      {post.category}
                    </span>
                    <span className="text-foreground/50 text-xs font-light">{post.date}</span>
                  </div>
                  <h3 className="text-foreground text-lg md:text-xl font-light leading-tight mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-foreground/70 text-sm font-light leading-relaxed mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  <span className="self-start text-primary text-sm font-medium group-hover:text-[hsl(var(--primary-glow))] transition-colors">
                    להמשיך לקרוא ←
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Load more */}
          <div className="mt-16 flex justify-center">
            <button className="px-12 py-3 rounded-lg bg-primary text-primary-foreground text-base font-light hover:bg-[hsl(var(--primary-glow))] transition-colors">
              טעני עוד פוסטים
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="w-full pb-24 px-6">
        <div className="w-[min(1100px,82%)] mx-auto">
          <div
            className="rounded-[40px] px-12 md:px-20 py-16 md:py-20 text-right"
            style={{
              background: "linear-gradient(90deg, hsl(172 79% 79%) 0%, hsl(325 75% 69%) 100%)",
            }}
          >
            <div className="w-[min(680px,90%)] mr-0">
              <h2 className="text-white text-3xl md:text-4xl font-light leading-tight mb-5">
                רוצה לקבל פוסטים חדשים ישר למייל?
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

export default Blog;
