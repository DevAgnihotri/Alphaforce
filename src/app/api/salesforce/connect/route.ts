import { NextResponse } from 'next/server';

/**
 * GET /api/salesforce/connect
 * Mock Salesforce connectivity check - returns simulated org data.
 * No real Salesforce connection required.
 */
export async function GET() {
  // Simulate a small delay like a real API call
  await new Promise(resolve => setTimeout(resolve, 500));

  // Mock Salesforce org data
  const mockOrgData = {
    id: 'MOCK_ORG_00D5e000001234567',
    username: 'advisor@alphaforce.demo',
    instance_url: 'https://alphaforce-demo.my.salesforce.com',
    user_id: 'MOCK_USER_0055e000001234567',
  };

  // Mock account samples
  const mockAccounts = [
    { id: 'ACC001', name: 'Johnson Family Trust' },
    { id: 'ACC002', name: 'Smith Retirement Fund' },
    { id: 'ACC003', name: 'Williams Investment LLC' },
    { id: 'ACC004', name: 'Brown Family Office' },
    { id: 'ACC005', name: 'Davis Wealth Management' },
  ];

  return NextResponse.json({
    success: true,
    mock: true, // Flag to indicate this is mock data
    org: mockOrgData,
    sample: {
      accounts: mockAccounts,
      count: mockAccounts.length,
    },
    message: 'Connected to mock Salesforce instance (Demo Mode)',
  });
}
