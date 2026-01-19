import { z } from 'zod';

const numberFromString = (value: unknown) => {
  if (value === '' || value === null || value === undefined) {
    return undefined;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }
  if (typeof value === 'number' && Number.isNaN(value)) {
    return undefined;
  }
  return Number(value);
};

const optionalPositiveNumber = z.preprocess(
  numberFromString,
  z.number().positive('Value must be positive').optional()
);

const optionalBillingDay = z.preprocess(
  numberFromString,
  z.number().int().min(1).max(31).optional()
);

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createItemSchema = z.object({
  type: z.enum(['SUBSCRIPTION', 'ACCOUNT']),
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().max(255).optional().or(z.literal('')),
  password: z.string().optional(),
  value: optionalPositiveNumber,
  billingDay: optionalBillingDay,
  duration: z.enum(['MONTHLY', 'SEMIANNUAL', 'ANNUAL']).optional(),
  notes: z.string().max(500).optional(),
});

export const updateItemSchema = createItemSchema.partial();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
