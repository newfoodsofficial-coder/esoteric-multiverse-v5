import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const accessCode = (body?.access_code ?? "").trim();

    if (!accessCode) {
      return new Response(
        JSON.stringify({ error: "Access code required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const dbUrl = Deno.env.get("SUPABASE_DB_URL") ?? "";
    if (!dbUrl) {
      return new Response(
        JSON.stringify({ error: "Server misconfigured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { Client } = await import("npm:pg@8.13.1");
    const client = new Client({ connectionString: dbUrl });
    await client.connect();

    try {
      const result = await client.query(
        "SELECT id, role_title, tier, access_code, active FROM admins WHERE access_code = $1 LIMIT 1",
        [accessCode]
      );

      if (result.rows.length === 0) {
        return new Response(
          JSON.stringify({ error: "Invalid clearance code" }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const admin = result.rows[0];
      if (!admin.active) {
        return new Response(
          JSON.stringify({ error: "This clearance has been suspended" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          ok: true,
          admin: {
            id: admin.id,
            role_title: admin.role_title,
            tier: admin.tier,
          },
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } finally {
      await client.end();
    }
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err?.message ?? "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
