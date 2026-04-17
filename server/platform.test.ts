import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ─── Mock DB helpers ──────────────────────────────────────────────────────────
vi.mock("./db", () => ({
  getUserByEmail: vi.fn(),
  getUserById: vi.fn(),
  getUserByOpenId: vi.fn(),
  createUser: vi.fn().mockResolvedValue(1),
  updateUser: vi.fn().mockResolvedValue(undefined),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  listCourses: vi.fn().mockResolvedValue({ items: [], total: 0 }),
  getCourseById: vi.fn(),
  getCourseBySlug: vi.fn(),
  createCourse: vi.fn().mockResolvedValue(1),
  updateCourse: vi.fn().mockResolvedValue(undefined),
  deleteCourse: vi.fn().mockResolvedValue(undefined),
  listLessonsByCourse: vi.fn().mockResolvedValue([]),
  getLessonById: vi.fn(),
  createLesson: vi.fn().mockResolvedValue(1),
  updateLesson: vi.fn().mockResolvedValue(undefined),
  deleteLesson: vi.fn().mockResolvedValue(undefined),
  listSubscriptionPlans: vi.fn().mockResolvedValue([]),
  getSubscriptionPlanById: vi.fn(),
  createSubscriptionPlan: vi.fn().mockResolvedValue(1),
  updateSubscriptionPlan: vi.fn().mockResolvedValue(undefined),
  getActiveSubscription: vi.fn().mockResolvedValue(null),
  getUserSubscriptions: vi.fn().mockResolvedValue([]),
  createSubscription: vi.fn().mockResolvedValue(1),
  updateSubscription: vi.fn().mockResolvedValue(undefined),
  listAllSubscriptions: vi.fn().mockResolvedValue({ items: [], total: 0 }),
  createPayment: vi.fn().mockResolvedValue(1),
  updatePayment: vi.fn().mockResolvedValue(undefined),
  getUserPayments: vi.fn().mockResolvedValue([]),
  listAllPayments: vi.fn().mockResolvedValue({ items: [], total: 0 }),
  getPaymentStats: vi.fn().mockResolvedValue({ totalRevenue: "0", completedPayments: 0 }),
  getUserEnrollments: vi.fn().mockResolvedValue([]),
  getEnrollment: vi.fn().mockResolvedValue(null),
  enrollUser: vi.fn().mockResolvedValue(1),
  updateEnrollmentProgress: vi.fn().mockResolvedValue(undefined),
  getLessonProgress: vi.fn().mockResolvedValue(null),
  upsertLessonProgress: vi.fn().mockResolvedValue(undefined),
  getCourseProgress: vi.fn().mockResolvedValue(0),
  listUsers: vi.fn().mockResolvedValue({ items: [], total: 0 }),
  getDashboardStats: vi.fn().mockResolvedValue({
    totalUsers: 0,
    totalCourses: 0,
    activeSubscriptions: 0,
    totalRevenue: "0",
  }),
  seedDefaultPlans: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed_password"),
    compare: vi.fn().mockResolvedValue(true),
  },
}));

vi.mock("./_core/jwt", () => ({
  signJwt: vi.fn().mockResolvedValue("mock_token"),
  verifyJwt: vi.fn().mockResolvedValue({ userId: 1 }),
}));

// ─── Context helpers ──────────────────────────────────────────────────────────
function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      cookie: vi.fn(),
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(overrides: Partial<NonNullable<TrpcContext["user"]>> = {}): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "user-open-id",
      name: "Test User",
      email: "user@test.com",
      phone: "11999999999",
      loginMethod: "local",
      role: "user",
      passwordHash: "hash",
      avatarUrl: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
      ...overrides,
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      cookie: vi.fn(),
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return createUserContext({ role: "admin", id: 2, openId: "admin-open-id" });
}

// ─── Tests ────────────────────────────────────────────────────────────────────
describe("auth.me", () => {
  it("returns null for unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("returns user for authenticated user", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).not.toBeNull();
    expect(result?.email).toBe("user@test.com");
    expect(result?.role).toBe("user");
  });
});

describe("auth.logout", () => {
  it("clears session cookie and returns success", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.logout();
    expect(result.success).toBe(true);
    expect(ctx.res.clearCookie).toHaveBeenCalled();
  });
});

describe("courses.list", () => {
  it("returns empty list when no courses exist", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.courses.list({ limit: 10, offset: 0 });
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });
});

describe("courses.create (admin only)", () => {
  it("throws FORBIDDEN for regular users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.courses.create({
        title: "Test Course",
        slug: "test-course",
        level: "beginner",
        isPublished: false,
        isFeatured: false,
      })
    ).rejects.toThrow();
  });

  it("creates course for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.courses.create({
      title: "Test Course",
      slug: "test-course",
      level: "beginner",
      isPublished: false,
      isFeatured: false,
    });
    expect(result.id).toBe(1);
  });
});

describe("subscriptions.plans", () => {
  it("returns empty list when no plans exist", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.subscriptions.plans();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("dashboard.stats (admin only)", () => {
  it("throws FORBIDDEN for regular users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.dashboard.stats()).rejects.toThrow();
  });

  it("returns stats for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.dashboard.stats();
    expect(result).toHaveProperty("totalUsers");
    expect(result).toHaveProperty("totalCourses");
    expect(result).toHaveProperty("activeSubscriptions");
    expect(result).toHaveProperty("totalRevenue");
  });
});

describe("users.list (admin only)", () => {
  it("throws FORBIDDEN for regular users", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.users.list({})).rejects.toThrow();
  });

  it("returns user list for admin", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.users.list({});
    expect(result).toHaveProperty("items");
    expect(result).toHaveProperty("total");
  });
});

describe("enrollments.myCourses", () => {
  it("throws UNAUTHORIZED for unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.enrollments.myCourses()).rejects.toThrow();
  });

  it("returns empty array for authenticated user with no enrollments", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.enrollments.myCourses();
    expect(Array.isArray(result)).toBe(true);
  });
});
