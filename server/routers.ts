import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getCourseById,
  getPublishedCourses,
  getCoursesByInstructor,
  getStudentEnrollments,
  getModulesByCourse,
  getLessonsByModule,
  getLessonById,
  getDb,
} from "./db";
import { courses, enrollments, modules, lessons } from "../drizzle/schema";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Courses router
  courses: router({
    list: publicProcedure
      .input(
        z.object({
          category: z.string().optional(),
          level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
          search: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const allCourses = await getPublishedCourses();
        return allCourses.filter((course) => {
          if (input.category && course.category !== input.category) return false;
          if (input.level && course.level !== input.level) return false;
          if (input.search && !course.title.toLowerCase().includes(input.search.toLowerCase())) return false;
          return true;
        });
      }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return getCourseById(input);
      }),

    getByInstructor: protectedProcedure
      .query(async ({ ctx }) => {
        if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
          throw new Error("Only instructors can view their courses");
        }
        return getCoursesByInstructor(ctx.user.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          category: z.string(),
          level: z.enum(["beginner", "intermediate", "advanced"]),
          price: z.number().default(0),
        })
      )
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "instructor" && ctx.user.role !== "admin") {
          throw new Error("Only instructors can create courses");
        }
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(courses).values({
          instructorId: ctx.user.id,
          title: input.title,
          description: input.description,
          category: input.category,
          level: input.level,
          price: input.price.toString(),
        });
        return result;
      }),
  }),

  // Enrollments router
  enrollments: router({
    getStudentCourses: protectedProcedure
      .query(async ({ ctx }) => {
        return getStudentEnrollments(ctx.user.id);
      }),

    enroll: protectedProcedure
      .input(z.number())
      .mutation(async ({ ctx, input: courseId }) => {
        if (ctx.user.role !== "student") {
          throw new Error("Only students can enroll in courses");
        }
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const result = await db.insert(enrollments).values({
          studentId: ctx.user.id,
          courseId,
        });
        return result;
      }),
  }),

  // Modules router
  modules: router({
    getByCourse: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return getModulesByCourse(input);
      }),
  }),

  // Lessons router
  lessons: router({
    getByModule: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return getLessonsByModule(input);
      }),

    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return getLessonById(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
