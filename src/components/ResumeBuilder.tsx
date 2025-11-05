import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { setResume, createNewResume, setEditing } from "../store/resumeSlice";
import { DatabaseService } from "../services/database";
import { PDFExportService } from "../services/pdfExport";
import ResumeDisplay from "./ResumeDisplay";
import ContactInfoEditor from "./editors/ContactInfoEditor";
import ExperienceEditor from "./editors/ExperienceEditor";
import ProjectEditor from "./editors/ProjectEditor";
import SkillEditor from "./editors/SkillEditor";
import EducationEditor from "./editors/EducationEditor";
import AwardEditor from "./editors/AwardEditor";
import "./ResumeBuilder.css";
import Button from "@cloudscape-design/components/button";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Box from "@cloudscape-design/components/box";
import Container from "@cloudscape-design/components/container";
import AppLayout from "@cloudscape-design/components/app-layout";
import AppHeader from "./AppHeader";
import AddSectionDropdown from "./AddSectionDropdown";

const ResumeBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentResume, isEditing, editingSection, editingItemId } =
    useSelector((state: RootState) => state.resume);

  // Sync activeEditor with Redux state
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Use editingSection from Redux instead of local state
  const activeEditor = editingSection;

  // Find the item being edited (if any) so we can pass it into the editors
  const selectedExperience =
    editingItemId && currentResume
      ? currentResume.experiences.find((e) => e.id === editingItemId)
      : undefined;
  const selectedProject =
    editingItemId && currentResume
      ? currentResume.projects.find((p) => p.id === editingItemId)
      : undefined;
  const selectedEducation =
    editingItemId && currentResume
      ? currentResume.education.find((ed) => ed.id === editingItemId)
      : undefined;
  const selectedSkill =
    editingItemId && currentResume
      ? currentResume.skills.find((s) => s.id === editingItemId)
      : undefined;
  const selectedAward =
    editingItemId && currentResume
      ? currentResume.awards.find((a) => a.id === editingItemId)
      : undefined;

  // Debug logging
  console.log("Redux State:", { isEditing, editingSection, activeEditor });

  useEffect(() => {
    const loadResume = async () => {
      setLoading(true);
      try {
        if (id === "new") {
          dispatch(createNewResume());
          setLoading(false); // Set loading to false immediately for new resumes
          // Open contact editor after a short delay to ensure resume is created
          setTimeout(() => {
            dispatch(setEditing({ isEditing: true, section: "contact" }));
          }, 0);
        } else if (id) {
          const resume = await DatabaseService.getResume(id);
          if (resume) {
            dispatch(setResume(resume));
          } else {
            console.error("Resume not found");
            navigate("/");
          }
          setLoading(false);
        } else {
          // No id provided, create new resume
          dispatch(createNewResume());
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load resume:", error);
        navigate("/");
        setLoading(false);
      }
    };
    loadResume();
  }, [dispatch, id, navigate]);

  const closeEditor = () => {
    console.log("Closing editor");
    dispatch(setEditing({ isEditing: false, section: "" }));
  };

  const openEditor = (section: string) => {
    console.log("Opening editor for section:", section);
    dispatch(setEditing({ isEditing: true, section }));
  };

  const handleSave = async () => {
    if (!currentResume) return;

    setIsSaving(true);
    try {
      await DatabaseService.saveResume(currentResume);
      console.log("Resume saved successfully");
      navigate("/");
    } catch (error) {
      console.error("Failed to save resume:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const filename = currentResume?.contactInfo.name
        ? `${currentResume.contactInfo.name.replace(/\s+/g, "_")}_Resume.pdf`
        : "Resume.pdf";

      await PDFExportService.exportToPDF("resume-display", filename);
    } catch (error) {
      console.error("Failed to export PDF:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

  const togglePreview = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  if (loading) {
    return (
      <Box padding="l" textAlign="center">
        <SpaceBetween size="s">
          <Box variant="h2">Loading resume builder...</Box>
          <Box variant="p">Please wait while we load your resume data.</Box>
        </SpaceBetween>
      </Box>
    );
  }

  if (!currentResume) {
    dispatch(createNewResume());
    return null;
  }

  // Removed addSectionItems as we're now defining items directly in navigationItems
  const headerUtilities = [
    // Page actions
    ...(isPreviewMode
      ? [
          {
            type: "button" as const,
            text: "Exit Preview",
            onClick: togglePreview,
          },
          {
            type: "button" as const,
            text: "Export PDF",
            onClick: handleExportPDF,
          },
        ]
      : [
          {
            type: "button" as const,
            text: isSaving ? "Saving..." : "Save",
            disabled: isSaving,
            onClick: handleSave,
          },
          {
            type: "button" as const,
            text: "Preview",
            onClick: togglePreview,
          },
          {
            type: "button" as const,
            text: "Export PDF",
            onClick: handleExportPDF,
          },
        ]),
  ];

  return (
    <AppLayout
      contentType="form"
      navigationHide
      toolsHide
      content={
        <Container>
          <SpaceBetween size="l">
            <AppHeader
              title={isPreviewMode ? "Resume Preview" : "Resume Builder"}
              utilities={headerUtilities}
            />

            {/* Add Section dropdown moved out of header to avoid TopNavigation callback issues */}
            {!isPreviewMode && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: 8,
                }}
              >
                <AddSectionDropdown
                  disabled={activeEditor !== ""}
                  onOpenEditor={openEditor}
                />
              </div>
            )}

            <div>
              <ResumeDisplay resume={currentResume} isPreview={isPreviewMode} />

              {!isPreviewMode && currentResume.experiences.length === 0 && (
                <Box padding={{ vertical: "xl" }} textAlign="center">
                  <SpaceBetween size="s">
                    <Button
                      onClick={() => openEditor("experience")}
                      iconName="add-plus"
                      variant="primary"
                    >
                      Add your first work experience
                    </Button>
                    <Box variant="p" color="text-body-secondary">
                      Click to start adding your professional experience
                    </Box>
                  </SpaceBetween>
                </Box>
              )}
            </div>

            {isEditing && (
              <>
                {activeEditor === "contact" && (
                  <ContactInfoEditor onClose={closeEditor} />
                )}
                {activeEditor === "experience" && (
                  <ExperienceEditor
                    experience={selectedExperience}
                    onClose={closeEditor}
                  />
                )}
                {activeEditor === "project" && (
                  <ProjectEditor
                    project={selectedProject}
                    onClose={closeEditor}
                  />
                )}
                {activeEditor === "skill" && (
                  <SkillEditor skill={selectedSkill} onClose={closeEditor} />
                )}
                {activeEditor === "education" && (
                  <EducationEditor
                    education={selectedEducation}
                    onClose={closeEditor}
                  />
                )}
                {activeEditor === "award" && (
                  <AwardEditor award={selectedAward} onClose={closeEditor} />
                )}
              </>
            )}
          </SpaceBetween>
        </Container>
      }
    />
  );
};

export default ResumeBuilder;
