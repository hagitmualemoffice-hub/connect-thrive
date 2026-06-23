import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { ReorderButtons, DeleteBtn } from "./LecturesList";

type Row = any;

export default function AdminProjectsList() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order");
      if (error) throw error;
      return data as Row[];
    },
  });

  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light">פרויקטים</h1>
        <Button onClick={() => { setCreating(true); setEditing({ title: "", paragraphs: [""], buttons: [], sort_order: data?.length || 0, published: true }); }}>
          <Plus className="h-4 w-4 ml-2" />פרויקט חדש
        </Button>
      </div>

      {editing && <Form value={editing} isNew={creating} onClose={() => { setEditing(null); setCreating(false); }} onSaved={() => { qc.invalidateQueries({ queryKey: ["admin-projects"] }); setEditing(null); setCreating(false); }} />}

      <div className="bg-card border rounded-xl divide-y">
        {data?.map((row, idx) => (
          <div key={row.id} className="p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{row.title}</div>
              <div className="text-xs text-foreground/60">{row.paragraphs?.length || 0} פסקאות · {row.buttons?.length || 0} כפתורים</div>
            </div>
            <ReorderButtons rows={data} idx={idx} table="projects" onChange={() => qc.invalidateQueries({ queryKey: ["admin-projects"] })} />
            <Button variant="ghost" size="sm" onClick={() => setEditing(row)}>עריכה</Button>
            <DeleteBtn id={row.id} table="projects" onDone={() => qc.invalidateQueries({ queryKey: ["admin-projects"] })} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Form({ value, isNew, onClose, onSaved }: { value: Row; isNew: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    ...value,
    paragraphs: Array.isArray(value.paragraphs) ? value.paragraphs : [],
    buttons: Array.isArray(value.buttons) ? value.buttons : [],
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { title: form.title, paragraphs: form.paragraphs.filter((p: string) => p.trim()), buttons: form.buttons, sort_order: form.sort_order, published: form.published };
      if (isNew) {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").update(payload).eq("id", value.id);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("נשמר"); onSaved(); },
    onError: (e: any) => toast.error(e.message),
  });

  const updateParagraph = (i: number, v: string) => setForm({ ...form, paragraphs: form.paragraphs.map((p: string, idx: number) => idx === i ? v : p) });
  const updateButton = (i: number, patch: any) => setForm({ ...form, buttons: form.buttons.map((b: any, idx: number) => idx === i ? { ...b, ...patch } : b) });

  return (
    <div className="bg-card border rounded-xl p-5 space-y-4">
      <div><Label>כותרת</Label><Textarea value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} rows={2} /></div>

      <div>
        <Label>פסקאות</Label>
        <div className="space-y-2 mt-2">
          {form.paragraphs.map((p: string, i: number) => (
            <div key={i} className="flex gap-2">
              <Textarea value={p} onChange={(e) => updateParagraph(i, e.target.value)} rows={3} />
              <Button variant="ghost" size="icon" onClick={() => setForm({ ...form, paragraphs: form.paragraphs.filter((_: any, idx: number) => idx !== i) })}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setForm({ ...form, paragraphs: [...form.paragraphs, ""] })}><Plus className="h-4 w-4 ml-2" />הוספת פסקה</Button>
        </div>
      </div>

      <div>
        <Label>כפתורים</Label>
        <div className="space-y-2 mt-2">
          {form.buttons.map((b: any, i: number) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_120px_40px] gap-2 items-end">
              <div><Label className="text-xs">תווית</Label><Input value={b.label || ""} onChange={(e) => updateButton(i, { label: e.target.value })} /></div>
              <div><Label className="text-xs">קישור (אם חיצוני)</Label><Input dir="ltr" value={b.href || ""} onChange={(e) => updateButton(i, { href: e.target.value, action: e.target.value ? undefined : b.action })} /></div>
              <div><Label className="text-xs">פעולה</Label>
                <select className="w-full h-10 border rounded-md px-2 text-sm bg-background" value={b.action || ""} onChange={(e) => updateButton(i, { action: e.target.value || undefined, href: e.target.value ? undefined : b.href })}>
                  <option value="">—</option>
                  <option value="mailing">תפוצה</option>
                  <option value="hosting">אירוח</option>
                </select>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setForm({ ...form, buttons: form.buttons.filter((_: any, idx: number) => idx !== i) })}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setForm({ ...form, buttons: [...form.buttons, { label: "", href: "" }] })}><Plus className="h-4 w-4 ml-2" />הוספת כפתור</Button>
        </div>
      </div>

      <div className="flex items-center gap-3"><Switch checked={form.published} onCheckedChange={(v: boolean) => setForm({ ...form, published: v })} /><span className="text-sm">פורסם</span></div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={onClose}>ביטול</Button>
        <Button onClick={() => save.mutate()} disabled={save.isPending}><Save className="h-4 w-4 ml-2" />שמירה</Button>
      </div>
    </div>
  );
}
