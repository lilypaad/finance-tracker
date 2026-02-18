"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

import { login } from "@/lib/auth";
import { LoginFormSchema } from '@/schemas/login-form';

export default function LogInForm() {
  async function onSubmit(data: z.infer<typeof LoginFormSchema>) {
    await login(data);
  }

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <>
    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input {...field} id={field.name} type="email" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && ( <FieldError errors={[fieldState.error]} /> )}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input {...field} id={field.name} type="password" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && ( <FieldError errors={[fieldState.error]} /> )}
            </Field>
          )}
        />
      </FieldGroup>
      <div className="flex flex-col gap-y-3">
        <Button type="submit">Log In</Button>
      </div>
    </form>
    <div className="flex flex-col gap-y-3 mt-3">
      <Button variant="outline" disabled>Sign in with Google</Button>
      <Button asChild variant="outline">
          <Link href="/signup">Sign up</Link>
      </Button>
    </div>
    </>
  );
}