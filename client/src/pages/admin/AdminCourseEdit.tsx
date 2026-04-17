import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
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
import { Plus, Trash2, GripVertical, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

const courseSchema = z.object({
  title: z.string().min(3, "Título deve ter ao menos 3 caracteres"),
  slug: z.string().min(3, "Slug inválido").regex(/^[a-z0-9-]+$/, "Slug deve conter apenas letras minúsculas, números e hífens"),
  shortDescription: z.string().max(500).optional(),
  description: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  thumbnailUrl: z.string().url("URL inválida").optional().or(z.literal("")),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

type CourseForm = z.infer<typeof courseSchema>;

const lessonSchema = z.object({
  title: z.string().min(2),
  content: z.string().optional(),
  videoUrl: z.string().url().optional().or(z.literal("")),
  duration: z.number().min(0).optional(),
  isFree: z.boolean().default(false),
  order: z.number().default(0),
});

type LessonForm = z.infer<typeof lessonSchema>;

export default function AdminCourseEdit() {
  const [, matchEdit] = useRoute("/admin/cursos/:id");
  const [, navigate] = useLocation();
  const courseId = matchEdit?.id && matchEdit.id !== "novo" ? Number(matchEdit.id) : null;
  const isNew = !courseId;

  const [showLessonForm, setShowLessonForm] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);

  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.courses.byId.useQuery(
    { id: courseId! },
    { enabled: !!courseId }
  );

  const courseForm = useForm<CourseForm, unknown, CourseForm>({
    resolver: zodResolver(courseSchema) as import("react-hook-form").Resolver<CourseForm>,
    defaultValues: { level: "beginner", isPublished: false, isFeatured: false },
  });

  const lessonForm = useForm<LessonForm, unknown, LessonForm>({
    resolver: zodResolver(lessonSchema) as import("react-hook-form").Resolver<LessonForm>,
    defaultValues: { isFree: false, order: 0 },
  });

  useEffect(() => {
    if (data?.course) {
      courseForm.reset({
        title: data.course.title,
        slug: data.course.slug,
        shortDescription: data.course.shortDescription ?? "",
        description: data.course.description ?? "",
        level: data.course.level as "beginner" | "intermediate" | "advanced",
        thumbnailUrl: data.course.thumbnailUrl ?? "",
        isPublished: data.course.isPublished ?? false,
        isFeatured: data.course.isFeatured ?? false,
      });
    }
  }, [data]);

  const createCourse = trpc.courses.create.useMutation({
    onSuccess: (result) => {
      toast.success("Curso criado!");
      navigate(`/admin/cursos/${result.id}`);
    },
    onError: (e) => toast.error(e.message),
  });

  const updateCourse = trpc.courses.update.useMutation({
    onSuccess: () => {
      toast.success("Curso atualizado!");
      utils.courses.byId.invalidate({ id: courseId! });
    },
    onError: (e) => toast.error(e.message),
  });

  const createLesson = trpc.lessons.create.useMutation({
    onSuccess: () => {
      toast.success("Aula adicionada!");
      setShowLessonForm(false);
      lessonForm.reset();
      utils.courses.byId.invalidate({ id: courseId! });
    },
    onError: (e) => toast.error(e.message),
  });

  const updateLesson = trpc.lessons.update.useMutation({
    onSuccess: () => {
      toast.success("Aula atualizada!");
      setEditingLessonId(null);
      setShowLessonForm(false);
      lessonForm.reset();
      utils.courses.byId.invalidate({ id: courseId! });
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteLesson = trpc.lessons.delete.useMutation({
    onSuccess: () => {
      toast.success("Aula removida!");
      utils.courses.byId.invalidate({ id: courseId! });
    },
    onError: (e) => toast.error(e.message),
  });

  const onSubmitCourse = (d: CourseForm) => {
    const payload = { ...d, thumbnailUrl: d.thumbnailUrl || null };
    if (isNew) {
      createCourse.mutate(payload);
    } else {
      updateCourse.mutate({ id: courseId!, ...payload });
    }
  };

  const onSubmitLesson = (d: LessonForm) => {
    const payload = { ...d, videoUrl: d.videoUrl || undefined };
    if (editingLessonId) {
      updateLesson.mutate({ id: editingLessonId, ...payload });
    } else {
      createLesson.mutate({ courseId: courseId!, ...payload });
    }
  };

  const startEditLesson = (lesson: NonNullable<typeof data>["lessons"][0]) => {
    setEditingLessonId(lesson.id);
    lessonForm.reset({
      title: lesson.title,
      content: lesson.content ?? "",
      videoUrl: lesson.videoUrl ?? "",
      duration: lesson.duration ?? 0,
      isFree: lesson.isFree ?? false,
      order: lesson.sortOrder ?? 0,
    });
    setShowLessonForm(true);
  };

  const title = isNew ? "Novo Curso" : "Editar Curso";

  return (
    <AdminLayout title={title} breadcrumb={isNew ? "Criar novo curso" : data?.course.title}>
      <Link href="/admin/cursos" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" />
        Voltar aos cursos
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Course form */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 shadow-card">
            <CardContent className="p-6">
              <h2 className="font-serif text-lg font-medium text-foreground mb-6">Informações do curso</h2>
              <form onSubmit={courseForm.handleSubmit(onSubmitCourse)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-sm text-muted-foreground">Título</Label>
                    <Input
                      {...courseForm.register("title")}
                      placeholder="Ex: Fundamentos do Design Gráfico"
                      className="bg-background/60 border-border/60"
                      onChange={(e) => {
                        courseForm.setValue("title", e.target.value);
                        if (isNew) {
                          const slug = e.target.value.toLowerCase()
                            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                            .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-");
                          courseForm.setValue("slug", slug);
                        }
                      }}
                    />
                    {courseForm.formState.errors.title && (
                      <p className="text-xs text-destructive">{courseForm.formState.errors.title.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm text-muted-foreground">Slug (URL)</Label>
                    <Input {...courseForm.register("slug")} placeholder="fundamentos-design-grafico" className="bg-background/60 border-border/60 font-mono text-sm" />
                    {courseForm.formState.errors.slug && (
                      <p className="text-xs text-destructive">{courseForm.formState.errors.slug.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm text-muted-foreground">Nível</Label>
                    <select
                      {...courseForm.register("level")}
                      className="w-full h-9 px-3 rounded-md border border-border/60 bg-background/60 text-sm text-foreground"
                    >
                      <option value="beginner">Iniciante</option>
                      <option value="intermediate">Intermediário</option>
                      <option value="advanced">Avançado</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-sm text-muted-foreground">Descrição curta</Label>
                    <Input {...courseForm.register("shortDescription")} placeholder="Resumo em até 500 caracteres" className="bg-background/60 border-border/60" />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-sm text-muted-foreground">Descrição completa</Label>
                    <Textarea {...courseForm.register("description")} rows={4} placeholder="Descreva o conteúdo do curso..." className="bg-background/60 border-border/60 resize-none" />
                  </div>

                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-sm text-muted-foreground">URL da thumbnail</Label>
                    <Input {...courseForm.register("thumbnailUrl")} placeholder="https://..." className="bg-background/60 border-border/60" />
                    {courseForm.formState.errors.thumbnailUrl && (
                      <p className="text-xs text-destructive">{courseForm.formState.errors.thumbnailUrl.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={courseForm.watch("isPublished")}
                      onCheckedChange={(v) => courseForm.setValue("isPublished", v)}
                      id="isPublished"
                    />
                    <Label htmlFor="isPublished" className="text-sm text-muted-foreground cursor-pointer">Publicado</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={courseForm.watch("isFeatured")}
                      onCheckedChange={(v) => courseForm.setValue("isFeatured", v)}
                      id="isFeatured"
                    />
                    <Label htmlFor="isFeatured" className="text-sm text-muted-foreground cursor-pointer">Destaque</Label>
                  </div>
                </div>

                <Button type="submit" className="rounded-full" disabled={createCourse.isPending || updateCourse.isPending}>
                  {createCourse.isPending || updateCourse.isPending ? "Salvando..." : isNew ? "Criar curso" : "Salvar alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Lessons */}
          {!isNew && (
            <Card className="border-border/50 shadow-card mt-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-lg font-medium text-foreground">Aulas</h2>
                  <Button
                    size="sm"
                    className="rounded-full gap-1"
                    onClick={() => { setEditingLessonId(null); lessonForm.reset(); setShowLessonForm(!showLessonForm); }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Adicionar aula
                  </Button>
                </div>

                {/* Lesson form */}
                {showLessonForm && (
                  <Card className="border-primary/20 bg-primary/5 mb-4">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-medium text-foreground mb-4">
                        {editingLessonId ? "Editar aula" : "Nova aula"}
                      </h3>
                      <form onSubmit={lessonForm.handleSubmit(onSubmitLesson)} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1 col-span-2">
                            <Label className="text-xs text-muted-foreground">Título da aula</Label>
                            <Input {...lessonForm.register("title")} placeholder="Ex: Introdução ao Design" className="bg-background border-border/60 h-8 text-sm" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">URL do vídeo</Label>
                            <Input {...lessonForm.register("videoUrl")} placeholder="https://..." className="bg-background border-border/60 h-8 text-sm" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Duração (min)</Label>
                            <Input
                              type="number"
                              {...lessonForm.register("duration", { valueAsNumber: true })}
                              placeholder="0"
                              className="bg-background border-border/60 h-8 text-sm"
                            />
                          </div>
                          <div className="space-y-1 col-span-2">
                            <Label className="text-xs text-muted-foreground">Conteúdo / Transcrição</Label>
                            <Textarea {...lessonForm.register("content")} rows={3} placeholder="Conteúdo da aula..." className="bg-background border-border/60 text-sm resize-none" />
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={lessonForm.watch("isFree")}
                              onCheckedChange={(v) => lessonForm.setValue("isFree", v)}
                              id="isFree"
                            />
                            <Label htmlFor="isFree" className="text-xs text-muted-foreground cursor-pointer">Aula gratuita</Label>
                          </div>
                          <div className="flex gap-2 ml-auto">
                            <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => { setShowLessonForm(false); setEditingLessonId(null); }}>
                              Cancelar
                            </Button>
                            <Button type="submit" size="sm" className="h-7 text-xs rounded-full" disabled={createLesson.isPending || updateLesson.isPending}>
                              {editingLessonId ? "Salvar" : "Adicionar"}
                            </Button>
                          </div>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Lessons list */}
                {isLoading ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : !data?.lessons.length ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhuma aula adicionada</p>
                ) : (
                  <div className="space-y-2">
                    {data.lessons.map((lesson, i) => (
                      <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/40 hover:border-primary/20 transition-colors group">
                        <GripVertical className="w-4 h-4 text-muted-foreground/40 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate">{i + 1}. {lesson.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {lesson.duration ? <span>{lesson.duration} min</span> : null}
                            {lesson.isFree && <span className="text-emerald-600 dark:text-emerald-400">Grátis</span>}
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="w-7 h-7 text-muted-foreground hover:text-foreground" onClick={() => startEditLesson(lesson)}>
                            <span className="text-xs">✏️</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-7 h-7 text-muted-foreground hover:text-destructive"
                            onClick={() => { if (confirm("Remover aula?")) deleteLesson.mutate({ id: lesson.id }); }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar preview */}
        <div className="lg:col-span-1">
          <Card className="border-border/50 shadow-card sticky top-20">
            <CardContent className="p-5">
              <h3 className="font-serif text-base font-medium text-foreground mb-4">Preview</h3>
              <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/20 mb-3">
                {courseForm.watch("thumbnailUrl") ? (
                  <img src={courseForm.watch("thumbnailUrl")} alt="thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/30 text-xs">
                    Sem imagem
                  </div>
                )}
              </div>
              <p className="font-serif text-sm font-medium text-foreground line-clamp-2">
                {courseForm.watch("title") || "Título do curso"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {courseForm.watch("shortDescription") || "Descrição curta"}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  courseForm.watch("level") === "beginner" ? "badge-beginner" :
                  courseForm.watch("level") === "intermediate" ? "badge-intermediate" : "badge-advanced"
                }`}>
                  {courseForm.watch("level") === "beginner" ? "Iniciante" :
                   courseForm.watch("level") === "intermediate" ? "Intermediário" : "Avançado"}
                </span>
                {courseForm.watch("isPublished") && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                    Publicado
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
