import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ComplianceService {
  constructor(private prisma: PrismaService) {}

  async getFrameworks() {
    return {
      frameworks: [
        {
          id: 'iso27001',
          name: 'ISO 27001',
          description: 'International standard for information security management',
          controlCount: 114,
        },
        {
          id: 'soc2',
          name: 'SOC 2',
          description: 'Service Organization Control 2',
          controlCount: 64,
        },
        {
          id: 'nist',
          name: 'NIST CSF',
          description: 'NIST Cybersecurity Framework',
          controlCount: 98,
        },
        {
          id: 'pci-dss',
          name: 'PCI DSS',
          description: 'Payment Card Industry Data Security Standard',
          controlCount: 282,
        },
        {
          id: 'hipaa',
          name: 'HIPAA',
          description: 'Health Insurance Portability and Accountability Act',
          controlCount: 54,
        },
      ],
    };
  }

  async getComplianceStatus(tenantId: string, framework?: string) {
    const controls = await this.prisma.control.findMany({
      where: { tenantId },
    });

    const totalControls = controls.length;
    const activeControls = controls.filter((c) => c.status === 'ACTIVE').length;
    const complianceScore = totalControls > 0 
      ? Math.round((activeControls / totalControls) * 100) 
      : 0;

    return {
      framework: framework || 'all',
      totalControls,
      activeControls,
      complianceScore,
      status: complianceScore >= 80 ? 'compliant' : complianceScore >= 60 ? 'partial' : 'non-compliant',
      lastAssessment: new Date().toISOString(),
    };
  }

  async getComplianceGaps(tenantId: string, framework?: string) {
    const controls = await this.prisma.control.findMany({
      where: { tenantId },
    });

    const inactiveControls = controls.filter(
      (c) => c.status !== 'ACTIVE',
    );

    const gaps = inactiveControls.map((control) => ({
      controlId: control.id,
      controlName: control.name,
      status: control.status,
      severity: this.calculateGapSeverity(control),
      recommendation: this.getRecommendation(control),
    }));

    return {
      framework: framework || 'all',
      totalGaps: gaps.length,
      gaps,
    };
  }

  async generateReport(tenantId: string, framework: string, format = 'pdf') {
    const status = await this.getComplianceStatus(tenantId, framework);
    const gaps = await this.getComplianceGaps(tenantId, framework);
    const controls = await this.prisma.control.findMany({
      where: { tenantId },
    });

    return {
      reportId: `COMP-${Date.now()}`,
      framework,
      format,
      generatedAt: new Date().toISOString(),
      status,
      gaps,
      controls: controls.length,
      downloadUrl: `/api/compliance/reports/${framework}-${Date.now()}.${format}`,
    };
  }

  private calculateGapSeverity(control: any): string {
    if (control.effectivenessScore === null) return 'HIGH';
    if (control.effectivenessScore < 50) return 'HIGH';
    if (control.effectivenessScore < 75) return 'MEDIUM';
    return 'LOW';
  }

  private getRecommendation(control: any): string {
    const recommendations: Record<string, string> = {
      INACTIVE: 'Activate this control immediately',
      TESTING: 'Complete testing and move to active status',
      FAILED: 'Review and fix control implementation',
    };

    return recommendations[control.status] || 'Review control configuration';
  }
}
