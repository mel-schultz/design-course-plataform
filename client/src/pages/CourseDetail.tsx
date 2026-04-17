import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Star, Users, Clock, Award } from "lucide-react";
import { Link } from "wouter";

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id || "0");
  
  const { user, isAuthenticated } = useAuth();
  const { data: course, isLoading } = trpc.courses.getById.useQuery(courseId);
  const { data: modules } = trpc.modules.getByCourse.useQuery(courseId);
  const enrollMutation = trpc.enrollments.enroll.useMutation();

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para se matricular");
      return;
    }
    try {
      await enrollMutation.mutateAsync(courseId);
      alert("Matrícula realizada com sucesso!");
    } catch (error) {
      alert("Erro ao se matricular: " + (error as Error).message);
    }
  };

  if (isLoading) return <div className="p-8">Carregando...</div>;
  if (!course) return <div className="p-8">Curso não encontrado</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-black flex items-center justify-between px-8 py-6">
        <Link href="/">
          <div className="text-2xl font-bold cursor-pointer">Design Academy</div>
        </Link>
        <div className="flex gap-4">
          <Link href="/courses">
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-12 grid grid-cols-2 gap-12 border-b border-black">
        <div className="bg-gray-200 h-96"></div>
        <div className="flex flex-col justify-center">
          <div className="mb-4">
            <span className="text-sm font-semibold text-gray-600">{course.category}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400" />
              <span className="font-semibold">{course.rating}</span>
            </div>
            <span className="text-gray-600">({course.totalStudents} alunos)</span>
          </div>

          <p className="text-lg text-gray-700 mb-8">{course.description}</p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5" />
              <span>Acesso vitalício</span>
            </div>
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5" />
              <span>Certificado de conclusão</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" />
              <span>{course.totalStudents} alunos matriculados</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-4xl font-bold">
              {course.price === "0" ? "Grátis" : `R$ ${course.price}`}
            </div>
            <Button 
              size="lg" 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleEnroll}
              disabled={enrollMutation.isPending}
            >
              {enrollMutation.isPending ? "Matriculando..." : "Matricular-se"}
            </Button>
          </div>
        </div>
      </section>

      {/* Curriculum Section */}
      <section className="px-8 py-12 border-b border-black">
        <h2 className="text-3xl font-bold mb-4">Currículo</h2>
        <div className="h-1 w-16 bg-red-600 mb-8"></div>

        <div className="space-y-4">
          {modules && modules.length > 0 ? (
            modules.map((module, idx) => (
              <Card key={module.id} className="border-black">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Módulo {idx + 1}: {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{module.description}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-gray-600">Nenhum módulo disponível ainda.</p>
          )}
        </div>
      </section>

      {/* Instructor Section */}
      <section className="px-8 py-12 border-b border-black">
        <h2 className="text-3xl font-bold mb-4">Sobre o Instrutor</h2>
        <div className="h-1 w-16 bg-red-600 mb-8"></div>

        <Card className="border-black">
          <CardContent className="pt-6 flex gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0"></div>
            <div>
              <h3 className="text-xl font-bold mb-2">Nome do Instrutor</h3>
              <p className="text-gray-600 mb-4">
                Especialista em design com mais de 10 anos de experiência em UI/UX, design gráfico e motion design.
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="font-bold">1000+</div>
                  <div className="text-sm text-gray-600">Alunos</div>
                </div>
                <div>
                  <div className="font-bold">15+</div>
                  <div className="text-sm text-gray-600">Cursos</div>
                </div>
                <div>
                  <div className="font-bold">4.9</div>
                  <div className="text-sm text-gray-600">Avaliação</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Reviews Section */}
      <section className="px-8 py-12 border-b border-black">
        <h2 className="text-3xl font-bold mb-4">Depoimentos de Alunos</h2>
        <div className="h-1 w-16 bg-red-600 mb-8"></div>

        <div className="grid grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border-black">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">
                  "Excelente curso! Aprendi muito sobre design e agora consigo aplicar na minha carreira."
                </p>
                <div className="font-semibold">João Silva</div>
                <div className="text-sm text-gray-600">Designer UX</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black px-8 py-12 bg-gray-50">
        <div className="text-center text-sm text-gray-600">
          <p>&copy; 2024 Design Academy. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
