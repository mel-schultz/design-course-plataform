import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Star } from "lucide-react";
import { Link } from "wouter";

export default function Courses() {
  const [filters, setFilters] = useState<{
    category?: string;
    level?: "beginner" | "intermediate" | "advanced";
    search?: string;
  }>({
    category: "",
    level: undefined,
    search: "",
  });

  const { data: courses, isLoading } = trpc.courses.list.useQuery(filters);

  const categories = ["UI/UX Design", "Graphic Design", "Web Design", "Motion Design"];
  const levels = ["beginner", "intermediate", "advanced"];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-black flex items-center justify-between px-8 py-6">
        <Link href="/">
          <div className="text-2xl font-bold cursor-pointer">Design Academy</div>
        </Link>
        <div className="flex gap-4">
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </nav>

      <div className="px-8 py-12">
        <h1 className="text-4xl font-bold mb-12">Catálogo de Cursos</h1>

        <div className="grid grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="border-r border-black pr-8">
            <h3 className="font-bold mb-6 text-lg">Filtros</h3>

            {/* Search */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-2">Buscar</label>
              <input
                type="text"
                placeholder="Nome do curso..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full border border-black px-3 py-2 text-sm"
              />
            </div>

            {/* Category Filter */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">Categoria</label>
              <div className="space-y-2">
                <button
                  onClick={() => setFilters({ ...filters, category: "" })}
                  className={`block text-sm ${filters.category === "" ? "font-bold" : ""}`}
                >
                  Todas
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilters({ ...filters, category: cat })}
                    className={`block text-sm ${filters.category === cat ? "font-bold" : ""}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">Nível</label>
              <div className="space-y-2">
                <button
                  onClick={() => setFilters({ ...filters, level: undefined })}
                  className={`block text-sm ${filters.level === undefined ? "font-bold" : ""}`}
                >
                  Todos
                </button>
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilters({ ...filters, level: level as "beginner" | "intermediate" | "advanced" })}
                    className={`block text-sm ${filters.level === level ? "font-bold" : ""}`}
                  >
                    {level === "beginner" ? "Iniciante" : level === "intermediate" ? "Intermediário" : "Avançado"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="col-span-3">
            {isLoading ? (
              <div>Carregando cursos...</div>
            ) : courses && courses.length > 0 ? (
              <div className="grid grid-cols-3 gap-8">
                {courses.map((course) => (
                  <Link key={course.id} href={`/courses/${course.id}`}>
                    <Card className="border-black cursor-pointer hover:shadow-lg transition-shadow h-full">
                      <CardHeader className="pb-3">
                        <div className="h-40 bg-gray-200 mb-4"></div>
                        <CardTitle className="text-lg">{course.title}</CardTitle>
                        <CardDescription>{course.category}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400" />
                            <span className="text-sm font-semibold">{course.rating}</span>
                          </div>
                          <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {course.level === "beginner" ? "Iniciante" : course.level === "intermediate" ? "Intermediário" : "Avançado"}
                          </div>
                        </div>
                        <div className="text-lg font-bold">
                          {course.price === "0" ? "Grátis" : `R$ ${course.price}`}
                        </div>
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                          Ver Curso
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Nenhum curso encontrado com os filtros selecionados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
