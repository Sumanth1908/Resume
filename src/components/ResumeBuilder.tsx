import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { RootState } from "../store/store";
import { setResume, createNewResume, setEditing } from "../store/resumeSlice";
import { DatabaseService } from "../services/database";
import { PDFExportService } from "../services/pdfExport";
import { JSONExportService } from "../services/jsonExport";
import { WordExportService } from "../services/wordExport";
import { MarkdownExportService } from "../services/markdownExport";
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
import FloatingAddButton from "./FloatingAddButton";
import Modal from "@cloudscape-design/components/modal";
import Flashbar, { FlashbarProps } from "@cloudscape-design/components/flashbar";
import Tabs from "@cloudscape-design/components/tabs";
import ResumeSettingsPanel from "./ResumeSettingsPanel";
import ResumeStrengthPanel from "./ResumeStrengthPanel";

const ResumeBuilder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toolsOpen, setToolsOpen] = useState(false);
  const { currentResume, isEditing, editingSection, editingItemId } =
    useSelector((state: RootState) => state.resume);

  // Sync activeEditor with Redux state
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notifications, setNotifications] = useState<FlashbarProps.MessageDefinition[]>([]);
  const [lastPersistedAt, setLastPersistedAt] = useState<Date | null>(null);

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

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
            setLastPersistedAt(new Date(resume.updatedAt));
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
    dispatch(setEditing({ isEditing: false, section: "" }));
  };

  const openEditor = (section: string) => {
    dispatch(setEditing({ isEditing: true, section }));
  };

  const resumeRef = React.useRef(currentResume);
  useEffect(() => {
    resumeRef.current = currentResume;
  }, [currentResume]);

  const handleSave = async (isAutoSave = false) => {
    const resumeToSave = resumeRef.current;
    if (!resumeToSave) return;

    if (!isAutoSave) setIsSaving(true);
    try {
      await DatabaseService.saveResume(resumeToSave);
      setLastPersistedAt(new Date());

      // Only show notifications for manual saves
      if (!isAutoSave) {
        setNotifications([
          {
            type: "success",
            content: "Resume saved successfully!",
            dismissible: true,
            onDismiss: () => setNotifications([]),
            id: "save_success"
          }
        ]);
      }
    } catch (error) {
      console.error("Failed to save resume:", error);
      if (!isAutoSave) {
        setNotifications([
          {
            type: "error",
            content: "Failed to save resume. Please try again.",
            dismissible: true,
            onDismiss: () => setNotifications([]),
            id: "save_error"
          }
        ]);
      }
    } finally {
      if (!isAutoSave) setIsSaving(false);
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    if (isPreviewMode) return;

    const interval = setInterval(() => {
      handleSave(true);
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isPreviewMode]); // Only reset if isPreviewMode changes

  const lastSavedTime = lastPersistedAt
    ? lastPersistedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : currentResume?.updatedAt
      ? new Date(currentResume.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      : null;

  const handleExportPDF = async () => {
    const originalPreviewMode = isPreviewMode;
    try {
      // Temporarily switch to preview mode to hide edit buttons
      setIsPreviewMode(true);

      // Wait for the component to re-render
      await new Promise((resolve) => setTimeout(resolve, 100));

      const filename = currentResume?.contactInfo.name
        ? `${currentResume.contactInfo.name.replace(/\s+/g, "_")}_Resume.pdf`
        : "Resume.pdf";

      await PDFExportService.exportToPDF("resume-display", filename);
    } catch (error) {
      console.error("Failed to export PDF:", error);
      setErrorMessage("Failed to export PDF. Please try again.");
      setShowErrorModal(true);
    } finally {
      // Restore original preview mode
      setIsPreviewMode(originalPreviewMode);
    }
  };

  const handleExportWord = async () => {
    if (currentResume) {
      try {
        const filename = currentResume.contactInfo.name
          ? `${currentResume.contactInfo.name.replace(/\s+/g, "_")}_Resume.docx`
          : "Resume.docx";

        await WordExportService.exportToWord(currentResume, filename);
      } catch (error) {
        console.error("Failed to export Word document:", error);
        setErrorMessage("Failed to export Word document. Please try again.");
        setShowErrorModal(true);
      }
    }
  };

  const handleExportJSON = () => {
    if (currentResume) {
      try {
        JSONExportService.exportToJSON(currentResume);
      } catch (error) {
        console.error("Failed to export JSON:", error);
        setErrorMessage("Failed to export JSON. Please try again.");
        setShowErrorModal(true);
      }
    }
  };

  const handleExportMarkdown = () => {
    if (currentResume) {
      try {
        const filename = currentResume.contactInfo.name
          ? `${currentResume.contactInfo.name.replace(/\s+/g, "_")}_Resume.md`
          : "Resume.md";
        MarkdownExportService.exportToMarkdown(currentResume, filename);
      } catch (error) {
        console.error("Failed to export Markdown:", error);
        setErrorMessage("Failed to export Markdown. Please try again.");
        setShowErrorModal(true);
      }
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
  const exportDropdownItems = [
    { id: "pdf", text: "Export as PDF", iconName: "file" as const },
    { id: "word", text: "Export as Word", iconName: "file" as const },
    { id: "markdown", text: "Export as Markdown", iconName: "file" as const },
    { id: "json", text: "Export as JSON", iconName: "file-open" as const },
  ];

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
          type: "menu-dropdown" as const,
          text: "Export",
          items: exportDropdownItems,
          onItemClick: (event: any) => {
            const id = event.detail.id;
            if (id === "pdf") handleExportPDF();
            else if (id === "word") handleExportWord();
            else if (id === "json") handleExportJSON();
            else if (id === "markdown") handleExportMarkdown();
          },
        },
      ]
      : [
        ...(lastSavedTime ? [{
          type: "button" as const,
          variant: "link" as const,
          text: `Last saved: ${lastSavedTime}`,
          disabled: true
        }] : []),
        {
          type: "button" as const,
          iconName: "settings",
          text: "Customize",
          onClick: () => setToolsOpen(!toolsOpen),
        },
        {
          type: "button" as const,
          text: isSaving ? "Saving..." : "Save",
          disabled: isSaving,
          onClick: () => handleSave(false),
        },
        {
          type: "button" as const,
          text: "Preview",
          onClick: togglePreview,
        },
        {
          type: "menu-dropdown" as const,
          text: "Export",
          items: exportDropdownItems,
          onItemClick: (event: any) => {
            const id = event.detail.id;
            if (id === "pdf") handleExportPDF();
            else if (id === "word") handleExportWord();
            else if (id === "json") handleExportJSON();
            else if (id === "markdown") handleExportMarkdown();
          },
        },
      ]),
  ];

  return (
    <>
      {notifications.length > 0 && (
        <div style={{
          position: "fixed",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5000,
          width: "auto",
          minWidth: "300px",
          maxWidth: "90vw"
        }}>
          <Flashbar items={notifications} />
        </div>
      )}
      <div style={{ position: "sticky", top: 0, zIndex: 1001 }}>
        <AppHeader
          title={isPreviewMode ? "Resume Preview" : "Resume Builder"}
          utilities={headerUtilities}
        />
      </div>

      <AppLayout
        contentType="form"
        navigationHide
        toolsHide={isPreviewMode}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        tools={
          <Tabs
            tabs={[
              {
                label: "Settings",
                id: "settings",
                content: <ResumeSettingsPanel />,
              },
              {
                label: "Strength",
                id: "strength",
                content: <ResumeStrengthPanel />,
              },
            ]}
          />
        }
        content={
          <div style={{ scrollPaddingTop: "80px" }}>
            <Container>
              <SpaceBetween size="l">
                {!isPreviewMode && (
                  <FloatingAddButton
                    disabled={activeEditor !== ""}
                    onOpenEditor={openEditor}
                  />
                )}

                <div>
                  <ResumeDisplay
                    resume={currentResume}
                    isPreview={isPreviewMode}
                  />

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
          </div>
        }
      />

      <Modal
        visible={showErrorModal}
        onDismiss={() => setShowErrorModal(false)}
        header="Error"
        closeAriaLabel="Close modal"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowErrorModal(false)}>
                Close
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        {errorMessage}
      </Modal>
    </>
  );
};

export default ResumeBuilder;
