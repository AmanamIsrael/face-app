import { z } from "zod";

export const questionSchema = z.object({
  message: z.string(),
  image: z.string().optional(),
});
