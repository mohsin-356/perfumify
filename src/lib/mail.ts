import nodemailer from "nodemailer";
import { env } from "./env";

export async function sendNotificationEmail(subject: string, text: string) {
  try {
    if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS || !env.NOTIFY_EMAIL) {
      return { skipped: true } as const;
    }

    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `Perfumify <${env.SMTP_USER}>`,
      to: env.NOTIFY_EMAIL,
      subject,
      text,
    });

    return { sent: true } as const;
  } catch (e) {
    console.error("Email send error", e);
    return { error: true } as const;
  }
}
