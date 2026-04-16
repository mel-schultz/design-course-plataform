import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useState } from "react";
import { toast } from "sonner";

export default function Register() {
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Preencha todos os campos");
      return;
    }
    toast.success("Conta criada! Faça login para continuar.");
    setTimeout(() => setLocation("/login"), 1500);
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

      {/* Register Section */}
      <section className="min-h-[calc(100vh-80px)] flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="border border-border p-12">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Criar Conta</h2>
            <p className="text-muted-foreground mb-8">Registre-se para começar a aprender</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Nome Completo</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="João Silva"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Telefone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 mt-6"
              >
                Criar Conta
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-8">
              Já tem uma conta?{" "}
              <button
                onClick={() => setLocation("/login")}
                className="font-bold text-accent hover:underline"
              >
                Faça login
              </button>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
