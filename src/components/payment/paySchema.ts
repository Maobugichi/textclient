import { z } from 'zod';


export const paymentSchema = z.object({
  amount: z
    .number()
    .min(1000, "Minimum amount is ₦1,000")
    .positive("Amount must be positive"),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;