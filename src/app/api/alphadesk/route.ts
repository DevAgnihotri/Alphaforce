import { NextRequest, NextResponse } from 'next/server';
import { clients } from '@/data/mockData';

// Ollama API endpoint (default local installation)
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'deepseek-r1:1.5b';

interface AlphaDeskRequest {
  type: 'opportunity_insight' | 'call_script' | 'email_draft';
  clientId: string;
  context?: {
    opportunityType?: string;
    opportunityAmount?: number;
    emailPurpose?: string;
    callPurpose?: string;
    additionalNotes?: string;
  };
}

// Helper to get client data
function getClientData(clientId: string) {
  const client = clients.find(c => c.id === clientId);
  if (!client) return null;
  return client;
}

// Generate prompt based on request type
function generatePrompt(request: AlphaDeskRequest, clientData: typeof clients[0]): string {
  const { type, context } = request;
  
  const clientContext = `Client: ${clientData.name} | Risk: ${clientData.risk_profile} | Portfolio: $${clientData.portfolio_value.toLocaleString()} | Conversion: ${clientData.conversion_probability}%`;

  switch (type) {
    case 'opportunity_insight':
      return `Financial advisor: Analyze opportunity for client.

${clientContext}
${context?.additionalNotes ? `Notes: ${context.additionalNotes}` : ''}

Provide brief analysis:
1. Score (1-10)
2. Key strengths (2-3 points)
3. Concerns (1-2 points)
4. Recommended approach`;

    case 'call_script':
      return `Financial advisor: Create a concise, practical call script that centers on the CALL PURPOSE and any ADDITIONAL CONTEXT.

CLIENT: ${clientContext}
PURPOSE: ${context?.callPurpose || 'Follow-up'}
${context?.additionalNotes ? `ADDITIONAL CONTEXT: ${context.additionalNotes}` : ''}

answer in terms of  "you", The entire should reflect the PURPOSE and respect additional context.
- Start with a personalized GREETING that references PURPOSE or a recent interaction.
Provide:
1. Opening (greeting + purpose)
2. 3 talking points
3. 2 objection responses
4. Closing (next steps)`;

    case 'email_draft':
      return `Financial advisor: Draft a complete email that fully reflects the PURPOSE and any ADDITIONAL CONTEXT.

CLIENT: ${clientContext}
PURPOSE: ${context?.emailPurpose || 'Check-in'}
${context?.additionalNotes ? `ADDITIONAL CONTEXT: ${context.additionalNotes}` : ''}

answer in terms of  "you", The entire email should reflect the PURPOSE and respect additional context.
- Start with a personalized GREETING that references PURPOSE or a recent interaction.
Provide:
- Subject line
- Short professional email (3-4 paragraphs)
- Clear call-to-action`;

    default:
      return 'Please provide a valid request type.';
  }
}

// Call Ollama API
async function callOllama(prompt: string): Promise<string> {
  try {
    const response = await fetch(OLLAMA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 2000,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.status}`);
    }

    const data = await response.json();
    return data.response || 'No response generated';
  } catch (error) {
    console.error('Ollama API error:', error);
    // Return mock response if Ollama is not available
    return generateMockResponse(prompt);
  }
}

// Mock response generator when Ollama is not available
function generateMockResponse(prompt: string): string {
  if (prompt.includes('opportunity_insight') || prompt.includes('Opportunity Score')) {
    return `## 🎯 Opportunity Analysis

### Opportunity Score: 8/10

### Key Strengths
1. **Profile Alignment**: This investment aligns well with the client's stated interests and risk tolerance
2. **Portfolio Diversification**: Adds valuable diversification to their current holdings
3. **Growth Potential**: Matches their lifecycle stage and investment timeline
4. **Income Level Support**: Investment amount is appropriate given their income bracket

### Potential Concerns
1. **Market Volatility**: Consider the current market conditions
2. **Liquidity Needs**: Ensure this doesn't impact their emergency fund requirements
3. **Tax Implications**: Review the tax efficiency of this investment vehicle

### Recommended Approach
- Lead with the diversification benefits
- Reference their specific interests when explaining the opportunity
- Use data and projections to support your recommendation
- Address risk concerns proactively

### Alternative Suggestions
If they're hesitant, consider:
- A phased investment approach (dollar-cost averaging)
- A similar but lower-risk alternative
- Starting with a smaller initial investment

*This analysis is based on the client's profile data and should be supplemented with current market research.*`;
  }
  
  if (prompt.includes('call_script') || prompt.includes('OPENING')) {
    return `## 🎯 OPENING (30 seconds)

"Good [morning/afternoon], [Client Name]! This is [Your Name] from AlphaForce Wealth Management. I hope I'm catching you at a good time?"

*[Pause for response]*

"Wonderful! I was reviewing your portfolio earlier today and wanted to touch base with you about some exciting opportunities that align perfectly with your investment interests."

---

## 💬 TALKING POINTS (2-3 minutes)

**Point 1: Portfolio Performance Review**
"First, I wanted to share some great news - your portfolio has shown strong performance this quarter, particularly in the areas you're most interested in."

**Point 2: Market Insights**
"I've been tracking some developments in the market that I think would really interest you, especially given your focus on [their interests]."

**Point 3: Opportunity Discussion**
"Based on your risk profile and goals, I've identified an opportunity that could complement your current strategy nicely."

**Questions to Ask:**
- "How are you feeling about your current investment strategy?"
- "Have your financial goals changed at all since we last spoke?"
- "Is there anything specific you'd like me to focus on for your portfolio?"

---

## 🎤 KEY PHRASES TO USE

1. "Based on what you've shared with me..."
2. "Given your interest in [specific area]..."
3. "I want to make sure this aligns with your goals..."
4. "Let me show you some numbers that I think you'll find interesting..."
5. "Many of my clients in similar situations have found success with..."
6. "What matters most to you when it comes to..."

---

## ⚠️ OBJECTION HANDLING

**"I need to think about it"**
→ "Absolutely, this is an important decision. What specific aspects would you like to consider further? I'm happy to provide any additional information that would help."

**"The market seems uncertain right now"**
→ "I understand that concern completely. That's actually why I think this particular approach makes sense - it's designed to provide stability while still capturing growth opportunities."

**"I'm not sure about the timing"**
→ "That's a thoughtful perspective. Let me share some data on how timing has historically impacted similar investments, and we can discuss what makes sense for your situation."

---

## ✅ CLOSING (30 seconds)

"[Client Name], I really appreciate you taking the time to discuss this with me today. To summarize, we've talked about [key points], and the next step would be [specific action]."

"Would [specific date/time] work for us to connect again and move forward?"

*[Confirm details]*

"Excellent! I'll send you a calendar invite and any supporting materials. Thank you again, and I look forward to helping you achieve your financial goals. Have a wonderful [day/evening]!"`;
  }
  
  if (prompt.includes('email_draft') || prompt.includes('Email Purpose')) {
    return `**Subject Line:** Your Portfolio Update + An Exciting Opportunity for You, [Client Name]

---

Dear [Client Name],

I hope this email finds you well! I was thinking about our last conversation and wanted to reach out with some updates I think you'll find valuable.

**Your Portfolio at a Glance**

I'm pleased to share that your investments have been performing strongly, with your portfolio showing positive momentum in the areas you're most interested in. Your diversified approach continues to serve you well in the current market environment.

**An Opportunity Worth Exploring**

Given your interest in [their interests] and your [risk profile] risk profile, I've identified an investment opportunity that I believe aligns perfectly with your goals. Here's why I think it's worth a conversation:

• **Alignment**: Matches your stated investment preferences
• **Risk Profile**: Appropriate for your comfort level
• **Growth Potential**: Strong fundamentals and outlook
• **Portfolio Fit**: Complements your existing holdings nicely

**Next Steps**

I'd love to discuss this with you in more detail. Would you be available for a brief call this week? I'm flexible with timing and can work around your schedule.

You can reply to this email, or feel free to call me directly at [phone number]. I'm also happy to set up a video call if that's more convenient.

Looking forward to connecting soon!

Warm regards,

[Your Name]
Senior Financial Advisor
AlphaForce Wealth Management
[Phone] | [Email]

---

*P.S. I noticed it's been a little while since we last connected. I always enjoy hearing about what's new with you - please don't hesitate to reach out anytime!*`;
  }
  
  return 'Response generated successfully. Please ensure Ollama is running for full AI-powered responses.';
}

export async function POST(request: NextRequest) {
  try {
    const body: AlphaDeskRequest = await request.json();
    const { type, clientId, context } = body;

    // Validate request
    if (!type || !clientId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: type and clientId' },
        { status: 400 }
      );
    }

    // Get client data
    const clientData = getClientData(clientId);
    if (!clientData) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Generate prompt
    const prompt = generatePrompt({ type, clientId, context }, clientData);

    // Call Ollama
    const response = await callOllama(prompt);

    return NextResponse.json({
      success: true,
      data: {
        type,
        clientId,
        clientName: clientData.name,
        response,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('AlphaDesk API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available clients for the dropdown
  const clientList = clients.map(c => ({
    id: c.id,
    name: c.name,
    email: c.email,
    riskProfile: c.risk_profile,
    portfolioValue: c.portfolio_value,
    lifecycleStage: c.lifecycle_stage,
  }));

  return NextResponse.json({
    success: true,
    data: {
      clients: clientList,
      availableTypes: ['opportunity_insight', 'call_script', 'email_draft'],
      tonalities: ['formal', 'friendly', 'persuasive', 'empathetic'],
    },
  });
}
