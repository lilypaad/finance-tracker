import * as z from "zod";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";

import { AccountForm } from "@/features/accounts/components/account-form";
import { insertAccountSchema } from "@/db/schema";
import { useGetAccount } from "@/features/accounts/api/use-get-account";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useEditAccount } from "@/features/accounts/api/use-edit-account";

const formSchema = insertAccountSchema.pick({ name: true });
type FormValues = z.input<typeof formSchema>;

export function EditAccountSheet() {
  const { isOpen, onClose, id } = useOpenAccount();
  
  const accountQuery = useGetAccount(id);
  const mutation = useEditAccount(id);
  
  const isLoading = accountQuery.isLoading;
  const isPending = mutation.isPending;
  
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values, {
      onSuccess: () => {
        onClose();
      }
    });
  };
  
  const defaultValues = accountQuery.data ? { name: accountQuery.data.name } : { name: "" }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="px-4">
        <SheetHeader className="px-0">
          <SheetTitle>
            Edit Account
          </SheetTitle>
          <SheetDescription>
            Edit your account details
          </SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <AccountForm 
            id={id}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            disabled={isPending}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}