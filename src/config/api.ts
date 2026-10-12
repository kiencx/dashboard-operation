/** Địa chỉ backend Operations Dashboard; chỉ dùng phía server (server action, route handler). */
export const API_BASE_URL = process.env.API_BASE_URL ?? "https://opt.skyfi.com.vn";

/** Vỏ chung của mọi response backend. */
export type ApiResponse<T> = {
  code: number;
  data: T;
  message: string;
  errors: string | string[] | null;
};
