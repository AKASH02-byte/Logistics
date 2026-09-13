import { z } from "zod";

export const openSessionSchema = z.object({
  truckId: z.string().uuid("Select a valid truck"),
});

export const closeSessionSchema = z.object({
  closingOdometer: z.number().positive("Closing odometer must be positive"),
});
