import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  Course,
  Enrollment,
  InsertCourse,
  InsertEnrollment,
  InsertLesson,
  InsertLessonProgress,
  InsertPayment,
  InsertSubscription,
  InsertSubscriptionPlan,
  InsertUser,
  Lesson,
  LessonProgress,
  Payment,
  Subscription,
  SubscriptionPlan,
  User,
  courses,
  enrollments,
  lessonProgress,
  lessons,
  payments,
  subscriptionPlans,
  subscriptions,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const fields = ["name", "email", "phone", "loginMethod", "avatarUrl"] as const;
  for (const field of fields) {
    const value = user[field];
    if (value !== undefined) {
      values[field] = value ?? null;
      updateSet[field] = value ?? null;
    }
  }

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getUserById(id: number): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0];
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0];
}

export async function createUser(data: InsertUser): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(users).values(data);
  return (result[0] as any).insertId;
}

export async function updateUser(id: number, data: Partial<InsertUser>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.id, id));
}

export async function listUsers(opts?: { search?: string; role?: string; limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const conditions = [];
  if (opts?.search) {
    conditions.push(
      or(
        like(users.name, `%${opts.search}%`),
        like(users.email, `%${opts.search}%`)
      )
    );
  }
  if (opts?.role) {
    conditions.push(eq(users.role, opts.role as "user" | "admin"));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const limit = opts?.limit ?? 20;
  const offset = opts?.offset ?? 0;

  const [items, countResult] = await Promise.all([
    db.select().from(users).where(where).orderBy(desc(users.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(users).where(where),
  ]);

  return { items, total: Number(countResult[0]?.count ?? 0) };
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export async function createCourse(data: InsertCourse): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courses).values(data);
  return (result[0] as any).insertId;
}

export async function updateCourse(id: number, data: Partial<InsertCourse>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(courses).set(data).where(eq(courses.id, id));
}

export async function deleteCourse(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(courses).where(eq(courses.id, id));
}

export async function getCourseById(id: number): Promise<Course | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result[0];
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  return result[0];
}

export async function listCourses(opts?: {
  level?: string;
  published?: boolean;
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };

  const conditions = [];
  if (opts?.level) conditions.push(eq(courses.level, opts.level as any));
  if (opts?.published !== undefined) conditions.push(eq(courses.isPublished, opts.published));
  if (opts?.featured !== undefined) conditions.push(eq(courses.isFeatured, opts.featured));
  if (opts?.search) {
    conditions.push(
      or(like(courses.title, `%${opts.search}%`), like(courses.description, `%${opts.search}%`))
    );
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const limit = opts?.limit ?? 20;
  const offset = opts?.offset ?? 0;

  const [items, countResult] = await Promise.all([
    db.select().from(courses).where(where).orderBy(desc(courses.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(courses).where(where),
  ]);

  return { items, total: Number(countResult[0]?.count ?? 0) };
}

// ─── Lessons ──────────────────────────────────────────────────────────────────

export async function createLesson(data: InsertLesson): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(lessons).values(data);
  return (result[0] as any).insertId;
}

export async function updateLesson(id: number, data: Partial<InsertLesson>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(lessons).set(data).where(eq(lessons.id, id));
}

export async function deleteLesson(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.delete(lessons).where(eq(lessons.id, id));
}

export async function getLessonById(id: number): Promise<Lesson | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(lessons).where(eq(lessons.id, id)).limit(1);
  return result[0];
}

export async function listLessonsByCourse(courseId: number, publishedOnly = false): Promise<Lesson[]> {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(lessons.courseId, courseId)];
  if (publishedOnly) conditions.push(eq(lessons.isPublished, true));
  return db.select().from(lessons).where(and(...conditions)).orderBy(lessons.sortOrder);
}

// ─── Subscription Plans ───────────────────────────────────────────────────────

export async function listSubscriptionPlans(activeOnly = true): Promise<SubscriptionPlan[]> {
  const db = await getDb();
  if (!db) return [];
  const where = activeOnly ? eq(subscriptionPlans.isActive, true) : undefined;
  return db.select().from(subscriptionPlans).where(where).orderBy(subscriptionPlans.id);
}

export async function createSubscriptionPlan(data: InsertSubscriptionPlan): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(subscriptionPlans).values(data);
  return (result[0] as any).insertId;
}

export async function updateSubscriptionPlan(id: number, data: Partial<InsertSubscriptionPlan>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(subscriptionPlans).set(data).where(eq(subscriptionPlans.id, id));
}

export async function getSubscriptionPlanById(id: number): Promise<SubscriptionPlan | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id)).limit(1);
  return result[0];
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export async function createSubscription(data: InsertSubscription): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(subscriptions).values(data);
  return (result[0] as any).insertId;
}

export async function getActiveSubscription(userId: number): Promise<Subscription | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(subscriptions)
    .where(and(eq(subscriptions.userId, userId), eq(subscriptions.status, "active")))
    .orderBy(desc(subscriptions.createdAt))
    .limit(1);
  return result[0];
}

export async function getUserSubscriptions(userId: number): Promise<Subscription[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).orderBy(desc(subscriptions.createdAt));
}

export async function updateSubscription(id: number, data: Partial<InsertSubscription>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(subscriptions).set(data).where(eq(subscriptions.id, id));
}

export async function listAllSubscriptions(opts?: { limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const limit = opts?.limit ?? 20;
  const offset = opts?.offset ?? 0;
  const [items, countResult] = await Promise.all([
    db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(subscriptions),
  ]);
  return { items, total: Number(countResult[0]?.count ?? 0) };
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function createPayment(data: InsertPayment): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(payments).values(data);
  return (result[0] as any).insertId;
}

export async function updatePayment(id: number, data: Partial<InsertPayment>): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.update(payments).set(data).where(eq(payments.id, id));
}

export async function getUserPayments(userId: number): Promise<Payment[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
}

export async function listAllPayments(opts?: { limit?: number; offset?: number; status?: string }) {
  const db = await getDb();
  if (!db) return { items: [], total: 0 };
  const conditions = [];
  if (opts?.status) conditions.push(eq(payments.status, opts.status as any));
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const limit = opts?.limit ?? 20;
  const offset = opts?.offset ?? 0;
  const [items, countResult] = await Promise.all([
    db.select().from(payments).where(where).orderBy(desc(payments.createdAt)).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(payments).where(where),
  ]);
  return { items, total: Number(countResult[0]?.count ?? 0) };
}

export async function getPaymentStats() {
  const db = await getDb();
  if (!db) return { totalRevenue: 0, totalPayments: 0, completedPayments: 0 };
  const result = await db
    .select({
      totalRevenue: sql<number>`COALESCE(SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END), 0)`,
      totalPayments: sql<number>`count(*)`,
      completedPayments: sql<number>`SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END)`,
    })
    .from(payments);
  return result[0] ?? { totalRevenue: 0, totalPayments: 0, completedPayments: 0 };
}

// ─── Enrollments ──────────────────────────────────────────────────────────────

export async function enrollUser(data: InsertEnrollment): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(enrollments).values(data);
  return (result[0] as any).insertId;
}

export async function getEnrollment(userId: number, courseId: number): Promise<Enrollment | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
    .limit(1);
  return result[0];
}

export async function getUserEnrollments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({ enrollment: enrollments, course: courses })
    .from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, userId))
    .orderBy(desc(enrollments.enrolledAt));
}

export async function updateEnrollmentProgress(userId: number, courseId: number, progress: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(enrollments)
    .set({ progress, completedAt: progress >= 100 ? new Date() : null })
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
}

// ─── Lesson Progress ──────────────────────────────────────────────────────────

export async function upsertLessonProgress(data: InsertLessonProgress): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .insert(lessonProgress)
    .values(data)
    .onDuplicateKeyUpdate({
      set: {
        isCompleted: data.isCompleted,
        watchedSeconds: data.watchedSeconds,
        completedAt: data.completedAt,
        updatedAt: new Date(),
      },
    });
}

export async function getLessonProgress(userId: number, lessonId: number): Promise<LessonProgress | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.lessonId, lessonId)))
    .limit(1);
  return result[0];
}

export async function getCourseProgress(userId: number, courseId: number): Promise<LessonProgress[]> {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(lessonProgress)
    .where(and(eq(lessonProgress.userId, userId), eq(lessonProgress.courseId, courseId)));
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const db = await getDb();
  if (!db) return { totalUsers: 0, totalCourses: 0, totalEnrollments: 0, activeSubscriptions: 0 };
  const [userCount, courseCount, enrollmentCount, subCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(users),
    db.select({ count: sql<number>`count(*)` }).from(courses).where(eq(courses.isPublished, true)),
    db.select({ count: sql<number>`count(*)` }).from(enrollments),
    db.select({ count: sql<number>`count(*)` }).from(subscriptions).where(eq(subscriptions.status, "active")),
  ]);
  return {
    totalUsers: Number(userCount[0]?.count ?? 0),
    totalCourses: Number(courseCount[0]?.count ?? 0),
    totalEnrollments: Number(enrollmentCount[0]?.count ?? 0),
    activeSubscriptions: Number(subCount[0]?.count ?? 0),
  };
}

// ─── Seed default subscription plans ─────────────────────────────────────────

export async function seedDefaultPlans(): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select({ count: sql<number>`count(*)` }).from(subscriptionPlans);
  if (Number(existing[0]?.count ?? 0) > 0) return;

  await db.insert(subscriptionPlans).values([
    {
      name: "Mensal",
      description: "Acesso completo a todos os cursos por 1 mês",
      price: "49.90",
      billingCycle: "monthly",
      features: JSON.stringify(["Acesso a todos os cursos", "Suporte por e-mail", "Certificados"]),
      isActive: true,
    },
    {
      name: "Trimestral",
      description: "Acesso completo a todos os cursos por 3 meses",
      price: "129.90",
      billingCycle: "quarterly",
      features: JSON.stringify(["Acesso a todos os cursos", "Suporte prioritário", "Certificados", "Downloads offline"]),
      isActive: true,
    },
    {
      name: "Anual",
      description: "Acesso completo a todos os cursos por 1 ano",
      price: "399.90",
      billingCycle: "annual",
      features: JSON.stringify([
        "Acesso a todos os cursos",
        "Suporte prioritário 24/7",
        "Certificados",
        "Downloads offline",
        "Acesso antecipado a novos cursos",
      ]),
      isActive: true,
    },
  ] as any[]);
}
