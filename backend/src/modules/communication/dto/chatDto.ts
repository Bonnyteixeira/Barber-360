import { z } from 'zod';

export const sendMessageSchema = z.object({
  sessionId: z.string().uuid(),
  content: z.string().min(1, 'A mensagem não pode ser vazia'),
  sender: z.enum(['client', 'bot', 'human']).optional()
});
