import { z } from 'zod';

export const aiConfigSchema = z.object({
  agent_name: z.string().min(2, 'Nome muito curto'),
  personality: z.enum(['professional', 'friendly', 'casual', 'classic']),
  custom_rules: z.string().optional(),
  trigger_reactivation_days: z.number().min(1).max(365).optional()
});
