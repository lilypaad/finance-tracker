import { cn } from "@/lib/utils";

type Props = {
  id: string,
  categoryName: string | undefined | null;
  categoryId: string | undefined | null;
};

export function CategoryColumn({ categoryName, categoryId }: Props) {
  return (
    <div
      className={cn(
        "flex items-center cursor-pointer hover:underline",
        !categoryName && "text-rose-700"
      )}
    >
      {categoryName || "Uncategorised"}
    </div>
  );
}