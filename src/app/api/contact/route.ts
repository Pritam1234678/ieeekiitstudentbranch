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
        </head>
        <body style="margin:0;padding:0;background-color:#020617;font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          
          <!-- Full Page Outer Container -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#020617; background-image:url('https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1920&auto=format&fit=crop'); background-size:cover; background-position:center; min-height:100vh;">
            <tr>
              <td align="center" style="padding: 60px 20px;">
                
                <!-- Main Glass Card - Centered & Boxed -->
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px; width:100%; background:rgba(15, 23, 42, 0.65); backdrop-filter:blur(40px); -webkit-backdrop-filter:blur(40px); border:1px solid rgba(255, 255, 255, 0.08); border-radius:32px; overflow:hidden; box-shadow:0 40px 80px rgba(0,0,0,0.8), inset 0 2px 0 rgba(255,255,255,0.05); margin: 0 auto;">
        
                  <!-- Header -->
                  <tr>
                    <td style="padding:56px 48px 40px; text-align:center; border-bottom:1px solid rgba(255, 255, 255, 0.05); background:linear-gradient(180deg, rgba(56, 189, 248, 0.08) 0%, rgba(15, 23, 42, 0) 100%);">
                      <!-- Magical AI Badge -->
                      <div style="display:inline-block; margin-bottom:24px; padding:16px; background:linear-gradient(135deg, rgba(56, 189, 248, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%); border-radius:50%; box-shadow:0 0 30px rgba(56, 189, 248, 0.2), inset 0 1px 0 rgba(255,255,255,0.1); border:1px solid rgba(56, 189, 248, 0.2);">
                        <img src="https://cdn-icons-png.flaticon.com/512/9306/9306630.png" alt="AI Core" width="44" height="44" style="display:block; margin:0 auto; filter: drop-shadow(0 0 12px rgba(56, 189, 248, 0.9));" />
                      </div>
                      
                      <div style="margin-bottom:12px;">
                        <span style="font-size:12px; font-weight:700; letter-spacing:0.4em; text-transform:uppercase; color:#38BDF8; background:rgba(56, 189, 248, 0.1); padding:6px 16px; border-radius:30px; border:1px solid rgba(56, 189, 248, 0.2);">IEEE KIIT Automation</span>
                      </div>
                      
                      <!-- Gradient Text manually simulated with text shadow for email support of bright white -->
                      <h1 style="margin:0; font-size:34px; font-weight:800; color:#FFFFFF; letter-spacing:-0.03em; line-height:1.2; text-shadow:0 2px 15px rgba(255,255,255,0.3);">Incoming Transmission</h1>
                      <p style="margin:16px 0 0; font-size:15px; color:#94A3B8; font-weight:400;">A secure message has bypassed the firewall.</p>
                    </td>
                  </tr>
        
                  <!-- Body Content -->
                  <tr>
                    <td style="padding:48px;">
        
                      <!-- Sender Info Grid -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                        <tr>
                          <!-- Name block -->
                          <td width="50%" style="padding:0 8px 16px 0; vertical-align:top;">
                            <div style="background:rgba(255, 255, 255, 0.03); border:1px solid rgba(255, 255, 255, 0.06); border-radius:20px; padding:24px; height: 100%; box-shadow:inset 0 2px 10px rgba(0,0,0,0.2);">
                              <div style="display:inline-block; padding:6px 10px; background:rgba(248, 113, 113, 0.1); border-radius:8px; margin-bottom:12px;">
                                <span style="font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.15em; color:#F87171;">Sender ID</span>
                              </div>
                              <p style="margin:0; font-size:18px; font-weight:700; color:#F8FAFC;">${name}</p>
                            </div>
                          </td>
                          <!-- Email block -->
                          <td width="50%" style="padding:0 0 16px 8px; vertical-align:top;">
                            <div style="background:rgba(255, 255, 255, 0.03); border:1px solid rgba(255, 255, 255, 0.06); border-radius:20px; padding:24px; height: 100%; box-shadow:inset 0 2px 10px rgba(0,0,0,0.2);">
                              <div style="display:inline-block; padding:6px 10px; background:rgba(96, 165, 250, 0.1); border-radius:8px; margin-bottom:12px;">
                                <span style="font-size:10px; font-weight:800; text-transform:uppercase; letter-spacing:0.15em; color:#60A5FA;">Return Path</span>
                              </div>
                              <br>
                              <a href="mailto:${email}" style="margin:0; font-size:16px; font-weight:600; color:#38BDF8; text-decoration:none; word-break:break-all;">${email}</a>
                            </div>
                          </td>
                        </tr>
                      </table>
        
                      <!-- Subject -->
                      <div style="background:rgba(255, 255, 255, 0.03); border:1px solid rgba(255, 255, 255, 0.06); border-radius:20px; padding:28px; margin-bottom:32px; box-shadow:inset 0 2px 10px rgba(0,0,0,0.2);">
                        <p style="margin:0 0 8px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:#64748B;">Directive / Subject</p>
                        <p style="margin:0; font-size:20px; font-weight:600; color:#F1F5F9;">${subject}</p>
                      </div>
        
                      <!-- Message -->
                      <div style="position:relative;">
                        <p style="margin:0 0 12px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.2em; color:#64748B; padding-left:4px;">Decrypted Payload</p>
                        <div style="background:rgba(2, 6, 23, 0.6); border:1px solid rgba(56, 189, 248, 0.2); border-left:4px solid #38BDF8; border-radius:12px 24px 24px 12px; padding:32px; box-shadow:inset 0 4px 20px rgba(0,0,0,0.5);">
                          <p style="margin:0; font-size:16px; line-height:1.8; color:#CBD5E1; white-space:pre-wrap; font-family:'Inter', sans-serif;">${message.replace(/\n/g, '<br>')}</p>
                        </div>
                      </div>
        
                      <!-- Reply CTA -->
                      <div style="margin-top:56px; text-align:center;">
                        <a href="mailto:${email}?subject=Re: ${subject.replace(/"/g, '')}"
                           style="display:inline-block; background:linear-gradient(135deg, #0284C7 0%, #2563EB 100%); color:#FFFFFF; font-size:16px; font-weight:700; text-decoration:none; padding:20px 56px; border-radius:50px; letter-spacing:0.05em; border:1px solid rgba(255,255,255,0.2); box-shadow:0 10px 40px rgba(2, 132, 199, 0.5), inset 0 2px 4px rgba(255,255,255,0.3); transition:all 0.3s ease;">
                          <span style="display:inline-block; vertical-align:middle; margin-right:8px; font-size: 18px;">⟲</span> Initialize Response
                        </a>
                      </div>
                    </td>
                  </tr>
        
                  <!-- Footer -->
                  <tr>
                    <td style="background:rgba(2, 6, 23, 0.85); border-top:1px solid rgba(255, 255, 255, 0.05); padding:32px 48px; text-align:center;">
                      <div style="margin-bottom:16px;">
                        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#38BDF8; margin:0 4px; vertical-align:middle; box-shadow:0 0 12px #38BDF8;"></span>
                        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#38BDF8; margin:0 4px; vertical-align:middle; box-shadow:0 0 12px #38BDF8; opacity:0.4;"></span>
                        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#38BDF8; margin:0 4px; vertical-align:middle; box-shadow:0 0 12px #38BDF8; opacity:0.1;"></span>
                      </div>
                      <p style="margin:0 0 6px; font-size:13px; font-weight:700; color:#475569; letter-spacing:0.15em; text-transform:uppercase;">End of Message Cycle</p>
                      <p style="margin:0; font-size:12px; color:#334155; line-height:1.6;">Automated notification via IEEE KIIT Server Core.<br>System Online.</p>
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

