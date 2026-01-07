import { NextResponse } from 'next/server';

interface SyncStats {
  totalRecords: number;
  lastFullSync: string;
  syncHealth: number;
  apiCallsToday: number;
  apiCallsLimit: number;
}

// Mock stats storage (in production, this would be in a database)
let stats: SyncStats = {
  totalRecords: 110,
  lastFullSync: new Date().toLocaleString(),
  syncHealth: 98,
  apiCallsToday: 245,
  apiCallsLimit: 10000,
};

// GET: Get current sync statistics
export async function GET() {
  try {
    // Simulate slight variations in stats
    const currentStats = {
      ...stats,
      syncHealth: Math.min(100, stats.syncHealth + Math.floor(Math.random() * 3) - 1),
      apiCallsToday: stats.apiCallsToday + Math.floor(Math.random() * 5),
    };

    return NextResponse.json({
      success: true,
      data: currentStats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Salesforce stats' },
      { status: 500 }
    );
  }
}

// POST: Update stats after sync
export async function POST() {
  try {
    stats = {
      ...stats,
      lastFullSync: new Date().toLocaleString(),
      apiCallsToday: stats.apiCallsToday + 4, // Each sync uses ~4 API calls
      syncHealth: Math.min(100, stats.syncHealth + 1),
    };

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update Salesforce stats' },
      { status: 500 }
    );
  }
}
