import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getAllCourses,
  getCourseById,
  getCourseContent,
  getStudentSubscriptions,
  getStudentCourseSubscription,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByInstructor,
} from "../db-helpers";

export const coursesRouter = router({
  // Public: Get all active courses
  getAll: publicProcedure.query(async () => {
    return getAllCourses();
  }),

  // Public: Get course by ID
  getById: publicProcedure.input(z.object({ courseId: z.number() })).query(async ({ input }) => {
    const course = await getCourseById(input.courseId);
    if (!course) throw new Error("Course not found");

    const content = await getCourseContent(input.courseId);
    return { ...course, content };
  }),

  // Protected: Get courses for current student
  getMyCourses: protectedProcedure.query(async ({ ctx }) => {
    const subscriptions = await getStudentSubscriptions(ctx.user.id);
    const courses = await Promise.all(
      subscriptions.map(async (sub) => {
        const course = await getCourseById(sub.courseId);
        return { ...course, subscription: sub };
      })
    );
    return courses.filter((c) => c !== null);
  }),

  // Protected (admin): Create course
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        level: z.enum(["beginner", "intermediate", "advanced"]),
        price: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized");

      await createCourse({
        title: input.title,
        description: input.description,
        level: input.level,
        price: input.price,
        instructorId: ctx.user.id,
        isActive: true,
      });

      return { success: true };
    }),

  // Protected (admin): Update course
  update: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized");

      const course = await getCourseById(input.courseId);
      if (course?.instructorId !== ctx.user.id) throw new Error("Unauthorized");

      await updateCourse(input.courseId, {
        title: input.title,
        description: input.description,
        price: input.price,
      });

      return { success: true };
    }),

  // Protected (admin): Delete course
  delete: protectedProcedure
    .input(z.object({ courseId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") throw new Error("Unauthorized");

      const course = await getCourseById(input.courseId);
      if (course?.instructorId !== ctx.user.id) throw new Error("Unauthorized");

      await deleteCourse(input.courseId);
      return { success: true };
    }),

  // Protected (admin): Get instructor courses
  getInstructorCourses: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") throw new Error("Unauthorized");
    return getCoursesByInstructor(ctx.user.id);
  }),
});
