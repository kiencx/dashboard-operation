"use client";

import { useEffect, useState } from "react";
import type { ApiResponse } from "@/config/api";
import { LOGIN_PATH, REDIRECT_PARAM } from "@/features/auth/session";

type QueryValue = string | number | null | undefined;
export type QueryParams = Record<string, QueryValue>;

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function buildUrl(path: string, params?: QueryParams) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== null && value !== "") query.set(key, String(value));
  }
  const search = query.toString();
  return `/api/v1/${path}${search ? `?${search}` : ""}`;
}

async function request<T>(url: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal, cache: "no-store" });
  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (response.status === 401) {
    const loginUrl = new URL(LOGIN_PATH, window.location.origin);
    loginUrl.searchParams.set(REDIRECT_PARAM, `${window.location.pathname}${window.location.search}`);
    window.location.assign(loginUrl);
    throw new ApiError("Phiên đăng nhập đã hết hạn.", 401);
  }
  if (!response.ok || !body) {
    throw new ApiError(response.status >= 500 ? "Máy chủ dữ liệu đang gặp sự cố, vui lòng thử lại sau." : body?.message || "Không tải được dữ liệu.", response.status);
  }
  return body.data;
}

/** Backend chỉ nhận `page` từ 1 đến 500. */
const MAX_PAGE = 500;

/** Cấu hình phân trang antd cho một trang offset; chặn số trang vượt giới hạn backend nhưng vẫn hiện tổng thật. */
export function getPagination(total: number | undefined, page: number, pageSize: number, onChange: (page: number) => void) {
  return {
    current: page,
    pageSize,
    total: Math.min(total ?? 0, MAX_PAGE * pageSize),
    showSizeChanger: false,
    showTotal: () => `${new Intl.NumberFormat("vi-VN").format(total ?? 0)} dòng`,
    onChange,
  };
}

type ApiState<T> = { url: string | null; data?: T; error?: Error };

/**
 * Gọi một endpoint GET của backend qua route `/api/v1/*`. Truyền `path = null` để tạm không gọi.
 * Giữ lại dữ liệu lần trước trong lúc tải lại để bảng/biểu đồ không bị nháy; lỗi thì bỏ dữ liệu cũ.
 */
export function useApi<T>(path: string | null, params?: QueryParams) {
  const url = path ? buildUrl(path, params) : null;
  const [state, setState] = useState<ApiState<T>>({ url: null });

  useEffect(() => {
    if (!url) return;
    const controller = new AbortController();
    request<T>(url, controller.signal).then(
      (data) => setState({ url, data }),
      (error: Error) => {
        if (!controller.signal.aborted) setState({ url, error });
      },
    );
    return () => controller.abort();
  }, [url]);

  const settled = state.url === url;
  return { data: state.data, error: settled ? state.error : undefined, loading: url !== null && !settled };
}
