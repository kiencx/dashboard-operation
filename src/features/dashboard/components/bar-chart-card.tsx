"use client";

import { Card, Empty, Space, Tooltip, Typography } from "antd";
import type { CSSProperties, ReactNode } from "react";
import type { BarDatum, BarSeries } from "../types";
import styles from "../dashboard.module.css";

const { Title } = Typography;

const numberFormat = new Intl.NumberFormat("vi-VN");

type BarChartCardProps = {
  title: string;
  series: BarSeries[];
  data: BarDatum[];
  extra?: ReactNode;
  emptyText?: string;
  unit?: string;
  stacked?: boolean;
  yStep?: number;
};

export function BarChartCard({ title, series, data, extra, emptyText = "Không có dữ liệu", unit, stacked = false, yStep = 2500 }: BarChartCardProps) {
  const groupValues = data.map((item) => series.map((s) => item.values[s.key] ?? 0));
  const maxValue = Math.max(0, ...groupValues.map((values) => (stacked ? values.reduce((sum, value) => sum + value, 0) : Math.max(...values))));
  const yMax = Math.max(yStep, Math.ceil(maxValue / yStep) * yStep);
  const yTicks = Array.from({ length: yMax / yStep + 1 }, (_, index) => yMax - index * yStep);
  const formatTooltip = (label: string, seriesLabel: string, value: number) => `${label} · ${seriesLabel}: ${numberFormat.format(value)}${unit ? ` ${unit}` : ""}`;

  return (
    <Card className={styles.chartCard}>
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
                      <div className={styles.barStack} style={{ height: `${(groupValues[groupIndex].reduce((sum, value) => sum + value, 0) / yMax) * 100}%` }}>
                        {series.map((s, index) => {
                          const value = groupValues[groupIndex][index];
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
                            <div className={styles.bar} style={{ height: `${(groupValues[groupIndex][index] / yMax) * 100}%`, background: s.color }} />
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
