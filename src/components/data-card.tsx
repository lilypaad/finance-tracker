import { cva, VariantProps } from "class-variance-authority";
import CountUp from "react-countup";
import { IconType } from "react-icons/lib";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn, formatCurrency, formatPercent } from "@/lib/utils";

const boxVariant = cva(
  "shrink-0 rounded-md p-3",
  {
    variants: {
      variant: {
        default: "bg-blue-500/20",
        success: "bg-emerald-500/20",
        danger: "bg-rose-500/20",
        warning: "bg-yellow-500/20",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const iconVariant = cva(
  "size-6",
  {
    variants: {
      variant: {
        default: "fill-blue-500",
        success: "fill-emerald-500",
        danger: "fill-rose-500",
        warning: "fill-yellow-500",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;

interface DataCardProps extends BoxVariants, IconVariants {
  icon: IconType;
  title: string;
  value?: number;
  dateRange: string;
  percentChange?: number;
  loading: boolean;
}

export function DataCard({icon: Icon, title, value=0, variant, dateRange, percentChange=0, loading}: DataCardProps) {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <CardTitle className="text-2xl line-clamp-1">
            {title}
          </CardTitle>
          <CardDescription className="line-clamp1">
            {dateRange}
          </CardDescription>
        </div>
        <div className={cn(boxVariant({ variant }))}>
          <Icon className={cn(iconVariant({ variant }))} />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-5 w-40" />
          </div>
        ) : (
          <>
            <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
              <CountUp
                preserveValue
                start={0}
                end={value}
                decimals={2}
                decimalPlaces={2}
                formattingFn={formatCurrency}
              />
            </h1>
            <p className={cn(
              "text-muted-foreground text-sm line-clamp-1",
              percentChange > 0 && "text-emerald-500",
              percentChange < 0 && "text-rose-500",
            )}>
              {formatPercent(percentChange, { addPrefix: true })} from last period
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}