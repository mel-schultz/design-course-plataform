import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Palette, Search, Clock, BookOpen } from "lucide-react";
import { Link } from "wouter";

const levels = [
  { value: undefined, label: "Todos" },
  { value: "beginner" as const, label: "Iniciante" },
  { value: "intermediate" as const, label: "Intermediário" },
  { value: "advanced" as const, label: "Avançado" },
];

const levelLabels: Record<string, { label: string; className: string }> = {
  beginner: { label: "Iniciante", className: "badge-beginner" },
  intermediate: { label: "Intermediário", className: "badge-intermediate" },
  advanced: { label: "Avançado", className: "badge-advanced" },
};

export default function CourseCatalog() {
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced" | undefined>(undefined);
  const [search, setSearch] = useState("");

  const { data, isLoading } = trpc.courses.list.useQuery({
    level: selectedLevel,
    search: search || undefined,
    limit: 50,
    offset: 0,
  });

  const courses = data?.items ?? [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10 relative">
            <div className="absolute left-0 top-0 bottom-0 w-px opacity-20"
              style={{ background: "linear-gradient(to bottom, transparent, var(--primary), transparent)" }} />
            <div className="pl-6">
              <h1 className="font-serif text-4xl md:text-5xl font-medium text-foreground mb-3">
                Catálogo de Cursos
              </h1>
              <p className="text-muted-foreground tracking-wide">
                Explore nossa coleção de cursos de design
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cursos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background/60 border-border/60"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {levels.map((lvl) => (
                <Button
                  key={lvl.label}
                  variant={selectedLevel === lvl.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel(lvl.value)}
                  className={`rounded-full text-xs px-4 ${selectedLevel === lvl.value ? "" : "bg-background/60"}`}
                >
                  {lvl.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border-border/50 animate-pulse">
                  <div className="aspect-video bg-muted rounded-t-lg" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-muted rounded mb-2 w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-20">
              <Palette className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum curso encontrado</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-6">
                {courses.length} {courses.length === 1 ? "curso encontrado" : "cursos encontrados"}
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {courses.map((course) => {
                  const lvl = levelLabels[course.level] ?? { label: course.level, className: "" };
                  return (
                    <Link key={course.id} href={`/cursos/${course.slug}`}>
                      <Card className="group border-border/50 shadow-card hover:shadow-soft transition-all duration-300 cursor-pointer overflow-hidden h-full">
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
                        <CardContent className="p-4 flex flex-col flex-1">
                          <h3 className="font-serif text-base font-medium text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-2">
                            {course.title}
                          </h3>
                          {course.shortDescription && (
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                              {course.shortDescription}
                            </p>
                          )}
                          <div className="flex items-center gap-4 mt-auto text-xs text-muted-foreground">
                            {course.totalLessons ? (
                              <span className="flex items-center gap-1">
                                <BookOpen className="w-3 h-3" /> {course.totalLessons} aulas
                              </span>
                            ) : null}
                            {course.totalDuration ? (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {course.totalDuration} min
                              </span>
                            ) : null}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
