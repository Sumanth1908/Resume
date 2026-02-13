import { ResumeData } from "../types/resume";

export class MarkdownExportService {
    static exportToMarkdown(resume: ResumeData, filename: string): void {
        try {
            let md = `# ${resume.contactInfo.name || "Resume"}\n\n`;

            if (resume.contactInfo.tagline) {
                md += `*${resume.contactInfo.tagline}*\n\n`;
            }

            const contactParts = [];
            if (resume.contactInfo.email) contactParts.push(resume.contactInfo.email);
            if (resume.contactInfo.phone) contactParts.push(resume.contactInfo.phone);
            if (resume.contactInfo.linkedin) contactParts.push(`[LinkedIn](${resume.contactInfo.linkedin})`);

            if (contactParts.length > 0) {
                md += contactParts.join(" | ") + "\n\n---\n\n";
            }

            // Experience
            if (resume.experiences.length > 0) {
                md += `## Experience\n\n`;
                resume.experiences.forEach((exp) => {
                    md += `### ${exp.company}${exp.location ? ` | ${exp.location}` : ""}\n`;
                    md += `**${exp.position}** | *${exp.startDate} – ${exp.current ? "Present" : exp.endDate}*\n\n`;

                    if (exp.description) {
                        md += `${exp.description}\n\n`;
                    }

                    if (exp.responsibilities && exp.responsibilities.length > 0) {
                        exp.responsibilities.forEach((resp) => {
                            md += `- ${resp}\n`;
                        });
                        md += "\n";
                    }
                });
            }

            // Projects
            if (resume.projects.length > 0) {
                md += `## Projects\n\n`;
                resume.projects.forEach((proj) => {
                    md += `### ${proj.title}${proj.company ? ` (@ ${proj.company})` : ""}\n`;
                    if (proj.subtitle) md += `*${proj.subtitle}*\n\n`;

                    if (proj.description) {
                        md += `${proj.description}\n\n`;
                    }

                    if (proj.responsibilities && proj.responsibilities.length > 0) {
                        proj.responsibilities.forEach((resp) => {
                            md += `- ${resp}\n`;
                        });
                    }

                    if (proj.technologies && proj.technologies.length > 0) {
                        md += `\n**Technologies**: ${proj.technologies.join(", ")}\n`;
                    }
                    md += "\n";
                });
            }

            // Education
            if (resume.education.length > 0) {
                md += `## Education\n\n`;
                resume.education.forEach((edu) => {
                    md += `### ${edu.institution}${edu.location ? ` | ${edu.location}` : ""}\n`;
                    md += `**${edu.degree}** | *${edu.startDate} – ${edu.endDate}*\n\n`;
                    if (edu.description) {
                        md += `${edu.description}\n\n`;
                    }
                });
            }

            // Skills
            if (resume.skills.length > 0) {
                md += `## Skills\n\n`;
                const techSkills = resume.skills.filter(s => s.category === "technical");
                const otherSkills = resume.skills.filter(s => s.category === "additional");

                if (techSkills.length > 0) {
                    md += `**Technical**: ${techSkills.map(s => s.name).join(", ")}\n\n`;
                }
                if (otherSkills.length > 0) {
                    md += `**Additional**: ${otherSkills.map(s => s.name).join(", ")}\n\n`;
                }
            }

            // Awards
            if (resume.awards.length > 0) {
                md += `## Awards & Certifications\n\n`;
                resume.awards.forEach((award) => {
                    md += `### ${award.title}\n`;
                    md += `**${award.issuer}** | *${award.date}*\n\n`;
                    if (award.description) {
                        md += `${award.description}\n\n`;
                    }
                });
            }

            const blob = new Blob([md], { type: "text/markdown" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Markdown export failed:", error);
            throw new Error("Failed to export Markdown");
        }
    }
}
