"use client";

import { contactRates, overviewMetrics, packageSeries, packageVolumes } from "../data";
import styles from "../dashboard.module.css";
import { AiReportCard } from "./ai-report-card";
import { BarChartCard } from "./bar-chart-card";
import { ContactRateCard } from "./contact-rate-card";
import { DateRangeFilter } from "./date-range-filter";
import { OverviewMetricCard } from "./overview-metric-card";
import { PageHeading } from "./page-heading";

export function OverviewDashboard() {
  return (
    <>
      <PageHeading title="Tổng quan vận hành" extra={<DateRangeFilter />} />
      <section className={styles.statsGrid} aria-label="KPI tổng quan">{overviewMetrics.map((metric) => <OverviewMetricCard key={metric.title} metric={metric} />)}</section>
      <div className={styles.mainGrid}>
        <BarChartCard title="Số lượng gói cước" series={packageSeries} data={packageVolumes} />
        <ContactRateCard data={contactRates} />
      </div>
      <AiReportCard />
    </>
  );
}
