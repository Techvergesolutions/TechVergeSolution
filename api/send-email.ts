import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { from_name, reply_to, company_name, message } = req.body;

  if (!from_name || !reply_to || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // 1. NOTIFICATION TO YOU
    await resend.emails.send({
      from: `${from_name} <info@techvergesolution.com>`, 
      to: 'techvergsolutions@gmail.com',
      subject: `New Lead: ${from_name}`,
      // FIX: Changed from reply_to to replyTo
      replyTo: reply_to, 
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #00cfef;">New Project Inquiry</h2>
          <p><strong>Name:</strong> ${from_name}</p>
          <p><strong>Email:</strong> ${reply_to}</p>
          <p><strong>Company:</strong> ${company_name || 'Not provided'}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>`
    });

    // 2. AUTO-REPLY TO CLIENT
    await resend.emails.send({
      from: 'Techverge Solution <info@techvergesolution.com>',
      to: reply_to,
      subject: 'Message Received - Techverge Solution',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #333;">
          <h2 style="color: #00cfef;">Hello ${from_name},</h2>
          <p>Thank you for reaching out to <strong>Techverge Solution</strong>!</p>
          <p>We have received your message regarding <strong>${company_name || 'your project'}</strong>. Our team is currently reviewing your inquiry and will get back to you within 24 hours.</p>
          <br />
          <p>Best Regards,</p>
          <p><strong>The Techverge Team</strong></p>
          <footer style="margin-top: 20px; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 10px;">
            Techverge Solution | Serving Worldwide
          </footer>
        </div>`
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Resend API Error:", error);
    return res.status(500).json({ error: error.message });
  }
}