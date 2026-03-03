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
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.SMTP_USER,
            subject: `[Contact Form] ${subject}`,
            html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <br>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br>')}</p>
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
