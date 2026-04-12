import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Users, Briefcase, Sun, HandHeart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const pillars = [
  {
    icon: Users,
    title: "חברתי",
    description: "מפגשים, ערבי יין, ארוחות משותפות ופעילויות שיוצרות חברויות אמיתיות",
  },
  {
    icon: Briefcase,
    title: "מקצועי",
    description: "נטוורקינג, הרצאות, סדנאות וליווי קריירה מנשים שמבינות",
  },
  {
    icon: Sun,
    title: "פנאי",
    description: "טיולים, סדנאות יצירה, ספורט ופעילויות שמחדשות את האנרגיה",
  },
  {
    icon: HandHeart,
    title: "תמיכה הדדית",
    description: "קהילה תומכת, שיחות פתוחות ומרחב בטוח להיות את עצמך",
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
        toast({ title: "נרשמת בהצלחה! 💕", description: "נשמח לעדכן אותך על הפעילויות הקרובות שלנו" });
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
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/60 to-background" />
        <div className="relative container mx-auto px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-accent-foreground mb-8">
            <Heart className="w-4 h-4" />
            <span>קהילה לנשים רווקות 28+</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight max-w-3xl mx-auto mb-6">
            המקום שלך
            <span className="text-primary"> להתחבר, לצמוח </span>
            ולהרגיש בבית
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            קהילה חמה ומעצימה לנשים רווקות שרוצות להרחיב את החיים — 
            חברתית, מקצועית ואישית. כי להיות רווקה זה לא להיות לבד.
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
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 px-8 text-base font-medium"
            >
              {isSubmitting ? "שולחת..." : "הצטרפי לרשימה"}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-4">
            ללא ספאם. רק עדכונים על אירועים ופרויקטים חדשים 🌸
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="container mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-4">
          ארבעה עולמות, קהילה אחת
        </h2>
        <p className="text-muted-foreground text-center max-w-xl mx-auto mb-14">
          אנחנו יוצרות מרחב שבו כל אחת יכולה למצוא את מה שהיא צריכה
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <Card key={pillar.title} className="border-border bg-card hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-5">
                  <pillar.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent/50">
        <div className="container mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">מוכנה להצטרף?</h2>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            הצטרפי לרשימת התפוצה שלנו ותהיי הראשונה לשמוע על אירועים, מפגשים ופרויקטים חדשים
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
            <Button type="submit" disabled={isSubmitting} className="h-12 px-8 text-base font-medium">
              {isSubmitting ? "שולחת..." : "הצטרפי עכשיו"}
            </Button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-10 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} כל הזכויות שמורות 💕
        </p>
      </footer>
    </div>
  );
};

export default Index;
