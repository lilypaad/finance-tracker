import z from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/node-postgres";
import { and, eq, lte, gte, sql, sum, desc } from "drizzle-orm";

import { accounts, categories, transactions } from "@/db/schema";
import { subDays, parse, differenceInDays } from "date-fns";
import { calculatePercentChange, fillMissingDays } from "@/lib/utils";

const db = drizzle({ connection: process.env.DRIZZLE_DATABASE_URL!, casing: "snake_case" });

const app = new Hono()
  .get("/",
    zValidator("query", z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })),
    async (c) => {
      const auth = c.get("jwtPayload");
      if(!auth?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { from, to, accountId } = c.req.valid("query");

      const defaultTo = new Date();
      const defaultFrom = subDays(defaultTo, 30);

      const startDate = from ? parse(from, "yyyy-MM-dd", new Date()) : defaultFrom;
      const endDate = to ? parse(to, "yyyy-MM-dd", new Date()) : defaultTo;

      const periodLength = differenceInDays(endDate, startDate) + 1;

      const lastPeriodStart = subDays(startDate, periodLength);
      const lastPeriodEnd = subDays(endDate, periodLength);

      async function fetchFinancialData(userId: number, start: Date, end: Date) {
        return await db.select({
          income: sql<number>`sum(case when ${transactions.amount} >= 0 then ${transactions.amount} else 0 end)`,
          expenses: sql<number>`sum(case when ${transactions.amount} < 0 then ${transactions.amount} else 0 end)`,
          remaining: sum(transactions.amount).mapWith(Number),
        })
        .from(transactions)
        .where(and(
          eq(transactions.userId, userId),
          gte(transactions.date, start),
          lte(transactions.date, end),
        ))
      }

      const [currentPeriod] = await fetchFinancialData(auth.user.id, startDate, endDate);
      const [lastPeriod] = await fetchFinancialData(auth.user.id, lastPeriodStart, lastPeriodEnd);

      const incomeChange = calculatePercentChange(currentPeriod.income, lastPeriod.income);
      const expensesChange = calculatePercentChange(currentPeriod.expenses, lastPeriod.expenses);
      const remainingChange = calculatePercentChange(currentPeriod.remaining, lastPeriod.remaining);

      const categoryData = await db.select({
        name: categories.name,
        value: sql<number>`sum(${transactions.amount})`,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .innerJoin(categories, eq(transactions.categoryId, categories.id))
      .where(and(
        eq(transactions.userId, auth.user.id),
        gte(transactions.date, startDate),
        lte(transactions.date, endDate),
      ))
      .groupBy(categories.name)
      .orderBy(desc(sql`sum(abs(${transactions.amount}))`));

      const activeDays = await db.select({
        date: transactions.date,
        income: sql<number>`sum(case when ${transactions.amount} >= 0 then ${transactions.amount} else 0 end)`,
        expenses: sql<number>`sum(case when ${transactions.amount} < 0 then ${transactions.amount} else 0 end)`,
      })
      .from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(and(
        eq(transactions.userId, auth.user.id),
        gte(transactions.date, startDate),
        lte(transactions.date, endDate),
      ))
      .groupBy(transactions.date)
      .orderBy(transactions.date);

      const days = fillMissingDays(activeDays, startDate, endDate);

      return c.json({
        data: {
          remaining: {
            amount: currentPeriod.remaining,
            change: remainingChange,
          },
          income: {
            amount: currentPeriod.income,
            change: incomeChange,
          },
          expenses: {
            amount: currentPeriod.expenses,
            change: expensesChange,
          },
          categories: categoryData,
          days,
        }
      });
    }
  );

export default app;