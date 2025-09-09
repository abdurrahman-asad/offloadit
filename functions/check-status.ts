import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2';
import { BrowserUseClient } from 'npm:browser-use-sdk@2.0.3';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const sendEmail = async (
  to: string,
  taskDescription: string,
  taskOutput: string,
  taskId: string,
) => {
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${Deno.env.get('RESEND_KEY')}`,
      },
      body: JSON.stringify({
        from: 'OffloadIt <no-reply@notifications.offloadit.ai>',
        to,
        subject: 'Your task has been completed!',
        html: `
            <h2>Task Completed ✅</h2>
            <p>Your task has been completed successfully!</p>

            <h3>Task Description:</h3>
            <p>${taskDescription}</p>

            <hr/>

            <h3>Output:</h3>
            <pre>${taskOutput}</pre>

            <br>
            <p>Thanks for using OffloadIt!</p>
          `,
      }),
    });
    const data = await res.json();
    console.log(`Sent email to ${to} with ID: ${JSON.stringify(data)}, task ID: ${taskId}`);
  } catch (error) {
    console.error('Error sending email for task ID:', taskId, (error as Error).message);
  }
};

const checkTaskStatus = async (taskId: string, attempt: number, supabaseClient: SupabaseClient) => {
  // If attempt is greater than 3, mark task as failed and complete
  if (attempt > 3) {
    console.log(`Attempt ${attempt} > 3, marking task ${taskId} as failed`);

    const { error: updateError } = await supabaseClient
      .schema('api')
      .from('tasks')
      .update({
        output: 'Task failed',
        is_complete: true,
      })
      .eq('bu_task_id', taskId);

    if (updateError) {
      console.error('Error updating failed task:', updateError);
    } else {
      console.log(`Task ${taskId} marked as failed and complete`);
    }

    return;
  }

  const client = new BrowserUseClient({ apiKey: Deno.env.get('BROWSER_USE_API_KEY')! });

  // Check for up to 6 attempts
  for (let i = 0; i < 6; i++) {
    try {
      const task = await client.tasks.getTask(taskId);
      console.log(`Attempt ${i + 1}: Task status is ${task.status} for ${task.id}`);

      // If task is finished, update database and return
      if (task.finishedAt) {
        const { data, error: updateError } = await supabaseClient
          .schema('api')
          .from('tasks')
          .update({
            output: task.output || `Task ${task.status}`,
            is_complete: true,
          })
          .eq('bu_task_id', taskId)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating task:', updateError);
          throw updateError;
        }

        console.log(
          `Task ${taskId} successfully updated in database with output: ${task.output || `Task ${task.status}`}`,
        );

        // Send email notification
        if (data.destination === 'email') {
          await sendEmail(
            data.destination_value,
            data.description,
            task.output || `Task ${task.status}`,
            data.id,
          );
        }

        return;
      }

      // If not the last attempt, wait 15 seconds
      if (i < 5) {
        await sleep(15000);
      }
    } catch (taskError) {
      console.error(`Error checking task on attempt ${i + 1}:`, taskError);

      // If not the last attempt, wait and continue
      if (i < 5) {
        await sleep(15000);
        continue;
      }

      // If this is the last attempt and we still have errors, proceed to recursive call
      break;
    }
  }

  // If we've exhausted all 6 attempts without success, invoke check-status again
  console.log(`All 6 attempts completed for task ${taskId}. Invoking check-status recursively.`);

  const { error: invokeError } = await supabaseClient.functions.invoke('check-status', {
    body: { task_id: taskId, attempt: attempt + 1 },
    method: 'POST',
  });

  if (invokeError) {
    console.error('Error invoking recursive check-status:', invokeError);
  }
};

Deno.serve(async req => {
  if (req.method === 'POST' && req.headers.get('content-type') === 'application/json') {
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_ANON_KEY') ?? '',
        { global: { headers: { Authorization: req.headers.get('Authorization')! } } },
      );

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        console.log('Unauthorized access attempt');
        throw Error('Unauthorized');
      }

      let body;

      try {
        body = await req.json();
      } catch {
        throw Error('Invalid payload');
      }

      const { task_id, attempt = 1 } = body;

      if (!task_id) {
        throw Error('task_id is required');
      }

      EdgeRuntime.waitUntil(checkTaskStatus(task_id, attempt, supabase));
    } catch (err) {
      console.error('Error in check-status function:', err);
    }
  } else {
    console.error('Invalid request method or content type');
  }

  // Return single success response
  return new Response(
    JSON.stringify({
      success: true,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    },
  );
});
