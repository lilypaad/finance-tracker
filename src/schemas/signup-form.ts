import * as z from "zod";

export const SignupFormSchema = z.object({
    email: z.email({ error: "Invalid email" }).trim(),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters" })
      .max(64, { error: "Password must be at most 64 characters"})
      .regex(/[a-zA-Z]/, { error: "Password must contain a letter" })
      .regex(/[0-9]/, { error: "Password must contain a number" }),
    firstName: z.string().max(64, { error: "Name is too long" }).trim(),
    lastName: z.string().max(64, { error: "Name is too long" }).trim(),
});

export type SignupFormState = 
  | {
    errors?: {
        email?: string[];
        password?: string[];
        firstName?: string[];
        lastName?: string[];
    }
    message?: string
  }
  | undefined;
