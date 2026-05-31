import { z } from 'zod';

export const auditQuerySchema = z.object({
  limit: z.number().optional()
});
