"use client";

import { Checkbox, Divider, Segmented, Select } from "antd";
import { useState } from "react";
import type { BusinessCount, PeriodFilter } from "../api/types";
import { useApi } from "../api/use-api";
import type { BarSeries } from "../types";
import styles from "../dashboard.module.css";
import { BarChartCard } from "./bar-chart-card";

const UNKNOWN_BU = "Chưa ghi BU";

const buVolumeSeries: (BarSeries & { path: string })[] = [
  { key: "renewal", label: "Gói cước gia hạn", color: "#4f8ef7", path: "operations/internal-orders/package-renewals-by-business" },
  { key: "sim", label: "SIM mới cấp", color: "#8b5cf6", path: "operations/internal-orders/new-sims-by-business" },
];

export function BuVolumeChart({ filter }: { filter: PeriodFilter }) {
  const [seriesKey, setSeriesKey] = useState(buVolumeSeries[0].key);
  // Lưu các BU bị bỏ chọn để BU mới xuất hiện khi đổi kỳ vẫn được hiển thị mặc định.
  const [hiddenBus, setHiddenBus] = useState<string[]>([]);

  const activeSeries = buVolumeSeries.find((s) => s.key === seriesKey) ?? buVolumeSeries[0];
  const { data: rows = [], error, loading } = useApi<BusinessCount[]>(activeSeries.path, filter);

  const allBus = rows.map((row) => row.businessName ?? UNKNOWN_BU);
  const selectedBus = allBus.filter((bu) => !hiddenBus.includes(bu));
  const data = rows
    .map((row) => ({ label: row.businessName ?? UNKNOWN_BU, values: { [activeSeries.key]: row.total } }))
    .filter((item) => selectedBus.includes(item.label));
  const allChecked = selectedBus.length === allBus.length;

  return (
    <BarChartCard
      title="Số lượng theo BU"
      series={[activeSeries]}
      data={data}
      loading={loading}
      emptyText={error?.message ?? (allBus.length === 0 ? "Không có dữ liệu trong kỳ" : "Chọn ít nhất một BU để xem biểu đồ")}
      extra={
        <>
          <Segmented
            value={seriesKey}
            onChange={setSeriesKey}
            options={buVolumeSeries.map((s) => ({ label: s.label, value: s.key }))}
          />
          <Select
            className={styles.buSelect}
            mode="multiple"
            value={selectedBus}
            onChange={(values: string[]) => setHiddenBus(allBus.filter((bu) => !values.includes(bu)))}
            options={allBus.map((bu) => ({ label: bu, value: bu }))}
            maxTagCount="responsive"
            placeholder="Chọn BU"
            aria-label="Chọn đơn vị BU"
            popupRender={(menu) => (
              <>
                <Checkbox
                  className={styles.buSelectAll}
                  checked={allChecked}
                  indeterminate={selectedBus.length > 0 && !allChecked}
                  onChange={(event) => setHiddenBus(event.target.checked ? [] : allBus)}
                >
                  Tất cả BU
                </Checkbox>
                <Divider className={styles.buSelectDivider} />
                {menu}
              </>
            )}
          />
        </>
      }
    />
  );
}
