import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../shared/middlewares/tenant.js';
import { getDbPool } from '../../database/connection.js';

export class DashboardController {
  
  // 1. Compile operational analytics dashboard KPIs
  static async getMetrics(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const tenantId = req.tenantId;

      if (!tenantId) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Mapeamento de TenantId em falta.',
          errors: ['Tenant ID context missing']
        });
      }

      // Query 1: Booking Counts by Status
      const bookingsRes = await pool.query(
        `SELECT status, COUNT(*)::int as count, SUM(total_price)::numeric as val
         FROM appointments 
         WHERE tenant_id = $1 
         GROUP BY status`,
        [tenantId]
      );

      // Query 2: Financial Cashflow Totals (revenue & expenses)
      const cashflowRes = await pool.query(
        `SELECT type, SUM(amount)::numeric as total 
         FROM financial_entries 
         WHERE tenant_id = $1 
         GROUP BY type`,
        [tenantId]
      );

      // Query 3: Commissions Sums by Status
      const commsRes = await pool.query(
        `SELECT status, SUM(amount)::numeric as total 
         FROM commissions 
         WHERE tenant_id = $1 
         GROUP BY status`,
        [tenantId]
      );

      // Query 4: Total Barber Count
      const barbersCount = await pool.query(
        'SELECT COUNT(*)::int as count FROM barbers WHERE tenant_id = $1 AND deleted_at IS NULL',
        [tenantId]
      );

      // Query 5: Total Registered Clients
      const clientsCount = await pool.query(
        'SELECT COUNT(*)::int as count FROM clients WHERE tenant_id = $1 AND deleted_at IS NULL',
        [tenantId]
      );

      // Reduce counts
      const statusCounts = bookingsRes.rows.reduce((acc: any, row: any) => {
        acc[row.status] = { count: row.count, total_value: parseFloat(row.val || 0) };
        return acc;
      }, { scheduled: { count: 0, total_value: 0 }, confirmed: { count: 0, total_value: 0 }, completed: { count: 0, total_value: 0 }, canceled: { count: 0, total_value: 0 } });

      const financialSummary = cashflowRes.rows.reduce((acc: any, row: any) => {
        acc[row.type] = parseFloat(row.total || 0);
        return acc;
      }, { revenue: 0, expense: 0 });

      const commissionSummary = commsRes.rows.reduce((acc: any, row: any) => {
        acc[row.status] = parseFloat(row.total || 0);
        return acc;
      }, { pending: 0, paid: 0 });

      return res.json({
        success: true,
        data: {
          metrics: {
            total_bookings: Object.values(statusCounts).reduce((acc: number, val: any) => acc + val.count, 0),
            bookings_by_status: statusCounts,
            financial: {
              direct_revenue: financialSummary.revenue,
              direct_expense: financialSummary.expense,
              appointments_revenue: statusCounts.completed.total_value + statusCounts.scheduled.total_value + statusCounts.confirmed.total_value,
              net_liquid_estimate: (financialSummary.revenue + statusCounts.completed.total_value) - (financialSummary.expense + commissionSummary.paid)
            },
            commissions: commissionSummary,
            demographics: {
              active_barbers: barbersCount.rows[0]?.count || 0,
              total_clients: clientsCount.rows[0]?.count || 0
            }
          }
        },
        message: 'Kpis operacionais consolidados com sucesso.',
        errors: []
      });

    } catch (e) {
      next(e);
    }
  }
}
