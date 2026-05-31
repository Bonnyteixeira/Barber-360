import { z } from 'zod';

export const uploadRequestSchema = z.object({
  fileName: z.string().min(1),
  purpose: z.enum(['avatars', 'logos', 'audio', 'documents', 'backups'])
});
