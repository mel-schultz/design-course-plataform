import { ENV } from "./_core/env";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  if (!ENV.resendApiKey) {
    console.warn("[Email] RESEND_API_KEY not configured, skipping email");
    return false;
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ENV.resendApiKey}`,
      },
      body: JSON.stringify({
        from: "noreply@designcourses.com",
        to: options.to,
        subject: options.subject,
        html: options.html,
      }),
    });

    if (!response.ok) {
      console.error(
        "[Email] Failed to send email:",
        response.status,
        await response.text()
      );
      return false;
    }

    console.log("[Email] Email sent successfully to", options.to);
    return true;
  } catch (error) {
    console.error("[Email] Error sending email:", error);
    return false;
  }
}

export function getStudentConfirmationEmail(
  studentName: string,
  courseTitle: string,
  courseLevel: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          .content { margin-bottom: 30px; }
          .footer { border-top: 1px solid #ccc; padding-top: 20px; font-size: 12px; color: #666; }
          .red-accent { color: #FF0000; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Design Courses Platform</h1>
          </div>
          <div class="content">
            <p>Olá <strong>${studentName}</strong>,</p>
            <p>Sua matrícula no curso <span class="red-accent">${courseTitle}</span> (Nível: ${courseLevel}) foi confirmada com sucesso!</p>
            <p>Você agora tem acesso total ao conteúdo do curso. Acesse sua conta para começar a aprender.</p>
            <p>Se tiver dúvidas, entre em contato com nosso suporte.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Design Courses Platform. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getInstructorNotificationEmail(
  instructorName: string,
  studentName: string,
  studentEmail: string,
  courseTitle: string,
  amount: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          .content { margin-bottom: 30px; }
          .footer { border-top: 1px solid #ccc; padding-top: 20px; font-size: 12px; color: #666; }
          .red-accent { color: #FF0000; font-weight: bold; }
          .info-box { background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #000; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Design Courses Platform - Notificação do Professor</h1>
          </div>
          <div class="content">
            <p>Olá <strong>${instructorName}</strong>,</p>
            <p>Um novo aluno se matriculou em seu curso!</p>
            <div class="info-box">
              <p><strong>Nome do Aluno:</strong> ${studentName}</p>
              <p><strong>E-mail:</strong> ${studentEmail}</p>
              <p><strong>Curso:</strong> ${courseTitle}</p>
              <p><strong>Valor da Matrícula:</strong> <span class="red-accent">${amount}</span></p>
            </div>
            <p>Você pode gerenciar seus alunos e cursos no painel administrativo.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Design Courses Platform. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

export function getPaymentConfirmationEmail(
  studentName: string,
  courseTitle: string,
  amount: string,
  transactionId: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #000; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
          .content { margin-bottom: 30px; }
          .footer { border-top: 1px solid #ccc; padding-top: 20px; font-size: 12px; color: #666; }
          .red-accent { color: #FF0000; font-weight: bold; }
          .info-box { background-color: #f5f5f5; padding: 15px; margin: 15px 0; border-left: 4px solid #000; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Confirmação de Pagamento</h1>
          </div>
          <div class="content">
            <p>Olá <strong>${studentName}</strong>,</p>
            <p>Seu pagamento foi processado com sucesso!</p>
            <div class="info-box">
              <p><strong>Curso:</strong> ${courseTitle}</p>
              <p><strong>Valor Pago:</strong> <span class="red-accent">${amount}</span></p>
              <p><strong>ID da Transação:</strong> ${transactionId}</p>
            </div>
            <p>Você agora tem acesso total ao conteúdo do curso. Acesse sua conta para começar.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Design Courses Platform. Todos os direitos reservados.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}
