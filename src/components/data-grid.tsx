"use client";

import { useSearchParams } from "next/navigation";
import { FaPiggyBank } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { DataCard } from "@/components/data-card";
import { formatDateRange } from "@/lib/utils";

export function DataGrid() {
  const params = useSearchParams();
  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;

  const { data, isLoading } = useGetSummary();

  const dateRangeLabel = formatDateRange({ from, to });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
      <DataCard
        title="Remaining"
        value={data?.remaining.amount}
        percentChange={data?.remaining.change}
        icon={FaPiggyBank}
        variant="default"
        dateRange={dateRangeLabel}
        loading={isLoading}
      />

      <DataCard
        title="Income"
        value={data?.income.amount}
        percentChange={data?.income.change}
        icon={FaArrowTrendUp}
        variant="default"
        dateRange={dateRangeLabel}
        loading={isLoading}
      />

      <DataCard
        title="Expenses"
        value={data?.expenses.amount}
        percentChange={data?.expenses.change}
        icon={FaArrowTrendDown}
        variant="default"
        dateRange={dateRangeLabel}
        loading={isLoading}
      />
    </div>
  );
}