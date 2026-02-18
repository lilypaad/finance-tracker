import * as z from "zod";

export const LoginFormSchema = z.object({
    email: z.email({ error: "Please enter a valid email" }).trim(),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters" })
      .max(64, { error: "Password must be at most 64 characters" })
      .trim(),
});

export type LoginFormState = 
  | {
    errors?: {
        email?: string[];
        password?: string[];
    }
    message?: string
  }
  | undefined;
