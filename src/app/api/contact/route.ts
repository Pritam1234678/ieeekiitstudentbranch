import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP credentials missing from environment variables.');
      return NextResponse.json(
        { success: false, message: 'Server configuration error.' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports (will upgrade connection via STARTTLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
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
          <!-- Keep styling inline for best email client support -->
        </head>
        <body style="margin:0;padding:0;background-color:#050914;font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';-webkit-font-smoothing:antialiased;">
          
          <!-- Outer Background Container -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050914; background-image:url('https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1920&auto=format&fit=crop'); background-size:cover; background-position:center; padding:40px 16px;">
            <tr>
              <td align="center">
                
                <!-- Main Glass Card -->
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:rgba(18, 25, 43, 0.7); backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px); border:1px solid rgba(255, 255, 255, 0.08); border-radius:24px; overflow:hidden; box-shadow:0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);">
        
                  <!-- Header -->
                  <tr>
                    <td style="padding:48px 40px 32px; text-align:center; border-bottom:1px solid rgba(255, 255, 255, 0.05); background:linear-gradient(180deg, rgba(37, 99, 235, 0.1) 0%, rgba(18, 25, 43, 0) 100%);">
                      <!-- Decorative AI Glow -->
                      <div style="display:inline-block; margin-bottom:16px;">
                        <img src="https://img.icons8.com/?size=100&id=GvD7aIDq5B9s&format=png&color=3B82F6" alt="AI Icon" width="40" height="40" style="display:block; margin:0 auto;" />
                      </div>
                      <p style="margin:0 0 12px; font-size:12px; font-weight:600; letter-spacing:0.3em; text-transform:uppercase; color:#60A5FA;">IEEE KIIT Student Branch</p>
                      <h1 style="margin:0; font-size:28px; font-weight:700; color:#FFFFFF; letter-spacing:-0.03em; line-height:1.2;">Incoming Transmission</h1>
                      <p style="margin:12px 0 0; font-size:15px; color:#94A3B8; font-weight:400;">A new high-priority message has arrived via the portal.</p>
                    </td>
                  </tr>
        
                  <!-- Body Content -->
                  <tr>
                    <td style="padding:40px;">
        
                      <!-- Sender Info Grid (Vertical on very small, side-by-side on desktop) -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                        <tr>
                          <!-- Name block -->
                          <td width="50%" style="padding:0 8px 16px 0; vertical-align:top;">
                            <div style="background:rgba(255, 255, 255, 0.03); border:1px solid rgba(255, 255, 255, 0.06); border-radius:16px; padding:20px;">
                              <p style="margin:0 0 6px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.15em; color:#64748B;">Sender Identity</p>
                              <p style="margin:0; font-size:16px; font-weight:600; color:#F8FAFC;">${name}</p>
                            </div>
                          </td>
                          <!-- Email block -->
                          <td width="50%" style="padding:0 0 16px 8px; vertical-align:top;">
                            <div style="background:rgba(255, 255, 255, 0.03); border:1px solid rgba(255, 255, 255, 0.06); border-radius:16px; padding:20px;">
                              <p style="margin:0 0 6px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.15em; color:#64748B;">Return Address</p>
                              <a href="mailto:${email}" style="margin:0; font-size:16px; font-weight:500; color:#3B82F6; text-decoration:none; word-break:break-all;">${email}</a>
                            </div>
                          </td>
                        </tr>
                      </table>
        
                      <!-- Subject -->
                      <div style="background:rgba(255, 255, 255, 0.03); border:1px solid rgba(255, 255, 255, 0.06); border-radius:16px; padding:20px; margin-bottom:32px;">
                        <p style="margin:0 0 6px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.15em; color:#64748B;">Subject Directive</p>
                        <p style="margin:0; font-size:18px; font-weight:500; color:#E2E8F0;">${subject}</p>
                      </div>
        
                      <!-- Message -->
                      <div style="position:relative;">
                        <p style="margin:0 0 12px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.15em; color:#64748B; padding-left:4px;">Decrypted Payload</p>
                        <div style="background:rgba(15, 23, 42, 0.6); border:1px solid rgba(59, 130, 246, 0.2); border-left:4px solid #3B82F6; border-radius:8px 16px 16px 8px; padding:24px; box-shadow:inset 0 2px 10px rgba(0,0,0,0.2);">
                          <p style="margin:0; font-size:16px; line-height:1.7; color:#CBD5E1; white-space:pre-wrap; font-family:'Inter', sans-serif;">${message.replace(/\n/g, '<br>')}</p>
                        </div>
                      </div>
        
                      <!-- Reply CTA -->
                      <div style="margin-top:40px; text-align:center;">
                        <a href="mailto:${email}?subject=Re: ${subject.replace(/"/g, '')}"
                           style="display:inline-block; background:linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%); color:#FFFFFF; font-size:15px; font-weight:600; text-decoration:none; padding:16px 40px; border-radius:50px; letter-spacing:0.02em; border:1px solid rgba(255,255,255,0.1); box-shadow:0 8px 24px rgba(37, 99, 235, 0.3), inset 0 1px 0 rgba(255,255,255,0.2); transition:all 0.3s ease;">
                          <span style="display:inline-block; vertical-align:middle; margin-right:8px;">↩</span> Initiate Reply
                        </a>
                        <p style="margin:16px 0 0; font-size:13px; color:#64748B;">Direct response channel active. Click to reply securely.</p>
                      </div>
                    </td>
                  </tr>
        
                  <!-- Footer -->
                  <tr>
                    <td style="background:rgba(15, 23, 42, 0.8); border-top:1px solid rgba(255, 255, 255, 0.05); padding:32px 40px; text-align:center;">
                      <div style="margin-bottom:16px;">
                        <span style="display:inline-block; width:4px; height:4px; border-radius:50%; background:#3B82F6; margin:0 4px; vertical-align:middle; box-shadow:0 0 8px #3B82F6;"></span>
                        <span style="display:inline-block; width:4px; height:4px; border-radius:50%; background:#3B82F6; margin:0 4px; vertical-align:middle; box-shadow:0 0 8px #3B82F6; opacity:0.5;"></span>
                        <span style="display:inline-block; width:4px; height:4px; border-radius:50%; background:#3B82F6; margin:0 4px; vertical-align:middle; box-shadow:0 0 8px #3B82F6; opacity:0.25;"></span>
                      </div>
                      <p style="margin:0 0 6px; font-size:14px; font-weight:600; color:#94A3B8; letter-spacing:0.05em;">SYSTEM AUTOMATION</p>
                      <p style="margin:0; font-size:12px; color:#475569; line-height:1.5;">Generated by IEEE KIIT Server Core.<br>End of transmission.</p>
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

    return NextResponse.json(
      { success: true, message: 'Message sent successfully.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact Form Error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred while sending the message.' },
      { status: 500 }
    );
  }
}
