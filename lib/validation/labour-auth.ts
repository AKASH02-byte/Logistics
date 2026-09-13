import { z } from "zod";

export const labourLoginSchema = z.object({
  labourId: z
    .string()
    .trim()
    .min(1, "Labour ID is required")
    .max(20, "Labour ID is too long"),
  loginKey: z
    .string()
    .trim()
    .min(1, "Login Key is required")
    .max(40, "Login Key is too long"),
});

export type LabourLoginInput = z.infer<typeof labourLoginSchema>;
