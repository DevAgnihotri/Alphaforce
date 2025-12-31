// GET /api/clients/[id] - Return single client with full details

import { NextRequest, NextResponse } from 'next/server';
import { 
  clients, 
  getClientActivities, 
  getClientPortfolio, 
  getClientOpportunities,
  investments,
  getDaysSinceContact,
} from '@/data/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = clients.find(c => c.id === id);

    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Get related data
    const activities = getClientActivities(id);
    const portfolio = getClientPortfolio(id);
    const opportunities = getClientOpportunities(id);
    const daysSinceContact = getDaysSinceContact(client.last_contact);

    // Enrich portfolio with investment details
    const enrichedPortfolio = portfolio.map(holding => {
      const investment = investments.find(inv => inv.id === holding.investment_id);
      return {
        ...holding,
        investment_name: investment?.name || 'Unknown',
        investment_type: investment?.type || 'unknown',
        investment_category: investment?.category || 'Unknown',
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        ...client,
        daysSinceContact,
        activities,
        portfolio: enrichedPortfolio,
        opportunities,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch client' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const clientIndex = clients.findIndex(c => c.id === id);

    if (clientIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    // Update client (in real app, update database)
    const updatedClient = { ...clients[clientIndex], ...body };

    return NextResponse.json({
      success: true,
      data: updatedClient,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to update client' },
      { status: 500 }
    );
  }
}
