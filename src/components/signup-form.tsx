"use client";

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

import { signup } from "@/lib/auth";
import { SignupFormSchema } from "@/schemas/signup-form";
import { redirect } from "next/navigation";

export default function SignupForm() {
  async function onSubmit(data: z.infer<typeof SignupFormSchema>) {
    await signup(data);
    redirect("/");
  }

  const form = useForm<z.infer<typeof SignupFormSchema>>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
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
        
        <div className="grid grid-cols-2 gap-4">
          <Controller
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="firstName">First Name</FieldLabel>
                <Input {...field} id={field.name} type="firstName" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && ( <FieldError errors={[fieldState.error]} /> )}
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
                <Input {...field} id={field.name} type="lastName" aria-invalid={fieldState.invalid} />
                {fieldState.invalid && ( <FieldError errors={[fieldState.error]} /> )}
              </Field>
            )}
          />
        </div>
      </FieldGroup>
      <div className="flex flex-col gap-y-3">
        <Button type="submit">Sign up</Button>
      </div>
      {/* <Button variant="outline" disabled>Sign in with Google</Button> */}
    </form>
    </>
  );
}