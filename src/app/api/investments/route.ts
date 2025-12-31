// GET /api/investments - Return all investment products

import { NextResponse } from 'next/server';
import { investments } from '@/data/mockData';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: investments,
      count: investments.length,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch investments' },
      { status: 500 }
    );
  }
}
