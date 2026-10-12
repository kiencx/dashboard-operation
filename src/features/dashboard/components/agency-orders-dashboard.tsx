"use client";

import { useState } from "react";
import type { AgencyOrderMetrics, PeriodFilter } from "../api/types";
import { useApi } from "../api/use-api";
import { formatCount, formatPercent } from "../format";
import type { OverviewMetric } from "../types";
import styles from "../dashboard.module.css";
import { AgencyOrderTable } from "./agency-order-table";
import { ApiErrorAlert } from "./api-error-alert";
import { DateRangeFilter, DEFAULT_PERIOD } from "./date-range-filter";
import { OverviewMetricCard } from "./overview-metric-card";
import { PageHeading } from "./page-heading";

function buildMetrics(data?: AgencyOrderMetrics): OverviewMetric[] {
  const share = (value: number) => (data?.totalOrders ? [{ label: "Tỷ trọng", change: formatPercent(value / data.totalOrders) }] : []);
  const otherOrders = data ? data.totalOrders - data.batchKitOrders - data.apiOrders : 0;
  return [
    {
      title: "Tổng đơn Đại lý",
      value: formatCount(data?.totalOrders),
      unit: "đơn",
      icon: "orders",
      tone: "blue",
      details: otherOrders > 0 ? [{ label: "Kênh khác", change: formatCount(otherOrders) }] : [],
    },
    { title: "Đơn KIT theo lô", value: formatCount(data?.batchKitOrders), unit: "đơn", icon: "kit", tone: "violet", details: data ? share(data.batchKitOrders) : [] },
    { title: "Đơn Đại lý qua API", value: formatCount(data?.apiOrders), unit: "đơn", icon: "api", tone: "cyan", details: data ? share(data.apiOrders) : [] },
  ];
}

export function AgencyOrdersDashboard() {
  const [filter, setFilter] = useState<PeriodFilter>({ period: DEFAULT_PERIOD });
  const metrics = useApi<AgencyOrderMetrics>("operations/agency-orders/metrics", filter);
  const filterKey = JSON.stringify(filter);

  return (
    <>
      <PageHeading title="Đơn đại lý" extra={<DateRangeFilter onChange={setFilter} />} />
      <ApiErrorAlert errors={[metrics.error]} />
      <section className={`${styles.statsGrid} ${styles.statsGridThree}`} aria-label="KPI đơn đại lý">
        {buildMetrics(metrics.data).map((metric) => <OverviewMetricCard key={metric.title} metric={metric} loading={metrics.loading} />)}
      </section>
      {/* key theo bộ lọc để bảng quay về trang 1 khi đổi kỳ. */}
      <div className={styles.splitGrid}>
        <AgencyOrderTable key={`kit-${filterKey}`} title="Số đơn PO (KIT theo lô) theo Đại lý" path="operations/agency-orders/batch-kit-by-company" filter={filter} total={metrics.data?.batchKitOrders} />
        <AgencyOrderTable key={`api-${filterKey}`} title="Số đơn gọi API theo Đại lý" path="operations/agency-orders/api-by-company" filter={filter} total={metrics.data?.apiOrders} />
      </div>
    </>
  );
}
