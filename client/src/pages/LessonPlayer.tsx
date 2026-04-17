import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { ChevronRight, ChevronLeft, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function LessonPlayer() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { user } = useAuth();
  const [isCompleted, setIsCompleted] = useState(false);

  const courseIdNum = parseInt(courseId || "0");
  const lessonIdNum = parseInt(lessonId || "0");

  const { data: lesson } = trpc.lessons.getById.useQuery(lessonIdNum);
  const { data: modules } = trpc.modules.getByCourse.useQuery(courseIdNum);

  // Get all lessons for navigation
  const allLessons: any[] = [];

  const currentLessonIndex = allLessons.findIndex(l => l.id === lessonIdNum);
  const previousLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const handleMarkComplete = () => {
    setIsCompleted(true);
    // TODO: Call mutation to update lesson progress
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-black flex items-center justify-between px-8 py-6">
        <Link href="/">
          <div className="text-2xl font-bold cursor-pointer">Design Academy</div>
        </Link>
        <div className="flex gap-4">
          <Link href="/student/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        </div>
      </nav>

      <div className="grid grid-cols-3 gap-8 px-8 py-12">
        {/* Main Content */}
        <div className="col-span-2">
          {/* Video Player */}
          <div className="bg-black h-96 mb-8 flex items-center justify-center text-white">
            {lesson?.videoUrl ? (
              <video
                src={lesson.videoUrl}
                controls
                className="w-full h-full"
              />
            ) : (
              <div className="text-center">
                <div className="text-4xl mb-4">🎬</div>
                <div>Vídeo não disponível</div>
              </div>
            )}
          </div>

          {/* Lesson Info */}
          <Card className="border-black mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">{lesson?.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-bold mb-2">Descrição</h3>
                <p className="text-gray-700">{lesson?.description}</p>
              </div>

              {lesson?.content && (
                <div>
                  <h3 className="font-bold mb-2">Conteúdo</h3>
                  <div className="bg-gray-50 p-4 rounded border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap">{lesson.content}</p>
                  </div>
                </div>
              )}

              {lesson?.attachments && Array.isArray(lesson.attachments) && (lesson.attachments as any).length > 0 ? (
                <div>
                  <h3 className="font-bold mb-2">Materiais Complementares</h3>
                  <div className="space-y-2">
                    {(lesson.attachments as any).map((url: string, idx: number) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full justify-start">
                          📎 Material {idx + 1}
                        </Button>
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}

              <Button
                size="lg"
                className={`w-full ${
                  isCompleted
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                } text-white`}
                onClick={handleMarkComplete}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Aula Concluída
                  </>
                ) : (
                  "Marcar como Concluída"
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex gap-4">
            {previousLesson && (
              <Link href={`/student/course/${courseId}/lesson/${previousLesson.id}`}>
                <Button variant="outline" className="flex-1">
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Aula Anterior
                </Button>
              </Link>
            )}
            {nextLesson && (
              <Link href={`/student/course/${courseId}/lesson/${nextLesson.id}`}>
                <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                  Próxima Aula
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar - Course Structure */}
        <div className="border-l border-black pl-8">
          <h3 className="font-bold text-lg mb-4">Currículo</h3>
          <div className="space-y-4">
            {modules?.map((module) => (
              <div key={module.id}>
                <div className="font-semibold text-sm mb-2">{module.title}</div>
                <div className="space-y-1">
                  {/* TODO: Get lessons from module */}
                  <div className="text-xs text-gray-600 pl-2">
                    Carregando aulas...
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
