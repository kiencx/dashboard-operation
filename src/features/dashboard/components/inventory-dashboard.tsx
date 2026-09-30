"use client";

import { Card, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { inventoryMetrics, numberUsage, simUsage, warehouses } from "../data";
import type { Warehouse } from "../types";
import styles from "../dashboard.module.css";
import { DateRangeFilter } from "./date-range-filter";
import { DonutChartCard } from "./donut-chart-card";
import { OverviewMetricCard } from "./overview-metric-card";
import { PageHeading } from "./page-heading";

const { Text } = Typography;

const numberFormat = new Intl.NumberFormat("vi-VN");

const columns: TableProps<Warehouse>["columns"] = [
  { title: "MÃ KHO", dataIndex: "code", width: 200, render: (value) => <Text strong>{value}</Text> },
  { title: "TÊN KHO", dataIndex: "name", width: 240 },
  {
    title: "SẢN PHẨM",
    dataIndex: "productCode",
    width: 220,
    render: (_, row) => (
      <div className={styles.productCell}>
        <Text strong>{row.productCode}</Text>
        <Text type="secondary">{row.productName}</Text>
      </div>
    ),
  },
  {
    title: "TỒN / DÙNG",
    key: "stockUsed",
    align: "right",
    width: 130,
    render: (_, row) => `${numberFormat.format(row.stock)} / ${numberFormat.format(row.used)}`,
  },
  {
    title: "TỔNG KHO",
    key: "total",
    align: "right",
    width: 120,
    render: (_, row) => <Text strong>{numberFormat.format(row.stock + row.used)}</Text>,
  },
];

export function InventoryDashboard() {
  return (
    <>
      <PageHeading title="Kho" extra={<DateRangeFilter />} />
      <section className={`${styles.statsGrid} ${styles.statsGridTwo}`} aria-label="KPI kho">
        {inventoryMetrics.map((metric) => <OverviewMetricCard key={metric.title} metric={metric} />)}
      </section>
      <div className={styles.splitGrid}>
        <DonutChartCard title="Tình trạng sử dụng SIM" segments={simUsage} unit="SIM" centerLabel="đã sử dụng" centerKeys={["usim", "esim"]} />
        <DonutChartCard title="Tình trạng sử dụng số" segments={numberUsage} unit="số" centerLabel="đã sử dụng" centerKeys={["h2h", "m2m"]} />
      </div>
      <Card className={styles.tableCard} title="Tổng quan từng kho">
        <Table rowKey="code" columns={columns} dataSource={warehouses} pagination={{ pageSize: 10, showSizeChanger: false }} scroll={{ x: 910 }} />
      </Card>
    </>
  );
}
