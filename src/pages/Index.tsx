import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import heroPortrait from "@/assets/hero-portrait.jpg";
import lecturesPortrait from "@/assets/lectures-portrait.jpg";

const navLinks = [
  { label: "הסנטר שלי", href: "#center", active: true },
  { label: "יזמות קשובה", href: "#entrepreneurship" },
  { label: "הפרויקטים שלי", href: "#projects" },
  { label: "סדנאות והרצאות", href: "#lectures" },
  { label: "בלוג", href: "#blog" },
  { label: "פודקאסט", href: "#podcast" },
];

const pillLinks = ["הרצאות", "סדנאות", "יזמות קשובה", "בלוג", "פודקאסט"];

const lectures = [
  {
    title: "להרוג חלומות",
    description:
      "איך נעצרים החלומות בלי לזוז איתנו לאן? מתוך החיים, ברצון לחיים שאנחנו ניצלים בהם, נדבר על מה גורם לנו להרוג את החלומות שבתוכנו וכיצד אפשר להחזיר אותם לחיים.",
  },
  {
    title: "כשחרדה עובדת בשבילך",
    description:
      "חרדה נחשבת לרגש, מטרידה ומפחידה אך באמת אפשר לרתום אותה לטובתנו. בהרצאה נלמד איך החרדה יכולה להפוך לכלי שמניע אותנו קדימה.",
  },
  {
    title: "ההנהגה שמתחילה מבפנים",
    description:
      "מנהיגות נשית, מסוגלות ובחירה במי שאני רוצה להיות. נצא למסע פנימי בו נכיר את הקול הפנימי, נבנה ביטחון ונלמד להוביל את עצמנו ואת הסביבה שלנו.",
  },
];

const blogPosts = [
  {
    tag: "פסיכולוגיה",
    title: "פריחת האלה ופחיתות לב",
    excerpt:
      "בשנים האחרונות, מתחיל יותר ויותר עיסוק ברעיון הפלא של הפריחה הנשית בגיל המעבר.",
  },
  {
    tag: "השראה",
    title: "רצון להתעורר",
    excerpt:
      "תהליך של התעוררות פנימית הוא תהליך מרגש ומאתגר כאחד. נדבר על מה צריך כדי להתחיל אותו.",
  },
  {
    tag: "מודעות",
    title: "פריחת האלה ופחיתות לב",
    excerpt:
      "בשנים האחרונות, מתחיל יותר ויותר עיסוק ברעיון הפלא של הפריחה הנשית בגיל המעבר.",
  },
];

const Index = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({ email: email.trim().toLowerCase() });
      if (error) {
        if (error.code === "23505") {
          toast({ title: "כבר נרשמת! 😊", description: "המייל הזה כבר קיים ברשימה שלנו" });
        } else {
          throw error;
        }
      } else {
        toast({ title: "נרשמת בהצלחה! 💕", description: "ניצור איתך קשר בהקדם" });
      }
      setEmail("");
    } catch {
      toast({ title: "שגיאה", description: "משהו השתבש, נסי שוב מאוחר יותר", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans" dir="rtl">
      {/* Top Navigation Bar — white background, separate from hero */}
      <header className="bg-white border-b border-border/30">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 h-[72px] flex items-center justify-between">
          {/* Brand — right side (RTL) */}
          <h2 className="text-[22px] font-bold text-[#1a3a5c] tracking-tight leading-none">
            חגית מועלם
          </h2>

          {/* Center nav links */}
          <nav className="hidden lg:flex items-center gap-9 text-[14px] font-normal text-[#3a3a3a]">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative py-1 transition-colors hover:text-primary ${
                  link.active
                    ? "text-primary after:absolute after:-bottom-1 after:right-0 after:left-0 after:h-[2.5px] after:bg-primary after:rounded-full"
                    : ""
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Left side buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="rounded-full border-[#3a3a3a]/30 text-[#3a3a3a] hover:bg-secondary/60 px-5 h-9 text-[13px] font-normal"
            >
              להצטרפות לתפוצה
            </Button>
            <Button className="rounded-full px-6 h-9 text-[13px] font-normal shadow-none bg-primary hover:bg-primary/90">
              דברו איתי
            </Button>
          </div>
        </div>
      </header>

      {/* Hero with image background */}
      <section className="relative">
        <div className="relative h-[85vh] min-h-[580px] max-h-[800px] w-full overflow-hidden">
          <img
            src={heroPortrait}
            alt="חגית מועלם – כשחיבור מחולל תנועה"
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50" />

          {/* Hero text — centered vertically in lower half */}
          <div className="relative z-10 h-full flex flex-col items-center justify-end pb-32 text-center px-6">
            <p className="text-white/90 text-[14px] mb-5 font-light tracking-[0.04em] leading-relaxed">
              קצת עלי
              <span className="mx-3 text-white/50">|</span>
              חגית מועלם פסיכולוגית קלינית
            </p>
            <h1 className="text-white text-[42px] md:text-[62px] lg:text-[78px] font-extralight mb-5 leading-[1.15] tracking-[-0.01em]">
              כשחיבור מחולל תנועה
            </h1>
            <p className="text-white/90 text-[15px] md:text-[17px] max-w-[680px] leading-[1.8] font-light tracking-wide">
              על התפתחות, יזמות, קהילה ושינוי שנולדים מעומק נפשי-רוחני וחיבור לייעוד ולמשמעות
            </p>
          </div>

          {/* Floating section pills — overlapping bottom edge */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-[920px] px-6 z-20">
            <div className="bg-white rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.08)] py-5 px-8 flex items-center justify-center">
              {pillLinks.map((label, idx) => (
                <div key={label} className="flex items-center">
                  <a
                    href={`#${label}`}
                    className="text-[16px] font-normal text-[#2a2a2a] hover:text-primary transition-colors px-5"
                  >
                    {label}
                  </a>
                  {idx < pillLinks.length - 1 && (
                    <span className="text-[#d0d0d0] text-lg">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spacer for floating pill overlap */}
        <div className="h-14" />
      </section>

      {/* About 1 */}
      <section className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div className="text-right">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-2">
              נעים מאוד, חגית מועלם
            </h2>
            <p className="text-xl text-muted-foreground">
              פסיכולוגית קלינית, מנחה, מרצה ויזמת.
            </p>
          </div>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              דרך עיסוקי הרבים אני פוגשת אנשים בנקודות מפנה משמעותיות בחייהם, ברגעים בהם הם מבקשים להבין את עצמם לעומק, לחולל שינוי משמעותי ולחיות חיים מלאים יותר.
            </p>
            <p>
              אני מאמינה שעבודה פסיכולוגית עמוקה יכולה להיות דלת לחופש פנימי, להעצמה ולפריחה אישית. במרחב המשותף שלנו אנחנו לומדים להכיר את עצמנו מחדש, להתחבר לרצונות האמיתיים ולפעול מתוך בחירה.
            </p>
            <Button className="rounded-full px-8 mt-2">לקריאה</Button>
          </div>
        </div>
      </section>

      {/* About 2 */}
      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-start">
          <div className="text-right">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
              אני מאמינה בכוח
              <br />
              של יצירה ועשייה תוך כדי תנועה
            </h2>
          </div>
          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <p>
              עבודתי משלבת בין הקליני לבין החברתי, בין הפרטי לבין הציבורי. אני מאמינה שכשאישה מתחברת לעצמה ולכוחותיה, היא יוצרת גלי השפעה שמגיעים הרבה מעבר לחייה האישיים.
            </p>
            <p>
              במהלך השנים פיתחתי גישה ייחודית שמשלבת כלים פסיכולוגיים עם תנועה חברתית, ומאפשרת לנשים למצוא את הקול שלהן ולפעול ממנו בעולם.
            </p>
            <Button className="rounded-full px-8 mt-2">לקריאה עוד</Button>
          </div>
        </div>
      </section>

      {/* Lectures intro with image */}
      <section id="lectures" className="relative">
        <div className="relative h-[500px] w-full overflow-hidden">
          <img
            src={lecturesPortrait}
            alt="הרצאות"
            width={1600}
            height={1000}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/30 to-black/10" />
          <div className="relative z-10 container mx-auto px-6 h-full flex items-center justify-end">
            <div className="text-right text-white max-w-md">
              <h2 className="text-3xl md:text-5xl font-bold mb-3">
                <span className="text-primary-glow">הרצאות</span> | להעיר את הכוח מבפנים
              </h2>
              <p className="text-white/90">
                אמונה, פסיכולוגיה וייעוד. דרכים פנימיות לתנועה חיצונית משמעותית וחיים שמחים יותר
              </p>
            </div>
          </div>
        </div>

        {/* Overlap card */}
        <div className="container mx-auto px-6 -mt-24 relative z-20 mb-20">
          <Card className="max-w-4xl mx-auto bg-card shadow-soft border-0 rounded-3xl">
            <CardContent className="p-10 md:p-14 grid md:grid-cols-2 gap-10 text-right">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">החיים שנועדו לי</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  אומרים שמחנו ייחודי לעולם בכוח, לדעת זאת היא רעיון נפלא. אבל איך באמת ניגשים לזה ומגלים מה הייעוד שלנו?
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  הרצאה מרתקת שבה נצא למסע פנימי לחשוף את הייעוד הפנימי, לפעול מתוך אמונה ולחיות חיים שיש בהם משמעות אמיתית.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">קהל היעד</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ההרצאה מתאימה לכל קהל המעוניין לעורר את הקול הפנימי, לקבל השראה ולמצוא משמעות עמוקה יותר בחייהם.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-2"><strong>משך פעילות:</strong></p>
                <p className="text-muted-foreground">הרצאה: 60-90 דק׳<br/>סדנה פנימית: 90 דק׳ עד יום מלא</p>
              </div>
            </CardContent>
            <div className="px-10 md:px-14 pb-10 text-center">
              <Button className="rounded-full px-10">לפרטים נוספים</Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Lectures grid */}
      <section className="container mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">מפרט הרצאות</h2>
          <p className="text-primary text-sm">פסיכולוגיה של עשייה • איזון פנימי וחיצוני • יצירה וביטוי</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {lectures.map((lecture) => (
            <Card key={lecture.title} className="bg-card border-border shadow-card hover:shadow-soft transition-shadow rounded-2xl">
              <CardContent className="p-8 text-right">
                <h3 className="text-xl font-bold text-foreground mb-4">{lecture.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 min-h-[120px]">
                  {lecture.description}
                </p>
                <Button size="sm" className="rounded-full px-6 w-full">לפרטים נוספים</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Unique offering CTA with gradient */}
      <section id="workshops" className="container mx-auto px-6 pb-24">
        <div
          className="max-w-5xl mx-auto rounded-3xl p-10 md:p-16 text-white text-right"
          style={{ background: "var(--gradient-cta)" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="text-white">מוצר ייחודי</span> - סדנאות ביבליותרפיה
          </h2>
          <p className="text-2xl md:text-3xl font-semibold mb-6">הנבנות בקשב לצורך שלכם</p>
          <p className="text-white/90 leading-relaxed mb-4 max-w-2xl">
            הסדנאות נבנות בקשב לצרכים הפרטניים של כל קבוצה ומאפשרות חוויה עמוקה ומעצימה. הן משלבות בין כלים פסיכולוגיים, ספרות ותנועה אישית, ומאפשרות לכל משתתפת למצוא את הקול הפנימי שלה.
          </p>
          <p className="text-white/90 leading-relaxed mb-8 max-w-2xl">
            <strong>איך הסדנא נפתחת ומתאימה לכם?</strong>
            <br />
            כל סדנה נבנית בהתאם לצרכי הקבוצה והמטרות שהוגדרו מראש. ניתן להתאים את הסדנה לקבוצות נשים, צוותים מקצועיים, מנהלות וכל קבוצה אחרת המעוניינת בחוויה משמעותית.
          </p>
          <Button variant="secondary" className="rounded-full px-10 bg-white text-foreground hover:bg-white/90">
            רוצה להתאים לעצמי
          </Button>
        </div>
      </section>

      {/* Blog */}
      <section id="blog" className="container mx-auto px-6 pb-24">
        <div className="text-right mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">מרחב פנימי בלוג</h2>
          <p className="text-muted-foreground text-sm mb-4">
            על נשמה, רצון, מציאות, מצוקות נפש, פחד, נתינה ויצירה
          </p>
          <Button size="sm" className="rounded-full px-6">לכל הפוסטים</Button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post, idx) => (
            <Card key={idx} className="bg-card border-border shadow-card hover:shadow-soft transition-shadow rounded-2xl">
              <CardContent className="p-6 text-right">
                <span className="inline-block bg-accent text-accent-foreground text-xs font-medium px-3 py-1 rounded-full mb-4">
                  {post.tag}
                </span>
                <h3 className="text-lg font-bold text-foreground mb-3">{post.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Contact / Newsletter */}
      <section id="contact" className="bg-accent/40">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">השאירו פרטים ואחזור אליכם</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            לפרטים נוספים על הרצאות, סדנאות וייעוץ אישי
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="הכניסי את המייל שלך"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-12 text-base bg-card border-border"
              required
            />
            <Button type="submit" disabled={isSubmitting} className="h-12 px-8 text-base font-medium rounded-full">
              {isSubmitting ? "שולחת..." : "שלחי"}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-10 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} חגית מועלם • כל הזכויות שמורות
        </p>
      </footer>
    </div>
  );
};

export default Index;
