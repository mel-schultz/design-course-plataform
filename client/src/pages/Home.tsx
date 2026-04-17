import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { ArrowRight, Palette, Layers, Pen, Star, CheckCircle2, Sparkles } from "lucide-react";

const levelLabels: Record<string, { label: string; className: string }> = {
  beginner: { label: "Iniciante", className: "badge-beginner" },
  intermediate: { label: "Intermediário", className: "badge-intermediate" },
  advanced: { label: "Avançado", className: "badge-advanced" },
};

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { data: featuredData } = trpc.courses.featured.useQuery();
  const { data: plans } = trpc.subscriptions.plans.useQuery();

  const featured = featuredData?.items ?? [];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-30"
            style={{ background: "radial-gradient(circle, oklch(0.88 0.06 285) 0%, transparent 70%)" }} />
          <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, oklch(0.90 0.05 10) 0%, transparent 70%)" }} />
          <div className="absolute bottom-0 left-1/2 w-[500px] h-[300px] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, oklch(0.88 0.06 165) 0%, transparent 70%)" }} />
        </div>

        {/* Decorative vertical lines */}
        <div className="absolute left-12 top-32 bottom-32 w-px opacity-20"
          style={{ background: "linear-gradient(to bottom, transparent, var(--primary), transparent)" }} />
        <div className="absolute right-12 top-32 bottom-32 w-px opacity-20"
          style={{ background: "linear-gradient(to bottom, transparent, var(--primary), transparent)" }} />

        <div className="container relative text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs tracking-widest uppercase text-primary font-medium">Plataforma de Design</span>
          </div>

          <h1 className="font-serif text-5xl md:text-7xl font-medium leading-tight mb-6 text-foreground">
            Eleve sua arte
            <br />
            <em className="text-gradient not-italic">ao próximo nível</em>
          </h1>

          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto font-light tracking-wide">
            Cursos de design cuidadosamente elaborados para iniciantes, intermediários e avançados.
            Aprenda com elegância, no seu ritmo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAuthenticated ? (
              <Link href="/minha-area">
                <Button size="lg" className="rounded-full px-8 gap-2 shadow-soft">
                  Ir para Minha Área <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/auth?mode=register">
                  <Button size="lg" className="rounded-full px-8 gap-2 shadow-soft">
                    Começar agora <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/cursos">
                  <Button variant="outline" size="lg" className="rounded-full px-8 bg-background/60">
                    Ver cursos
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
            {[
              { value: "50+", label: "Cursos" },
              { value: "3", label: "Níveis" },
              { value: "∞", label: "Acesso" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-3xl font-semibold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground tracking-widest uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 relative">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
              Uma experiência completa
            </h2>
            <p className="text-muted-foreground text-base tracking-wide max-w-xl mx-auto">
              Tudo que você precisa para evoluir no design, em um só lugar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Palette,
                title: "Design Gráfico",
                desc: "Fundamentos de composição, cor e tipografia para criar peças visuais impactantes.",
                color: "text-primary",
                bg: "bg-primary/8",
              },
              {
                icon: Layers,
                title: "UI & UX Design",
                desc: "Interfaces digitais centradas no usuário, do wireframe ao protótipo final.",
                color: "text-rose-500",
                bg: "bg-rose-50 dark:bg-rose-950/20",
              },
              {
                icon: Pen,
                title: "Ilustração Digital",
                desc: "Técnicas de ilustração vetorial e digital para dar vida às suas ideias.",
                color: "text-emerald-600",
                bg: "bg-emerald-50 dark:bg-emerald-950/20",
              },
            ].map((feature) => (
              <Card key={feature.title} className="border-border/50 shadow-card hover:shadow-soft transition-shadow duration-300 gradient-card corner-bracket">
                <CardContent className="p-6">
                  <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  </div>
                  <h3 className="font-serif text-lg font-medium text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      {featured.length > 0 && (
        <section className="py-20">
          <div className="container max-w-5xl mx-auto">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-2">
                  Cursos em destaque
                </h2>
                <p className="text-muted-foreground text-sm tracking-wide">Selecionados pelos nossos instrutores</p>
              </div>
              <Link href="/cursos">
                <Button variant="ghost" size="sm" className="gap-1 text-primary">
                  Ver todos <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featured.map((course) => {
                const lvl = levelLabels[course.level] ?? { label: course.level, className: "" };
                return (
                  <Link key={course.id} href={`/cursos/${course.slug}`}>
                    <Card className="group border-border/50 shadow-card hover:shadow-soft transition-all duration-300 cursor-pointer overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/30 relative overflow-hidden">
                        {course.thumbnailUrl ? (
                          <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Palette className="w-10 h-10 text-primary/30" />
                          </div>
                        )}
                        <div className="absolute top-3 left-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${lvl.className}`}>
                            {lvl.label}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-serif text-base font-medium text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                          {course.title}
                        </h3>
                        {course.shortDescription && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {course.shortDescription}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                          {course.totalLessons ? <span>{course.totalLessons} aulas</span> : null}
                          {course.totalDuration ? <span>{course.totalDuration} min</span> : null}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Pricing */}
      {plans && plans.length > 0 && (
        <section className="py-20">
          <div className="container max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
                Planos de assinatura
              </h2>
              <p className="text-muted-foreground text-base tracking-wide">
                Acesso ilimitado a todos os cursos
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan, i) => {
                const isPopular = i === 1;
                const features: string[] = plan.features ? JSON.parse(plan.features) : [];
                return (
                  <Card
                    key={plan.id}
                    className={`relative border-border/50 shadow-card overflow-hidden transition-all duration-300 hover:shadow-soft ${
                      isPopular ? "border-primary/40 shadow-soft" : ""
                    }`}
                  >
                    {isPopular && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
                    )}
                    <CardContent className="p-6">
                      {isPopular && (
                        <div className="flex items-center gap-1 mb-3">
                          <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                          <span className="text-xs text-primary font-medium tracking-wide">Mais popular</span>
                        </div>
                      )}
                      <h3 className="font-serif text-xl font-medium text-foreground mb-1">{plan.name}</h3>
                      <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
                      <div className="mb-6">
                        <span className="font-serif text-3xl font-semibold text-foreground">
                          R$ {Number(plan.price).toFixed(2).replace(".", ",")}
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">
                          /{plan.billingCycle === "monthly" ? "mês" : plan.billingCycle === "quarterly" ? "trimestre" : "ano"}
                        </span>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Link href={isAuthenticated ? "/assinatura" : "/auth?mode=register"}>
                        <Button
                          className={`w-full rounded-full ${isPopular ? "" : "variant-outline"}`}
                          variant={isPopular ? "default" : "outline"}
                        >
                          Assinar agora
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
                <Palette className="w-3 h-3 text-primary" />
              </div>
              <span className="font-serif text-sm text-foreground">DesignHub</span>
            </div>
            <p className="text-xs text-muted-foreground tracking-wide">
              © {new Date().getFullYear()} DesignHub. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <Link href="/cursos" className="hover:text-foreground transition-colors">Cursos</Link>
              <Link href="/auth" className="hover:text-foreground transition-colors">Entrar</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
