import z from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/node-postgres";
import { and, eq, gt, gte, inArray, lt, lte, sql } from "drizzle-orm";
import { subDays, parse } from "date-fns";

import * as schema from "@/db/schema";
import { transactions, insertTransactionSchema, categories, accounts } from "@/db/schema";

const db = drizzle({ schema, connection: process.env.DRIZZLE_DATABASE_URL!, casing: "snake_case" });

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

      const data = await db.query.transactions.findMany({
        columns: {
          id: true,
          date: true,
          payee: true,
          amount: true,
          notes: true,
          categoryId: true,
          accountId: true,
        },
        with: {
          category: true,
          account: true,
        },
        where: and(
          eq(transactions.userId, auth.user.id),
          accountId ? eq(transactions.accountId, parseInt(accountId)) : undefined,
          gte(transactions.date, startDate),
          lte(transactions.date, endDate),
        ),
        orderBy: (transactions, { desc }) => [desc(transactions.date)],
      });

      return c.json({ data });
    }
  )
  .get("/:id",
    zValidator("param", z.object({
      id: z.string(),
    })),
    async (c) => {
      const auth = c.get("jwtPayload");
      if(!auth?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");

      const data = await db.query.transactions.findFirst({
        columns: {
          id: true,
          date: true,
          payee: true,
          amount: true,
          notes: true,
          categoryId: true,
          accountId: true,
        },
        with: {
          category: true,
          account: true,
        },
        where: and(
          eq(transactions.userId, auth.user.id),
          eq(transactions.id, parseInt(id)),
        ),
        orderBy: (transactions, { desc }) => [desc(transactions.date)],
      });

      if(!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post("/",
    zValidator("json", insertTransactionSchema.omit({
      userId: true,
    })),
    async (c) => {
      const auth = c.get("jwtPayload");
      if(!auth?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const values = c.req.valid("json");

      const [data] = await db.insert(transactions).values({
        userId: auth.user.id,
        ...values
      }).returning();

      if(!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post("/bulk-create",
    zValidator("json", z.array(insertTransactionSchema)),
    async (c) => {
      const auth = c.get("jwtPayload");
      if(!auth?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const values = c.req.valid("json");

      const data = await db.insert(transactions).values(
        values.map((val) => ({ ...val }))
      ).returning();

      return c.json({ data });
    }
  )
  .post("/bulk-delete",
    zValidator("json", z.object({ ids: z.array(z.int()) })),
    async (c) => {
      const auth = c.get("jwtPayload");
      if(!auth?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const values = c.req.valid("json");

      // const transactionsToDelete = db.$with("transactions_to_delete").as(
      //   db.select({ id: transactions.id }).from(transactions)
      //     .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      //     .where(and(
      //       eq(transactions.userId, auth.user.id),
      //       inArray(transactions.id, values.ids)
      //     ))
      // );

      // const data = await db.with(transactionsToDelete)
      //   .delete(transactions)
      //   .where(inArray(transactions.id, sql`(select id from ${transactionsToDelete})`))
      //   .returning({ id: transactions.id });

      const data = await db.delete(transactions)
        .where(and(
          eq(transactions.userId, auth.user.id),
          inArray(transactions.id, values.ids)
        ))
        .returning({ id: transactions.id });

      return c.json({ data });
    }
  )
  .patch("/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    zValidator("json", insertTransactionSchema),
    async (c) => {
      const auth = c.get("jwtPayload");
      if(!auth?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");
      if(!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const values = c.req.valid("json");
      const [data] = await db.update(transactions)
        .set(values)
        .where(and(
            eq(transactions.userId, auth.user.id),
            eq(transactions.id, parseInt(id)),
        ))
        .returning();

      if(!data) {
        return c.json({ error: "Account not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .delete("/:id",
    zValidator("param", z.object({ id: z.string().optional() })),
    async (c) => {
      const auth = c.get("jwtPayload");
      if(!auth?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");
      if(!id) {
        return c.json({ error: "Missing id" }, 400);
      }

      const [data] = await db.delete(transactions)
        .where(and(
          eq(transactions.userId, auth.user.id),
          eq(transactions.id, parseInt(id)),
        ))
        .returning({ id: transactions.id });

      if(!data) {
        return c.json({ error: "Account not found" }, 404);
      }

      return c.json({ data });
    }
  );

export default app;