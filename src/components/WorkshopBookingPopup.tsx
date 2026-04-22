import { useState } from "react";
import { z } from "zod";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import workshopImage from "@/assets/workshop-atmosphere.jpg";

const schema = z.object({
  name: z.string().trim().min(1, "נא להזין שם").max(100, "שם ארוך מדי"),
  email: z.string().trim().email("כתובת מייל לא תקינה").max(255, "מייל ארוך מדי"),
  phone: z.string().trim().min(1, "נא להזין טלפון").max(20, "טלפון ארוך מדי"),
  organization: z.string().trim().max(150, "שם ארוך מדי").optional().or(z.literal("")),
  contactPerson: z.string().trim().max(100, "ערך ארוך מדי").optional().or(z.literal("")),
  participants: z.string().trim().max(20, "ערך ארוך מדי").optional().or(z.literal("")),
  topic: z.string().trim().max(200, "ערך ארוך מדי").optional().or(z.literal("")),
  message: z.string().trim().max(1000, "הודעה ארוכה מדי").optional().or(z.literal("")),
});

interface WorkshopBookingPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initial = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  contactPerson: "",
  participants: "",
  topic: "",
  message: "",
};

const WorkshopBookingPopup = ({ open, onOpenChange }: WorkshopBookingPopupProps) => {
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
    toast({ title: "תודה!", description: "הפנייה התקבלה, נחזור אלייך בהקדם." });
    setForm(initial);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="max-w-[820px] p-0 overflow-hidden rounded-[32px] border-0 bg-card shadow-[0_32px_64px_-16px_hsl(0_0%_0%_/_0.18)]"
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-5 left-5 z-20 p-2 rounded-full bg-white/80 backdrop-blur-sm text-foreground/60 hover:text-foreground hover:bg-white transition-colors"
          aria-label="סגירה"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col md:flex-row max-h-[90vh]">
          {/* Image side */}
          <div className="md:w-5/12 relative min-h-[200px] md:min-h-[600px] bg-muted overflow-hidden">
            <img
              src={workshopImage}
              alt="סדנת ביבליותרפיה"
              loading="lazy"
              width={1024}
              height={1024}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-card/30" />
            <div className="absolute bottom-8 right-6 left-6 text-right text-white drop-shadow-md">
              <p className="text-xs uppercase tracking-widest font-light opacity-90">ביבליותרפיה</p>
              <p className="text-base font-light mt-1 leading-relaxed">
                מילים שפותחות מרחב.
              </p>
            </div>
          </div>

          {/* Content side */}
          <div className="md:w-7/12 px-8 md:px-12 py-10 md:py-12 overflow-y-auto">
            <div className="text-center mb-7">
              <div className="w-12 h-px bg-primary mx-auto mb-5" />
              <h2 className="text-foreground text-2xl md:text-[28px] font-light leading-tight tracking-tight mb-3">
                בואו נתפור לכם חוויה<br />במיוחד לצורך שלכם
              </h2>
              <p className="text-foreground/70 text-sm font-light leading-relaxed max-w-[34ch] mx-auto">
                ספרו לי על הקבוצה והנושא, ואבנה איתכם סדנת ביבליותרפיה מותאמת.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="text-right space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">השם שלך</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    maxLength={100}
                    className="w-full h-10 px-3 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">טלפון</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    maxLength={20}
                    className="w-full h-10 px-3 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
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
                  className="w-full h-10 px-3 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">שם הארגון</label>
                  <input
                    type="text"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    maxLength={150}
                    className="w-full h-10 px-3 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">איש קשר</label>
                  <input
                    type="text"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    maxLength={100}
                    className="w-full h-10 px-3 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">מספר משתתפים</label>
                  <input
                    type="text"
                    value={form.participants}
                    onChange={(e) => setForm({ ...form, participants: e.target.value })}
                    maxLength={20}
                    className="w-full h-10 px-3 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">נושא הסדנה</label>
                  <input
                    type="text"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    maxLength={200}
                    className="w-full h-10 px-3 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-foreground text-sm font-light mb-2">הודעה נוספת (אופציונלי)</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  maxLength={1000}
                  rows={2}
                  className="w-full px-3 py-2 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-full bg-primary text-primary-foreground font-light tracking-wide hover:bg-[hsl(var(--primary-glow))] transition-all duration-500 shadow-md shadow-primary/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "שולחת..." : "בואו נתחיל"}
              </button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkshopBookingPopup;
