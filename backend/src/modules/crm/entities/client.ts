export interface Client {
  id: string;
  tenant_id: string;
  name: string;
  email?: string;
  phone: string;
  birthday?: Date;
  classification?: 'regular' | 'vip' | 'inactive';
  total_spent?: number;
  appointments_count?: number;
  last_appointment_date?: Date;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
