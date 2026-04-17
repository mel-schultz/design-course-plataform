import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, TrendingUp, DollarSign, Users } from "lucide-react";

export default function AdminPayments() {
  const { data, isLoading } = trpc.payments.listAll.useQuery({ limit: 50, offset: 0 });
  const { data: stats } = trpc.dashboard.stats.useQuery();

  const payments = data?.items ?? [];

  const statusMap: Record<string, { label: string; className: string }> = {
    completed: { label: "Pago", className: "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" },
    pending: { label: "Pendente", className: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400" },
    failed: { label: "Falhou", className: "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400" },
    refunded: { label: "Estornado", className: "bg-muted text-muted-foreground" },
  };

  const methodMap: Record<string, string> = {
    credit_card: "Crédito",
    debit_card: "Débito",
  };

  return (
    <AdminLayout title="Pagamentos" breadcrumb="Histórico de pagamentos da plataforma">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Receita total",
            value: `R$ ${Number(stats?.totalRevenue ?? 0).toFixed(2).replace(".", ",")}`,
            icon: DollarSign,
            color: "text-emerald-600",
            bg: "bg-emerald-50 dark:bg-emerald-950/20",
          },
          {
            label: "Assinaturas ativas",
            value: stats?.activeSubscriptions ?? 0,
            icon: TrendingUp,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Total de pagamentos",
            value: payments.length,
            icon: CreditCard,
            color: "text-rose-500",
            bg: "bg-rose-50 dark:bg-rose-950/20",
          },
          {
            label: "Alunos pagantes",
            value: new Set(payments.filter((p) => p.status === "completed").map((p) => p.userId)).size,
            icon: Users,
            color: "text-amber-600",
            bg: "bg-amber-50 dark:bg-amber-950/20",
          },
        ].map((metric) => (
          <Card key={metric.label} className="border-border/50 shadow-card gradient-card">
            <CardContent className="p-5">
              <div className={`w-9 h-9 rounded-xl ${metric.bg} flex items-center justify-center mb-3`}>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              <p className="font-serif text-2xl font-semibold text-foreground mb-1">{metric.value}</p>
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payments table */}
      <Card className="border-border/50 shadow-card">
        <CardContent className="p-6">
          <h2 className="font-serif text-lg font-medium text-foreground mb-4">Todos os pagamentos</h2>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Nenhum pagamento registrado</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">Usuário</th>
                    <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">Cartão</th>
                    <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">Método</th>
                    <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">Valor</th>
                    <th className="text-left py-2 pr-4 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-2 text-xs font-medium text-muted-foreground">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const status = statusMap[payment.status] ?? { label: payment.status, className: "bg-muted text-muted-foreground" };
                    return (
                      <tr key={payment.id} className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3 pr-4 text-foreground">
                          #{payment.userId}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {payment.cardBrand ?? "—"} •••• {payment.cardLastFour ?? "----"}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">
                          {methodMap[payment.paymentMethod ?? ""] ?? payment.paymentMethod ?? "—"}
                        </td>
                        <td className="py-3 pr-4 font-medium text-foreground">
                          R$ {Number(payment.amount).toFixed(2).replace(".", ",")}
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${status.className}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="py-3 text-muted-foreground text-xs">
                          {new Date(payment.createdAt).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
