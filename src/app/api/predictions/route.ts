// POST /api/predictions - Generate ML predictions for a client

import { NextRequest, NextResponse } from 'next/server';
import { clients, investments, getClientPortfolio } from '@/data/mockData';

interface Recommendation {
  investment_id: string;
  investment_name: string;
  confidence: number;
  reason: string;
}

function calculatePredictions(clientId: string): Recommendation[] {
  const client = clients.find(c => c.id === clientId);
  if (!client) return [];

  const portfolio = getClientPortfolio(clientId);
  const existingInvestmentIds = new Set(portfolio.map(p => p.investment_id));

  // Score each investment based on client profile
  const recommendations = investments
    .filter(inv => !existingInvestmentIds.has(inv.id)) // Exclude already owned
    .map(inv => {
      let score = 50; // Base score
      const reasons: string[] = [];

      // Risk matching (most important)
      if (inv.risk_level === client.risk_profile) {
        score += 25;
        reasons.push(`Matches ${client.risk_profile} risk profile`);
      } else if (
        (inv.risk_level === 'medium' && client.risk_profile !== 'low') ||
        (inv.risk_level === 'low' && client.risk_profile === 'medium')
      ) {
        score += 10;
        reasons.push('Compatible risk level');
      } else {
        score -= 15;
      }

      // Interest matching
      const interestKeywords = client.interests.join(' ').toLowerCase();
      if (
        interestKeywords.includes(inv.category.toLowerCase()) ||
        interestKeywords.includes(inv.type.replace('_', ' '))
      ) {
        score += 15;
        reasons.push(`Aligns with interest in ${inv.category}`);
      }

      // Income-based scoring
      if (client.income > 100000 && inv.min_investment > 3000) {
        score += 10;
        reasons.push('Suitable for income level');
      }

      // Age-based adjustments
      if (client.age < 35 && inv.risk_level === 'high') {
        score += 10;
        reasons.push('Growth potential for younger investor');
      } else if (client.age > 50 && inv.risk_level === 'low') {
        score += 10;
        reasons.push('Stability for retirement planning');
      }

      // Portfolio diversification bonus
      if (portfolio.length > 0) {
        const existingTypes = new Set(portfolio.map(p => {
          const existingInv = investments.find(i => i.id === p.investment_id);
          return existingInv?.type;
        }));
        if (!existingTypes.has(inv.type)) {
          score += 10;
          reasons.push('Adds portfolio diversification');
        }
      }

      // Normalize score to 0-100
      score = Math.min(100, Math.max(0, score));

      return {
        investment_id: inv.id,
        investment_name: inv.name,
        confidence: score,
        reason: reasons.length > 0 ? reasons.join('. ') : 'General market opportunity',
      };
    })
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3); // Top 3 recommendations

  return recommendations;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { client_id } = body;

    if (!client_id) {
      return NextResponse.json(
        { success: false, error: 'client_id is required' },
        { status: 400 }
      );
    }

    const client = clients.find(c => c.id === client_id);
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    const recommendations = calculatePredictions(client_id);

    return NextResponse.json({
      success: true,
      data: {
        client_id,
        client_name: client.name,
        recommendations,
        generated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate predictions' },
      { status: 500 }
    );
  }
}
