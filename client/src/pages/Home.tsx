import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { Star, BookOpen, Users, Award } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: courses, isLoading } = trpc.courses.list.useQuery({});

  const featuredCourses = courses?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-black flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-bold">Design Academy</div>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm">{user?.name}</span>
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
            </>
          ) : (
            <Button onClick={() => window.location.href = getLoginUrl()}>
              Entrar
            </Button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-8 py-24 grid grid-cols-2 gap-16 items-center border-b border-black">
        <div>
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Aprenda Design com os Melhores
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Plataforma educacional de excelência. Cursos estruturados, instrutores qualificados e comunidade engajada.
          </p>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <Link href="/courses">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                  Explorar Cursos
                </Button>
              </Link>
            ) : (
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => window.location.href = getLoginUrl()}>
                Começar Agora
              </Button>
            )}
          </div>
        </div>
        <div className="bg-red-600 h-96 flex items-center justify-center text-white text-center">
          <div className="space-y-4">
            <div className="text-5xl font-bold">1000+</div>
            <div className="text-xl">Alunos Satisfeitos</div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-8 py-16 grid grid-cols-4 gap-8 border-b border-black">
        <div className="text-center">
          <BookOpen className="w-12 h-12 mx-auto mb-4" />
          <div className="text-3xl font-bold">50+</div>
          <div className="text-gray-600">Cursos</div>
        </div>
        <div className="text-center">
          <Users className="w-12 h-12 mx-auto mb-4" />
          <div className="text-3xl font-bold">100+</div>
          <div className="text-gray-600">Instrutores</div>
        </div>
        <div className="text-center">
          <Award className="w-12 h-12 mx-auto mb-4" />
          <div className="text-3xl font-bold">10K+</div>
          <div className="text-gray-600">Alunos</div>
        </div>
        <div className="text-center">
          <Star className="w-12 h-12 mx-auto mb-4" />
          <div className="text-3xl font-bold">4.9</div>
          <div className="text-gray-600">Avaliação</div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="px-8 py-24 border-b border-black">
        <h2 className="text-4xl font-bold mb-4">Cursos em Destaque</h2>
        <div className="h-1 w-16 bg-red-600 mb-12"></div>

        {isLoading ? (
          <div>Carregando...</div>
        ) : (
          <div className="grid grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Link key={course.id} href={`/courses/${course.id}`}>
                <Card className="border-black cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="h-40 bg-gray-200 mb-4"></div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400" />
                        <span className="text-sm font-semibold">{course.rating}</span>
                      </div>
                      <div className="text-lg font-bold">
                        {course.price === "0" ? "Grátis" : `R$ ${course.price}`}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="px-8 py-24 border-b border-black">
        <h2 className="text-4xl font-bold mb-4">Categorias</h2>
        <div className="h-1 w-16 bg-red-600 mb-12"></div>

        <div className="grid grid-cols-4 gap-6">
          {["UI/UX Design", "Graphic Design", "Web Design", "Motion Design"].map((category) => (
            <div key={category} className="border border-black p-8 text-center hover:bg-red-600 hover:text-white transition-colors cursor-pointer">
              <div className="text-lg font-semibold">{category}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-24 bg-black text-white text-center">
        <h2 className="text-4xl font-bold mb-6">Pronto para começar?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Junte-se a milhares de alunos que já transformaram suas carreiras com nossos cursos.
        </p>
        {isAuthenticated ? (
          <Link href="/courses">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              Explorar Cursos
            </Button>
          </Link>
        ) : (
          <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white" onClick={() => window.location.href = getLoginUrl()}>
            Cadastre-se Agora
          </Button>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-black px-8 py-12 bg-gray-50">
        <div className="grid grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4">Design Academy</h3>
            <p className="text-sm text-gray-600">Plataforma educacional de excelência em design.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Cursos</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>UI/UX Design</li>
              <li>Graphic Design</li>
              <li>Web Design</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Sobre</li>
              <li>Contato</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Privacidade</li>
              <li>Termos</li>
              <li>Cookies</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-black pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2024 Design Academy. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
