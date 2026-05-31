import { z } from 'zod';

export const appointmentCreateSchema = z.object({
  barber_id: z.string().uuid('ID do barbeiro inválido'),
  client_id: z.string().uuid('ID do cliente inválido'),
  service_id: z.string().uuid('ID do serviço inválido'),
  start_time: z.string().datetime('Data e hora no formato ISO obrigatório'),
  notes: z.string().optional()
});
