# Hyperion-Flux Backend

Production-grade NestJS backend with PostgreSQL, JWT auth, Stripe payments, and WebSocket support.

## Setup

1. **Install dependencies:**
```bash
cd server
npm install
```

2. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your database URL, JWT secrets, and Stripe keys
```

3. **Setup database:**
```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. **Start development server:**
```bash
npm run start:dev
```

Server runs on `http://localhost:3001`
API docs at `http://localhost:3001/api/docs`

## API Structure

- `/auth` - Registration, login, refresh tokens
- `/users` - User management
- `/modules` - Module registry CRUD
- `/roadmap` - Stages, tasks, milestones
- `/architecture` - Components and graph
- `/security` - Risks, controls, findings
- `/simulation` - Simulation management + WebSocket
- `/payments` - Stripe integration
- `/docs` - Documentation pages

## Deployment

```bash
npm run build
npm run start:prod
```

Use Docker for production deployment.
