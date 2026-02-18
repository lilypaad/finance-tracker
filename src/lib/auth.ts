"use server";

import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import * as z from "zod";

import { LoginFormSchema, } from "@/schemas/login-form";
import { SignupFormSchema, SignupFormState } from "@/schemas/signup-form";
import { Algorithm, hash, verify } from "@node-rs/argon2";
import { generateRandomString } from "@oslojs/crypto/random";
import type { RandomReader } from "@oslojs/crypto/random";
import { drizzle } from "drizzle-orm/node-postgres";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const secretKey = process.env.AUTH_SECRET_KEY;
const key = new TextEncoder().encode(secretKey);
const SESSION_EXPIRY = 24 * 60 * 60 * 1000;

/*
    Authentication server actions
*/

export async function signup(formData: z.infer<typeof SignupFormSchema>) {
    const email = formData.email;
    const password = formData.password;
    const firstName = formData.firstName;
    const lastName = formData.lastName;
    
    // generate salt & hash password 
    const random: RandomReader = {
        read(bytes) {
            crypto.getRandomValues(bytes);
        }
    };
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    const passwordSalt = generateRandomString(random, alphabet, 16);
    const passwordHash = await hashPassword(password + passwordSalt);
    
    // insert user into db
    const db = drizzle({ connection: process.env.DRIZZLE_DATABASE_URL!, casing: "snake_case" });
    const user: typeof users.$inferInsert = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        passwordHash: passwordHash,
        passwordSalt: passwordSalt,
    };
    const [data] = await db.insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning({ insertedId: users.id });
    if(!data) {
        return { errors: { root: "An error occurred creating your account" } };
    }
}

export async function login(formData: z.infer<typeof LoginFormSchema>) {
    const email = formData.email;
    const password = formData.password;

    // grab user id from db
    const db = drizzle({ connection: process.env.DRIZZLE_DATABASE_URL!, casing: "snake_case"});
    const [user]: typeof users.$inferSelect = await db.select().from(users).where(eq(users.email, email));
    if(!user) {
        return { errors: "Invalid email/password combination" }
    }

    // password check
    if(!(await verifyPasswordHash(user.passwordHash, user.passwordSalt, password))) {
        return { errors: "Invalid email/password combination" }
    }

    await createSession(user);
}

export async function logout() {
    await deleteSession();
    redirect("/");
}

/*
    Session management functions
*/

export async function createSession(user: typeof users.$inferSelect) {
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY);
    const session = await sign({ user: user });
    const cookieStore = await cookies();
    cookieStore.set("session", session, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt, 
        sameSite: "lax",
        path: "/",
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if(!session) return null;

    return await decrypt(session);
}

export async function updateSession(req: NextRequest) {
    const session = req.cookies.get("session")?.value;
    if(!session)
        return;

    const payload = await decrypt(session);
    if(!session || !payload)
        return;

    const expiresAt = new Date(Date.now() + SESSION_EXPIRY);
    const cookieStore = await cookies();
    cookieStore.delete("session");
    cookieStore.set("session", payload, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        expires: expiresAt,
        sameSite: "lax",
        path: "/",
    });
}

export async function deleteSession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}
 
export async function hashPassword(password: string): Promise<string> {
    return await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
    });
}

export async function verifyPasswordHash(hash: string, salt: string, password: string): Promise<boolean> {
    return await verify(hash, password + salt);
}

/*
    Helper functions
*/

export async function sign(payload: any) {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime('2d')
      .sign(key);
}

export async function decrypt(input: string | undefined = ""): Promise<any> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ["HS256"],
        });

        return payload;
    }
    catch(error) {
        console.log("Failed to verify session token " + input);
    }
}