// POST /api/email - Send email to client

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email configuration - Uses environment variables
// For development, you can use services like:
// - Mailtrap (https://mailtrap.io) - Free testing
// - Gmail with App Password
// - SendGrid, Mailgun, etc.

interface EmailRequest {
  to: string;
  subject: string;
  body: string;
  clientName: string;
  clientId: string;
}

// Create transporter based on environment
function createTransporter() {
  // Check if using Gmail
  if (process.env.EMAIL_SERVICE === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    });
  }

  // Default: Use SMTP settings (works with Mailtrap, SendGrid, etc.)
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'sandbox.smtp.mailtrap.io',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASSWORD || '',
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json();
    const { to, subject, body: emailBody, clientName, clientId } = body;

    // Validate required fields
    if (!to || !subject || !emailBody) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: to, subject, body' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address format' },
        { status: 400 }
      );
    }

    // Check if email is configured
    const isConfigured = process.env.SMTP_USER || process.env.EMAIL_USER;
    
    if (!isConfigured) {
      // Demo mode - log instead of sending
      console.log('📧 EMAIL DEMO MODE (configure .env.local for real sending)');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body: ${emailBody}`);
      console.log(`Client: ${clientName} (${clientId})`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      return NextResponse.json({
        success: true,
        message: 'Email logged (demo mode - configure SMTP for real sending)',
        demo: true,
        data: {
          to,
          subject,
          clientName,
          clientId,
          timestamp: new Date().toISOString(),
        },
      });
    }

    // Create transporter and send email
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'advisor@alphaforce.com',
      to,
      subject,
      text: emailBody,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6, #1d4ed8); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">AlphaForce</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0;">Your Financial Advisor</p>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <p style="color: #374151; line-height: 1.6; white-space: pre-wrap;">${emailBody}</p>
          </div>
          <div style="padding: 20px; background: #1f2937; text-align: center;">
            <p style="color: #9ca3af; margin: 0; font-size: 12px;">
              Sent via AlphaForce Advisor Copilot
            </p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Email sent successfully',
      data: {
        messageId: info.messageId,
        to,
        subject,
        clientName,
        clientId,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to send email' 
      },
      { status: 500 }
    );
  }
}
