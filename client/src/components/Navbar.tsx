import { useAuth } from "@/_core/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, GraduationCap } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [, navigate] = useLocation();
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      toast.success("Até logo!");
      navigate("/");
      window.location.reload();
    },
  });

  const isAdmin = user?.role === "admin";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-md bg-background/80">
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <GraduationCap className="w-4 h-4 text-primary" />
          </div>
          <span className="font-serif text-lg font-semibold text-foreground">DesignHub</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/cursos" className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide">
            Cursos
          </Link>
          {isAuthenticated && !isAdmin && (
            <Link href="/minha-area" className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide">
              Minha Área
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors tracking-wide">
              Painel Admin
            </Link>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full w-8 h-8 text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <Link href={isAdmin ? "/admin" : "/perfil"}>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/60 hover:border-primary/40 transition-colors cursor-pointer">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-primary">
                      {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                    </span>
                  </div>
                  <span className="text-sm text-foreground">{user?.name?.split(" ")[0]}</span>
                </div>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout.mutate()}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                Sair
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth?mode=login">
                <Button variant="ghost" size="sm" className="text-sm">Entrar</Button>
              </Link>
              <Link href="/auth?mode=register">
                <Button size="sm" className="text-sm rounded-full px-4">Cadastrar</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden w-8 h-8"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-md px-4 py-4 flex flex-col gap-3">
          <Link href="/cursos" onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground py-2">
            Cursos
          </Link>
          {isAuthenticated && !isAdmin && (
            <Link href="/minha-area" onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground py-2">
              Minha Área
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-sm text-muted-foreground hover:text-foreground py-2">
              Painel Admin
            </Link>
          )}
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={() => { logout.mutate(); setMenuOpen(false); }} className="justify-start text-muted-foreground">
              Sair
            </Button>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
              <Link href="/auth?mode=login" onClick={() => setMenuOpen(false)}>
                <Button variant="outline" size="sm" className="w-full">Entrar</Button>
              </Link>
              <Link href="/auth?mode=register" onClick={() => setMenuOpen(false)}>
                <Button size="sm" className="w-full">Cadastrar</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
