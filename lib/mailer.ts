import nodemailer from "nodemailer";

type WelcomeEmailInput = {
  to: string;
  name: string;
};

type MailResult = {
  sent: boolean;
  reason?: string;
};

function getFirstEnvValue(names: string[]) {
  for (const name of names) {
    const value = process.env[name];
    if (value && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function getMailConfig() {
  const user = getFirstEnvValue(["SMTP_USER", "MAIL_USER", "EMAIL_USER"]);
  const pass = getFirstEnvValue(["SMTP_PASS", "MAIL_PASS", "EMAIL_PASS"]);
  const host =
    getFirstEnvValue(["SMTP_HOST", "MAIL_HOST", "EMAIL_HOST"]) ||
    (user.toLowerCase().endsWith("@gmail.com") ? "smtp.gmail.com" : "");
  const portValue =
    getFirstEnvValue(["SMTP_PORT", "MAIL_PORT", "EMAIL_PORT"]) ||
    (host === "smtp.gmail.com" ? "587" : "");
  const port = Number(portValue || 587);
  const fromEmail =
    getFirstEnvValue(["SMTP_FROM_EMAIL", "MAIL_FROM_EMAIL", "EMAIL_FROM"]) ||
    user;
  const fromName = getFirstEnvValue([
    "SMTP_FROM_NAME",
    "MAIL_FROM_NAME",
    "EMAIL_FROM_NAME",
  ]) || "ExpanceFlow";

  const missing: string[] = [];

  if (!user) {
    missing.push("SMTP_USER");
  }

  if (!pass) {
    missing.push("SMTP_PASS");
  }

  if (!host) {
    missing.push("SMTP_HOST");
  }

  if (!fromEmail) {
    missing.push("SMTP_FROM_EMAIL");
  }

  if (missing.length > 0) {
    return {
      isValid: false as const,
      reason: `Missing email configuration: ${missing.join(", ")}.`,
    };
  }

  return {
    isValid: true as const,
    host,
    port,
    user,
    pass,
    fromEmail,
    fromName,
    secure: port === 465,
  };
}

export async function sendWelcomeEmail({
  to,
  name,
}: WelcomeEmailInput): Promise<MailResult> {
  const config = getMailConfig();

  if (!config.isValid) {
    return {
      sent: false,
      reason: `${config.reason} Add them in .env and restart the Next.js server.`,
    };
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to,
      subject: "Welcome to ExpanceFlow",
      text: `Dear ${name},

Welcome to ExpanceFlow.

Your account has been created successfully, and you can now sign in to manage expenses, monitor budgets, and keep your financial activity organized in one place.

If you did not create this account, please contact our support team immediately.

Regards,
ExpanceFlow Team`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111827; max-width: 640px; margin: 0 auto; padding: 24px;">
          <p style="margin: 0 0 12px;">Dear ${name},</p>
          <h2 style="margin: 0 0 16px; color: #0f172a;">Welcome to ExpanceFlow</h2>
          <p style="margin: 0 0 12px;">
            Your account has been created successfully, and you can now sign in to manage expenses,
            monitor budgets, and keep your financial activity organized in one place.
          </p>
          <p style="margin: 0 0 12px;">
            We are pleased to have you with us and hope ExpanceFlow helps make your day-to-day financial management simpler and more efficient.
          </p>
          <p style="margin: 0 0 12px;">
            If you did not create this account, please contact our support team immediately.
          </p>
          <p style="margin: 24px 0 0;">
            Regards,<br />
            <strong>ExpanceFlow Team</strong>
          </p>
        </div>
      `,
    });

    return { sent: true };
  } catch (error) {
    console.error("Failed to send welcome email:", error);

    return {
      sent: false,
      reason: "User was created, but the welcome email could not be sent.",
    };
  }
}
