import { ResumeData } from "../types/resume";
import { v4 as uuidv4 } from "uuid";

export const createSampleResume = (): ResumeData => {
  const resumeId = uuidv4();

  return {
    id: resumeId,
    contactInfo: {
      id: uuidv4(),
      name: "Sumanth Jillepally",
      phone: "[MOBILE_NUMBER]",
      email: "[EMAIL_ADDRESS]",
      linkedin: "linkedin.com/in/sumanthjillepally",
      tagline:
        "Senior Software Engineer specializing in distributed systems, cloud architecture, and high-performance web applications. Proven track record of delivering scalable solutions at global scale.",
    },
    experiences: [
      {
        id: uuidv4(),
        company: "COMPANY_NAME",
        location: "Bangalore, India",
        position: "Senior Software Engineer",
        startDate: "October 2024",
        endDate: "",
        current: true,
        description:
          "Leading the development of core infrastructure services for Google Cloud Platform, focusing on reliability and scalability of distributed database systems.",
        responsibilities: [
          "Architected and deployed a multi-region service mesh that reduced inter-service latency by 35% across 200+ microservices.",
          "Mentored specialized teams in Go and Kubernetes best practices, improving sprint velocity by 20%.",
          "Drove the migration of legacy monoliths to a cloud-native architecture, resulting in $2M annual infrastructure savings.",
        ],
      },
      {
        id: uuidv4(),
        company: "COMPANY_NAME",
        location: "Hyderabad, India",
        position: "Software Development Engineer",
        startDate: "May 2021",
        endDate: "October 2024",
        current: false,
        description:
          "Engaged in the design and ownership of mission-critical components within the Amazon Fulfillment Network, processing millions of transactions daily.",
        responsibilities: [
          "Optimized high-throughput data processing pipelines using AWS Kinesis and Lambda, handling 1M+ events per second.",
          "Led the implementation of a real-time inventory tracking system that improved stock accuracy by 15%.",
          "Received the 'Tech Excellence' award for redesigning the edge-cache strategy that halved page load times for the seller portal.",
        ],
      },
    ],
    projects: [
      {
        id: uuidv4(),
        title: "Open Source Cloud CLI",
        subtitle: "Infrastructure-as-Code Tooling",
        description:
          "An open-source CLI tool written in Rust designed to simplify AWS resource provisioning using high-level abstractions.",
        responsibilities: [
          "Grew the project to 5k+ GitHub stars and a community of 50+ contributors.",
          "Implemented a robust plugin system allowing third-party extensions for Azure and GCP support.",
        ],
        technologies: ["Rust", "Tokio", "AWS SDK", "Docker", "GitHub Actions"],
      },
    ],
    skills: [
      {
        id: uuidv4(),
        name: "Go & Rust",
        level: 95,
        category: "technical",
      },
      {
        id: uuidv4(),
        name: "React, TS & Node.js",
        level: 90,
        category: "technical",
      },
      {
        id: uuidv4(),
        name: "AWS & Kubernetes",
        level: 92,
        category: "technical",
      },
      {
        id: uuidv4(),
        name: "Distributed Systems",
        level: 88,
        category: "technical",
      },
      {
        id: uuidv4(),
        name: "System Design",
        level: 90,
        category: "technical",
      },
      {
        id: uuidv4(),
        name: "Agile Leadership",
        level: 0,
        category: "additional",
      },
      {
        id: uuidv4(),
        name: "Technical Mentoring",
        level: 0,
        category: "additional",
      },
      {
        id: uuidv4(),
        name: "Public Speaking",
        level: 0,
        category: "additional",
      },
    ],
    education: [
      {
        id: uuidv4(),
        institution: "Chaitanya Bharathi Institute of Technology",
        degree: "B.E. in Electronics and Communications Engineering",
        location: "Hyderabad",
        startDate: "June 2012",
        endDate: "May 2016",
        description:
          "Graduated with Distinction. Focused on Signal Processing and Digital Systems Design.",
      },
    ],
    awards: [
      {
        id: uuidv4(),
        title: "Amazon Tech Excellence",
        description: "Awarded for outstanding innovation in fulfillment tech.",
        date: "2023",
        issuer: "Amazon",
      },
      {
        id: uuidv4(),
        title: "AWS Certified Architect",
        description: "Professional level certification.",
        date: "2022",
        issuer: "Amazon Web Services",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};
