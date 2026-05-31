import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres')
});

export const registerSchema = z.object({
  tenantName: z.string().min(3, 'Nome da barbearia deve ter mais de 3 letras'),
  slug: z.string().min(2, 'Slug deve ter mais de 2 letras'),
  name: z.string().min(3, 'Nome deve ter mais de 3 letras'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve conter mais de 6 caracteres'),
  phone: z.string().optional()
});
