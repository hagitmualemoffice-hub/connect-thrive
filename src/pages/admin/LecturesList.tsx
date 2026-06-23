import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, ChevronUp, ChevronDown, Save } from "lucide-react";
import { toast } from "sonner";

type Row = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  audience: string | null;
  badges: string[];
  sort_order: number;
  published: boolean;
};

export default function AdminLecturesList() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-lectures"],
    queryFn: async () => {
      const { data, error } = await supabase.from("lectures").select("*").order("sort_order");
      if (error) throw error;
      return data as Row[];
    },
  });

  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light">הרצאות</h1>
        <Button onClick={() => { setCreating(true); setEditing({ id: "", title: "", subtitle: "", description: "", audience: "", badges: [], sort_order: (data?.length || 0), published: true }); }}>
          <Plus className="h-4 w-4 ml-2" />הרצאה חדשה
        </Button>
      </div>

      {editing && (
        <LectureForm
          value={editing}
          isNew={creating}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSaved={() => { qc.invalidateQueries({ queryKey: ["admin-lectures"] }); setEditing(null); setCreating(false); }}
        />
      )}

      <div className="bg-card border rounded-xl divide-y">
        {data?.map((row, idx) => (
          <div key={row.id} className="p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-medium">{row.title}</div>
              <div className="text-xs text-foreground/60">{row.subtitle?.slice(0, 80)}</div>
            </div>
            <ReorderButtons rows={data} idx={idx} table="lectures" onChange={() => qc.invalidateQueries({ queryKey: ["admin-lectures"] })} />
            <Button variant="ghost" size="sm" onClick={() => setEditing(row)}>עריכה</Button>
            <DeleteBtn id={row.id} table="lectures" onDone={() => qc.invalidateQueries({ queryKey: ["admin-lectures"] })} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LectureForm({ value, isNew, onClose, onSaved }: { value: Row; isNew: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(value);
  const save = useMutation({
    mutationFn: async () => {
      const payload = { title: form.title, subtitle: form.subtitle, description: form.description, audience: form.audience, badges: form.badges, sort_order: form.sort_order, published: form.published };
      if (isNew) {
        const { error } = await supabase.from("lectures").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("lectures").update(payload).eq("id", value.id);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("נשמר"); onSaved(); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="bg-card border rounded-xl p-5 space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <div><Label>כותרת</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><Label>תגיות (פסיק)</Label><Input value={form.badges.join(", ")} onChange={(e) => setForm({ ...form, badges: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></div>
      </div>
      <div><Label>כותרת משנה</Label><Textarea value={form.subtitle || ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></div>
      <div><Label>תיאור</Label><Textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} /></div>
      <div><Label>קהל יעד</Label><Input value={form.audience || ""} onChange={(e) => setForm({ ...form, audience: e.target.value })} /></div>
      <div className="flex items-center gap-3"><Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} /><span className="text-sm">פורסם</span></div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={onClose}>ביטול</Button>
        <Button onClick={() => save.mutate()} disabled={save.isPending}><Save className="h-4 w-4 ml-2" />שמירה</Button>
      </div>
    </div>
  );
}

export function ReorderButtons({ rows, idx, table, onChange }: { rows: any[]; idx: number; table: string; onChange: () => void }) {
  const swap = async (a: any, b: any) => {
    await supabase.from(table as any).update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from(table as any).update({ sort_order: a.sort_order }).eq("id", b.id);
    onChange();
  };
  return (
    <div className="flex flex-col">
      <Button variant="ghost" size="icon" disabled={idx === 0} onClick={() => swap(rows[idx], rows[idx - 1])}><ChevronUp className="h-3 w-3" /></Button>
      <Button variant="ghost" size="icon" disabled={idx === rows.length - 1} onClick={() => swap(rows[idx], rows[idx + 1])}><ChevronDown className="h-3 w-3" /></Button>
    </div>
  );
}

export function DeleteBtn({ id, table, onDone }: { id: string; table: string; onDone: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={async () => {
        if (!confirm("למחוק?")) return;
        const { error } = await supabase.from(table as any).delete().eq("id", id);
        if (error) toast.error(error.message);
        else { toast.success("נמחק"); onDone(); }
      }}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}
