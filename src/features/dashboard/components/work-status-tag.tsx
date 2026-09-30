import { Tag } from "antd";
import type { WorkStatus } from "../types";

const statusColor: Record<WorkStatus, string> = { "Hoàn thành": "success", "Đang xử lý": "processing", "Trễ hạn": "error" };

export function WorkStatusTag({ status }: { status: WorkStatus }) {
  return <Tag color={statusColor[status]}>{status}</Tag>;
}
