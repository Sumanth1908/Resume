import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DatabaseService } from "../services/database";
import { ResumeData } from "../types/resume";
import { createSampleResume } from "../utils/sampleData";
import { formatDateDetailed } from "../utils/dateUtils";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Input from "@cloudscape-design/components/input";
import Cards from "@cloudscape-design/components/cards";
import Box from "@cloudscape-design/components/box";
import TextContent from "@cloudscape-design/components/text-content";
import { AppLayout, Container } from "@cloudscape-design/components";
import Modal from "@cloudscape-design/components/modal";
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";
import AppHeader from "./AppHeader";
import Footer from "./Footer";
import { JSONExportService } from "../services/jsonExport";
import Flashbar, { FlashbarProps } from "@cloudscape-design/components/flashbar";

const Home: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [notifications, setNotifications] = useState<FlashbarProps.MessageDefinition[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        setNotifications([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications]);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    setLoading(true);
    try {
      const loadedResumes = await DatabaseService.getAllResumes();
      setResumes(loadedResumes);
    } catch (error) {
      console.error("Failed to load resumes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      loadResumes();
    } else {
      const results = await DatabaseService.searchResumes(query);
      setResumes(results);
    }
  };

  const handleCreateNew = async (useSample: boolean = false) => {
    if (useSample) {
      const sampleResume = createSampleResume();
      await DatabaseService.saveResume(sampleResume);
      navigate(`/resume/${sampleResume.id}`);
    } else {
      navigate("/resume/new");
    }
  };

  const handleDelete = (id: string) => {
    setResumeToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (resumeToDelete) {
      try {
        await DatabaseService.deleteResume(resumeToDelete);
        loadResumes();
        setShowDeleteModal(false);
        setResumeToDelete(null);
        setNotifications([{
          type: "success",
          content: "Resume deleted successfully",
          dismissible: true,
          onDismiss: () => setNotifications([]),
          id: "delete_success"
        }]);
      } catch (error) {
        console.error("Failed to delete resume:", error);
        setNotifications([{
          type: "error",
          content: "Failed to delete resume",
          dismissible: true,
          onDismiss: () => setNotifications([]),
          id: "delete_error"
        }]);
      }
    }
  };

  const handleImportJSON = () => {
    setShowImportModal(true);
  };

  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".json")) {
      alert("Please select a valid JSON file.");
      return;
    }

    setIsImporting(true);
    try {
      const importedResume = await JSONExportService.importFromJSON(file);
      await DatabaseService.saveResume(importedResume);
      setNotifications([{
        type: "success",
        content: "Resume imported successfully",
        dismissible: true,
        onDismiss: () => setNotifications([]),
        id: "import_success"
      }]);
      setTimeout(() => navigate(`/resume/${importedResume.id}`), 1000);
      setShowImportModal(false);
    } catch (error) {
      console.error("Failed to import JSON:", error);
      setNotifications([{
        type: "error",
        content: error instanceof Error ? error.message : "Failed to import JSON",
        dismissible: true,
        onDismiss: () => setNotifications([]),
        id: "import_error"
      }]);
    } finally {
      setIsImporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDateDetailed(dateString);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading resumes...</p>
      </div>
    );
  }

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
        <AppHeader title="Resume Builder" />
      </div>
      <AppLayout
        toolsHide
        navigationHide
        content={
          <Container>
            <SpaceBetween size="l">
              <Header
                variant="h1"
                description="Manage and create your professional resumes."
              >
                Resume Dashboard
              </Header>
              <Header
                variant="h2"
                actions={
                  <SpaceBetween direction="horizontal" size="xs">
                    <Input
                      type="search"
                      placeholder="Search ..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.detail.value)}
                    />
                    <ButtonDropdown
                      items={[
                        { id: "new", text: "New Resume", iconName: "add-plus" },
                        {
                          id: "template",
                          text: "New from Template",
                          iconName: "file",
                        },
                        {
                          id: "import",
                          text: "Import from JSON",
                          iconName: "upload",
                        },
                      ]}
                      onItemClick={(event) => {
                        const id = event.detail.id;
                        if (id === "new") handleCreateNew(false);
                        else if (id === "template") handleCreateNew(true);
                        else if (id === "import") handleImportJSON();
                      }}
                    >
                      Create Resume
                    </ButtonDropdown>
                  </SpaceBetween>
                }
              ></Header>

              {resumes.length === 0 ? (
                <Box textAlign="center" margin={{ top: "xxl" }}>
                  <TextContent>
                    <h2>No resumes found</h2>
                    <p>
                      Create a new resume or use our template to get started
                    </p>
                  </TextContent>
                  <Box margin={{ top: "l" }}>
                    <SpaceBetween direction="horizontal" size="xs">
                      <Button
                        variant="primary"
                        onClick={() => handleCreateNew(false)}
                        iconName="add-plus"
                      >
                        Create New Resume
                      </Button>
                      <Button
                        onClick={() => handleCreateNew(true)}
                        iconName="file"
                      >
                        Use Template
                      </Button>
                    </SpaceBetween>
                  </Box>
                </Box>
              ) : (
                <Cards
                  items={resumes}
                  cardDefinition={{
                    header: (item) => (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>
                          {item.contactInfo.name || "Untitled Resume"}
                        </span>
                        <SpaceBetween direction="horizontal" size="xs">
                          <Button
                            variant="icon"
                            iconName="edit"
                            onClick={() => navigate(`/resume/${item.id}`)}
                          />
                          <Button
                            variant="icon"
                            iconName="remove"
                            onClick={() => handleDelete(item.id)}
                          />
                        </SpaceBetween>
                      </div>
                    ),
                    sections: [
                      {
                        content: (item) => (
                          <SpaceBetween size="s">
                            <div>{item.contactInfo.email}</div>
                            <div style={{ fontStyle: "italic" }}>
                              Last updated: {formatDate(item.updatedAt)}
                            </div>
                          </SpaceBetween>
                        ),
                      },
                    ],
                  }}
                  cardsPerRow={[
                    { cards: 1, minWidth: 0 },
                    { cards: 2, minWidth: 500 },
                    { cards: 3, minWidth: 900 },
                  ]}
                  header={
                    <Header counter={`(${resumes.length})`}>
                      Your Resumes
                    </Header>
                  }
                />
              )}
              <Footer />
            </SpaceBetween>
          </Container>
        }
      />

      <Modal
        visible={showDeleteModal}
        onDismiss={() => setShowDeleteModal(false)}
        header="Delete Resume"
        closeAriaLabel="Close modal"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={confirmDelete}>
                Delete
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        Are you sure you want to delete this resume? This action cannot be
        undone.
      </Modal>

      <Modal
        visible={showImportModal}
        onDismiss={() => setShowImportModal(false)}
        header="Import Resume from JSON"
        closeAriaLabel="Close modal"
        footer={
          <Box float="right">
            <SpaceBetween direction="horizontal" size="xs">
              <Button variant="link" onClick={() => setShowImportModal(false)}>
                Cancel
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween size="m">
          <div>
            Select a JSON file exported from this resume builder to import it.
            The imported resume will be saved as a new resume.
          </div>
          <input
            type="file"
            accept=".json"
            onChange={handleFileImport}
            disabled={isImporting}
            style={{ marginTop: "8px" }}
          />
          {isImporting && <div>Importing...</div>}
        </SpaceBetween>
      </Modal>
    </>
  );
};

export default Home;
