import type { PropsWithChildren } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { getSessionUser } from "@/features/auth/user";

export default async function DashboardLayout({ children }: PropsWithChildren) {
  return <DashboardShell user={await getSessionUser()}>{children}</DashboardShell>;
}
