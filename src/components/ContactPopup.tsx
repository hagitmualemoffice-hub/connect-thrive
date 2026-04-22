import { useEffect, useState } from "react";
import { z } from "zod";
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
  /** Hide tabs and only show the chosen tab's form (for dedicated lecture/workshop popups). */
  lockTab?: boolean;
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

const tabConfig: Record<ContactTab, { label: string; title: string; subtitle: string }> = {
  general: {
    label: "יצירת קשר",
    title: "דברי איתי",
    subtitle: "כאן לכל שאלה או פנייה. אחזור אלייך בהקדם.",
  },
  lecture: {
    label: "הזמנת הרצאה",
    title: "להזמנת הרצאה",
    subtitle: "ספרי לי על הקהל והאירוע, ואחזור אלייך להתאמת ההרצאה.",
  },
  workshop: {
    label: "סדנת ביבליותרפיה",
    title: "בואו נתפור לכם חוויה במיוחד לצורך שלכם",
    subtitle: "ספרו לי על הקבוצה והנושא, ואבנה איתכם סדנה מותאמת.",
  },
};

const tabOrder: ContactTab[] = ["general", "lecture", "workshop"];

const inputCls =
  "w-full h-10 px-3 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary-vivid))]/40";

const ContactPopup = ({ open, onOpenChange, defaultTab = "general", lockTab = false }: ContactPopupProps) => {
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
      toast({ title: "שגיאה", description: "אירעה שגיאה, נסי שוב", variant: "destructive" });
      return;
    }
    toast({ title: "תודה!", description: "ההודעה נשלחה, אחזור אלייך בהקדם." });
    setForm(initial);
    onOpenChange(false);
  };

  const cfg = tabConfig[tab];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        hideClose
        className="max-w-[560px] p-0 overflow-hidden rounded-[28px] border-0 bg-card shadow-[0_32px_64px_-16px_hsl(0_0%_0%_/_0.18)] gap-0 max-h-[92vh] flex flex-col"
      >
        {/* Header: title first, then tabs below */}
        <div className="px-6 md:px-10 pt-8 pb-5 bg-card border-b border-border/60">
          <div className="text-center mb-5">
            <div className="w-10 h-px bg-[hsl(var(--primary-vivid))] mx-auto mb-4" />
            <h2 className="text-foreground text-2xl md:text-[26px] font-light leading-tight tracking-tight mb-2">
              {cfg.title}
            </h2>
            <p className="text-foreground/70 text-sm font-light leading-relaxed max-w-[36ch] mx-auto">
              {cfg.subtitle}
            </p>
          </div>

          {!lockTab && (
            <div className="flex flex-wrap items-center gap-2 justify-center">
              {tabOrder.map((t) => {
                const isActive = tab === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`px-5 py-2 rounded-full text-sm font-light transition-all ${
                      isActive
                        ? "bg-[hsl(var(--primary-vivid))] text-primary-foreground shadow-[0_2px_8px_-2px_hsl(var(--primary-vivid)/0.35)]"
                        : "bg-accent/60 text-accent-foreground hover:bg-accent"
                    }`}
                  >
                    {tabConfig[t].label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Scrollable content - stacked fields, narrow column with whitespace on the left */}
        <div className="flex-1 overflow-y-auto px-6 md:px-10 py-7">
          <form id="contact-popup-form" onSubmit={handleSubmit} className="text-right space-y-4">
            <div>
              <label className="block text-foreground text-sm font-light mb-2">השם שלך</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                maxLength={100}
                className={`${inputCls} max-w-[280px]`}
              />
            </div>

            <div>
              <label className="block text-foreground text-sm font-light mb-2">טלפון</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                maxLength={20}
                className={`${inputCls} max-w-[200px]`}
              />
            </div>

            <div>
              <label className="block text-foreground text-sm font-light mb-2">כתובת מייל</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                maxLength={255}
                className={`${inputCls} max-w-[320px]`}
              />
            </div>

            {/* Lecture-specific fields */}
            {tab === "lecture" && (
              <>
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">שם הארגון / הגוף</label>
                  <input
                    type="text"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    maxLength={150}
                    className={`${inputCls} max-w-[320px]`}
                  />
                </div>
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">מספר משתתפים</label>
                  <input
                    type="text"
                    value={form.participants}
                    onChange={(e) => setForm({ ...form, participants: e.target.value })}
                    maxLength={20}
                    className={`${inputCls} max-w-[140px]`}
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
                    className={`${inputCls} max-w-[200px] placeholder:text-muted-foreground/60`}
                  />
                </div>
              </>
            )}

            {/* Workshop-specific fields */}
            {tab === "workshop" && (
              <>
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">שם הארגון</label>
                  <input
                    type="text"
                    value={form.organization}
                    onChange={(e) => setForm({ ...form, organization: e.target.value })}
                    maxLength={150}
                    className={`${inputCls} max-w-[320px]`}
                  />
                </div>
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">איש קשר</label>
                  <input
                    type="text"
                    value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
                    maxLength={100}
                    className={`${inputCls} max-w-[280px]`}
                  />
                </div>
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">מספר משתתפים</label>
                  <input
                    type="text"
                    value={form.participants}
                    onChange={(e) => setForm({ ...form, participants: e.target.value })}
                    maxLength={20}
                    className={`${inputCls} max-w-[140px]`}
                  />
                </div>
                <div>
                  <label className="block text-foreground text-sm font-light mb-2">נושא הסדנה</label>
                  <input
                    type="text"
                    value={form.topic}
                    onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    maxLength={200}
                    className={`${inputCls} max-w-[360px]`}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-foreground text-sm font-light mb-2">
                {tab === "general" ? "מה תרצי לכתוב לי" : "הודעה נוספת (אופציונלי)"}
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                maxLength={1000}
                rows={tab === "general" ? 4 : 3}
                className="w-full max-w-[420px] px-3 py-2 rounded-md border border-input bg-white text-right text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary-vivid))]/40 resize-none"
              />
            </div>
          </form>
        </div>

        {/* Sticky footer - shorter button */}
        <div className="sticky bottom-0 px-6 md:px-10 py-4 bg-card border-t border-border/60 shadow-[0_-8px_24px_-12px_hsl(0_0%_0%_/_0.08)]">
          <div className="flex justify-start">
            <button
              type="submit"
              form="contact-popup-form"
              disabled={submitting}
              className="px-10 py-3 rounded-full bg-[hsl(var(--primary-vivid))] text-primary-foreground text-sm font-light tracking-wide hover:bg-[hsl(var(--primary-vivid-glow))] transition-all duration-300 shadow-md shadow-[hsl(var(--primary-vivid))]/25 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "שולחת..." : "שליחה"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactPopup;
