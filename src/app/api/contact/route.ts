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
        <body style="margin:0;padding:0;background-color:#F8FAFC;font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F8FAFC; width:100%; max-width:100%;">
            <tr>
              <td align="center">
                
                <!-- Main Container -->
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:650px; width:100%; background-color:#FFFFFF; margin:0 auto; box-shadow:0 10px 40px rgba(0,0,0,0.08);">
        
                  <!-- Hero Image Header -->
                  <tr>
                    <td style="position:relative; background-color:#1E293B; background-image:url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop'); background-size:cover; background-position:center; height:280px; text-align:center; vertical-align:middle;">
                      <!-- Dark Overlay -->
                      <div style="background-color:rgba(15, 23, 42, 0.6); position:absolute; top:0; left:0; width:100%; height:100%;"></div>
                      
                      <!-- Header Content -->
                      <div style="position:relative; z-index:10; padding:40px 20px;">
                        <span style="display:inline-block; padding:6px 16px; background:rgba(255,255,255,0.2); backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px); border-radius:50px; color:#FFFFFF; font-size:11px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; margin-bottom:16px; border:1px solid rgba(255,255,255,0.3);">IEEE KIIT Branch</span>
                        <h1 style="margin:0; font-size:38px; font-weight:800; color:#FFFFFF; letter-spacing:-0.04em; line-height:1.1; text-shadow:0 4px 20px rgba(0,0,0,0.5);">New Inquiry</h1>
                        <p style="margin:12px 0 0; font-size:16px; color:rgba(255,255,255,0.9); font-weight:400; text-shadow:0 2px 10px rgba(0,0,0,0.5);">Someone wants to connect with the team.</p>
                      </div>
                    </td>
                  </tr>
        
                  <!-- Content Body -->
                  <tr>
                    <td style="padding:48px 40px;">
        
                      <!-- Subject Highlight -->
                      <div style="margin-bottom:40px;">
                        <span style="font-size:12px; font-weight:700; color:#3B82F6; text-transform:uppercase; letter-spacing:0.1em;">Regarding</span>
                        <h2 style="margin:8px 0 0; font-size:24px; font-weight:700; color:#0F172A; line-height:1.3; border-left:4px solid #3B82F6; padding-left:16px;">${subject}</h2>
                      </div>
        
                      <!-- Two Column Info -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:40px;">
                        <tr>
                          <!-- Name -->
                          <td width="50%" style="padding-right:12px; vertical-align:top;">
                            <p style="margin:0 0 4px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:#94A3B8;">From</p>
                            <p style="margin:0; font-size:16px; font-weight:600; color:#1E293B;">${name}</p>
                          </td>
                          <!-- Email -->
                          <td width="50%" style="padding-left:12px; vertical-align:top;">
                            <p style="margin:0 0 4px; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.1em; color:#94A3B8;">Reply To</p>
                            <a href="mailto:${email}" style="margin:0; font-size:16px; font-weight:600; color:#3B82F6; text-decoration:none;">${email}</a>
                          </td>
                        </tr>
                      </table>
        
                      <!-- Message Area -->
                      <div style="background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:32px; margin-bottom:40px;">
                        <img src="https://cdn-icons-png.flaticon.com/512/2983/2983788.png" width="24" height="24" style="opacity:0.2; margin-bottom:16px; display:block;" alt="Quote" />
                        <p style="margin:0; font-size:16px; line-height:1.8; color:#334155; white-space:pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
                      </div>
        
                      <!-- CTA Button -->
                      <div style="text-align:center;">
                        <a href="mailto:${email}?subject=Re: ${subject.replace(/"/g, '')}"
                           style="display:inline-block; background-color:#0F172A; color:#FFFFFF; font-size:15px; font-weight:600; text-decoration:none; padding:18px 48px; border-radius:8px; transition:all 0.3s ease;">
                          Respond Immediately →
                        </a>
                      </div>
        
                    </td>
                  </tr>
        
                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#F1F5F9; border-top:1px solid #E2E8F0; padding:32px 40px; text-align:center;">
                      <img src="https://cdn-icons-png.flaticon.com/512/6105/6105490.png" width="32" height="32" style="margin:0 auto 12px; opacity:0.6; display:block;" alt="Security" />
                      <p style="margin:0 0 4px; font-size:12px; font-weight:700; color:#64748B; letter-spacing:0.05em; text-transform:uppercase;">IEEE KIIT Automation</p>
                      <p style="margin:0; font-size:12px; color:#94A3B8;">This email was securely delivered from the main portal.<br>Powered by Vercel Edge.</p>
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
