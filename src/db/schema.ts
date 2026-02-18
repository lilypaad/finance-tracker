import { 
  pgTable, 
  pgEnum,
  integer, 
  timestamp,
  varchar,
  uniqueIndex, 
} from "drizzle-orm/pg-core";

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
