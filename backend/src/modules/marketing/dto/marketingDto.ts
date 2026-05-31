import { z } from 'zod';

export const campaignCreateSchema = z.object({
  title: z.string().min(3),
  text: z.string().min(10),
  targetSegment: z.string()
});
