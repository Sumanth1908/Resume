import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Header from "@cloudscape-design/components/header";
import Box from "@cloudscape-design/components/box";
import ProgressBar from "@cloudscape-design/components/progress-bar";
import StatusIndicator from "@cloudscape-design/components/status-indicator";

const ResumeStrengthPanel: React.FC = () => {
    const resume = useSelector((state: RootState) => state.resume.currentResume);

    if (!resume) return null;

    const checks = [
        {
            label: "Contact Info Complete",
            status: resume.contactInfo.name && resume.contactInfo.email ? "success" : "error",
        },
        {
            label: "Professional Tagline",
            status: resume.contactInfo.tagline ? "success" : "warning",
        },
        {
            label: "Work Experience Added",
            status: resume.experiences.length > 0 ? "success" : "error",
        },
        {
            label: "Skills Listed (min 3)",
            status: resume.skills.length >= 3 ? "success" : "warning",
        },
        {
            label: "Education Details",
            status: resume.education.length > 0 ? "success" : "warning",
        },
    ];

    const score = Math.round(
        (checks.filter((c) => c.status === "success").length / checks.length) * 100
    );

    return (
        <Box padding="m">
            <SpaceBetween size="l">
                <Header
                    variant="h2"
                    description="A checklist to help you improve your resume's impact."
                >
                    Resume Strength
                </Header>

                <ProgressBar
                    value={score}
                    label="Profile Completeness"
                    description={`${score}% complete`}
                    variant="flash"
                />

                <SpaceBetween size="xs">
                    {checks.map((check, index) => (
                        <div key={index} style={{ padding: "4px 0" }}>
                            <StatusIndicator type={check.status as any}>
                                {check.label}
                            </StatusIndicator>
                        </div>
                    ))}
                </SpaceBetween>

                {score === 100 && (
                    <Box variant="p" color="text-status-success">
                        ✨ Your resume is looking great and ready to export!
                    </Box>
                )}
            </SpaceBetween>
        </Box>
    );
};

export default ResumeStrengthPanel;
