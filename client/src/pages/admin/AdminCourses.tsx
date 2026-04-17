import AdminLayout from "@/components/AdminLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { Plus, Search, Edit, Trash2, Eye, BookOpen, Palette } from "lucide-react";
import { toast } from "sonner";

const levelLabels: Record<string, { label: string; className: string }> = {
  beginner: { label: "Iniciante", className: "badge-beginner" },
  intermediate: { label: "Intermediário", className: "badge-intermediate" },
  advanced: { label: "Avançado", className: "badge-advanced" },
};

export default function AdminCourses() {
  const [search, setSearch] = useState("");
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.courses.list.useQuery({
    search: search || undefined,
    limit: 50,
    offset: 0,
  });

  const deleteCourse = trpc.courses.delete.useMutation({
    onSuccess: () => {
      toast.success("Curso removido");
      utils.courses.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const togglePublish = trpc.courses.togglePublish.useMutation({
    onSuccess: () => utils.courses.list.invalidate(),
    onError: (e) => toast.error(e.message),
  });

  const courses = data?.items ?? [];

  return (
    <AdminLayout title="Cursos" breadcrumb="Gerenciar cursos da plataforma">
      <div className="flex items-center justify-between mb-6">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cursos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/60 border-border/60"
          />
        </div>
        <Link href="/admin/cursos/novo">
          <Button className="rounded-full gap-2">
            <Plus className="w-4 h-4" />
            Novo curso
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="border-border/50 animate-pulse">
              <CardContent className="p-4 flex gap-4">
                <div className="w-16 h-12 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-3 bg-muted rounded w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border/50 rounded-xl">
          <Palette className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">Nenhum curso cadastrado</p>
          <Link href="/admin/cursos/novo">
            <Button variant="outline" className="rounded-full gap-2">
              <Plus className="w-4 h-4" /> Criar primeiro curso
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => {
            const lvl = levelLabels[course.level] ?? { label: course.level, className: "" };
            return (
              <Card key={course.id} className="border-border/50 shadow-card hover:shadow-soft transition-all">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/20 shrink-0">
                    {course.thumbnailUrl ? (
                      <img src={course.thumbnailUrl} alt={course.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-foreground truncate">{course.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${lvl.className}`}>
                        {lvl.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {course.totalLessons ? <span>{course.totalLessons} aulas</span> : null}
                      <span className={`px-1.5 py-0.5 rounded text-xs ${
                        course.isPublished
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {course.isPublished ? "Publicado" : "Rascunho"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-foreground"
                      onClick={() => togglePublish.mutate({ id: course.id, isPublished: !course.isPublished })}
                      title={course.isPublished ? "Despublicar" : "Publicar"}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Link href={`/admin/cursos/${course.id}`}>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-muted-foreground hover:text-foreground">
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        if (confirm("Remover este curso?")) deleteCourse.mutate({ id: course.id });
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
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
