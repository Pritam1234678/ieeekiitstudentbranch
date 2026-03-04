import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

export const submitContactForm = async (req: Request, res: Response) => {
    try {
        const { name, email, subject, message } = req.body;

        // Anti-spam basic check: ensure the request came from a browser with an Origin or Referer header
        // and clearly has a User-Agent. This stops low-effort cURL scripts.
        const origin = req.get('origin') || req.get('referer');
        const userAgent = req.get('user-agent');
        
        if (!origin || !userAgent || userAgent.includes('curl') || userAgent.includes('PostmanRuntime')) {
            return res.status(403).json({ success: false, message: 'Direct script access is forbidden.' });
        }

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for 587
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
            tls: {
                rejectUnauthorized: false
            },
            // This tells Node's underlying net.Socket to only resolve IPv4.
            // On environments like Railway that drop IPv6 packets, this prevents hangs.
            ...({ family: 4 } as any)
        });

        const mailOptions = {
            from: `"IEEE KIIT Support" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER,
            replyTo: `"${name}" <${email}>`,
            subject: `[Contact Form] ${subject}`,
            html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Contact Form Submission</title>
</head>
<body style="margin:0;padding:0;background:#f0f5ff;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f5ff;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0b5ed7 0%,#0a3fa8 100%);border-radius:16px 16px 0 0;padding:32px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(255,255,255,0.65);">IEEE KIIT Student Branch</p>
              <h1 style="margin:0;font-size:24px;font-weight:700;color:#ffffff;letter-spacing:-0.3px;">New Contact Message</h1>
              <p style="margin:10px 0 0;font-size:14px;color:rgba(255,255,255,0.75);">Someone reached out through the website contact form</p>
            </td>
          </tr>

          <!-- Body Card -->
          <tr>
            <td style="background:#ffffff;padding:36px 40px;border-left:1px solid #d6e4ff;border-right:1px solid #d6e4ff;">

              <!-- Sender Info Grid -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td width="50%" style="padding:0 8px 0 0;vertical-align:top;">
                    <div style="background:#f4f8ff;border:1px solid #cddeff;border-radius:12px;padding:16px 18px;">
                      <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#6b8fc7;">Name</p>
                      <p style="margin:0;font-size:15px;font-weight:600;color:#0e2f5e;">${name}</p>
                    </div>
                  </td>
                  <td width="50%" style="padding:0 0 0 8px;vertical-align:top;">
                    <div style="background:#f4f8ff;border:1px solid #cddeff;border-radius:12px;padding:16px 18px;">
                      <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#6b8fc7;">Email</p>
                      <a href="mailto:${email}" style="margin:0;font-size:15px;font-weight:600;color:#0b5ed7;text-decoration:none;">${email}</a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Subject -->
              <div style="background:#f4f8ff;border:1px solid #cddeff;border-radius:12px;padding:16px 18px;margin-bottom:28px;">
                <p style="margin:0 0 4px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#6b8fc7;">Subject</p>
                <p style="margin:0;font-size:16px;font-weight:600;color:#0e2f5e;">${subject}</p>
              </div>

              <!-- Divider -->
              <div style="border-top:1px solid #e4eeff;margin-bottom:24px;"></div>

              <!-- Message -->
              <p style="margin:0 0 12px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;color:#6b8fc7;">Message</p>
              <div style="background:#f9fbff;border-left:4px solid #0b5ed7;border-radius:0 12px 12px 0;padding:20px 22px;">
                <p style="margin:0;font-size:15px;line-height:1.75;color:#1e3a5f;">${message.replace(/\n/g, '<br>')}</p>
              </div>

              <!-- Reply CTA -->
              <div style="margin-top:32px;text-align:center;">
                <a href="mailto:${email}?subject=Re: ${subject.replace(/"/g, '')}"
                   style="display:inline-block;background:linear-gradient(135deg,#0b5ed7,#0a3fa8);color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;padding:14px 36px;border-radius:50px;letter-spacing:0.05em;box-shadow:0 8px 20px rgba(11,94,215,0.3);">
                  ↩ Reply to ${name}
                </a>
                <p style="margin:12px 0 0;font-size:12px;color:#8aa6cc;">Or simply hit Reply — it goes directly to their inbox</p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#0b3a8a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:rgba(255,255,255,0.8);">IEEE KIIT Student Branch</p>
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.45);">This message was sent via the website contact form. Do not reply to this email directly — use the button above.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: 'Message sent successfully.',
        });
    } catch (error) {
        console.error('Contact Form Error:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while sending the message.',
        });
    }
};
