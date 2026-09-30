"use client";

import { AlertOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Card, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { alerts, contactRates, overviewMetrics, packageSeries, packageVolumes } from "../data";
import type { AlertSeverity } from "../types";
import styles from "../dashboard.module.css";
import { BarChartCard } from "./bar-chart-card";
import { ContactRateCard } from "./contact-rate-card";
import { DateRangeFilter } from "./date-range-filter";
import { OverviewMetricCard } from "./overview-metric-card";
import { PageHeading } from "./page-heading";

const { Text } = Typography;
const severityColor: Record<AlertSeverity, string> = { "Nghiêm trọng": "error", "Cảnh báo": "warning", "Theo dõi": "processing" };
const alertColumns: TableProps<(typeof alerts)[number]>["columns"] = [
  { title: "MẢNG", dataIndex: "area", width: 110, render: (value) => <Text strong>{value}</Text> },
  { title: "HẠNG MỤC CẦN CHÚ Ý", dataIndex: "issue", width: 310 },
  { title: "GIÁ TRỊ", dataIndex: "value", width: 150, render: (value) => <Text strong>{value}</Text> },
  { title: "MỨC ĐỘ", dataIndex: "severity", width: 130, render: (value: AlertSeverity) => <Tag color={severityColor[value]}>{value}</Tag> },
  { title: "CẬP NHẬT", dataIndex: "updated", width: 130, render: (value) => <Text type="secondary"><ClockCircleOutlined /> {value}</Text> },
];

export function OverviewDashboard() {
  return (
    <>
      <PageHeading title="Tổng quan vận hành" extra={<DateRangeFilter />} />
      <section className={styles.statsGrid} aria-label="KPI tổng quan">{overviewMetrics.map((metric) => <OverviewMetricCard key={metric.title} metric={metric} />)}</section>
      <div className={styles.mainGrid}>
        <BarChartCard title="Số lượng gói cước" series={packageSeries} data={packageVolumes} />
        <ContactRateCard data={contactRates} />
      </div>
      <Card className={styles.tableCard} title={<span><AlertOutlined className={styles.alertIcon} /> Cảnh báo nổi bật</span>} extra={<Tag color="error">4 hạng mục cần chú ý</Tag>}>
        <Table columns={alertColumns} dataSource={alerts} pagination={false} scroll={{ x: 850 }} />
      </Card>
    </>
  );
}
