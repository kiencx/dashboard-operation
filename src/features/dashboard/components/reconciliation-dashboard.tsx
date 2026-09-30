"use client";

import { Card, Progress, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { reconciliationMetrics, reconciliationPartners } from "../data";
import type { WorkStatus } from "../types";
import styles from "../dashboard.module.css";
import { DateRangeFilter } from "./date-range-filter";
import { MetricCard } from "./metric-card";
import { PageHeading } from "./page-heading";
import { TrendChart } from "./trend-chart";
import { WorkStatusTag } from "./work-status-tag";

const { Text } = Typography;
const columns: TableProps<(typeof reconciliationPartners)[number]>["columns"] = [
  { title: "ĐỐI TƯỢNG", dataIndex: "partner", width: 175, render: (value) => <Text strong>{value}</Text> },
  { title: "PHẠM VI / ĐỐI TÁC", dataIndex: "scope", width: 235 },
  { title: "HẠN ĐỐI SOÁT", dataIndex: "due", width: 125 },
  { title: "CHÊNH LỆCH", dataIndex: "differences", width: 110, render: (value) => <Text strong>{value}</Text> },
  { title: "GIÁ TRỊ", dataIndex: "value", width: 125 },
  { title: "TIẾN ĐỘ", dataIndex: "progress", width: 150, render: (value) => <Progress percent={value} size="small" status={value < 60 ? "exception" : "active"} /> },
  { title: "TRẠNG THÁI", dataIndex: "status", width: 125, render: (value: WorkStatus) => <WorkStatusTag status={value} /> },
];

export function ReconciliationDashboard() {
  return (
    <>
      <PageHeading title="Đối soát" extra={<DateRangeFilter />} />
      <section className={styles.statsGrid} aria-label="KPI đối soát">{reconciliationMetrics.map((metric) => <MetricCard key={metric.title} metric={metric} />)}</section>
      <div className={styles.wideChart}>
        <TrendChart title="Chênh lệch phát hiện và đã xử lý" subtitle="Số lượng chênh lệch theo kỳ đối soát" value="186 chênh lệch phát hiện" yLabels={["60", "45", "30", "15", "0"]} series={[
          { label: "Phát hiện", color: "#ef4444", points: "0,151 70,132 140,146 210,101 280,118 350,87 420,102 490,63 560,78 630,38" },
          { label: "Đã xử lý", color: "#10b981", points: "0,172 70,160 140,151 210,136 280,122 350,111 420,89 490,82 560,61 630,48" },
        ]} />
      </div>
      <Card className={styles.tableCard} title="Trạng thái đối soát theo đối tác" extra={<Tag color="error">1 phiên trễ hạn</Tag>}>
        <Table columns={columns} dataSource={reconciliationPartners} pagination={false} scroll={{ x: 1100 }} />
      </Card>
    </>
  );
}
