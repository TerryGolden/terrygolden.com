export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { subscriberEmail, triggerType } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Find active workflows matching the trigger type
    const workflowsResponse = await fetch(`${supabaseUrl}/rest/v1/email_workflows?trigger_type=eq.${triggerType}&status=eq.active`, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });

    const workflows = await workflowsResponse.json();

    const executions = [];
    for (const workflow of workflows) {
      // Get first step
      const stepsResponse = await fetch(`${supabaseUrl}/rest/v1/workflow_steps?workflow_id=eq.${workflow.id}&order=step_order.asc&limit=1`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        }
      });

      const steps = await stepsResponse.json();
      if (steps.length === 0) continue;

      const firstStep = steps[0];
      const nextExecutionAt = new Date();
      
      // Create execution
      const executionData = {
        workflow_id: workflow.id,
        subscriber_email: subscriberEmail,
        current_step_id: firstStep.id,
        status: 'active',
        next_execution_at: nextExecutionAt.toISOString()
      };

      const createResponse = await fetch(`${supabaseUrl}/rest/v1/workflow_executions`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(executionData)
      });

      const execution = await createResponse.json();
      executions.push(execution);
    }

    return new Response(JSON.stringify({ success: true, executions }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
});
