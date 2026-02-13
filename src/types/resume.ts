export interface ContactInfo {
  id: string;
  name: string;
  phone: string;
  email: string;
  linkedin: string;
  tagline: string;
}

export interface Experience {
  id: string;
  company: string;
  location?: string; // Optional: company location (e.g., "Seattle, WA" or "Remote")
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  responsibilities: string[];
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  company?: string; // Optional: tag project with a company from experience
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0-100
  category: "technical" | "additional";
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Award {
  id: string;
  title: string;
  description: string;
  date: string;
  issuer: string;
}

export interface ResumeSettings {
  template: "modern" | "classic" | "executive";
  themeColor: string;
  fontFamily: string;
  sectionVisibility: {
    experience: boolean;
    projects: boolean;
    skills: boolean;
    education: boolean;
    awards: boolean;
  };
}

export interface ResumeData {
  id: string;
  contactInfo: ContactInfo;
  experiences: Experience[];
  projects: Project[];
  skills: Skill[];
  education: Education[];
  awards: Award[];
  settings?: ResumeSettings;
  createdAt: string;
  updatedAt: string;
}
