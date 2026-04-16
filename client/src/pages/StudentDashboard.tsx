import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";
import { Moon, Sun, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <button onClick={() => setLocation("/")} className="flex items-center gap-2 hover:opacity-80">
            <div className="w-8 h-8 bg-accent"></div>
            <h1 className="text-2xl font-bold tracking-tight">Design Courses</h1>
          </button>
          <div className="flex items-center gap-4">
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
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <section className="mb-12 border-b border-border pb-12">
          <h2 className="text-4xl font-bold mb-2 tracking-tight">Bem-vindo, {user?.name}!</h2>
          <p className="text-muted-foreground">Acesse seus cursos e continue aprendendo</p>
        </section>

        {/* My Courses Section */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold mb-8 tracking-tight">Meus Cursos</h3>
          <div className="grid grid-cols-3 gap-8">
            {[
              { title: "Web Design Iniciante", level: "Iniciante", progress: 45 },
              { title: "UI/UX Intermediário", level: "Intermediário", progress: 70 },
              { title: "Design Avançado", level: "Avançado", progress: 0 },
            ].map((course, idx) => (
              <div key={idx} className="border border-border p-6 hover:bg-muted transition">
                <div className="w-full h-32 bg-muted mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 bg-accent"></div>
                </div>
                <h4 className="text-lg font-bold mb-2">{course.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{course.level}</p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progresso</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted border border-border">
                    <div
                      className="h-full bg-accent"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  {course.progress > 0 ? "Continuar" : "Começar"}
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Available Courses Section */}
        <section className="border-t border-border pt-12">
          <h3 className="text-2xl font-bold mb-8 tracking-tight">Cursos Disponíveis</h3>
          <div className="grid grid-cols-3 gap-8">
            {[
              { title: "Fundamentos de Design", level: "Iniciante", price: "$49.99" },
              { title: "Motion Graphics", level: "Intermediário", price: "$79.99" },
              { title: "Branding Profissional", level: "Avançado", price: "$99.99" },
            ].map((course, idx) => (
              <div key={idx} className="border border-border p-6">
                <div className="w-full h-32 bg-muted mb-4 flex items-center justify-center">
                  <div className="w-16 h-16 bg-accent"></div>
                </div>
                <h4 className="text-lg font-bold mb-2">{course.title}</h4>
                <p className="text-sm text-muted-foreground mb-2">{course.level}</p>
                <p className="text-xl font-bold text-accent mb-4">{course.price}</p>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Inscrever-se
                </Button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
