import { Link, useParams } from "react-router-dom";
import { ArrowRight, Share2 } from "lucide-react";
import lectureBg from "@/assets/woman-beach.jpg";
import pesachFreedom from "@/assets/blog-pesach-freedom.jpg";

const post = {
  category: "פרשה ופסיכולוגיה",
  date: "אפריל 2026",
  author: "חגית מועלם",
  authorTitle: "פסיכולוגית קלינית ויזמת",
  title: "במחשבה נוספת - נקודת מבט פסיכולוגית",
  subtitle: "על גאולה פנימית, חרדה, והכוח לעשות מעשה לפני שאנחנו מרגישות מוכנות",
  cover: pesachFreedom,
};

const relatedPosts = [
  { title: "הרצון הפנימי להימנע", category: "טיפול בחרדה", date: "4 במרץ 2026" },
  { title: "להרוג חלומות", category: "מימוש עצמי", date: "20 בפבר׳ 2026" },
  { title: "כשחרדה עובדת בשבילך", category: "יזמות קשובה", date: "15 בפבר׳ 2026" },
];

const BlogPost = () => {
  useParams();

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

      {/* Hero cover image with floating utility bar */}
      <section className="relative w-full">
        <div className="relative h-[420px] md:h-[560px] overflow-hidden">
          <img src={post.cover} alt={post.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-background/40" />
        </div>

        {/* Top utility bar over image */}
        <div className="absolute top-6 left-0 right-0 px-10 flex items-center justify-start gap-3 z-10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-md text-foreground text-sm font-light hover:bg-white transition-colors"
          >
            חזרה לבלוג
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/95 backdrop-blur-sm shadow-md text-foreground text-sm font-light hover:bg-white transition-colors">
            <Share2 className="w-4 h-4" />
            שיתוף
          </button>
        </div>
      </section>

      {/* Floating article card */}
      <section className="relative w-full px-6 -mt-32 md:-mt-48 z-10">
        <article className="w-[min(820px,92%)] mx-auto bg-card rounded-[32px] shadow-[0_25px_70px_-20px_hsl(0_0%_0%_/_0.18)] px-8 md:px-16 py-12 md:py-16 text-right">
          {/* Date */}
          <div className="flex items-center justify-center gap-2 text-foreground/60 text-sm font-light mb-6">
            <span>{post.date}</span>
            <span>·</span>
            <span className="text-primary">{post.category}</span>
          </div>

          {/* Author avatar */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-[hsl(var(--primary-glow))] flex items-center justify-center text-primary-foreground text-2xl font-light shadow-lg mb-4">
              ח
            </div>
            <div className="text-center">
              <span className="text-foreground font-medium">{post.author}</span>
              <span className="text-foreground/50 mx-2">·</span>
              <span className="text-foreground/70 font-light">{post.authorTitle}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-foreground text-3xl md:text-5xl font-light leading-tight text-center mb-8">
            {post.title}
          </h1>

          {/* Subtitle with side bar */}
          <div className="flex gap-4 mb-10 items-start justify-center">
            <span className="block w-1 self-stretch bg-primary rounded-full" />
            <h2 className="text-foreground text-xl md:text-2xl font-light leading-relaxed text-right max-w-2xl">
              {post.subtitle}
            </h2>
          </div>

          {/* Body */}
          <div className="text-foreground/85 text-base md:text-lg font-light leading-loose space-y-6">
            <p>
              לפני שעם ישראל יוצאים ממצרים, הקב״ה מצווה אותם לשחוט קרבן פסח. כמו שאנחנו יודעות, הכבש
              הוא אלוהי מצרים. הדבר הכי קדוש עבורם. הקב״ה דורש מהם לשחוט את אלוהי מצרים, ואם זה לא
              מספיק - לא לעשות את זה בהיחבא, אלא למשוח את המשקופים בדם, להכריז בגלוי שהם לא שייכים עוד
              למצרים ולהישאר בתוך הבתים שלהם, ולא לברוח. לחשוב שמתודעה של עבדים, שלא הייתה להם פניות
              נפשית אפילו להיאנח, הם מצליחים להביא את עצמם למקום של עצמאות פנימית ולעשות מעשה שהוא הכי
              הפוך מעבדות.
            </p>

            <h3 className="text-foreground text-2xl md:text-3xl font-light leading-tight pt-4">
              החשיפה הראשונה הכי מהירה לפחד בהיסטוריה
            </h3>

            <p>
              במחשבה שלי על זה, זו אולי החשיפה הראשונה הכי מהירה לפחד שהייתה בהיסטוריה. אני זוכרת
              שכשלמדתי קורס CBT בתואר השני, מרצה מוערך מאוד אמר לנו: כשאני בונה מדרג חשיפה לחרדה -
              מהקל לקשה - אני תמיד אומר למטופלים: אם אתם רוצים תהליך מהיר, זה תלוי רק בכם.
            </p>

            <p>
              כמה מהר אתם מוכנים לפגוש את הפחד הכי גדול שלכם, ולהיחשף למה שמעורר בכם הכי הרבה חרדה.
              כי פחד לא נשבר דרך מחשבה - הוא נשבר דרך מפגש. כל עוד אנחנו נמנעות ממגע עם החרדה - אנחנו
              מלמדות את עצמנו שהפחד באמת מסוכן, שאנחנו לא מסוגלות ושמה שאנחנו חוששות ממנו אכן יקרה.
              אבל ברגע שאנחנו נכנסות לתוך הסיטואציה, בלי להקטין אותה ובלי לברוח - משהו מתחיל להשתנות.
              אנחנו מגלות כוחות אחרים. המוח לומד: אני יכולה להיות בתוך זה, ואני לא מתפרקת.{" "}
              <strong className="font-medium text-foreground">
                שם מתחילה גאולה נפשית
              </strong>
              , ואולי בגלל זה - הדבר כל כך קשה. כי הוא דורש מאיתנו לעשות מעשה לפני שאנחנו מרגישות
              מוכנות.
            </p>

            <h3 className="text-foreground text-2xl md:text-3xl font-light leading-tight pt-4">
              לגאול את הנפש, לא רק את הגוף
            </h3>

            <p>
              פתאום התיאור שבני ישראל יצאו ממצרים בחיפזון מקבל משמעות אחרת. הקב״ה רצה להוציא אותם
              ממצרים בגוף - אבל בעיקר לגאול אותם בנפש. עשר המכות בנו בהם ביטחון, חיזקו את האמונה,
              נתנו כוח. אבל הם עדיין בתודעה אינסטינקטיבית של עבדות ועם פחד עמוק מהמצרים שנגשו בהם
              כל כך הרבה שנים, ובשביל זה הקב״ה מבקש מהם לעשות מעשה שמעמיד אותם בדיוק מול הפחד הזה.
              לפגוש אותו ישירות ובצורה הכי עוצמתית שאפשר - 10 בסולם החרדה.
            </p>

            <p>
              כפסיכולוגית, אני יודעת כמה קשה למטופלים להסכים לפגוש את הפחדים שלהם. אחד המקומות בהם
              המומחיות שלנו נבחנת, זה כמה אנחנו יכולים להצליח לגרום להם לבטוח בנו ולהסכים לתרגילים
              שלנו, כי זה קשה מאוד להיות במקומות מעוררי חרדה. ואם אמרנו שהקב״ה מבקש מעם ישראל להצליח
              להיות בתרגיל החשיפה הכי קשה להם כדי לצאת מעבדות הנפש, הוא נותן להם כוח מיוחד -{" "}
              <strong className="font-medium text-foreground">כוח האין ברירה</strong>, כי אחרת אי
              אפשר. הקב״ה אומר להם: רק כך אדע לפסוח על הבתים שלכם ורק ככה תוכלו להינצל ממכת בכורות.
              יש משמעות לזה שאת התרגול הזה הם עשו דווקא בתוך מצרים, כי מחוץ למצרים כבר לא הייתה להם
              הזדמנות לתרגל חופש כזה. דווקא בתוך המקום הכי סוגר והכי מפחיד - שם נפתחה להם האפשרות
              לבחור אחרת.
            </p>

            {/* Pull quote */}
            <blockquote className="my-10 px-8 py-8 rounded-2xl bg-accent/50 border-r-4 border-primary text-foreground text-xl md:text-2xl font-light leading-relaxed text-right">
              "הגאולה לא מחכה לנו ב'אחרי'. הגאולה קורית דווקא בתוך מצרים שלנו. בתוך החרדה, בתוך הספק,
              בתוך המקומות שעדיין לא פתורים."
            </blockquote>

            <h3 className="text-foreground text-2xl md:text-3xl font-light leading-tight pt-4">
              ומה זה אומר עלינו?
            </h3>

            <p>
              וזה מעלה בי מחשבות על החיים שלנו. על הפחדים שיש לנו בהם, ועל איך חרדה לפעמים מונעת
              מאיתנו לפרוח. כי לרוב אנחנו מחכות ל״אחרי״. אחרי שיהיה רגוע. אחרי שהלב יתייצב. אחרי
              שהפחד ייעלם, אחרי ש...
            </p>

            <p>
              אבל הגאולה לא מחכה לנו שם. הגאולה קורית דווקא בתוך מצרים שלנו. בתוך החרדה, בתוך הספק,
              בתוך המקומות שעדיין לא פתורים. והשאלה היא לא אם יש פחד - אלא מה אנחנו מוכנות לעשות
              בנוכחות שלו. אולי חופש נפשי לא נראה כמו רוגע מוחלט, אלא כמו היכולת לעשות צעד קטן,
              אמיתי, גם כשהלב רועד. לא לשחוט את כל ״אלוהי מצרים״ בבת אחת, אבל כן לבחור רגע אחד שבו
              אנחנו מפסיקות להיות מנוהלות מהפחד.
            </p>

            <p>
              ואולי נוכל לגייס את כוח ה״אין ברירה״ - גם בתוך החיים שלנו. לא כי באמת אין, אלא כי אנחנו
              בוחרות ליצור לעצמנו מחויבות. לקבוע משהו מראש. להגיד כן לדבר שקשה לנו יחד עם הספק האם
              נעמוד בו. להירשם, להתחייב, לשים את עצמנו בתוך סיטואציה שמבקשת מאיתנו לגדול.
            </p>

            <p className="text-foreground text-lg md:text-xl font-light leading-relaxed pt-4">
              מזמינה אותך לתרגל את כוח החירות של פסח, בתוך אתגרי החיים שלך.
            </p>

            <p className="text-foreground/80 text-base font-light pt-2">
              אוהבת אותך,
              <br />
              <span className="text-primary font-medium">חגית</span>
            </p>
          </div>

          {/* Tags */}
          <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-3 justify-end">
            <span className="px-4 py-1.5 rounded-full bg-accent text-primary text-xs font-light">פרשת השבוע</span>
            <span className="px-4 py-1.5 rounded-full bg-accent text-primary text-xs font-light">פסח</span>
            <span className="px-4 py-1.5 rounded-full bg-accent text-primary text-xs font-light">חרדה</span>
            <span className="px-4 py-1.5 rounded-full bg-accent text-primary text-xs font-light">חשיפה</span>
            <span className="px-4 py-1.5 rounded-full bg-accent text-primary text-xs font-light">גאולה פנימית</span>
          </div>
        </article>
      </section>

      {/* Newsletter CTA */}
      <section className="w-full pt-24 pb-16 px-6">
        <div className="w-[min(900px,82%)] mx-auto">
          <div
            className="rounded-[40px] px-12 md:px-20 py-14 md:py-16 text-right"
            style={{
              background: "linear-gradient(90deg, hsl(172 79% 79%) 0%, hsl(325 75% 69%) 100%)",
            }}
          >
            <div className="w-[min(620px,90%)] mr-0">
              <h2 className="text-white text-2xl md:text-4xl font-light leading-tight mb-4">
                אהבת? יש עוד הרבה במרחב הפנימי
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

      {/* Related posts */}
      <section className="w-full pb-24 px-6">
        <div className="w-[min(1100px,82%)] mx-auto">
          <div className="flex items-center gap-3 mb-10 justify-end">
            <h2 className="text-foreground text-3xl md:text-4xl font-light">פוסטים נוספים</h2>
            <span className="block w-1 h-9 bg-primary rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((p, idx) => (
              <Link
                to="/blog/post"
                key={idx}
                className="group bg-card rounded-3xl overflow-hidden shadow-[0_10px_30px_-15px_hsl(0_0%_0%_/_0.1)] hover:shadow-[0_20px_45px_-15px_hsl(var(--primary)/0.22)] transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                <div className="h-44 bg-accent overflow-hidden">
                  <img src={lectureBg} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-7 text-right flex flex-col flex-1">
                  <div className="flex items-center justify-end gap-3 mb-3">
                    <span className="text-foreground/50 text-xs font-light">{p.date}</span>
                    <span className="inline-block px-3 py-1 rounded-md bg-accent text-primary text-xs font-light">{p.category}</span>
                  </div>
                  <h3 className="text-foreground text-lg md:text-xl font-light leading-tight mb-4 group-hover:text-primary transition-colors flex-1">
                    {p.title}
                  </h3>
                  <span className="self-end text-primary text-sm font-medium group-hover:text-[hsl(var(--primary-glow))] transition-colors">
                    להמשיך לקרוא ←
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex justify-center">
            <Link to="/blog" className="px-10 py-3 rounded-lg bg-primary text-primary-foreground text-base font-light hover:bg-[hsl(var(--primary-glow))] transition-colors">
              לכל הפוסטים
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
