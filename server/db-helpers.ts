import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { courses, courseContent, subscriptions, payments, users } from "../drizzle/schema";
import type { InsertCourse, InsertCourseContent, InsertSubscription, InsertPayment } from "../drizzle/schema";

// Course queries
export async function getAllCourses() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courses).where(eq(courses.isActive, true));
}

export async function getCourseById(courseId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(courses).where(eq(courses.id, courseId)).limit(1);
  return result[0] || null;
}

export async function createCourse(data: InsertCourse) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(courses).values(data);
}

export async function updateCourse(courseId: number, data: Partial<InsertCourse>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courses).set(data).where(eq(courses.id, courseId));
}

export async function deleteCourse(courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courses).set({ isActive: false }).where(eq(courses.id, courseId));
}

// Course content queries
export async function getCourseContent(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courseContent).where(eq(courseContent.courseId, courseId));
}

export async function createCourseContent(data: InsertCourseContent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(courseContent).values(data);
}

export async function updateCourseContent(contentId: number, data: Partial<InsertCourseContent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(courseContent).set(data).where(eq(courseContent.id, contentId));
}

export async function deleteCourseContent(contentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(courseContent).where(eq(courseContent.id, contentId));
}

// Subscription queries
export async function getStudentSubscriptions(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscriptions).where(eq(subscriptions.studentId, studentId));
}

export async function createSubscription(data: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(subscriptions).values(data);
}

export async function getStudentCourseSubscription(studentId: number, courseId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.studentId, studentId), eq(subscriptions.courseId, courseId)))
    .limit(1);
  return result[0] || null;
}

// Payment queries
export async function createPayment(data: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(payments).values(data);
  // Return the inserted data with a mock ID (in production, use RETURNING)
  return { id: Date.now(), ...data } as any;
}

export async function getPaymentsByStudent(studentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments).where(eq(payments.studentId, studentId));
}

export async function updatePayment(paymentId: number, data: Partial<InsertPayment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(payments).set(data).where(eq(payments.id, paymentId));
}

export async function getPaymentByStripeId(stripePaymentIntentId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(payments)
    .where(eq(payments.stripePaymentIntentId, stripePaymentIntentId))
    .limit(1);
  return result[0] || null;
}

// User queries
export async function getAllStudents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).where(eq(users.role, "user"));
}

export async function getStudentById(studentId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.id, studentId)).limit(1);
  return result[0] || null;
}

export async function getInstructorById(instructorId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(users).where(eq(users.id, instructorId)).limit(1);
  return result[0] || null;
}

export async function getCoursesByInstructor(instructorId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courses).where(eq(courses.instructorId, instructorId));
}
