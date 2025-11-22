# Cron Jobs Setup for Scheduled Scans

This document describes how to set up automated scheduled scans using Supabase's pg_cron extension.

## Prerequisites

1. Enable `pg_cron` extension in your Supabase project
2. Enable `pg_net` extension for HTTP calls

```sql
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
```

## Daily Security Scans

Schedule daily DevSecOps scans at 2 AM UTC:

```sql
SELECT cron.schedule(
  'daily-security-scans',
  '0 2 * * *', -- Every day at 2 AM UTC
  $$
  INSERT INTO usage_events (tenant_id, event_type, quantity, metadata)
  SELECT 
    tenant_id,
    'scheduled_scan_triggered',
    1,
    jsonb_build_object('automated', true, 'timestamp', now())
  FROM devsecops_pipelines
  WHERE enabled = true 
  AND triggers ? 'schedule'
  $$
);
```

## Weekly SBOM Updates

Schedule weekly SBOM refreshes every Sunday at 3 AM UTC:

```sql
SELECT cron.schedule(
  'weekly-sbom-refresh',
  '0 3 * * 0', -- Every Sunday at 3 AM UTC
  $$
  INSERT INTO usage_events (tenant_id, event_type, quantity, metadata)
  SELECT DISTINCT
    tenant_id,
    'sbom_refresh_triggered',
    1,
    jsonb_build_object('automated', true, 'timestamp', now())
  FROM devsecops_scans
  WHERE status = 'completed'
  AND created_at > now() - interval '30 days'
  $$
);
```

## Trigger Edge Functions via Cron

To actually execute scans, you can call edge functions via HTTP:

```sql
SELECT cron.schedule(
  'run-scheduled-devsecops-scans',
  '0 2 * * *',
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT.supabase.co/functions/v1/devsecops-scan',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
      body := jsonb_build_object(
        'scheduled', true,
        'timestamp', now()
      )
    ) as request_id;
  $$
);
```

## APT Simulation Cleanup

Clean up old APT simulation runs (older than 90 days):

```sql
SELECT cron.schedule(
  'cleanup-old-apt-runs',
  '0 4 * * 0', -- Weekly on Sunday at 4 AM
  $$
  DELETE FROM apt_runs 
  WHERE completed_at < now() - interval '90 days'
  AND status = 'completed';
  
  DELETE FROM apt_events
  WHERE created_at < now() - interval '90 days';
  $$
);
```

## View Active Cron Jobs

```sql
SELECT * FROM cron.job;
```

## Delete Cron Job

```sql
SELECT cron.unschedule('job-name');
```

## Important Notes

1. **Service Role Key**: Replace `YOUR_SERVICE_ROLE_KEY` with your actual Supabase service role key
2. **Project URL**: Replace `YOUR_PROJECT.supabase.co` with your actual project URL
3. **Timezone**: All cron schedules use UTC timezone
4. **Error Handling**: Cron jobs run in database context and errors are logged in Supabase logs
5. **Monitoring**: Check `cron.job_run_details` table for execution history

## Cron Schedule Format

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of month (1 - 31)
│ │ │ ┌───────────── month (1 - 12)
│ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday)
│ │ │ │ │
* * * * *
```

Common schedules:
- `0 * * * *` - Every hour
- `0 0 * * *` - Daily at midnight
- `0 2 * * *` - Daily at 2 AM
- `0 0 * * 0` - Weekly on Sunday at midnight
- `0 0 1 * *` - Monthly on the 1st at midnight
