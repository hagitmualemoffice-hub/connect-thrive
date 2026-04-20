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
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Hero with image background */}
      <section className="relative">
        <div className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
          <img
            src={heroPortrait}
            alt="כשחיבור מחולל תנועה"
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

          {/* Top nav */}
          <header className="relative z-10 container mx-auto px-6 pt-6">
            <div className="flex items-center justify-between">
              <nav className="hidden md:flex items-center gap-7 text-sm text-white/95">
                {navLinks.map((link) => (
                  <a key={link.label} href={link.href} className="hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                ))}
              </nav>
              <div className="flex items-center gap-3">
                <Button size="sm" variant="secondary" className="rounded-full bg-white text-foreground hover:bg-white/90">
                  חזרה למעלה
                </Button>
                <span className="text-white text-sm hidden sm:inline">חזית מועלם</span>
              </div>
            </div>
          </header>

          {/* Hero text */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 -mt-16">
            <p className="text-white/90 text-sm mb-4 tracking-wide">פסיכולוגית קלינית • יזמת חברתית</p>
            <h1 className="text-white text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              כשחיבור מחולל תנועה
            </h1>
            <p className="text-white/90 text-base md:text-lg max-w-2xl leading-relaxed">
              על התחברות, יצירה, קהילה שיש בה כל הלב נעים בקסם יחודי לחיות לקבל ולהעצים
            </p>
          </div>
        </div>

        {/* Floating section pills */}
        <div className="container mx-auto px-6 -mt-10 relative z-20">
          <div className="bg-white shadow-soft rounded-full max-w-3xl mx-auto py-4 px-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium text-foreground">
            <a href="#lectures" className="hover:text-primary transition-colors">הרצאות</a>
            <span className="text-border">|</span>
            <a href="#workshops" className="hover:text-primary transition-colors">סדנאות</a>
            <span className="text-border">|</span>
            <a href="#contact" className="hover:text-primary transition-colors">יצירת קשר</a>
            <span className="text-border">|</span>
            <a href="#blog" className="hover:text-primary transition-colors">בלוג</a>
            <span className="text-border">|</span>
            <a href="#podcast" className="hover:text-primary transition-colors">פודקאסט</a>
          </div>
        </div>
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
