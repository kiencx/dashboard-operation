export type MetricTone = "blue" | "violet" | "cyan" | "orange" | "green" | "red";
export type MetricIcon = "orders" | "audit" | "service" | "sla" | "stock" | "time" | "difference" | "chat" | "renewal" | "sim" | "topup" | "outbound" | "inbound" | "kit" | "api" | "phone" | "queue" | "answered" | "missed" | "speed";

export type DashboardMetric = {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: MetricIcon;
  tone: MetricTone;
  helper?: string;
};

export type DetailTone = "positive" | "negative" | "warning";

export type OverviewMetricDetail = {
  label: string;
  change?: string;
  trend?: "up" | "down";
  /** Màu của giá trị khi không có trend; bỏ trống là màu trung tính. */
  tone?: DetailTone;
  dot?: DetailTone;
};

export type OverviewMetric = {
  title: string;
  value: string;
  unit?: string;
  icon: MetricIcon;
  tone: MetricTone;
  details: OverviewMetricDetail[];
};

export type BarSeries = {
  key: string;
  label: string;
  color: string;
};

export type BarDatum = {
  label: string;
  values: Record<string, number>;
};

export type CareChannel = "Call" | "Chat";

export type ContactRate = {
  channel: string;
  rate: number;
  missedCount: number;
  missedUnit: string;
  tone: "positive" | "warning";
};

export type AlertSeverity = "Nghiêm trọng" | "Cảnh báo" | "Theo dõi";
export type WorkStatus = "Hoàn thành" | "Đang xử lý" | "Trễ hạn";

export type DonutSegment = {
  key: string;
  label: string;
  value: number;
  color: string;
};

export type Warehouse = {
  code: string;
  name: string;
  productCode: string;
  productName: string;
  stock: number;
  used: number;
};

export type AgencyOrderCount = {
  agency: string;
  orders: number;
};

export type InternalOrder = {
  key: string;
  code: string;
  orderType: "Cấp SIM mới" | "Gia hạn gói" | "Topup";
  partner: string;
  status: WorkStatus;
  createdAt: string;
};
