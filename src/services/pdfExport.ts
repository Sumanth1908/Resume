export class PDFExportService {
  /**
   * Triggers the native browser print dialog for the resume.
   * Uses a "Clone & Print" strategy to isolate the resume content
   * from the rest of the application layout.
   *
   * @param elementId - ID of the element to print
   * @param filename - Suggested filename for the PDF
   */
  static async exportToPDF(
    elementId: string,
    filename: string = "Resume.pdf"
  ): Promise<void> {
    const originalTitle = document.title;
    document.title = filename.replace(/\.pdf$/i, "");

    // 1. Find the element to print
    const elementToPrint = document.getElementById(elementId);
    if (!elementToPrint) {
      console.error(`Element with id ${elementId} not found`);
      return;
    }

    // 2. Create a print container
    const printContainer = document.createElement("div");
    printContainer.id = "print-container";
    printContainer.style.position = "absolute";
    printContainer.style.top = "0";
    printContainer.style.left = "0";
    printContainer.style.width = "100%";
    printContainer.style.zIndex = "9999"; // Top layer

    // 3. Clone the content (deep clone to get all children)
    const clonedContent = elementToPrint.cloneNode(true) as HTMLElement;

    // Remove conflicting IDs to avoid duplicates (optional but good practice)
    clonedContent.id = `${elementId}-print-clone`;

    // Append clone to container
    printContainer.appendChild(clonedContent);
    document.body.appendChild(printContainer);

    // 4. Add 'printing-mode' class to body to trigger CSS
    document.body.classList.add("printing-mode");

    try {
      // 5. Trigger Print
      window.print();
    } catch (error) {
      console.error("Print failed:", error);
    } finally {
      // 6. Cleanup
      document.body.removeChild(printContainer);
      document.body.classList.remove("printing-mode");

      // Restore title
      setTimeout(() => {
        document.title = originalTitle;
      }, 100);
    }
  }
}
