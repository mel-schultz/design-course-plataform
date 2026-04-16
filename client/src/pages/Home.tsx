import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";
import { Moon, Sun } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        setLocation("/admin/dashboard");
      } else {
        setLocation("/student/dashboard");
      }
    } else {
      setLocation("/register");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent"></div>
            <h1 className="text-2xl font-bold tracking-tight">Design Courses</h1>
          </div>
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
            {isAuthenticated ? (
              <Button
                onClick={() => setLocation(user?.role === "admin" ? "/admin/dashboard" : "/student/dashboard")}
                variant="default"
              >
                Dashboard
              </Button>
            ) : (
              <Button
                onClick={() => setLocation("/login")}
                variant="default"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-24 grid grid-cols-2 gap-16 items-center">
          <div>
            <div className="w-16 h-16 bg-accent mb-8"></div>
            <h2 className="text-5xl font-bold leading-tight mb-6 tracking-tight">
              Aprenda Design
              <br />
              com Profissionais
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Cursos estruturados em três níveis: iniciante, intermediário e avançado. Acesso imediato ao conteúdo após matrícula.
            </p>
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Começar Agora
            </Button>
          </div>
          <div className="bg-muted aspect-square flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-accent mx-auto mb-4"></div>
              <p className="text-muted-foreground">Conteúdo Visual</p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-24">
          <h3 className="text-4xl font-bold mb-16 tracking-tight">Nossos Cursos</h3>
          <div className="grid grid-cols-3 gap-8">
            {[
              { level: "Iniciante", desc: "Fundamentos de design e princípios básicos" },
              { level: "Intermediário", desc: "Técnicas avançadas e projetos práticos" },
              { level: "Avançado", desc: "Especialização e portfólio profissional" },
            ].map((course, idx) => (
              <div key={idx} className="border border-border p-8">
                <div className="w-12 h-12 bg-accent mb-6"></div>
                <h4 className="text-2xl font-bold mb-4">{course.level}</h4>
                <p className="text-muted-foreground mb-6">{course.desc}</p>
                <Button variant="outline" className="w-full">
                  Saiba Mais
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-border">
        <div className="container mx-auto px-4 py-24">
          <h3 className="text-4xl font-bold mb-16 tracking-tight">Por que escolher?</h3>
          <div className="grid grid-cols-2 gap-12">
            {[
              { title: "Conteúdo Estruturado", desc: "Aulas organizadas por nível de dificuldade" },
              { title: "Acesso Imediato", desc: "Comece a aprender assim que se matricular" },
              { title: "Pagamento Seguro", desc: "Integração com Stripe para máxima segurança" },
              { title: "Suporte Dedicado", desc: "Professores disponíveis para tirar dúvidas" },
            ].map((feature, idx) => (
              <div key={idx} className="border-l-4 border-accent pl-6">
                <h4 className="text-xl font-bold mb-2">{feature.title}</h4>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted border-b border-border">
        <div className="container mx-auto px-4 py-24 text-center">
          <h3 className="text-4xl font-bold mb-6 tracking-tight">Pronto para começar?</h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a centenas de alunos que já estão transformando suas carreiras com nossos cursos de design.
          </p>
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Inscreva-se Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h5 className="font-bold mb-4">Empresa</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Sobre</a></li>
                <li><a href="#" className="hover:text-foreground">Contato</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Cursos</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Iniciante</a></li>
                <li><a href="#" className="hover:text-foreground">Intermediário</a></li>
                <li><a href="#" className="hover:text-foreground">Avançado</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Termos</a></li>
                <li><a href="#" className="hover:text-foreground">Privacidade</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Suporte</h5>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground">Ajuda</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Design Courses Platform. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
