"use server";

import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";
import * as z from "zod";

import { LoginFormSchema, } from "@/schemas/login-form";

const secretKey = process.env.AUTH_SECRET_KEY;
const key = new TextEncoder().encode(secretKey);
const SESSION_EXPIRY = 24 * 60 * 60 * 1000;

interface UserInfo {
    userId: string,
    role: string,
    email?: string,
}

/*
    Authentication server actions
*/

export async function signup() {
    //stub
}

export async function login(formData: z.infer<typeof LoginFormSchema>) {
    const email = formData.email;
    const password = formData.password;

    // FIXME: grab user id from db
    const user = { 
        userId: "100",
        role: "user",
        email: email,
    } as UserInfo;

    await createSession(user);
    redirect("/");
}

export async function logout() {
    await deleteSession();
    redirect("/");
}

/*
    Session management functions
*/

export async function createSession(data: UserInfo) {
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY);
    const session = await sign({ user: data });
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