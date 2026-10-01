export const SESSION_COOKIE = "nova_session";
export const LOGIN_PATH = "/login";
export const HOME_PATH = "/";
export const REDIRECT_PARAM = "redirect";

export function getSafeRedirect(value: unknown) {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") && !value.startsWith(LOGIN_PATH) ? value : HOME_PATH;
}
