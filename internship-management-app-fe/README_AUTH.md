# Hệ thống Authentication Đơn giản

## Cách hoạt động

### 1. AuthProvider

- Bảo vệ toàn bộ ứng dụng
- Cho phép truy cập `/` và `/login` mà không cần đăng nhập
- Tự động redirect người dùng đã đăng nhập về dashboard tương ứng khi vào trang chính
- **Chỉ xử lý authentication, không xử lý role protection**

### 2. RoleGuard

- Bảo vệ các route theo role cụ thể
- Hiển thị trang "Access Denied" khi không có quyền truy cập
- Sử dụng trong các layout của từng role

### 3. Route Protection

- **Admin routes** (`/admin/*`): Chỉ admin mới truy cập được
- **Mentor routes** (`/mentor/*`): Chỉ mentor mới truy cập được
- **Intern routes** (`/intern/*`): Chỉ intern mới truy cập được
- **Shared routes** (`/shared/*`, `/profile/*`): Tất cả role đã đăng nhập đều truy cập được

### 4. Redirect Logic

- **Chưa đăng nhập**: Redirect về `/login`
- **Đã đăng nhập vào trang chính**: Redirect về dashboard tương ứng
- **Không có quyền**: Hiển thị trang "Access Denied" với nút "Go Back to Dashboard"

### 5. Flow

1. Người dùng truy cập trang
2. AuthProvider kiểm tra authentication
3. Nếu chưa đăng nhập → redirect `/login`
4. Nếu đã đăng nhập → RoleGuard kiểm tra role
5. Nếu không có quyền → hiển thị "Access Denied"
6. Nếu có quyền → hiển thị nội dung

## Cấu trúc thư mục

```
src/app/
├── (auth)/login/          # Trang đăng nhập
├── (protected)/           # Các trang cần đăng nhập
│   ├── (admin-only)/      # Chỉ admin - hiển thị Access Denied nếu không phải admin
│   ├── (mentor-only)/     # Chỉ mentor - hiển thị Access Denied nếu không phải mentor
│   ├── (intern-only)/     # Chỉ intern - hiển thị Access Denied nếu không phải intern
│   ├── (shared)/          # Tất cả role
│   └── profile/           # Tất cả role
└── page.tsx               # Trang chính (public)
```

## Sử dụng

- Không cần thêm gì, AuthProvider đã được tích hợp trong root layout
- RoleGuard tự động bảo vệ các route theo role
- Khi không có quyền, hiển thị trang "Access Denied" thay vì redirect
- Loading state được hiển thị trong quá trình kiểm tra

## Ví dụ

- **Admin đăng nhập vào `/mentor/dashboard`**: Hiển thị "Access Denied"
- **Mentor đăng nhập vào `/admin/dashboard`**: Hiển thị "Access Denied"
- **Intern đăng nhập vào `/admin/dashboard`**: Hiển thị "Access Denied"
- **Admin đăng nhập vào `/admin/dashboard`**: Hiển thị nội dung bình thường
