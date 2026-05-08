import nodemailer, { Transporter } from "nodemailer";

export const escapeHtml = (str: unknown = ""): string =>
  String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildTransport = (): Transporter | null => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
};

export type SendEmailArgs = {
  to?: string;
  subject: string;
  html?: string;
  text?: string;
};

export type SendEmailResult =
  | { skipped: true }
  | { skipped?: false; messageId: string };

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: SendEmailArgs): Promise<SendEmailResult> => {
  const transporter = buildTransport();
  if (!transporter) {
    // eslint-disable-next-line no-console
    console.warn("[email] SMTP not configured — skipping send");
    return { skipped: true };
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: to || process.env.SMTP_USER,
    subject,
    html,
    text,
  });

  return { messageId: info.messageId };
};

export default { sendEmail, escapeHtml };
