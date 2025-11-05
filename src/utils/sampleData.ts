import { ResumeData } from "../types/resume";
import { v4 as uuidv4 } from "uuid";

export const createSampleResume = (): ResumeData => {
  const resumeId = uuidv4();

  return {
    id: resumeId,
    contactInfo: {
      id: uuidv4(),
      name: "Sumanth Jillepally",
      phone: "+911234567890",
      email: "sample@email.com",
      linkedin: "https://linkedin.com/in/sumanthjillepally",
      tagline:
        "sample tagline: Passionate Software Engineer with 5+ years of experience in developing scalable web applications and services.",
    },
    experiences: [
      {
        id: uuidv4(),
        company: "Sample Company, Sample Location",
        position: "Sample Position",
        startDate: "October 2024",
        endDate: "",
        current: true,
        description:
          "As a Senior Software Development Engineer at Sample Company, I lead the design and implementation of scalable software solutions that drive business growth. My role involves collaborating with cross-functional teams to deliver high-quality applications while mentoring junior engineers and promoting best practices in software development.",
        responsibilities: [
          "Sample responsibility one for the sample company project",
          "Sample responsibility two for the sample company project",
        ],
      },
      {
        id: uuidv4(),
        company: "Amazon, Bangalore",
        position: "Software Development Engineer",
        startDate: "May 2021",
        endDate: "October 2024",
        current: false,
        description:
          "Sample description for Amazon experience. Worked on various projects involving cloud computing, distributed systems, and application development.",
        responsibilities: [],
      },
    ],
    projects: [
      {
        id: uuidv4(),
        title: "Sample",
        subtitle: "Sample",
        description: "Sample",
        responsibilities: ["Sample", "Sample"],
        technologies: ["Java", "Python", "JavaScript", "Maven", "npm", "PyPI"],
      },
    ],
    skills: [
      {
        id: uuidv4(),
        name: "Git & Dev tools",
        level: 80,
        category: "technical",
      },
      {
        id: uuidv4(),
        name: "Python",
        level: 85,
        category: "technical",
      },
      {
        id: uuidv4(),
        name: "Java",
        level: 80,
        category: "technical",
      },
      {
        id: uuidv4(),
        name: "JS, TS, React",
        level: 70,
        category: "technical",
      },
      {
        id: uuidv4(),
        name: "Docker",
        level: 80,
        category: "technical",
      },
      {
        id: uuidv4(),
        name: "Databases",
        level: 75,
        category: "technical",
      },
      {
        id: uuidv4(),
        name: "AWS",
        level: 80,
        category: "technical",
      },
      {
        id: uuidv4(),
        name: "System design",
        level: 0,
        category: "additional",
      },
      {
        id: uuidv4(),
        name: "Infrastructure, CDK",
        level: 0,
        category: "additional",
      },
      {
        id: uuidv4(),
        name: "Pipelines & CI/CD",
        level: 0,
        category: "additional",
      },
    ],
    education: [
      {
        id: uuidv4(),
        institution: "Chaitanya Bharathi Institute of Technology",
        degree:
          "Bachelor of Engineering - Electronics and Communications Engineering",
        location: "Hyderabad",
        startDate: "June 2012",
        endDate: "May 2016",
        description:
          "As part of my Bachelors, I have completed my graduation in ECE with an overall aggregate of 79%.",
      },
    ],
    awards: [
      {
        id: uuidv4(),
        title: "Excellence in Software Development",
        description:
          "Recognized for outstanding contribution to system architecture",
        date: "2024",
        issuer: "Amazon",
      },
      {
        id: uuidv4(),
        title: "AWS Certified Solutions Architect",
        description: "Professional level certification in cloud architecture",
        date: "2023",
        issuer: "Amazon Web Services",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
