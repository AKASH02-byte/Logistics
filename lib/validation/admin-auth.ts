import { z } from "zod";

export const adminLoginSchema = z.object({
  adminId: z.string().trim().min(1, "Admin ID is required").max(40),
  password: z.string().min(1, "Password is required").max(100),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
