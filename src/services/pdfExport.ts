import html2pdf from "html2pdf.js";

export class PDFExportService {
  static async exportToPDF(
    elementId: string,
    filename: string = "resume.pdf"
  ): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Element not found for PDF export");
    }

    const options = {
      margin: [10, 10, 10, 10] as [number, number, number, number], // top, right, bottom, left margins in mm
      filename: filename,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
        windowWidth: 1200, // Force consistent width
        width: 800, // Set a fixed content width
        height: undefined, // Let it calculate height automatically
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait" as const,
        compress: true,
        precision: 16,
      },
    };

    try {
      await html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error("PDF export failed:", error);
      throw new Error("Failed to export PDF");
    }
  }

  static async generatePDFBlob(elementId: string): Promise<Blob> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error("Element not found for PDF export");
    }

    const options = {
      margin: [10, 10, 10, 10] as [number, number, number, number], // top, right, bottom, left margins in mm
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        scrollY: 0,
        windowWidth: 1200, // Force consistent width
        width: 800, // Set a fixed content width
        height: undefined, // Let it calculate height automatically
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait" as const,
      },
    };

    try {
      const pdf = await html2pdf().set(options).from(element).outputPdf("blob");
      return pdf;
    } catch (error) {
      console.error("PDF generation failed:", error);
      throw new Error("Failed to generate PDF");
    }
  }
}
