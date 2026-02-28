import { z } from "zod";

export const HealthResponseSchema = z.object({
  status: z.literal("ok"),
  name: z.string().min(1)
});

export type HealthResponse = z.infer<typeof HealthResponseSchema>;
