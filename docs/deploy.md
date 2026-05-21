# Deployment Guide

## Yeu cau

- Docker va Docker Compose.
- Git.
- File `.env` duoc tao tu `.env.example`.

## Thu tu deploy

1. Database MySQL.
2. Backend API.
3. Frontend Nginx.
4. Kiem tra ENV, CORS va log.

## Deploy tren VPS hoac WSL Ubuntu

```bash
git clone https://github.com/doquocdat2702/Quiz-System-.git
cd Quiz-System-
cp .env.example .env
docker compose up -d --build
docker compose ps
```

Neu port host bi trung, sua `.env`:

```env
BACKEND_PORT=8081
FRONTEND_PORT=5173
MYSQL_PORT=3307
```

Sau do chay lai:

```bash
docker compose up -d --build
```

## Lenh kiem tra sau deploy

```bash
docker compose logs backend
docker compose logs frontend
docker compose logs db
curl http://localhost:8080/api/health
```

Neu `BACKEND_PORT` da doi sang `8081`, kiem tra:

```bash
curl http://localhost:8081/api/health
```

## Debug theo layer

- L4 Frontend: Mo DevTools, xem Console va Network.
- L3 Backend: `docker compose logs backend`, test `/api/health`.
- L2 Database: `docker compose logs db`, kiem tra bien `DB_*`.
- L1 Infrastructure: `docker compose ps`, kiem tra port, container, network.
