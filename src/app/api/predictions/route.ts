// POST /api/predictions - Generate ML predictions for a client

import { NextRequest, NextResponse } from 'next/server';
import { clients, getClientPortfolio } from '@/data/mockData';
import { scoreInvestmentsForClient } from '@/lib/mlScoring';

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

    const portfolio = getClientPortfolio(client_id);
    const scoringResult = scoreInvestmentsForClient(client, portfolio);

    return NextResponse.json({
      success: true,
      data: {
        client_id,
        client_name: client.name,
        recommendations: scoringResult.recommendations,
        overall_score: scoringResult.overall_score,
        scoring_factors: scoringResult.scoring_factors,
        generated_at: new Date().toISOString(),
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to generate predictions' },
      { status: 500 }
    );
  }
}
