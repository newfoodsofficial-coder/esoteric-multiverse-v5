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

    // استدعاء الدالة المحدثة من قاعدة البيانات
    const { data, error } = await supabase.rpc('verify_clearance_code', {
      p_code: clearanceCode
    });

    if (error) {
      console.error('Supabase RPC Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // استخراج الصف الأول من المصفوفة المرجعة بأمان
    const authResult = Array.isArray(data) ? data[0] : data;

    // تم إصلاح الخطأ المطبعي هنا من v_erro إلى v_error ليتوافق مع قاعدة البيانات
    if (!authResult || !authResult.v_success) {
      return NextResponse.json({ 
        error: authResult?.v_error || 'Invalid clearance credentials.' 
      }, { status: 401 });
    }

    // في حال النجاح المطلق، تمرير بيانات السوبر أدمن
    return NextResponse.json({
      success: true,
      role: authResult.v_role,
      username: authResult.v_username
    }, { status: 200 });

  } catch (err: any) {
    console.error('Fatal API Route Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
