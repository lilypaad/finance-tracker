import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { eachDayOfInterval, subDays } from "date-fns";
import dotenv from "dotenv";

import { accounts, categories, transactions } from "@/db/schema";
import { convertAmountToMiliunits } from "@/lib/utils";

dotenv.config({ path: "./.env" });

const SEED_USER_ID = 1;

const SEED_CATEGORIES = [
  { name: "Food", userId: SEED_USER_ID },
  { name: "Rent", userId: SEED_USER_ID },
  { name: "Utilities", userId: SEED_USER_ID },
  { name: "Clothing", userId: SEED_USER_ID },
];

const SEED_ACCOUNTS = [
  { name: "Checking", userId: SEED_USER_ID },
  { name: "Savings", userId: SEED_USER_ID },
];

const SEED_TRANSACTIONS: typeof transactions.$inferInsert[] = [];

const defaultTo = new Date();
const defaultFrom = subDays(defaultTo, 90);

function rand(min: number = 0, max: number = 1) {
  return Math.floor(Math.random() * max) + min;
}

function generateRandomAmount(category: typeof categories.$inferInsert) {
  switch(category.name) {
    case "Rent":
      return rand(90, 400);
    case "Utilities":
      return rand(50, 200);
    case "Food":
      return rand(10, 30);
    case "Transportation":
    case "Health":
      return rand(15, 50);
    case "Entertainment":
    case "Clothing":
    case "Miscellaneous":
      return rand(20, 100);
    default:
      return rand(10, 50);
  }
}

function generateTransactionsForDay(day: Date, accountId: number, categoryList: (typeof categories.$inferSelect)[]) {
  const numTransactions = rand(1, 4);

  for(let i = 0; i < numTransactions; i++) {
    const category = categoryList[rand(0, SEED_CATEGORIES.length - 1)];
    const isExpense = Math.random() > 0.6;
    const amount = generateRandomAmount(category);
    const formattedAmount = convertAmountToMiliunits(isExpense ? -amount : amount);

    SEED_TRANSACTIONS.push({
      accountId: accountId,
      categoryId: category.id,
      userId: SEED_USER_ID,
      date: day,
      amount: formattedAmount,
      payee: "Merchant",
      notes: "Random transaction",
    });
  }
}

function generateTransactions(accountId: number, categoryList: (typeof categories.$inferSelect)[]) {
  const days = eachDayOfInterval({ start: defaultFrom, end: defaultTo });
  days.forEach(day => generateTransactionsForDay(day, accountId, categoryList));
}

async function main() {
  const db = drizzle({ connection: process.env.DRIZZLE_DATABASE_URL!, casing: "snake_case" });

  try {
    // Clear db
    console.log("Clearing database...");
    await db.delete(transactions);
    await db.delete(accounts);
    await db.delete(categories);

    // Create dummy categories and accounts
    console.log("Creating dummy accounts and categories...");
    await db.insert(categories).values(SEED_CATEGORIES).execute();
    await db.insert(accounts).values(SEED_ACCOUNTS).execute();

    // Grab ids from db after insertion
    const [checking] = await db.select().from(accounts).where(eq(accounts.name, "Checking"));
    const categoryList = await db.select().from(categories);

    // Generate and insert dummy transactions
    console.log("Generating transactions...");
    generateTransactions(checking.id, categoryList);
    await db.insert(transactions).values(SEED_TRANSACTIONS).execute();
  }
  catch (error) {
    console.error("Error during seed:", error);
    process.exit(1);
  }
}

main();