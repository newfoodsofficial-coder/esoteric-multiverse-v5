import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let client: Client | null = null;
  try {
    const body = await req.json();
    const accessCode = (body?.access_code ?? '').trim();

    if (!accessCode) {
      return NextResponse.json({ error: 'Access code required' }, { status: 400 });
    }

    const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL || '';
    if (!dbUrl) {
      return NextResponse.json({ error: 'Server misconfigured: missing database URL' }, { status: 500 });
    }

    client = new Client({
      connectionString: dbUrl,
      connectionTimeoutMillis: 10000,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();

    const result = await client.query(
      'SELECT id, role_title, tier, access_code, active FROM admins WHERE access_code = $1 LIMIT 1',
      [accessCode]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid clearance code' }, { status: 401 });
    }

    const admin = result.rows[0];
    if (!admin.active) {
      return NextResponse.json({ error: 'This clearance has been suspended' }, { status: 403 });
    }

    return NextResponse.json({
      ok: true,
      admin: {
        id: admin.id,
        role_title: admin.role_title,
        tier: admin.tier,
      },
    });
  } catch (err: any) {
    console.error('[admin-auth] Error:', err);
    return NextResponse.json({ error: err?.message ?? 'Internal server error' }, { status: 500 });
  } finally {
    if (client) {
      try { await client.end(); } catch {}
    }
  }
}
