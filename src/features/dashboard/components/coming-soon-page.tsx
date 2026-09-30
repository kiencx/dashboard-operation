"use client";

import { Card, Empty } from "antd";
import { PageHeading } from "./page-heading";

export function ComingSoonPage({ title }: { title: string }) {
  return (
    <>
      <PageHeading title={title} />
      <Card>
        <Empty description="Màn hình đang được xây dựng" />
      </Card>
    </>
  );
}
