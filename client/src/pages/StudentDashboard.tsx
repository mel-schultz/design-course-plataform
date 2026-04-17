import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Play, Clock, AlertCircle, Sparkles } from "lucide-react";

export default function StudentDashboard() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate("/auth?mode=login");
  }, [isAuthenticated, loading]);

  const { data: enrollments, isLoading: loadingEnrollments } = trpc.enrollments.myCourses.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const { data: subscription } = trpc.subscriptions.mySubscription.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (loading || !isAuthenticated) return null;

  const hasSubscription = subscription?.subscription?.status === "active";

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-serif text-4xl font-medium text-foreground mb-2">Minha Área</h1>
            <p className="text-muted-foreground tracking-wide">Continue de onde parou</p>
          </div>

          {/* Subscription status */}
          {!hasSubscription && (
            <Card className="border-amber-200/50 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/10 mb-8">
              <CardContent className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Sem assinatura ativa</p>
                    <p className="text-xs text-muted-foreground">Assine um plano para acessar todos os cursos</p>
                  </div>
                </div>
                <Link href="/assinatura">
                  <Button size="sm" className="rounded-full shrink-0">Ver planos</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {hasSubscription && (
            <Card className="border-emerald-200/50 dark:border-emerald-800/30 bg-emerald-50/50 dark:bg-emerald-950/10 mb-8">
              <CardContent className="p-4 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Plano {subscription?.plan?.name} ativo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Válido até {subscription?.subscription?.endDate
                      ? new Date(subscription.subscription.endDate).toLocaleDateString("pt-BR")
                      : "—"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enrolled courses */}
          <h2 className="font-serif text-2xl font-medium text-foreground mb-6">Meus cursos</h2>

          {loadingEnrollments ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse border-border/50">
                  <CardContent className="p-4 flex gap-4">
                    <div className="w-20 h-16 bg-muted rounded-lg shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !enrollments || enrollments.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-border/50 rounded-xl">
              <BookOpen className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">Você ainda não está matriculado em nenhum curso</p>
              <Link href="/cursos">
                <Button variant="outline" className="rounded-full">Explorar cursos</Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {enrollments.map(({ enrollment, course }) => (
                <Link key={enrollment.id} href={`/cursos/${course.slug}`}>
                  <Card className="group border-border/50 shadow-card hover:shadow-soft transition-all duration-300 cursor-pointer">
                    <CardContent className="p-4 flex gap-4">
                      <div className="w-20 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/20 shrink-0">
                        {course.thumbnailUrl ? (
                          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-primary/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                          {course.totalLessons ? (
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" /> {course.totalLessons} aulas
                            </span>
                          ) : null}
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={enrollment.progress ?? 0} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground shrink-0">
                            {enrollment.progress ?? 0}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Quick links */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { href: "/cursos", icon: BookOpen, label: "Catálogo" },
              { href: "/assinatura", icon: Sparkles, label: "Assinatura" },
              { href: "/perfil", icon: Clock, label: "Perfil" },
            ].map((item) => (
              <Link key={item.href} href={item.href}>
                <Card className="border-border/50 hover:border-primary/30 hover:shadow-card transition-all cursor-pointer">
                  <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                    <item.icon className="w-5 h-5 text-primary" />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
