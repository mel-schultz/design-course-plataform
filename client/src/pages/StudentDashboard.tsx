import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { BookOpen, Award, Clock } from "lucide-react";
import { Link } from "wouter";

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { data: enrollments, isLoading } = trpc.enrollments.getStudentCourses.useQuery();

  const completedCourses = enrollments?.filter(e => e.progress === "100") || [];
  const inProgressCourses = enrollments?.filter(e => e.progress !== "100") || [];

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
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Bem-vindo, {user?.name}!</h1>
          <p className="text-gray-600">Acompanhe seu progresso nos cursos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-12 border-b border-black pb-12">
          <Card className="border-black">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{enrollments?.length || 0}</div>
                  <div className="text-sm text-gray-600">Cursos Matriculado</div>
                </div>
                <BookOpen className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-black">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{inProgressCourses.length}</div>
                  <div className="text-sm text-gray-600">Em Progresso</div>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-black">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">{completedCourses.length}</div>
                  <div className="text-sm text-gray-600">Concluídos</div>
                </div>
                <Award className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-black">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-3xl font-bold">
                    {enrollments && enrollments.length > 0
                      ? Math.round(
                          enrollments.reduce((sum, e) => sum + parseFloat(e.progress as any), 0) /
                            enrollments.length
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-sm text-gray-600">Progresso Médio</div>
                </div>
                <div className="text-2xl">📊</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Sections */}
        <div className="grid grid-cols-2 gap-12">
          {/* In Progress */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Cursos em Progresso</h2>
            <div className="h-1 w-12 bg-red-600 mb-6"></div>

            {isLoading ? (
              <div>Carregando...</div>
            ) : inProgressCourses.length > 0 ? (
              <div className="space-y-4">
                {inProgressCourses.map((enrollment) => (
                  <Card key={enrollment.id} className="border-black">
                    <CardContent className="pt-6">
                      <div className="mb-3">
                        <div className="font-semibold mb-2">Curso #{enrollment.courseId}</div>
                        <div className="w-full bg-gray-200 h-2 rounded">
                          <div
                            className="bg-red-600 h-2 rounded"
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{enrollment.progress}% completo</div>
                      </div>
                      <Link href={`/student/course/${enrollment.courseId}`}>
                        <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                          Continuar
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-black">
                <CardContent className="pt-6 text-center text-gray-600">
                  <p>Você ainda não iniciou nenhum curso.</p>
                  <Link href="/courses">
                    <Button className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                      Explorar Cursos
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Completed */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Cursos Concluídos</h2>
            <div className="h-1 w-12 bg-green-600 mb-6"></div>

            {completedCourses.length > 0 ? (
              <div className="space-y-4">
                {completedCourses.map((enrollment) => (
                  <Card key={enrollment.id} className="border-black">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-semibold">Curso #{enrollment.courseId}</div>
                        <Award className="w-5 h-5 text-green-600" />
                      </div>
                      {enrollment.certificateUrl && (
                        <a href={enrollment.certificateUrl} target="_blank" rel="noopener noreferrer">
                          <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                            Baixar Certificado
                          </Button>
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-black">
                <CardContent className="pt-6 text-center text-gray-600">
                  <p>Você ainda não concluiu nenhum curso.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
