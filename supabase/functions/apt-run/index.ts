import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface APTEvent {
  stage: string;
  tactic: string;
  technique: string;
  success: boolean;
  impact_score: number;
  detection_probability: number;
  narrative: string;
  metadata: any;
}

const KILL_CHAIN_STAGES = [
  { stage: 'reconnaissance', tactics: ['Active Scanning', 'Gather Victim Info'], techniques: ['T1595', 'T1589'] },
  { stage: 'weaponization', tactics: ['Resource Development'], techniques: ['T1583', 'T1587'] },
  { stage: 'delivery', tactics: ['Initial Access'], techniques: ['T1566', 'T1190', 'T1078'] },
  { stage: 'exploitation', tactics: ['Execution'], techniques: ['T1059', 'T1203', 'T1204'] },
  { stage: 'installation', tactics: ['Persistence'], techniques: ['T1547', 'T1053', 'T1136'] },
  { stage: 'command_control', tactics: ['Command and Control'], techniques: ['T1071', 'T1573', 'T1090'] },
  { stage: 'lateral_movement', tactics: ['Lateral Movement'], techniques: ['T1021', 'T1550', 'T1563'] },
  { stage: 'privilege_escalation', tactics: ['Privilege Escalation'], techniques: ['T1068', 'T1134', 'T1055'] },
  { stage: 'credential_access', tactics: ['Credential Access'], techniques: ['T1003', 'T1110', 'T1555'] },
  { stage: 'defense_evasion', tactics: ['Defense Evasion'], techniques: ['T1070', 'T1562', 'T1027'] },
  { stage: 'exfiltration', tactics: ['Exfiltration'], techniques: ['T1048', 'T1041', 'T1567'] },
];

function generateEvent(stageData: any, config: any): APTEvent {
  const success = Math.random() > (config.stealth_mode ? 0.2 : 0.4);
  const impact = Math.floor(Math.random() * 100);
  const detection = config.stealth_mode ? Math.random() * 30 : Math.random() * 70;
  
  return {
    stage: stageData.stage,
    tactic: stageData.tactics[Math.floor(Math.random() * stageData.tactics.length)],
    technique: stageData.techniques[Math.floor(Math.random() * stageData.techniques.length)],
    success,
    impact_score: impact,
    detection_probability: parseFloat(detection.toFixed(2)),
    narrative: `${success ? 'Successfully executed' : 'Failed to execute'} ${stageData.stage} using ${stageData.tactic}`,
    metadata: { timestamp: new Date().toISOString() }
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { scenario_id, tenant_id } = await req.json();

    // Get scenario
    const { data: scenario } = await supabaseClient
      .from('apt_scenarios')
      .select('*')
      .eq('id', scenario_id)
      .single();

    if (!scenario) {
      return new Response(JSON.stringify({ error: 'Scenario not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create run
    const { data: run, error: runError } = await supabaseClient
      .from('apt_runs')
      .insert({
        tenant_id,
        scenario_id,
        status: 'running',
        started_at: new Date().toISOString(),
        created_by: user.id,
        current_stage: 'reconnaissance',
        progress_percent: 0
      })
      .select()
      .single();

    if (runError) throw runError;

    // Simulate kill chain progression
    let totalEvents = 0;
    for (let i = 0; i < KILL_CHAIN_STAGES.length; i++) {
      const stageData = KILL_CHAIN_STAGES[i];
      const numEvents = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 0; j < numEvents; j++) {
        const event = generateEvent(stageData, scenario.config);
        
        await supabaseClient.from('apt_events').insert({
          run_id: run.id,
          ...event
        });

        // Generate detection with probability
        if (Math.random() * 100 < event.detection_probability) {
          await supabaseClient.from('apt_detection_logs').insert({
            run_id: run.id,
            detection_type: 'IDS',
            confidence_score: Math.random() * 100,
            alert_severity: event.impact_score > 70 ? 'critical' : event.impact_score > 40 ? 'high' : 'medium',
            blue_team_response: 'Alert generated and logged',
            blocked: Math.random() > 0.7
          });
        }
        
        totalEvents++;
      }

      // Update progress
      await supabaseClient
        .from('apt_runs')
        .update({
          current_stage: stageData.stage,
          progress_percent: Math.floor(((i + 1) / KILL_CHAIN_STAGES.length) * 100)
        })
        .eq('id', run.id);
    }

    // Complete run
    const { data: events } = await supabaseClient
      .from('apt_events')
      .select('*')
      .eq('run_id', run.id);

    const successRate = (events && events.length > 0) ? (events.filter(e => e.success).length / events.length * 100) : 0;
    const avgImpact = (events && events.length > 0) ? (events.reduce((sum, e) => sum + e.impact_score, 0) / events.length) : 0;

    await supabaseClient
      .from('apt_runs')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        progress_percent: 100,
        results: {
          success_rate: successRate.toFixed(2),
          avg_impact: avgImpact.toFixed(2),
          total_events: totalEvents,
          stages_completed: KILL_CHAIN_STAGES.length
        }
      })
      .eq('id', run.id);

    // Track usage
    await supabaseClient.from('usage_events').insert({
      tenant_id,
      type: 'APT_SIMULATION',
      quantity: 1,
      metadata: { scenario_id, run_id: run.id }
    });

    return new Response(JSON.stringify({ run_id: run.id, success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('APT run error:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
