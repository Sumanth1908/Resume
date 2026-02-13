import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updateSettings } from "../store/resumeSlice";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Header from "@cloudscape-design/components/header";
import FormField from "@cloudscape-design/components/form-field";
import RadioGroup from "@cloudscape-design/components/radio-group";
import Toggle from "@cloudscape-design/components/toggle";
import Select from "@cloudscape-design/components/select";
import Box from "@cloudscape-design/components/box";
import Container from "@cloudscape-design/components/container";

const templates = [
    { value: "modern", label: "Modern (Two Column)" },
    { value: "classic", label: "Classic (Single Column)" },
    { value: "executive", label: "Executive (Professional)" },
];

const colors = [
    { value: "#0972d3", label: "Cloudscape Blue (Standard)" },
    { value: "#1b263b", label: "Midnight Navy (Executive)" },
    { value: "#006d77", label: "Deep Teal (Modern)" },
    { value: "#2c3e50", label: "Slate Grey (Minimalist)" },
    { value: "#1a73e8", label: "Google Blue (Clean)" },
    { value: "#2d6a4f", label: "Forest Green (Reliable)" },
    { value: "#722f37", label: "Bordeaux (Elegant)" },
    { value: "#bc6c4b", label: "Terracotta (Warm)" },
    { value: "#8e44ad", label: "Royal Purple (Creativity)" },
];

const fonts = [
    { value: "Inter, sans-serif", label: "Inter (Corporate Modern)" },
    { value: "'Roboto', sans-serif", label: "Roboto (Clean & Readable)" },
    { value: "'Montserrat', sans-serif", label: "Montserrat (Tech & Design)" },
    { value: "'Lato', sans-serif", label: "Lato (Balanced & Friendly)" },
    { value: "'Merriweather', serif", label: "Merriweather (Trustworthy Serif)" },
    { value: "'Lora', serif", label: "Lora (Contemporary Serif)" },
    { value: "'EB Garamond', serif", label: "EB Garamond (Academic & Classic)" },
    { value: "'Playfair Display', serif", label: "Playfair (High-End & Bold)" },
];

const alignments = [
    { value: "left", label: "Left" },
    { value: "justify", label: "Justify" },
];

const ResumeSettingsPanel: React.FC = () => {
    const dispatch = useDispatch();
    const settings = useSelector(
        (state: RootState) => state.resume.currentResume?.settings
    );

    if (!settings) return null;

    const handleTemplateChange = (value: string) => {
        dispatch(updateSettings({ template: value as any }));
    };

    const handleColorChange = (value: string) => {
        dispatch(updateSettings({ themeColor: value }));
    };

    const handleFontChange = (value: string) => {
        dispatch(updateSettings({ fontFamily: value }));
    };

    const handleAlignmentChange = (value: string) => {
        dispatch(updateSettings({ textAlignment: value as any }));
    };

    const handleVisibilityToggle = (section: string, visible: boolean) => {
        dispatch(
            updateSettings({
                sectionVisibility: {
                    ...settings.sectionVisibility,
                    [section]: visible,
                },
            })
        );
    };

    return (
        <Box padding="m">
            <SpaceBetween size="xl">
                <Header variant="h2">Customization</Header>

                <Container header={<Header variant="h3">Layout Template</Header>}>
                    <RadioGroup
                        onChange={({ detail }) => handleTemplateChange(detail.value)}
                        value={settings.template}
                        items={templates}
                    />
                </Container>

                <Container header={<Header variant="h3">Theming</Header>}>
                    <SpaceBetween size="l">
                        <FormField label="Accent Color">
                            <Select
                                selectedOption={
                                    colors.find((c) => c.value === settings.themeColor) || colors[0]
                                }
                                onChange={({ detail }) =>
                                    handleColorChange(detail.selectedOption.value!)
                                }
                                options={colors}
                            />
                        </FormField>

                        <FormField label="Font Family">
                            <Select
                                selectedOption={
                                    fonts.find((f) => f.value === settings.fontFamily) || fonts[0]
                                }
                                onChange={({ detail }) =>
                                    handleFontChange(detail.selectedOption.value!)
                                }
                                options={fonts}
                            />
                        </FormField>

                        <FormField label="Text Alignment">
                            <RadioGroup
                                onChange={({ detail }) => handleAlignmentChange(detail.value)}
                                value={settings.textAlignment || 'left'}
                                items={alignments}
                            />
                        </FormField>
                    </SpaceBetween>
                </Container>

                <Container header={<Header variant="h3">Sections Visibility</Header>}>
                    <SpaceBetween size="s">
                        <Toggle
                            onChange={({ detail }) =>
                                handleVisibilityToggle("experience", detail.checked)
                            }
                            checked={settings.sectionVisibility.experience}
                        >
                            Experience
                        </Toggle>
                        <Toggle
                            onChange={({ detail }) =>
                                handleVisibilityToggle("projects", detail.checked)
                            }
                            checked={settings.sectionVisibility.projects}
                        >
                            Projects
                        </Toggle>
                        <Toggle
                            onChange={({ detail }) =>
                                handleVisibilityToggle("skills", detail.checked)
                            }
                            checked={settings.sectionVisibility.skills}
                        >
                            Skills
                        </Toggle>
                        <Toggle
                            onChange={({ detail }) =>
                                handleVisibilityToggle("education", detail.checked)
                            }
                            checked={settings.sectionVisibility.education}
                        >
                            Education
                        </Toggle>
                        <Toggle
                            onChange={({ detail }) =>
                                handleVisibilityToggle("awards", detail.checked)
                            }
                            checked={settings.sectionVisibility.awards}
                        >
                            Awards & Certifications
                        </Toggle>
                    </SpaceBetween>
                </Container>
            </SpaceBetween>
        </Box>
    );
};

export default ResumeSettingsPanel;
