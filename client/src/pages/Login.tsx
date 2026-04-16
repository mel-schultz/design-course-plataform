import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export default function Login() {
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2 hover:opacity-80">
            <div className="w-8 h-8 bg-accent"></div>
            <h1 className="text-2xl font-bold tracking-tight">Design Courses</h1>
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </header>

      {/* Login Section */}
      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="border border-border p-12">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Bem-vindo</h2>
            <p className="text-muted-foreground mb-8">Faça login para acessar sua conta</p>

            <div className="space-y-4">
              <Button
                onClick={() => window.location.href = getLoginUrl()}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12"
              >
                Fazer Login com Manus
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">ou</span>
                </div>
              </div>

              <Button
                onClick={() => setLocation("/register")}
                variant="outline"
                className="w-full h-12"
              >
                Criar Conta
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Não tem uma conta?{" "}
              <button
                onClick={() => setLocation("/register")}
                className="font-bold text-accent hover:underline"
              >
                Registre-se
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
