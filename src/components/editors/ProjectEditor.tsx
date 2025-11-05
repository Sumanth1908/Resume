import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addProject, updateProject } from "../../store/resumeSlice";
import { Project } from "../../types/resume";
import "./Editor.css";
import Modal from "@cloudscape-design/components/modal";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Textarea from "@cloudscape-design/components/textarea";
import { Grid } from "@cloudscape-design/components";

interface ProjectEditorProps {
  project?: Project;
  onClose: () => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onClose }) => {
  const dispatch = useDispatch();
  const isEditing = !!project;

  const [formData, setFormData] = useState<Omit<Project, "id">>({
    title: "",
    subtitle: "",
    description: "",
    responsibilities: [""],
    technologies: [""],
  });

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        subtitle: project.subtitle,
        description: project.description,
        responsibilities:
          project.responsibilities.length > 0 ? project.responsibilities : [""],
        technologies:
          project.technologies.length > 0 ? project.technologies : [""],
      });
    }
  }, [project]);

  const handleChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (
    field: "responsibilities" | "technologies",
    index: number,
    value: string
  ) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData((prev) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: "responsibilities" | "technologies") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...prev[field], ""],
    }));
  };

  const removeArrayItem = (
    field: "responsibilities" | "technologies",
    index: number
  ) => {
    if (formData[field].length > 1) {
      const newArray = formData[field].filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, [field]: newArray }));
    }
  };

  const [visible, setVisible] = useState(true);

  const handleSubmit = () => {
    const cleanedData = {
      ...formData,
      responsibilities: formData.responsibilities.filter(
        (r) => r.trim() !== ""
      ),
      technologies: formData.technologies.filter((t) => t.trim() !== ""),
    };

    if (isEditing && project) {
      dispatch(updateProject({ ...cleanedData, id: project.id }));
    } else {
      dispatch(addProject(cleanedData));
    }
    setVisible(false);
    onClose();
  };

  const handleCancel = () => {
    setVisible(false);
    onClose();
  };

  return (
    <Modal
      onDismiss={handleCancel}
      visible={visible}
      header={isEditing ? "Edit Project" : "Add New Project"}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={handleCancel} variant="link">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="primary">
              {isEditing ? "Update Project" : "Add Project"}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <Form>
        <Grid
          gridDefinition={[
            { colspan: 12 },
            { colspan: 12 },
            { colspan: 12 },
            { colspan: 12 },
            { colspan: 12 },
          ]}
        >
          <FormField
            label="Project Title"
            description="Name of your project"
            stretch
          >
            <Input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange(e.detail.value, "title")}
              placeholder="e.g., E-commerce Platform, Mobile App"
            />
          </FormField>

          <FormField
            label="Project Subtitle"
            description="Brief one-line description"
            stretch
          >
            <Input
              type="text"
              value={formData.subtitle}
              onChange={(e) => handleChange(e.detail.value, "subtitle")}
              placeholder="Brief one-line description"
            />
          </FormField>

          <FormField
            label="Project Description"
            description="Detailed description of the project"
            stretch
          >
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange(e.detail.value, "description")}
              rows={4}
              placeholder="Detailed description of the project, its purpose, and impact"
            />
          </FormField>

          <FormField
            label="Technologies Used"
            description="List the technologies used in this project"
            stretch
          >
            <div className="dynamic-list">
              {formData.technologies.map((tech, index) => (
                <Grid
                  key={index}
                  gridDefinition={[{ colspan: 11 }, { colspan: 1 }]}
                >
                  <Input
                    type="text"
                    value={tech}
                    onChange={(e) =>
                      handleArrayChange("technologies", index, e.detail.value)
                    }
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                  {formData.technologies.length > 1 && (
                    <Button
                      onClick={() => removeArrayItem("technologies", index)}
                      variant="icon"
                      iconName="close"
                    />
                  )}
                </Grid>
              ))}
              <Button
                onClick={() => addArrayItem("technologies")}
                variant="normal"
                iconName="add-plus"
              >
                Add Technology
              </Button>
            </div>
          </FormField>

          <FormField
            label="Key Responsibilities & Achievements"
            description="List your main contributions to the project"
            stretch
          >
            <div className="dynamic-list">
              {formData.responsibilities.map((responsibility, index) => (
                <Grid
                  key={index}
                  gridDefinition={[{ colspan: 11 }, { colspan: 1 }]}
                >
                  <Input
                    type="text"
                    value={responsibility}
                    onChange={(e) =>
                      handleArrayChange(
                        "responsibilities",
                        index,
                        e.detail.value
                      )
                    }
                    placeholder="Describe your role or achievement in this project"
                  />
                  {formData.responsibilities.length > 1 && (
                    <Button
                      onClick={() => removeArrayItem("responsibilities", index)}
                      variant="icon"
                      iconName="close"
                    />
                  )}
                </Grid>
              ))}
              <Button
                onClick={() => addArrayItem("responsibilities")}
                variant="normal"
                iconName="add-plus"
              >
                Add Responsibility
              </Button>
            </div>
          </FormField>
        </Grid>
      </Form>
    </Modal>
  );
};

export default ProjectEditor;
