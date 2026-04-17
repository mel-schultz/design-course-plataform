import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";
import { Clock, BookOpen, Lock, Play, CheckCircle2, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const levelLabels: Record<string, { label: string; className: string }> = {
  beginner: { label: "Iniciante", className: "badge-beginner" },
  intermediate: { label: "Intermediário", className: "badge-intermediate" },
  advanced: { label: "Avançado", className: "badge-advanced" },
};

export default function CourseDetail() {
  const [, params] = useRoute("/cursos/:slug");
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();
  const slug = params?.slug ?? "";

  const { data, isLoading } = trpc.courses.bySlug.useQuery({ slug }, { enabled: !!slug });
  const { data: accessData } = trpc.enrollments.checkAccess.useQuery(
    { courseId: data?.course.id ?? 0 },
    { enabled: !!data?.course.id && isAuthenticated }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 container max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-2/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="aspect-video bg-muted rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 container text-center">
          <p className="text-muted-foreground">Curso não encontrado</p>
          <Link href="/cursos"><Button className="mt-4">Ver catálogo</Button></Link>
        </div>
      </div>
    );
  }

  const { course, lessons } = data;
  const lvl = levelLabels[course.level] ?? { label: course.level, className: "" };
  const hasAccess = accessData?.hasAccess ?? false;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-4xl mx-auto">
          <Link href="/cursos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao catálogo
          </Link>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="md:col-span-2">
              {/* Thumbnail */}
              <div className="aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/30 mb-6">
                {course.thumbnailUrl ? (
                  <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-primary/20" />
                  </div>
                )}
              </div>

              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${lvl.className} inline-block mb-4`}>
                {lvl.label}
              </span>

              <h1 className="font-serif text-3xl md:text-4xl font-medium text-foreground mb-4">
                {course.title}
              </h1>

              {course.description && (
                <p className="text-muted-foreground leading-relaxed mb-6 tracking-wide">
                  {course.description}
                </p>
              )}

              <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                {course.totalLessons ? (
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" /> {course.totalLessons} aulas
                  </span>
                ) : null}
                {course.totalDuration ? (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {course.totalDuration} min
                  </span>
                ) : null}
              </div>

              {/* Lessons list */}
              <h2 className="font-serif text-xl font-medium text-foreground mb-4">Conteúdo do curso</h2>
              <div className="space-y-2">
                {lessons.map((lesson, i) => {
                  const canAccess = lesson.isFree || hasAccess;
                  return (
                    <div
                      key={lesson.id}
                      onClick={() => canAccess && navigate(`/aula/${lesson.id}`)}
                      className={`flex items-center gap-3 p-3 rounded-lg border border-border/40 transition-all ${
                        canAccess ? "hover:border-primary/30 hover:bg-primary/5 cursor-pointer" : "opacity-60"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                        canAccess ? "bg-primary/10" : "bg-muted"
                      }`}>
                        {canAccess ? (
                          <Play className="w-3 h-3 text-primary" />
                        ) : (
                          <Lock className="w-3 h-3 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{lesson.title}</p>
                        {lesson.duration ? (
                          <p className="text-xs text-muted-foreground">{lesson.duration} min</p>
                        ) : null}
                      </div>
                      {lesson.isFree && (
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                          Grátis
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <Card className="border-border/50 shadow-soft gradient-card sticky top-24">
                <CardContent className="p-6">
                  {hasAccess ? (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        <span className="text-sm font-medium text-foreground">Você tem acesso</span>
                      </div>
                      {lessons[0] && (
                        <Link href={`/aula/${lessons[0].id}`}>
                          <Button className="w-full rounded-full gap-2">
                            <Play className="w-4 h-4" /> Iniciar curso
                          </Button>
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Requer assinatura</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                        Assine um plano para ter acesso ilimitado a este e todos os outros cursos.
                      </p>
                      <Link href={isAuthenticated ? "/assinatura" : "/auth?mode=register"}>
                        <Button className="w-full rounded-full">
                          {isAuthenticated ? "Ver planos" : "Cadastrar e assinar"}
                        </Button>
                      </Link>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
