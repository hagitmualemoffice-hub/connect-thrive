import { useState } from "react";
import { z } from "zod";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import popupImage from "@/assets/popup-turquoise-coffee.jpg";

const schema = z.object({
  name: z.string().trim().min(1, "נא להזין שם").max(100, "שם ארוך מדי"),
  email: z.string().trim().email("כתובת מייל לא תקינה").max(255, "מייל ארוך מדי"),
});

interface MailingListPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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
    if (error) {
      toast({ title: "שגיאה", description: "אירעה שגיאה, נסי שוב", variant: "destructive" });
      return;
    }
    toast({ title: "תודה!", description: "נרשמת בהצלחה לתפוצה." });
    setForm({ name: "", email: "" });
    onOpenChange(false);
  };

  const inputCls =
    "w-full bg-transparent border-b border-border py-2.5 px-1 text-foreground placeholder:text-muted-foreground/60 font-light focus:outline-none focus:border-primary transition-colors text-right text-sm";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="max-w-[820px] p-0 overflow-hidden rounded-[32px] border-0 bg-card shadow-[0_32px_64px_-16px_hsl(0_0%_0%_/_0.18)] max-h-[92vh] flex flex-col"
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-5 left-5 z-20 p-2 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
          aria-label="סגירה"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row overflow-y-auto">
          {/* Image side */}
          <div className="md:w-5/12 relative min-h-[220px] md:min-h-[560px] bg-muted overflow-hidden">
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
          <div className="md:w-7/12 px-8 py-12 md:px-14 md:py-16 flex flex-col justify-center">
            <div className="text-center mb-10">
              <div className="w-12 h-px bg-primary mx-auto mb-5" />
              <h2 className="text-foreground text-2xl md:text-3xl font-light leading-tight tracking-tight mb-3">
                כמה טוב שאת מצטרפת
              </h2>
              <p className="text-foreground/70 text-sm md:text-base font-light leading-relaxed max-w-[36ch] mx-auto">
                אשלח לך תוכן שקט שיזמין אותך לעצור, לנשום ולהתחבר לעצמך. מקווה שתהני.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-foreground/70 text-xs font-light mb-1.5 text-right">
                  שם מלא
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-foreground/70 text-xs font-light mb-1.5 text-right">
                  כתובת מייל
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputCls}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-light tracking-wide hover:bg-[hsl(var(--primary-glow))] transition-all duration-500 shadow-md shadow-primary/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {submitting ? "שולחת..." : "הצטרפות"}
              </button>
            </form>

            <p className="mt-8 text-center text-[11px] uppercase tracking-widest text-muted-foreground/70 font-light">
              פרטיות מובטחת • ניתן להסיר בכל עת
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MailingListPopup;
