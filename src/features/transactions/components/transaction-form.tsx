import { z } from "zod";
import { Trash } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/select";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

import { insertTransactionSchema } from "@/db/schema";

const formSchema = insertTransactionSchema;
type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  categoryOptions: { label: string, value: string }[];
  accountOptions: { label: string, value: string }[];
  onCreateCategory: (name: string) => void;
  onCreateAccount: (name: string) => void;
};

export function TransactionForm({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  categoryOptions,
  accountOptions,
  onCreateCategory,
  onCreateAccount
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    console.log({ values });
    // onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="accountId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Account</FieldLabel>
              <Select
                placeholder="Select an account"
                options={accountOptions}
                onCreateAction={onCreateAccount}
                onChangeAction={field.onChange}
                value={field.value}
                disabled={disabled}
              />
              {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="categoryId"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Account</FieldLabel>
              <Select
                placeholder="Select an category"
                options={categoryOptions}
                onCreateAction={onCreateCategory}
                onChangeAction={field.onChange}
                value={field.value}
                disabled={disabled}
              />
              {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={disabled}>
        {id ? "Save changes" : "Create account"}
      </Button>

      {!!id && (
        <Button
          type="button"
          disabled={disabled}
          onClick={handleDelete}
          variant="outline"
          className="w-full"
        >
          <Trash className="size-4 mr-2" />
          Delete account
        </Button>
      )}
    </form>

  )
}