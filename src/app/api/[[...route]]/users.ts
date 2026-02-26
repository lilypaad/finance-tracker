import { Hono } from "hono";

import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "@/db/schema";

const db = drizzle({ connection: process.env.DRIZZLE_DATABASE_URL!, casing: "snake_case" });

const app = new Hono()
  .get("/", async (c) => {
    const data = await db
      .select({
        id: users.id, 
        email: users.email, 
        firstName: users.firstName, 
        lastName: users.lastName, 
      })
      .from(users);
      
    return c.json({ data });
  })

export default app;