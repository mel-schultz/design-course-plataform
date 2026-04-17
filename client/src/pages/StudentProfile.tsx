import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { User, Phone, Mail, Lock } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function StudentProfile() {
  const { isAuthenticated, loading, user } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/auth?mode=login");
  }, [isAuthenticated, loading]);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", phone: user?.phone ?? "" },
  });

  const passwordForm = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) });

  const updateProfile = trpc.auth.updateProfile.useMutation({
    onSuccess: () => { toast.success("Perfil atualizado!"); window.location.reload(); },
    onError: (e) => toast.error(e.message),
  });

  const changePassword = trpc.auth.changePassword.useMutation({
    onSuccess: () => { toast.success("Senha alterada!"); passwordForm.reset(); },
    onError: (e) => toast.error(e.message),
  });

  if (loading || !isAuthenticated) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-2xl mx-auto">
          <div className="mb-10">
            <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Meu Perfil</h1>
            <p className="text-muted-foreground tracking-wide">Gerencie suas informações pessoais</p>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="font-serif text-2xl font-medium text-primary">
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </span>
            </div>
            <div>
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary mt-1 inline-block">
                {user?.role === "admin" ? "Professor" : "Aluno"}
              </span>
            </div>
          </div>

          {/* Profile form */}
          <Card className="border-border/50 shadow-card gradient-card mb-6">
            <CardContent className="p-6">
              <h2 className="font-serif text-xl font-medium text-foreground mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Informações pessoais
              </h2>
              <form onSubmit={profileForm.handleSubmit((d) => updateProfile.mutate(d))} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Nome completo</Label>
                  <Input
                    {...profileForm.register("name")}
                    className="bg-background/60 border-border/60"
                    defaultValue={user?.name ?? ""}
                  />
                  {profileForm.formState.errors.name && (
                    <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> E-mail
                  </Label>
                  <Input value={user?.email ?? ""} disabled className="bg-muted/50 border-border/40 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado</p>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Telefone
                  </Label>
                  <Input
                    {...profileForm.register("phone")}
                    placeholder="(11) 99999-9999"
                    className="bg-background/60 border-border/60"
                    defaultValue={user?.phone ?? ""}
                  />
                </div>

                <Button type="submit" className="rounded-full" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Salvando..." : "Salvar alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Password form */}
          <Card className="border-border/50 shadow-card gradient-card">
            <CardContent className="p-6">
              <h2 className="font-serif text-xl font-medium text-foreground mb-6 flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Alterar senha
              </h2>
              <form onSubmit={passwordForm.handleSubmit((d) => changePassword.mutate(d))} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Senha atual</Label>
                  <Input type="password" {...passwordForm.register("currentPassword")} className="bg-background/60 border-border/60" />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-xs text-destructive">{passwordForm.formState.errors.currentPassword.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Nova senha</Label>
                  <Input type="password" {...passwordForm.register("newPassword")} className="bg-background/60 border-border/60" />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-xs text-destructive">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Confirmar nova senha</Label>
                  <Input type="password" {...passwordForm.register("confirmPassword")} className="bg-background/60 border-border/60" />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-xs text-destructive">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <Button type="submit" variant="outline" className="rounded-full" disabled={changePassword.isPending}>
                  {changePassword.isPending ? "Alterando..." : "Alterar senha"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
