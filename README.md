# Nova Dashboard

Dashboard mẫu sử dụng Next.js App Router, TypeScript và Ant Design.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Màn hình mock theo BRD

| Route | Màn hình | Nội dung chính |
| --- | --- | --- |
| `/` | Tổng quan | KPI toàn khối, xu hướng ba mảng, cơ cấu tác vụ và cảnh báo |
| `/operations` | Vận hành | Đơn nội bộ, Online, Đại lý, tồn kho và đơn tồn đọng |
| `/reconciliation` | Đối soát | Phiên đến hạn, chênh lệch, tiến độ và trạng thái đối tác |
| `/customer-care` | Chăm sóc khách hàng | Call, Chat, Answered/Missed rate, AHT, ASA, FCR và CSAT |

Toàn bộ dữ liệu hiện tại là dữ liệu mock để xác nhận UI/UX. Các bộ lọc và nút xuất báo cáo mới thể hiện trạng thái giao diện, chưa kết nối nguồn dữ liệu.

## Cấu trúc source code

```text
src/
├── app/                         # Routing, metadata và global styles
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/                  # Thành phần dùng chung giữa nhiều feature
│   ├── layout/
│   │   └── dashboard-shell/
│   └── providers/
├── config/                      # Cấu hình ứng dụng, theme, constants toàn cục
└── features/                    # Code được tổ chức theo nghiệp vụ
    └── dashboard/
        ├── components/          # UI chỉ thuộc dashboard
        ├── data.ts              # Dữ liệu mẫu, thay bằng service khi có API
        ├── types.ts             # Kiểu dữ liệu của feature
        ├── dashboard.module.css
        └── index.ts             # Public API của feature
```

## Quy ước phát triển

- Giữ `src/app` mỏng: file route chỉ compose layout và feature.
- Đặt nghiệp vụ mới trong `src/features/<feature-name>`.
- Chỉ đưa component vào `src/components` khi thực sự được dùng bởi nhiều feature.
- Chỉ export public API của feature qua `index.ts`; tránh import sâu từ bên ngoài feature.
- Đặt type sát feature sở hữu dữ liệu. Type dùng chung toàn ứng dụng mới chuyển sang thư mục shared.
- Giữ global CSS cho reset và token toàn cục; dùng CSS Modules cho style của component/feature.
- Đặt provider toàn ứng dụng trong `src/components/providers` và cấu hình tĩnh trong `src/config`.
- Khi tích hợp backend, thêm `services/` hoặc `api/` bên trong feature thay vì tạo tầng abstraction toàn cục quá sớm.

## Kiểm tra chất lượng

```bash
npx tsc --noEmit
npm run lint
npm run build
```
