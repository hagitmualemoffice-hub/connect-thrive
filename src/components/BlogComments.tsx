import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { MessageCircle, Send, Loader2, HeartHandshake, PartyPopper, Flame, PlusCircle, Meh, Reply, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  name: string;
  content: string;
  created_at: string;
  parent_id: string | null;
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
  { label: "רוצה להוסיף", icon: PlusCircle },
  { label: "פחות", icon: Meh },
];

const commentEmojis = ["❤️", "😊", "🤩", "😢", "🙏", "👍", "🌷", "💪"];

const STORAGE_PREFIX = "quick_reaction_voted:";
const COMMENT_EMOJI_PREFIX = "comment_emoji_voted:"; // + commentId -> emoji

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

  // Replies state
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyName, setReplyName] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [emojiPickerFor, setEmojiPickerFor] = useState<string | null>(null);

  // Comment reactions: { [commentId]: { [emoji]: count } }
  const [commentReactions, setCommentReactions] = useState<Record<string, Record<string, number>>>({});
  // { [commentId]: emoji }
  const [myCommentReaction, setMyCommentReaction] = useState<Record<string, string>>({});

  const loadComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_comments")
      .select("id, name, content, created_at, parent_id")
      .eq("post_slug", postSlug)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to load comments", error);
    } else {
      const list = (data || []) as Comment[];
      setComments(list);
      // Load comment reactions for these comments
      const ids = list.map((c) => c.id);
      if (ids.length > 0) {
        const { data: rxData, error: rxErr } = await supabase
          .from("comment_reaction_counts")
          .select("comment_id, emoji, count")
          .in("comment_id", ids);
        if (!rxErr && rxData) {
          const map: Record<string, Record<string, number>> = {};
          rxData.forEach((row: { comment_id: string; emoji: string; count: number }) => {
            if (!map[row.comment_id]) map[row.comment_id] = {};
            map[row.comment_id][row.emoji] = row.count;
          });
          setCommentReactions(map);
        }
        // Load my reactions from localStorage
        const mine: Record<string, string> = {};
        ids.forEach((id) => {
          const v = localStorage.getItem(COMMENT_EMOJI_PREFIX + id);
          if (v) mine[id] = v;
        });
        setMyCommentReaction(mine);
      }
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

  // Group comments: top-level + replies map
  const { topLevel, repliesByParent } = useMemo(() => {
    const top: Comment[] = [];
    const replies: Record<string, Comment[]> = {};
    comments.forEach((c) => {
      if (c.parent_id) {
        if (!replies[c.parent_id]) replies[c.parent_id] = [];
        replies[c.parent_id].push(c);
      } else {
        top.push(c);
      }
    });
    // Replies oldest first for natural reading
    Object.keys(replies).forEach((k) => {
      replies[k].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    });
    return { topLevel: top, repliesByParent: replies };
  }, [comments]);

  const handleReactionClick = async (label: string) => {
    if (myReaction === label) return;

    const previous = myReaction;
    setMyReaction(label);
    setReactionCounts((prev) => {
      const next = { ...prev, [label]: (prev[label] || 0) + 1 };
      if (previous) next[previous] = Math.max(0, (prev[previous] || 1) - 1);
      return next;
    });
    localStorage.setItem(STORAGE_PREFIX + postSlug, label);

    const { data, error } = await supabase.rpc("increment_quick_reaction", {
      _post_slug: postSlug,
      _reaction: label,
    });

    if (error) {
      setMyReaction(previous);
      setReactionCounts((prev) => {
        const next = { ...prev, [label]: Math.max(0, (prev[label] || 1) - 1) };
        if (previous) next[previous] = (prev[previous] || 0) + 1;
        return next;
      });
      if (previous) localStorage.setItem(STORAGE_PREFIX + postSlug, previous);
      else localStorage.removeItem(STORAGE_PREFIX + postSlug);
      toast({ title: "אופס, ההצבעה לא נקלטה", description: "נסי שוב בעוד רגע", variant: "destructive" });
      return;
    }

    if (typeof data === "number") {
      setReactionCounts((prev) => ({ ...prev, [label]: data }));
    }
    if (previous) {
      await supabase.rpc("decrement_quick_reaction", { _post_slug: postSlug, _reaction: previous });
    }
  };

  const handleCommentEmoji = async (commentId: string, emoji: string) => {
    const previous = myCommentReaction[commentId];
    if (previous === emoji) return;

    // Optimistic
    setMyCommentReaction((prev) => ({ ...prev, [commentId]: emoji }));
    setCommentReactions((prev) => {
      const forC = { ...(prev[commentId] || {}) };
      forC[emoji] = (forC[emoji] || 0) + 1;
      if (previous) forC[previous] = Math.max(0, (forC[previous] || 1) - 1);
      return { ...prev, [commentId]: forC };
    });
    localStorage.setItem(COMMENT_EMOJI_PREFIX + commentId, emoji);
    setEmojiPickerFor(null);

    const { data, error } = await supabase.rpc("increment_comment_reaction", {
      _comment_id: commentId,
      _emoji: emoji,
    });

    if (error) {
      // Rollback
      setMyCommentReaction((prev) => {
        const next = { ...prev };
        if (previous) next[commentId] = previous;
        else delete next[commentId];
        return next;
      });
      setCommentReactions((prev) => {
        const forC = { ...(prev[commentId] || {}) };
        forC[emoji] = Math.max(0, (forC[emoji] || 1) - 1);
        if (previous) forC[previous] = (forC[previous] || 0) + 1;
        return { ...prev, [commentId]: forC };
      });
      if (previous) localStorage.setItem(COMMENT_EMOJI_PREFIX + commentId, previous);
      else localStorage.removeItem(COMMENT_EMOJI_PREFIX + commentId);
      toast({ title: "אופס, ההצבעה לא נקלטה", description: "נסי שוב בעוד רגע", variant: "destructive" });
      return;
    }

    if (typeof data === "number") {
      setCommentReactions((prev) => {
        const forC = { ...(prev[commentId] || {}) };
        forC[emoji] = data;
        return { ...prev, [commentId]: forC };
      });
    }

    if (previous) {
      await supabase.rpc("decrement_comment_reaction", { _comment_id: commentId, _emoji: previous });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = commentSchema.safeParse({ name, content });
    if (!result.success) {
      toast({ title: "שגיאה", description: result.error.errors[0].message, variant: "destructive" });
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
      toast({ title: "אופס, לא הצליח", description: "נסי שוב בעוד רגע 💛", variant: "destructive" });
      return;
    }
    toast({ title: "תודה רבה! 🥰", description: "התגובה שלך פורסמה" });
    setName("");
    setContent("");
    loadComments();
  };

  const handleReplySubmit = async (parentId: string, e: React.FormEvent) => {
    e.preventDefault();
    const result = commentSchema.safeParse({ name: replyName, content: replyContent });
    if (!result.success) {
      toast({ title: "שגיאה", description: result.error.errors[0].message, variant: "destructive" });
      return;
    }
    setReplySubmitting(true);
    const { error } = await supabase.from("blog_comments").insert({
      post_slug: postSlug,
      name: result.data.name,
      content: result.data.content,
      parent_id: parentId,
    });
    setReplySubmitting(false);
    if (error) {
      toast({ title: "אופס, לא הצליח", description: "נסי שוב בעוד רגע 💛", variant: "destructive" });
      return;
    }
    toast({ title: "תודה רבה! 🥰", description: "התגובה שלך פורסמה" });
    setReplyName("");
    setReplyContent("");
    setReplyTo(null);
    loadComments();
  };

  const renderComment = (c: Comment, isReply = false) => {
    const rx = commentReactions[c.id] || {};
    const mine = myCommentReaction[c.id];
    const usedEmojis = Object.entries(rx).filter(([, n]) => n > 0);

    return (
      <div
        key={c.id}
        className={`${
          isReply ? "bg-accent/25" : "bg-accent/40"
        } rounded-xl md:rounded-2xl px-5 md:px-7 py-4 md:py-5 text-right`}
        dir="rtl"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-primary text-sm md:text-base font-medium">{c.name}</span>
          <span className="text-foreground/50 text-xs font-light">{formatDate(c.created_at)}</span>
        </div>
        <p className="text-foreground/85 text-sm md:text-base font-light leading-relaxed whitespace-pre-wrap">
          {c.content}
        </p>

        {/* Reaction bar */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {usedEmojis.map(([emoji, count]) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleCommentEmoji(c.id, emoji)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs border transition-all ${
                mine === emoji
                  ? "bg-[hsl(var(--accent))] border-[hsl(var(--primary)/0.5)] text-[hsl(var(--primary-dark))]"
                  : "bg-white/90 border-transparent text-foreground hover:bg-white"
              }`}
            >
              <span className="text-sm leading-none">{emoji}</span>
              <span className="font-medium">{count}</span>
            </button>
          ))}

          <div className="relative">
            <button
              type="button"
              onClick={() => setEmojiPickerFor(emojiPickerFor === c.id ? null : c.id)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-white/90 text-foreground/70 hover:bg-white shadow-sm transition-colors"
              aria-label="הוספת אימוג'י"
            >
              <span className="text-sm leading-none">😊</span>
              <span>+</span>
            </button>
            {emojiPickerFor === c.id && (
              <div className="absolute z-20 top-full mt-2 right-0 bg-white rounded-2xl shadow-lg border border-border p-2 flex gap-1">
                {commentEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleCommentEmoji(c.id, emoji)}
                    className={`text-xl w-9 h-9 rounded-full hover:bg-accent transition-colors ${
                      mine === emoji ? "bg-accent" : ""
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!isReply && (
            <button
              type="button"
              onClick={() => {
                setReplyTo(replyTo === c.id ? null : c.id);
                setReplyName("");
                setReplyContent("");
              }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs text-primary hover:bg-accent/60 transition-colors ms-auto"
            >
              <Reply className="w-3.5 h-3.5" />
              {replyTo === c.id ? "ביטול" : "תגובה"}
            </button>
          )}
        </div>

        {/* Reply form */}
        {!isReply && replyTo === c.id && (
          <form
            onSubmit={(e) => handleReplySubmit(c.id, e)}
            className="mt-4 space-y-3 bg-white/70 rounded-xl p-4"
            dir="rtl"
          >
            <input
              type="text"
              value={replyName}
              onChange={(e) => setReplyName(e.target.value)}
              maxLength={80}
              disabled={replySubmitting}
              placeholder="השם שלך"
              dir="rtl"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm font-light text-right placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              maxLength={2000}
              disabled={replySubmitting}
              rows={3}
              placeholder={`להגיב ל${c.name}...`}
              dir="rtl"
              className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground text-sm font-light text-right placeholder:text-foreground/40 resize-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
            />
            <div className="flex justify-start gap-2">
              <button
                type="submit"
                disabled={replySubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-light shadow hover:bg-[hsl(var(--primary-glow))] transition-all disabled:opacity-60"
              >
                {replySubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                שליחת תגובה
              </button>
              <button
                type="button"
                onClick={() => setReplyTo(null)}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-foreground/60 text-sm hover:bg-accent/60"
              >
                <X className="w-4 h-4" />
                ביטול
              </button>
            </div>
          </form>
        )}

        {/* Replies */}
        {!isReply && repliesByParent[c.id]?.length > 0 && (
          <div className="mt-4 pr-4 md:pr-6 border-r-2 border-primary/20 space-y-3">
            {repliesByParent[c.id].map((r) => renderComment(r, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="w-full px-[30px] md:px-6 pb-12 md:pb-16" dir="rtl">
      <div className="w-full md:w-[min(820px,92%)] mx-auto">
        <div className="bg-card rounded-2xl md:rounded-[32px] shadow-[0_15px_50px_-20px_hsl(0_0%_0%_/_0.12)] px-6 md:px-14 py-8 md:py-12" dir="rtl">
          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="block w-1 h-7 md:h-9 bg-primary rounded-full" />
            <h2 className="text-foreground text-xl md:text-3xl font-light">במילה אחת:</h2>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4 mb-10 md:mb-12" dir="rtl">
            {quickReactions.map((r) => {
              const Icon = r.icon;
              const isActive = myReaction === r.label;
              const count = reactionCounts[r.label] || 0;
              return (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => handleReactionClick(r.label)}
                  className={`inline-flex items-center gap-2 pr-4 pl-2 md:pr-5 md:pl-2.5 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-light transition-all border ${
                    isActive
                      ? "bg-[hsl(var(--accent))] text-[hsl(var(--primary-dark))] border-[hsl(var(--primary)/0.5)] shadow-sm"
                      : "bg-white/95 text-foreground border-transparent shadow-md hover:bg-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{r.label}</span>
                  {count > 0 && (
                    <span
                      className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-[11px] font-medium transition-colors ${
                        isActive
                          ? "bg-[hsl(var(--primary)/0.2)] text-[hsl(var(--primary-dark))]"
                          : "bg-[hsl(var(--accent))] text-[hsl(var(--primary-dark))]"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mb-6 md:mb-8">
            <span className="block w-1 h-7 md:h-9 bg-primary rounded-full" />
            <h2 className="text-foreground text-xl md:text-3xl font-light">שתפי אותי במחשבות שלך</h2>
          </div>

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
              <div className="text-foreground/40 text-xs font-light mt-1 text-right">{content.length}/2000</div>
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

          <div className="border-t border-border pt-6 md:pt-8">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : topLevel.length === 0 ? (
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
                <div className="space-y-5 md:space-y-6">{topLevel.map((c) => renderComment(c))}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogComments;
