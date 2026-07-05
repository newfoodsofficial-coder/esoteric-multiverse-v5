import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export async function POST(req: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    const { clearanceCode } = await req.json();
    if (!clearanceCode) {
      return NextResponse.json({ error: 'Access code required' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // استدعاء دالتك الأصلية والمحفوظة الخصائص بالكامل
    const { data, error } = await supabase.rpc('verify_clearance_code', {
      p_code: clearanceCode
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const authResult = Array.isArray(data) ? data[0] : data;

    if (!authResult || !authResult.v_success) {
      return NextResponse.json({ error: authResult?.v_error || 'Access Denied.' }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      role: authResult.v_role,
      username: authResult.v_username
    }, { status: 200 });

  } catch (err: any) {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
