# Docker Deployment Guide for Hisab Backend

This directory contains the production-ready Docker configuration for the **Hisab Backend API (The Draftsman's Ledger)**.

---

## 1. Quick Start (Recommended: MySQL + Backend)

From the project root:

```bash
# 1. Start both MySQL and Backend in background
docker compose up -d

# 2. View backend logs
docker compose logs -f backend

# 3. Check health status
docker compose ps
```

The API will be available at:
`http://localhost:5000/api/v1/health`

---

## 2. Seed Initial Database in Docker

Once the containers are healthy, you can run the default database seed script:

```bash
docker compose exec backend npm run seed
```

---

## 3. Alternative: Single-Container Standalone (SQLite)

If you don't want to run a separate MySQL container and prefer SQLite:

```bash
# Start standalone backend with persistent SQLite storage
docker compose -f docker-compose.sqlite.yml up -d
```

Database file will be persisted in Docker volume `hisab_sqlite_data`.

---

## 4. Manual Docker Build & Run

If running as a standalone container pointing to an external MySQL database:

```bash
# Build the image
cd backend
docker build -t hisab-backend:latest .

# Run container with environment variables
docker run -d \
  --name hisab-api \
  -p 5000:5000 \
  -e NODE_ENV=production \
  -e DB_DIALECT=mysql \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  -e DB_NAME=hisab_finance_tracker \
  -e DB_USER=root \
  -e DB_PASSWORD=your_password \
  -e JWT_SECRET=your_secure_jwt_secret_hex \
  -v hisab_uploads:/app/uploads \
  hisab-backend:latest
```

---

## 5. Persistent Volumes

The setup uses named Docker volumes to prevent data loss:

- `hisab_mysql_data`: Stores all MySQL database records.
- `hisab_uploads`: Stores user receipt attachments and uploaded media.
- `hisab_sqlite_data`: Stores `database.sqlite` if running in SQLite mode.

To back up receipt uploads:

```bash
docker run --rm -v hisab_uploads:/source -v $(pwd):/backup alpine tar czf /backup/uploads-backup.tar.gz -C /source .
```

---

## 6. Stopping & Maintenance

```bash
# Stop containers (preserves database & uploads volumes)
docker compose down

# Stop and remove volumes (WARNING: deletes all database records)
docker compose down -v
```
