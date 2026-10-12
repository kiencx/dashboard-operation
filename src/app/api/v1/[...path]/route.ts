import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { API_BASE_URL } from "@/config/api";
import { SESSION_COOKIE, USER_COOKIE } from "@/features/auth/session";

const errorBody = (code: number, message: string) => ({ code, data: null, message, errors: null });

/**
 * Chuyển tiếp request GET của trình duyệt tới backend, gắn access token từ cookie httpOnly
 * để token không bao giờ lộ ra phía client.
 */
export async function GET(request: NextRequest, ctx: RouteContext<"/api/v1/[...path]">) {
  const { path } = await ctx.params;
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return NextResponse.json(errorBody(1003, "Phiên đăng nhập đã hết hạn."), { status: 401 });

  const url = new URL(`/api/v1/${path.map(encodeURIComponent).join("/")}`, API_BASE_URL);
  url.search = request.nextUrl.search;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
      signal: request.signal,
    });
  } catch {
    return NextResponse.json(errorBody(502, "Không kết nối được máy chủ dữ liệu."), { status: 502 });
  }

  // Token hết hạn hoặc bị thu hồi: xoá phiên để proxy đưa người dùng về trang đăng nhập.
  if (upstream.status === 401) {
    cookieStore.delete(SESSION_COOKIE);
    cookieStore.delete(USER_COOKIE);
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
  });
}
