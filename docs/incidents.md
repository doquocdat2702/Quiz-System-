# Incident Report

## Incident 1: Backend khong ket noi duoc PostgreSQL/Supabase

-## Incident 4: Kết xuất lỗi phụ trợ
Hiện tượng: Render backend crash.
Layer: L2 Database / External.
Nguyên nhân: dùng Supabase direct connection IPv6. Render chi ho tro Ipv4
Cách fix: đổi DATABASE_URL Supabase direct connection port 5432 sang Transaction Pooler port 6543.
Cách phòng tránh: document DATABASE_URL chuẩn trong .env.example.

## Incident 2: Frontend goi sai Backend API

- Hien tuong: Trang web khong tai duoc danh sach quiz, tab Network bao request failed hoac CORS/network error.
- Layer loi: L4 - Frontend.
- Nguyen nhan: VITE_API_URL bi cau hinh sai trong luc build frontend.
- Cach fix: Khi chay Docker Compose, dung VITE_API_URL=/api de Nginx proxy request den backend noi bo.
- Cach phong tranh: Khong hardcode API URL trong source code, document bien VITE_API_URL trong .env.example, kiem tra lai env truoc khi build image.

## Incident 3: Docker Compose fail vi port host bi chiem

- Hien tuong: docker compose up -d fail voi loi bind port, vi du 8080 da co process khac su dung.
- Layer loi: L1 - Infrastructure.
- Nguyen nhan: Docker Compose dang publish port trung voi service dang chay tren may host.
- Cach fix: Stop process dang giu port hoac doi BACKEND_PORT, FRONTEND_PORT, POSTGRES_PORT trong .env.
- Cach phong tranh: Dung bien moi truong cho port host trong docker-compose.yml thay vi hardcode, kiem tra port truoc buoi demo.
