import * as z from "zod";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import { jwt } from "hono/jwt";
import type { JwtVariables } from "hono/jwt";
import { zValidator } from "@hono/zod-validator";

import users from "./users";
import accounts from "./accounts";

const app = new Hono<{ Variables: JwtVariables }>().basePath("/api");

app.use("/*", (c, next) => {
  const jwtMiddleware = jwt({
    secret: process.env.AUTH_SECRET_KEY as string,
    alg: "HS256",
    cookie: "session",
  });
  return jwtMiddleware(c, next);
});

const routes = app
  .route("/users", users)
  .route("/accounts", accounts);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;