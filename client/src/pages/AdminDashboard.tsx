import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Users, BookOpen, TrendingUp, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { data: courses } = trpc.courses.list.useQuery({});
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "courses">("overview");

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
          <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta página.</p>
          <Link href="/">
            <Button>Voltar para Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalCourses = courses?.length || 0;
  const publishedCourses = courses?.filter(c => c.isPublished).length || 0;
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
          <span className="text-sm font-semibold">Admin: {user?.name}</span>
          <Button variant="outline" onClick={logout}>
            Sair
          </Button>
        </div>
      </nav>

      <div className="px-8 py-12">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-12">Painel Administrativo</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-12 border-b border-black pb-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`font-semibold pb-2 border-b-2 ${
              activeTab === "overview" ? "border-red-600" : "border-transparent"
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`font-semibold pb-2 border-b-2 ${
              activeTab === "users" ? "border-red-600" : "border-transparent"
            }`}
          >
            Usuários
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            className={`font-semibold pb-2 border-b-2 ${
              activeTab === "courses" ? "border-red-600" : "border-transparent"
            }`}
          >
            Cursos
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6 mb-12">
              <Card className="border-black">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">{totalCourses}</div>
                      <div className="text-sm text-gray-600">Cursos Totais</div>
                    </div>
                    <BookOpen className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-black">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">{publishedCourses}</div>
                      <div className="text-sm text-gray-600">Publicados</div>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-600" />
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
                    <TrendingUp className="w-8 h-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-black">
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div>
                      <div className="font-semibold">Novo curso criado</div>
                      <div className="text-sm text-gray-600">Há 2 horas</div>
                    </div>
                    <div className="text-sm">UI/UX Design Avançado</div>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                    <div>
                      <div className="font-semibold">Novo aluno matriculado</div>
                      <div className="text-sm text-gray-600">Há 5 horas</div>
                    </div>
                    <div className="text-sm">João Silva</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Curso publicado</div>
                      <div className="text-sm text-gray-600">Há 1 dia</div>
                    </div>
                    <div className="text-sm">Motion Design Essencial</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <Card className="border-black">
            <CardHeader>
              <CardTitle>Gestão de Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-black">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Nome</th>
                      <th className="text-left py-3 px-4 font-semibold">E-mail</th>
                      <th className="text-left py-3 px-4 font-semibold">Papel</th>
                      <th className="text-left py-3 px-4 font-semibold">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4">João Silva</td>
                      <td className="py-3 px-4">joao@example.com</td>
                      <td className="py-3 px-4">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Aluno</span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">Editar</Button>
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-4">Maria Santos</td>
                      <td className="py-3 px-4">maria@example.com</td>
                      <td className="py-3 px-4">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Instrutor</span>
                      </td>
                      <td className="py-3 px-4">
                        <Button variant="outline" size="sm">Editar</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            {courses && courses.length > 0 ? (
              courses.map((course) => (
                <Card key={course.id} className="border-black">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                        <div className="flex gap-6 text-sm text-gray-600">
                          <span>{course.totalStudents} alunos</span>
                          <span>R$ {course.price}</span>
                          <span>
                            {course.isPublished ? (
                              <span className="text-green-600">✓ Publicado</span>
                            ) : (
                              <span className="text-gray-600">Rascunho</span>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline">Editar</Button>
                        <Button variant="outline">Deletar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-black">
                <CardContent className="pt-6 text-center text-gray-600">
                  <p>Nenhum curso encontrado.</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
