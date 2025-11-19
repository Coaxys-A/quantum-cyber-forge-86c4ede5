import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'hyperion-demo' },
    update: {},
    create: {
      name: 'Hyperion Demo Organization',
      slug: 'hyperion-demo',
      domain: 'demo.hyperionflux.com',
      settings: {
        timezone: 'UTC',
        defaultLanguage: 'en',
        brandingColor: '#6366f1',
      },
    },
  });

  console.log('✅ Created tenant:', tenant.name);

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hyperionflux.com' },
    update: {},
    create: {
      email: 'admin@hyperionflux.com',
      hashedPassword,
      role: 'ADMIN',
      tenantId: tenant.id,
      preferredLanguage: 'en',
    },
  });

  console.log('✅ Created admin user:', adminUser.email);

  // Create ops user
  const opsUser = await prisma.user.upsert({
    where: { email: 'ops@hyperionflux.com' },
    update: {},
    create: {
      email: 'ops@hyperionflux.com',
      hashedPassword: await bcrypt.hash('ops123', 12),
      role: 'OPS',
      tenantId: tenant.id,
      preferredLanguage: 'en',
    },
  });

  console.log('✅ Created ops user:', opsUser.email);

  // Create billing plans
  const freePlan = await prisma.plan.upsert({
    where: { code: 'FREE' },
    update: {},
    create: {
      code: 'FREE',
      name: 'Free Plan',
      description: 'Basic features for small teams',
      priceMonthly: 0,
      currency: 'USD',
      features: ['5 Modules', 'Basic Security', '10 Simulations/month'],
      maxUsers: 5,
      maxModules: 5,
      maxSimulations: 10,
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { code: 'PRO' },
    update: {},
    create: {
      code: 'PRO',
      name: 'Pro Plan',
      description: 'Advanced features for growing teams',
      priceMonthly: 99,
      currency: 'USD',
      features: ['Unlimited Modules', 'Advanced Security', 'Unlimited Simulations', 'Priority Support'],
      maxUsers: 50,
      maxModules: -1,
      maxSimulations: -1,
      stripePriceId: 'price_pro_monthly',
    },
  });

  const enterprisePlan = await prisma.plan.upsert({
    where: { code: 'ENTERPRISE' },
    update: {},
    create: {
      code: 'ENTERPRISE',
      name: 'Enterprise Plan',
      description: 'Full platform with dedicated support',
      priceMonthly: 499,
      currency: 'USD',
      features: ['Everything in Pro', 'Dedicated Support', 'SLA', 'Custom Integrations', 'SSO'],
      maxUsers: -1,
      maxModules: -1,
      maxSimulations: -1,
      stripePriceId: 'price_enterprise_monthly',
    },
  });

  console.log('✅ Created plans: FREE, PRO, ENTERPRISE');

  // Create subscription for demo tenant
  await prisma.subscription.upsert({
    where: { tenantId: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      planId: proPlan.id,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      seats: 10,
    },
  });

  console.log('✅ Created subscription');

  // Create sample modules
  const modules = await Promise.all([
    prisma.module.create({
      data: {
        tenantId: tenant.id,
        name: 'Enclave Runtime',
        slug: 'enclave-runtime',
        category: 'RUNTIME',
        description: 'Secure execution environment for sensitive workloads',
        version: '1.2.0',
        status: 'STABLE',
        ownerUserId: adminUser.id,
        tags: ['security', 'runtime', 'isolation'],
      },
    }),
    prisma.module.create({
      data: {
        tenantId: tenant.id,
        name: 'PQC Mesh Network',
        slug: 'pqc-mesh',
        category: 'SECURITY',
        description: 'Post-quantum cryptography mesh networking layer',
        version: '0.8.3',
        status: 'CANARY',
        ownerUserId: adminUser.id,
        tags: ['quantum', 'crypto', 'network'],
      },
    }),
    prisma.module.create({
      data: {
        tenantId: tenant.id,
        name: 'Telemetry Engine',
        slug: 'telemetry-engine',
        category: 'MONITORING',
        description: 'Real-time telemetry collection and analysis',
        version: '2.1.0',
        status: 'STABLE',
        ownerUserId: opsUser.id,
        tags: ['monitoring', 'metrics', 'observability'],
      },
    }),
    prisma.module.create({
      data: {
        tenantId: tenant.id,
        name: 'SBOM Generator',
        slug: 'sbom-generator',
        category: 'COMPLIANCE',
        description: 'Software Bill of Materials generation and validation',
        version: '1.0.0',
        status: 'EXPERIMENTAL',
        ownerUserId: opsUser.id,
        tags: ['compliance', 'sbom', 'audit'],
      },
    }),
  ]);

  console.log(`✅ Created ${modules.length} sample modules`);

  // Create roadmap stages
  const stage1 = await prisma.stage.create({
    data: {
      tenantId: tenant.id,
      index: 0,
      name: 'Foundation',
      description: 'Core platform infrastructure and architecture',
      status: 'COMPLETED',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-03-31'),
    },
  });

  const stage2 = await prisma.stage.create({
    data: {
      tenantId: tenant.id,
      index: 1,
      name: 'Security Hardening',
      description: 'Advanced security features and compliance',
      status: 'IN_PROGRESS',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-06-30'),
    },
  });

  const stage3 = await prisma.stage.create({
    data: {
      tenantId: tenant.id,
      index: 2,
      name: 'AI Integration',
      description: 'AI-powered threat detection and automation',
      status: 'PLANNED',
      startDate: new Date('2024-07-01'),
      endDate: new Date('2024-09-30'),
    },
  });

  console.log('✅ Created roadmap stages');

  // Create sample tasks
  await Promise.all([
    prisma.task.create({
      data: {
        tenantId: tenant.id,
        stageId: stage2.id,
        title: 'Implement Zero Trust Architecture',
        description: 'Deploy zero trust security model across all services',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assigneeUserId: opsUser.id,
        dueDate: new Date('2024-05-15'),
        estimatedHours: 120,
        tags: ['security', 'zero-trust'],
      },
    }),
    prisma.task.create({
      data: {
        tenantId: tenant.id,
        stageId: stage2.id,
        title: 'SOC 2 Compliance Audit',
        description: 'Complete SOC 2 Type II audit preparation',
        status: 'TODO',
        priority: 'CRITICAL',
        assigneeUserId: adminUser.id,
        dueDate: new Date('2024-06-30'),
        estimatedHours: 200,
        tags: ['compliance', 'audit'],
      },
    }),
    prisma.task.create({
      data: {
        tenantId: tenant.id,
        stageId: stage3.id,
        title: 'Train Anomaly Detection Model',
        description: 'Develop and train ML model for threat detection',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date('2024-08-15'),
        estimatedHours: 160,
        tags: ['ai', 'ml', 'security'],
      },
    }),
  ]);

  console.log('✅ Created sample tasks');

  // Create security risks
  await Promise.all([
    prisma.riskItem.create({
      data: {
        tenantId: tenant.id,
        title: 'Unencrypted Data in Transit',
        description: 'Some internal services communicate without TLS encryption',
        category: 'TECHNICAL',
        severity: 'HIGH',
        likelihood: 'MEDIUM',
        impact: 'HIGH',
        status: 'OPEN',
        ownerUserId: opsUser.id,
      },
    }),
    prisma.riskItem.create({
      data: {
        tenantId: tenant.id,
        title: 'Insufficient Access Controls',
        description: 'Role-based access needs granular permission refinement',
        category: 'SECURITY',
        severity: 'MEDIUM',
        likelihood: 'MEDIUM',
        impact: 'MEDIUM',
        status: 'IN_PROGRESS',
        ownerUserId: adminUser.id,
      },
    }),
    prisma.riskItem.create({
      data: {
        tenantId: tenant.id,
        title: 'Legacy Dependencies',
        description: 'Several modules rely on outdated libraries with known vulnerabilities',
        category: 'TECHNICAL',
        severity: 'CRITICAL',
        likelihood: 'HIGH',
        impact: 'CRITICAL',
        status: 'OPEN',
        ownerUserId: opsUser.id,
      },
    }),
  ]);

  console.log('✅ Created security risks');

  // Create architecture components
  await Promise.all([
    prisma.component.create({
      data: {
        tenantId: tenant.id,
        name: 'API Gateway',
        type: 'SERVICE',
        description: 'Main entry point for all API requests',
        healthStatus: 'HEALTHY',
        riskScore: 2,
      },
    }),
    prisma.component.create({
      data: {
        tenantId: tenant.id,
        name: 'Auth Service',
        type: 'SERVICE',
        description: 'Authentication and authorization service',
        healthStatus: 'HEALTHY',
        riskScore: 1,
      },
    }),
    prisma.component.create({
      data: {
        tenantId: tenant.id,
        name: 'PostgreSQL Database',
        type: 'DATABASE',
        description: 'Primary data store',
        healthStatus: 'HEALTHY',
        riskScore: 1,
      },
    }),
    prisma.component.create({
      data: {
        tenantId: tenant.id,
        name: 'Simulation Engine',
        type: 'SERVICE',
        description: 'Cyber simulation execution environment',
        healthStatus: 'DEGRADED',
        riskScore: 4,
      },
    }),
  ]);

  console.log('✅ Created architecture components');

  // Create sample simulation
  await prisma.simulation.create({
    data: {
      tenantId: tenant.id,
      name: 'APT29 Ransomware Attack',
      scenarioType: 'RANSOMWARE',
      description: 'Simulated advanced persistent threat with ransomware payload',
      status: 'COMPLETED',
      createdByUserId: opsUser.id,
      startedAt: new Date(Date.now() - 3600000),
      endedAt: new Date(Date.now() - 1800000),
    },
  });

  console.log('✅ Created sample simulation');

  // Create documentation pages
  await Promise.all([
    prisma.docPage.create({
      data: {
        tenantId: tenant.id,
        slug: 'getting-started',
        title: 'Getting Started',
        contentMarkdown: '# Getting Started\n\nWelcome to Hyperion-Flux Mission Control...',
        category: 'GUIDE',
        language: 'en',
        version: '1.0',
      },
    }),
    prisma.docPage.create({
      data: {
        tenantId: tenant.id,
        slug: 'api-reference',
        title: 'API Reference',
        contentMarkdown: '# API Reference\n\nComplete API documentation...',
        category: 'API',
        language: 'en',
        version: '1.0',
      },
    }),
  ]);

  console.log('✅ Created documentation pages');

  console.log('\n🎉 Seeding complete!\n');
  console.log('📧 Admin user: admin@hyperionflux.com');
  console.log('🔑 Password: admin123\n');
  console.log('📧 Ops user: ops@hyperionflux.com');
  console.log('🔑 Password: ops123\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
