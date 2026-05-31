export interface AnalyticalMetrics {
  total_bookings: number;
  commissions: {
    pending: number;
    paid: number;
  };
  demographics: {
    active_barbers: number;
    total_clients: number;
  };
}
