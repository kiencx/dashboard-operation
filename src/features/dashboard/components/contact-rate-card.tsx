"use client";

import { Card, Progress, Typography } from "antd";
import type { ContactRate } from "../types";
import styles from "../dashboard.module.css";

const { Text, Title } = Typography;

const toneColor: Record<ContactRate["tone"], string> = {
  positive: "#10b981",
  warning: "#f5c400",
};

export function ContactRateCard({ data }: { data: ContactRate[] }) {
  return (
    <Card className={styles.breakdownCard}>
      <Title level={4}>Tỷ lệ nhận Call/Chat</Title>
      <div className={styles.rateGaugeList}>
        {data.map((item) => (
          <div className={styles.rateGauge} key={item.channel}>
            <Progress
              type="dashboard"
              percent={item.rate}
              gapDegree={180}
              gapPlacement="bottom"
              size={190}
              strokeWidth={9}
              strokeColor={toneColor[item.tone]}
              railColor="#e5e7eb"
              format={(percent) => <span className={styles.rateGaugeValue}><strong>{percent}%</strong><Text type="secondary">{item.channel}</Text></span>}
            />
            <Text type="secondary" className={styles.rateGaugeCaption}>
              <span className={styles.detailDot} style={{ color: toneColor[item.tone] }} aria-hidden />
              Nhỡ {100 - item.rate}% ~ {item.missedCount} {item.missedUnit}
            </Text>
          </div>
        ))}
      </div>
    </Card>
  );
}
