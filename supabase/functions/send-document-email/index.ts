import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "@supabase/supabase-js/cors";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const {
      to,
      subject,
      html,
      replyTo,
      businessName,
      businessEmail,
    } = body;

    if (!to || !Array.isArray(to) || to.length === 0) {
      return new Response(
        JSON.stringify({ error: "No recipients provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!subject || !html) {
      return new Response(
        JSON.stringify({ error: "Subject and html are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "Email service not configured. Please add RESEND_API_KEY." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const fromName = businessName || "Sharon Ogier Accounting";
    const fromEmail = businessEmail && businessEmail.includes("@") ? businessEmail : "noreply@sharonogier.com";

    // Send to each recipient
    const results = [];
    for (const recipient of to) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: `${fromName} <${fromEmail}>`,
          to: [recipient],
          subject,
          html,
          reply_to: replyTo || businessEmail || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Resend error for", recipient, data);
        results.push({ recipient, ok: false, error: data });
      } else {
        results.push({ recipient, ok: true, id: data.id });
      }
    }

    const allOk = results.every((r) => r.ok);
    const sentCount = results.filter((r) => r.ok).length;

    return new Response(
      JSON.stringify({
        ok: allOk,
        message: allOk
          ? `Email sent to ${sentCount} recipient(s)`
          : `Sent to ${sentCount}/${results.length} recipient(s)`,
        results,
      }),
      {
        status: allOk ? 200 : 207,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("send-document-email error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
