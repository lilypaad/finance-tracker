import * as z from "zod";

import { insertAccountSchema } from "@/db/schema";

export const AccountFormSchema = insertAccountSchema.pick({ name: true });

export type AccountFormValues = z.input<typeof AccountFormSchema>;

export type AccountFormState = 
  | {
    errors?: {
        name?: string[];
    }
    message?: string
  }
  | undefined;

