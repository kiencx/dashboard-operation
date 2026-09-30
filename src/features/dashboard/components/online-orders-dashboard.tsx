"use client";

import { Segmented } from "antd";
import { useState } from "react";
import { onlineOrderMetrics, onlineRevenueCharts } from "../data";
import styles from "../dashboard.module.css";
import { BarChartCard } from "./bar-chart-card";
import { DateRangeFilter } from "./date-range-filter";
import { OverviewMetricCard } from "./overview-metric-card";
import { PageHeading } from "./page-heading";

export function OnlineOrdersDashboard() {
  const [chartKey, setChartKey] = useState(onlineRevenueCharts[0].key);
  const chart = onlineRevenueCharts.find((item) => item.key === chartKey) ?? onlineRevenueCharts[0];

  return (
    <>
      <PageHeading title="Đơn online" extra={<DateRangeFilter />} />
      <section className={`${styles.statsGrid} ${styles.statsGridFive}`} aria-label="KPI đơn online">
        {onlineOrderMetrics.map((metric) => <OverviewMetricCard key={metric.title} metric={metric} />)}
      </section>
      <div className={styles.wideChart}>
        <BarChartCard
          title="Doanh thu theo nguồn (triệu ₫)"
          series={[chart.series]}
          data={chart.data}
          unit="triệu ₫"
          extra={
            <Segmented
              value={chartKey}
              onChange={setChartKey}
              options={onlineRevenueCharts.map((item) => ({ label: item.label, value: item.key }))}
            />
          }
        />
      </div>
    </>
  );
}
