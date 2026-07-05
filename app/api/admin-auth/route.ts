import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const accessCode = (body?.access_code ?? '').trim();

    if (!accessCode) {
      return NextResponse.json({ error: 'Access code required' }, { status: 400 });
    }

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL ||
      '';
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      '';

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data, error } = await supabase
      .from('admins')
      .select('id, role_title, tier, active')
      .eq('access_code', accessCode)
      .maybeSingle();

    if (error) {
      console.error('[admin-auth] Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Invalid clearance code' }, { status: 401 });
    }

    if (!data.active) {
      return NextResponse.json({ error: 'This clearance has been suspended' }, { status: 403 });
    }

    return NextResponse.json({
      ok: true,
      admin: {
        id: data.id,
        role_title: data.role_title,
        tier: data.tier,
      },
    });
  } catch (err: any) {
    console.error('[admin-auth] Error:', err);
    return NextResponse.json({ error: err?.message ?? 'Internal server error' }, { status: 500 });
  }
}
