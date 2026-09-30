import { Card, Flex, Space, Typography } from "antd";
import styles from "../dashboard.module.css";

const { Text, Title } = Typography;

type TrendSeries = { label: string; color: string; points: string };
type TrendChartProps = { title: string; subtitle: string; series: TrendSeries[]; value?: string; yLabels?: string[] };

export function TrendChart({ title, subtitle, series, value, yLabels = ["100%", "75%", "50%", "25%", "0"] }: TrendChartProps) {
  return (
    <Card className={styles.chartCard}>
      <Flex justify="space-between" align="flex-start" gap={16} wrap>
        <div><Title level={4}>{title}</Title><Text type="secondary">{subtitle}</Text></div>
        <Space wrap>{series.map((item) => <span className={styles.legend} key={item.label}><i style={{ background: item.color }} />{item.label}</span>)}</Space>
      </Flex>
      {value && <div className={styles.chartValue}>{value}</div>}
      <div className={styles.chart} role="img" aria-label={title}>
        <div className={styles.yLabels}>{yLabels.map((label) => <span key={label}>{label}</span>)}</div>
        <svg viewBox="0 0 630 190" preserveAspectRatio="none" aria-hidden="true">
          {series.map((item) => <polyline key={item.label} points={item.points} fill="none" stroke={item.color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />)}
        </svg>
        <div className={styles.xLabels}><span>01/09</span><span>08/09</span><span>15/09</span><span>22/09</span><span>30/09</span></div>
      </div>
    </Card>
  );
}
