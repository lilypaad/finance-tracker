import { z } from "zod";
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
import { DatePicker } from "@/components/date-picker";
import { Textarea } from "@/components/ui/textarea";
import { AmountInput } from "@/components/amount-input";

const formSchema = insertTransactionSchema.omit({ userId: true })
.extend({
  amount: z.string(),
  payee: z.string().optional(),
  notes: z.string().optional(),
  accountId: z.string(),
  categoryId: z.string().optional(),
});
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
    onSubmit(values);
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="date"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
              />
              {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
            </Field>
          )}
        />

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

        <Controller
          control={form.control}
          name="payee"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="payee">Payee</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                placeholder="Add a payee"
                disabled={disabled}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="amount"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="amount">Amount</FieldLabel>
              <AmountInput
                value={field.value}
                onChange={field.onChange}
                disabled={disabled}
                placeholder=""
              />
              {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="notes"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="notes">Notes</FieldLabel>
              <Textarea
                {...field}
                value={field.value ?? ""}
                disabled={disabled}
                placeholder="Add a note (optional)"
              />
              {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={disabled}>
        Create transaction
      </Button>
    </form>
  );
}