import { Alert } from "antd";
import styles from "../dashboard.module.css";

/** Báo lỗi tải dữ liệu đầu tiên trong số các request của một màn hình. */
export function ApiErrorAlert({ errors }: { errors: (Error | undefined)[] }) {
  const error = errors.find(Boolean);
  if (!error) return null;
  return <Alert className={styles.pageAlert} type="error" showIcon title="Không tải được dữ liệu" description={error.message} />;
}
