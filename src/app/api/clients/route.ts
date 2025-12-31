// GET /api/clients - Return all clients
// POST /api/clients - Create new client

import { NextRequest, NextResponse } from 'next/server';
import { clients, Account } from '@/data/mockData';

// In-memory store (for demo - in production use a real database)
const clientsStore = [...clients];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: clientsStore,
      count: clientsStore.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newClient: Account = {
      id: `client_${Date.now()}`,
      client_id: `client_${Date.now()}`,
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      age: body.age || 30,
      income: body.income || 50000,
      risk_profile: body.risk_profile || 'medium',
      portfolio_value: body.portfolio_value || 0,
      total_investments: 0,
      lifecycle_stage: 'lead',
      last_contact: new Date().toISOString().split('T')[0],
      conversion_probability: 50,
      interests: body.interests || [],
      preferred_contact: body.preferred_contact || 'email',
    };

    clientsStore.push(newClient);

    return NextResponse.json({
      success: true,
      data: newClient,
    }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to create client' },
      { status: 500 }
    );
  }
}
