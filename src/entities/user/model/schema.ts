import { z } from 'zod';

export const UserSchema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string().nullable(),
  account_key: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;
