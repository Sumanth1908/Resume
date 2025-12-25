import { ResumeData } from "../types/resume";

export class JSONExportService {
  static exportToJSON(resume: ResumeData): void {
    try {
      const jsonString = JSON.stringify(resume, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.contactInfo.name || "resume"}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("JSON export failed:", error);
      throw new Error("Failed to export JSON");
    }
  }

  static async importFromJSON(file: File): Promise<ResumeData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const jsonString = event.target?.result as string;
          const resumeData: ResumeData = JSON.parse(jsonString);

          // Basic validation
          if (
            !resumeData.id ||
            !resumeData.contactInfo ||
            !resumeData.experiences
          ) {
            throw new Error("Invalid resume format");
          }

          resolve(resumeData);
        } catch (error) {
          console.error("JSON import failed:", error);
          reject(
            new Error(
              "Failed to parse JSON file. Please ensure it's a valid resume JSON file."
            )
          );
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };

      reader.readAsText(file);
    });
  }

  static validateResumeData(data: any): data is ResumeData {
    return (
      data &&
      typeof data === "object" &&
      typeof data.id === "string" &&
      data.contactInfo &&
      typeof data.contactInfo === "object" &&
      Array.isArray(data.experiences) &&
      Array.isArray(data.projects) &&
      Array.isArray(data.skills) &&
      Array.isArray(data.education) &&
      Array.isArray(data.awards)
    );
  }
}
