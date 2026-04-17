import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetail from "./pages/CourseDetail";
import LessonPlayer from "./pages/LessonPlayer";
import StudentDashboard from "./pages/StudentDashboard";
import StudentProfile from "./pages/StudentProfile";
import SubscriptionPage from "./pages/SubscriptionPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import AdminCourseEdit from "./pages/admin/AdminCourseEdit";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminPlans from "./pages/admin/AdminPlans";

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/cursos" component={CourseCatalog} />
      <Route path="/cursos/:slug" component={CourseDetail} />

      {/* Student */}
      <Route path="/minha-area" component={StudentDashboard} />
      <Route path="/perfil" component={StudentProfile} />
      <Route path="/assinatura" component={SubscriptionPage} />
      <Route path="/aula/:id" component={LessonPlayer} />

      {/* Admin */}
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/cursos" component={AdminCourses} />
      <Route path="/admin/cursos/novo" component={AdminCourseEdit} />
      <Route path="/admin/cursos/:id" component={AdminCourseEdit} />
      <Route path="/admin/usuarios" component={AdminUsers} />
      <Route path="/admin/pagamentos" component={AdminPayments} />
      <Route path="/admin/planos" component={AdminPlans} />

      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
