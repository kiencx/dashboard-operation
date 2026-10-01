import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSafeRedirect, HOME_PATH, LOGIN_PATH, REDIRECT_PARAM, SESSION_COOKIE } from "@/features/auth/session";

export function proxy(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;
  const isLoggedIn = Boolean(request.cookies.get(SESSION_COOKIE)?.value);
  const isLoginPage = pathname === LOGIN_PATH;

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL(getSafeRedirect(searchParams.get(REDIRECT_PARAM)), request.url));
  }

  if (!isLoginPage && !isLoggedIn) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    if (pathname !== HOME_PATH) loginUrl.searchParams.set(REDIRECT_PARAM, `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|__nextjs|favicon.ico|.*\\.[^/]+$).*)"],
};
