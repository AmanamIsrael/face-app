import { z } from "zod";

export const questionSchema = z.object({
  message: z.string(), // we would not need thos
  image: z.string().optional(),
});
