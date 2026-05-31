import { z } from 'zod';

export const financialCreateSchema = z.object({
  type: z.enum(['revenue', 'expense']),
  category: z.string().min(1, 'A categoria é obrigatória'),
  amount: z.number().positive('O valor deve ser estritamente positivo'),
  description: z.string().optional(),
  entry_date: z.string().optional()
});
