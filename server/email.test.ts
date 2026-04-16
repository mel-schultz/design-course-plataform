import { describe, expect, it } from "vitest";
import { getStudentConfirmationEmail, getInstructorNotificationEmail, getPaymentConfirmationEmail } from "./email";

describe("Email templates", () => {
  it("should generate student confirmation email with correct content", () => {
    const email = getStudentConfirmationEmail("João Silva", "Web Design Avançado", "advanced");
    
    expect(email).toContain("João Silva");
    expect(email).toContain("Web Design Avançado");
    expect(email).toContain("advanced");
    expect(email).toContain("Design Courses Platform");
  });

  it("should generate instructor notification email with correct content", () => {
    const email = getInstructorNotificationEmail(
      "Prof. Maria",
      "João Silva",
      "joao@example.com",
      "Web Design Avançado",
      "$99.99"
    );
    
    expect(email).toContain("Prof. Maria");
    expect(email).toContain("João Silva");
    expect(email).toContain("joao@example.com");
    expect(email).toContain("Web Design Avançado");
    expect(email).toContain("$99.99");
  });

  it("should generate payment confirmation email with correct content", () => {
    const email = getPaymentConfirmationEmail(
      "João Silva",
      "Web Design Avançado",
      "$99.99",
      "txn_123456789"
    );
    
    expect(email).toContain("João Silva");
    expect(email).toContain("Web Design Avançado");
    expect(email).toContain("$99.99");
    expect(email).toContain("txn_123456789");
  });
});
