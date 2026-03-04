import z from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { drizzle } from "drizzle-orm/node-postgres";
import { and, eq, inArray } from "drizzle-orm";

import { categories, insertCategorySchema } from "@/db/schema";

const db = drizzle({ connection: process.env.DRIZZLE_DATABASE_URL!, casing: "snake_case" });

const app = new Hono()
  .get("/", async (c) => {
    const auth = c.get("jwtPayload");
    if(!auth?.user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const data = await db.select({
      id: categories.id,
      name: categories.name,
      userId: categories.userId,
    })
    .from(categories)
    .where(eq(categories.userId, auth.user.id));

    return c.json({ data });
  })
  .get("/:id",
    zValidator("param", z.object({ 
      id: z.string().optional()
    })),
    async (c) => {
      const auth = c.get("jwtPayload");
      if(!auth?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      
      const { id } = c.req.valid("param");
      if(!id) {
        return c.json({ error: "Missing id" }, 400);
      }
      
      const [data] = await db.select({
        id: categories.id,
        name: categories.name
      })
      .from(categories)
      .where(and(
        eq(categories.userId, auth.user.id),
        eq(categories.id, parseInt(id))
      ));
      
      if(!data) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data });
    }
  )
  .post("/", 
    zValidator("json", insertCategorySchema.pick({
      name: true,
    })), 
    async (c) => {
      const auth = c.get("jwtPayload");
      if(!auth?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }
      
      const values = c.req.valid("json");
      const [data] = await db.insert(categories).values({
        userId: auth.user.id,
        ...values
      }).returning();
      
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
      
      const data = await db.delete(categories)
        .where(and(
          eq(categories.userId, auth.user.id),
          inArray(categories.id, values.ids)
        ))
        .returning({ id: categories.id })
      
      return c.json({ data });
    }
  )
  .patch("/:id",
    zValidator("param", z.object({ id: z.string().optional(), })),
    zValidator("json", insertCategorySchema.pick({ name: true })),
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
      const [data] = await db.update(categories)
        .set(values)
        .where(
          and(
            eq(categories.userId, auth.user.id),
            eq(categories.id, parseInt(id)),
          )
        )
        .returning();
        
      if(!data) {
        return c.json({ error: "Account not found" }, 404);
      }
      
      return c.json({ data });
    }
  )
  .delete("/:id",
    zValidator("param", z.object({ id: z.string().optional(), })),
    async (c) => {
      const auth = c.get("jwtPayload");
      if(!auth?.user?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { id } = c.req.valid("param");
      if(!id) {
        return c.json({ error: "Missing id" }, 400);
      }
      
      const [data] = await db.delete(categories)
        .where(and(
          eq(categories.userId, auth.user.id),
          eq(categories.id, parseInt(id)),
        ))
        .returning({ id: categories.id });
        
      if(!data) {
        return c.json({ error: "Account not found" }, 404);
      }
      
      return c.json({ data });
    }
  );

export default app;