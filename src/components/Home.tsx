import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DatabaseService } from "../services/database";
import { ResumeData } from "../types/resume";
import { createSampleResume } from "../utils/sampleData";
import "./Home.css";
import Button from "@cloudscape-design/components/button";
import Header from "@cloudscape-design/components/header";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Input from "@cloudscape-design/components/input";
import Cards from "@cloudscape-design/components/cards";
import Box from "@cloudscape-design/components/box";
import TextContent from "@cloudscape-design/components/text-content";
import Grid from "@cloudscape-design/components/grid";
import { AppLayout, Container } from "@cloudscape-design/components";
import AppHeader from "./AppHeader";

const Home: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

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

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      try {
        await DatabaseService.deleteResume(id);
        loadResumes();
      } catch (error) {
        console.error("Failed to delete resume:", error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
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
    <AppLayout
      toolsHide
      navigationHide
      content={
        <Container>
          <SpaceBetween size="l">
            <AppHeader />
            <Header
              variant="h1"
              actions={
                <SpaceBetween direction="horizontal" size="xs">
                  <Input
                    type="search"
                    placeholder="Search ..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.detail.value)}
                  />
                  <Button
                    variant="primary"
                    onClick={() => handleCreateNew(false)}
                    iconName="add-plus"
                  >
                    New Resume
                  </Button>
                  <Button
                    variant="normal"
                    onClick={() => handleCreateNew(true)}
                    iconName="file"
                  >
                    Use Template
                  </Button>
                </SpaceBetween>
              }
            ></Header>

            {resumes.length === 0 ? (
              <Box textAlign="center" margin={{ top: "xxl" }}>
                <TextContent>
                  <h2>No resumes found</h2>
                  <p>Create a new resume or use our template to get started</p>
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
                      variant="normal"
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
                  header: (item) => item.contactInfo.name || "Untitled Resume",
                  sections: [
                    {
                      content: (item) => (
                        <SpaceBetween size="s">
                          <div>{item.contactInfo.email}</div>
                          <Grid>
                            <div>
                              Last updated: {formatDate(item.updatedAt)}
                            </div>
                            <Button
                              variant="icon"
                              iconName="edit"
                              onClick={() => navigate(`/resume/${item.id}`)}
                            ></Button>
                            <Button
                              variant="icon"
                              iconName="remove"
                              onClick={() => handleDelete(item.id)}
                            ></Button>
                          </Grid>
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
                  <Header counter={`(${resumes.length})`}>Your Resumes</Header>
                }
              />
            )}
          </SpaceBetween>
        </Container>
      }
    />
  );
};

export default Home;
