# Hyperion-Flux Mission Control - Full-Stack Platform

## Overview

Hyperion-Flux Mission Control is a flagship, global cyber-operations SaaS platform with comprehensive multi-tenancy, multi-language (25 languages including Persian), and multi-subdomain capabilities.

## Architecture

### Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: NestJS + TypeScript + Prisma ORM
- **Database**: PostgreSQL
- **API**: REST + WebSocket (real-time)
- **Auth**: JWT (access + refresh tokens)
- **Payments**: Stripe integration
- **i18n**: i18next with 25 language support

### Subdomains
1. **app.hyperionflux.com** - Main SaaS application
2. **api.hyperionflux.com** - REST/WebSocket API
3. **docs.hyperionflux.com** - Documentation portal
4. **status.hyperionflux.com** - Status page

## Multi-Tenancy

Complete tenant isolation with:
- `tenantId` on all domain entities
- `TenantGuard` for automatic context enforcement
- Tenant-scoped queries at service level
- Audit logging per tenant

## Multi-Language (i18n)

### Supported Languages (25)
- English (en)
- **Persian (fa)** - First-class with RTL support
- Arabic (ar)
- French (fr)
- German (de)
- Spanish (es)
- Portuguese Brazilian (pt-BR)
- Russian (ru)
- Chinese Simplified (zh-CN)
- Chinese Traditional (zh-TW)
- Japanese (ja)
- Korean (ko)
- Hindi (hi)
- Turkish (tr)
- Italian (it)
- Dutch (nl)
- Swedish (sv)
- Norwegian (no)
- Danish (da)
- Finnish (fi)
- Polish (pl)
- Czech (cs)
- Hebrew (he)
- Thai (th)
- Indonesian (id)

### Features
- **Auto-detection**: JavaScript-based locale detection using browser APIs
- **RTL Support**: Automatic layout direction for Persian, Arabic, Hebrew
- **Persistent preference**: User language choice stored
- **Locale suggestion banner**: Non-intrusive language switch suggestions

## Core Domains

### 1. Authentication & RBAC
- JWT-based authentication (15min access, 7-day refresh)
- Roles and Permissions in separate tables (security best practice)
- Tenant-scoped user management
- Audit logging for security operations

**Key Models**: `User`, `Role`, `Permission`, `UserRole`, `AuditLogEntry`

### 2. Modules Registry
- Module lifecycle: Draft → Experimental → Canary → Stable → Deprecated
- Versioning and dependency tracking
- Activity logging per module
- Search and filter capabilities

**Key Models**: `Module`, `ModuleInterface`, `ModuleDependency`, `ModuleActivity`

### 3. Roadmap & Projects
- 26-stage strategic roadmap
- Tasks with Kanban workflow
- Milestones and OKRs/KPIs
- Comment threads with mentions

**Key Models**: `Stage`, `Task`, `Milestone`, `OKR`, `Comment`

### 4. Architecture Visualizer
- Graph-based component visualization
- Health status tracking (HEALTHY, DEGRADED, DOWN)
- Risk scoring per component
- Component relationships and dependencies

**Key Models**: `Component`, `ComponentEdge`

### 5. Security Center
- Risk assessment and scoring
- Controls mapped to frameworks (NIST, ISO)
- Findings and remediation tracking
- Security reports generation

**Key Models**: `RiskItem`, `Control`, `Finding`, `SecurityReport`, `ControlRisk`

### 6. Simulation & Telemetry
- Scenario-based cyber simulations
- Real-time event streaming via WebSocket
- Scenario templates library
- Lifecycle: Draft → Scheduled → Running → Completed → Archived

**Key Models**: `Simulation`, `SimulationEvent`, `ScenarioTemplate`

### 7. Billing & Subscriptions
- Stripe integration for payments
- Multiple plans (FREE, PRO, ENTERPRISE)
- Trial periods and promo codes
- Feature gating based on subscription

**Key Models**: `Plan`, `Subscription`, `Invoice`, `PromoCode`

### 8. Documentation Portal
- Multi-language documentation
- Version tracking
- Markdown content with syntax highlighting
- Full-text search

**Key Models**: `DocPage`

### 9. Settings & Integrations
- Tenant-specific settings
- External integrations (Slack, GitHub, JIRA)
- Approval workflows for critical operations

**Key Models**: `IntegrationConfig`, `AppSetting`, `ApprovalWorkflow`

## Security

### Best Practices Implemented
✅ Bcrypt password hashing (cost factor 10)
✅ JWT with short-lived access tokens
✅ Refresh token rotation
✅ Input validation via DTOs
✅ Rate limiting on auth/billing endpoints
✅ Audit logging for sensitive operations
✅ Tenant isolation at query level
✅ RBAC with granular permissions
✅ No secrets in logs
✅ OWASP security guidelines

### Critical Security Design
**Roles are NOT stored on user table** - stored in separate `Role`, `Permission`, and `UserRole` tables to prevent privilege escalation attacks.

## Frontend Features

### Locale Detection (JavaScript)
```typescript
// Auto-detects:
- Browser language (navigator.language)
- Timezone (Intl.DateTimeFormat)
- Optional geolocation (with user consent)
- Suggests appropriate language
```

### API Client
Type-safe API client with:
- Automatic token management
- Request/response typing
- Error handling with custom ApiError class
- Modular endpoint organization

### Components
- `LocaleSwitcher` - Language dropdown (25 languages)
- `LocaleDetectionBanner` - Smart suggestion banner
- RTL-aware layouts
- Responsive design system

## Backend Architecture

### Layered Structure
```
controllers/ (HTTP endpoints)
  ↓
services/ (Business logic)
  ↓
repositories/ (Prisma queries)
```

### Guards & Middleware
- `JwtAuthGuard` - Authentication
- `JwtRefreshGuard` - Token refresh
- `TenantGuard` - Tenant context enforcement
- `RolesGuard` - Role-based access
- `ThrottlerGuard` - Rate limiting

### WebSocket Real-time
```typescript
// Simulation events
@SubscribeMessage('subscribe:simulation')
handleSubscribe(client: Socket, simulationId: string) {
  client.join(`simulation:${simulationId}`);
}

// Emit events
this.gateway.server
  .to(`simulation:${simulationId}`)
  .emit('simulation:event', event);
```

## Database Schema

### Key Design Patterns
1. **Multi-tenancy**: `tenantId` on all relevant tables
2. **Soft deletes**: Status fields instead of hard deletes
3. **Audit trail**: `createdAt`, `updatedAt` on all entities
4. **Relationships**: Proper foreign keys with cascade rules
5. **Indexes**: Strategic indexing on frequently queried fields

### Total Models: 30+
Including: Tenant, User, Role, Permission, Module, Stage, Task, Component, RiskItem, Simulation, Subscription, and many more.

## Getting Started

### Prerequisites
- Node.js 18+ LTS
- PostgreSQL 14+
- Stripe account (for payments)

### Backend Setup
```bash
cd server
npm install
cp .env.example .env
# Configure DATABASE_URL, JWT secrets, STRIPE keys
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

Backend runs on `http://localhost:3000`
Swagger docs at `http://localhost:3000/api/docs`

### Frontend Setup
```bash
npm install
# Create .env with VITE_API_URL=http://localhost:3000/api/v1
npm run dev
```

Frontend runs on `http://localhost:8080`

## API Documentation

Once backend is running, visit `/api/docs` for interactive Swagger UI with:
- All endpoints documented
- Request/response schemas
- Authentication support
- Try-it-out functionality

## Development Workflow

1. **Database Changes**:
   - Update `schema.prisma`
   - Run `npm run prisma:migrate`
   - Update DTOs and services

2. **New Feature**:
   - Create service with business logic
   - Add controller with endpoints
   - Update Swagger decorators
   - Add frontend API client methods
   - Create UI components
   - Write tests

3. **Multi-language**:
   - Add keys to `src/locales/en/translation.json`
   - Translate to other languages
   - Use `t('key')` in components

## Scalability & Production

### Scalability Features
- Stateless backend (horizontal scaling ready)
- Event-driven architecture
- Clear microservice boundaries
- Caching strategy preparation
- Message queue integration points

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Secrets management (AWS Secrets Manager, etc.)
- [ ] Docker containers built
- [ ] CI/CD pipeline configured
- [ ] Monitoring/logging setup (Datadog, New Relic)
- [ ] Health checks enabled
- [ ] Rate limiting tuned
- [ ] Backup strategy implemented
- [ ] SSL certificates configured

## Testing

### Backend
```bash
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage report
```

### Frontend
```bash
npm run test          # Vitest tests
```

## Key Technical Decisions

### Why NestJS?
- Clean architecture out of the box
- TypeScript-first
- Modular design
- Excellent testing support
- Enterprise-grade patterns

### Why Prisma?
- Type-safe database access
- Auto-generated client
- Migration system
- Multi-database support
- Great DX

### Why Multi-tenancy in Shared Schema?
- Simpler infrastructure
- Cost-effective at scale
- Easier maintenance
- Good tenant isolation with proper queries

### Why i18next?
- Industry standard
- Great React integration
- Flexible translation management
- RTL support
- Language detection

## Future Enhancements

### Planned Features
1. **AI Co-pilot**: Contextual action suggestions
2. **Anomaly Detection**: ML-based security insights
3. **Plugin System**: Extensible module architecture
4. **Webhooks**: Outbound event notifications
5. **Mobile Apps**: React Native iOS/Android
6. **Advanced Analytics**: Custom dashboards
7. **SSO Integration**: OAuth providers
8. **Multi-region**: Geographic data residency

### Microservices Migration Path
Current monolith can be extracted into:
- Auth service
- Modules service
- Simulation service
- Billing service
- API Gateway

## License

Proprietary - Hyperion-Flux Platform

## Support

For questions or issues, contact the development team.

---

**Built with ❤️ for world-class cyber operations**
