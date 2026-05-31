export interface Plan {
  id: string;
  name: string;
  price: number;
  max_barbers: number;
}
export interface Subscription {
  tenant_id: string;
  plan_id: string;
  status: 'active' | 'past_due' | 'unpaid' | 'canceled';
  current_period_end: Date;
}
