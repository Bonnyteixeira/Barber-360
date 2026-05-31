export interface Campaign {
  id: string;
  tenant_id: string;
  title: string;
  text: string;
  target_segment: string;
  sent_at: Date;
}
