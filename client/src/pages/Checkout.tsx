import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { useLocation, useParams } from "wouter";
import { Moon, Sun, LogOut, ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Checkout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [, setLocation] = useLocation();
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simular processamento de pagamento
    setTimeout(() => {
      toast.success("Pagamento processado com sucesso!");
      setTimeout(() => setLocation("/student/dashboard"), 1500);
    }, 2000);
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
          Voltar
        </button>

        <div className="grid grid-cols-3 gap-12">
          {/* Checkout Form */}
          <div className="col-span-2">
            <h1 className="text-4xl font-bold mb-12 tracking-tight">Finalizar Compra</h1>

            {/* Order Summary */}
            <div className="border border-border p-8 mb-8">
              <h2 className="text-xl font-bold mb-6">Resumo do Pedido</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p>Web Design Avançado</p>
                  <p className="font-bold">$99.99</p>
                </div>
                <div className="flex justify-between">
                  <p>Acesso Vitalício</p>
                  <p className="font-bold">Incluído</p>
                </div>
                <div className="border-t border-border pt-4 flex justify-between text-lg">
                  <p className="font-bold">Total</p>
                  <p className="font-bold text-accent text-2xl">$99.99</p>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-6">Informações de Pagamento</h2>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Número do Cartão</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Nome no Cartão</label>
                <input
                  type="text"
                  name="cardName"
                  value={formData.cardName}
                  onChange={handleChange}
                  placeholder="João Silva"
                  className="w-full px-4 py-3 border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">Data de Validade</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className="w-full px-4 py-3 border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleChange}
                    placeholder="123"
                    className="w-full px-4 py-3 border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 text-lg font-bold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  "Confirmar Pagamento"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Seu pagamento é seguro e criptografado com Stripe
              </p>
            </form>
          </div>

          {/* Order Details Sidebar */}
          <aside>
            <div className="border border-border p-8 sticky top-6">
              <h3 className="text-lg font-bold mb-6">Detalhes do Curso</h3>

              <div className="mb-6">
                <div className="w-full h-32 bg-muted flex items-center justify-center border border-border mb-4">
                  <div className="w-16 h-16 bg-accent"></div>
                </div>
                <h4 className="font-bold text-lg mb-2">Web Design Avançado</h4>
                <p className="text-sm text-muted-foreground">Nível: Avançado</p>
              </div>

              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span>24 Aulas em Vídeo</span>
                  <span>✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Acesso Vitalício</span>
                  <span>✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Certificado</span>
                  <span>✓</span>
                </div>
                <div className="flex justify-between">
                  <span>Suporte por Email</span>
                  <span>✓</span>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-sm text-muted-foreground mb-2">Total a Pagar</p>
                <p className="text-3xl font-bold text-accent">$99.99</p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
