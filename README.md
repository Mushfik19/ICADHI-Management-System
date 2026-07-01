# ICADHI Management System

Monorepo-style scaffold for a real-world ICADHI conference management platform.

Current repository areas:
- `frontend/`: React/Vite UI scaffold with separate pages, components, layouts, hooks, and routes
- `backend/`: Node backend scaffold with controllers, routes, services, Prisma schema, and socket structure
- `database/`: database notes and planning
- `docs/`: architecture documentation
- `docker/`: container scaffolding
- `scripts/`: utility scripts

## Run Locally With MySQL, Backend, And Frontend

1. Open MySQL Workbench and create the database:

```sql
CREATE DATABASE icadhi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Update `.env` with your real MySQL password:

```env
DATABASE_URL=mysql://root:your_mysql_password@127.0.0.1:3306/icadhi
PORT=4000
```

3. Install dependencies and prepare Prisma:

```powershell
npm.cmd install
npm.cmd --prefix backend run db:generate
npm.cmd --prefix backend run db:push
npm.cmd --prefix backend run db:seed
```

4. Start backend and frontend together:

```powershell
npm.cmd run dev
```

Frontend: `http://127.0.0.1:5173`

Backend: `http://127.0.0.1:4000`

## Launch Checklist

Before launch, run:

```powershell
npm.cmd run check
```

This verifies:
- backend `.env` exists and points to MySQL
- Prisma can connect to MySQL
- all important `/api/*` module routes respond
- backend route tests pass
- both frontend builds pass
- lint passes

Important environment files:
- Copy `backend/.env.example` to `backend/.env`
- Keep real passwords only in `backend/.env`
- Do not commit `.env` or `backend/.env`

Useful commands:

```powershell
npm.cmd --prefix backend run db:generate
npm.cmd --prefix backend run db:push
npm.cmd --prefix backend run db:seed
npm.cmd run dev
```

Admin login defaults for local testing:

```text
Email: mushfik.cse@gmail.com
Password: 1324
```

Security notes:
- Do not expose login credentials in the UI.
- Do not store plaintext passwords in production data files.
- Use backend authentication, hashed passwords, JWT, refresh tokens, and role-based access control.

Recommended next implementation order:
1. Backend authentication and RBAC
2. Frontend route wiring and protected layouts
3. Participant management
4. QR scanning and attendance
5. Sessions, speakers, and workshops
6. Reports, finance, notifications, and AI health modules
