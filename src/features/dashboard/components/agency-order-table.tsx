"use client";

import { Card, Table, Typography } from "antd";
import type { TableProps } from "antd";
import type { AgencyOrderCount } from "../types";
import styles from "../dashboard.module.css";

const { Text } = Typography;

const numberFormat = new Intl.NumberFormat("vi-VN");

const columns: TableProps<AgencyOrderCount>["columns"] = [
  { title: "ĐẠI LÝ", dataIndex: "agency" },
  {
    title: "SỐ LƯỢNG ĐƠN",
    dataIndex: "orders",
    align: "right",
    width: 150,
    defaultSortOrder: "descend",
    sorter: (a, b) => a.orders - b.orders,
    render: (value: number) => numberFormat.format(value),
  },
];

type AgencyOrderTableProps = {
  title: string;
  data: AgencyOrderCount[];
};

export function AgencyOrderTable({ title, data }: AgencyOrderTableProps) {
  const total = data.reduce((sum, row) => sum + row.orders, 0);

  return (
    <Card className={styles.tableCard} title={title}>
      <Table
        rowKey="agency"
        size="middle"
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: 330 }}
        showSorterTooltip={false}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}><Text strong>Tổng</Text></Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right"><Text strong>{numberFormat.format(total)}</Text></Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
    </Card>
  );
}
