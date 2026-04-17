import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BarChart3, Users, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function InstructorDashboard() {
  const { user, logout } = useAuth();
  const { data: courses, isLoading } = trpc.courses.getByInstructor.useQuery();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "UI/UX Design",
    level: "beginner" as const,
    price: 0,
  });

  const createCourseMutation = trpc.courses.create.useMutation();

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCourseMutation.mutateAsync(formData);
      setFormData({ title: "", description: "", category: "UI/UX Design", level: "beginner", price: 0 });
      setShowCreateForm(false);
      alert("Curso criado com sucesso!");
    } catch (error) {
      alert("Erro ao criar curso: " + (error as Error).message);
    }
  };

  const totalStudents = courses?.reduce((sum, c) => sum + (c.totalStudents || 0), 0) || 0;
  const totalRevenue = courses?.reduce((sum, c) => sum + parseFloat(c.price as any), 0) || 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-black flex items-center justify-between px-8 py-6">
        <Link href="/">
          <div className="text-2xl font-bold cursor-pointer">Design Academy</div>
        </Link>
        <div className="flex gap-4 items-center">
          <span className="text-sm">{user?.name}</span>
          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </div>
      </nav>

      <div className="px-8 py-12">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Painel do Instrutor</h1>
            <p className="text-gray-600">Gerencie seus cursos e acompanhe o desempenho</p>
          </div>
          <Button
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? "Cancelar" : "+ Novo Curso"}
          </Button>
        </div>

        {/* Create Course Form */}
        {showCreateForm && (
          <Card className="border-black mb-12">
            <CardHeader>
              <CardTitle>Criar Novo Curso</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Título</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-black px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Descrição</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-black px-3 py-2 h-24"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Categoria</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-black px-3 py-2"
                    >
                      <option>UI/UX Design</option>
                      <option>Graphic Design</option>
                      <option>Web Design</option>
                      <option>Motion Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Nível</label>
                    <select
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: e.target.value as any })}
                      className="w-full border border-black px-3 py-2"
                    >
                      <option value="beginner">Iniciante</option>
                      <option value="intermediate">Intermediário</option>
                      <option value="advanced">Avançado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Preço (R$)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full border border-black px-3 py-2"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white" disabled={createCourseMutation.isPending}>
                  {createCourseMutation.isPending ? "Criando..." : "Criar Curso"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12 border-b border-black pb-12">
          <Card className="border-black">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{courses?.length || 0}</div>
                  <div className="text-sm text-gray-600">Cursos Criados</div>
                </div>
                <BarChart3 className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-black">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{totalStudents}</div>
                  <div className="text-sm text-gray-600">Alunos Totais</div>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-black">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">R$ {totalRevenue.toFixed(2)}</div>
                  <div className="text-sm text-gray-600">Receita Total</div>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Meus Cursos</h2>
          <div className="h-1 w-12 bg-red-600 mb-6"></div>

          {isLoading ? (
            <div>Carregando...</div>
          ) : courses && courses.length > 0 ? (
            <div className="space-y-4">
              {courses.map((course) => (
                <Card key={course.id} className="border-black">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                        <div className="flex gap-6 text-sm text-gray-600">
                          <span>{course.totalStudents} alunos</span>
                          <span>R$ {course.price}</span>
                          <span>{course.isPublished ? "Publicado" : "Rascunho"}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/instructor/course/${course.id}/edit`}>
                          <Button variant="outline">Editar</Button>
                        </Link>
                        <Button variant="outline">Visualizar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-black">
              <CardContent className="pt-6 text-center text-gray-600">
                <p>Você ainda não criou nenhum curso.</p>
                <Button
                  className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => setShowCreateForm(true)}
                >
                  Criar Primeiro Curso
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
