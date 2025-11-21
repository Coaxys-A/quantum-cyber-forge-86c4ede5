import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AiRequestDto } from './dto/ai-request.dto';

@Injectable()
export class AiService {
  constructor(private prisma: PrismaService) {}

  async securityAnalyst(tenantId: string, request: AiRequestDto) {
    // Fetch tenant's risks and findings
    const [risks, findings] = await Promise.all([
      this.prisma.riskItem.findMany({
        where: { tenantId },
        take: 50,
      }),
      this.prisma.finding.findMany({
        where: { tenantId },
        take: 50,
      }),
    ]);

    // AI analysis simulation
    const analysis = {
      summary: 'Security posture analysis based on current risks and findings',
      riskScore: this.calculateRiskScore(risks),
      criticalIssues: findings.filter((f) => f.severity === 'CRITICAL').length,
      recommendations: [
        'Address critical findings immediately',
        'Implement automated threat detection',
        'Review access control policies',
        'Enable multi-factor authentication',
      ],
      trends: {
        newRisksThisWeek: Math.floor(Math.random() * 10),
        resolvedFindingsThisWeek: Math.floor(Math.random() * 5),
      },
    };

    return {
      type: 'security-analyst',
      analysis,
      context: {
        totalRisks: risks.length,
        totalFindings: findings.length,
      },
    };
  }

  async architectureAnalyzer(tenantId: string, request: AiRequestDto) {
    const components = await this.prisma.componentNode.findMany({
      where: { tenantId },
      include: {
        sourceEdges: true,
        targetEdges: true,
      },
    });

    const analysis = {
      summary: 'Architecture health and vulnerability analysis',
      componentCount: components.length,
      healthDistribution: {
        healthy: components.filter((c) => c.healthStatus === 'HEALTHY').length,
        degraded: components.filter((c) => c.healthStatus === 'DEGRADED').length,
        down: components.filter((c) => c.healthStatus === 'DOWN').length,
      },
      vulnerabilities: [
        'Single points of failure detected',
        'Unmonitored critical components',
        'Outdated security patches',
      ],
      recommendations: [
        'Implement redundancy for critical services',
        'Enable comprehensive monitoring',
        'Review component dependencies',
      ],
    };

    return {
      type: 'architecture-analyzer',
      analysis,
    };
  }

  async aptSimulator(tenantId: string, request: AiRequestDto) {
    const simulation = {
      scenario: request.prompt || 'Advanced Persistent Threat Simulation',
      phases: [
        {
          name: 'Reconnaissance',
          status: 'completed',
          findings: ['Open ports discovered', 'Employee information gathered'],
        },
        {
          name: 'Initial Access',
          status: 'completed',
          findings: ['Phishing campaign successful', 'Initial foothold established'],
        },
        {
          name: 'Privilege Escalation',
          status: 'in-progress',
          findings: ['Local admin credentials obtained'],
        },
        {
          name: 'Lateral Movement',
          status: 'pending',
          findings: [],
        },
        {
          name: 'Exfiltration',
          status: 'pending',
          findings: [],
        },
      ],
      riskLevel: 'HIGH',
      recommendations: [
        'Strengthen email security',
        'Implement least privilege access',
        'Enable network segmentation',
      ],
    };

    return {
      type: 'apt-simulator',
      simulation,
    };
  }

  async complianceAssistant(tenantId: string, request: AiRequestDto) {
    const controls = await this.prisma.control.findMany({
      where: { tenantId },
    });

    const compliance = {
      frameworks: ['ISO 27001', 'SOC 2', 'NIST CSF'],
      overallScore: 78,
      gaps: [
        'Incident response plan needs review',
        'Access control documentation incomplete',
        'Security awareness training outdated',
      ],
      implementedControls: controls.filter((c) => c.status === 'ACTIVE').length,
      totalControls: controls.length,
      recommendations: [
        'Update incident response procedures',
        'Complete access control documentation',
        'Schedule quarterly security training',
      ],
    };

    return {
      type: 'compliance-assistant',
      compliance,
    };
  }

  async devsecopsAdvisor(tenantId: string, request: AiRequestDto) {
    const advice = {
      summary: 'DevSecOps pipeline security analysis',
      findings: [
        {
          severity: 'HIGH',
          category: 'dependency',
          issue: 'Outdated dependencies with known vulnerabilities',
          recommendation: 'Update all dependencies to latest secure versions',
        },
        {
          severity: 'MEDIUM',
          category: 'pipeline',
          issue: 'Missing security scans in CI/CD',
          recommendation: 'Integrate SAST and DAST tools',
        },
        {
          severity: 'LOW',
          category: 'configuration',
          issue: 'Hardcoded secrets detected',
          recommendation: 'Use secret management service',
        },
      ],
      sbom: {
        totalPackages: 150,
        vulnerablePackages: 8,
        criticalVulnerabilities: 2,
      },
      recommendations: [
        'Enable automated dependency scanning',
        'Implement secrets detection in pre-commit hooks',
        'Add security gates to deployment pipeline',
      ],
    };

    return {
      type: 'devsecops-advisor',
      advice,
    };
  }

  async universalAssistant(tenantId: string, userId: string, request: AiRequestDto) {
    // Context-aware assistant
    const context = await this.getAssistantContext(tenantId);

    const response = {
      message: `I'm your AI assistant for Hyperion-Flux. Based on your current context, I can help you with:\n\n` +
        `- Security analysis (${context.riskCount} risks, ${context.findingCount} findings)\n` +
        `- Architecture review (${context.componentCount} components)\n` +
        `- Compliance guidance (${context.controlCount} controls)\n` +
        `- DevSecOps recommendations\n\n` +
        `What would you like to explore?`,
      suggestions: [
        'Analyze current security posture',
        'Review architecture vulnerabilities',
        'Check compliance status',
        'Simulate APT attack',
      ],
      context,
    };

    return {
      type: 'universal-assistant',
      response,
    };
  }

  private calculateRiskScore(risks: any[]): number {
    if (risks.length === 0) return 100;

    const severityWeights = {
      CRITICAL: 10,
      HIGH: 7,
      MEDIUM: 4,
      LOW: 1,
    };

    const totalWeight = risks.reduce(
      (sum, risk) => sum + (severityWeights[risk.severity] || 1),
      0,
    );

    const maxWeight = risks.length * 10;
    return Math.max(0, 100 - Math.round((totalWeight / maxWeight) * 100));
  }

  private async getAssistantContext(tenantId: string) {
    const [riskCount, findingCount, componentCount, controlCount] = await Promise.all([
      this.prisma.riskItem.count({ where: { tenantId } }),
      this.prisma.finding.count({ where: { tenantId } }),
      this.prisma.componentNode.count({ where: { tenantId } }),
      this.prisma.control.count({ where: { tenantId } }),
    ]);

    return {
      riskCount,
      findingCount,
      componentCount,
      controlCount,
    };
  }
}
