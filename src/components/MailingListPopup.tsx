import { useState } from "react";
import { z } from "zod";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import popupImage from "@/assets/popup-shells.jpg";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        hideClose
        className="max-w-[760px] p-0 overflow-hidden rounded-[32px] border-0 bg-card shadow-[0_32px_64px_-16px_hsl(0_0%_0%_/_0.18)]"
      >

        <div className="flex flex-col md:flex-row">
          {/* Image side */}
          <div className="md:w-5/12 relative min-h-[220px] md:min-h-[520px] bg-muted overflow-hidden">
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
          <div className="md:w-7/12 px-10 py-12 md:px-16 md:py-20 flex flex-col justify-center items-center text-center">
            <div className="space-y-5 mb-10">
              <div className="w-12 h-px bg-primary mx-auto" />
              <h2 className="text-foreground text-3xl md:text-4xl font-light leading-tight tracking-tight">
                משהו יפה בדרך אלייך
              </h2>
              <p className="text-foreground/70 text-base font-light leading-relaxed max-w-[34ch] mx-auto">
                הצטרפי למרחב שקט של נשימה וציפורים שנאספות בקפידה אל תיבת המייל שלך.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-7">
              <div className="space-y-5">
                <input
                  type="text"
                  placeholder="שם מלא"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-3 px-1 text-foreground placeholder:text-muted-foreground/60 font-light focus:outline-none focus:border-primary transition-colors duration-300 text-right"
                />
                <input
                  type="email"
                  placeholder="כתובת אימייל"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-transparent border-b border-border py-3 px-1 text-foreground placeholder:text-muted-foreground/60 font-light focus:outline-none focus:border-primary transition-colors duration-300 text-right"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="px-12 py-3 rounded-full bg-[hsl(var(--primary-vivid))] text-primary-foreground font-light tracking-wide hover:bg-[hsl(var(--primary-vivid-glow))] transition-all duration-500 shadow-md shadow-[hsl(var(--primary-vivid))]/25 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "שולחת..." : "הצטרפות"}
              </button>
            </form>

            <p className="mt-10 text-[11px] uppercase tracking-widest text-muted-foreground/70 font-light">
              פרטיות מובטחת • ניתן להסיר בכל עת
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MailingListPopup;
