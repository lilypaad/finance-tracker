import * as z from "zod";

export const LoginFormSchema = z.object({
    email: z.email({ error: "Please enter a valid email" }).trim(),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters long" })
      .regex(/[a-zA-Z]/, { error: "Password must contain a letter" })
      .regex(/[0-9]/, { error: "Password must contain a number" })
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
