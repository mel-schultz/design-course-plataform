import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "Informe a senha"),
});

type RegisterForm = z.infer<typeof registerSchema>;
type LoginForm = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const params = new URLSearchParams(location.split("?")[1] ?? "");
  const initialMode = params.get("mode") === "login" ? "login" : "register";
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === "admin" ? "/admin" : "/minha-area");
    }
  }, [isAuthenticated]);

  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });
  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  const register = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      toast.success(`Bem-vindo(a), ${data.user.name}!`);
      navigate(data.user.role === "admin" ? "/admin" : "/minha-area");
      window.location.reload();
    },
    onError: (err) => toast.error(err.message),
  });

  const login = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      toast.success(`Bem-vindo(a) de volta!`);
      navigate(data.user.role === "admin" ? "/admin" : "/minha-area");
      window.location.reload();
    },
    onError: (err) => toast.error(err.message),
  });

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full opacity-25"
          style={{ background: "radial-gradient(circle, oklch(0.88 0.06 285) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, oklch(0.90 0.05 10) 0%, transparent 70%)" }} />
      </div>

      <div className="w-full max-w-md px-4 relative">
        {/* Back link */}
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          Voltar ao início
        </Link>

        <Card className="border-border/50 shadow-soft gradient-card corner-bracket">
          <CardContent className="p-8">
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-primary" />
              </div>
              <span className="font-serif text-lg font-semibold text-foreground">DesignHub</span>
            </div>

            {/* Mode toggle */}
            <div className="flex rounded-full border border-border/60 p-1 mb-8 bg-muted/30">
              {(["register", "login"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`flex-1 py-1.5 text-sm rounded-full transition-all duration-200 ${
                    mode === m
                      ? "bg-background shadow-sm text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "register" ? "Cadastrar" : "Entrar"}
                </button>
              ))}
            </div>

            {mode === "register" ? (
              <form onSubmit={registerForm.handleSubmit((d) => register.mutate(d))} className="space-y-4">
                <h2 className="font-serif text-2xl font-medium text-foreground mb-6">Criar conta</h2>

                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-sm text-muted-foreground">Nome completo</Label>
                  <Input
                    id="name"
                    placeholder="Seu nome"
                    {...registerForm.register("name")}
                    className="bg-background/60 border-border/60 focus:border-primary/50"
                  />
                  {registerForm.formState.errors.name && (
                    <p className="text-xs text-destructive">{registerForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm text-muted-foreground">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...registerForm.register("email")}
                    className="bg-background/60 border-border/60 focus:border-primary/50"
                  />
                  {registerForm.formState.errors.email && (
                    <p className="text-xs text-destructive">{registerForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm text-muted-foreground">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    {...registerForm.register("phone")}
                    className="bg-background/60 border-border/60 focus:border-primary/50"
                  />
                  {registerForm.formState.errors.phone && (
                    <p className="text-xs text-destructive">{registerForm.formState.errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm text-muted-foreground">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      {...registerForm.register("password")}
                      className="bg-background/60 border-border/60 focus:border-primary/50 pr-10"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {registerForm.formState.errors.password && (
                    <p className="text-xs text-destructive">{registerForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-sm text-muted-foreground">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repita a senha"
                    {...registerForm.register("confirmPassword")}
                    className="bg-background/60 border-border/60 focus:border-primary/50"
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full mt-2"
                  disabled={register.isPending}
                >
                  {register.isPending ? "Criando conta..." : "Criar conta"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Já tem uma conta?{" "}
                  <button type="button" onClick={() => setMode("login")} className="text-primary hover:underline">
                    Entrar
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={loginForm.handleSubmit((d) => login.mutate(d))} className="space-y-4">
                <h2 className="font-serif text-2xl font-medium text-foreground mb-6">Bem-vindo(a)</h2>

                <div className="space-y-1.5">
                  <Label htmlFor="loginEmail" className="text-sm text-muted-foreground">E-mail</Label>
                  <Input
                    id="loginEmail"
                    type="email"
                    placeholder="seu@email.com"
                    {...loginForm.register("email")}
                    className="bg-background/60 border-border/60 focus:border-primary/50"
                  />
                  {loginForm.formState.errors.email && (
                    <p className="text-xs text-destructive">{loginForm.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="loginPassword" className="text-sm text-muted-foreground">Senha</Label>
                  <div className="relative">
                    <Input
                      id="loginPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Sua senha"
                      {...loginForm.register("password")}
                      className="bg-background/60 border-border/60 focus:border-primary/50 pr-10"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {loginForm.formState.errors.password && (
                    <p className="text-xs text-destructive">{loginForm.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-full mt-2"
                  disabled={login.isPending}
                >
                  {login.isPending ? "Entrando..." : "Entrar"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Não tem conta?{" "}
                  <button type="button" onClick={() => setMode("register")} className="text-primary hover:underline">
                    Cadastrar
                  </button>
                </p>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
