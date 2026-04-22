import { useState } from "react";
import { z } from "zod";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const schema = z.object({
  name: z.string().trim().min(1, "נא להזין שם").max(100, "שם ארוך מדי"),
  email: z.string().trim().email("כתובת מייל לא תקינה").max(255, "מייל ארוך מדי"),
  phone: z.string().trim().min(1, "נא להזין טלפון").max(20, "טלפון ארוך מדי"),
  organization: z.string().trim().max(150, "שם ארוך מדי").optional().or(z.literal("")),
  participants: z.string().trim().max(20, "ערך ארוך מדי").optional().or(z.literal("")),
  date: z.string().trim().max(50, "ערך ארוך מדי").optional().or(z.literal("")),
  message: z.string().trim().max(1000, "הודעה ארוכה מדי").optional().or(z.literal("")),
});

interface LectureBookingPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initial = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  participants: "",
  date: "",
  message: "",
};

const LectureBookingPopup = ({ open, onOpenChange }: LectureBookingPopupProps) => {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      toast({ title: "שגיאה", description: result.error.issues[0].message, variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({ email: result.data.email });
    setSubmitting(false);
    if (error) {
      toast({ title: "שגיאה", description: "אירעה שגיאה, נסי שוב", variant: "destructive" });
      return;
    }
    toast({ title: "תודה!", description: "הפנייה התקבלה, אחזור אלייך בהקדם." });
    setForm(initial);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="max-w-[560px] p-0 overflow-hidden rounded-[28px] border-0 bg-card shadow-[0_32px_64px_-16px_hsl(0_0%_0%_/_0.18)]"
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 left-4 z-20 p-2 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
          aria-label="סגירה"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="px-8 md:px-12 py-10 md:py-12 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-8">
            <div className="w-12 h-px bg-primary mx-auto mb-5" />
            <h2 className="text-foreground text-2xl md:text-3xl font-light leading-tight tracking-tight mb-3">
              להזמנת הרצאה
            </h2>
            <p className="text-foreground/70 text-sm font-light leading-relaxed max-w-[36ch] mx-auto">
              ספרי לי על הקהל שלך והאירוע, ואחזור אלייך בהקדם להתאמת ההרצאה.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="text-right space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-foreground text-sm font-light mb-2">השם שלך</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  maxLength={100}
                  className="w-full h-11 px-4 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="block text-foreground text-sm font-light mb-2">טלפון</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  maxLength={20}
                  className="w-full h-11 px-4 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground text-sm font-light mb-2">כתובת מייל</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
                className="w-full h-11 px-4 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div>
              <label className="block text-foreground text-sm font-light mb-2">שם הארגון / הגוף</label>
              <input
                type="text"
                value={form.organization}
                onChange={(e) => setForm({ ...form, organization: e.target.value })}
                maxLength={150}
                className="w-full h-11 px-4 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-foreground text-sm font-light mb-2">מספר משתתפים</label>
                <input
                  type="text"
                  value={form.participants}
                  onChange={(e) => setForm({ ...form, participants: e.target.value })}
                  maxLength={20}
                  className="w-full h-11 px-4 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="block text-foreground text-sm font-light mb-2">תאריך מבוקש</label>
                <input
                  type="text"
                  placeholder="לדוגמה: 15/06/2026"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  maxLength={50}
                  className="w-full h-11 px-4 rounded-md border border-input bg-white text-right text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>

            <div>
              <label className="block text-foreground text-sm font-light mb-2">הודעה (אופציונלי)</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={1000}
                rows={3}
                className="w-full px-4 py-3 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-full bg-primary text-primary-foreground font-light tracking-wide hover:bg-[hsl(var(--primary-glow))] transition-all duration-500 shadow-md shadow-primary/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "שולחת..." : "שליחת הפנייה"}
            </button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LectureBookingPopup;
