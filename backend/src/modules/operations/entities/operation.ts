export interface AuditLog {
  id: string;
  tenant_id?: string;
  user_id?: string;
  action: string;
  entity?: string;
  entity_id?: string;
  ip_address?: string;
  created_at: Date;
}
