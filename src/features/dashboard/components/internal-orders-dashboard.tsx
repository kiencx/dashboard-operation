"use client";

import { Card, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { internalOrderMetrics, internalOrders } from "../data";
import type { InternalOrder } from "../types";
import styles from "../dashboard.module.css";
import { BuVolumeChart } from "./bu-volume-chart";
import { DateRangeFilter } from "./date-range-filter";
import { OverviewMetricCard } from "./overview-metric-card";
import { PageHeading } from "./page-heading";
import { WorkStatusTag } from "./work-status-tag";

const { Text } = Typography;

const columns: TableProps<InternalOrder>["columns"] = [
  { title: "MÃ ĐƠN HÀNG", dataIndex: "code", width: 170, render: (value) => <Text strong>{value}</Text> },
  { title: "LOẠI ĐƠN", dataIndex: "orderType", width: 150 },
  { title: "ĐỐI TÁC (BU)", dataIndex: "partner", width: 150 },
  { title: "TRẠNG THÁI", dataIndex: "status", width: 130, render: (value) => <WorkStatusTag status={value} /> },
  { title: "NGÀY TẠO", dataIndex: "createdAt", width: 120 },
];

export function InternalOrdersDashboard() {
  return (
    <>
      <PageHeading title="Đơn nội bộ" extra={<DateRangeFilter />} />
      <section className={styles.statsGrid} aria-label="KPI đơn nội bộ">
        {internalOrderMetrics.map((metric) => <OverviewMetricCard key={metric.title} metric={metric} />)}
      </section>
      <div className={styles.wideChart}>
        <BuVolumeChart />
      </div>
      <Card className={styles.tableCard} title="Chi tiết đơn hàng">
        <Table columns={columns} dataSource={internalOrders} pagination={{ pageSize: 10, showSizeChanger: false }} scroll={{ x: 740 }} />
      </Card>
    </>
  );
}
