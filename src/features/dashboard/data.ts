import type { AiReport, BarDatum, BarSeries, ContactRate, DashboardMetric, OverviewMetric, WorkStatus } from "./types";

export const packageSeries: BarSeries[] = [
  { key: "renewals", label: "Gói gia hạn", color: "#4f8ef7" },
  { key: "newSims", label: "SIM cấp mới", color: "#34d399" },
];

export const packageVolumes: BarDatum[] = [
  { label: "SF49", values: { renewals: 4200, newSims: 6100 } },
  { label: "SF69", values: { renewals: 6300, newSims: 4800 } },
  { label: "SF99", values: { renewals: 8500, newSims: 5700 } },
  { label: "SF129", values: { renewals: 7200, newSims: 6600 } },
  { label: "SF179", values: { renewals: 10400, newSims: 7900 } },
  { label: "SF229", values: { renewals: 5900, newSims: 3400 } },
  { label: "SF299", values: { renewals: 3800, newSims: 2900 } },
  { label: "SF399", values: { renewals: 8500, newSims: 9000 } },
];

export const contactRates: ContactRate[] = [
  { channel: "Call", rate: 90, missedCount: 3, missedUnit: "cuộc", tone: "positive" },
  { channel: "Chat", rate: 75, missedCount: 26, missedUnit: "tin nhắn", tone: "warning" },
];

export const overviewMetrics: OverviewMetric[] = [
  {
    title: "Tổng đơn hàng",
    value: "300",
    unit: "đơn",
    icon: "orders",
    tone: "blue",
    details: [
      { label: "Nội bộ", change: "5,6%", trend: "up" },
      { label: "Online", change: "5,6%", trend: "down" },
      { label: "Đại lý", change: "5,6%", trend: "up" },
    ],
  },
  {
    title: "Tổng Call/Chat",
    value: "200",
    unit: "lượt",
    icon: "service",
    tone: "violet",
    details: [
      { label: "Call", change: "100 lượt" },
      { label: "Chat", change: "100 lượt" },
    ],
  },
  {
    title: "Tồn kho SIM/số",
    value: "12.450",
    icon: "stock",
    tone: "orange",
    details: [
      { label: "Kho trên ngưỡng", change: "11", dot: "positive" },
      { label: "Kho dưới ngưỡng", change: "10", dot: "warning" },
    ],
  },
  {
    title: "Tỷ lệ đối soát",
    value: "200",
    unit: "lượt",
    icon: "audit",
    tone: "green",
    details: [{ label: "Tỷ lệ lệch", change: "2,3%", tone: "negative" }],
  },
];

export const operationsMetrics: DashboardMetric[] = [
  { title: "Đơn nội bộ", value: "4.280", change: "+6,8%", trend: "up", icon: "orders", tone: "blue" },
  { title: "Đơn Online", value: "5.940", change: "+12,4%", trend: "up", icon: "orders", tone: "violet" },
  { title: "Đơn Đại lý", value: "2.260", change: "+3,1%", trend: "up", icon: "orders", tone: "cyan" },
  { title: "Xử lý đúng SLA", value: "93,6%", change: "-0,7%", trend: "down", icon: "sla", tone: "orange" },
];

export const reconciliationMetrics: DashboardMetric[] = [
  { title: "Phiên đến hạn", value: "71", change: "+4", trend: "up", icon: "audit", tone: "blue" },
  { title: "Hoàn thành đúng hạn", value: "94,2%", change: "+2,1%", trend: "up", icon: "sla", tone: "green" },
  { title: "Chênh lệch phát hiện", value: "186", change: "-9,3%", trend: "down", icon: "difference", tone: "orange" },
  { title: "Giá trị tồn đọng", value: "428 triệu ₫", change: "+5,6%", trend: "up", icon: "difference", tone: "red" },
];

export const aiReports: AiReport[] = [
  { key: "1", area: "Vận hành", group: "Đơn nội bộ", item: "Gói cước gia hạn", summary: "Có 30 gói SF99 được gia hạn trong hôm nay" },
  { key: "2", area: "Vận hành", group: "Kho", item: "Tồn kho H2H", summary: "Còn 685 số H2H, cảnh báo dưới ngưỡng kho" },
  { key: "3", area: "Đối soát", group: "Đơn nội bộ", item: "Gói cước gia hạn", summary: "Lệch 12 gói SF99 giữa hệ thống và tệp đối soát CBNV" },
  { key: "4", area: "CSKH", group: "Call", item: "Tỷ lệ gọi nhỡ", summary: "Tỷ lệ gọi nhỡ 6,5%, vượt ngưỡng SLA 5%" },
  { key: "5", area: "CSKH", group: "Chat", item: "Chat chưa phản hồi", summary: "36 tin nhắn chưa phản hồi, tập trung khung 12h–14h" },
];

export const backlogOrders = [
  { key: "1", group: "Đơn Online", channel: "Web/App", pending: 68, oldest: "31 giờ", sla: "24 giờ", status: "Trễ hạn" as WorkStatus },
  { key: "2", group: "Đơn nội bộ", channel: "CBNV HDB", pending: 24, oldest: "19 giờ", sla: "24 giờ", status: "Đang xử lý" as WorkStatus },
  { key: "3", group: "Đơn Đại lý", channel: "API Viettech", pending: 17, oldest: "9 giờ", sla: "12 giờ", status: "Đang xử lý" as WorkStatus },
  { key: "4", group: "eSIM Travel", channel: "Vietjet Air", pending: 8, oldest: "3 giờ", sla: "8 giờ", status: "Hoàn thành" as WorkStatus },
];

export const reconciliationPartners = [
  { key: "1", partner: "Tệp CBNV Sovico", scope: "HDB, Vikki, VJ, GPAY và 8 BU", due: "18/09/2026", differences: 42, value: "126 triệu ₫", progress: 92, status: "Đang xử lý" as WorkStatus },
  { key: "2", partner: "MVNO", scope: "SkyFi, App Vikki", due: "15/09/2026", differences: 18, value: "46 triệu ₫", progress: 100, status: "Hoàn thành" as WorkStatus },
  { key: "3", partner: "eSIM Travel", scope: "Vietjet Air, Skyjoy", due: "20/09/2026", differences: 31, value: "84 triệu ₫", progress: 76, status: "Đang xử lý" as WorkStatus },
  { key: "4", partner: "Dịch vụ khác", scope: "IRIS, C06, PAY, FTTH", due: "13/09/2026", differences: 76, value: "149 triệu ₫", progress: 58, status: "Trễ hạn" as WorkStatus },
  { key: "5", partner: "Mobifone", scope: "Bán buôn, thuê đầu số", due: "30/09/2026", differences: 19, value: "23 triệu ₫", progress: 68, status: "Đang xử lý" as WorkStatus },
];
