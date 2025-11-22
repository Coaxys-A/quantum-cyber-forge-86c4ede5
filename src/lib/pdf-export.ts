// PDF Export utilities for DevSecOps reports

interface Finding {
  title: string;
  severity: string;
  description: string;
  file_path?: string;
  line_number?: number;
  cwe_id?: string;
  cvss_score?: number;
  remediation?: string;
}

interface ScanData {
  name: string;
  target_type: string;
  target_identifier: string;
  status: string;
  scan_types: string[];
  started_at: string;
  completed_at: string;
  findings: Finding[];
}

export async function exportDevSecOpsScanToPDF(scan: ScanData): Promise<void> {
  const doc = generatePDFContent(scan);
  
  // Create a simple HTML-based PDF export
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Could not open print window');
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>DevSecOps Scan Report - ${scan.name}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            color: #333;
          }
          h1 {
            color: #1a1a1a;
            border-bottom: 3px solid #0066cc;
            padding-bottom: 10px;
          }
          h2 {
            color: #0066cc;
            margin-top: 30px;
          }
          .header {
            margin-bottom: 30px;
          }
          .metadata {
            display: grid;
            grid-template-columns: 200px 1fr;
            gap: 10px;
            margin-bottom: 20px;
            font-size: 14px;
          }
          .metadata strong {
            color: #666;
          }
          .summary {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            text-align: center;
          }
          .summary-item {
            padding: 15px;
            background: white;
            border-radius: 4px;
          }
          .summary-item .value {
            font-size: 32px;
            font-weight: bold;
            margin: 5px 0;
          }
          .summary-item .label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
          }
          .critical { color: #dc2626; }
          .high { color: #ea580c; }
          .medium { color: #ca8a04; }
          .low { color: #2563eb; }
          .finding {
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          .finding-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 15px;
          }
          .finding-title {
            font-size: 16px;
            font-weight: bold;
            color: #1a1a1a;
          }
          .severity-badge {
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            color: white;
          }
          .severity-critical { background: #dc2626; }
          .severity-high { background: #ea580c; }
          .severity-medium { background: #ca8a04; }
          .severity-low { background: #2563eb; }
          .finding-meta {
            font-size: 13px;
            color: #666;
            margin-bottom: 10px;
          }
          .finding-description {
            margin: 15px 0;
            line-height: 1.6;
          }
          .remediation {
            background: #f0f9ff;
            padding: 15px;
            border-left: 4px solid #0066cc;
            margin-top: 15px;
          }
          .remediation-title {
            font-weight: bold;
            color: #0066cc;
            margin-bottom: 8px;
          }
          @media print {
            body { margin: 20px; }
            .finding { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>DevSecOps Security Scan Report</h1>
          <div class="metadata">
            <strong>Scan Name:</strong><span>${scan.name}</span>
            <strong>Target Type:</strong><span>${scan.target_type}</span>
            <strong>Target:</strong><span>${scan.target_identifier}</span>
            <strong>Status:</strong><span>${scan.status}</span>
            <strong>Scan Types:</strong><span>${scan.scan_types.join(', ').toUpperCase()}</span>
            <strong>Started:</strong><span>${new Date(scan.started_at).toLocaleString()}</span>
            <strong>Completed:</strong><span>${new Date(scan.completed_at).toLocaleString()}</span>
          </div>
        </div>

        <div class="summary">
          <h2>Findings Summary</h2>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="label">Critical</div>
              <div class="value critical">${scan.findings.filter(f => f.severity === 'critical').length}</div>
            </div>
            <div class="summary-item">
              <div class="label">High</div>
              <div class="value high">${scan.findings.filter(f => f.severity === 'high').length}</div>
            </div>
            <div class="summary-item">
              <div class="label">Medium</div>
              <div class="value medium">${scan.findings.filter(f => f.severity === 'medium').length}</div>
            </div>
            <div class="summary-item">
              <div class="label">Low</div>
              <div class="value low">${scan.findings.filter(f => f.severity === 'low').length}</div>
            </div>
          </div>
        </div>

        <h2>Detailed Findings (${scan.findings.length} total)</h2>
        ${scan.findings.map((finding, i) => `
          <div class="finding">
            <div class="finding-header">
              <div class="finding-title">${i + 1}. ${finding.title}</div>
              <span class="severity-badge severity-${finding.severity}">${finding.severity.toUpperCase()}</span>
            </div>
            <div class="finding-meta">
              ${finding.file_path ? `📁 ${finding.file_path}${finding.line_number ? `:${finding.line_number}` : ''}` : ''}
              ${finding.cwe_id ? `<br/>🔍 CWE: ${finding.cwe_id}` : ''}
              ${finding.cvss_score ? `<br/>⚡ CVSS: ${finding.cvss_score}` : ''}
            </div>
            <div class="finding-description">${finding.description || 'No description provided.'}</div>
            ${finding.remediation ? `
              <div class="remediation">
                <div class="remediation-title">Remediation</div>
                <div>${finding.remediation}</div>
              </div>
            ` : ''}
          </div>
        `).join('')}

        <div style="margin-top: 50px; padding-top: 20px; border-top: 2px solid #e5e5e5; text-align: center; color: #666; font-size: 12px;">
          <p>Generated by Hyperion-Flux DevSecOps Engine</p>
          <p>${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  
  // Trigger print after a short delay to ensure content is rendered
  setTimeout(() => {
    printWindow.print();
  }, 250);
}

function generatePDFContent(scan: ScanData): string {
  // This is a fallback text export if HTML print fails
  let content = `DEVSECOPS SECURITY SCAN REPORT\n`;
  content += `${'='.repeat(80)}\n\n`;
  content += `Scan Name: ${scan.name}\n`;
  content += `Target: ${scan.target_type} - ${scan.target_identifier}\n`;
  content += `Status: ${scan.status}\n`;
  content += `Scan Types: ${scan.scan_types.join(', ')}\n`;
  content += `Started: ${new Date(scan.started_at).toLocaleString()}\n`;
  content += `Completed: ${new Date(scan.completed_at).toLocaleString()}\n\n`;

  content += `SUMMARY\n`;
  content += `${'-'.repeat(80)}\n`;
  content += `Total Findings: ${scan.findings.length}\n`;
  content += `  Critical: ${scan.findings.filter(f => f.severity === 'critical').length}\n`;
  content += `  High: ${scan.findings.filter(f => f.severity === 'high').length}\n`;
  content += `  Medium: ${scan.findings.filter(f => f.severity === 'medium').length}\n`;
  content += `  Low: ${scan.findings.filter(f => f.severity === 'low').length}\n\n`;

  content += `DETAILED FINDINGS\n`;
  content += `${'-'.repeat(80)}\n\n`;

  scan.findings.forEach((finding, i) => {
    content += `[${i + 1}] ${finding.title}\n`;
    content += `Severity: ${finding.severity.toUpperCase()}\n`;
    if (finding.file_path) {
      content += `Location: ${finding.file_path}${finding.line_number ? `:${finding.line_number}` : ''}\n`;
    }
    if (finding.cwe_id) content += `CWE: ${finding.cwe_id}\n`;
    if (finding.cvss_score) content += `CVSS: ${finding.cvss_score}\n`;
    content += `\nDescription:\n${finding.description}\n`;
    if (finding.remediation) {
      content += `\nRemediation:\n${finding.remediation}\n`;
    }
    content += `\n${'-'.repeat(80)}\n\n`;
  });

  return content;
}
