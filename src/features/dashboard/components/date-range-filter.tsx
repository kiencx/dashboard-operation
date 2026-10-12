"use client";

import { DatePicker, Flex, Grid, Select } from "antd";
import type { Dayjs } from "dayjs";
import { useState } from "react";
import type { Period, PeriodFilter } from "../api/types";
import styles from "../dashboard.module.css";

const { RangePicker } = DatePicker;
const DATE_FORMAT = "DD/MM/YYYY";
const API_DATE_FORMAT = "YYYY-MM-DD";
const CUSTOM_PERIOD: Period = 5;

/** Kỳ mặc định khi mới vào mọi màn: hôm nay. */
export const DEFAULT_PERIOD = 1;

type DateRange = [Dayjs | null, Dayjs | null];

const periodOptions: { label: string; value: Period }[] = [
  { label: "Hôm nay", value: 1 },
  { label: "Tuần này", value: 2 },
  { label: "Tháng này", value: 3 },
  { label: "Năm nay", value: 4 },
  { label: "Tuỳ chọn", value: CUSTOM_PERIOD },
];

const isFuture = (date: Dayjs) => date.isAfter(new Date(), "day");

export function DateRangeFilter({ onChange }: { onChange?: (filter: PeriodFilter) => void }) {
  const screens = Grid.useBreakpoint();
  const [period, setPeriod] = useState<Period>(DEFAULT_PERIOD);
  const [range, setRange] = useState<DateRange>([null, null]);
  const [start, end] = range;

  const handlePeriodChange = (value: Period) => {
    setPeriod(value);
    if (value !== CUSTOM_PERIOD) onChange?.({ period: value });
    else if (start && end) onChange?.({ period: value, fromDate: start.format(API_DATE_FORMAT), toDate: end.format(API_DATE_FORMAT) });
  };

  // Chỉ gửi bộ lọc tuỳ chọn khi đã đủ hai đầu khoảng ngày.
  const handleRangeChange = (value: DateRange) => {
    setRange(value);
    const [from, to] = value;
    if (from && to) onChange?.({ period: CUSTOM_PERIOD, fromDate: from.format(API_DATE_FORMAT), toDate: to.format(API_DATE_FORMAT) });
  };

  const periodSelect = (
    <Select className={styles.periodSelect} value={period} onChange={handlePeriodChange} options={periodOptions} aria-label="Chọn kỳ thống kê" />
  );

  if (period !== CUSTOM_PERIOD) return periodSelect;

  // RangePicker luôn hiện hai tháng cạnh nhau, không vừa màn hình hẹp.
  if (screens.md === false) {
    return (
      <Flex gap={8} wrap className={styles.dateRangeMobile}>
        {periodSelect}
        <DatePicker
          placeholder="Từ ngày"
          format={DATE_FORMAT}
          value={start}
          onChange={(value) => handleRangeChange([value, end && value && end.isBefore(value, "day") ? null : end])}
          disabledDate={isFuture}
          inputReadOnly
        />
        <DatePicker
          placeholder="Đến ngày"
          format={DATE_FORMAT}
          value={end}
          onChange={(value) => handleRangeChange([start, value])}
          disabledDate={(date) => isFuture(date) || (!!start && date.isBefore(start, "day"))}
          placement="bottomRight"
          inputReadOnly
        />
      </Flex>
    );
  }

  return (
    <Flex gap={8}>
      {periodSelect}
      <RangePicker
        placeholder={["Từ ngày", "Đến ngày"]}
        format={DATE_FORMAT}
        value={range}
        onChange={(value) => handleRangeChange(value ?? [null, null])}
        disabledDate={isFuture}
        allowClear={false}
      />
    </Flex>
  );
}
