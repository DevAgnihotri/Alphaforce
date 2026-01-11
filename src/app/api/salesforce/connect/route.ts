import { NextResponse } from 'next/server';
import { Connection } from 'jsforce';

/**
 * GET /api/salesforce/connect
 * Minimal connectivity check to your Salesforce org using jsforce.
 * Reads credentials from environment variables and returns a small sample.
 */
export async function GET() {
  const loginUrl = process.env.SF_LOGIN_URL || 'https://login.salesforce.com';
  const username = process.env.SF_USERNAME;
  const password = process.env.SF_PASSWORD;
  const securityToken = process.env.SF_SECURITY_TOKEN || '';

  if (!username || !password) {
    return NextResponse.json(
      {
        success: false,
        error:
          'Missing Salesforce credentials. Set SF_USERNAME, SF_PASSWORD, SF_SECURITY_TOKEN in .env.local',
      },
      { status: 400 }
    );
  }

  const conn = new Connection({ loginUrl });

  try {
    await conn.login(username, `${password}${securityToken}`);

    // Fetch a tiny sample: last 5 Accounts
    const accounts = await conn.query<{ Id: string; Name: string }>(
      "SELECT Id, Name FROM Account ORDER BY CreatedDate DESC LIMIT 5"
    );

    // Basic org identity
    const id = await conn.identity();

    return NextResponse.json({
      success: true,
      org: {
        id: id.organization_id,
        username: id.username,
        instance_url: conn.instanceUrl,
        user_id: id.user_id,
      },
      sample: {
        accounts: accounts.records.map((a) => ({ id: a.Id, name: a.Name })),
        count: accounts.totalSize,
      },
    });
  } catch (e: any) {
    const message = e?.message || 'Salesforce login/query failed';
    return NextResponse.json(
      {
        success: false,
        error: message,
        hint:
          'Verify SF_LOGIN_URL (prod vs sandbox), username/password, and security token. If MFA is enforced, use OAuth flow instead.',
      },
      { status: 500 }
    );
  }
}
