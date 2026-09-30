"use client";

import { agencyApiOrders, agencyKitOrders, agencyOrderMetrics } from "../data";
import styles from "../dashboard.module.css";
import { AgencyOrderTable } from "./agency-order-table";
import { DateRangeFilter } from "./date-range-filter";
import { OverviewMetricCard } from "./overview-metric-card";
import { PageHeading } from "./page-heading";

export function AgencyOrdersDashboard() {
  return (
    <>
      <PageHeading title="Đơn đại lý" extra={<DateRangeFilter />} />
      <section className={`${styles.statsGrid} ${styles.statsGridThree}`} aria-label="KPI đơn đại lý">
        {agencyOrderMetrics.map((metric) => <OverviewMetricCard key={metric.title} metric={metric} />)}
      </section>
      <div className={styles.splitGrid}>
        <AgencyOrderTable title="Số đơn PO (KIT theo lô) theo Đại lý" data={agencyKitOrders} />
        <AgencyOrderTable title="Số đơn gọi API theo Đại lý" data={agencyApiOrders} />
      </div>
    </>
  );
}
