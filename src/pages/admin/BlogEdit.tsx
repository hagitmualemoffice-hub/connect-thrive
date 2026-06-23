import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import RichEditor from "@/components/admin/RichEditor";
import { BLOG_CATEGORIES } from "@/lib/contentServices";
import { resolveImageUrl } from "@/lib/imageRegistry";
import { toast } from "sonner";
import { ArrowRight, Upload } from "lucide-react";

const slugify = (s: string) =>
  s.trim().toLowerCase().replace(/[^a-z0-9\u0590-\u05FF\s-]/g, "").replace(/\s+/g, "-").slice(0, 80);

export default function AdminBlogEdit() {
  const { id } = useParams();
  const isNew = id === "new";
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-post", id],
    enabled: !isNew,
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState<any>({
    slug: "",
    category: "פסיכולוגיה",
    date_label: "",
    title: "",
    subtitle: "",
    excerpt: "",
    image_url: "",
    tags: "",
    content_html: "",
    published: true,
  });

  useEffect(() => {
    if (data) {
      setForm({
        slug: data.slug,
        category: data.category,
        date_label: data.date_label,
        title: data.title,
        subtitle: data.subtitle || "",
        excerpt: data.excerpt || "",
        image_url: data.image_url || "",
        tags: (data.tags || []).join(", "),
        content_html: data.content_html || "",
        published: data.published,
      });
    }
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        slug: form.slug || slugify(form.title),
        category: form.category,
        date_label: form.date_label,
        title: form.title,
        subtitle: form.subtitle,
        excerpt: form.excerpt,
        image_url: form.image_url || null,
        tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        content_html: form.content_html,
        published: form.published,
      };
      if (isNew) {
        const { data, error } = await supabase.from("blog_posts").insert(payload).select().single();
        if (error) throw error;
        return data;
      } else {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", id!);
        if (error) throw error;
        return data;
      }
    },
    onSuccess: (d: any) => {
      toast.success("נשמר");
      if (isNew && d?.id) navigate(`/admin/blog/${d.id}`);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const uploadCover = async (file: File) => {
    const ext = file.name.split(".").pop() || "jpg";
    const path = `covers/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("content-images").upload(path, file, { contentType: file.type });
    if (error) return toast.error(error.message);
    const { data } = supabase.storage.from("content-images").getPublicUrl(path);
    setForm((f: any) => ({ ...f, image_url: data.publicUrl }));
    toast.success("תמונה הועלתה");
  };

  if (!isNew && isLoading) return <div>טוען…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/admin/blog")} className="gap-2">
          <ArrowRight className="h-4 w-4" />
          חזרה לרשימה
        </Button>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 text-sm"><Switch checked={form.published} onCheckedChange={(v) => setForm((f: any) => ({ ...f, published: v }))} /> פורסם</div>
          <Button onClick={() => save.mutate()} disabled={save.isPending}>שמירה</Button>
        </div>
      </div>
      <h1 className="text-2xl font-light">{isNew ? "פוסט חדש" : "עריכת פוסט"}</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2"><Label>כותרת</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div className="space-y-2"><Label>slug (אנגלית, אופציונלי)</Label><Input dir="ltr" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={slugify(form.title)} /></div>
        <div className="space-y-2"><Label>קטגוריה</Label>
          <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{BLOG_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>תאריך (טקסט חופשי)</Label><Input value={form.date_label} onChange={(e) => setForm({ ...form, date_label: e.target.value })} placeholder="יוני 2026" /></div>
      </div>

      <div className="space-y-2"><Label>כותרת משנה</Label><Textarea value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
      <div className="space-y-2"><Label>תקציר (מוצג בכרטיס בבלוג)</Label><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} /></div>

      <div className="space-y-2">
        <Label>תמונת כיסוי</Label>
        <div className="flex items-center gap-3">
          <Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="URL או העלי קובץ" dir="ltr" />
          <Button asChild variant="outline" size="sm" className="gap-2">
            <label className="cursor-pointer">
              <Upload className="h-4 w-4" />
              העלאה
              <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); }} />
            </label>
          </Button>
        </div>
        {form.image_url && <img src={resolveImageUrl(form.image_url)} className="mt-2 h-32 rounded border" alt="" />}
      </div>

      <div className="space-y-2"><Label>תגיות (מופרדות בפסיק)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>

      <div className="space-y-2">
        <Label>תוכן הפוסט</Label>
        <RichEditor value={form.content_html} onChange={(html) => setForm((f: any) => ({ ...f, content_html: html }))} />
      </div>
    </div>
  );
}
