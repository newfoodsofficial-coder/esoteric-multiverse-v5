import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import bcryptjs from 'bcryptjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let client: Client | null = null;
  try {
    const body = await req.json();
    const accessCode = (body?.access_code ?? body?.clearanceCode ?? '').trim();

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
      'SELECT id, role, is_active, clearance_code_hash, access_code, expires_at FROM admins WHERE is_active = true LIMIT 1'
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid clearance code' }, { status: 401 });
    }

    const admin = result.rows[0];

    if (admin.expires_at && new Date(admin.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This clearance has expired' }, { status: 403 });
    }

    let verified = false;
    if (admin.access_code && admin.access_code === accessCode) {
      verified = true;
    } else if (admin.clearance_code_hash) {
      verified = bcryptjs.compareSync(accessCode, admin.clearance_code_hash);
    }

    if (!verified) {
      return NextResponse.json({ error: 'Invalid clearance code' }, { status: 401 });
    }

    return NextResponse.json({
      ok: true,
      admin: {
        id: admin.id,
        role_title: admin.role,
        tier: admin.role === 'super_admin' ? 'super' : 'admin',
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
