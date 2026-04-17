import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Users, BookOpen, CreditCard, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();
  const { data: paymentsData } = trpc.payments.listAll.useQuery({ limit: 10, offset: 0 });

  const metrics = [
    {
      label: "Alunos cadastrados",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Cursos publicados",
      value: stats?.totalCourses ?? 0,
      icon: BookOpen,
      color: "text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/20",
    },
    {
      label: "Assinaturas ativas",
      value: stats?.activeSubscriptions ?? 0,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/20",
    },
    {
      label: "Receita total",
      value: `R$ ${Number(stats?.totalRevenue ?? 0).toFixed(2).replace(".", ",")}`,
      icon: CreditCard,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/20",
    },
  ];

  // Build chart data from recent payments
  const chartData = paymentsData?.items
    .filter((p) => p.status === "completed")
    .slice(0, 7)
    .map((p) => ({
      date: new Date(p.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
      valor: Number(p.amount),
    }))
    .reverse() ?? [];

  return (
    <AdminLayout title="Dashboard" breadcrumb="Visão geral da plataforma">
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-border/50 shadow-card gradient-card">
            <CardContent className="p-5">
              <div className={`w-9 h-9 rounded-xl ${metric.bg} flex items-center justify-center mb-3`}>
                <metric.icon className={`w-4 h-4 ${metric.color}`} />
              </div>
              {isLoading ? (
                <div className="h-7 bg-muted rounded animate-pulse mb-1 w-16" />
              ) : (
                <p className="font-serif text-2xl font-semibold text-foreground mb-1">{metric.value}</p>
              )}
              <p className="text-xs text-muted-foreground">{metric.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <Card className="border-border/50 shadow-card mb-8">
          <CardContent className="p-6">
            <h2 className="font-serif text-lg font-medium text-foreground mb-6">Receita recente</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `R$${v}`} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  formatter={(v: number) => [`R$ ${v.toFixed(2)}`, "Valor"]}
                />
                <Bar dataKey="valor" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Recent payments */}
      <Card className="border-border/50 shadow-card">
        <CardContent className="p-6">
          <h2 className="font-serif text-lg font-medium text-foreground mb-4">Pagamentos recentes</h2>
          {!paymentsData?.items.length ? (
            <p className="text-sm text-muted-foreground">Nenhum pagamento registrado</p>
          ) : (
            <div className="space-y-3">
              {paymentsData.items.slice(0, 5).map((payment) => (
                <div key={payment.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <CreditCard className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-foreground">
                        {payment.cardBrand ?? "Cartão"} •••• {payment.cardLastFour ?? "----"}
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
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
