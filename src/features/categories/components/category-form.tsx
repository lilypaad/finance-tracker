import { z } from "zod";
import { Trash } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

import { insertCategorySchema } from "@/db/schema";

const formSchema = insertCategorySchema.pick({ name: true });
type FormValues = z.input<typeof formSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
};

export function CategoryForm({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled
}: Props) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="text"
                placeholder="e.g. Groceries, Bills, Travel, etc."
                disabled={disabled}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (<FieldError errors={[fieldState.error]} />)}
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" className="w-full" disabled={disabled}>
        {id ? "Save changes" : "Create category"}
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
          Delete category
        </Button>
      )}
    </form>

  )
}