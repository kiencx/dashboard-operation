import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Flex, Statistic } from "antd";
import type { DetailTone, OverviewMetric, OverviewMetricDetail } from "../types";
import styles from "../dashboard.module.css";
import { metricIcons } from "./metric-card";

const toneClass: Record<DetailTone, string> = {
  positive: styles.detailPositive,
  negative: styles.detailNegative,
  warning: styles.detailWarning,
};

function DetailChange({ change, trend, tone }: Pick<OverviewMetricDetail, "change" | "trend" | "tone">) {
  if (!trend) return <span className={`${styles.detailChange} ${tone ? toneClass[tone] : styles.detailValue}`}>{change}</span>;

  return (
    <span className={`${styles.detailChange} ${trend === "down" ? styles.detailNegative : styles.detailPositive}`}>
      {trend === "down" ? <ArrowDownOutlined aria-label="Giảm" /> : <ArrowUpOutlined aria-label="Tăng" />} {change}
    </span>
  );
}

export function OverviewMetricCard({ metric }: { metric: OverviewMetric }) {
  return (
    <Card className={styles.statCard}>
      <Flex justify="space-between" align="flex-start">
        <Statistic className={styles.overviewStatistic} title={metric.title} value={metric.value} suffix={metric.unit} />
        <span className={`${styles.statIcon} ${styles[metric.tone]}`}>{metricIcons[metric.icon]}</span>
      </Flex>
      <ul className={styles.detailList}>
        {metric.details.map((detail) => (
          <li key={detail.label} className={styles.detailMuted}>
            {detail.dot && <span className={`${styles.detailDot} ${toneClass[detail.dot]}`} aria-hidden />}
            <span>{detail.label}</span>
            {detail.change && <DetailChange change={detail.change} trend={detail.trend} tone={detail.tone} />}
          </li>
        ))}
      </ul>
    </Card>
  );
}
