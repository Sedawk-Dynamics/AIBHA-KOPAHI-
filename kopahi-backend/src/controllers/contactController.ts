import type { Request, Response } from "express";
import db from "../db";
import asyncHandler from "../middleware/asyncHandler";
import { sendEmail, escapeHtml } from "../utils/sendEmail";
import logger from "../utils/logger";

export const sendLead = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, phone, message, subject } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "Name, email and message are required",
    });
  }

  const lead = await db.leads.create({
    name,
    email,
    phone: phone || "",
    message,
    source: subject ? `Website (${subject})` : "Website",
    emailDelivered: false,
  });

  if (!lead) {
    return res.status(500).json({ success: false, message: "Could not save lead" });
  }

  let emailDelivered = false;
  let emailError = "";
  try {
    const result = await sendEmail({
      subject: "New Kopahi Lead",
      html: `
        <h2>Lead received</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "—")}</p>
        ${subject ? `<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
      `,
    });
    emailDelivered = !("skipped" in result && result.skipped);
    if ("skipped" in result && result.skipped) {
      emailError = "SMTP not configured";
      logger.warn("contact_email_skipped", {
        leadId: String(lead.id),
        reason: "smtp_not_configured",
        requestId: req.id,
      });
    } else {
      logger.info("contact_email_sent", {
        leadId: String(lead.id),
        messageId: (result as { messageId: string }).messageId,
        requestId: req.id,
      });
    }
  } catch (err) {
    emailError = (err as Error).message || "Send failed";
    logger.error("contact_email_failed", {
      leadId: String(lead.id),
      err: (err as Error).message,
      requestId: req.id,
    });
  }

  await db.leads.updateById(String(lead.id), { emailDelivered, emailError });

  res.status(201).json({
    success: true,
    message: "Thanks — we'll get back to you within 24 hours",
    lead,
  });
});
