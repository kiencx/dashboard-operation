"use client";

import { InboxOutlined } from "@ant-design/icons";
import { Card, Progress, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import { backlogOrders, operationsMetrics } from "../data";
import type { WorkStatus } from "../types";
import styles from "../dashboard.module.css";
import { DateRangeFilter } from "./date-range-filter";
import { MetricCard } from "./metric-card";
import { PageHeading } from "./page-heading";
import { TrendChart } from "./trend-chart";
import { WorkStatusTag } from "./work-status-tag";

const { Text } = Typography;
const columns: TableProps<(typeof backlogOrders)[number]>["columns"] = [
  { title: "NHÓM CÔNG VIỆC", dataIndex: "group", width: 180, render: (value) => <Text strong>{value}</Text> },
  { title: "KÊNH / ĐƠN VỊ", dataIndex: "channel", width: 170 },
  { title: "ĐANG TỒN", dataIndex: "pending", width: 110, render: (value) => <Text strong>{value} đơn</Text> },
  { title: "ĐƠN CŨ NHẤT", dataIndex: "oldest", width: 120 },
  { title: "SLA", dataIndex: "sla", width: 100 },
  { title: "TRẠNG THÁI", dataIndex: "status", width: 130, render: (value: WorkStatus) => <WorkStatusTag status={value} /> },
];

const stocks = [
  { label: "SIM vật lý", value: 62, count: "1.240", target: "Ngưỡng 2.000", color: "#ef4444" },
  { label: "Kho số H2H", value: 78, count: "7.840", target: "Ngưỡng 5.000", color: "#f59e0b" },
  { label: "Kho số M2M", value: 91, count: "18.260", target: "Ngưỡng 8.000", color: "#10b981" },
];

export function OperationsDashboard() {
  return (
    <>
      <PageHeading title="Vận hành" extra={<DateRangeFilter />} />
      <section className={styles.statsGrid} aria-label="KPI vận hành">{operationsMetrics.map((metric) => <MetricCard key={metric.title} metric={metric} />)}</section>
      <div className={styles.mainGrid}>
        <TrendChart title="Xu hướng xử lý đơn hàng" subtitle="Khối lượng theo nhóm công việc" value="12.480 đơn trong kỳ" yLabels={["2.000", "1.500", "1.000", "500", "0"]} series={[
          { label: "Nội bộ", color: "#4f6ef7", points: "0,154 70,143 140,132 210,121 280,130 350,92 420,98 490,66 560,77 630,42" },
          { label: "Online", color: "#8b5cf6", points: "0,131 70,124 140,106 210,113 280,91 350,76 420,82 490,48 560,51 630,19" },
          { label: "Đại lý", color: "#06b6d4", points: "0,174 70,169 140,158 210,162 280,145 350,151 420,128 490,134 560,116 630,101" },
        ]} />
        <Card className={styles.breakdownCard} title={<span><InboxOutlined /> Tồn kho hiện tại</span>} extra={<Tag color="error">1 cảnh báo</Tag>}>
          <div className={styles.stockGrid}>{stocks.map((stock) => <div className={styles.stockItem} key={stock.label}>
            <Progress type="dashboard" percent={stock.value} size={78} strokeColor={stock.color} format={() => stock.count} />
            <Text strong>{stock.label}</Text><Text type="secondary">{stock.target}</Text>
          </div>)}</div>
        </Card>
      </div>
      <Card className={styles.tableCard} title="Đơn hàng tồn đọng theo SLA" extra={<Text type="secondary">Cập nhật 08:30 hôm nay</Text>}>
        <Table columns={columns} dataSource={backlogOrders} pagination={false} scroll={{ x: 800 }} />
      </Card>
    </>
  );
}
