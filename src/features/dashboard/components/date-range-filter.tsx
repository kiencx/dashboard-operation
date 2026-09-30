"use client";

import { DatePicker, Flex, Grid } from "antd";
import type { TimeRangePickerProps } from "antd";
import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { useState } from "react";
import styles from "../dashboard.module.css";

const { RangePicker } = DatePicker;
const DATE_FORMAT = "DD/MM/YYYY";

type DateRange = [Dayjs | null, Dayjs | null];

// Dùng hàm để mốc ngày được tính lúc người dùng mở bảng chọn, tránh lệch giữa server và client.
const presets: TimeRangePickerProps["presets"] = [
  { label: "Hôm nay", value: () => [dayjs().startOf("day"), dayjs().endOf("day")] },
  { label: "7 ngày qua", value: () => [dayjs().subtract(6, "day").startOf("day"), dayjs().endOf("day")] },
  { label: "30 ngày qua", value: () => [dayjs().subtract(29, "day").startOf("day"), dayjs().endOf("day")] },
  { label: "Tháng này", value: () => [dayjs().startOf("month"), dayjs().endOf("month")] },
  { label: "Tháng trước", value: () => [dayjs().subtract(1, "month").startOf("month"), dayjs().subtract(1, "month").endOf("month")] },
];

export function DateRangeFilter() {
  const screens = Grid.useBreakpoint();
  const [range, setRange] = useState<DateRange>([null, null]);
  const [start, end] = range;

  // RangePicker luôn hiện hai tháng cạnh nhau, không vừa màn hình hẹp.
  if (screens.md === false) {
    return (
      <Flex gap={8} className={styles.dateRangeMobile}>
        <DatePicker
          placeholder="Từ ngày"
          format={DATE_FORMAT}
          value={start}
          onChange={(value) => setRange([value, end && value && end.isBefore(value, "day") ? null : end])}
          inputReadOnly
        />
        <DatePicker
          placeholder="Đến ngày"
          format={DATE_FORMAT}
          value={end}
          onChange={(value) => setRange([start, value])}
          disabledDate={(date) => !!start && date.isBefore(start, "day")}
          placement="bottomRight"
          inputReadOnly
        />
      </Flex>
    );
  }

  return (
    <RangePicker
      placeholder={["Từ ngày", "Đến ngày"]}
      format={DATE_FORMAT}
      presets={presets}
      value={range}
      onChange={(value) => setRange(value ?? [null, null])}
    />
  );
}
