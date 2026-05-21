# Quiz System

Quiz System la ung dung lam bai quiz gom frontend, backend API va database MySQL. Project duoc cau hinh de chay bang Docker Compose va co CI tren GitHub Actions.

## Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express
- Database: MySQL 8
- Runtime: Docker Compose
- CI: GitHub Actions

## Cau truc chinh

```text
backend/              Express API
frontend/             React UI
docs/deploy.md        Huong dan deploy
docs/incidents.md     Bao cao incident QA/SRE
docker-compose.yml    Chay frontend, backend, database
```

## Environment

Khong commit file `.env`. Tao file local tu file mau:

```bash
cp .env.example .env
```

Bien moi truong quan trong:

```env
MYSQL_PORT=3307
BACKEND_PORT=8080
FRONTEND_PORT=5173
MYSQL_ROOT_PASSWORD=change_me_mysql_root_password
DB_NAME=quiz_system
JWT_SECRET=change_me_in_production
JWT_EXPIRES_IN=7d
VITE_API_URL=/api
```

## Chay bang Docker

```bash
docker compose up -d --build
docker compose ps
docker compose logs backend
curl http://localhost:8080/api/health
```

Mac dinh:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:8080/api/health`
- MySQL host port: `3307`

Neu port 8080 dang bi chiem, sua `.env`:

```env
BACKEND_PORT=8081
```

Sau do test health:

```bash
curl http://localhost:8081/api/health
```

## Development

Frontend:

```bash
cd frontend
npm ci
npm run lint
npm test
npm run build
```

Backend:

```bash
cd backend
npm ci
npm run lint
npm test
npm run build
```

## CI/CD

GitHub Actions chay khi `push` va `pull_request`.

Moi pipeline gom:

- install dependencies
- lint
- test
- build

Neu mot buoc loi, pipeline se fail.

## Deployment

Xem huong dan deploy tai [docs/deploy.md](docs/deploy.md).

Thu tu deploy:

1. Database
2. Backend API
3. Frontend
4. Kiem tra ENV, CORS va log

## Logging va debug

```bash
docker compose logs db
docker compose logs backend
docker compose logs frontend
```

Debug theo layer:

- L4 Frontend: Console, Network tab
- L3 Backend: API response, backend logs
- L2 External/DB: MySQL logs, DB env
- L1 Infrastructure: Docker container, port, network

## Incident

Bao cao incident nam tai [docs/incidents.md](docs/incidents.md).
