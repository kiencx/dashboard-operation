import { cookies } from "next/headers";
import { USER_COOKIE } from "./session";
import type { SessionUser } from "./session";

/** Đọc thông tin user đã lưu lúc đăng nhập; chỉ gọi được phía server. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const value = (await cookies()).get(USER_COOKIE)?.value;
  if (!value) return null;
  try {
    const user = JSON.parse(decodeURIComponent(value)) as Partial<SessionUser>;
    return typeof user.role === "string" ? { fullName: user.fullName ?? null, role: user.role } : null;
  } catch {
    return null;
  }
}
