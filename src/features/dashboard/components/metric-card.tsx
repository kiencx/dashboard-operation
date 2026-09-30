import {
  ApiOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  AuditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CustomerServiceOutlined,
  ExportOutlined,
  HourglassOutlined,
  ImportOutlined,
  InboxOutlined,
  MessageOutlined,
  MobileOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
  ShoppingCartOutlined,
  StockOutlined,
  SwapOutlined,
  SyncOutlined,
  ThunderboltOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import { Card, Flex, Statistic, Typography } from "antd";
import type { ReactNode } from "react";
import type { DashboardMetric, MetricIcon } from "../types";
import styles from "../dashboard.module.css";

const { Text } = Typography;

export const metricIcons: Record<MetricIcon, ReactNode> = {
  orders: <ShoppingCartOutlined />,
  audit: <AuditOutlined />,
  service: <CustomerServiceOutlined />,
  sla: <SafetyCertificateOutlined />,
  stock: <StockOutlined />,
  time: <ClockCircleOutlined />,
  difference: <SwapOutlined />,
  chat: <MessageOutlined />,
  renewal: <SyncOutlined />,
  sim: <MobileOutlined />,
  topup: <WalletOutlined />,
  outbound: <ExportOutlined />,
  inbound: <ImportOutlined />,
  kit: <InboxOutlined />,
  api: <ApiOutlined />,
  phone: <PhoneOutlined />,
  queue: <HourglassOutlined />,
  answered: <CheckCircleOutlined />,
  missed: <CloseCircleOutlined />,
  speed: <ThunderboltOutlined />,
};

type MetricCardProps = {
  metric: DashboardMetric;
};

export function MetricCard({ metric }: MetricCardProps) {
  const isPositive = metric.trend === "up";
  const isNeutral = metric.trend === "neutral";

  return (
    <Card className={styles.statCard}>
      <Flex justify="space-between" align="flex-start">
        <Statistic title={metric.title} value={metric.value} />
        <span className={`${styles.statIcon} ${styles[metric.tone]}`}>{metricIcons[metric.icon]}</span>
      </Flex>
      <Text className={isNeutral ? styles.neutral : isPositive ? styles.positive : styles.negative}>
        {isPositive ? <ArrowUpOutlined /> : !isNeutral && <ArrowDownOutlined />} {metric.change}
      </Text>
      <Text type="secondary"> {metric.helper ?? "so với kỳ trước"}</Text>
    </Card>
  );
}
