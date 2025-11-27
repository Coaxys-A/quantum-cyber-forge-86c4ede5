export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alert_events: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          alert_type: string
          id: string
          message: string | null
          metadata: Json | null
          resolved_at: string | null
          severity: string
          source: string | null
          tenant_id: string | null
          title: string
          triggered_at: string | null
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type: string
          id?: string
          message?: string | null
          metadata?: Json | null
          resolved_at?: string | null
          severity: string
          source?: string | null
          tenant_id?: string | null
          title: string
          triggered_at?: string | null
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          alert_type?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          resolved_at?: string | null
          severity?: string
          source?: string | null
          tenant_id?: string | null
          title?: string
          triggered_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "alert_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      api_latency: {
        Row: {
          endpoint: string
          error_message: string | null
          id: string
          method: string
          recorded_at: string | null
          response_time_ms: number
          status_code: number | null
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          endpoint: string
          error_message?: string | null
          id?: string
          method: string
          recorded_at?: string | null
          response_time_ms: number
          status_code?: number | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          endpoint?: string
          error_message?: string | null
          id?: string
          method?: string
          recorded_at?: string | null
          response_time_ms?: number
          status_code?: number | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      apt_actor_profiles: {
        Row: {
          aliases: string[] | null
          common_ttps: Json | null
          created_at: string | null
          id: string
          motivation: string | null
          name: string
          origin_country: string | null
          primary_targets: string[] | null
          sophistication_level: string
        }
        Insert: {
          aliases?: string[] | null
          common_ttps?: Json | null
          created_at?: string | null
          id?: string
          motivation?: string | null
          name: string
          origin_country?: string | null
          primary_targets?: string[] | null
          sophistication_level: string
        }
        Update: {
          aliases?: string[] | null
          common_ttps?: Json | null
          created_at?: string | null
          id?: string
          motivation?: string | null
          name?: string
          origin_country?: string | null
          primary_targets?: string[] | null
          sophistication_level?: string
        }
        Relationships: []
      }
      apt_detection_logs: {
        Row: {
          alert_severity: string
          blocked: boolean | null
          blue_team_response: string | null
          confidence_score: number | null
          created_at: string | null
          detected_at: string | null
          detection_type: string
          event_id: string | null
          id: string
          metadata: Json | null
          run_id: string
        }
        Insert: {
          alert_severity: string
          blocked?: boolean | null
          blue_team_response?: string | null
          confidence_score?: number | null
          created_at?: string | null
          detected_at?: string | null
          detection_type: string
          event_id?: string | null
          id?: string
          metadata?: Json | null
          run_id: string
        }
        Update: {
          alert_severity?: string
          blocked?: boolean | null
          blue_team_response?: string | null
          confidence_score?: number | null
          created_at?: string | null
          detected_at?: string | null
          detection_type?: string
          event_id?: string | null
          id?: string
          metadata?: Json | null
          run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "apt_detection_logs_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "apt_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apt_detection_logs_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "apt_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      apt_events: {
        Row: {
          created_at: string | null
          detection_probability: number | null
          id: string
          impact_score: number | null
          metadata: Json | null
          narrative: string | null
          run_id: string
          stage: string
          success: boolean
          tactic: string
          technique: string
          timestamp: string | null
        }
        Insert: {
          created_at?: string | null
          detection_probability?: number | null
          id?: string
          impact_score?: number | null
          metadata?: Json | null
          narrative?: string | null
          run_id: string
          stage: string
          success: boolean
          tactic: string
          technique: string
          timestamp?: string | null
        }
        Update: {
          created_at?: string | null
          detection_probability?: number | null
          id?: string
          impact_score?: number | null
          metadata?: Json | null
          narrative?: string | null
          run_id?: string
          stage?: string
          success?: boolean
          tactic?: string
          technique?: string
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "apt_events_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "apt_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      apt_runs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          created_by: string | null
          current_stage: string | null
          id: string
          progress_percent: number | null
          results: Json | null
          scenario_id: string | null
          started_at: string | null
          status: string
          tenant_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          current_stage?: string | null
          id?: string
          progress_percent?: number | null
          results?: Json | null
          scenario_id?: string | null
          started_at?: string | null
          status?: string
          tenant_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          created_by?: string | null
          current_stage?: string | null
          id?: string
          progress_percent?: number | null
          results?: Json | null
          scenario_id?: string | null
          started_at?: string | null
          status?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "apt_runs_scenario_id_fkey"
            columns: ["scenario_id"]
            isOneToOne: false
            referencedRelation: "apt_scenarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apt_runs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      apt_scenarios: {
        Row: {
          actor_profile_id: string | null
          attack_vector: string
          config: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          objectives: string[] | null
          stealth_mode: boolean | null
          target_components: string[] | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          actor_profile_id?: string | null
          attack_vector: string
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          objectives?: string[] | null
          stealth_mode?: boolean | null
          target_components?: string[] | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          actor_profile_id?: string | null
          attack_vector?: string
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          objectives?: string[] | null
          stealth_mode?: boolean | null
          target_components?: string[] | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "apt_scenarios_actor_profile_id_fkey"
            columns: ["actor_profile_id"]
            isOneToOne: false
            referencedRelation: "apt_actor_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "apt_scenarios_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          tenant_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          tenant_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      backup_logs: {
        Row: {
          backup_type: string
          completed_at: string | null
          error_message: string | null
          id: string
          location: string | null
          metadata: Json | null
          size_bytes: number | null
          started_at: string | null
          status: string
        }
        Insert: {
          backup_type: string
          completed_at?: string | null
          error_message?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          size_bytes?: number | null
          started_at?: string | null
          status: string
        }
        Update: {
          backup_type?: string
          completed_at?: string | null
          error_message?: string | null
          id?: string
          location?: string | null
          metadata?: Json | null
          size_bytes?: number | null
          started_at?: string | null
          status?: string
        }
        Relationships: []
      }
      billing_webhook_events: {
        Row: {
          created_at: string | null
          event_id: string
          event_type: string
          id: string
          payload: Json | null
          processed_at: string | null
        }
        Insert: {
          created_at?: string | null
          event_id: string
          event_type: string
          id?: string
          payload?: Json | null
          processed_at?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string
          event_type?: string
          id?: string
          payload?: Json | null
          processed_at?: string | null
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category: string | null
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          published: boolean | null
          published_at: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published?: boolean | null
          published_at?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      cloud_status: {
        Row: {
          id: string
          last_checked: string | null
          latency_ms: number | null
          metadata: Json | null
          provider: string
          region: string
          service: string
          status: string
        }
        Insert: {
          id?: string
          last_checked?: string | null
          latency_ms?: number | null
          metadata?: Json | null
          provider: string
          region: string
          service: string
          status: string
        }
        Update: {
          id?: string
          last_checked?: string | null
          latency_ms?: number | null
          metadata?: Json | null
          provider?: string
          region?: string
          service?: string
          status?: string
        }
        Relationships: []
      }
      component_edges: {
        Row: {
          created_at: string | null
          id: string
          label: string | null
          source_id: string
          target_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          label?: string | null
          source_id: string
          target_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          label?: string | null
          source_id?: string
          target_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "component_edges_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "component_edges_target_id_fkey"
            columns: ["target_id"]
            isOneToOne: false
            referencedRelation: "components"
            referencedColumns: ["id"]
          },
        ]
      }
      components: {
        Row: {
          created_at: string | null
          description: string | null
          health_status: Database["public"]["Enums"]["health_status"] | null
          id: string
          metadata: Json | null
          name: string
          tenant_id: string
          type: Database["public"]["Enums"]["component_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          health_status?: Database["public"]["Enums"]["health_status"] | null
          id?: string
          metadata?: Json | null
          name: string
          tenant_id: string
          type: Database["public"]["Enums"]["component_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          health_status?: Database["public"]["Enums"]["health_status"] | null
          id?: string
          metadata?: Json | null
          name?: string
          tenant_id?: string
          type?: Database["public"]["Enums"]["component_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "components_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      control_risks: {
        Row: {
          control_id: string
          id: string
          risk_id: string
        }
        Insert: {
          control_id: string
          id?: string
          risk_id: string
        }
        Update: {
          control_id?: string
          id?: string
          risk_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "control_risks_control_id_fkey"
            columns: ["control_id"]
            isOneToOne: false
            referencedRelation: "controls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "control_risks_risk_id_fkey"
            columns: ["risk_id"]
            isOneToOne: false
            referencedRelation: "risks"
            referencedColumns: ["id"]
          },
        ]
      }
      controls: {
        Row: {
          created_at: string | null
          description: string | null
          effectiveness_score: number | null
          id: string
          name: string
          status: Database["public"]["Enums"]["control_status"] | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          effectiveness_score?: number | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["control_status"] | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          effectiveness_score?: number | null
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["control_status"] | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "controls_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      crypto_payments: {
        Row: {
          address: string
          amount_token: number
          amount_usd: number
          billing_cycle: string
          confirmed_at: string | null
          created_at: string | null
          currency: string
          expires_at: string
          id: string
          network: string
          plan_id: string
          status: string
          tenant_id: string
          tx_hash: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          amount_token: number
          amount_usd: number
          billing_cycle: string
          confirmed_at?: string | null
          created_at?: string | null
          currency?: string
          expires_at: string
          id?: string
          network: string
          plan_id: string
          status?: string
          tenant_id: string
          tx_hash?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          amount_token?: number
          amount_usd?: number
          billing_cycle?: string
          confirmed_at?: string | null
          created_at?: string | null
          currency?: string
          expires_at?: string
          id?: string
          network?: string
          plan_id?: string
          status?: string
          tenant_id?: string
          tx_hash?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crypto_payments_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crypto_payments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      deployment_logs: {
        Row: {
          completed_at: string | null
          deployed_by: string | null
          deployment_id: string
          environment: string | null
          id: string
          logs: string | null
          metadata: Json | null
          service_name: string
          started_at: string | null
          status: string
          version: string | null
        }
        Insert: {
          completed_at?: string | null
          deployed_by?: string | null
          deployment_id: string
          environment?: string | null
          id?: string
          logs?: string | null
          metadata?: Json | null
          service_name: string
          started_at?: string | null
          status: string
          version?: string | null
        }
        Update: {
          completed_at?: string | null
          deployed_by?: string | null
          deployment_id?: string
          environment?: string | null
          id?: string
          logs?: string | null
          metadata?: Json | null
          service_name?: string
          started_at?: string | null
          status?: string
          version?: string | null
        }
        Relationships: []
      }
      devsecops_findings: {
        Row: {
          code_snippet: string | null
          created_at: string | null
          cvss_score: number | null
          cwe_id: string | null
          description: string | null
          exploit_available: boolean | null
          file_path: string | null
          finding_type: string
          id: string
          line_number: number | null
          metadata: Json | null
          remediation: string | null
          resolved_at: string | null
          scan_id: string
          severity: string
          status: string | null
          title: string
        }
        Insert: {
          code_snippet?: string | null
          created_at?: string | null
          cvss_score?: number | null
          cwe_id?: string | null
          description?: string | null
          exploit_available?: boolean | null
          file_path?: string | null
          finding_type: string
          id?: string
          line_number?: number | null
          metadata?: Json | null
          remediation?: string | null
          resolved_at?: string | null
          scan_id: string
          severity: string
          status?: string | null
          title: string
        }
        Update: {
          code_snippet?: string | null
          created_at?: string | null
          cvss_score?: number | null
          cwe_id?: string | null
          description?: string | null
          exploit_available?: boolean | null
          file_path?: string | null
          finding_type?: string
          id?: string
          line_number?: number | null
          metadata?: Json | null
          remediation?: string | null
          resolved_at?: string | null
          scan_id?: string
          severity?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "devsecops_findings_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "devsecops_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      devsecops_pipeline_runs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          findings_summary: Json | null
          id: string
          logs: string | null
          pipeline_id: string
          scan_ids: string[] | null
          started_at: string | null
          status: string
          trigger_metadata: Json | null
          triggered_by: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          findings_summary?: Json | null
          id?: string
          logs?: string | null
          pipeline_id: string
          scan_ids?: string[] | null
          started_at?: string | null
          status?: string
          trigger_metadata?: Json | null
          triggered_by?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          findings_summary?: Json | null
          id?: string
          logs?: string | null
          pipeline_id?: string
          scan_ids?: string[] | null
          started_at?: string | null
          status?: string
          trigger_metadata?: Json | null
          triggered_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devsecops_pipeline_runs_pipeline_id_fkey"
            columns: ["pipeline_id"]
            isOneToOne: false
            referencedRelation: "devsecops_pipelines"
            referencedColumns: ["id"]
          },
        ]
      }
      devsecops_pipelines: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          enabled: boolean | null
          failure_threshold: Json | null
          id: string
          last_run_id: string | null
          name: string
          pipeline_yaml: string
          tenant_id: string
          triggers: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          failure_threshold?: Json | null
          id?: string
          last_run_id?: string | null
          name: string
          pipeline_yaml: string
          tenant_id: string
          triggers?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          enabled?: boolean | null
          failure_threshold?: Json | null
          id?: string
          last_run_id?: string | null
          name?: string
          pipeline_yaml?: string
          tenant_id?: string
          triggers?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devsecops_pipelines_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      devsecops_sbom: {
        Row: {
          components: Json
          created_at: string | null
          dependencies: Json | null
          format: string
          id: string
          metadata: Json | null
          scan_id: string
          version: string
          vulnerabilities: Json | null
        }
        Insert: {
          components?: Json
          created_at?: string | null
          dependencies?: Json | null
          format: string
          id?: string
          metadata?: Json | null
          scan_id: string
          version: string
          vulnerabilities?: Json | null
        }
        Update: {
          components?: Json
          created_at?: string | null
          dependencies?: Json | null
          format?: string
          id?: string
          metadata?: Json | null
          scan_id?: string
          version?: string
          vulnerabilities?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "devsecops_sbom_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "devsecops_scans"
            referencedColumns: ["id"]
          },
        ]
      }
      devsecops_scans: {
        Row: {
          completed_at: string | null
          config: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          progress_percent: number | null
          scan_types: string[]
          started_at: string | null
          status: string
          target_identifier: string
          target_type: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          progress_percent?: number | null
          scan_types: string[]
          started_at?: string | null
          status?: string
          target_identifier: string
          target_type: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
          progress_percent?: number | null
          scan_types?: string[]
          started_at?: string | null
          status?: string
          target_identifier?: string
          target_type?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devsecops_scans_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      doc_pages: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          id: string
          language: string | null
          order_index: number | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          language?: string | null
          order_index?: number | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          language?: string | null
          order_index?: number | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          recipient: string
          status: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          recipient: string
          status?: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          recipient?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
      findings: {
        Row: {
          created_at: string | null
          description: string | null
          discovered_at: string | null
          id: string
          resolved_at: string | null
          severity: Database["public"]["Enums"]["risk_severity"]
          status: string | null
          tenant_id: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discovered_at?: string | null
          id?: string
          resolved_at?: string | null
          severity: Database["public"]["Enums"]["risk_severity"]
          status?: string | null
          tenant_id: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discovered_at?: string | null
          id?: string
          resolved_at?: string | null
          severity?: Database["public"]["Enums"]["risk_severity"]
          status?: string | null
          tenant_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "findings_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_reports: {
        Row: {
          affected_services: string[] | null
          created_by: string | null
          description: string | null
          detected_at: string | null
          id: string
          metadata: Json | null
          resolution: string | null
          resolved_at: string | null
          root_cause: string | null
          severity: string
          status: string | null
          title: string
        }
        Insert: {
          affected_services?: string[] | null
          created_by?: string | null
          description?: string | null
          detected_at?: string | null
          id?: string
          metadata?: Json | null
          resolution?: string | null
          resolved_at?: string | null
          root_cause?: string | null
          severity: string
          status?: string | null
          title: string
        }
        Update: {
          affected_services?: string[] | null
          created_by?: string | null
          description?: string | null
          detected_at?: string | null
          id?: string
          metadata?: Json | null
          resolution?: string | null
          resolved_at?: string | null
          root_cause?: string | null
          severity?: string
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          paid_at: string | null
          status: string
          stripe_invoice_id: string | null
          subscription_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          paid_at?: string | null
          status: string
          stripe_invoice_id?: string | null
          subscription_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          paid_at?: string | null
          status?: string
          stripe_invoice_id?: string | null
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          category: Database["public"]["Enums"]["module_category"] | null
          created_at: string | null
          description: string | null
          documentation_url: string | null
          id: string
          metadata: Json | null
          name: string
          repository_url: string | null
          slug: string
          status: Database["public"]["Enums"]["module_status"] | null
          tags: string[] | null
          tenant_id: string
          updated_at: string | null
          version: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["module_category"] | null
          created_at?: string | null
          description?: string | null
          documentation_url?: string | null
          id?: string
          metadata?: Json | null
          name: string
          repository_url?: string | null
          slug: string
          status?: Database["public"]["Enums"]["module_status"] | null
          tags?: string[] | null
          tenant_id: string
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["module_category"] | null
          created_at?: string | null
          description?: string | null
          documentation_url?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          repository_url?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["module_status"] | null
          tags?: string[] | null
          tenant_id?: string
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modules_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          tenant_id: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          tenant_id: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          tenant_id?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      plans: {
        Row: {
          created_at: string | null
          features: Json | null
          id: string
          limits: Json | null
          name: string
          price_monthly: number
          price_yearly: number
          stripe_price_id_monthly: string | null
          stripe_price_id_yearly: string | null
          tier: Database["public"]["Enums"]["plan_tier"]
          usdt_price_monthly: number | null
          usdt_price_yearly: number | null
        }
        Insert: {
          created_at?: string | null
          features?: Json | null
          id?: string
          limits?: Json | null
          name: string
          price_monthly: number
          price_yearly: number
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          tier: Database["public"]["Enums"]["plan_tier"]
          usdt_price_monthly?: number | null
          usdt_price_yearly?: number | null
        }
        Update: {
          created_at?: string | null
          features?: Json | null
          id?: string
          limits?: Json | null
          name?: string
          price_monthly?: number
          price_yearly?: number
          stripe_price_id_monthly?: string | null
          stripe_price_id_yearly?: string | null
          tier?: Database["public"]["Enums"]["plan_tier"]
          usdt_price_monthly?: number | null
          usdt_price_yearly?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          language: string | null
          preferred_language: string | null
          status: string | null
          tenant_id: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          language?: string | null
          preferred_language?: string | null
          status?: string | null
          tenant_id?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          language?: string | null
          preferred_language?: string | null
          status?: string | null
          tenant_id?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          action: string
          count: number | null
          id: string
          identifier: string
          window_start: string | null
        }
        Insert: {
          action: string
          count?: number | null
          id?: string
          identifier: string
          window_start?: string | null
        }
        Update: {
          action?: string
          count?: number | null
          id?: string
          identifier?: string
          window_start?: string | null
        }
        Relationships: []
      }
      risks: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          impact_score: number | null
          likelihood_score: number | null
          mitigation_plan: string | null
          owner_id: string | null
          severity: Database["public"]["Enums"]["risk_severity"]
          status: Database["public"]["Enums"]["risk_status"] | null
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          impact_score?: number | null
          likelihood_score?: number | null
          mitigation_plan?: string | null
          owner_id?: string | null
          severity: Database["public"]["Enums"]["risk_severity"]
          status?: Database["public"]["Enums"]["risk_status"] | null
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          impact_score?: number | null
          likelihood_score?: number | null
          mitigation_plan?: string | null
          owner_id?: string | null
          severity?: Database["public"]["Enums"]["risk_severity"]
          status?: Database["public"]["Enums"]["risk_status"] | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "risks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_audits: {
        Row: {
          created_at: string | null
          extracted_data: Json | null
          id: string
          issues: Json | null
          language: string | null
          metadata: Json | null
          page_type: string | null
          recommendations: Json | null
          scanned_at: string | null
          seo_score: number | null
          status: string | null
          tenant_id: string | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          extracted_data?: Json | null
          id?: string
          issues?: Json | null
          language?: string | null
          metadata?: Json | null
          page_type?: string | null
          recommendations?: Json | null
          scanned_at?: string | null
          seo_score?: number | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          extracted_data?: Json | null
          id?: string
          issues?: Json | null
          language?: string | null
          metadata?: Json | null
          page_type?: string | null
          recommendations?: Json | null
          scanned_at?: string | null
          seo_score?: number | null
          status?: string | null
          tenant_id?: string | null
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_audits_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_fix_history: {
        Row: {
          after_value: Json | null
          applied_at: string | null
          applied_by: string | null
          audit_id: string | null
          before_value: Json | null
          fix_type: string
          id: string
          tenant_id: string | null
        }
        Insert: {
          after_value?: Json | null
          applied_at?: string | null
          applied_by?: string | null
          audit_id?: string | null
          before_value?: Json | null
          fix_type: string
          id?: string
          tenant_id?: string | null
        }
        Update: {
          after_value?: Json | null
          applied_at?: string | null
          applied_by?: string | null
          audit_id?: string | null
          before_value?: Json | null
          fix_type?: string
          id?: string
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_fix_history_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "seo_audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_fix_history_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_recommendations: {
        Row: {
          applied_at: string | null
          audit_id: string | null
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          priority: string | null
          recommendation_type: string
          status: string | null
          tenant_id: string | null
          title: string
        }
        Insert: {
          applied_at?: string | null
          audit_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          recommendation_type: string
          status?: string | null
          tenant_id?: string | null
          title: string
        }
        Update: {
          applied_at?: string | null
          audit_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          priority?: string | null
          recommendation_type?: string
          status?: string | null
          tenant_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_recommendations_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "seo_audits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seo_recommendations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_scan_logs: {
        Row: {
          completed_at: string | null
          duration_ms: number | null
          error_message: string | null
          id: string
          issues_found: number | null
          scan_type: string
          started_at: string | null
          status: string | null
          tenant_id: string | null
          urls_scanned: number | null
        }
        Insert: {
          completed_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          issues_found?: number | null
          scan_type: string
          started_at?: string | null
          status?: string | null
          tenant_id?: string | null
          urls_scanned?: number | null
        }
        Update: {
          completed_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          id?: string
          issues_found?: number | null
          scan_type?: string
          started_at?: string | null
          status?: string | null
          tenant_id?: string | null
          urls_scanned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_scan_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_scores: {
        Row: {
          accessibility_score: number | null
          content_score: number | null
          id: string
          metadata_score: number | null
          overall_score: number | null
          performance_score: number | null
          scored_at: string | null
          technical_score: number | null
          tenant_id: string | null
          url: string
        }
        Insert: {
          accessibility_score?: number | null
          content_score?: number | null
          id?: string
          metadata_score?: number | null
          overall_score?: number | null
          performance_score?: number | null
          scored_at?: string | null
          technical_score?: number | null
          tenant_id?: string | null
          url: string
        }
        Update: {
          accessibility_score?: number | null
          content_score?: number | null
          id?: string
          metadata_score?: number | null
          overall_score?: number | null
          performance_score?: number | null
          scored_at?: string | null
          technical_score?: number | null
          tenant_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_scores_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      service_health: {
        Row: {
          error_message: string | null
          id: string
          last_check: string | null
          metadata: Json | null
          response_time_ms: number | null
          service_name: string
          status: string
          updated_at: string | null
        }
        Insert: {
          error_message?: string | null
          id?: string
          last_check?: string | null
          metadata?: Json | null
          response_time_ms?: number | null
          service_name: string
          status: string
          updated_at?: string | null
        }
        Update: {
          error_message?: string | null
          id?: string
          last_check?: string | null
          metadata?: Json | null
          response_time_ms?: number | null
          service_name?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      simulation_events: {
        Row: {
          created_at: string | null
          data: Json | null
          event_type: string
          id: string
          message: string
          simulation_id: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          event_type: string
          id?: string
          message: string
          simulation_id: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          event_type?: string
          id?: string
          message?: string
          simulation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "simulation_events_simulation_id_fkey"
            columns: ["simulation_id"]
            isOneToOne: false
            referencedRelation: "simulations"
            referencedColumns: ["id"]
          },
        ]
      }
      simulations: {
        Row: {
          completed_at: string | null
          config: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          scenario: Database["public"]["Enums"]["simulation_scenario"]
          started_at: string | null
          status: Database["public"]["Enums"]["simulation_status"] | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          scenario: Database["public"]["Enums"]["simulation_scenario"]
          started_at?: string | null
          status?: Database["public"]["Enums"]["simulation_status"] | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          completed_at?: string | null
          config?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          scenario?: Database["public"]["Enums"]["simulation_scenario"]
          started_at?: string | null
          status?: Database["public"]["Enums"]["simulation_status"] | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "simulations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ssl_status: {
        Row: {
          days_remaining: number | null
          domain: string
          id: string
          issuer: string | null
          last_checked: string | null
          metadata: Json | null
          status: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          days_remaining?: number | null
          domain: string
          id?: string
          issuer?: string | null
          last_checked?: string | null
          metadata?: Json | null
          status: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          days_remaining?: number | null
          domain?: string
          id?: string
          issuer?: string | null
          last_checked?: string | null
          metadata?: Json | null
          status?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      stages: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          order_index: number
          start_date: string | null
          status: Database["public"]["Enums"]["stage_status"] | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          order_index?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["stage_status"] | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          order_index?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["stage_status"] | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_cycle: string | null
          billing_owner_id: string | null
          cancel_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan_id: string
          status: string
          stripe_subscription_id: string | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          billing_cycle?: string | null
          billing_owner_id?: string | null
          cancel_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id: string
          status?: string
          stripe_subscription_id?: string | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          billing_cycle?: string | null
          billing_owner_id?: string | null
          cancel_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan_id?: string
          status?: string
          stripe_subscription_id?: string | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      system_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          message: string | null
          metadata: Json | null
          read: boolean | null
          severity: string
          tenant_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          message?: string | null
          metadata?: Json | null
          read?: boolean | null
          severity?: string
          tenant_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          message?: string | null
          metadata?: Json | null
          read?: boolean | null
          severity?: string
          tenant_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      system_metrics: {
        Row: {
          id: string
          labels: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at: string | null
          tenant_id: string | null
          unit: string | null
        }
        Insert: {
          id?: string
          labels?: Json | null
          metric_name: string
          metric_type: string
          metric_value: number
          recorded_at?: string | null
          tenant_id?: string | null
          unit?: string | null
        }
        Update: {
          id?: string
          labels?: Json | null
          metric_name?: string
          metric_type?: string
          metric_value?: number
          recorded_at?: string | null
          tenant_id?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_metrics_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assignee_id: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          priority: Database["public"]["Enums"]["task_priority"] | null
          stage_id: string | null
          status: Database["public"]["Enums"]["task_status"] | null
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          stage_id?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["task_priority"] | null
          stage_id?: string | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_stage_id_fkey"
            columns: ["stage_id"]
            isOneToOne: false
            referencedRelation: "stages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          name: string
          settings: Json | null
          stripe_customer_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          id?: string
          name: string
          settings?: Json | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          name?: string
          settings?: Json | null
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      usage_events: {
        Row: {
          created_at: string | null
          id: string
          metadata: Json | null
          quantity: number
          tenant_id: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          quantity?: number
          tenant_id: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          metadata?: Json | null
          quantity?: number
          tenant_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_events_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id: string | null
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          tenant_id?: string | null
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          tenant_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          created_at: string | null
          device_fingerprint: string | null
          id: string
          ip_address: string | null
          last_activity: string | null
          location: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          location?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: string | null
          last_activity?: string | null
          location?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_action: string
          p_identifier: string
          p_max_attempts: number
          p_window_seconds: number
        }
        Returns: boolean
      }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      get_tenant_usage_summary: { Args: { p_tenant_id: string }; Returns: Json }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_hypervisor: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "PLATFORM_ADMIN"
        | "ADMIN"
        | "OPS"
        | "VIEWER"
        | "BILLING_OWNER"
        | "HYPERVISOR"
      component_type:
        | "SERVICE"
        | "DATABASE"
        | "API"
        | "FRONTEND"
        | "BACKEND"
        | "NETWORK"
        | "STORAGE"
      control_status: "ACTIVE" | "INACTIVE" | "TESTING" | "FAILED"
      health_status: "HEALTHY" | "DEGRADED" | "DOWN" | "UNKNOWN"
      module_category:
        | "INFRASTRUCTURE"
        | "SECURITY"
        | "NETWORK"
        | "DATA"
        | "APPLICATION"
      module_status:
        | "DRAFT"
        | "EXPERIMENTAL"
        | "CANARY"
        | "STABLE"
        | "DEPRECATED"
      plan_tier:
        | "FREE"
        | "PLUS"
        | "PRO"
        | "ULTRA"
        | "ENTERPRISE"
        | "ENTERPRISE_PLUS"
      risk_severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
      risk_status:
        | "IDENTIFIED"
        | "ASSESSING"
        | "MITIGATING"
        | "MONITORING"
        | "CLOSED"
      simulation_scenario:
        | "BREACH_DETECTION"
        | "INCIDENT_RESPONSE"
        | "COMPLIANCE_AUDIT"
        | "DISASTER_RECOVERY"
        | "PENETRATION_TEST"
      simulation_status:
        | "PENDING"
        | "RUNNING"
        | "COMPLETED"
        | "FAILED"
        | "CANCELLED"
      stage_status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "BLOCKED"
      task_priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
      task_status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | "BLOCKED"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "PLATFORM_ADMIN",
        "ADMIN",
        "OPS",
        "VIEWER",
        "BILLING_OWNER",
        "HYPERVISOR",
      ],
      component_type: [
        "SERVICE",
        "DATABASE",
        "API",
        "FRONTEND",
        "BACKEND",
        "NETWORK",
        "STORAGE",
      ],
      control_status: ["ACTIVE", "INACTIVE", "TESTING", "FAILED"],
      health_status: ["HEALTHY", "DEGRADED", "DOWN", "UNKNOWN"],
      module_category: [
        "INFRASTRUCTURE",
        "SECURITY",
        "NETWORK",
        "DATA",
        "APPLICATION",
      ],
      module_status: [
        "DRAFT",
        "EXPERIMENTAL",
        "CANARY",
        "STABLE",
        "DEPRECATED",
      ],
      plan_tier: [
        "FREE",
        "PLUS",
        "PRO",
        "ULTRA",
        "ENTERPRISE",
        "ENTERPRISE_PLUS",
      ],
      risk_severity: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      risk_status: [
        "IDENTIFIED",
        "ASSESSING",
        "MITIGATING",
        "MONITORING",
        "CLOSED",
      ],
      simulation_scenario: [
        "BREACH_DETECTION",
        "INCIDENT_RESPONSE",
        "COMPLIANCE_AUDIT",
        "DISASTER_RECOVERY",
        "PENETRATION_TEST",
      ],
      simulation_status: [
        "PENDING",
        "RUNNING",
        "COMPLETED",
        "FAILED",
        "CANCELLED",
      ],
      stage_status: ["PLANNED", "IN_PROGRESS", "COMPLETED", "BLOCKED"],
      task_priority: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      task_status: ["TODO", "IN_PROGRESS", "REVIEW", "DONE", "BLOCKED"],
    },
  },
} as const
