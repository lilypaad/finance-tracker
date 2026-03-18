import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";

import { cn } from "@/lib/utils";

type Props = {
  accountName: string;
  accountId: string;
};

export function AccountColumn({ accountName, accountId }: Props) {
  const { onOpen: onOpenAccount } = useOpenAccount();

  const onClick = () => {
    onOpenAccount(accountId);
  }

  return (
    <div onClick={onClick} className="flex items-center cursor-pointer hover:underline">
      {accountName}
    </div>
  );
}