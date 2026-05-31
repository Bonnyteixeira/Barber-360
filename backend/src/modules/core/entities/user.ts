export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: 'trial' | 'active' | 'suspended' | 'canceled';
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  tenant_id: string;
  name: string;
  email: string;
  password_hash: string;
  phone?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
