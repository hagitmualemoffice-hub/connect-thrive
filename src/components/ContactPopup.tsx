import { useEffect, useState } from "react";
import { z } from "zod";
import { X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type ContactTab = "general" | "lecture" | "workshop";

const schema = z.object({
  name: z.string().trim().min(1, "נא להזין שם").max(100, "שם ארוך מדי"),
  email: z.string().trim().email("כתובת מייל לא תקינה").max(255, "מייל ארוך מדי"),
  phone: z.string().trim().min(1, "נא להזין טלפון").max(20, "טלפון ארוך מדי"),
  organization: z.string().trim().max(150, "שם ארוך מדי").optional().or(z.literal("")),
  contactPerson: z.string().trim().max(100, "ערך ארוך מדי").optional().or(z.literal("")),
  participants: z.string().trim().max(20, "ערך ארוך מדי").optional().or(z.literal("")),
  date: z.string().trim().max(50, "ערך ארוך מדי").optional().or(z.literal("")),
  topic: z.string().trim().max(200, "ערך ארוך מדי").optional().or(z.literal("")),
  message: z.string().trim().max(1000, "הודעה ארוכה מדי").optional().or(z.literal("")),
});

interface ContactPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: ContactTab;
}

const initial = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  contactPerson: "",
  participants: "",
  date: "",
  topic: "",
  message: "",
};

const tabConfig: Record<ContactTab, { title: string; subtitle: string }> = {
  general: {
    title: "דברו איתי",
    subtitle: "כאן לכל שאלה או פנייה. אחזור אליכם בהקדם.",
  },
  lecture: {
    title: "להזמנת הרצאה",
    subtitle: "ספרו לי על הקהל והאירוע, ואחזור אליכם להתאמת ההרצאה.",
  },
  workshop: {
    title: "בואו נתפור לכם חוויה במיוחד לצורך שלכם",
    subtitle: "ספרו לי על הקבוצה והנושא, ואבנה איתכם סדנה מותאמת.",
  },
};

const inputCls =
  "w-full bg-background border border-border rounded-lg py-2.5 px-3 text-foreground placeholder:text-muted-foreground/60 font-light focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-right text-sm";

const labelCls = "block text-foreground/80 text-xs font-light mb-1.5 text-right";

const ContactPopup = ({ open, onOpenChange, defaultTab = "general" }: ContactPopupProps) => {
  const [tab, setTab] = useState<ContactTab>(defaultTab);
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  // Sync defaultTab when popup is opened
  useEffect(() => {
    if (open) setTab(defaultTab);
  }, [open, defaultTab]);

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
      toast({ title: "שגיאה", description: "אירעה שגיאה, נסו שוב", variant: "destructive" });
      return;
    }
    toast({ title: "תודה!", description: "ההודעה נשלחה, אחזור אליכם בהקדם." });
    setForm(initial);
    onOpenChange(false);
  };

  const cfg = tabConfig[tab];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="max-w-[600px] p-0 overflow-hidden rounded-[32px] border-0 bg-card shadow-[0_32px_64px_-16px_hsl(0_0%_0%_/_0.18)] gap-0 max-h-[92vh] flex flex-col"
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-5 left-5 z-30 p-2 rounded-full text-foreground/60 hover:text-foreground hover:bg-muted transition-colors bg-card/80 backdrop-blur-sm"
          aria-label="סגירה"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 md:px-12 py-10">
          <div className="text-center mb-8">
            <div className="w-12 h-px bg-primary mx-auto mb-4" />
            <h2 className="text-foreground text-2xl md:text-[26px] font-light leading-tight tracking-tight mb-2">
              {cfg.title}
            </h2>
            <p className="text-foreground/70 text-sm font-light leading-relaxed max-w-[36ch] mx-auto">
              {cfg.subtitle}
            </p>
          </div>

          <form id="contact-popup-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={labelCls}>השם שלכם</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={100}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>טלפון</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                maxLength={20}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>כתובת מייל</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
                className={inputCls}
              />
            </div>

            {/* Lecture-specific fields */}
            {tab === "lecture" && (
              <>
                <div>
                  <label className={labelCls}>שם הארגון / הגוף</label>
                  <input
                    type="text"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    maxLength={150}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>מספר משתתפים</label>
                  <input
                    type="text"
                    value={form.participants}
                    onChange={(e) => setForm({ ...form, participants: e.target.value })}
                    maxLength={20}
                    className={inputCls}
                  />
                </div>
              </>
            )}

            {/* Workshop-specific fields */}
            {tab === "workshop" && (
              <>
                <div>
                  <label className={labelCls}>שם הארגון</label>
                  <input
                    type="text"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    maxLength={150}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>איש קשר</label>
                  <input
                    type="text"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    maxLength={100}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>מספר משתתפים</label>
                  <input
                    type="text"
                    value={form.participants}
                    onChange={(e) => setForm({ ...form, participants: e.target.value })}
                    maxLength={20}
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>נושא הסדנה</label>
                  <input
                    type="text"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    maxLength={200}
                    className={inputCls}
                  />
                </div>
              </>
            )}

            {/* תאריך רצוי - in every form */}
            <div>
              <label className={labelCls}>תאריך רצוי {tab === "general" ? "(אופציונלי)" : ""}</label>
              <input
                type="text"
                placeholder="לדוגמה: 15/06/2026"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                maxLength={50}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>
                {tab === "general" ? "מה תרצו לכתוב לי" : "הודעה נוספת (אופציונלי)"}
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={1000}
                rows={tab === "general" ? 4 : 3}
                className={`${inputCls} resize-none`}
              />
            </div>
          </form>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 px-8 md:px-12 py-4 bg-card border-t border-border/60 shadow-[0_-8px_24px_-12px_hsl(0_0%_0%_/_0.08)]">
          <button
            type="submit"
            form="contact-popup-form"
            disabled={submitting}
            className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-light tracking-wide hover:bg-[hsl(var(--primary-glow))] transition-all duration-300 shadow-md shadow-primary/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "שולחת..." : "שליחה"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactPopup;
