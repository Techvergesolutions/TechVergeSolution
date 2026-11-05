import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isHoneypotFilled(body: Record<string, unknown>): boolean {
  const traps = ['website_url', '_gotcha', 'company_fax'];
  return traps.some((key) => {
    const v = body[key];
    return typeof v === 'string' && v.trim().length > 0;
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = (req.body ?? {}) as Record<string, unknown>;

  // Silent spam drop — look like success so bots don't retry
  if (isHoneypotFilled(body)) {
    return res.status(200).json({ success: true });
  }

  // Support both legacy and new field names
  const from_name = String(body.from_name ?? body.full_name ?? '').trim();
  const reply_to = String(body.reply_to ?? body.email ?? body.work_email ?? '').trim();
  const company_name = String(body.company_name ?? body.company ?? '').trim();
  const message = String(body.message ?? body.additional_details ?? '').trim();

  const website = String(body.website ?? '').trim();
  const automate = String(body.automate ?? body.what_to_automate ?? '').trim();
  const volume = String(body.volume ?? body.monthly_volume ?? '').trim();
  const current_tools = String(body.current_tools ?? body.tools_crm ?? '').trim();
  const budget = String(body.budget ?? body.estimated_budget ?? '').trim();

  if (!from_name || !reply_to || !message) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(reply_to)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const safeName = escapeHtml(from_name);
  const safeEmail = escapeHtml(reply_to);
  const safeCompany = escapeHtml(company_name || 'Not provided');
  const safeMessage = escapeHtml(message);
  const safeWebsite = escapeHtml(website || 'Not provided');
  const safeAutomate = escapeHtml(automate || 'Not provided');
  const safeVolume = escapeHtml(volume || 'Not provided');
  const safeTools = escapeHtml(current_tools || 'Not provided');
  const safeBudget = escapeHtml(budget || 'Not provided');

  const subjectName = from_name.replace(/[\r\n]/g, ' ').slice(0, 80);

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'Email service is not configured.' });
  }

  try {
    // 1. NOTIFICATION TO TECHVERGE (fixed From — never put user input in From header)
    // Resend returns { data, error } and does NOT throw on API failures
    const notify = await resend.emails.send({
      from: 'Techverge Solution <info@techvergesolution.com>',
      to: 'techvergsolutions@gmail.com',
      subject: `New Project Inquiry: ${subjectName}`,
      replyTo: reply_to,
      html: `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; border-collapse: collapse; border: 1px solid #e5e7eb; border-radius: 8px;">
          <tr>
            <td style="padding: 24px; color: #334155;">
              <h2 style="margin: 0 0 20px; color: #0f172a; font-size: 20px; font-weight: 600;">New Project Inquiry</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; font-size: 14px; line-height: 1.5;">
                <tr><td style="padding: 6px 0; color: #64748b; width: 160px; vertical-align: top;"><strong style="color: #0f172a;">Name</strong></td><td style="padding: 6px 0;">${safeName}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b; vertical-align: top;"><strong style="color: #0f172a;">Email</strong></td><td style="padding: 6px 0;"><a href="mailto:${safeEmail}" style="color: #2563eb; text-decoration: none;">${safeEmail}</a></td></tr>
                <tr><td style="padding: 6px 0; color: #64748b; vertical-align: top;"><strong style="color: #0f172a;">Company</strong></td><td style="padding: 6px 0;">${safeCompany}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b; vertical-align: top;"><strong style="color: #0f172a;">Website</strong></td><td style="padding: 6px 0;">${safeWebsite}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b; vertical-align: top;"><strong style="color: #0f172a;">What to automate</strong></td><td style="padding: 6px 0;">${safeAutomate}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b; vertical-align: top;"><strong style="color: #0f172a;">Monthly volume</strong></td><td style="padding: 6px 0;">${safeVolume}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b; vertical-align: top;"><strong style="color: #0f172a;">Current tools / CRM</strong></td><td style="padding: 6px 0;">${safeTools}</td></tr>
                <tr><td style="padding: 6px 0; color: #64748b; vertical-align: top;"><strong style="color: #0f172a;">Estimated budget</strong></td><td style="padding: 6px 0;">${safeBudget}</td></tr>
              </table>
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
              <p style="margin: 0 0 8px;"><strong style="color: #0f172a;">Additional details</strong></p>
              <p style="margin: 0; white-space: pre-wrap; color: #334155;">${safeMessage}</p>
            </td>
          </tr>
        </table>`,
    });

    if (notify.error) {
      console.error('Resend notify error:', notify.error);
      return res.status(500).json({ error: notify.error.message || 'Failed to send notification email.' });
    }

    // 2. AUTO-REPLY TO CLIENT (generic thank-you)
    const autoReply = await resend.emails.send({
      from: 'Techverge Solution <info@techvergesolution.com>',
      to: reply_to,
      subject: 'Message Received - Techverge Solution',
      html: `
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; border-collapse: collapse;">
          <tr>
            <td style="padding: 24px; color: #334155;">
              <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 20px; font-weight: 600;">Hello ${safeName},</h2>
              <p style="margin: 0 0 12px; font-size: 14px; line-height: 1.6;">Thank you for reaching out to <strong style="color: #0f172a;">Techverge Solution</strong>!</p>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6;">We've received your project inquiry${
                company_name ? ` for <strong style="color: #0f172a;">${safeCompany}</strong>` : ''
              }. Our team will review your workflow and get back to you within 24 hours.</p>
              <p style="margin: 0 0 4px; font-size: 14px;">Best Regards,</p>
              <p style="margin: 0; font-size: 14px;"><strong style="color: #0f172a;">The Techverge Team</strong></p>
              <p style="margin: 24px 0 0; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 11px; color: #94a3b8;">
                Techverge Solution | Serving Worldwide
              </p>
            </td>
          </tr>
        </table>`,
    });

    if (autoReply.error) {
      // Notification already sent — log but still report partial success
      console.error('Resend auto-reply error:', autoReply.error);
    }

    return res.status(200).json({ success: true });
  } catch (error: unknown) {
    console.error('Resend API Error:', error);
    const messageText = error instanceof Error ? error.message : 'Failed to send email';
    return res.status(500).json({ error: messageText });
  }
}
