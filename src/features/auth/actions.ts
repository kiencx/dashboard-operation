"use server";

import { cookies } from "next/headers";
import { redirect, RedirectType } from "next/navigation";
import { API_BASE_URL } from "@/config/api";
import type { ApiResponse } from "@/config/api";
import { getSafeRedirect, LOGIN_PATH, SESSION_COOKIE, USER_COOKIE } from "./session";
import type { SessionUser } from "./session";

type LoginInput = {
  identifier: string;
  password: string;
  remember: boolean;
  redirectTo?: string;
};

type LoginOut = {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
  user: SessionUser;
};

export type LoginResult = { error: string };

function loginErrorMessage(status: number) {
  if (status === 401) return "Tài khoản hoặc mật khẩu không đúng.";
  if (status === 403) return "Tài khoản đã bị khoá. Vui lòng liên hệ quản trị viên.";
  if (status === 400 || status === 422) return "Thông tin đăng nhập không hợp lệ.";
  return "Đăng nhập không thành công. Vui lòng thử lại sau.";
}

export async function login({ identifier, password, remember, redirectTo }: LoginInput): Promise<LoginResult> {
  let session: LoginOut;
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ identifier: identifier.trim(), password }),
      cache: "no-store",
    });
    const body = (await response.json().catch(() => null)) as ApiResponse<LoginOut | null> | null;
    if (!response.ok || !body?.data) return { error: loginErrorMessage(response.status) };
    session = body.data;
  } catch {
    return { error: "Không kết nối được máy chủ. Vui lòng thử lại." };
  }

  // Backend chưa có API làm mới token, nên cookie sống đúng bằng access token khi "ghi nhớ đăng nhập".
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    ...(remember && { maxAge: session.expiresIn }),
  } as const;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.accessToken, cookieOptions);
  cookieStore.set(USER_COOKIE, encodeURIComponent(JSON.stringify({ fullName: session.user.fullName, role: session.user.role })), cookieOptions);
  redirect(getSafeRedirect(redirectTo), RedirectType.replace);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(USER_COOKIE);
  redirect(LOGIN_PATH, RedirectType.replace);
}
