export interface AIConfiguration {
  id: string;
  tenant_id: string;
  agent_name: string;
  personality: 'professional' | 'friendly' | 'casual' | 'classic';
  custom_rules: string;
  trigger_reactivation_days: number;
  is_active: boolean;
  created_at: Date;
  updated_at?: Date;
}
