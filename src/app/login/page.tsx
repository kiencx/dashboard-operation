import type { Metadata } from "next";
import { LoginForm, REDIRECT_PARAM } from "@/features/auth";

export const metadata: Metadata = {
  title: "Đăng nhập | Nova Dashboard",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const redirectTo = (await searchParams)[REDIRECT_PARAM];
  return <LoginForm redirectTo={typeof redirectTo === "string" ? redirectTo : undefined} />;
}
