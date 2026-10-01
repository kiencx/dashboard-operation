"use client";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Typography } from "antd";
import Image from "next/image";
import { useTransition } from "react";
import { login } from "../actions";
import styles from "../login.module.css";

const { Title, Text, Link } = Typography;

type LoginValues = {
  username: string;
  password: string;
  remember: boolean;
};

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [submitting, startTransition] = useTransition();

  const handleFinish = ({ username, remember }: LoginValues) => {
    startTransition(() => login({ username, remember, redirectTo }));
  };

  return (
    <main className={styles.page}>
      <section className={styles.formPanel}>
        <Image src="/images/skyfi-logo.png" alt="SkyFi" width={4237} height={1294} preload className={styles.logo} />
        <div className={styles.formBox}>
          <header className={styles.formHeader}>
            <Title level={3} className={styles.formTitle}>Đăng nhập Nova Dashboard</Title>
            <Text type="secondary">Sử dụng tài khoản nội bộ để truy cập.</Text>
          </header>

          <Form<LoginValues>
            layout="vertical"
            requiredMark={false}
            initialValues={{ remember: true }}
            onFinish={handleFinish}
            disabled={submitting}
          >
            <Form.Item label="Tên đăng nhập" name="username" rules={[{ required: true, whitespace: true, message: "Vui lòng nhập tên đăng nhập" }]}>
              <Input size="large" prefix={<UserOutlined />} placeholder="Nhập tên đăng nhập" autoComplete="username" autoFocus />
            </Form.Item>
            <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}>
              <Input.Password size="large" prefix={<LockOutlined />} placeholder="Nhập mật khẩu" autoComplete="current-password" />
            </Form.Item>
            <div className={styles.formOptions}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Ghi nhớ đăng nhập</Checkbox>
              </Form.Item>
              <Link>Quên mật khẩu?</Link>
            </div>
            <Button type="primary" htmlType="submit" size="large" block loading={submitting}>
              Đăng nhập
            </Button>
          </Form>
        </div>
        <Text type="secondary" className={styles.footer}>© SkyFi · Galaxy Telecom</Text>
      </section>
    </main>
  );
}
