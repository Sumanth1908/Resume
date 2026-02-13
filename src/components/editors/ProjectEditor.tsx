import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProject, updateProject } from "../../store/resumeSlice";
import { Project } from "../../types/resume";
import { RootState } from "../../store/store";
import { polishBulletPoint } from "../../utils/aiUtils";
import { FEATURE_FLAGS } from "../../config/featureFlags";
import "./Editor.css";
import Modal from "@cloudscape-design/components/modal";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Textarea from "@cloudscape-design/components/textarea";
import Select from "@cloudscape-design/components/select";

interface ProjectEditorProps {
  project?: Project;
  onClose: () => void;
}

const ProjectEditor: React.FC<ProjectEditorProps> = ({ project, onClose }) => {
  const dispatch = useDispatch();
  const isEditing = !!project;

  // Get experiences from Redux store to populate company dropdown
  const experiences = useSelector(
    (state: RootState) => state.resume.currentResume?.experiences || []
  );

  const [formData, setFormData] = useState<Omit<Project, "id">>({
    title: "",
    subtitle: "",
    description: "",
    responsibilities: [""],
    technologies: [""],
    company: undefined,
  });

  // Selected company option for the Select component
  const [selectedCompany, setSelectedCompany] = useState<{
    label: string;
    value: string;
  } | null>(null);

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
        company: project.company,
      });

      // Set selected company option
      if (project.company) {
        setSelectedCompany({ label: project.company, value: project.company });
      } else {
        setSelectedCompany({ label: "None", value: "" });
      }
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

  const moveArrayItem = (
    field: "responsibilities" | "technologies",
    index: number,
    direction: "up" | "down"
  ) => {
    const newArray = [...formData[field]];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newArray.length) {
      const temp = newArray[newIndex];
      newArray[newIndex] = newArray[index];
      newArray[index] = temp;
      setFormData((prev) => ({ ...prev, [field]: newArray }));
    }
  };

  const [polishingIndex, setPolishingIndex] = useState<number | null>(null);
  const [isPolishingDesc, setIsPolishingDesc] = useState(false);

  const handlePolishItem = async (index: number) => {
    const text = formData.responsibilities[index];
    if (!text) return;

    setPolishingIndex(index);
    try {
      const polished = await polishBulletPoint(text);
      handleArrayChange("responsibilities", index, polished);
    } finally {
      setPolishingIndex(null);
    }
  };

  const handlePolishDescription = async () => {
    if (!formData.description) return;

    setIsPolishingDesc(true);
    try {
      const polished = await polishBulletPoint(formData.description);
      setFormData((prev) => ({ ...prev, description: polished }));
    } finally {
      setIsPolishingDesc(false);
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
      <Form className="editor-form">
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
          label="Company"
          description="Associate this project with a company from your experience (optional)"
          stretch
        >
          <Select
            selectedOption={selectedCompany}
            onChange={({ detail }) => {
              const option = detail.selectedOption;
              if (option && option.label && option.value !== undefined) {
                setSelectedCompany({ label: option.label, value: option.value });
                setFormData((prev) => ({
                  ...prev,
                  company: option.value || undefined,
                }));
              }
            }}
            options={[
              { label: "None", value: "" },
              ...experiences.map((exp) => ({
                label: exp.company,
                value: exp.company,
              })),
            ]}
            placeholder="Select a company (optional)"
          />
        </FormField>

        <FormField
          description="Detailed description of the project"
          stretch
        >
          <div style={{ position: "relative" }}>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange(e.detail.value, "description")}
              rows={4}
              placeholder="Detailed description of the project, its purpose, and impact"
            />
            {FEATURE_FLAGS.AI_POLISH && (
              <div style={{ position: "absolute", bottom: "8px", right: "8px" }}>
                <Button
                  variant="icon"
                  iconName="gen-ai"
                  loading={isPolishingDesc}
                  onClick={handlePolishDescription}
                  ariaLabel="Polish with AI"
                />
              </div>
            )}
          </div>
        </FormField>

        <FormField
          label="Technologies Used"
          description="List the technologies used in this project"
          stretch
        >
          <div className="dynamic-list">
            {formData.technologies.map((tech, index) => (
              <div key={index} className="list-item">
                <div className="list-item-content">
                  <Input
                    type="text"
                    value={tech}
                    onChange={(e) =>
                      handleArrayChange("technologies", index, e.detail.value)
                    }
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </div>
                <SpaceBetween direction="horizontal" size="xs">
                  {formData.technologies.length > 1 && (
                    <>
                      <Button
                        onClick={() => moveArrayItem("technologies", index, "up")}
                        variant="icon"
                        iconName="angle-up"
                        disabled={index === 0}
                        ariaLabel="Move up"
                      />
                      <Button
                        onClick={() => moveArrayItem("technologies", index, "down")}
                        variant="icon"
                        iconName="angle-down"
                        disabled={index === formData.technologies.length - 1}
                        ariaLabel="Move down"
                      />
                      <Button
                        onClick={() => removeArrayItem("technologies", index)}
                        variant="icon"
                        iconName="remove"
                        ariaLabel="Remove technology"
                      />
                    </>
                  )}
                </SpaceBetween>
              </div>
            ))}
            <Button
              onClick={() => addArrayItem("technologies")}
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
              <div key={index} className="list-item">
                <div className="list-item-content">
                  <Textarea
                    value={responsibility}
                    onChange={(e) =>
                      handleArrayChange("responsibilities", index, e.detail.value)
                    }
                    rows={3}
                    placeholder="Describe your role or achievement in this project"
                  />
                </div>
                <SpaceBetween direction="horizontal" size="xs">
                  {formData.responsibilities.length > 1 && (
                    <>
                      <Button
                        onClick={() => moveArrayItem("responsibilities", index, "up")}
                        variant="icon"
                        iconName="angle-up"
                        disabled={index === 0}
                        ariaLabel="Move up"
                      />
                      <Button
                        onClick={() => moveArrayItem("responsibilities", index, "down")}
                        variant="icon"
                        iconName="angle-down"
                        disabled={index === formData.responsibilities.length - 1}
                        ariaLabel="Move down"
                      />
                      {FEATURE_FLAGS.AI_POLISH && (
                        <Button
                          onClick={() => handlePolishItem(index)}
                          variant="icon"
                          iconName="gen-ai"
                          loading={polishingIndex === index}
                          ariaLabel="Polish with AI"
                        />
                      )}
                      <Button
                        onClick={() => removeArrayItem("responsibilities", index)}
                        variant="icon"
                        iconName="remove"
                        ariaLabel="Remove responsibility"
                      />
                    </>
                  )}
                </SpaceBetween>
              </div>
            ))}
            <Button
              onClick={() => addArrayItem("responsibilities")}
              iconName="add-plus"
            >
              Add Responsibility
            </Button>
          </div>
        </FormField>
      </Form>
    </Modal>
  );
};

export default ProjectEditor;
