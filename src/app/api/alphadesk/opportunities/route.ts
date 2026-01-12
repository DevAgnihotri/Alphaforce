import { NextResponse } from 'next/server';
import { opportunities, clients } from '@/data/mockData';

// GET - Fetch all Salesforce opportunities with client names
export async function GET() {
  try {
    // Enrich opportunities with client names
    const enrichedOpportunities = opportunities.map(opp => {
      const client = clients.find(c => c.id === opp.client_id);
      return {
        ...opp,
        clientName: client?.name || 'Unknown Client',
      };
    });

    // Sort by probability (highest first) and then by created_date (newest first)
    const sortedOpportunities = enrichedOpportunities.sort((a, b) => {
      if (b.probability !== a.probability) {
        return b.probability - a.probability;
      }
      return new Date(b.created_date).getTime() - new Date(a.created_date).getTime();
    });

    return NextResponse.json({
      success: true,
      data: {
        opportunities: sortedOpportunities,
        summary: {
          total: sortedOpportunities.length,
          open: sortedOpportunities.filter(o => o.status === 'open').length,
          won: sortedOpportunities.filter(o => o.status === 'won').length,
          lost: sortedOpportunities.filter(o => o.status === 'lost').length,
          totalValue: sortedOpportunities.reduce((sum, o) => sum + o.amount, 0),
          avgProbability: sortedOpportunities.length > 0 
            ? Math.round(sortedOpportunities.reduce((sum, o) => sum + o.probability, 0) / sortedOpportunities.length)
            : 0,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch opportunities' },
      { status: 500 }
    );
  }
}
