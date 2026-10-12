"use client";

import { Card, Table, Typography } from "antd";
import type { TableProps } from "antd";
import { useState } from "react";
import type { CompanyOrderCount, OffsetPage, PeriodFilter } from "../api/types";
import { getPagination, useApi } from "../api/use-api";
import { formatCount } from "../format";
import styles from "../dashboard.module.css";

const { Text } = Typography;

const PAGE_SIZE = 10;

const columns: TableProps<CompanyOrderCount>["columns"] = [
  { title: "ĐẠI LÝ", dataIndex: "companyName", render: (value: string | null) => value ?? <Text type="secondary">Không ghi đại lý</Text> },
  { title: "SỐ LƯỢNG ĐƠN", dataIndex: "orderCount", align: "right", width: 150, render: (value: number) => formatCount(value) },
];

type AgencyOrderTableProps = {
  title: string;
  path: string;
  filter: PeriodFilter;
  /** Tổng đơn của mọi đại lý, lấy từ API metrics. */
  total?: number;
};

export function AgencyOrderTable({ title, path, filter, total }: AgencyOrderTableProps) {
  const [page, setPage] = useState(1);
  const { data, error, loading } = useApi<OffsetPage<CompanyOrderCount>>(path, { ...filter, page, limit: PAGE_SIZE });

  return (
    <Card className={styles.tableCard} title={title} extra={data && <Text type="secondary">{formatCount(data.total)} đại lý</Text>}>
      <Table
        rowKey={(row) => row.companyName ?? ""}
        size="middle"
        columns={columns}
        dataSource={data?.data}
        loading={loading}
        locale={error ? { emptyText: error.message } : undefined}
        pagination={{ ...getPagination(data?.total, page, PAGE_SIZE, setPage), hideOnSinglePage: true, showTotal: undefined }}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}><Text strong>Tổng</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right"><Text strong>{formatCount(total)}</Text></Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
}
