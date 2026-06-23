import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Plus, Save } from "lucide-react";
import { toast } from "sonner";
import { ReorderButtons, DeleteBtn } from "./LecturesList";

type Row = any;

export default function AdminPodcastList() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin-podcast"],
    queryFn: async () => {
      const { data, error } = await supabase.from("podcast_episodes").select("*").order("sort_order");
      if (error) throw error;
      return data as Row[];
    },
  });

  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light">פרקי פודקאסט</h1>
        <Button onClick={() => { setCreating(true); setEditing({ num: String((data?.length || 0) + 1).padStart(2, "0"), title: "", description: "", duration: "", date_label: "", spotify_url: "", drive_url: "", sort_order: data?.length || 0, published: true }); }}>
          <Plus className="h-4 w-4 ml-2" />פרק חדש
        </Button>
      </div>

      {editing && <Form value={editing} isNew={creating} onClose={() => { setEditing(null); setCreating(false); }} onSaved={() => { qc.invalidateQueries({ queryKey: ["admin-podcast"] }); setEditing(null); setCreating(false); }} />}

      <div className="bg-card border rounded-xl divide-y">
        {data?.map((row, idx) => (
          <div key={row.id} className="p-4 flex items-center gap-3">
            <div className="w-12 text-center text-xs text-foreground/60">{row.num}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{row.title}</div>
              <div className="text-xs text-foreground/60">{row.date_label} · {row.duration}</div>
            </div>
            <ReorderButtons rows={data} idx={idx} table="podcast_episodes" onChange={() => qc.invalidateQueries({ queryKey: ["admin-podcast"] })} />
            <Button variant="ghost" size="sm" onClick={() => setEditing(row)}>עריכה</Button>
            <DeleteBtn id={row.id} table="podcast_episodes" onDone={() => qc.invalidateQueries({ queryKey: ["admin-podcast"] })} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Form({ value, isNew, onClose, onSaved }: { value: Row; isNew: boolean; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState(value);
  const save = useMutation({
    mutationFn: async () => {
      const payload = { num: form.num, title: form.title, description: form.description, duration: form.duration, date_label: form.date_label, spotify_url: form.spotify_url, drive_url: form.drive_url, sort_order: form.sort_order, published: form.published };
      if (isNew) {
        const { error } = await supabase.from("podcast_episodes").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("podcast_episodes").update(payload).eq("id", value.id);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast.success("נשמר"); onSaved(); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="bg-card border rounded-xl p-5 space-y-3">
      <div className="grid md:grid-cols-3 gap-3">
        <div><Label>מספר פרק</Label><Input value={form.num} onChange={(e) => setForm({ ...form, num: e.target.value })} /></div>
        <div><Label>אורך</Label><Input value={form.duration || ""} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="47 דק׳" /></div>
        <div><Label>תאריך</Label><Input value={form.date_label || ""} onChange={(e) => setForm({ ...form, date_label: e.target.value })} placeholder="מרץ 2026" /></div>
      </div>
      <div><Label>כותרת</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
      <div><Label>תיאור</Label><Textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
      <div className="grid md:grid-cols-2 gap-3">
        <div><Label>קישור Spotify</Label><Input dir="ltr" value={form.spotify_url || ""} onChange={(e) => setForm({ ...form, spotify_url: e.target.value })} /></div>
        <div><Label>קישור Drive</Label><Input dir="ltr" value={form.drive_url || ""} onChange={(e) => setForm({ ...form, drive_url: e.target.value })} /></div>
      </div>
      <div className="flex items-center gap-3"><Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} /><span className="text-sm">פורסם</span></div>
      <div className="flex gap-2 justify-end">
        <Button variant="ghost" onClick={onClose}>ביטול</Button>
        <Button onClick={() => save.mutate()} disabled={save.isPending}><Save className="h-4 w-4 ml-2" />שמירה</Button>
      </div>
    </div>
  );
}
