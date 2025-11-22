# Hyperion-Flux Test Suite

This directory contains E2E and QA tests for the Hyperion-Flux platform.

## Test Structure

```
tests/
├── e2e/              # End-to-end tests
│   ├── auth.spec.ts
│   ├── apt-simulator.spec.ts
│   └── devsecops.spec.ts
└── qa/               # Quality assurance tests
    ├── security.test.ts
    └── billing.test.ts
```

## Running Tests

### Setup

Install test dependencies:

```bash
npm install --save-dev @playwright/test
# or
npm install --save-dev vitest
```

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npx playwright test tests/e2e/auth.spec.ts

# Run with UI
npx playwright test --ui
```

### Unit/QA Tests (Vitest)

```bash
# Run all tests
npm run test

# Run specific test
npm run test tests/qa/security.test.ts

# Run with coverage
npm run test:coverage
```

## Test Categories

### E2E Tests

- **Authentication**: Login, registration, logout, OAuth flows
- **APT Simulator**: Scenario creation, simulation execution, timeline visualization
- **DevSecOps**: Scan creation, execution, findings display, PDF export

### QA Tests

- **Security**: RLS policies, token validation, access control, input sanitization
- **Billing**: Stripe integration, webhook processing, usage tracking, plan limits

## Writing Tests

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/app/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/app/dashboard');
});
```

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest';
import { validateEmail } from '@/lib/validation';

describe('Email Validation', () => {
  it('should accept valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true);
  });
  
  it('should reject invalid email', () => {
    expect(validateEmail('invalid')).toBe(false);
  });
});
```

## Test Coverage Goals

- **Core Features**: 80%+ coverage
- **Security Features**: 95%+ coverage
- **Billing Logic**: 90%+ coverage
- **E2E Critical Paths**: 100% coverage

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Pre-deployment
- Nightly builds

## Test Data

Use the demo tenant for testing:
- Tenant ID: `11111111-1111-1111-1111-111111111111`
- Contains pre-populated data for all modules

## Common Test Scenarios

1. **Authentication Flow**
   - Register → Verify → Login → Dashboard

2. **APT Simulation Flow**
   - Create Scenario → Configure → Run → View Results

3. **DevSecOps Flow**
   - Create Scan → Execute → View Findings → Export PDF

4. **Billing Flow**
   - View Plans → Select → Checkout → Confirm → Access Features

## Debugging Tests

```bash
# Debug specific test
npx playwright test --debug tests/e2e/auth.spec.ts

# Generate trace
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

## Best Practices

1. **Use Test IDs**: Add `data-testid` attributes for reliable selectors
2. **Clean State**: Reset database state between tests
3. **Async Handling**: Always await async operations
4. **Descriptive Names**: Use clear, descriptive test names
5. **Independent Tests**: Each test should run independently
6. **Mock External Services**: Mock external APIs when possible

## Known Issues

- Some tests require pg_cron extension (not available in all environments)
- Stripe webhook tests require ngrok or similar for local development
- Demo tenant must be seeded before running full E2E suite
