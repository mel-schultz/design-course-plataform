import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createCourse,
  createLesson,
  createPayment,
  createSubscription,
  createUser,
  deleteCourse,
  deleteLesson,
  enrollUser,
  getActiveSubscription,
  getCourseById,
  getCourseBySlug,
  getCourseProgress,
  getDashboardStats,
  getEnrollment,
  getLessonById,
  getLessonProgress,
  getPaymentStats,
  getSubscriptionPlanById,
  getUserByEmail,
  getUserById,
  getUserEnrollments,
  getUserPayments,
  getUserSubscriptions,
  listAllPayments,
  listAllSubscriptions,
  listCourses,
  listLessonsByCourse,
  listSubscriptionPlans,
  listUsers,
  createSubscriptionPlan,
  seedDefaultPlans,
  updateCourse,
  updateEnrollmentProgress,
  updateLesson,
  updatePayment,
  updateSubscription,
  updateSubscriptionPlan,
  updateUser,
  upsertLessonProgress,
  upsertUser,
} from "./db";
import bcrypt from "bcryptjs";
import { ENV } from "./_core/env";
import { signJwt, verifyJwt } from "./_core/jwt";

// ─── Admin middleware ─────────────────────────────────────────────────────────
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito ao professor." });
  }
  return next({ ctx });
});

// ─── Auth Router ──────────────────────────────────────────────────────────────
const authRouter = router({
  me: publicProcedure.query((opts) => opts.ctx.user),

  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
        email: z.string().email("E-mail inválido"),
        phone: z.string().min(10, "Telefone inválido"),
        password: z.string().min(6, "Senha deve ter ao menos 6 caracteres"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const existing = await getUserByEmail(input.email);
      if (existing) {
        throw new TRPCError({ code: "CONFLICT", message: "E-mail já cadastrado." });
      }

      const passwordHash = await bcrypt.hash(input.password, 10);
      const openId = `local_${nanoid(16)}`;

      const userId = await createUser({
        openId,
        name: input.name,
        email: input.email,
        phone: input.phone,
        passwordHash,
        loginMethod: "local",
        role: "user",
        isActive: true,
        lastSignedIn: new Date(),
      });

      const user = await getUserById(userId);
      if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const token = await signJwt({ userId: user.id, openId: user.openId, role: user.role });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, cookieOptions);

      return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await getUserByEmail(input.email);
      if (!user || !user.passwordHash) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "E-mail ou senha incorretos." });
      }

      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "E-mail ou senha incorretos." });
      }

      if (!user.isActive) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Conta desativada." });
      }

      await updateUser(user.id, { lastSignedIn: new Date() });

      const token = await signJwt({ userId: user.id, openId: user.openId, role: user.role });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, cookieOptions);

      return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
    }),

  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return { success: true } as const;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(2).optional(),
        phone: z.string().optional(),
        avatarUrl: z.string().url().optional().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await updateUser(ctx.user.id, input);
      return { success: true };
    }),

  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(6),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await getUserById(ctx.user.id);
      if (!user?.passwordHash) throw new TRPCError({ code: "BAD_REQUEST" });
      const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
      if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Senha atual incorreta." });
      const passwordHash = await bcrypt.hash(input.newPassword, 10);
      await updateUser(ctx.user.id, { passwordHash });
      return { success: true };
    }),
});

// ─── Courses Router ───────────────────────────────────────────────────────────
const coursesRouter = router({
  list: publicProcedure
    .input(
      z.object({
        level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      return listCourses({ ...input, published: true });
    }),

  listAdmin: adminProcedure
    .input(
      z.object({
        level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      return listCourses(input ?? {});
    }),

  featured: publicProcedure.query(async () => {
    return listCourses({ featured: true, published: true, limit: 6 });
  }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const course = await getCourseBySlug(input.slug);
      if (!course) throw new TRPCError({ code: "NOT_FOUND" });
      const lessonList = await listLessonsByCourse(course.id, true);
      return { course, lessons: lessonList };
    }),

  byId: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const course = await getCourseById(input.id);
      if (!course) throw new TRPCError({ code: "NOT_FOUND" });
      const lessonList = await listLessonsByCourse(course.id);
      return { course, lessons: lessonList };
    }),

  create: adminProcedure
    .input(
      z.object({
        title: z.string().min(3),
        slug: z.string().min(3),
        description: z.string().optional(),
        shortDescription: z.string().max(500).optional(),
        level: z.enum(["beginner", "intermediate", "advanced"]),
        thumbnailUrl: z.string().url().optional().nullable(),
        isPublished: z.boolean().default(false),
        isFeatured: z.boolean().default(false),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = await createCourse({
        ...input,
        instructorId: ctx.user.id,
        tags: input.tags ? JSON.stringify(input.tags) : null,
      });
      return { id };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(3).optional(),
        slug: z.string().min(3).optional(),
        description: z.string().optional(),
        shortDescription: z.string().max(500).optional(),
        level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        thumbnailUrl: z.string().url().optional().nullable(),
        isPublished: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, tags, ...rest } = input;
      await updateCourse(id, {
        ...rest,
        ...(tags !== undefined ? { tags: JSON.stringify(tags) } : {}),
      });
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteCourse(input.id);
      return { success: true };
    }),

  togglePublish: adminProcedure
    .input(z.object({ id: z.number(), isPublished: z.boolean() }))
    .mutation(async ({ input }) => {
      await updateCourse(input.id, { isPublished: input.isPublished });
      return { success: true };
    }),
});

// ─── Lessons Router ───────────────────────────────────────────────────────────
const lessonsRouter = router({
  byCourse: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input, ctx }) => {
      const isAdmin = ctx.user.role === "admin";
      return listLessonsByCourse(input.courseId, !isAdmin);
    }),

  byId: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const lesson = await getLessonById(input.id);
      if (!lesson) throw new TRPCError({ code: "NOT_FOUND" });

      if (!lesson.isFree && ctx.user.role !== "admin") {
        const sub = await getActiveSubscription(ctx.user.id);
        if (!sub) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Assinatura necessária para acessar este conteúdo." });
        }
      }

      const progress = await getLessonProgress(ctx.user.id, lesson.id);
      return { lesson, progress };
    }),

  create: adminProcedure
    .input(
      z.object({
        courseId: z.number(),
        title: z.string().min(3),
        description: z.string().optional(),
        content: z.string().optional(),
        videoUrl: z.string().url().optional().nullable(),
        duration: z.number().min(0).default(0),
        sortOrder: z.number().min(0).default(0),
        isPublished: z.boolean().default(false),
        isFree: z.boolean().default(false),
      })
    )
    .mutation(async ({ input }) => {
      const id = await createLesson(input);
      return { id };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(3).optional(),
        description: z.string().optional(),
        content: z.string().optional(),
        videoUrl: z.string().url().optional().nullable(),
        duration: z.number().min(0).optional(),
        sortOrder: z.number().min(0).optional(),
        isPublished: z.boolean().optional(),
        isFree: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...rest } = input;
      await updateLesson(id, rest);
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await deleteLesson(input.id);
      return { success: true };
    }),

  updateProgress: protectedProcedure
    .input(
      z.object({
        lessonId: z.number(),
        courseId: z.number(),
        isCompleted: z.boolean(),
        watchedSeconds: z.number().min(0).default(0),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await upsertLessonProgress({
        userId: ctx.user.id,
        lessonId: input.lessonId,
        courseId: input.courseId,
        isCompleted: input.isCompleted,
        watchedSeconds: input.watchedSeconds,
        completedAt: input.isCompleted ? new Date() : null,
      });

      // Recalculate course progress
      const allLessons = await listLessonsByCourse(input.courseId, true);
      const progress = await getCourseProgress(ctx.user.id, input.courseId);
      const completedCount = progress.filter((p) => p.isCompleted).length;
      const pct = allLessons.length > 0 ? Math.round((completedCount / allLessons.length) * 100) : 0;
      await updateEnrollmentProgress(ctx.user.id, input.courseId, pct);

      return { success: true, progress: pct };
    }),
});

// ─── Users Router ─────────────────────────────────────────────────────────────
const usersRouter = router({
  list: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        role: z.enum(["user", "admin"]).optional(),
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ input }) => {
      return listUsers(input ?? {});
    }),

  updateRole: adminProcedure
    .input(z.object({ userId: z.number(), role: z.enum(["user", "admin"]) }))
    .mutation(async ({ input }) => {
      await updateUser(input.userId, { role: input.role });
      return { success: true };
    }),

  toggleActive: adminProcedure
    .input(z.object({ userId: z.number(), isActive: z.boolean() }))
    .mutation(async ({ input }) => {
      await updateUser(input.userId, { isActive: input.isActive });
      return { success: true };
    }),
});

// ─── Subscriptions Router ─────────────────────────────────────────────────────
const subscriptionsRouter = router({
  plans: publicProcedure.query(async () => {
    await seedDefaultPlans();
    return listSubscriptionPlans(true);
  }),

  mySubscription: protectedProcedure.query(async ({ ctx }) => {
    const sub = await getActiveSubscription(ctx.user.id);
    if (!sub) return null;
    const plan = await getSubscriptionPlanById(sub.planId);
    return { subscription: sub, plan };
  }),

  history: protectedProcedure.query(async ({ ctx }) => {
    return getUserSubscriptions(ctx.user.id);
  }),

  cancel: protectedProcedure
    .input(z.object({ subscriptionId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const subs = await getUserSubscriptions(ctx.user.id);
      const sub = subs.find((s) => s.id === input.subscriptionId);
      if (!sub) throw new TRPCError({ code: "NOT_FOUND" });
      await updateSubscription(sub.id, { status: "cancelled", cancelledAt: new Date() });
      return { success: true };
    }),

  createPlan: adminProcedure
    .input(
      z.object({
        name: z.string().min(2),
        description: z.string().optional(),
        price: z.number().min(0),
        billingCycle: z.enum(["monthly", "quarterly", "annual"]),
        features: z.string().optional(),
        isActive: z.boolean().default(true),
      })
    )
    .mutation(async ({ input }) => {
      const { price, ...rest } = input;
      await createSubscriptionPlan({
        ...rest,
        price: price.toString(),
      });
      return { success: true };
    }),

  // Admin
  listAll: adminProcedure
    .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }).optional())
    .query(async ({ input }) => {
      return listAllSubscriptions(input ?? {});
    }),

  updatePlan: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        isActive: z.boolean().optional(),
        features: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, features, ...rest } = input;
      await updateSubscriptionPlan(id, {
        ...rest,
        ...(features !== undefined ? { features: JSON.stringify(features) } : {}),
      });
      return { success: true };
    }),
});

// ─── Payments Router ──────────────────────────────────────────────────────────
const paymentsRouter = router({
  subscribe: protectedProcedure
    .input(
      z.object({
        planId: z.number(),
        paymentMethod: z.enum(["credit_card", "debit_card"]),
        cardNumber: z.string().min(16).max(19),
        cardHolderName: z.string().min(3),
        expiryMonth: z.string().length(2),
        expiryYear: z.string().length(4),
        cvv: z.string().min(3).max(4),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const plan = await getSubscriptionPlanById(input.planId);
      if (!plan || !plan.isActive) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Plano não encontrado." });
      }

      // Simulate payment processing (in production, integrate with payment gateway)
      const cardLastFour = input.cardNumber.replace(/\s/g, "").slice(-4);
      const cardBrand = detectCardBrand(input.cardNumber);
      const transactionId = `txn_${nanoid(16)}`;

      // Create payment record
      const paymentId = await createPayment({
        userId: ctx.user.id,
        amount: plan.price,
        currency: "BRL",
        status: "completed",
        paymentMethod: input.paymentMethod,
        cardLastFour,
        cardBrand,
        cardHolderName: input.cardHolderName,
        transactionId,
        description: `Assinatura ${plan.name} - DesignHub`,
        paidAt: new Date(),
      });

      // Calculate end date based on billing cycle
      const endDate = new Date();
      if (plan.billingCycle === "monthly") endDate.setMonth(endDate.getMonth() + 1);
      else if (plan.billingCycle === "quarterly") endDate.setMonth(endDate.getMonth() + 3);
      else if (plan.billingCycle === "annual") endDate.setFullYear(endDate.getFullYear() + 1);

      // Cancel any existing active subscription
      const existingSub = await getActiveSubscription(ctx.user.id);
      if (existingSub) {
        await updateSubscription(existingSub.id, { status: "cancelled", cancelledAt: new Date() });
      }

      // Create new subscription
      const subId = await createSubscription({
        userId: ctx.user.id,
        planId: plan.id,
        status: "active",
        startDate: new Date(),
        endDate,
      });

      // Update payment with subscription ID
      await updatePayment(paymentId, { subscriptionId: subId });

      // Auto-enroll in all published courses
      const { items: publishedCourses } = await listCourses({ published: true, limit: 100 });
      for (const course of publishedCourses) {
        const existing = await getEnrollment(ctx.user.id, course.id);
        if (!existing) {
          await enrollUser({ userId: ctx.user.id, courseId: course.id });
        }
      }

      return { success: true, subscriptionId: subId, paymentId };
    }),

  myPayments: protectedProcedure.query(async ({ ctx }) => {
    return getUserPayments(ctx.user.id);
  }),

  listAll: adminProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        status: z.string().optional(),
      }).optional()
    )
    .query(async ({ input }) => {
      return listAllPayments(input ?? {});
    }),

  stats: adminProcedure.query(async () => {
    return getPaymentStats();
  }),
});

// ─── Enrollments Router ───────────────────────────────────────────────────────
const enrollmentsRouter = router({
  myCourses: protectedProcedure.query(async ({ ctx }) => {
    return getUserEnrollments(ctx.user.id);
  }),

  checkAccess: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role === "admin") return { hasAccess: true };
      const sub = await getActiveSubscription(ctx.user.id);
      if (!sub) return { hasAccess: false, reason: "no_subscription" };
      const enrollment = await getEnrollment(ctx.user.id, input.courseId);
      return { hasAccess: !!enrollment, reason: enrollment ? undefined : "not_enrolled" };
    }),
});

// ─── Dashboard Router ─────────────────────────────────────────────────────────
const dashboardRouter = router({
  stats: adminProcedure.query(async () => {
    const [stats, paymentStats] = await Promise.all([getDashboardStats(), getPaymentStats()]);
    return { ...stats, ...paymentStats };
  }),
});

// ─── App Router ───────────────────────────────────────────────────────────────
export const appRouter = router({
  system: systemRouter,
  auth: authRouter,
  courses: coursesRouter,
  lessons: lessonsRouter,
  users: usersRouter,
  subscriptions: subscriptionsRouter,
  payments: paymentsRouter,
  enrollments: enrollmentsRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function detectCardBrand(cardNumber: string): string {
  const num = cardNumber.replace(/\s/g, "");
  if (/^4/.test(num)) return "Visa";
  if (/^5[1-5]/.test(num)) return "Mastercard";
  if (/^3[47]/.test(num)) return "Amex";
  if (/^6(?:011|5)/.test(num)) return "Discover";
  if (/^(?:2131|1800|35)/.test(num)) return "JCB";
  return "Unknown";
}
