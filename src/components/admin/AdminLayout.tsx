import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { LogOut, FileText, Mic, Briefcase, Presentation, Mail, Home } from "lucide-react";
import { useEffect } from "react";

const navItems = [
  { to: "/admin", label: "ראשי", icon: Home, end: true },
  { to: "/admin/blog", label: "בלוג", icon: FileText },
  { to: "/admin/lectures", label: "הרצאות", icon: Presentation },
  { to: "/admin/podcast", label: "פודקאסט", icon: Mic },
  { to: "/admin/projects", label: "פרויקטים", icon: Briefcase },
  { to: "/admin/leads", label: "נרשמות לתפוצה", icon: Mail },
];

export default function AdminLayout() {
  const { session, isAdmin, loading, signOut, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!session) navigate("/admin/login");
  }, [session, loading, navigate]);

  if (loading) return <div className="min-h-screen flex items-center justify-center" dir="rtl">טוען…</div>;
  if (!session) return null;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center" dir="rtl">
        <h1 className="text-2xl font-light">אין לך הרשאת ניהול</h1>
        <p className="text-foreground/70 max-w-md">
          החשבון <strong>{user?.email}</strong> אינו רשום כמנהל. אם את חגית, לחצי על הכפתור כדי להפוך את עצמך למנהלת (זמין רק כשאין עדיין מנהל במערכת).
        </p>
        <ClaimAdminButton />
        <Button variant="ghost" onClick={async () => { await signOut(); navigate("/admin/login"); }}>התנתקות</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-muted/30" dir="rtl">
      <aside className="w-60 bg-card border-l flex flex-col">
        <div className="p-5 border-b">
          <Link to="/" className="text-lg font-semibold">חגית מועלם</Link>
          <p className="text-xs text-foreground/60 mt-1">פאנל ניהול</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive ? "bg-primary text-primary-foreground" : "text-foreground/80 hover:bg-muted"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t space-y-2">
          <div className="text-xs text-foreground/60 px-3 truncate">{user?.email}</div>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={async () => { await signOut(); navigate("/admin/login"); }}>
            <LogOut className="h-4 w-4" />
            התנתקות
          </Button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function ClaimAdminButton() {
  const { refreshRole } = useAuth();
  return (
    <Button
      onClick={async () => {
        const { supabase } = await import("@/integrations/supabase/client");
        const { data, error } = await supabase.rpc("claim_admin_if_none");
        if (error) {
          alert("שגיאה: " + error.message);
          return;
        }
        if (data === true) {
          await refreshRole();
          window.location.reload();
        } else {
          alert("כבר קיים מנהל במערכת. אם זו לא את — צרי קשר עם התמיכה.");
        }
      }}
    >
      תפקדי אותי כמנהל
    </Button>
  );
}
