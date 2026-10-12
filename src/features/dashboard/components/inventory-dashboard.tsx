"use client";

import { Card, Input, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { useState } from "react";
import type { OffsetPage, StockMetrics, WarehouseProductStock } from "../api/types";
import { getPagination, useApi } from "../api/use-api";
import { EMPTY_VALUE, formatCount } from "../format";
import type { DonutSegment, OverviewMetric } from "../types";
import styles from "../dashboard.module.css";
import { ApiErrorAlert } from "./api-error-alert";
import { DonutChartCard } from "./donut-chart-card";
import { OverviewMetricCard } from "./overview-metric-card";
import { PageHeading } from "./page-heading";

const { Text } = Typography;

const PAGE_SIZE = 10;
const STOCK_COLOR = "#cbd5e1";

const columns: TableProps<WarehouseProductStock>["columns"] = [
  { title: "TÊN KHO", dataIndex: "warehouseName", width: 260, render: (value: string | null) => <Text strong>{value ?? EMPTY_VALUE}</Text> },
  {
    title: "SẢN PHẨM",
    dataIndex: "productCode",
    width: 240,
    render: (_, row) => (
      <div className={styles.productCell}>
        <Text strong>{row.productCode ?? EMPTY_VALUE}</Text>
        {row.productTypeName && <Text type="secondary">{row.productTypeName}</Text>}
      </div>
    ),
  },
  { title: "KHẢ DỤNG", dataIndex: "availableQuantity", align: "right", width: 120, render: formatCount },
  { title: "GIỮ CHỖ", dataIndex: "reservedQuantity", align: "right", width: 120, render: formatCount },
  { title: "TỔNG KHO", dataIndex: "quantity", align: "right", width: 120, render: (value: number | null) => <Text strong>{formatCount(value)}</Text> },
];

function buildMetrics(data?: StockMetrics): OverviewMetric[] {
  return [
    {
      title: "Tổng kho SIM",
      value: formatCount(data?.simInventory.total),
      unit: "SIM",
      icon: "sim",
      tone: "blue",
      details: data
        ? [
            { label: "SIM vật lý", change: formatCount(data.simInventory.sim) },
            { label: "eSIM", change: formatCount(data.simInventory.esim) },
          ]
        : [],
    },
    {
      title: "Tổng kho số",
      value: formatCount(data?.numberInventory.total),
      unit: "số",
      icon: "stock",
      tone: "cyan",
      details: data
        ? [
            { label: "Số H2H", change: formatCount(data.numberInventory.h2h) },
            { label: "Số M2M", change: formatCount(data.numberInventory.m2m) },
          ]
        : [],
    },
  ];
}

function buildUsage(data?: StockMetrics): { sim: DonutSegment[]; number: DonutSegment[] } {
  return {
    sim: [
      { key: "sim", label: "SIM đã dùng", value: data?.simUsage.simOutStock ?? 0, color: "#4f8ef7" },
      { key: "esim", label: "eSIM đã dùng", value: data?.simUsage.esimOutStock ?? 0, color: "#8b5cf6" },
      { key: "stock", label: "Còn trong kho", value: data?.simUsage.totalInStock ?? 0, color: STOCK_COLOR },
    ],
    number: [
      { key: "h2h", label: "Số H2H đã dùng", value: data?.numberUsage.h2hOutStock ?? 0, color: "#0891b2" },
      { key: "m2m", label: "Số M2M đã dùng", value: data?.numberUsage.m2mOutStock ?? 0, color: "#f59e0b" },
      { key: "stock", label: "Còn trong kho", value: data?.numberUsage.totalInStock ?? 0, color: STOCK_COLOR },
    ],
  };
}

function WarehouseTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data, error, loading } = useApi<OffsetPage<WarehouseProductStock>>("operations/stock/warehouse-products", { page, limit: PAGE_SIZE, search: search.trim() });
  const rows = (data?.data ?? []).map((row, index) => ({ ...row, key: `${data?.page}-${index}` }));

  return (
    <Card
      className={styles.tableCard}
      title="Tổng quan từng kho"
      extra={
        <Input.Search
          className={styles.tableSearch}
          placeholder="Tìm theo tên kho"
          allowClear
          maxLength={255}
          onSearch={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
      }
    >
      <Table
        columns={columns}
        dataSource={rows}
        loading={loading}
        locale={error ? { emptyText: error.message } : undefined}
        pagination={getPagination(data?.total, page, PAGE_SIZE, setPage)}
        scroll={{ x: 860 }}
      />
    </Card>
  );
}

export function InventoryDashboard() {
  const metrics = useApi<StockMetrics>("operations/stock/metrics");
  const usage = buildUsage(metrics.data);

  return (
    <>
      <PageHeading title="Kho" extra={<Text type="secondary">Số liệu theo lần đồng bộ gần nhất</Text>} />
      <ApiErrorAlert errors={[metrics.error]} />
      <section className={`${styles.statsGrid} ${styles.statsGridTwo}`} aria-label="KPI kho">
        {buildMetrics(metrics.data).map((metric) => <OverviewMetricCard key={metric.title} metric={metric} loading={metrics.loading} />)}
      </section>
      <div className={styles.splitGrid}>
        <DonutChartCard title="Tình trạng sử dụng SIM" segments={usage.sim} unit="SIM" centerLabel="đã sử dụng" centerKeys={["sim", "esim"]} loading={metrics.loading} />
        <DonutChartCard title="Tình trạng sử dụng số" segments={usage.number} unit="số" centerLabel="đã sử dụng" centerKeys={["h2h", "m2m"]} loading={metrics.loading} />
      </div>
      <WarehouseTable />
    </>
  );
}
