"use client";

import { Card, Tooltip, Typography } from "antd";
import type { DonutSegment } from "../types";
import styles from "../dashboard.module.css";

const { Title } = Typography;

const RADIUS = 46;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const numberFormat = new Intl.NumberFormat("vi-VN");
const percentFormat = new Intl.NumberFormat("vi-VN", { style: "percent", maximumFractionDigits: 1 });

type DonutChartCardProps = {
  title: string;
  segments: DonutSegment[];
  unit: string;
  centerLabel: string;
  centerKeys: string[];
};

export function DonutChartCard({ title, segments, unit, centerLabel, centerKeys }: DonutChartCardProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const centerValue = segments.filter((segment) => centerKeys.includes(segment.key)).reduce((sum, segment) => sum + segment.value, 0);
  const arcs = segments.reduce<{ segment: DonutSegment; length: number; offset: number }[]>((list, segment) => {
    const previous = list.at(-1);
    const offset = previous ? previous.offset + previous.length : 0;
    return [...list, { segment, length: total ? (segment.value / total) * CIRCUMFERENCE : 0, offset }];
  }, []);

  return (
    <Card className={styles.chartCard}>
      <Title level={4}>{title}</Title>
      <div className={styles.donutBody}>
        <div className={styles.donut}>
          <svg viewBox="0 0 120 120" role="img" aria-label={`Biểu đồ ${title.toLowerCase()}`}>
            <g transform="rotate(-90 60 60)">
              {arcs.map(({ segment, length, offset }) => (
                <Tooltip key={segment.key} title={`${segment.label}: ${numberFormat.format(segment.value)} ${unit}`}>
                  <circle
                    className={styles.donutArc}
                    cx="60"
                    cy="60"
                    r={RADIUS}
                    stroke={segment.color}
                    strokeDasharray={`${length} ${CIRCUMFERENCE - length}`}
                    strokeDashoffset={-offset}
                  />
                </Tooltip>
              ))}
            </g>
          </svg>
          <div className={styles.donutCenter}>
            <strong>{total ? percentFormat.format(centerValue / total) : "0%"}</strong>
            <span>{centerLabel}</span>
          </div>
        </div>
        <ul className={styles.donutLegend}>
          {segments.map((segment) => (
            <li key={segment.key}>
              <span className={styles.legend}><i style={{ background: segment.color }} />{segment.label}</span>
              <span className={styles.donutLegendValue}>
                {numberFormat.format(segment.value)} {unit}
                <em>{total ? percentFormat.format(segment.value / total) : "0%"}</em>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
