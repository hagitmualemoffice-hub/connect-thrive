import { useEffect, useState } from "react";
import { z } from "zod";
import { MessageCircle, Send, Loader2, HeartHandshake, PartyPopper, Flame, Crosshair, Meh } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  name: string;
  content: string;
  created_at: string;
}

const commentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "נא להזין שם" })
    .max(80, { message: "שם ארוך מדי" }),
  content: z
    .string()
    .trim()
    .min(1, { message: "נא לכתוב תגובה" })
    .max(2000, { message: "התגובה ארוכה מדי" }),
});

const quickReactions = [
  { label: "אהבתי", icon: HeartHandshake, prompt: "אהבתי כי" },
  { label: "דיבר אלי", icon: Flame, prompt: "זה דיבר אליי כי" },
  { label: "רוצה לדייק", icon: Crosshair, prompt: "רוצה לדייק:" },
  { label: "פחות", icon: Meh, prompt: "פחות התחברתי כי" },
];

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const BlogComments = ({ postSlug }: { postSlug: string }) => {
  const { toast } = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [activeReaction, setActiveReaction] = useState<string | null>(null);

  const loadComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_comments")
      .select("id, name, content, created_at")
      .eq("post_slug", postSlug)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load comments", error);
    } else {
      setComments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postSlug]);

  const handleReactionClick = (label: string, prompt: string) => {
    setActiveReaction(label);
    if (!content.trim()) {
      setContent(prompt + " ");
    }
    setTimeout(() => {
      const el = document.getElementById("comment-content") as HTMLTextAreaElement | null;
      el?.focus();
      if (el) {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      }
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = commentSchema.safeParse({ name, content });
    if (!result.success) {
      toast({
        title: "שגיאה",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("blog_comments").insert({
      post_slug: postSlug,
      name: result.data.name,
      content: result.data.content,
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: "אופס, לא הצליח",
        description: "נסי שוב בעוד רגע 💛",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "תודה רבה! 🥰",
      description: "התגובה שלך פורסמה",
    });
    setName("");
    setContent("");
    setActiveReaction(null);
    loadComments();
  };

  return (
    <section className="w-full px-[30px] md:px-6 pb-12 md:pb-16">
      <div className="w-full md:w-[min(820px,92%)] mx-auto">
        <div className="bg-card rounded-2xl md:rounded-[32px] shadow-[0_15px_50px_-20px_hsl(0_0%_0%_/_0.12)] px-6 md:px-14 py-8 md:py-12 text-right">
          <div className="flex items-center gap-3 justify-end mb-6 md:mb-8">
            <h2 className="text-foreground text-xl md:text-3xl font-light">
              במילה אחת:
            </h2>
            <span className="block w-1 h-7 md:h-9 bg-primary rounded-full" />
          </div>

          {/* Quick reaction buttons - styled like the floating top utility bar */}
          <div className="flex flex-wrap gap-2 md:gap-3 justify-end mb-10 md:mb-12" dir="rtl">
            {quickReactions.map((r) => {
              const Icon = r.icon;
              const isActive = activeReaction === r.label;
              return (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => handleReactionClick(r.label, r.prompt)}
                  className={`inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full backdrop-blur-sm shadow-md text-xs md:text-sm font-light transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-white/95 text-foreground hover:bg-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {r.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 justify-end mb-6 md:mb-8">
            <h2 className="text-foreground text-xl md:text-3xl font-light">
              שתפי אותי במחשבות שלך
            </h2>
            <span className="block w-1 h-7 md:h-9 bg-primary rounded-full" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mb-8 md:mb-10 space-y-4" dir="rtl">
            <div>
              <input
                id="comment-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                disabled={submitting}
                placeholder="השם שלך"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm md:text-base font-light text-right placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
            </div>
            <div>
              <textarea
                id="comment-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={2000}
                disabled={submitting}
                rows={4}
                placeholder="מה תרצי לכתוב?"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm md:text-base font-light text-right placeholder:text-foreground/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
              <div className="text-foreground/40 text-xs font-light mt-1 text-left">
                {content.length}/2000
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-7 md:px-9 py-3 rounded-lg bg-primary text-primary-foreground text-sm md:text-base font-light shadow-md hover:bg-[hsl(var(--primary-glow))] transition-all disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    שולחת...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    פרסום תגובה
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Comments list */}
          <div className="border-t border-border pt-6 md:pt-8">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8 md:py-10">
                <PartyPopper className="w-8 h-8 md:w-10 md:h-10 text-primary/50 mx-auto mb-3" />
                <p className="text-foreground/60 text-sm md:text-base font-light">
                  עדיין אין כאן תגובות - בואי נפתח את השיחה 💛
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 justify-end mb-5">
                  <span className="text-foreground/70 text-sm md:text-base font-light">
                    {comments.length} תגובות
                  </span>
                  <MessageCircle className="w-4 h-4 text-primary" />
                </div>
                <div className="space-y-5 md:space-y-6">
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="bg-accent/40 rounded-xl md:rounded-2xl px-5 md:px-7 py-4 md:py-5"
                    >
                      <div className="flex items-center justify-end gap-3 mb-2">
                        <span className="text-foreground/50 text-xs font-light">
                          {formatDate(c.created_at)}
                        </span>
                        <span className="text-primary text-sm md:text-base font-medium">
                          {c.name}
                        </span>
                      </div>
                      <p className="text-foreground/85 text-sm md:text-base font-light leading-relaxed whitespace-pre-wrap">
                        {c.content}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogComments;
