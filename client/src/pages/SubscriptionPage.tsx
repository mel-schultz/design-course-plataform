import { useEffect, useState } from "react";
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
import { CheckCircle2, CreditCard, Star, Lock, AlertCircle } from "lucide-react";

const paymentSchema = z.object({
  cardHolderName: z.string().min(3, "Nome inválido"),
  cardNumber: z.string().min(16, "Número inválido").max(19),
  expiryMonth: z.string().length(2, "Mês inválido"),
  expiryYear: z.string().length(4, "Ano inválido"),
  cvv: z.string().min(3).max(4),
  paymentMethod: z.enum(["credit_card", "debit_card"]),
});

type PaymentForm = z.infer<typeof paymentSchema>;

function formatCardNumber(value: string) {
  return value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
}

export default function SubscriptionPage() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/auth?mode=login");
  }, [isAuthenticated, loading]);

  const { data: plans, isLoading: loadingPlans } = trpc.subscriptions.plans.useQuery(undefined, { enabled: isAuthenticated });
  const { data: currentSub } = trpc.subscriptions.mySubscription.useQuery(undefined, { enabled: isAuthenticated });
  const { data: payments } = trpc.payments.myPayments.useQuery(undefined, { enabled: isAuthenticated });

  const form = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { paymentMethod: "credit_card" },
  });

  const subscribe = trpc.payments.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Assinatura ativada com sucesso!");
      setShowPaymentForm(false);
      navigate("/minha-area");
    },
    onError: (e) => toast.error(e.message),
  });

  const cancelSub = trpc.subscriptions.cancel.useMutation({
    onSuccess: () => { toast.success("Assinatura cancelada."); window.location.reload(); },
    onError: (e) => toast.error(e.message),
  });

  if (loading || !isAuthenticated) return null;

  const hasActiveSub = currentSub?.subscription?.status === "active";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Assinatura</h1>
            <p className="text-muted-foreground tracking-wide">Gerencie seu plano de acesso</p>
          </div>

          {/* Current subscription */}
          {hasActiveSub && (
            <Card className="border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/10 mb-8">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">Plano {currentSub?.plan?.name} ativo</p>
                      <p className="text-sm text-muted-foreground">
                        Válido até {currentSub?.subscription?.endDate
                          ? new Date(currentSub.subscription.endDate).toLocaleDateString("pt-BR")
                          : "—"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => cancelSub.mutate({ subscriptionId: currentSub!.subscription.id })}
                    disabled={cancelSub.isPending}
                    className="text-destructive border-destructive/30 hover:bg-destructive/5 shrink-0"
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plans */}
          {!showPaymentForm && (
            <>
              <h2 className="font-serif text-2xl font-medium text-foreground mb-6">
                {hasActiveSub ? "Trocar de plano" : "Escolha um plano"}
              </h2>

              {loadingPlans ? (
                <div className="grid md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse border-border/50">
                      <CardContent className="p-6 space-y-3">
                        <div className="h-5 bg-muted rounded w-1/2" />
                        <div className="h-8 bg-muted rounded w-2/3" />
                        <div className="h-3 bg-muted rounded" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {(plans ?? []).map((plan, i) => {
                    const isPopular = i === 1;
                    const features: string[] = plan.features ? JSON.parse(plan.features) : [];
                    const isCurrentPlan = currentSub?.plan?.id === plan.id;
                    return (
                      <Card
                        key={plan.id}
                        className={`relative border-border/50 shadow-card cursor-pointer transition-all duration-200 ${
                          selectedPlanId === plan.id ? "border-primary/60 shadow-soft" : "hover:border-primary/30"
                        } ${isPopular ? "border-primary/30" : ""}`}
                        onClick={() => setSelectedPlanId(plan.id)}
                      >
                        {isPopular && (
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                        )}
                        <CardContent className="p-5">
                          {isPopular && (
                            <div className="flex items-center gap-1 mb-2">
                              <Star className="w-3 h-3 text-primary fill-primary" />
                              <span className="text-xs text-primary font-medium">Popular</span>
                            </div>
                          )}
                          {isCurrentPlan && (
                            <div className="flex items-center gap-1 mb-2">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Plano atual</span>
                            </div>
                          )}
                          <h3 className="font-serif text-lg font-medium text-foreground mb-1">{plan.name}</h3>
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
                          <div className={`w-full h-0.5 rounded-full transition-all ${
                            selectedPlanId === plan.id ? "bg-primary" : "bg-border/50"
                          }`} />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {selectedPlanId && (
                <div className="mt-6 flex justify-center">
                  <Button
                    size="lg"
                    className="rounded-full px-8 gap-2"
                    onClick={() => setShowPaymentForm(true)}
                  >
                    <CreditCard className="w-4 h-4" />
                    Continuar para pagamento
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Payment form */}
          {showPaymentForm && selectedPlanId && (
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Pagamento seguro</span>
              </div>

              <Card className="border-border/50 shadow-soft gradient-card">
                <CardContent className="p-6">
                  <h2 className="font-serif text-xl font-medium text-foreground mb-6">Dados do cartão</h2>

                  <form onSubmit={form.handleSubmit((d) => subscribe.mutate({ ...d, planId: selectedPlanId }))} className="space-y-4">
                    {/* Payment method */}
                    <div className="flex gap-3 mb-2">
                      {(["credit_card", "debit_card"] as const).map((method) => (
                        <button
                          key={method}
                          type="button"
                          onClick={() => form.setValue("paymentMethod", method)}
                          className={`flex-1 py-2 text-sm rounded-lg border transition-all ${
                            form.watch("paymentMethod") === method
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border/60 text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          {method === "credit_card" ? "Crédito" : "Débito"}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm text-muted-foreground">Nome no cartão</Label>
                      <Input {...form.register("cardHolderName")} placeholder="Como aparece no cartão" className="bg-background/60 border-border/60" />
                      {form.formState.errors.cardHolderName && (
                        <p className="text-xs text-destructive">{form.formState.errors.cardHolderName.message}</p>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-sm text-muted-foreground">Número do cartão</Label>
                      <Input
                        placeholder="0000 0000 0000 0000"
                        value={form.watch("cardNumber") ?? ""}
                        onChange={(e) => form.setValue("cardNumber", formatCardNumber(e.target.value))}
                        className="bg-background/60 border-border/60 font-mono"
                        maxLength={19}
                      />
                      {form.formState.errors.cardNumber && (
                        <p className="text-xs text-destructive">{form.formState.errors.cardNumber.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-sm text-muted-foreground">Mês</Label>
                        <Input {...form.register("expiryMonth")} placeholder="MM" maxLength={2} className="bg-background/60 border-border/60" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm text-muted-foreground">Ano</Label>
                        <Input {...form.register("expiryYear")} placeholder="AAAA" maxLength={4} className="bg-background/60 border-border/60" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm text-muted-foreground">CVV</Label>
                        <Input {...form.register("cvv")} placeholder="000" maxLength={4} className="bg-background/60 border-border/60" />
                      </div>
                    </div>

                    <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-800/30">
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        Este é um ambiente de demonstração. Nenhum pagamento real será processado.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button type="button" variant="outline" className="flex-1 rounded-full" onClick={() => setShowPaymentForm(false)}>
                        Voltar
                      </Button>
                      <Button type="submit" className="flex-1 rounded-full" disabled={subscribe.isPending}>
                        {subscribe.isPending ? "Processando..." : "Confirmar pagamento"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payment history */}
          {payments && payments.length > 0 && (
            <div className="mt-12">
              <h2 className="font-serif text-2xl font-medium text-foreground mb-6">Histórico de pagamentos</h2>
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/50">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-foreground">
                          {payment.cardBrand} •••• {payment.cardLastFour}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(payment.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">
                        R$ {Number(payment.amount).toFixed(2).replace(".", ",")}
                      </p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        payment.status === "completed"
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {payment.status === "completed" ? "Pago" : payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
