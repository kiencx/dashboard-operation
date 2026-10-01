"use client";

import {
  AppstoreOutlined,
  AuditOutlined,
  BellOutlined,
  CustomerServiceOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  FileTextOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Avatar, Badge, Button, Dropdown, Flex, Layout, Menu, Space, Tooltip } from "antd";
import type { MenuProps } from "antd";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { useState } from "react";
import { logout } from "@/features/auth/actions";
import styles from "./dashboard-shell.module.css";

const { Header, Content, Sider } = Layout;
const OPERATIONS_KEY = "/operations";

const navigationItems: MenuProps["items"] = [
  { key: "/", icon: <AppstoreOutlined />, label: <Link href="/">Tổng quan</Link> },
  {
    key: OPERATIONS_KEY,
    icon: <ShoppingCartOutlined />,
    label: "Vận hành",
    children: [
      { key: "/operations/internal-orders", label: <Link href="/operations/internal-orders">Đơn nội bộ</Link> },
      { key: "/operations/online-orders", label: <Link href="/operations/online-orders">Đơn online</Link> },
      { key: "/operations/agency-orders", label: <Link href="/operations/agency-orders">Đơn đại lý</Link> },
      { key: "/operations/inventory", label: <Link href="/operations/inventory">Kho</Link> },
    ],
  },
  { key: "/reconciliation", icon: <AuditOutlined />, label: <Link href="/reconciliation">Đối soát</Link> },
  { key: "/customer-care", icon: <CustomerServiceOutlined />, label: <Link href="/customer-care">Chăm sóc khách hàng</Link> },
  { key: "/document-forum", icon: <FileTextOutlined />, label: <Link href="/document-forum">Forum tài liệu</Link> },
];

const profileMenuItems: MenuProps["items"] = [
  { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất", danger: true },
];

export function DashboardShell({ children }: PropsWithChildren) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  return (
    <Layout className={styles.shell}>
      <Sider
        className={styles.sider}
        width={248}
        collapsedWidth={80}
        collapsed={collapsed}
        breakpoint="lg"
        onBreakpoint={setCollapsed}
        trigger={null}
      >
        <div className={styles.siderInner}>
          <div className={styles.brand}>
            <Image
              src="/images/skyfi-logo.png"
              alt="SkyFi"
              width={4237}
              height={1294}
              preload
              className={collapsed ? styles.brandLogoCollapsed : styles.brandLogo}
            />
          </div>

          <Menu
            mode="inline"
            selectedKeys={[pathname]}
            defaultOpenKeys={pathname.startsWith(OPERATIONS_KEY) ? [OPERATIONS_KEY] : []}
            className={styles.menu}
            items={navigationItems}
          />

          <div className={styles.siderFooter}>
            <Tooltip title={collapsed ? "Mở rộng menu" : undefined} placement="right">
              <Button
                type="text"
                block
                className={styles.collapseButton}
                aria-label={collapsed ? "Mở rộng menu" : "Thu gọn menu"}
                icon={collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
                onClick={() => setCollapsed((value) => !value)}
              >
                {!collapsed && "Thu gọn menu"}
              </Button>
            </Tooltip>
          </div>
        </div>
      </Sider>

      <Layout className={styles.mainLayout}>
        <Header className={styles.header}>
          <Flex align="center" justify="flex-end" gap={16}>
            <Space size={16}>
              <Badge dot>
                <Button className={styles.headerAction} type="text" aria-label="Thông báo" icon={<BellOutlined />} />
              </Badge>
              <Dropdown menu={{ items: profileMenuItems, onClick: ({ key }) => key === "logout" && logout() }} trigger={["click"]} placement="bottomRight">
                <button type="button" className={styles.profile} aria-label="Tài khoản">
                  <Avatar className={styles.profileAvatar}>VH</Avatar>
                  <div className={styles.profileText}>
                    <span className={styles.profileName}>Quản lý vận hành</span>
                    <span className={styles.profileRole}>Toàn quyền xem</span>
                  </div>
                </button>
              </Dropdown>
            </Space>
          </Flex>
        </Header>

        <Content className={styles.contentScroll}>
          <div className={styles.contentInner}>{children}</div>
        </Content>
      </Layout>
    </Layout>
  );
}
