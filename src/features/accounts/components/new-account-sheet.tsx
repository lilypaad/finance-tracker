import * as z from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { AccountForm } from "@/features/accounts/components/account-form";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { insertAccountSchema } from "@/db/schema";

const formSchema = insertAccountSchema.pick({ name: true });
type FormValues = z.input<typeof formSchema>;

export function NewAccountSheet() {
  const { isOpen, onClose } = useNewAccount();
  
  const mutation = useCreateAccount();
  
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="px-4">
        <SheetHeader className="px-0">
          <SheetTitle>
            New Account
          </SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions.
          </SheetDescription>
        </SheetHeader>
        <AccountForm 
          onSubmit={onSubmit}
          defaultValues={{
            name: "",
          }}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
}