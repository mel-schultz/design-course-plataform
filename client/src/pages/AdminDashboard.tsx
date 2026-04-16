import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation } from "wouter";
import { Moon, Sun, LogOut, Plus } from "lucide-react";
import { useState } from "react";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

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

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-border">
          <nav className="p-6 space-y-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full text-left px-4 py-3 font-bold ${
                activeTab === "overview"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              }`}
            >
              Visão Geral
            </button>
            <button
              onClick={() => setActiveTab("courses")}
              className={`w-full text-left px-4 py-3 font-bold ${
                activeTab === "courses"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              }`}
            >
              Cursos
            </button>
            <button
              onClick={() => setActiveTab("students")}
              className={`w-full text-left px-4 py-3 font-bold ${
                activeTab === "students"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              }`}
            >
              Alunos
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`w-full text-left px-4 py-3 font-bold ${
                activeTab === "payments"
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-muted"
              }`}
            >
              Pagamentos
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-12">
          {activeTab === "overview" && (
            <div>
              <h2 className="text-4xl font-bold mb-2 tracking-tight">Visão Geral</h2>
              <p className="text-muted-foreground mb-12">Bem-vindo ao painel administrativo, {user?.name}</p>

              <div className="grid grid-cols-4 gap-8 mb-12">
                {[
                  { label: "Total de Alunos", value: "342" },
                  { label: "Cursos Ativos", value: "12" },
                  { label: "Receita Mensal", value: "$24,580" },
                  { label: "Taxa de Conclusão", value: "78%" },
                ].map((stat, idx) => (
                  <div key={idx} className="border border-border p-6">
                    <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="border border-border p-6">
                  <h3 className="text-xl font-bold mb-4">Últimos Alunos</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Maria Silva", email: "maria@email.com", course: "Web Design" },
                      { name: "João Santos", email: "joao@email.com", course: "UI/UX" },
                      { name: "Ana Costa", email: "ana@email.com", course: "Branding" },
                    ].map((student, idx) => (
                      <div key={idx} className="border-b border-border pb-4 last:border-b-0">
                        <p className="font-bold">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                        <p className="text-sm text-muted-foreground">{student.course}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-border p-6">
                  <h3 className="text-xl font-bold mb-4">Últimos Pagamentos</h3>
                  <div className="space-y-4">
                    {[
                      { student: "Maria Silva", amount: "$49.99", status: "Concluído" },
                      { student: "João Santos", amount: "$79.99", status: "Concluído" },
                      { student: "Ana Costa", amount: "$99.99", status: "Pendente" },
                    ].map((payment, idx) => (
                      <div key={idx} className="border-b border-border pb-4 last:border-b-0">
                        <p className="font-bold">{payment.student}</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-muted-foreground">{payment.amount}</p>
                          <span className={`text-sm font-bold ${payment.status === "Concluído" ? "text-accent" : "text-muted-foreground"}`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "courses" && (
            <div>
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-bold tracking-tight">Gerenciar Cursos</h2>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Novo Curso
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Web Design Iniciante", level: "Iniciante", students: 45, price: "$49.99" },
                  { title: "UI/UX Intermediário", level: "Intermediário", students: 32, price: "$79.99" },
                  { title: "Design Avançado", level: "Avançado", students: 18, price: "$99.99" },
                ].map((course, idx) => (
                  <div key={idx} className="border border-border p-6 flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.level} • {course.students} alunos</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-bold text-accent">{course.price}</p>
                      <Button variant="outline">Editar</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "students" && (
            <div>
              <h2 className="text-4xl font-bold mb-12 tracking-tight">Gerenciar Alunos</h2>

              <div className="space-y-4">
                {[
                  { name: "Maria Silva", email: "maria@email.com", phone: "(11) 99999-0001", courses: 2, status: "Ativo" },
                  { name: "João Santos", email: "joao@email.com", phone: "(11) 99999-0002", courses: 1, status: "Ativo" },
                  { name: "Ana Costa", email: "ana@email.com", phone: "(11) 99999-0003", courses: 3, status: "Ativo" },
                ].map((student, idx) => (
                  <div key={idx} className="border border-border p-6">
                    <div className="grid grid-cols-5 gap-4 items-center">
                      <div>
                        <p className="font-bold">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{student.phone}</p>
                      <p className="text-sm text-muted-foreground">{student.courses} cursos</p>
                      <p className="text-sm font-bold text-accent">{student.status}</p>
                      <Button variant="outline" size="sm">Ver Detalhes</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div>
              <h2 className="text-4xl font-bold mb-12 tracking-tight">Gerenciar Pagamentos</h2>

              <div className="space-y-4">
                {[
                  { student: "Maria Silva", course: "Web Design", amount: "$49.99", date: "2026-04-15", status: "Concluído" },
                  { student: "João Santos", course: "UI/UX", amount: "$79.99", date: "2026-04-14", status: "Concluído" },
                  { student: "Ana Costa", course: "Branding", amount: "$99.99", date: "2026-04-13", status: "Pendente" },
                ].map((payment, idx) => (
                  <div key={idx} className="border border-border p-6">
                    <div className="grid grid-cols-5 gap-4 items-center">
                      <div>
                        <p className="font-bold">{payment.student}</p>
                        <p className="text-sm text-muted-foreground">{payment.course}</p>
                      </div>
                      <p className="font-bold text-accent">{payment.amount}</p>
                      <p className="text-sm text-muted-foreground">{payment.date}</p>
                      <span className={`text-sm font-bold ${payment.status === "Concluído" ? "text-accent" : "text-muted-foreground"}`}>
                        {payment.status}
                      </span>
                      <Button variant="outline" size="sm">Detalhes</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
