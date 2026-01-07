// POST /api/ai - Generate AI insights using Ollama

import { NextRequest, NextResponse } from 'next/server';

// Ollama API configuration
const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

interface AIRequest {
  prompt: string;
  type: 'talking_points' | 'client_insights' | 'investment_advice' | 'email_draft' | 'custom';
  context?: {
    clientName?: string;
    riskProfile?: string;
    portfolioValue?: number;
    investments?: string[];
    lastContact?: string;
    lifecycleStage?: string;
    conversionProbability?: number;
  };
}

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

// System prompts for different AI tasks
const SYSTEM_PROMPTS = {
  talking_points: `You are a financial advisor assistant. Generate 3-5 concise, actionable talking points for a client call. 
Focus on:
- Personalized insights based on their risk profile
- Recent market trends relevant to their portfolio
- Specific recommendations or discussion topics
Keep each point to 1-2 sentences. Be professional but warm.`,

  client_insights: `You are a financial analytics AI. Analyze the client data and provide:
- Key observations about their financial profile
- Potential opportunities based on their risk tolerance
- Areas of concern or attention
- Suggested next steps for the advisor
Be concise and data-driven.`,

  investment_advice: `You are an investment advisor AI. Based on the client's profile, suggest:
- Asset allocation recommendations
- Specific investment opportunities
- Risk management strategies
- Portfolio optimization suggestions
Always include appropriate disclaimers.`,

  email_draft: `You are a professional communication assistant for financial advisors. 
Write a professional, personalized email to the client.
- Keep it concise (150-200 words max)
- Be warm but professional
- Include a clear call to action
- Reference their specific situation when context is provided`,

  custom: `You are a helpful AI assistant for financial advisors. Provide accurate, professional responses.`,
};

export async function POST(request: NextRequest) {
  try {
    const body: AIRequest = await request.json();
    const { prompt, type, context } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Build the full prompt with context
    let fullPrompt = SYSTEM_PROMPTS[type] + '\n\n';
    
    if (context) {
      fullPrompt += 'CLIENT CONTEXT:\n';
      if (context.clientName) fullPrompt += `- Name: ${context.clientName}\n`;
      if (context.riskProfile) fullPrompt += `- Risk Profile: ${context.riskProfile}\n`;
      if (context.portfolioValue) fullPrompt += `- Portfolio Value: $${context.portfolioValue.toLocaleString()}\n`;
      if (context.investments?.length) fullPrompt += `- Current Investments: ${context.investments.join(', ')}\n`;
      if (context.lastContact) fullPrompt += `- Last Contact: ${context.lastContact}\n`;
      if (context.lifecycleStage) fullPrompt += `- Lifecycle Stage: ${context.lifecycleStage}\n`;
      if (context.conversionProbability) fullPrompt += `- Conversion Probability: ${context.conversionProbability}%\n`;
      fullPrompt += '\n';
    }
    
    fullPrompt += `USER REQUEST: ${prompt}`;

    // Check if Ollama is available
    try {
      const healthCheck = await fetch(`${OLLAMA_BASE_URL}/api/tags`, {
        method: 'GET',
        signal: AbortSignal.timeout(3000),
      });
      
      if (!healthCheck.ok) {
        throw new Error('Ollama not responding');
      }
    } catch {
      // Ollama not available - return demo response
      console.log('⚠️ Ollama not available, returning demo response');
      return NextResponse.json({
        success: true,
        demo: true,
        message: 'Ollama not running - returning demo response. Start Ollama with: ollama serve',
        data: {
          response: generateDemoResponse(type, context),
          model: 'demo',
          type,
        },
      });
    }

    // Call Ollama API
    const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: fullPrompt,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          num_predict: 500,
        },
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      throw new Error(`Ollama error: ${errorText}`);
    }

    const result: OllamaResponse = await ollamaResponse.json();

    return NextResponse.json({
      success: true,
      data: {
        response: result.response,
        model: result.model,
        type,
        context: context?.clientName ? { clientName: context.clientName } : undefined,
      },
    });

  } catch (error) {
    console.error('AI generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate AI response' 
      },
      { status: 500 }
    );
  }
}

// Demo responses when Ollama is not available
function generateDemoResponse(type: string, context?: AIRequest['context']): string {
  const clientName = context?.clientName || 'the client';
  const riskProfile = context?.riskProfile || 'moderate';
  
  switch (type) {
    case 'talking_points':
      return `**Talking Points for ${clientName}:**

1. **Portfolio Performance Review**: Discuss recent market trends and how their ${riskProfile}-risk portfolio has performed relative to benchmarks.

2. **Rebalancing Opportunity**: With current market conditions, consider discussing a potential rebalancing to optimize their asset allocation.

3. **Tax-Loss Harvesting**: If applicable, explore opportunities for tax optimization before year-end.

4. **Long-term Goals Check-in**: Revisit their financial goals and timeline to ensure current strategy remains aligned.

5. **New Investment Opportunities**: Present 1-2 investment options that match their risk profile and interests.`;

    case 'client_insights':
      return `**Client Analysis for ${clientName}:**

📊 **Key Observations:**
- Risk tolerance indicates preference for ${riskProfile} growth strategies
- Portfolio shows diversification across multiple asset classes
- Engagement level suggests high interest in proactive management

💡 **Opportunities:**
- Consider increasing exposure to growth sectors given current risk appetite
- Explore tax-advantaged investment vehicles
- Potential for upselling additional advisory services

⚠️ **Attention Areas:**
- Review sector concentration to ensure adequate diversification
- Schedule regular check-ins to maintain engagement

📋 **Recommended Actions:**
1. Schedule portfolio review meeting
2. Prepare personalized investment recommendations
3. Discuss long-term wealth planning options`;

    case 'investment_advice':
      return `**Investment Recommendations for ${clientName}:**

Based on the ${riskProfile} risk profile:

📈 **Suggested Allocation:**
- Equities: 60% (diversified across sectors)
- Fixed Income: 30% (high-quality bonds)
- Alternatives: 10% (REITs, commodities)

💼 **Specific Opportunities:**
1. Index funds tracking broad market indices
2. Dividend-paying blue-chip stocks
3. Municipal bonds for tax efficiency

⚖️ **Risk Management:**
- Maintain emergency fund outside investments
- Consider dollar-cost averaging for new positions
- Set stop-loss levels for volatile positions

⚠️ *Disclaimer: This is general guidance. Please consult for personalized advice based on complete financial picture.*`;

    case 'email_draft':
      return `Subject: Checking In - Portfolio Update & Next Steps

Dear ${clientName},

I hope this message finds you well. I wanted to reach out to schedule a brief call to review your portfolio and discuss some exciting opportunities I've identified that align with your investment goals.

The markets have been dynamic lately, and I believe there are some strategic moves we could consider to optimize your portfolio's performance while maintaining your preferred risk level.

Would you be available for a 20-minute call this week? I'm flexible on timing and want to ensure we keep your financial goals on track.

Looking forward to connecting soon.

Best regards,
Your Financial Advisor
AlphaForce`;

    default:
      return 'AI response generated successfully. For full AI capabilities, ensure Ollama is running with: `ollama serve`';
  }
}
