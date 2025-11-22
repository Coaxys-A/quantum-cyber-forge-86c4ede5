import { supabase } from '@/integrations/supabase/client';
import { DEMO_TENANT_ID } from './config';

export async function seedDemoTenant() {
  try {
    console.log('[DEMO SEEDER] Starting demo tenant population...');

    // Create demo architecture components
    const components = [
      { name: 'API Gateway', type: 'API' as const, health_status: 'HEALTHY' as const, description: 'Main API entry point' },
      { name: 'Auth Service', type: 'SERVICE' as const, health_status: 'HEALTHY' as const, description: 'Authentication and authorization' },
      { name: 'Database', type: 'DATABASE' as const, health_status: 'HEALTHY' as const, description: 'Primary PostgreSQL database' },
      { name: 'Cache Layer', type: 'SERVICE' as const, health_status: 'HEALTHY' as const, description: 'Redis cache' },
      { name: 'Load Balancer', type: 'NETWORK' as const, health_status: 'HEALTHY' as const, description: 'Traffic distribution' },
      { name: 'File Storage', type: 'STORAGE' as const, health_status: 'DEGRADED' as const, description: 'S3-compatible storage' }
    ];

    const { data: createdComponents } = await supabase
      .from('components')
      .upsert(
        components.map((c, i) => ({
          ...c,
          tenant_id: DEMO_TENANT_ID,
          metadata: { x: 100 + (i % 3) * 200, y: 100 + Math.floor(i / 3) * 200 }
        })),
        { onConflict: 'tenant_id,name' }
      )
      .select();

    console.log(`[DEMO SEEDER] Created ${createdComponents?.length || 0} components`);

    // Create demo edges
    if (createdComponents && createdComponents.length >= 4) {
      const edges = [
        { source_id: createdComponents[0].id, target_id: createdComponents[1].id, label: 'authenticates' },
        { source_id: createdComponents[0].id, target_id: createdComponents[2].id, label: 'queries' },
        { source_id: createdComponents[0].id, target_id: createdComponents[3].id, label: 'caches' },
        { source_id: createdComponents[4].id, target_id: createdComponents[0].id, label: 'routes' }
      ];

      await supabase.from('component_edges').upsert(edges, { onConflict: 'source_id,target_id' });
      console.log(`[DEMO SEEDER] Created ${edges.length} edges`);
    }

    // Create demo risks
    const risks = [
      {
        tenant_id: DEMO_TENANT_ID,
        title: 'Unencrypted Database Backup',
        description: 'Database backups are stored without encryption, exposing sensitive data',
        severity: 'CRITICAL' as const,
        status: 'IDENTIFIED' as const,
        impact_score: 9,
        likelihood_score: 7,
        mitigation_plan: 'Enable encryption at rest for all backup storage locations'
      },
      {
        tenant_id: DEMO_TENANT_ID,
        title: 'Outdated Dependencies',
        description: 'Multiple npm packages with known vulnerabilities',
        severity: 'HIGH' as const,
        status: 'ASSESSING' as const,
        impact_score: 7,
        likelihood_score: 8,
        mitigation_plan: 'Update dependencies and implement automated security scanning'
      },
      {
        tenant_id: DEMO_TENANT_ID,
        title: 'Missing MFA for Admin Accounts',
        description: 'Administrator accounts do not require multi-factor authentication',
        severity: 'HIGH' as const,
        status: 'MITIGATING' as const,
        impact_score: 8,
        likelihood_score: 6,
        mitigation_plan: 'Enforce MFA for all privileged accounts'
      }
    ];

    await supabase.from('risks').upsert(risks, { onConflict: 'tenant_id,title' });
    console.log(`[DEMO SEEDER] Created ${risks.length} risks`);

    // Create demo controls
    const controls = [
      {
        tenant_id: DEMO_TENANT_ID,
        name: 'Access Control Policy',
        description: 'Comprehensive access control and least privilege enforcement',
        status: 'ACTIVE' as const,
        effectiveness_score: 85
      },
      {
        tenant_id: DEMO_TENANT_ID,
        name: 'Encryption Standards',
        description: 'Data encryption at rest and in transit',
        status: 'ACTIVE' as const,
        effectiveness_score: 90
      },
      {
        tenant_id: DEMO_TENANT_ID,
        name: 'Security Monitoring',
        description: 'Real-time security event monitoring and alerting',
        status: 'ACTIVE' as const,
        effectiveness_score: 75
      }
    ];

    await supabase.from('controls').upsert(controls, { onConflict: 'tenant_id,name' });
    console.log(`[DEMO SEEDER] Created ${controls.length} controls`);

    // Create demo simulation
    const simulation = {
      tenant_id: DEMO_TENANT_ID,
      name: 'APT29 Credential Theft Scenario',
      description: 'Simulated advanced persistent threat targeting credentials',
      scenario: 'PENETRATION_TEST' as const,
      status: 'COMPLETED' as const,
      config: {
        threat_actor: 'APT29',
        techniques: ['T1078', 'T1003', 'T1021'],
        duration: '2 hours',
        targets: ['Authentication Service', 'Database']
      },
      started_at: new Date(Date.now() - 7200000).toISOString(),
      completed_at: new Date().toISOString()
    };

    const { data: createdSim } = await supabase
      .from('simulations')
      .upsert(simulation, { onConflict: 'tenant_id,name' })
      .select()
      .single();

    if (createdSim) {
      const events = [
        {
          simulation_id: createdSim.id,
          event_type: 'RECONNAISSANCE',
          message: 'Attacker performed network reconnaissance',
          data: { technique: 'T1046', timestamp: new Date(Date.now() - 6000000).toISOString() }
        },
        {
          simulation_id: createdSim.id,
          event_type: 'INITIAL_ACCESS',
          message: 'Successful phishing attack gained initial foothold',
          data: { technique: 'T1566', timestamp: new Date(Date.now() - 5000000).toISOString() }
        },
        {
          simulation_id: createdSim.id,
          event_type: 'CREDENTIAL_THEFT',
          message: 'Credentials harvested from compromised endpoint',
          data: { technique: 'T1003', timestamp: new Date(Date.now() - 3000000).toISOString() }
        }
      ];

      await supabase.from('simulation_events').insert(events);
      console.log(`[DEMO SEEDER] Created simulation with ${events.length} events`);
    }

    // Create demo findings
    const findings = [
      {
        tenant_id: DEMO_TENANT_ID,
        title: 'SQL Injection Vulnerability',
        description: 'User input not properly sanitized in search endpoint',
        severity: 'CRITICAL' as const,
        status: 'open',
        discovered_at: new Date(Date.now() - 86400000).toISOString()
      },
      {
        tenant_id: DEMO_TENANT_ID,
        title: 'Weak Password Policy',
        description: 'Password complexity requirements are insufficient',
        severity: 'MEDIUM' as const,
        status: 'resolved',
        discovered_at: new Date(Date.now() - 172800000).toISOString(),
        resolved_at: new Date(Date.now() - 43200000).toISOString()
      }
    ];

    await supabase.from('findings').upsert(findings, { onConflict: 'tenant_id,title' });
    console.log(`[DEMO SEEDER] Created ${findings.length} findings`);

    // Seed APT scenarios
    await supabase.from('apt_scenarios').upsert([
      {
        tenant_id: DEMO_TENANT_ID,
        name: 'APT28 Phishing Campaign',
        description: 'Credential harvesting via spear-phishing',
        actor_profile_id: '11111111-1111-1111-1111-111111111111',
        attack_vector: 'phishing',
        objectives: ['credential_theft', 'persistence'],
        stealth_mode: true,
        config: { stealth_mode: true }
      },
      {
        tenant_id: DEMO_TENANT_ID,
        name: 'REvil Ransomware Simulation',
        description: 'Supply chain ransomware attack',
        actor_profile_id: '55555555-5555-5555-5555-555555555555',
        attack_vector: 'supply_chain',
        objectives: ['encryption', 'exfiltration'],
        stealth_mode: false,
        config: { stealth_mode: false }
      }
    ], { onConflict: 'tenant_id,name' });

    console.log('[DEMO SEEDER] Demo tenant population complete!');
    return { success: true };
  } catch (error) {
    console.error('[DEMO SEEDER] Error:', error);
    return { success: false, error };
  }
}
