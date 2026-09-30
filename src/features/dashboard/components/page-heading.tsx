import { Flex, Typography } from "antd";
import type { ReactNode } from "react";
import styles from "../dashboard.module.css";

const { Title } = Typography;

export function PageHeading({ title, extra }: { title: string; extra?: ReactNode }) {
  return (
    <Flex className={styles.pageHeading} justify="space-between" align="center" gap={16} wrap>
      <Title level={2}>{title}</Title>
      {extra}
    </Flex>
  );
}
