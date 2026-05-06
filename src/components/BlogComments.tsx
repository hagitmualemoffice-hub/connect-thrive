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
  { label: "אהבתי", icon: HeartHandshake },
  { label: "דיבר אלי", icon: Flame },
  { label: "רוצה לדייק", icon: Crosshair },
  { label: "פחות", icon: Meh },
];

const STORAGE_PREFIX = "quick_reaction_voted:";

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
  const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});
  const [myReaction, setMyReaction] = useState<string | null>(null);

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

  const loadReactionCounts = async () => {
    const { data, error } = await supabase
      .from("quick_reaction_counts")
      .select("reaction, count")
      .eq("post_slug", postSlug);

    if (!error && data) {
      const map: Record<string, number> = {};
      data.forEach((row: { reaction: string; count: number }) => {
        map[row.reaction] = row.count;
      });
      setReactionCounts(map);
    }
  };

  useEffect(() => {
    loadComments();
    loadReactionCounts();
    const stored = localStorage.getItem(STORAGE_PREFIX + postSlug);
    if (stored) setMyReaction(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postSlug]);

  const handleReactionClick = async (label: string) => {
    if (myReaction === label) return;

    const previous = myReaction;
    // Optimistic update
    setMyReaction(label);
    setReactionCounts((prev) => {
      const next = { ...prev, [label]: (prev[label] || 0) + 1 };
      if (previous) {
        next[previous] = Math.max(0, (prev[previous] || 1) - 1);
      }
      return next;
    });
    localStorage.setItem(STORAGE_PREFIX + postSlug, label);

    const { data, error } = await supabase.rpc("increment_quick_reaction", {
      _post_slug: postSlug,
      _reaction: label,
    });

    if (error) {
      // Rollback
      setMyReaction(previous);
      setReactionCounts((prev) => {
        const next = { ...prev, [label]: Math.max(0, (prev[label] || 1) - 1) };
        if (previous) next[previous] = (prev[previous] || 0) + 1;
        return next;
      });
      if (previous) localStorage.setItem(STORAGE_PREFIX + postSlug, previous);
      else localStorage.removeItem(STORAGE_PREFIX + postSlug);
      toast({
        title: "אופס, ההצבעה לא נקלטה",
        description: "נסי שוב בעוד רגע",
        variant: "destructive",
      });
      return;
    }

    if (typeof data === "number") {
      setReactionCounts((prev) => ({ ...prev, [label]: data }));
    }

    // Decrement previous reaction in DB (best-effort, no rollback if it fails)
    if (previous) {
      await supabase.rpc("decrement_quick_reaction", {
        _post_slug: postSlug,
        _reaction: previous,
      });
    }
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
    loadComments();
  };

  return (
    <section className="w-full px-[30px] md:px-6 pb-12 md:pb-16" dir="rtl">
      <div className="w-full md:w-[min(820px,92%)] mx-auto">
        <div className="bg-card rounded-2xl md:rounded-[32px] shadow-[0_15px_50px_-20px_hsl(0_0%_0%_/_0.12)] px-6 md:px-14 py-8 md:py-12" dir="rtl">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="block w-1 h-7 md:h-9 bg-primary rounded-full" />
            <h2 className="text-foreground text-xl md:text-3xl font-light">
              במילה אחת:
            </h2>
          </div>

          {/* Quick reaction buttons with vote counts */}
          <div className="flex flex-wrap gap-3 md:gap-4 mb-10 md:mb-12" dir="rtl">
            {quickReactions.map((r) => {
              const Icon = r.icon;
              const isActive = myReaction === r.label;
              const count = reactionCounts[r.label] || 0;
              return (
                <div key={r.label} className="flex flex-col items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleReactionClick(r.label)}
                    className={`inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-full backdrop-blur-sm shadow-md text-xs md:text-sm font-light transition-all ${
                      isActive
                        ? "bg-[hsl(var(--primary-glow))] text-[hsl(var(--primary-dark))]"
                        : "bg-white/95 text-foreground hover:bg-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {r.label}
                  </button>
                  <span className="text-foreground/50 text-xs font-light">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="block w-1 h-7 md:h-9 bg-primary rounded-full" />
            <h2 className="text-foreground text-xl md:text-3xl font-light">
              שתפי אותי במחשבות שלך
            </h2>
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
                dir="rtl"
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
                dir="rtl"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground text-sm md:text-base font-light text-right placeholder:text-foreground/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              />
              <div className="text-foreground/40 text-xs font-light mt-1 text-right">
                {content.length}/2000
              </div>
            </div>
            <div className="flex justify-start">
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
              <div className="text-right py-8 md:py-10">
                <PartyPopper className="w-8 h-8 md:w-10 md:h-10 text-primary/50 mb-3" />
                <p className="text-foreground/60 text-sm md:text-base font-light">
                  עדיין אין כאן תגובות - בואי נפתח את השיחה 💛
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-5">
                  <MessageCircle className="w-4 h-4 text-primary" />
                  <span className="text-foreground/70 text-sm md:text-base font-light">
                    {comments.length} תגובות
                  </span>
                </div>
                <div className="space-y-5 md:space-y-6">
                  {comments.map((c) => (
                    <div
                      key={c.id}
                      className="bg-accent/40 rounded-xl md:rounded-2xl px-5 md:px-7 py-4 md:py-5 text-right"
                      dir="rtl"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-primary text-sm md:text-base font-medium">
                          {c.name}
                        </span>
                        <span className="text-foreground/50 text-xs font-light">
                          {formatDate(c.created_at)}
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
