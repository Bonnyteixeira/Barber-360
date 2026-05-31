import { z } from 'zod';

export const analyticsQuerySchema = z.object({
  timeFrame: z.enum(['7d', '30d', 'ytd']).optional()
});
