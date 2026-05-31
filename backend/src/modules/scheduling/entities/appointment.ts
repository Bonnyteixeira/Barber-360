export interface Barber {
  id: string;
  tenant_id: string;
  user_id?: string;
  name: string;
  specialties: string[];
  commission_rate: number;
  is_available: boolean;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface Service {
  id: string;
  tenant_id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
  created_at: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

export interface Appointment {
  id: string;
  tenant_id: string;
  client_id: string;
  barber_id: string;
  service_id: string;
  start_time: Date;
  end_time: Date;
  status: 'scheduled' | 'confirmed' | 'completed' | 'canceled';
  total_price: number;
  notes?: string;
  created_at: Date;
  updated_at?: Date;
}
