import { useRoute, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowLeft, Lock } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function LessonPlayer() {
  const [, params] = useRoute("/aula/:id");
  const [, navigate] = useLocation();
  const lessonId = Number(params?.id ?? 0);

  const { data, isLoading, error } = trpc.lessons.byId.useQuery(
    { id: lessonId },
    { enabled: !!lessonId }
  );

  const updateProgress = trpc.lessons.updateProgress.useMutation({
    onSuccess: (result) => {
      toast.success(`Aula concluída! Progresso do curso: ${result.progress}%`);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 container max-w-4xl mx-auto animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/2" />
          <div className="aspect-video bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 container max-w-2xl mx-auto text-center py-20">
          <Lock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="font-serif text-2xl font-medium text-foreground mb-2">Acesso restrito</h2>
          <p className="text-muted-foreground mb-6">
            {error?.message ?? "Você precisa de uma assinatura ativa para acessar este conteúdo."}
          </p>
          <Link href="/assinatura">
            <Button className="rounded-full">Ver planos de assinatura</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { lesson, progress } = data;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1 as any)}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar
          </button>

          <h1 className="font-serif text-2xl md:text-3xl font-medium text-foreground mb-6">
            {lesson.title}
          </h1>

          {/* Video Player */}
          {lesson.videoUrl && (
            <div className="aspect-video rounded-xl overflow-hidden bg-black mb-6">
              <iframe
                src={lesson.videoUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Content */}
          {lesson.content && (
            <div className="prose prose-sm max-w-none text-foreground mb-8">
              <div className="bg-card border border-border/50 rounded-xl p-6 leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {lesson.content}
              </div>
            </div>
          )}

          {/* Mark complete */}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center gap-2">
              {progress?.isCompleted ? (
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Aula concluída</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Marque como concluída ao terminar</span>
              )}
            </div>
            {!progress?.isCompleted && (
              <Button
                onClick={() =>
                  updateProgress.mutate({
                    lessonId: lesson.id,
                    courseId: lesson.courseId,
                    isCompleted: true,
                    watchedSeconds: lesson.duration ? lesson.duration * 60 : 0,
                  })
                }
                disabled={updateProgress.isPending}
                className="rounded-full gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Concluir aula
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
