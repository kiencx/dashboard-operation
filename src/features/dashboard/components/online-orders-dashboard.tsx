"use client";

import { Segmented } from "antd";
import { useState } from "react";
import type { EsimSourceRevenue, OnlineOrderMetrics, OnlineOrderSource, PeriodFilter, SourceRevenue } from "../api/types";
import { useApi } from "../api/use-api";
import { formatCount } from "../format";
import type { BarDatum, BarSeries, OverviewMetric } from "../types";
import styles from "../dashboard.module.css";
import { ApiErrorAlert } from "./api-error-alert";
import { BarChartCard } from "./bar-chart-card";
import { DateRangeFilter, DEFAULT_PERIOD } from "./date-range-filter";
import { OverviewMetricCard } from "./overview-metric-card";
import { PageHeading } from "./page-heading";

const onlineSourceLabels: Record<OnlineOrderSource, string> = {
  HDSAISON: "HD SAISON",
  VIKKI: "Vikki",
  SKYFI_APP: "SkyFi App",
  SKYFI_WEB: "SkyFi Web",
};

// Đổi VND sang triệu ₫, giữ một chữ số thập phân.
const toRevenueData = (rows: (SourceRevenue | EsimSourceRevenue)[], getLabel: (source: string | null) => string): BarDatum[] =>
  rows.map((row) => ({ label: getLabel(row.source), values: { revenue: Math.round(row.revenue / 100_000) / 10 } }));

const revenueCharts: { key: string; label: string; path: string; series: BarSeries; getLabel: (source: string | null) => string }[] = [
  {
    key: "online",
    label: "Đơn online (H2H)",
    path: "operations/online-orders/revenue-by-source",
    series: { key: "revenue", label: "Doanh thu đơn online", color: "#4f8ef7" },
    getLabel: (source) => onlineSourceLabels[source as OnlineOrderSource] ?? source ?? "Không rõ nguồn",
  },
  {
    key: "esim",
    label: "eSIM du lịch",
    path: "operations/travel-esim-orders/revenue-by-source",
    series: { key: "revenue", label: "Doanh thu đơn eSIM du lịch", color: "#0891b2" },
    getLabel: (source) => source ?? "Không rõ nguồn",
  },
];

function buildMetrics(data?: OnlineOrderMetrics): OverviewMetric[] {
  return [
    { title: "Đơn mua SIM", value: formatCount(data?.simOrders), unit: "đơn", icon: "sim", tone: "blue", details: [] },
    { title: "Đơn mua gói", value: formatCount(data?.packageOrders), unit: "đơn", icon: "renewal", tone: "violet", details: [] },
    { title: "Đơn Topup", value: formatCount(data?.topupOrders), unit: "đơn", icon: "topup", tone: "orange", details: [] },
    { title: "Đơn Outbound", value: formatCount(data?.outboundOrders), unit: "đơn", icon: "outbound", tone: "cyan", details: [] },
    { title: "Đơn Inbound", value: formatCount(data?.inboundOrders), unit: "đơn", icon: "inbound", tone: "green", details: [] },
  ];
}

export function OnlineOrdersDashboard() {
  const [filter, setFilter] = useState<PeriodFilter>({ period: DEFAULT_PERIOD });
  const [chartKey, setChartKey] = useState(revenueCharts[0].key);
  const chart = revenueCharts.find((item) => item.key === chartKey) ?? revenueCharts[0];

  const metrics = useApi<OnlineOrderMetrics>("operations/online-orders/metrics", filter);
  const revenue = useApi<(SourceRevenue | EsimSourceRevenue)[]>(chart.path, filter);

  return (
    <>
      <PageHeading title="Đơn online" extra={<DateRangeFilter onChange={setFilter} />} />
      <ApiErrorAlert errors={[metrics.error, revenue.error]} />
      <section className={`${styles.statsGrid} ${styles.statsGridFive}`} aria-label="KPI đơn online">
        {buildMetrics(metrics.data).map((metric) => <OverviewMetricCard key={metric.title} metric={metric} loading={metrics.loading} />)}
      </section>
      <div className={styles.wideChart}>
        <BarChartCard
          title="Doanh thu theo nguồn (triệu ₫)"
          series={[chart.series]}
          data={toRevenueData(revenue.data ?? [], chart.getLabel)}
          loading={revenue.loading}
          emptyText="Không có doanh thu trong kỳ"
          unit="triệu ₫"
          extra={
            <Segmented
              value={chartKey}
              onChange={setChartKey}
              options={revenueCharts.map((item) => ({ label: item.label, value: item.key }))}
            />
          }
        />
      </div>
    </>
  );
}
