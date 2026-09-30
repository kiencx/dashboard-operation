import type { PropsWithChildren } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return <DashboardShell>{children}</DashboardShell>;
}
