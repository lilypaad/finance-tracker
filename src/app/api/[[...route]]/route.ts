import { Hono } from "hono";
import { handle } from "hono/vercel";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";

import users from "./users";
import accounts from "./accounts";
import categories from "./categories";
import transactions from "./transactions";

const app = new Hono<{ Variables: JwtVariables }>().basePath("/api");

app.use("/*", (c, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.AUTH_SECRET_KEY!,
    alg: "HS256",
    cookie: "session",
  });
  return jwtMiddleware(c, next);
});

const routes = app
  .route("/users", users)
  .route("/accounts", accounts)
  .route("/categories", categories)
  .route("/transactions", transactions);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;