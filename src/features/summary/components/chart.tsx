import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { AreaChart, BarChart3, FileSearch, LineChart, Loader2 } from "lucide-react";

import { AreaVariant } from "@/features/summary/components/area-variant";
import { BarVariant } from "@/features/summary/components/bar-variant";
import { LineVariant } from "@/features/summary/components/line-variant";
import { Skeleton } from "../../../components/ui/skeleton";

type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
  loading: boolean;
};

export function Chart({ data = [], loading }: Props) {
  const [chartType, setChartType] = useState("area");

  const onTypeChange = (type: string) => {
    setChartType(type);
  }

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">
          Transactions
        </CardTitle>
        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Chart type" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="area">
              <div className="flex items-center">
                <AreaChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Area chart</p>
              </div>
            </SelectItem>
            <SelectItem value="line">
              <div className="flex items-center">
                <LineChart className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Line chart</p>
              </div>
            </SelectItem>
            <SelectItem value="bar">
              <div className="flex items-center">
                <BarChart3 className="size-4 mr-2 shrink-0" />
                <p className="line-clamp-1">Bar chart</p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex flex-col gap-y-4 items-center justify-center h-87.5 w-full">
            <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
          </div>
        )}
        {!loading && (
          <>
            {data.length === 0 ? (
              <div className="flex flex-col gap-y-4 items-center justify-center h-87.5 w-full">
                <FileSearch className="size-6 text-muted-foreground" />
                <p className="text-muted-foreground text-sm">No data for this period</p>
              </div>
            ) : (
              <>
                {chartType === "area" && <AreaVariant data={data} />}
                {chartType === "bar" && <BarVariant data={data} />}
                {chartType === "line" && <LineVariant data={data} />}
              </>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}