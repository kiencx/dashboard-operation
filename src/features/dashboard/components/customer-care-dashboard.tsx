"use client";

import { Radio } from "antd";
import { useState } from "react";
import type { CallChartPoint, CallStatistics, ChatChartPoint, ChatStatistics, PeriodFilter } from "../api/types";
import { useApi } from "../api/use-api";
import { EMPTY_VALUE, formatCount, formatDuration, formatPercent } from "../format";
import type { BarDatum, BarSeries, CareChannel, OverviewMetric } from "../types";
import styles from "../dashboard.module.css";
import { ApiErrorAlert } from "./api-error-alert";
import { BarChartCard } from "./bar-chart-card";
import { DateRangeFilter, DEFAULT_PERIOD } from "./date-range-filter";
import { OverviewMetricCard } from "./overview-metric-card";
import { PageHeading } from "./page-heading";

const channels: CareChannel[] = ["Call", "Chat"];

const callSeries: BarSeries[] = [
  { key: "answered", label: "Gặp", color: "#10b981" },
  { key: "missed", label: "Nhỡ", color: "#f87171" },
];

const chatSeries: BarSeries[] = [{ key: "conversations", label: "Hội thoại", color: "#4f8ef7" }];

function buildCallMetrics(data?: CallStatistics): OverviewMetric[] {
  return [
    { title: "Tổng cuộc gọi vào", value: formatCount(data?.totalCallIn), unit: "cuộc", icon: "phone", tone: "blue", details: [] },
    { title: "Cuộc gọi vào hàng đợi", value: formatCount(data?.totalQueueCall), unit: "cuộc", icon: "queue", tone: "violet", details: [] },
    { title: "Cuộc gọi gặp", value: formatCount(data?.totalAnswerCallin), unit: "cuộc", icon: "answered", tone: "green", details: [] },
    { title: "Tỷ lệ gọi nhỡ", value: data ? formatPercent(data.missedPercent / 100) : EMPTY_VALUE, icon: "missed", tone: "red", details: [] },
    { title: "Tốc độ trả lời trung bình", value: formatDuration(data?.averageSpeedAnswer), icon: "speed", tone: "orange", details: [] },
    { title: "Thời gian xử lý trung bình", value: formatDuration(data?.aht), icon: "time", tone: "cyan", details: [] },
  ];
}

// API trả tỷ lệ chat nhỡ dạng chuỗi "37.22%"; đổi về cùng định dạng số Việt Nam với các thẻ khác.
const formatRateText = (value: string | undefined) => {
  const rate = Number.parseFloat(value ?? "");
  return Number.isNaN(rate) ? value ?? EMPTY_VALUE : formatPercent(rate / 100);
};

function buildChatMetrics(data?: ChatStatistics): OverviewMetric[] {
  return [
    { title: "Tổng chat", value: formatCount(data?.totalChat), unit: "hội thoại", icon: "chat", tone: "blue", details: [] },
    { title: "Chat gặp", value: formatCount(data?.totalChatSuccess), unit: "hội thoại", icon: "answered", tone: "green", details: [] },
    { title: "Chat nhỡ", value: formatCount(data?.missedChat), unit: "hội thoại", icon: "queue", tone: "violet", details: [] },
    { title: "Tỷ lệ chat nhỡ", value: formatRateText(data?.abandonChatRate), icon: "missed", tone: "red", details: [] },
    { title: "Tốc độ trả lời trung bình", value: formatDuration(data?.avgAnswerSpeed), icon: "speed", tone: "orange", details: [] },
    { title: "Thời gian xử lý trung bình", value: formatDuration(data?.avgAnswerDuration), icon: "time", tone: "cyan", details: [] },
  ];
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_DAILY_POINTS = 62;

/**
 * Hôm nay trả mốc giờ (08:30), các kỳ khác trả từng ngày (YYYY-MM-DD).
 * Mốc ngày hiển thị DD/MM; kỳ dài (vd cả năm) thì cộng dồn theo tháng để biểu đồ đọc được.
 */
function toTimeline(data: BarDatum[]): BarDatum[] {
  if (!data.every((item) => ISO_DATE.test(item.label))) return data;
  if (data.length <= MAX_DAILY_POINTS) return data.map((item) => ({ ...item, label: `${item.label.slice(8, 10)}/${item.label.slice(5, 7)}` }));

  const months = new Map<string, Record<string, number>>();
  for (const item of data) {
    const month = `${item.label.slice(5, 7)}/${item.label.slice(0, 4)}`;
    const values = months.get(month) ?? {};
    for (const [key, value] of Object.entries(item.values)) values[key] = (values[key] ?? 0) + value;
    months.set(month, values);
  }
  return [...months].map(([label, values]) => ({ label, values }));
}

const toCallChart = (points: CallChartPoint[]): BarDatum[] =>
  points.map((point) => ({ label: point.time, values: { answered: point.totalAnswerCallin, missed: point.totalMissCall } }));

const toChatChart = (points: ChatChartPoint[]): BarDatum[] => points.map((point) => ({ label: point.time, values: { conversations: point.totalConversation } }));

export function CustomerCareDashboard() {
  const [channel, setChannel] = useState<CareChannel>("Call");
  const [filter, setFilter] = useState<PeriodFilter>({ period: DEFAULT_PERIOD });
  const isCall = channel === "Call";

  const statistics = useApi<CallStatistics | ChatStatistics>(isCall ? "customer-care/statistical-call" : "customer-care/statistical-chat", filter);
  const chart = useApi<CallChartPoint[] | ChatChartPoint[]>(isCall ? "customer-care/chart-call" : "customer-care/chart-chat", filter);

  // Khi vừa đổi kênh, dữ liệu cũ thuộc kênh kia nên chỉ dùng khi đã tải xong.
  const statisticsData = statistics.loading ? undefined : statistics.data;
  const chartData = chart.loading ? [] : chart.data ?? [];
  const metrics = isCall ? buildCallMetrics(statisticsData as CallStatistics | undefined) : buildChatMetrics(statisticsData as ChatStatistics | undefined);

  return (
    <>
      <PageHeading
        title="Chăm sóc khách hàng"
        extra={
          <div className={styles.headingControls}>
            <Radio.Group
              className={styles.channelSwitch}
              optionType="button"
              buttonStyle="solid"
              value={channel}
              onChange={(event) => setChannel(event.target.value)}
              options={channels}
              aria-label="Chọn kênh"
            />
            <DateRangeFilter onChange={setFilter} />
          </div>
        }
      />
      <ApiErrorAlert errors={[statistics.error, chart.error]} />
      <section className={`${styles.statsGrid} ${styles.statsGridSix}`} aria-label={`KPI ${channel}`}>
        {metrics.map((metric) => <OverviewMetricCard key={metric.title} metric={metric} loading={statistics.loading} />)}
      </section>
      <div className={styles.wideChart}>
        <BarChartCard
          title={isCall ? "Cuộc gọi vào theo thời gian" : "Hội thoại chat theo thời gian"}
          series={isCall ? callSeries : chatSeries}
          data={toTimeline(isCall ? toCallChart(chartData as CallChartPoint[]) : toChatChart(chartData as ChatChartPoint[]))}
          loading={chart.loading}
          unit={isCall ? "cuộc" : "hội thoại"}
          stacked={isCall}
        />
      </div>
    </>
  );
}
