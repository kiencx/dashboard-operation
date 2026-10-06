"use client";

import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Modal, Table, Tooltip, Typography } from "antd";
import type { TableProps } from "antd";
import { useState } from "react";
import { aiReports } from "../data";
import type { AiReport } from "../types";
import styles from "../dashboard.module.css";

const { Text } = Typography;

const MOCK_REFRESH_DELAY = 800;

export function AiReportCard() {
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState<AiReport | null>(null);

  const handleRefresh = () => {
    setRefreshing(true);
    window.setTimeout(() => setRefreshing(false), MOCK_REFRESH_DELAY);
  };

  const columns: TableProps<AiReport>["columns"] = [
    { title: "MẢNG", dataIndex: "area", width: 110, render: (value) => <Text strong>{value}</Text> },
    {
      title: "HẠNG MỤC",
      dataIndex: "item",
      width: 200,
      render: (_, row) => (
        <div className={styles.productCell}>
          <Text strong>{row.group}</Text>
          <Text type="secondary">{row.item}</Text>
        </div>
      ),
    },
    { title: "MÔ TẢ NGẮN NỘI DUNG", dataIndex: "summary", width: 380 },
    {
      title: "THAO TÁC",
      key: "action",
      width: 120,
      render: (_, row) => <Button size="small" icon={<EyeOutlined />} onClick={() => setSelected(row)}>Chi tiết</Button>,
    },
  ];

  return (
    <Card
      className={styles.tableCard}
      title={
        <span className={styles.cardTitleWithAction}>
          AI báo cáo
          <Tooltip title="Làm mới">
            <Button type="text" size="small" aria-label="Làm mới" icon={<ReloadOutlined spin={refreshing} />} onClick={handleRefresh} disabled={refreshing} />
          </Tooltip>
        </span>
      }
    >
      <Table rowKey="key" columns={columns} dataSource={aiReports} loading={refreshing} pagination={false} scroll={{ x: 820 }} />
      <Modal open={!!selected} title={selected ? `${selected.group} · ${selected.item}` : undefined} onCancel={() => setSelected(null)} footer={null}>
        {selected && (
          <Descriptions column={1} size="small" items={[
            { key: "area", label: "Mảng", children: selected.area },
            { key: "group", label: "Nhóm", children: selected.group },
            { key: "item", label: "Hạng mục", children: selected.item },
            { key: "summary", label: "Nội dung", children: selected.summary },
          ]} />
        )}
      </Modal>
    </Card>
  );
}
