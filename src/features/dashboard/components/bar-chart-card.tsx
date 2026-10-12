"use client";

import { Card, Empty, Space, Tooltip, Typography } from "antd";
import type { CSSProperties, ReactNode } from "react";
import type { BarDatum, BarSeries } from "../types";
import styles from "../dashboard.module.css";

const { Title } = Typography;

const numberFormat = new Intl.NumberFormat("vi-VN");

/** Bước trục Y "tròn" (1, 2, 2.5, 5 × 10ⁿ) để có khoảng `tickCount` vạch. */
function getNiceStep(maxValue: number, integerOnly: boolean, tickCount = 4) {
  if (maxValue <= 0) return 1;
  const raw = maxValue / tickCount;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((factor) => factor * magnitude).find((value) => value >= raw) ?? raw;
  return integerOnly ? Math.max(1, Math.ceil(step)) : step;
}

type BarChartCardProps = {
  title: string;
  series: BarSeries[];
  data: BarDatum[];
  extra?: ReactNode;
  emptyText?: string;
  loading?: boolean;
  unit?: string;
  stacked?: boolean;
  /** Bỏ trống để tự tính theo dữ liệu. */
  yStep?: number;
};

export function BarChartCard({ title, series, data, extra, emptyText = "Không có dữ liệu", loading = false, unit, stacked = false, yStep }: BarChartCardProps) {
  const groupValues = data.map((item) => series.map((s) => item.values[s.key] ?? 0));
  // Giá trị âm (vd gói huỷ nhiều hơn gia hạn) vẫn hiện trong tooltip nhưng cột cao 0.
  const groupHeights = groupValues.map((values) => values.map((value) => Math.max(0, value)));
  const maxValue = Math.max(0, ...groupHeights.map((values) => (stacked ? values.reduce((sum, value) => sum + value, 0) : Math.max(...values))));
  const step = yStep ?? getNiceStep(maxValue, groupValues.flat().every(Number.isInteger));
  const tickCount = Math.max(1, Math.ceil(maxValue / step));
  const yMax = tickCount * step;
  const yTicks = Array.from({ length: tickCount + 1 }, (_, index) => yMax - index * step);
  const formatTooltip = (label: string, seriesLabel: string, value: number) => `${label} · ${seriesLabel}: ${numberFormat.format(value)}${unit ? ` ${unit}` : ""}`;

  return (
    <Card className={styles.chartCard} loading={loading}>
      <div className={styles.chartHeader}>
        <Title level={4}>{title}</Title>
        {extra && <div className={styles.chartControls}>{extra}</div>}
      </div>
      {data.length === 0 ? (
        <Empty className={styles.chartEmpty} image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyText} />
      ) : (
        <div className={`${styles.barChart} ${series.length === 1 ? styles.barChartSingle : ""}`} role="img" aria-label={`Biểu đồ ${title.toLowerCase()}`}>
          <div className={styles.barYAxis}>{yTicks.map((tick) => <span key={tick}>{numberFormat.format(tick)}</span>)}</div>
          <div className={styles.barScroll}>
            <div className={styles.barScrollInner} style={{ "--group-count": data.length } as CSSProperties}>
              <div className={styles.barPlot} style={{ "--grid-step": `${100 / (yTicks.length - 1)}%` } as CSSProperties}>
                {data.map((item, groupIndex) => (
                  <div className={styles.barGroup} key={item.label}>
                    {stacked ? (
                      <div className={styles.barStack} style={{ height: `${(groupHeights[groupIndex].reduce((sum, value) => sum + value, 0) / yMax) * 100}%` }}>
                        {series.map((s, index) => {
                          const value = groupHeights[groupIndex][index];
                          return value > 0 && (
                            <Tooltip key={s.key} title={formatTooltip(item.label, s.label, value)}>
                              <div className={styles.barSegment} style={{ flexGrow: value, background: s.color }} />
                            </Tooltip>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={styles.barPair}>
                        {series.map((s, index) => (
                          <Tooltip key={s.key} title={formatTooltip(item.label, s.label, groupValues[groupIndex][index])}>
                            <div className={styles.bar} style={{ height: `${(groupHeights[groupIndex][index] / yMax) * 100}%`, background: s.color }} />
                          </Tooltip>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className={styles.barXAxis}>{data.map((item) => <span key={item.label}>{item.label}</span>)}</div>
            </div>
          </div>
        </div>
      )}
      {series.length > 1 && data.length > 0 && (
        <div className={styles.barLegend}>
          <Space size={20} wrap>{series.map((s) => <span className={styles.legend} key={s.key}><i style={{ background: s.color }} />{s.label}</span>)}</Space>
        </div>
      )}
    </Card>
  );
}
