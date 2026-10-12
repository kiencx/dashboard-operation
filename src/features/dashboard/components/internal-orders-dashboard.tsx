"use client";

import { Card, Table, Tag, Typography } from "antd";
import type { TableProps } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import type { InternalOrderDetail, InternalOrderDetailType, InternalOrderMetrics, OffsetPage, PackageCount, PeriodFilter } from "../api/types";
import { getPagination, useApi } from "../api/use-api";
import { EMPTY_VALUE, formatCount, formatCurrency } from "../format";
import type { OverviewMetric } from "../types";
import styles from "../dashboard.module.css";
import { ApiErrorAlert } from "./api-error-alert";
import { BuVolumeChart } from "./bu-volume-chart";
import { DateRangeFilter, DEFAULT_PERIOD } from "./date-range-filter";
import { OverviewMetricCard } from "./overview-metric-card";
import { PageHeading } from "./page-heading";

const { Text } = Typography;

const PAGE_SIZE = 10;
const detailTypes: Record<InternalOrderDetailType, { label: string; color: string }> = {
  package_on_demand: { label: "Gói cước", color: "blue" },
  sim_registered: { label: "Cấp SIM mới", color: "purple" },
  topup: { label: "Topup", color: "orange" },
};

const columns: TableProps<InternalOrderDetail>["columns"] = [
  { title: "NGÀY", dataIndex: "date", width: 120, render: (value: string) => dayjs(value).format("DD/MM/YYYY") },
  { title: "SỐ THUÊ BAO", dataIndex: "isdn", width: 150, render: (value: string | null) => <Text strong>{value ?? EMPTY_VALUE}</Text> },
  { title: "ĐƠN VỊ (BU)", dataIndex: "customerBusinessName", width: 180, render: (value: string | null) => value ?? <Text type="secondary">Chưa ghi BU</Text> },
  {
    title: "LOẠI ĐƠN",
    dataIndex: "type",
    width: 140,
    render: (value: InternalOrderDetailType) => <Tag color={detailTypes[value]?.color}>{detailTypes[value]?.label ?? value}</Tag>,
  },
  {
    title: "GÓI / SỐ TIỀN NẠP",
    dataIndex: "item",
    width: 160,
    render: (value: string | null, row) => (row.type === "topup" && value && !Number.isNaN(Number(value)) ? formatCurrency(Number(value)) : value ?? EMPTY_VALUE),
  },
  { title: "THAO TÁC", dataIndex: "actionType", width: 130, render: (value: string | null) => value ?? EMPTY_VALUE },
];

const packageDetails = (items: PackageCount[], unit: string) => items.map((item) => ({ label: item.package, change: `${formatCount(item.total)} ${unit}` }));

function buildMetrics(data?: InternalOrderMetrics): OverviewMetric[] {
  const otherSims = data ? data.newSims.total - data.newSims.items.reduce((sum, item) => sum + item.total, 0) : 0;
  return [
    {
      title: "Tổng đơn CBNV",
      value: formatCount(data?.totalOrders),
      unit: "đơn",
      icon: "orders",
      tone: "blue",
      details: data
        ? [
            { label: "Gói cước gia hạn", change: formatCount(data.packageRenewals.total) },
            { label: "SIM mới cấp", change: formatCount(data.newSims.total) },
          ]
        : [],
    },
    {
      title: "Gói cước gia hạn",
      value: formatCount(data?.packageRenewals.total),
      unit: "gói",
      icon: "renewal",
      tone: "violet",
      details: data ? packageDetails(data.packageRenewals.items, "gói") : [],
    },
    {
      title: "SIM mới cấp cho CBNV",
      value: formatCount(data?.newSims.total),
      unit: "SIM",
      icon: "sim",
      tone: "cyan",
      details: data ? [...packageDetails(data.newSims.items, "SIM"), ...(otherSims > 0 ? [{ label: "Gói khác", change: `${formatCount(otherSims)} SIM` }] : [])] : [],
    },
    {
      title: "Đơn Topup",
      value: formatCount(data?.topup.totalOrder),
      unit: "đơn",
      icon: "topup",
      tone: "orange",
      details: data ? [{ label: "Tổng giá trị nạp", change: formatCurrency(data.topup.totalRevenue) }] : [],
    },
  ];
}

function InternalOrderTable({ filter }: { filter: PeriodFilter }) {
  const [page, setPage] = useState(1);
  const { data, error, loading } = useApi<OffsetPage<InternalOrderDetail>>("operations/internal-orders/details", { ...filter, page, limit: PAGE_SIZE });
  const rows = (data?.data ?? []).map((row, index) => ({ ...row, key: `${data?.page}-${index}` }));

  return (
    <Card className={styles.tableCard} title="Chi tiết đơn hàng">
      <Table
        columns={columns}
        dataSource={rows}
        loading={loading}
        locale={error ? { emptyText: error.message } : undefined}
        pagination={getPagination(data?.total, page, PAGE_SIZE, setPage)}
        scroll={{ x: 880 }}
      />
    </Card>
  );
}

export function InternalOrdersDashboard() {
  const [filter, setFilter] = useState<PeriodFilter>({ period: DEFAULT_PERIOD });
  const metrics = useApi<InternalOrderMetrics>("operations/internal-orders/metrics", filter);
  const filterKey = JSON.stringify(filter);

  return (
    <>
      <PageHeading title="Đơn nội bộ" extra={<DateRangeFilter onChange={setFilter} />} />
      <ApiErrorAlert errors={[metrics.error]} />
      <section className={styles.statsGrid} aria-label="KPI đơn nội bộ">
        {buildMetrics(metrics.data).map((metric) => <OverviewMetricCard key={metric.title} metric={metric} loading={metrics.loading} />)}
      </section>
      <div className={styles.wideChart}>
        <BuVolumeChart filter={filter} />
      </div>
      {/* Đổi bộ lọc thì quay về trang 1. */}
      <InternalOrderTable key={filterKey} filter={filter} />
    </>
  );
}
