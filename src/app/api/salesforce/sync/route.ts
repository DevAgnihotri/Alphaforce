import { NextRequest, NextResponse } from 'next/server';

interface SalesforceObject {
  name: string;
  icon: string;
  recordCount: number;
  lastSync: string;
  status: 'synced' | 'pending' | 'error';
  description: string;
}

// Mock Salesforce objects data
let salesforceObjects: SalesforceObject[] = [
  {
    name: 'Leads',
    icon: 'Users',
    recordCount: 25,
    lastSync: '2 min ago',
    status: 'synced',
    description: 'Potential clients captured from various sources',
  },
  {
    name: 'Accounts',
    icon: 'Briefcase',
    recordCount: 25,
    lastSync: '2 min ago',
    status: 'synced',
    description: 'Active client accounts with portfolio data',
  },
  {
    name: 'Opportunities',
    icon: 'FileText',
    recordCount: 42,
    lastSync: '5 min ago',
    status: 'synced',
    description: 'Investment opportunities and deal pipeline',
  },
  {
    name: 'Activities',
    icon: 'Activity',
    recordCount: 68,
    lastSync: '1 min ago',
    status: 'synced',
    description: 'Calls, emails, and meetings with clients',
  },
];

let lastSyncTime = new Date().toISOString();

// GET: Get current sync status and objects
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        objects: salesforceObjects,
        lastSync: lastSyncTime,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch Salesforce data' },
      { status: 500 }
    );
  }
}

// POST: Trigger a sync
export async function POST(request: NextRequest) {
  try {
    // Simulate sync process
    const now = new Date();
    
    // Update all objects to syncing status
    salesforceObjects = salesforceObjects.map(obj => ({
      ...obj,
      status: 'pending' as const,
    }));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate some data changes (random record count variations)
    salesforceObjects = salesforceObjects.map(obj => ({
      ...obj,
      status: 'synced' as const,
      lastSync: 'Just now',
      recordCount: obj.recordCount + Math.floor(Math.random() * 3) - 1, // +/- 1 or same
    }));

    lastSyncTime = now.toISOString();

    return NextResponse.json({
      success: true,
      message: 'Salesforce sync completed',
      data: {
        objects: salesforceObjects,
        lastSync: lastSyncTime,
        syncedRecords: salesforceObjects.reduce((sum, obj) => sum + obj.recordCount, 0),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to sync Salesforce data' },
      { status: 500 }
    );
  }
}
