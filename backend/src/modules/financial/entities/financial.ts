export interface FinancialEntry {
  id: string;
  tenant_id: string;
  type: 'revenue' | 'expense';
  category: string;
  amount: number;
  description?: string;
  entry_date: Date;
  created_at: Date;
}

export interface Commission {
  id: string;
  tenant_id: string;
  barber_id: string;
  appointment_id?: string;
  commission_percentage: number;
  amount: number;
  status: 'pending' | 'paid';
  paid_at?: Date;
  created_at: Date;
  updated_at?: Date;
}
