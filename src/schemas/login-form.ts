import * as z from "zod";

export const LoginFormSchema = z.object({
    email: z.email({ error: "Please enter a valid email" }).trim(),
    password: z
      .string()
      .min(1, { error: "Please enter your password" })
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
