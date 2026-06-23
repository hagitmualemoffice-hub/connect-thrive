import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function AdminLeads() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-leads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const exportCsv = () => {
    if (!data) return;
    const rows = [["email", "created_at"], ...data.map((d: any) => [d.email, d.created_at])];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-light">נרשמות לתפוצה ({data?.length ?? 0})</h1>
        <Button variant="outline" onClick={exportCsv} disabled={!data?.length}><Download className="h-4 w-4 ml-2" />ייצוא CSV</Button>
      </div>
      <div className="bg-card border rounded-xl divide-y">
        {isLoading && <div className="p-6 text-center">טוען…</div>}
        {data?.map((row: any) => (
          <div key={row.id} className="p-4 flex items-center justify-between">
            <span dir="ltr" className="font-mono text-sm">{row.email}</span>
            <span className="text-xs text-foreground/60">{new Date(row.created_at).toLocaleDateString("he-IL")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
