// Transactional email — Nodemailer / SMTP integration.
//
// Used only for password recovery (forgot-password / reset-password). Signup
// no longer sends email; that flow was removed when we dropped the email
// verification gate.
//
// SMTP_HOST, SMTP_USER, SMTP_PASS must be configured at runtime. When any of
// them are missing, `deliver()` logs the message to the server console
// instead so local dev keeps working without real credentials.

import nodemailer, { type Transporter } from "nodemailer";

const FROM = process.env.EMAIL_FROM || process.env.SMTP_USER || "";
const REPLY_TO = process.env.EMAIL_REPLY_TO || "info@kopahi.com";
const APP_URL = process.env.APP_URL || "http://localhost:3000";

interface SendArgs {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

let transporter: Transporter | null = null;
function getTransporter(): Transporter | null {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const port = Number(process.env.SMTP_PORT) || 587;

  if (!host || !user || !pass) return null;

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // implicit TLS on 465; STARTTLS on 587/25
    auth: { user, pass },
  });

  return transporter;
}

async function deliver({ to, subject, text, html }: SendArgs): Promise<void> {
  const t = getTransporter();

  if (!t) {
    console.log("\n────── [email:stub — SMTP not configured] ──────");
    console.log(`To:      ${to}`);
    console.log(`From:    ${FROM || "(unset)"}`);
    console.log(`Subject: ${subject}`);
    console.log(text);
    console.log("─────────────────────────────────────────────────\n");
    return;
  }

  try {
    const info = await t.sendMail({
      from: FROM || undefined,
      to,
      replyTo: REPLY_TO,
      subject,
      text,
      ...(html ? { html } : {}),
    });
    console.log(`[email] sent id=${info.messageId} to=${to} subject="${subject}"`);
  } catch (e) {
    console.error("[email] SMTP send failed:", e);
  }
}

export async function sendPasswordResetEmail({
  to,
  name,
  token,
}: {
  to: string;
  name: string;
  token: string;
}) {
  const url = `${APP_URL}/reset-password/${token}`;
  await deliver({
    to,
    subject: "Reset your Kopahi password",
    text: [
      `Hello ${name},`,
      "",
      "You (or someone using your address) requested a password reset.",
      "Click the link below to choose a new password:",
      url,
      "",
      "This link expires in 1 hour. If you didn't request this, you can ignore this email.",
      "",
      "— Kopahi",
    ].join("\n"),
    html: passwordResetHtml({ name, url }),
  });
}

export async function sendPasswordChangedNotification({
  to,
  name,
}: {
  to: string;
  name: string;
}) {
  await deliver({
    to,
    subject: "Your Kopahi password was changed",
    text: [
      `Hello ${name},`,
      "",
      "This is a confirmation that the password on your Kopahi account was changed.",
      "",
      "If this wasn't you, contact info@kopahi.com immediately.",
      "",
      "— Kopahi",
    ].join("\n"),
    html: passwordChangedHtml({ name }),
  });
}

// ─── brand-wrapped HTML templates ──────────────────────────────────────────

const IVORY = "#F4EDE0";
const MOSS = "#2E3B2A";
const GOLD = "#D4A33A";
const BAMBOO = "#8B6F47";
const INK = "#1A1F18";

function shell(preview: string, body: string): string {
  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><title>Kopahi</title></head>
  <body style="margin:0;padding:0;background:${IVORY};font-family:Georgia,'Times New Roman',serif;color:${INK};">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escapeHtml(preview)}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${IVORY};">
      <tr><td align="center" style="padding:40px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
          <tr><td style="padding:8px 8px 16px 8px;">
            <span style="font-family:Georgia,serif;font-size:22px;color:${MOSS};letter-spacing:0.5px;">Kopahi<span style="color:${GOLD};">.</span></span>
          </td></tr>
          <tr><td style="border-top:1px solid ${BAMBOO};opacity:0.25;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr><td style="padding:32px 8px 24px 8px;font-size:16px;line-height:1.6;color:${INK};">
            ${body}
          </td></tr>
          <tr><td style="border-top:1px solid ${BAMBOO};opacity:0.25;font-size:0;line-height:0;">&nbsp;</td></tr>
          <tr><td style="padding:20px 8px;font-family:Georgia,serif;font-size:12px;font-style:italic;color:#6B6F66;">
            AIBA AGRI NE LLP &middot; Jorhat, Assam, India<br/>
            info@kopahi.com &middot; kopahi.com
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function ctaButton(href: string, label: string): string {
  return `<a href="${escapeAttr(href)}" style="display:inline-block;padding:12px 28px;background:${MOSS};color:${IVORY};text-decoration:none;font-family:Georgia,serif;font-size:14px;letter-spacing:1px;border-radius:2px;">${escapeHtml(label)}</a>`;
}

function passwordResetHtml({ name, url }: { name: string; url: string }) {
  return shell(
    "Reset your Kopahi password.",
    `<p>Hello ${escapeHtml(name)},</p>
     <p>You (or someone using your address) requested a password reset. Use the button below to choose a new password.</p>
     <p style="margin:28px 0;">${ctaButton(url, "Reset password")}</p>
     <p style="font-size:13px;color:#6B6F66;">Or paste this link:<br/><span style="color:${BAMBOO};word-break:break-all;">${escapeHtml(url)}</span></p>
     <p style="font-size:13px;color:#6B6F66;">This link expires in 1 hour. If you didn't request a reset, you can safely ignore this email.</p>
     <p style="font-family:Georgia,serif;font-style:italic;color:${BAMBOO};">— Kopahi</p>`
  );
}

function passwordChangedHtml({ name }: { name: string }) {
  return shell(
    "Your Kopahi password was changed.",
    `<p>Hello ${escapeHtml(name)},</p>
     <p>This is a confirmation that the password on your Kopahi account was changed.</p>
     <p>If this wasn't you, contact <a href="mailto:info@kopahi.com" style="color:${MOSS};">info@kopahi.com</a> immediately.</p>
     <p style="font-family:Georgia,serif;font-style:italic;color:${BAMBOO};">— Kopahi</p>`
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(s: string): string {
  return escapeHtml(s);
}
