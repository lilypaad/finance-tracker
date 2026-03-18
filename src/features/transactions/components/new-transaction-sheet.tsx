import * as z from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";

import { insertTransactionSchema } from "@/db/schema";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";

import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { convertAmountToMiliunits } from "@/lib/utils";

const formSchema = insertTransactionSchema.omit({ userId: true }).extend({
  amount: z.string(),
  payee: z.string().optional(),
  notes: z.string().optional(),
  accountId: z.string(),
  categoryId: z.string().optional(),
});
type FormValues = z.input<typeof formSchema>;

export function NewTransactionSheet() {
  const { isOpen, onClose } = useNewTransaction();

  const createMutation = useCreateTransaction();

  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const onCreateCateogry = (name: string) => categoryMutation.mutate({ name });
  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id.toString(),
  }));

  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const onCreateAccount = (name: string) => accountMutation.mutate({ name });
  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id.toString(),
  }));

  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    const amount = parseFloat(values.amount);
    const amountInMiliunits = convertAmountToMiliunits(amount);

    const out = {
      ...values,
      amount: amountInMiliunits,
      accountId: parseInt(values.accountId),
      categoryId: values.categoryId ? parseInt(values.categoryId) : undefined,
    }
    console.log(out);

    createMutation.mutate(out, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  const defaultValues = {
    date: new Date(),
    amount: undefined,
    payee: undefined,
    notes: undefined,
    accountId: undefined,
    categoryId: undefined,
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="px-4">
        <SheetHeader className="px-0">
          <SheetTitle>
            New Transaction
          </SheetTitle>
          <SheetDescription>
            Add a new transaction to your account.
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            onSubmit={onSubmit}
            categoryOptions={categoryOptions}
            accountOptions={accountOptions}
            onCreateCategory={onCreateCateogry}
            onCreateAccount={onCreateAccount}
            disabled={createMutation.isPending || categoryMutation.isPending || accountMutation.isPending}
            defaultValues={defaultValues}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}