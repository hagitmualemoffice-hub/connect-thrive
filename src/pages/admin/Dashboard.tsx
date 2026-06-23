import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileText, Presentation, Mic, Briefcase, Mail } from "lucide-react";

const cards = [
  { to: "/admin/blog", label: "פוסטים בבלוג", icon: FileText, table: "blog_posts" },
  { to: "/admin/lectures", label: "הרצאות", icon: Presentation, table: "lectures" },
  { to: "/admin/podcast", label: "פרקי פודקאסט", icon: Mic, table: "podcast_episodes" },
  { to: "/admin/projects", label: "פרויקטים", icon: Briefcase, table: "projects" },
  { to: "/admin/leads", label: "נרשמות לתפוצה", icon: Mail, table: "leads" },
] as const;

export default function AdminDashboard() {
  const { data: counts } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const result: Record<string, number> = {};
      await Promise.all(
        cards.map(async (c) => {
          const { count } = await supabase.from(c.table as any).select("*", { count: "exact", head: true });
          result[c.table] = count ?? 0;
        }),
      );
      return result;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light">שלום 👋</h1>
        <p className="text-foreground/60 mt-1">בחרי תחום לעריכה</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
          <Link key={c.to} to={c.to} className="bg-card border rounded-xl p-5 hover:shadow-md transition-shadow flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <c.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="font-medium">{c.label}</div>
              <div className="text-xs text-foreground/60">{counts?.[c.table] ?? "…"} פריטים</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
