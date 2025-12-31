// GET /api/activities - Return all activities
// POST /api/activities - Log new activity

import { NextRequest, NextResponse } from 'next/server';
import { activities, Activity, clients } from '@/data/mockData';

// In-memory store (for demo)
const activitiesStore = [...activities];

export async function GET() {
  try {
    // Sort by date descending (most recent first)
    const sortedActivities = [...activitiesStore].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return NextResponse.json({
      success: true,
      data: sortedActivities,
      count: sortedActivities.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { client_id, type, outcome, notes } = body;

    // Validate required fields
    if (!client_id || !type || !outcome) {
      return NextResponse.json(
        { success: false, error: 'client_id, type, and outcome are required' },
        { status: 400 }
      );
    }

    // Check if client exists
    const client = clients.find(c => c.id === client_id);
    if (!client) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    const newActivity: Activity = {
      id: `act_${Date.now()}`,
      client_id,
      type,
      date: body.date || new Date().toISOString().split('T')[0],
      outcome,
      notes: notes || '',
    };

    activitiesStore.unshift(newActivity); // Add to beginning

    // In real app, update client's last_contact here

    return NextResponse.json({
      success: true,
      data: newActivity,
      message: 'Activity logged successfully',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to log activity' },
      { status: 500 }
    );
  }
}
