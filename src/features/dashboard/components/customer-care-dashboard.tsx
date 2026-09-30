"use client";

import { Radio } from "antd";
import { useState } from "react";
import { careViews } from "../data";
import type { CareChannel } from "../types";
import styles from "../dashboard.module.css";
import { BarChartCard } from "./bar-chart-card";
import { DateRangeFilter } from "./date-range-filter";
import { OverviewMetricCard } from "./overview-metric-card";
import { PageHeading } from "./page-heading";

export function CustomerCareDashboard() {
  const [channel, setChannel] = useState<CareChannel>("Call");
  const view = careViews.find((item) => item.key === channel) ?? careViews[0];

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
              options={careViews.map((item) => ({ label: item.key, value: item.key }))}
              aria-label="Chọn kênh"
            />
            <DateRangeFilter />
          </div>
        }
      />
      <section className={`${styles.statsGrid} ${styles.statsGridSix}`} aria-label={`KPI ${channel}`}>
        {view.metrics.map((metric) => <OverviewMetricCard key={metric.title} metric={metric} />)}
      </section>
      <div className={styles.wideChart}>
        <BarChartCard
          title={channel === "Call" ? "Cuộc gọi vào theo thời gian" : "Chat vào theo thời gian"}
          series={view.series}
          data={view.hourly}
          unit={view.unit}
          yStep={10}
          stacked
        />
      </div>
    </>
  );
}
