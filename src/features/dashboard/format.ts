const countFormat = new Intl.NumberFormat("vi-VN");
const percentFormat = new Intl.NumberFormat("vi-VN", { style: "percent", maximumFractionDigits: 1 });

/** Ký hiệu hiển thị khi chưa có số liệu. */
export const EMPTY_VALUE = "–";

export const formatCount = (value: number | null | undefined) => (value == null ? EMPTY_VALUE : countFormat.format(value));

export const formatCurrency = (value: number | null | undefined) => (value == null ? EMPTY_VALUE : `${countFormat.format(value)} ₫`);

/** `ratio` trong khoảng 0–1. */
export const formatPercent = (ratio: number | null | undefined) => (ratio == null || !Number.isFinite(ratio) ? EMPTY_VALUE : percentFormat.format(ratio));

/** Giây → hh:mm:ss. */
export const formatDuration = (seconds: number | null | undefined) => {
  if (seconds == null) return EMPTY_VALUE;
  const total = Math.round(seconds);
  return [Math.floor(total / 3600), Math.floor((total % 3600) / 60), total % 60].map((part) => String(part).padStart(2, "0")).join(":");
};
