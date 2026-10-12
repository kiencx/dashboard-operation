/** 1 = hôm nay, 2 = tuần này (T2–CN), 3 = tháng này, 4 = năm nay, 5 = tuỳ chọn. */
export type Period = 1 | 2 | 3 | 4 | 5;

export type PeriodFilter = {
  period: Period;
  /** YYYY-MM-DD, chỉ có khi period = 5. */
  fromDate?: string;
  toDate?: string;
};

export type OffsetPage<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PackageCount = { package: string; total: number };

export type InternalOrderMetrics = {
  totalOrders: number;
  packageRenewals: { total: number; items: PackageCount[] };
  newSims: { total: number; items: PackageCount[] };
  topup: { totalOrder: number; totalRevenue: number };
};

export type BusinessCount = { businessName: string | null; total: number };

export type InternalOrderDetailType = "package_on_demand" | "sim_registered" | "topup";

export type InternalOrderDetail = {
  date: string;
  isdn: string | null;
  customerBusinessName: string | null;
  item: string | null;
  actionType: string | null;
  type: InternalOrderDetailType;
};

export type OnlineOrderMetrics = {
  simOrders: number;
  packageOrders: number;
  topupOrders: number;
  outboundOrders: number;
  inboundOrders: number;
};

export type OnlineOrderSource = "HDSAISON" | "VIKKI" | "SKYFI_APP" | "SKYFI_WEB";

export type SourceRevenue = { source: OnlineOrderSource; revenue: number };

export type EsimSourceRevenue = { source: string | null; revenue: number };

export type AgencyOrderMetrics = {
  totalOrders: number;
  batchKitOrders: number;
  apiOrders: number;
};

export type CompanyOrderCount = { companyName: string | null; orderCount: number };

export type StockMetrics = {
  simInventory: { total: number; sim: number; esim: number };
  numberInventory: { total: number; m2m: number; h2h: number };
  simUsage: { totalInStock: number; simOutStock: number; esimOutStock: number };
  numberUsage: { totalInStock: number; m2mOutStock: number; h2hOutStock: number };
};

export type WarehouseProductStock = {
  warehouseName: string | null;
  productCode: string | null;
  productTypeName: string | null;
  availableQuantity: number | null;
  reservedQuantity: number | null;
  quantity: number | null;
};

export type CallStatistics = {
  totalCallIn: number;
  totalQueueCall: number;
  totalAnswerCallin: number;
  /** Phần trăm, 0–100. */
  missedPercent: number;
  /** Giây. */
  averageSpeedAnswer: number;
  /** Giây. */
  aht: number;
};

export type CallChartPoint = {
  time: string;
  totalAnswerCallin: number;
  totalMissCall: number;
  totalCall: number;
};

export type ChatStatistics = {
  totalChat: number;
  totalChatSuccess: number;
  missedChat: number;
  /** Dạng "10%". */
  abandonChatRate: string;
  avgAnswerSpeed: number;
  avgAnswerDuration: number;
};

export type ChatChartPoint = { time: string; totalConversation: number };
