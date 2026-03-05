import * as z from "zod";

import { 
  pgTable, 
  pgEnum,
  integer, 
  timestamp,
  varchar,
  uniqueIndex, 
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";

const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
}

export const rolesEnum = pgEnum("roles", ["user", "admin"]);

export const users = pgTable(
  "users", 
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    email: varchar({ length: 255 }).notNull().unique(),
    firstName: varchar("first_name", { length: 255 }),
    lastName: varchar("last_name", { length: 255 }),
    role: rolesEnum().default("user"),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    passwordSalt: varchar("password_salt", { length: 255 }).notNull(),
  },
  (table) => [ uniqueIndex("email_idx").on(table.email) ]
);

export const usersRelations = relations(users, ({ many }) => ({
  transactions: many(transactions),
}));

export const accounts = pgTable(
  "accounts", 
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name").notNull(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  },
);

export const accountsRelations = relations(accounts, ({ many }) => ({
  transactions: many(transactions),
}));

export const categories = pgTable(
  "categories",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name").notNull(),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }),
  }
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactions = pgTable(
  "transactions",
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    amount: integer("amount").notNull(),
    payee: varchar("payee"),
    notes: varchar("notes"),
    date: timestamp("date", { mode: "date" }).notNull(),
    accountId: integer("account_id").references(() => accounts.id, { onDelete: "cascade" }).notNull(),
    categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
    userId: integer("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  }
);

export const transactionsRelations = relations(transactions, ({ one }) => ({
  account: one(accounts, {
    fields: [transactions.accountId],
    references: [accounts.id],
  }),
  category: one(categories, {
    fields: [transactions.categoryId],
    references: [categories.id],
  }),
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id],
  }),
}));

export const insertAccountSchema = createInsertSchema(accounts);
export const insertCategorySchema = createInsertSchema(categories);
export const insertTransactionSchema = createInsertSchema(transactions, {
  date: z.coerce.date(),
});
