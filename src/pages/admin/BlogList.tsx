import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export default function AdminBlogList() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-posts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("blog_posts").update({ published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-posts"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("נמחק");
      qc.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light">פוסטים בבלוג</h1>
        <Link to="/admin/blog/new"><Button><Plus className="h-4 w-4 ml-2" />פוסט חדש</Button></Link>
      </div>
      <div className="bg-card border rounded-xl divide-y">
        {isLoading && <div className="p-6 text-center text-foreground/60">טוען…</div>}
        {data?.length === 0 && <div className="p-6 text-center text-foreground/60">אין עדיין פוסטים</div>}
        {data?.map((p: any) => (
          <div key={p.id} className="p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{p.title}</div>
              <div className="text-xs text-foreground/60 mt-1">{p.category} · {p.date_label} {!p.published && <span className="text-orange-600">· מוסתר</span>}</div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => togglePublish.mutate({ id: p.id, published: !p.published })}>
              {p.published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
            <Link to={`/admin/blog/${p.id}`}><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></Link>
            <Button variant="ghost" size="icon" onClick={() => { if (confirm("למחוק?")) remove.mutate(p.id); }}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
