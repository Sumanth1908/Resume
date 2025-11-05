import { ResumeData } from "../types/resume";
import { v4 as uuidv4 } from "uuid";

export const createSampleResume = (): ResumeData => {
  const resumeId = uuidv4();

  return {
    id: resumeId,
    contactInfo: {
      id: uuidv4(),
      name: "Sumanth Jillepally",
      phone: "+919010234192",
      email: "sumanthjillepally@gmail.com",
      linkedin: "https://linkedin.com/in/sumanthjillepally",
      tagline:
        "Results-driven Software Development Engineer with extensive experience in designing and implementing robust applications, databases, cloud computing and distributed computing solutions. Recognized for exceptional troubleshooting and debugging skills, consistently resolving complex technical challenges to enhance system performance and reliability. Expertise in collaborating with cross-functional teams to deliver innovative solutions that align with business objectives. Committed to continuous learning and staying abreast of industry trends, driving technological advancements that foster organizational growth.",
    },
    experiences: [
      {
        id: uuidv4(),
        company: "Electronic Arts, Hyderabad",
        position: "Software Engineer III",
        startDate: "October 2024",
        endDate: "",
        current: true,
        description:
          "At Electronic Arts (EA), I developed a scalable, low-latency, event-driven system that facilitates data moderation, transformation, and discovery across game integrators. I spearheaded the complete lifecycle of an AI-driven synthetic data generation initiative at the organizational level, utilizing Agentic AI solutions. Collaborating with cross-functional teams, I implemented Agile methodologies, which enhanced project delivery timelines and team productivity. Additionally, I mentored junior engineers through code reviews and knowledge sharing, fostering skill development and team cohesion.",
        responsibilities: [
          "Developed scalable, low-latency, event-driven systems for data processing",
          "Led AI-driven synthetic data generation initiative using Agentic AI solutions",
          "Implemented Agile methodologies to enhance project delivery timelines",
          "Mentored junior engineers through code reviews and knowledge sharing",
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
          "As part of the Application Engineering team, I have worked as a full stack developer and developed applications on AWS for internal teams in the Amazon Advertising Org, as per Amazonian standards. My prime goal is to innovate and develop applications that contribute to improving user experiences, solving customer problems, and creating revenue.",
        responsibilities: [],
      },
    ],
    projects: [
      {
        id: uuidv4(),
        title: "Shared Libraries – Java, Python, JavaScript Packages",
        subtitle:
          "Developed common/shared libraries in Python, Java and JavaScript. These libraries provide easy way to integrate the most common features that are needed for the applications developed by the team.",
        description:
          "Created comprehensive shared libraries across multiple programming languages to standardize common functionalities and improve development efficiency across the organization.",
        responsibilities: [
          "Identified and developed packages encapsulating most common functionalities in a generic way, improving code coverage and reusability",
          "Developed package which encapsulated the operations needed for authorization calls to perform service to service calls",
          "Established coding standards and documentation for library usage across teams",
        ],
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
