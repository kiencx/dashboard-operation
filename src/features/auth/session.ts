/** Cookie chứa access token backend; proxy chỉ cần biết có hay không. */
export const SESSION_COOKIE = "nova_session";
/** Cookie chứa họ tên và vai trò để hiển thị ở header. */
export const USER_COOKIE = "nova_user";
export const LOGIN_PATH = "/login";
export const HOME_PATH = "/";
export const REDIRECT_PARAM = "redirect";

export type SessionUser = {
  fullName: string | null;
  role: string;
};

/** Các nhánh route của dashboard (khớp menu); trang chủ `/` luôn hợp lệ. */
const APP_ROUTES = ["/operations", "/reconciliation", "/customer-care", "/document-forum"];

/**
 * Chỉ cho quay lại route có thật của dashboard. URL lạ (vd `/vi?rf=...` còn trong lịch sử trình duyệt
 * từ app khác chạy cùng localhost:3000) sẽ về trang chủ thay vì rơi vào 404 sau khi đăng nhập.
 */
export function getSafeRedirect(value: unknown) {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) return HOME_PATH;
  const pathname = value.split(/[?#]/)[0];
  const isAppRoute = pathname === HOME_PATH || APP_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  return isAppRoute ? value : HOME_PATH;
}
