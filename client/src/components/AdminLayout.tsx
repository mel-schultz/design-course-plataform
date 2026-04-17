import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  CreditCard,
  Settings,
  Moon,
  Sun,
  GraduationCap,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/cursos", icon: BookOpen, label: "Cursos" },
  { href: "/admin/usuarios", icon: Users, label: "Usuários" },
  { href: "/admin/pagamentos", icon: CreditCard, label: "Pagamentos" },
  { href: "/admin/planos", icon: Settings, label: "Planos" },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumb?: string;
}

export default function AdminLayout({ children, title, breadcrumb }: AdminLayoutProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [location, navigate] = useLocation();

  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => { toast.success("Até logo!"); navigate("/"); window.location.reload(); },
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/auth?mode=login");
    if (!loading && isAuthenticated && user?.role !== "admin") navigate("/minha-area");
  }, [isAuthenticated, loading, user]);

  if (loading || !isAuthenticated || user?.role !== "admin") return null;

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r border-border/50 flex flex-col fixed top-0 left-0 bottom-0 z-40"
        style={{ background: "var(--sidebar)" }}>
        {/* Logo */}
        <div className="p-5 border-b border-border/50">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <span className="font-serif text-sm font-semibold text-foreground block">DesignHub</span>
              <span className="text-xs text-muted-foreground">Painel Admin</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/admin" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}>
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                  {isActive && <ChevronRight className="w-3 h-3 ml-auto" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User + actions */}
        <div className="p-3 border-t border-border/50 space-y-1">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-xs font-medium text-primary">
                {user?.name?.charAt(0)?.toUpperCase() ?? "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="flex-1 gap-2 text-xs text-muted-foreground justify-start"
            >
              {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {theme === "dark" ? "Claro" : "Escuro"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => logout.mutate()}
              className="w-8 h-8 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-md px-6 h-14 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-lg font-medium text-foreground">{title}</h1>
            {breadcrumb && <p className="text-xs text-muted-foreground">{breadcrumb}</p>}
          </div>
          <Link href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Ver site →
          </Link>
        </div>

        <div className="p-6 page-enter">
          {children}
        </div>
      </main>
    </div>
  );
}
