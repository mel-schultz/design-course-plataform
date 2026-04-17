import { useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Plus, Edit, CheckCircle2 } from "lucide-react";

const planSchema = z.object({
  name: z.string().min(2, "Nome inválido"),
  description: z.string().optional(),
  price: z.number().min(0, "Preço inválido"),
  billingCycle: z.enum(["monthly", "quarterly", "annual"]),
  features: z.string().optional(),
  isActive: z.boolean().default(true),
});

type PlanForm = z.infer<typeof planSchema>;

export default function AdminPlans() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const utils = trpc.useUtils();

  const { data: plans, isLoading } = trpc.subscriptions.plans.useQuery();

  const form = useForm<PlanForm, unknown, PlanForm>({
    resolver: zodResolver(planSchema) as import("react-hook-form").Resolver<PlanForm>,
    defaultValues: { billingCycle: "monthly", isActive: true },
  });

  const createPlan = trpc.subscriptions.createPlan.useMutation({
    onSuccess: () => {
      toast.success("Plano criado!");
      setShowForm(false);
      form.reset();
      utils.subscriptions.plans.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const updatePlan = trpc.subscriptions.updatePlan.useMutation({
    onSuccess: () => {
      toast.success("Plano atualizado!");
      setShowForm(false);
      setEditingId(null);
      form.reset();
      utils.subscriptions.plans.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const onSubmit = (d: PlanForm) => {
    const featuresJson = d.features
      ? JSON.stringify(d.features.split("\n").filter((f) => f.trim()))
      : JSON.stringify([]);
    if (editingId) {
      updatePlan.mutate({
        id: editingId,
        name: d.name,
        description: d.description,
        price: String(d.price),
        isActive: d.isActive,
        features: featuresJson ? JSON.parse(featuresJson) : [],
      });
    } else {
      createPlan.mutate({
        ...d,
        features: featuresJson,
      });
    }
  };

  const startEdit = (plan: NonNullable<typeof plans>[0]) => {
    setEditingId(plan.id);
    const features: string[] = plan.features ? JSON.parse(plan.features) : [];
    form.reset({
      name: plan.name,
      description: plan.description ?? "",
      price: Number(plan.price),
      billingCycle: plan.billingCycle as "monthly" | "quarterly" | "annual",
      features: features.join("\n"),
      isActive: plan.isActive ?? true,
    });
    setShowForm(true);
  };

  const cycleLabel: Record<string, string> = {
    monthly: "Mensal",
    quarterly: "Trimestral",
    annual: "Anual",
  };

  return (
    <AdminLayout title="Planos de Assinatura" breadcrumb="Gerenciar planos e preços">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">{(plans ?? []).length} planos cadastrados</p>
        <Button
          className="rounded-full gap-2"
          onClick={() => { setEditingId(null); form.reset({ billingCycle: "monthly", isActive: true }); setShowForm(!showForm); }}
        >
          <Plus className="w-4 h-4" />
          Novo plano
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-primary/20 bg-primary/5 mb-6">
          <CardContent className="p-6">
            <h3 className="font-serif text-lg font-medium text-foreground mb-6">
              {editingId ? "Editar plano" : "Novo plano"}
            </h3>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Nome do plano</Label>
                  <Input {...form.register("name")} placeholder="Ex: Plano Básico" className="bg-background border-border/60" />
                  {form.formState.errors.name && (
                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Ciclo de cobrança</Label>
                  <select
                    {...form.register("billingCycle")}
                    className="w-full h-9 px-3 rounded-md border border-border/60 bg-background text-sm text-foreground"
                  >
                    <option value="monthly">Mensal</option>
                    <option value="quarterly">Trimestral</option>
                    <option value="annual">Anual</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Preço (R$)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    {...form.register("price", { valueAsNumber: true })}
                    placeholder="0.00"
                    className="bg-background border-border/60"
                  />
                  {form.formState.errors.price && (
                    <p className="text-xs text-destructive">{form.formState.errors.price.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Descrição</Label>
                  <Input {...form.register("description")} placeholder="Descrição breve" className="bg-background border-border/60" />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <Label className="text-sm text-muted-foreground">
                    Benefícios (um por linha)
                  </Label>
                  <Textarea
                    {...form.register("features")}
                    rows={4}
                    placeholder={"Acesso a todos os cursos\nCertificados de conclusão\nSuportes por e-mail"}
                    className="bg-background border-border/60 resize-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={form.watch("isActive")}
                  onCheckedChange={(v) => form.setValue("isActive", v)}
                  id="isActive"
                />
                <Label htmlFor="isActive" className="text-sm text-muted-foreground cursor-pointer">Plano ativo</Label>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="ghost" className="rounded-full" onClick={() => { setShowForm(false); setEditingId(null); }}>
                  Cancelar
                </Button>
                <Button type="submit" className="rounded-full" disabled={createPlan.isPending || updatePlan.isPending}>
                  {createPlan.isPending || updatePlan.isPending ? "Salvando..." : editingId ? "Salvar" : "Criar plano"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Plans list */}
      {isLoading ? (
        <div className="grid md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-border/50 animate-pulse">
              <CardContent className="p-5 space-y-3">
                <div className="h-5 bg-muted rounded w-1/2" />
                <div className="h-8 bg-muted rounded w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {(plans ?? []).map((plan) => {
            const features: string[] = plan.features ? JSON.parse(plan.features) : [];
            return (
              <Card key={plan.id} className={`border-border/50 shadow-card relative ${!plan.isActive ? "opacity-60" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-serif text-lg font-medium text-foreground">{plan.name}</h3>
                      <span className="text-xs text-muted-foreground">{cycleLabel[plan.billingCycle]}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-7 h-7 text-muted-foreground hover:text-foreground"
                      onClick={() => startEdit(plan)}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <span className="font-serif text-2xl font-semibold text-foreground">
                      R$ {Number(plan.price).toFixed(2).replace(".", ",")}
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">
                      /{plan.billingCycle === "monthly" ? "mês" : plan.billingCycle === "quarterly" ? "trim." : "ano"}
                    </span>
                  </div>

                  <ul className="space-y-1.5 mb-4">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      plan.isActive
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {plan.isActive ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
