export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { campaignId, subject, content, scheduledFor } = await req.json();
    const resendApiKey = Deno.env.get('RESEND_API_KEY');

    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Fetch confirmed subscribers
    const subscribersRes = await fetch(`${supabaseUrl}/rest/v1/newsletter_subscribers?confirmed=eq.true&select=email`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    const subscribers = await subscribersRes.json();

    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ error: 'No confirmed subscribers found' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Update campaign with recipient count
    await fetch(`${supabaseUrl}/rest/v1/email_campaigns?id=eq.${campaignId}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        total_recipients: subscribers.length,
        status: scheduledFor ? 'scheduled' : 'sending',
        scheduled_for: scheduledFor
      })
    });

    // If scheduled for future, return success
    if (scheduledFor && new Date(scheduledFor) > new Date()) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Campaign scheduled successfully',
        recipients: subscribers.length 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    // Send emails in batches
    let sentCount = 0;
    const batchSize = 50;

    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (subscriber: { email: string }) => {
        const trackingId = crypto.randomUUID();
        const unsubscribeLink = `${supabaseUrl}/functions/v1/newsletter-unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
        
        const htmlContent = `
          ${content}
          <br><br>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280;">
            <p>You're receiving this because you subscribed to our newsletter.</p>
            <p><a href="${unsubscribeLink}" style="color: #6b7280;">Unsubscribe</a></p>
          </div>
          <img src="${supabaseUrl}/functions/v1/track-email-open?id=${trackingId}" width="1" height="1" style="display:none;" />
        `;

        try {
          const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'Terry Golden <newsletter@terrygolden.com>',
              to: [subscriber.email],
              subject: subject,
              html: htmlContent
            })
          });

          if (response.ok) {
            // Track in analytics
            await fetch(`${supabaseUrl}/rest/v1/campaign_analytics`, {
              method: 'POST',
              headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                campaign_id: campaignId,
                subscriber_email: subscriber.email,
                sent_at: new Date().toISOString()
              })
            });
            return true;
          }
          return false;
        } catch (error) {
          console.error(`Failed to send to ${subscriber.email}:`, error);
          return false;
        }
      });

      const results = await Promise.all(emailPromises);
      sentCount += results.filter(r => r).length;
    }

    // Update campaign status
    await fetch(`${supabaseUrl}/rest/v1/email_campaigns?id=eq.${campaignId}`, {
      method: 'PATCH',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        status: 'sent',
        sent_at: new Date().toISOString(),
        total_sent: sentCount
      })
    });

    return new Response(JSON.stringify({ 
      success: true, 
      sent: sentCount,
      total: subscribers.length 
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error) {
    console.error('Error sending bulk newsletter:', error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
