"use client";

import { Checkbox, Divider, Segmented, Select } from "antd";
import { useState } from "react";
import { buVolumeSeries, internalVolumesByBu } from "../data";
import styles from "../dashboard.module.css";
import { BarChartCard } from "./bar-chart-card";

const buOptions = internalVolumesByBu.map((item) => ({ label: item.label, value: item.label }));
const allBus = buOptions.map((option) => option.value);

export function BuVolumeChart() {
  const [seriesKey, setSeriesKey] = useState(buVolumeSeries[0].key);
  const [selectedBus, setSelectedBus] = useState<string[]>(allBus);

  const activeSeries = buVolumeSeries.filter((s) => s.key === seriesKey);
  const data = internalVolumesByBu.filter((item) => selectedBus.includes(item.label));
  const allChecked = selectedBus.length === allBus.length;

  return (
    <BarChartCard
      title="Số lượng theo BU"
      series={activeSeries}
      data={data}
      emptyText="Chọn ít nhất một BU để xem biểu đồ"
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
            onChange={setSelectedBus}
            options={buOptions}
            maxTagCount="responsive"
            placeholder="Chọn BU"
            aria-label="Chọn đơn vị BU"
            popupRender={(menu) => (
              <>
                <Checkbox
                  className={styles.buSelectAll}
                  checked={allChecked}
                  indeterminate={selectedBus.length > 0 && !allChecked}
                  onChange={(event) => setSelectedBus(event.target.checked ? allBus : [])}
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
