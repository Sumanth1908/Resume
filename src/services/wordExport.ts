import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";
import { ResumeData } from "../types/resume";

export class WordExportService {
  static async exportToWord(
    resume: ResumeData,
    filename: string = "resume.docx"
  ): Promise<void> {
    try {
      const blob = await this.exportToBlob(resume);

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Word export failed:", error);
      console.error(
        "Error details:",
        error instanceof Error ? error.message : error
      );
      throw new Error("Failed to export Word document");
    }
  }

  private static createDocument(resume: ResumeData): Document {
    try {
      const children: Paragraph[] = [];

      // Header with name
      children.push(
        new Paragraph({
          text: resume.contactInfo?.name || "Your Name",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        })
      );

      // Tagline
      if (resume.contactInfo?.tagline) {
        children.push(
          new Paragraph({
            text: resume.contactInfo.tagline,
            alignment: AlignmentType.CENTER,
          })
        );
      }

      // Contact Information
      const contactParts: string[] = [];
      if (resume.contactInfo?.email)
        contactParts.push(`Email: ${resume.contactInfo.email}`);
      if (resume.contactInfo?.phone)
        contactParts.push(`Phone: ${resume.contactInfo.phone}`);
      if (resume.contactInfo?.linkedin)
        contactParts.push(`LinkedIn: ${resume.contactInfo.linkedin}`);

      if (contactParts.length > 0) {
        children.push(
          new Paragraph({
            text: contactParts.join(" | "),
            alignment: AlignmentType.CENTER,
          })
        );
      }

      // Experience Section
      if (resume.experiences && resume.experiences.length > 0) {
        children.push(
          new Paragraph({
            text: "EXPERIENCE",
            heading: HeadingLevel.HEADING_1,
          })
        );

        resume.experiences.forEach((exp) => {
          // Job header
          const jobHeader = [];
          if (exp.position) jobHeader.push(exp.position);
          if (exp.company) jobHeader.push(`at ${exp.company}`);

          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: jobHeader.join(" "),
                  bold: true,
                }),
              ],
            })
          );

          // Dates
          const dateParts: string[] = [];
          if (exp.startDate) dateParts.push(this.formatDate(exp.startDate));
          if (exp.endDate) {
            dateParts.push(this.formatDate(exp.endDate));
          } else {
            dateParts.push("Present");
          }

          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: dateParts.join(" - "),
                  italics: true,
                }),
              ],
            })
          );

          // Description
          if (exp.description) {
            children.push(
              new Paragraph({
                text: exp.description,
              })
            );
          }
        });
      }

      // Education Section
      if (resume.education && resume.education.length > 0) {
        children.push(
          new Paragraph({
            text: "EDUCATION",
            heading: HeadingLevel.HEADING_1,
          })
        );

        resume.education.forEach((edu) => {
          const eduHeader = [];
          if (edu.degree) eduHeader.push(edu.degree);
          if (edu.institution) eduHeader.push(`from ${edu.institution}`);
          if (edu.location) eduHeader.push(`(${edu.location})`);

          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: eduHeader.join(" "),
                  bold: true,
                }),
              ],
            })
          );

          // Dates
          const dateParts: string[] = [];
          if (edu.startDate) dateParts.push(this.formatDate(edu.startDate));
          if (edu.endDate) {
            dateParts.push(this.formatDate(edu.endDate));
          } else {
            dateParts.push("Present");
          }

          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: dateParts.join(" - "),
                  italics: true,
                }),
              ],
            })
          );

          // Description
          if (edu.description) {
            children.push(
              new Paragraph({
                text: edu.description,
              })
            );
          }
        });
      }

      // Projects Section
      if (resume.projects && resume.projects.length > 0) {
        children.push(
          new Paragraph({
            text: "PROJECTS",
            heading: HeadingLevel.HEADING_1,
          })
        );

        resume.projects.forEach((project) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: project.title || "Project",
                  bold: true,
                }),
              ],
            })
          );

          // Technologies
          if (project.technologies && project.technologies.length > 0) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `Technologies: ${project.technologies.join(", ")}`,
                    italics: true,
                  }),
                ],
              })
            );
          }

          // Description
          if (project.description) {
            children.push(
              new Paragraph({
                text: project.description,
              })
            );
          }
        });
      }

      // Skills Section
      if (resume.skills && resume.skills.length > 0) {
        children.push(
          new Paragraph({
            text: "SKILLS",
            heading: HeadingLevel.HEADING_1,
          })
        );

        const technicalSkills = resume.skills.filter(
          (skill) => skill.category === "technical"
        );
        const additionalSkills = resume.skills.filter(
          (skill) => skill.category === "additional"
        );

        if (technicalSkills.length > 0) {
          children.push(
            new Paragraph({
              text: `Technical Skills: ${technicalSkills
                .map((s) => s.name)
                .join(", ")}`,
            })
          );
        }

        if (additionalSkills.length > 0) {
          children.push(
            new Paragraph({
              text: `Additional Skills: ${additionalSkills
                .map((s) => s.name)
                .join(", ")}`,
            })
          );
        }
      }

      // Awards Section
      if (resume.awards && resume.awards.length > 0) {
        children.push(
          new Paragraph({
            text: "AWARDS",
            heading: HeadingLevel.HEADING_1,
          })
        );

        resume.awards.forEach((award) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: award.title || "Award",
                  bold: true,
                }),
              ],
            })
          );

          if (award.description) {
            children.push(
              new Paragraph({
                text: award.description,
              })
            );
          }
        });
      }

      return new Document({
        sections: [
          {
            children: children,
          },
        ],
      });
    } catch (error) {
      console.error("Error creating document:", error);
      throw error;
    }
  }

  private static formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
      });
    } catch {
      return dateString;
    }
  }

  static async exportToBlob(resume: ResumeData): Promise<Blob> {
    try {
      const doc = this.createDocument(resume);
      const blob = await Packer.toBlob(doc);
      return blob;
    } catch (error) {
      console.error("Word export failed:", error);
      console.error(
        "Error details:",
        error instanceof Error ? error.message : error
      );
      throw new Error("Failed to export Word document");
    }
  }

  static async exportToBase64(resume: ResumeData): Promise<string> {
    try {
      const doc = this.createDocument(resume);
      const base64 = await Packer.toBase64String(doc);
      return base64;
    } catch (error) {
      console.error("Word export failed:", error);
      console.error(
        "Error details:",
        error instanceof Error ? error.message : error
      );
      throw new Error("Failed to export Word document");
    }
  }
}
