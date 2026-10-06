import type { AgencyOrderCount, AiReport, BarDatum, BarSeries, CareChannel, ContactRate, DashboardMetric, DonutSegment, InternalOrder, OverviewMetric, Warehouse, WorkStatus } from "./types";

const countFormat = new Intl.NumberFormat("vi-VN");
const shareFormat = new Intl.NumberFormat("vi-VN", { style: "percent", maximumFractionDigits: 1 });
const sumOrders = (rows: AgencyOrderCount[]) => rows.reduce((total, row) => total + row.orders, 0);

const STOCK_COLOR = "#cbd5e1";
const simStock = { usim: { total: 20000, used: 12000 }, esim: { total: 28250, used: 17500 } };
const numberStock = { h2h: { total: 10000, used: 4800 }, m2m: { total: 2450, used: 1550 } };
const simTotal = simStock.usim.total + simStock.esim.total;
const numberTotal = numberStock.h2h.total + numberStock.m2m.total;

export const inventoryMetrics: OverviewMetric[] = [
  {
    title: "Tổng kho SIM",
    value: countFormat.format(simTotal),
    unit: "SIM",
    icon: "sim",
    tone: "blue",
    details: [
      { label: "uSIM trong kho", change: countFormat.format(simStock.usim.total) },
      { label: "eSIM trong kho", change: countFormat.format(simStock.esim.total) },
    ],
  },
  {
    title: "Tổng kho số",
    value: countFormat.format(numberTotal),
    unit: "số",
    icon: "stock",
    tone: "cyan",
    details: [
      { label: "Số H2H trong kho", change: countFormat.format(numberStock.h2h.total) },
      { label: "Số M2M trong kho", change: countFormat.format(numberStock.m2m.total) },
    ],
  },
];

export const simUsage: DonutSegment[] = [
  { key: "usim", label: "uSIM đã dùng", value: simStock.usim.used, color: "#4f8ef7" },
  { key: "esim", label: "eSIM đã dùng", value: simStock.esim.used, color: "#8b5cf6" },
  { key: "stock", label: "Còn tồn kho", value: simTotal - simStock.usim.used - simStock.esim.used, color: STOCK_COLOR },
];

export const numberUsage: DonutSegment[] = [
  { key: "h2h", label: "Số H2H đã dùng", value: numberStock.h2h.used, color: "#0891b2" },
  { key: "m2m", label: "Số M2M đã dùng", value: numberStock.m2m.used, color: "#f59e0b" },
  { key: "stock", label: "Còn tồn kho", value: numberTotal - numberStock.h2h.used - numberStock.m2m.used, color: STOCK_COLOR },
];

const baseWarehouses: Warehouse[] = [
  { code: "GLX-EMPLOYEE1", name: "001-Kho CBNV Sovico", productCode: "eSIM-MVNO", productName: "eSIM MVNO", stock: 60, used: 40 },
  { code: "ONLINE", name: "002-Kho ONLINE Web/App", productCode: "CN", productName: "eSIM China", stock: 50, used: 60 },
  { code: "SKYFI_TRAVEL_ESIM", name: "003-Kho eSIM du lịch SkyFi", productCode: "SIM-MVNO", productName: "SkyFi SIM MVNO", stock: 100, used: 2000 },
  { code: "AG_API_000", name: "AG_api_000: API Đại lý tổng", productCode: "12SM16_GLX", productName: "Gói cước 12SM16_GLX TBHH", stock: 200, used: 10 },
];

const agencyWarehouseNames = ["AMF", "AVIT", "OTECK", "Minh Khang", "VietTech", "MID", "Sao Việt", "Nam Á", "Phú Thịnh", "Hoàng Long"];

export const warehouses: Warehouse[] = [
  ...baseWarehouses,
  ...Array.from({ length: 42 }, (_, index) => {
    const product = baseWarehouses[index % baseWarehouses.length];
    const agency = agencyWarehouseNames[index % agencyWarehouseNames.length];
    const number = String(index + 1).padStart(3, "0");
    return {
      code: `AG_${agency.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/\s/g, "_")}_${number}`,
      name: `AG_${number}: Kho Đại lý ${agency}`,
      productCode: product.productCode,
      productName: product.productName,
      stock: 40 + ((index * 37) % 260),
      used: 10 + ((index * 53) % 480),
    };
  }),
];

export const agencyKitOrders: AgencyOrderCount[] = [
  { agency: "AMF", orders: 6200 },
  { agency: "AVIT", orders: 5400 },
  { agency: "OTECK", orders: 4800 },
  { agency: "Minh Khang", orders: 4500 },
  { agency: "Phú Thịnh", orders: 4100 },
  { agency: "Hoàng Long", orders: 3900 },
  { agency: "Sao Việt", orders: 3600 },
  { agency: "An Phát", orders: 3300 },
  { agency: "Tân Tiến", orders: 3000 },
  { agency: "Đại Dương", orders: 2700 },
  { agency: "Nam Á", orders: 2400 },
  { agency: "Thành Công", orders: 2000 },
  { agency: "Bình Minh", orders: 1450 },
  { agency: "Kim Long", orders: 900 },
];

export const agencyApiOrders: AgencyOrderCount[] = [
  { agency: "Minh Khang", orders: 7200 },
  { agency: "VietTech", orders: 6100 },
  { agency: "MID", orders: 5300 },
  { agency: "AMF", orders: 4200 },
  { agency: "Sao Việt", orders: 3100 },
  { agency: "Nam Á", orders: 2700 },
];

const kitTotal = sumOrders(agencyKitOrders);
const apiTotal = sumOrders(agencyApiOrders);
const agencyTotal = kitTotal + apiTotal;
const agencyCount = new Set([...agencyKitOrders, ...agencyApiOrders].map((row) => row.agency)).size;

export const agencyOrderMetrics: OverviewMetric[] = [
  {
    title: "Tổng đơn Đại lý",
    value: countFormat.format(agencyTotal),
    unit: "đơn",
    icon: "orders",
    tone: "blue",
    details: [{ label: "Số Đại lý phát sinh đơn", change: countFormat.format(agencyCount) }],
  },
  {
    title: "Đơn KIT theo lô",
    value: countFormat.format(kitTotal),
    unit: "đơn",
    icon: "kit",
    tone: "violet",
    details: [
      { label: "Số Đại lý", change: countFormat.format(agencyKitOrders.length) },
      { label: "Tỷ trọng", change: shareFormat.format(kitTotal / agencyTotal) },
    ],
  },
  {
    title: "Đơn Đại lý qua API",
    value: countFormat.format(apiTotal),
    unit: "đơn",
    icon: "api",
    tone: "cyan",
    details: [
      { label: "Số Đại lý", change: countFormat.format(agencyApiOrders.length) },
      { label: "Tỷ trọng", change: shareFormat.format(apiTotal / agencyTotal) },
    ],
  },
];

export const internalOrderMetrics: OverviewMetric[] = [
  {
    title: "Tổng đơn CBNV",
    value: "48.250",
    unit: "đơn",
    icon: "orders",
    tone: "blue",
    details: [{ label: "So với kỳ trước", change: "98,6%", trend: "up" }],
  },
  {
    title: "Gói cước gia hạn",
    value: "28.600",
    unit: "gói",
    icon: "renewal",
    tone: "violet",
    details: [
      { label: "SF99", change: "15.000 gói" },
      { label: "SF179", change: "10.000 gói" },
      { label: "SF399", change: "3.600 gói" },
    ],
  },
  {
    title: "SIM mới cấp cho CBNV",
    value: "12.450",
    unit: "SIM",
    icon: "sim",
    tone: "cyan",
    details: [
      { label: "SF99", change: "8.000 SIM" },
      { label: "SF179", change: "3.000 SIM" },
      { label: "SF399", change: "1.450 SIM" },
    ],
  },
  {
    title: "Đơn Topup",
    value: "284.500",
    unit: "đơn",
    icon: "topup",
    tone: "orange",
    details: [{ label: "Tổng giá trị nạp", change: "10.000.000 ₫" }],
  },
];

export const onlineOrderMetrics: OverviewMetric[] = [
  { title: "Đơn mua SIM", value: "48.250", unit: "đơn", icon: "sim", tone: "blue", details: [{ label: "So với kỳ trước", change: "98,6%", trend: "up" }] },
  { title: "Đơn mua gói", value: "28.600", unit: "đơn", icon: "renewal", tone: "violet", details: [{ label: "So với kỳ trước", change: "98,6%", trend: "up" }] },
  { title: "Đơn Topup", value: "12.450", unit: "đơn", icon: "topup", tone: "orange", details: [{ label: "So với kỳ trước", change: "98,6%", trend: "up" }] },
  { title: "Đơn Outbound", value: "48.250", unit: "đơn", icon: "outbound", tone: "cyan", details: [{ label: "So với kỳ trước", change: "98,6%", trend: "up" }] },
  { title: "Đơn Inbound", value: "28.600", unit: "đơn", icon: "inbound", tone: "green", details: [{ label: "So với kỳ trước", change: "98,6%", trend: "up" }] },
];

export const onlineRevenueCharts: { key: string; label: string; series: BarSeries; data: BarDatum[] }[] = [
  {
    key: "online",
    label: "Đơn online (H2H)",
    series: { key: "revenue", label: "Doanh thu đơn online", color: "#4f8ef7" },
    data: [
      { label: "SkyFi", values: { revenue: 6400 } },
      { label: "App VikkiBank", values: { revenue: 9800 } },
      { label: "App HD", values: { revenue: 8500 } },
      { label: "App HDSS", values: { revenue: 3600 } },
    ],
  },
  {
    key: "esim",
    label: "eSIM du lịch",
    series: { key: "revenue", label: "Doanh thu đơn eSIM du lịch", color: "#0891b2" },
    data: [
      { label: "SkyFi", values: { revenue: 6400 } },
      { label: "Vietjet", values: { revenue: 7800 } },
      { label: "SkyJoy", values: { revenue: 8500 } },
      { label: "Landing Page", values: { revenue: 3600 } },
    ],
  },
];

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

export const buVolumeSeries: BarSeries[] = [
  { key: "renewal", label: "Gói cước gia hạn", color: "#4f8ef7" },
  { key: "sim", label: "SIM mới cấp", color: "#8b5cf6" },
];

export const internalVolumesByBu: BarDatum[] = [
  { label: "VikkiBank", values: { renewal: 6400, sim: 2100 } },
  { label: "HDBank", values: { renewal: 9000, sim: 3400 } },
  { label: "Vietjet", values: { renewal: 9900, sim: 4200 } },
  { label: "GalaxyOne", values: { renewal: 5300, sim: 1800 } },
  { label: "GalaxyPay", values: { renewal: 8500, sim: 2900 } },
  { label: "GalaxyJoy", values: { renewal: 3600, sim: 1500 } },
  { label: "GC", values: { renewal: 4800, sim: 2600 } },
  { label: "GTS", values: { renewal: 2700, sim: 1200 } },
  { label: "FINOS", values: { renewal: 3900, sim: 1700 } },
  { label: "GDH", values: { renewal: 2200, sim: 900 } },
  { label: "VJ Cargo", values: { renewal: 3100, sim: 1300 } },
];

const orderTypes: InternalOrder["orderType"][] = ["Cấp SIM mới", "Gia hạn gói", "Topup"];
const orderStatuses: WorkStatus[] = ["Hoàn thành", "Hoàn thành", "Đang xử lý", "Hoàn thành", "Trễ hạn"];

export const internalOrders: InternalOrder[] = Array.from({ length: 24 }, (_, index) => {
  const day = 28 - Math.floor(index / 3);
  return {
    key: String(index + 1),
    code: `NB-2609${String(day).padStart(2, "0")}-${String(index + 1).padStart(3, "0")}`,
    orderType: orderTypes[index % orderTypes.length],
    partner: internalVolumesByBu[index % internalVolumesByBu.length].label,
    status: orderStatuses[index % orderStatuses.length],
    createdAt: `${String(day).padStart(2, "0")}/09/2026`,
  };
});

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

const careHours = Array.from({ length: 12 }, (_, index) => `${String(index * 2).padStart(2, "0")}h`);
const toHourly = (rows: [number, number][]): BarDatum[] => rows.map(([answered, missed], index) => ({ label: careHours[index], values: { answered, missed } }));

type CareChannelData = {
  key: CareChannel;
  hourly: BarDatum[];
  droppedBeforeQueue: number;
  avgResponseSeconds: number;
  avgHandlingSeconds: number;
  labels: { incoming: string; queued: string; answered: string; missedRate: string; missed: string; unit: string };
};

const careChannelData: CareChannelData[] = [
  {
    key: "Call",
    hourly: toHourly([[3, 1], [1, 0], [2, 1], [12, 1], [38, 3], [42, 2], [30, 2], [40, 3], [36, 2], [22, 1], [14, 1], [6, 0]]),
    droppedBeforeQueue: 21,
    avgResponseSeconds: 5,
    avgHandlingSeconds: 140,
    labels: { incoming: "Tổng cuộc gọi vào", queued: "Cuộc gọi vào hàng đợi", answered: "Cuộc gọi đã trả lời", missedRate: "Tỷ lệ gọi nhỡ", missed: "Nhỡ", unit: "cuộc" },
  },
  {
    key: "Chat",
    hourly: toHourly([[4, 2], [2, 1], [1, 1], [9, 2], [28, 4], [35, 5], [31, 6], [38, 5], [33, 4], [26, 3], [18, 2], [10, 1]]),
    droppedBeforeQueue: 12,
    avgResponseSeconds: 38,
    avgHandlingSeconds: 425,
    labels: { incoming: "Tổng chat vào", queued: "Chat vào hàng đợi", answered: "Chat đã phản hồi", missedRate: "Tỷ lệ chat nhỡ", missed: "Chưa phản hồi", unit: "tin nhắn" },
  },
];

const formatDuration = (seconds: number) =>
  [Math.floor(seconds / 3600), Math.floor((seconds % 3600) / 60), seconds % 60].map((part) => String(part).padStart(2, "0")).join(":");

export const careViews = careChannelData.map((channel) => {
  const answered = channel.hourly.reduce((sum, item) => sum + item.values.answered, 0);
  const missed = channel.hourly.reduce((sum, item) => sum + item.values.missed, 0);
  const queued = answered + missed;
  const { labels } = channel;
  const metrics: OverviewMetric[] = [
    { title: labels.incoming, value: countFormat.format(queued + channel.droppedBeforeQueue), unit: labels.unit, icon: channel.key === "Call" ? "phone" : "chat", tone: "blue", details: [] },
    { title: labels.queued, value: countFormat.format(queued), unit: labels.unit, icon: "queue", tone: "violet", details: [] },
    { title: labels.answered, value: countFormat.format(answered), unit: labels.unit, icon: "answered", tone: "green", details: [] },
    {
      title: labels.missedRate,
      value: shareFormat.format(missed / queued),
      icon: "missed",
      tone: "red",
      details: [{ label: labels.missed, change: `${countFormat.format(missed)} ${labels.unit}` }],
    },
    { title: "Tốc độ trả lời trung bình", value: formatDuration(channel.avgResponseSeconds), icon: "speed", tone: "orange", details: [] },
    { title: "Thời gian xử lý trung bình", value: formatDuration(channel.avgHandlingSeconds), icon: "time", tone: "cyan", details: [] },
  ];
  const series: BarSeries[] = [
    { key: "answered", label: channel.key === "Call" ? "Trả lời" : "Đã phản hồi", color: "#10b981" },
    { key: "missed", label: labels.missed, color: "#f87171" },
  ];
  return { key: channel.key, metrics, series, hourly: channel.hourly, unit: labels.unit };
});

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
