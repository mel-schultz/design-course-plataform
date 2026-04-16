import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation, useParams } from "wouter";
import { Moon, Sun, LogOut, ArrowLeft } from "lucide-react";

export default function CourseDetail() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const { id } = useParams();

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
        {/* Back Button */}
        <button
          onClick={() => setLocation("/student/dashboard")}
          className="flex items-center gap-2 text-accent hover:underline mb-8 font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar aos Cursos
        </button>

        {/* Course Header */}
        <div className="border-b border-border pb-12 mb-12">
          <div className="grid grid-cols-3 gap-8 items-start">
            <div className="col-span-2">
              <h1 className="text-4xl font-bold mb-4 tracking-tight">Web Design Avançado</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Aprenda técnicas avançadas de web design com projetos práticos e portfólio profissional.
              </p>
              <div className="flex gap-8">
                <div>
                  <p className="text-sm text-muted-foreground">Nível</p>
                  <p className="font-bold">Avançado</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duração</p>
                  <p className="font-bold">8 semanas</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aulas</p>
                  <p className="font-bold">24 vídeos</p>
                </div>
              </div>
            </div>
            <div className="bg-muted aspect-square flex items-center justify-center border border-border">
              <div className="w-24 h-24 bg-accent"></div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="col-span-2">
            <h2 className="text-2xl font-bold mb-8 tracking-tight">Conteúdo do Curso</h2>

            {/* Module 1 */}
            <div className="border border-border p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Módulo 1: Fundamentos Avançados</h3>
              <div className="space-y-3">
                {[
                  { title: "Aula 1: Princípios de Design Moderno", duration: "45 min", watched: true },
                  { title: "Aula 2: Tipografia Avançada", duration: "38 min", watched: true },
                  { title: "Aula 3: Sistemas de Grid", duration: "52 min", watched: false },
                ].map((lesson, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 border-b border-border last:border-b-0 hover:bg-muted cursor-pointer">
                    <div>
                      <p className="font-bold">{lesson.title}</p>
                      <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                    </div>
                    <div className={`w-4 h-4 border-2 ${lesson.watched ? "bg-accent border-accent" : "border-border"}`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Module 2 */}
            <div className="border border-border p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Módulo 2: Projetos Práticos</h3>
              <div className="space-y-3">
                {[
                  { title: "Projeto 1: Redesign de Website", duration: "120 min", watched: false },
                  { title: "Projeto 2: App Mobile Design", duration: "90 min", watched: false },
                ].map((lesson, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 border-b border-border last:border-b-0 hover:bg-muted cursor-pointer">
                    <div>
                      <p className="font-bold">{lesson.title}</p>
                      <p className="text-sm text-muted-foreground">{lesson.duration}</p>
                    </div>
                    <div className={`w-4 h-4 border-2 ${lesson.watched ? "bg-accent border-accent" : "border-border"}`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="border border-border p-6 sticky top-6">
              <h3 className="text-lg font-bold mb-4">Progresso do Curso</h3>
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Conclusão</span>
                  <span className="font-bold">45%</span>
                </div>
                <div className="w-full h-3 bg-muted border border-border">
                  <div className="h-full bg-accent" style={{ width: "45%" }}></div>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                <p>✓ 3 aulas assistidas</p>
                <p>✓ 1 projeto concluído</p>
                <p>○ 5 aulas restantes</p>
              </div>

              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mb-4">
                Continuar Assistindo
              </Button>

              <Button variant="outline" className="w-full">
                Baixar Certificado
              </Button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
