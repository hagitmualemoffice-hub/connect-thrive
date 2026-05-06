import { useState } from "react";
import { z } from "zod";
import { X } from "lucide-react";
import { ResponsiveDialog } from "@/components/ResponsiveDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import popupImage from "@/assets/popup-turquoise-coffee.jpg";

const schema = z.object({
  name: z.string().trim().min(1, "נא להזין שם").max(100, "שם ארוך מדי"),
  email: z.string().trim().email("כתובת מייל לא תקינה").max(255, "מייל ארוך מדי"),
  date: z.string().trim().max(50, "ערך ארוך מדי").optional().or(z.literal("")),
});

interface MailingListPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const inputCls =
  "w-full bg-background border border-border rounded-lg py-2.5 px-3 text-foreground placeholder:text-muted-foreground/60 font-light focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-right text-sm";

const labelCls = "block text-foreground/80 text-xs font-light mb-1.5 text-right";

const MailingListPopup = ({ open, onOpenChange }: MailingListPopupProps) => {
  const [form, setForm] = useState({ name: "", email: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      toast({
        title: "שגיאה",
        description: result.error.issues[0].message,
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("leads").insert({ email: result.data.email });
    setSubmitting(false);
    void result.data.name;
    if (error) {
      toast({ title: "שגיאה", description: "אירעה שגיאה, נסו שוב", variant: "destructive" });
      return;
    }
    toast({ title: "תודה!", description: "נרשמתם בהצלחה לתפוצה." });
    setForm({ name: "", email: "", date: "" });
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-5 left-5 z-30 p-2 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted transition-colors bg-card/80 backdrop-blur-sm"
          aria-label="סגירה"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          {/* Image side */}
          <div className="md:w-5/12 relative min-h-[180px] md:min-h-full bg-muted overflow-hidden shrink-0">
            <img
              src={popupImage}
              alt="הצטרפות לתפוצה"
              loading="lazy"
              width={1024}
              height={1024}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/20" />
          </div>

          {/* Content side */}
          <div className="md:w-7/12 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto px-8 py-10 md:px-12 md:py-12">
              <div className="text-center mb-8">
                <div className="w-12 h-px bg-primary mx-auto mb-5" />
                <h2 className="text-foreground text-2xl md:text-3xl font-light leading-tight tracking-tight mb-3">
                  כמה טוב שהצטרפתם
                </h2>
                <p className="text-foreground/70 text-sm md:text-base font-light leading-relaxed max-w-[36ch] mx-auto">
                  אשלח לכם תוכן שקט שיזמין אתכם לעצור, לנשום ולהתחבר לעצמכם.
                </p>
              </div>

              <form id="mailing-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelCls}>שם מלא</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>כתובת מייל</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>תאריך רצוי (אופציונלי)</label>
                  <input
                    type="text"
                    placeholder="לדוגמה: 15/06/2026"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className={inputCls}
                  />
                </div>
              </form>

              <p className="mt-8 text-center text-[11px] uppercase tracking-widest text-muted-foreground/70 font-light">
                פרטיות מובטחת • ניתן להסיר בכל עת
              </p>
            </div>

            {/* Sticky footer */}
            <div className="sticky bottom-0 px-8 md:px-12 py-4 bg-card border-t border-border/60 shadow-[0_-8px_24px_-12px_hsl(0_0%_0%_/_0.08)]">
              <button
                type="submit"
                form="mailing-form"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-light tracking-wide hover:bg-[hsl(var(--primary-glow))] transition-all duration-500 shadow-md shadow-primary/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "שולחת..." : "הצטרפות"}
              </button>
            </div>
          </div>
        </div>
    </ResponsiveDialog>
  );
};

export default MailingListPopup;
