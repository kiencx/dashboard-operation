"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { getSafeRedirect, LOGIN_PATH, SESSION_COOKIE } from "./session";

const REMEMBER_MAX_AGE = 60 * 60 * 24 * 7;

type LoginInput = {
  username: string;
  remember: boolean;
  redirectTo?: string;
};

export async function login({ username, remember, redirectTo }: LoginInput) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, encodeURIComponent(username.trim()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(remember && { maxAge: REMEMBER_MAX_AGE }),
  });
  redirect(getSafeRedirect(redirectTo), RedirectType.replace);
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect(LOGIN_PATH, RedirectType.replace);
}
