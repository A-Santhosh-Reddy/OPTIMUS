import { jsPDF } from "jspdf";

export interface InvestigationReportData {
  reportId: string;
  generatedAt: string;
  generatedBy: string;
  organizationName: string;
  analysis: {
    id: string;
    submittedUrl: string;
    normalizedHostname: string;
    registrableDomain: string;
    riskScore: number;
    severity: string;
    heuristicScore: number;
    intelligenceStatus: string;
    createdAt: string;
    aiExplanation?: string;
    limitations: string[];
    signals: Array<{
      signalType: string;
      category: string;
      title: string;
      description: string;
      evidence: string;
      weight: number;
      confidence: string;
    }>;
    brandSimilarities: Array<{
      brandName: string;
      officialDomain: string;
      similarityScore: number;
      matchType: string;
      details: string;
    }>;
    intelResults: Array<{
      provider: string;
      status: string;
      matchDetails?: string;
    }>;
  };
  incident?: {
    id: string;
    title: string;
    description: string;
    status: string;
    severity: string;
    assignedUser?: { name: string; email: string };
    analystConclusion?: string;
    notes: Array<{
      authorName: string;
      content: string;
      createdAt: string;
    }>;
  };
}

export function generateThreatInvestigationPdf(data: InvestigationReportData): jsPDF {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  let y = 18;
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner
  doc.setFillColor(15, 23, 42); // Navy / Slate 900
  doc.rect(0, 0, pageWidth, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("OPTIMUS DIGITAL RISK PROTECTION PLATFORM", margin, 12);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(`Threat Analysis & Incident Forensics Report | ID: ${data.reportId}`, margin, 18);
  doc.text(`Generated: ${new Date(data.generatedAt).toUTCString()} by ${data.generatedBy}`, margin, 24);

  y = 38;

  // Executive Summary Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, "FD");

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("1. EXECUTIVE ASSESSMENT SUMMARY", margin + 4, y + 8);

  // Severity indicator color
  const sev = data.analysis.severity.toUpperCase();
  if (sev === "CRITICAL") doc.setTextColor(220, 38, 38);
  else if (sev === "HIGH") doc.setTextColor(234, 88, 12);
  else if (sev === "MEDIUM") doc.setTextColor(217, 119, 6);
  else doc.setTextColor(37, 99, 235);

  doc.setFontSize(10);
  doc.text(`Composite Risk Score: ${data.analysis.riskScore}/100 [${sev} SEVERITY]`, margin + 4, y + 16);

  doc.setTextColor(71, 85, 105);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.text(`Target Asset: ${data.analysis.submittedUrl.substring(0, 85)}`, margin + 4, y + 23);
  doc.text(`Apex Host / Domain: ${data.analysis.normalizedHostname} (${data.analysis.registrableDomain})`, margin + 4, y + 28);
  doc.text(`Threat Intelligence Match Status: ${data.analysis.intelligenceStatus}`, margin + 4, y + 33);

  y += 44;

  // Analysis Breakdown
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("2. DETECTED HEURISTIC SIGNALS & EVIDENCE", margin, y);
  y += 6;

  if (data.analysis.signals.length === 0) {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 116, 139);
    doc.text("No suspicious structural or lexical heuristic signals detected.", margin, y);
    y += 8;
  } else {
    data.analysis.signals.forEach((sig) => {
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 41, 59);
      doc.text(`• [${sig.category}] ${sig.title} (Weight: +${sig.weight} pts, Conf: ${sig.confidence})`, margin, y);
      y += 4.5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(`  Evidence: ${sig.evidence.substring(0, 95)}`, margin, y);
      y += 5;
    });
  }

  y += 3;

  // Brand Impersonation Matches
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("3. BRAND PROTECTION & LOOKALIKE CORRELATION", margin, y);
  y += 6;

  if (data.analysis.brandSimilarities.length === 0) {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 116, 139);
    doc.text("No match or collision with registered organizational brand assets.", margin, y);
    y += 8;
  } else {
    data.analysis.brandSimilarities.forEach((b) => {
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(194, 65, 12);
      doc.text(`• Brand: ${b.brandName} (Official: ${b.officialDomain}) | Match: ${b.matchType}`, margin, y);
      y += 4.5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(71, 85, 105);
      doc.text(`  Details: ${b.details}`, margin, y);
      y += 5;
    });
  }

  y += 3;

  // Incident Investigation Details if available
  if (data.incident) {
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`4. SOC INCIDENT CASE: ${data.incident.title.toUpperCase()}`, margin, y);
    y += 6;

    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(51, 65, 85);
    doc.text(`Status: ${data.incident.status} | Severity: ${data.incident.severity} | Case ID: ${data.incident.id}`, margin, y);
    y += 5;
    if (data.incident.analystConclusion) {
      doc.setFont("helvetica", "bold");
      doc.text(`Analyst Conclusion: ${data.incident.analystConclusion.substring(0, 100)}`, margin, y);
      y += 5;
    }
  }

  // Legal & Technical Disclaimer Footer
  const footerY = 275;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(148, 163, 184);
  doc.text(
    "CONFIDENTIAL & DEFENSIVE SECURITY REPORT - FOR AUTHORIZED SOC & INCIDENT RESPONSE PERSONNEL ONLY.",
    margin,
    footerY
  );
  doc.text(
    "Disclaimer: Heuristic and algorithmic risk scores represent pattern-based probabilistic evaluations and do not constitute definitive forensic proof.",
    margin,
    footerY + 3.5
  );

  return doc;
}
