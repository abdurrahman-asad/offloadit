import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2';
import { BrowserUseClient } from 'npm:browser-use-sdk@2.0.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey',
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const checkAuth = async (supabase: SupabaseClient) => {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw Error('Unauthorized');
  }
};

const createBUTask = (description: string) => {
  const client = new BrowserUseClient({ apiKey: Deno.env.get('BROWSER_USE_API_KEY')! });
  return client.tasks.createTask({
    flashMode: true,
    task: description,
    llm: 'claude-sonnet-4-20250514',
    // systemPromptExtension: `
    // Speed optimization instructions:
    // - Be extremely concise and direct in your responses
    // - Get to the goal as quickly as possible
    // - Use multi-action sequences whenever possible to reduce steps`,
  });
};

const invokeCheckStatus = async (taskId: string, supabase: SupabaseClient) => {
  await sleep(15000);
  return supabase.functions.invoke('check-status', {
    body: { task_id: taskId },
    method: 'POST',
  });
};

Deno.serve(async req => {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method === 'POST' && req.headers.get('content-type') === 'application/json') {
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
      );

      await checkAuth(supabase);

      let body;

      try {
        body = await req.json();
      } catch {
        throw Error('Invalid payload');
      }

      const task = await createBUTask(body.description);

      console.log('Created BU task with id:', task.id);

      // Invoke check-status function after 15 seconds delay
      EdgeRuntime.waitUntil(invokeCheckStatus(task.id, supabase));

      const { data, error } = await supabase
        .schema('api')
        .from('tasks')
        .insert({
          description: body.description,
          bu_task_id: task.id,
          destination: body.destination || null,
          destination_value: body.destination_value || null,
        })
        .select('*, created_by:users (*)')
        .single();

      if (error) {
        throw error;
      }

      return new Response(JSON.stringify({ data }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        status: 200,
      });
    } catch (err) {
      return new Response(JSON.stringify({ message: (err as Error)?.message ?? err }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
        status: 500,
      });
    }
  } else {
    return new Response(JSON.stringify({ message: 'Request type not allowed' }), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
      status: 405,
    });
  }
});
