// POST /api/email - Send email to client (Mock/Demo Mode)

import { NextRequest, NextResponse } from 'next/server';

// Email configuration - Mock mode for hackathon demo
// No external dependencies required - emails are simulated

interface EmailRequest {
  to: string;
  subject: string;
  body: string;
  clientName: string;
  clientId: string;
}

// In-memory email log for demo purposes
const emailLog: Array<{
  id: string;
  to: string;
  subject: string;
  body: string;
  clientName: string;
  clientId: string;
  timestamp: string;
  status: 'sent' | 'pending';
}> = [];

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

    // Simulate sending delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate mock message ID
    const messageId = `mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const timestamp = new Date().toISOString();

    // Log the email (for demo purposes)
    emailLog.push({
      id: messageId,
      to,
      subject,
      body: emailBody,
      clientName,
      clientId,
      timestamp,
      status: 'sent',
    });

    console.log('📧 EMAIL SENT (Demo Mode)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Client: ${clientName} (${clientId})`);
    console.log(`Message ID: ${messageId}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return NextResponse.json({
      success: true,
      message: 'Email sent successfully (Demo Mode)',
      mock: true,
      data: {
        messageId,
        to,
        subject,
        clientName,
        clientId,
        timestamp,
      },
    });

  } catch (error) {
    console.error('Email error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process email' 
      },
      { status: 500 }
    );
  }
}

// GET: Retrieve sent emails log (for demo/testing)
export async function GET() {
  return NextResponse.json({
    success: true,
    mock: true,
    data: {
      emails: emailLog,
      count: emailLog.length,
    },
  });
}
