import { z } from 'zod';

export const clientCreateSchema = z.object({
  name: z.string().min(2, 'Nome do cliente inválido'),
  phone: z.string().min(8, 'Contato de celular inválido'),
  email: z.string().email('E-mail inválido').optional(),
  classification: z.enum(['regular', 'vip', 'inactive']).optional()
});
