import { Hono } from "hono";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";

import { accounts, users } from "@/db/schema";

const db = drizzle({ connection: process.env.DRIZZLE_DATABASE_URL!, casing: "snake_case" });

const app = new Hono()
  .get("/", async (c) => {
    const auth = c.get("jwtPayload");
    
    if(!auth?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db.select({
      id: accounts.id,
      name: accounts.name,
      userId: accounts.userId,
    })
    .from(accounts)
    .where(eq(accounts.id, auth.user.id));

    return c.json({ data });
  });

export default app;