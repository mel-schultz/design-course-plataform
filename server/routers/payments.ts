import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  createPayment,
  createSubscription,
  getPaymentsByStudent,
  getStudentCourseSubscription,
  getCourseById,
  getStudentById,
  getInstructorById,
} from "../db-helpers";
import { sendEmail, getStudentConfirmationEmail, getInstructorNotificationEmail, getPaymentConfirmationEmail } from "../email";
import { ENV } from "../_core/env";

export const paymentsRouter = router({
  // Protected: Create payment intent
  createPaymentIntent: protectedProcedure
    .input(
      z.object({
        courseId: z.number(),
        amount: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "user") throw new Error("Only students can make payments");

      // Check if already subscribed
      const existingSubscription = await getStudentCourseSubscription(ctx.user.id, input.courseId);
      if (existingSubscription) throw new Error("Already subscribed to this course");

      const course = await getCourseById(input.courseId);
      if (!course) throw new Error("Course not found");

      // Create payment record
      const payment = await createPayment({
        studentId: ctx.user.id,
        courseId: input.courseId,
        amount: input.amount,
        currency: "USD",
        paymentMethod: "stripe",
        status: "pending",
      });

      // In a real scenario, this would create a Stripe Payment Intent
      // For now, we return a mock response
      return {
        paymentId: payment.id,
        amount: input.amount,
        currency: "USD",
        status: "pending",
      };
    }),

  // Protected: Confirm payment (webhook would normally do this)
  confirmPayment: protectedProcedure
    .input(
      z.object({
        paymentId: z.number(),
        stripePaymentIntentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "user") throw new Error("Unauthorized");

      // Get payment details
      const payments = await getPaymentsByStudent(ctx.user.id);
      const payment = payments.find((p) => p.id === input.paymentId);
      if (!payment) throw new Error("Payment not found");

      // Create subscription
      await createSubscription({
        studentId: ctx.user.id,
        courseId: payment.courseId,
        status: "active",
      });

      // Get course and student details
      const course = await getCourseById(payment.courseId);
      const student = await getStudentById(ctx.user.id);
      const instructor = await getInstructorById(course!.instructorId);

      // Send emails
      if (student?.email && course) {
        // Send confirmation email to student
        const studentEmail = getStudentConfirmationEmail(
          student.name || "Student",
          course.title,
          course.level
        );
        await sendEmail({
          to: student.email,
          subject: `Matrícula Confirmada: ${course.title}`,
          html: studentEmail,
        });

        // Send notification email to instructor
        if (instructor?.email) {
          const instructorEmail = getInstructorNotificationEmail(
            instructor.name || "Professor",
            student.name || "Novo Aluno",
            student.email,
            course.title,
            payment.amount
          );
          await sendEmail({
            to: instructor.email,
            subject: `Novo Aluno Matriculado: ${course.title}`,
            html: instructorEmail,
          });
        }

        // Send payment confirmation email
        const paymentEmail = getPaymentConfirmationEmail(
          student.name || "Student",
          course.title,
          payment.amount,
          input.stripePaymentIntentId
        );
        await sendEmail({
          to: student.email,
          subject: "Confirmação de Pagamento",
          html: paymentEmail,
        });
      }

      return { success: true };
    }),

  // Protected: Get student payments
  getMyPayments: protectedProcedure.query(async ({ ctx }) => {
    return getPaymentsByStudent(ctx.user.id);
  }),
});
