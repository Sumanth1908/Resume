import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addSkill, updateSkill } from "../../store/resumeSlice";
import { Skill } from "../../types/resume";
import "./Editor.css";
import Modal from "@cloudscape-design/components/modal";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Select from "@cloudscape-design/components/select";
import Input from "@cloudscape-design/components/input";

interface SkillEditorProps {
  skill?: Skill;
  onClose: () => void;
}

const SkillEditor: React.FC<SkillEditorProps> = ({ skill, onClose }) => {
  const dispatch = useDispatch();
  const isEditing = !!skill;

  const [formData, setFormData] = useState<Omit<Skill, "id">>({
    name: "",
    level: 70,
    category: "technical",
  });

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name,
        level: skill.level,
        category: skill.category,
      });
    }
  }, [skill]);

  const handleChange = (value: string, name: string) => {
    if (name === "level") {
      // Remove any non-digits
      const digitsOnly = value.replace(/\D/g, "");
      if (digitsOnly === "") {
        setFormData((prev) => ({ ...prev, [name]: 0 }));
        return;
      }
      let numericValue = parseInt(digitsOnly, 10);
      // Clamp between 0 and 100
      numericValue = Math.min(100, Math.max(0, numericValue));
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [visible, setVisible] = useState(true);

  const handleSubmit = () => {
    if (isEditing && skill) {
      dispatch(updateSkill({ ...formData, id: skill.id }));
    } else {
      dispatch(addSkill(formData));
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
      header={isEditing ? "Edit Skill" : "Add New Skill"}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={handleCancel} variant="link">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="primary">
              {isEditing ? "Update Skill" : "Add Skill"}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <Form className="editor-form">
        <FormField label="Skill Name" description="Name of your skill" stretch>
          <Input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleChange(e.detail.value, "name")}
            placeholder="e.g., JavaScript, Python, Project Management"
          />
        </FormField>

        <FormField
          label="Category"
          description="Choose how this skill should be displayed"
          stretch
        >
          <Select
            options={[
              {
                label: "Technical Skill (with progress bar)",
                value: "technical",
              },
              { label: "Additional Skill (bullet point)", value: "additional" },
            ]}
            selectedOption={{
              label:
                formData.category === "technical"
                  ? "Technical Skill (with progress bar)"
                  : "Additional Skill (bullet point)",
              value: formData.category,
            }}
            onChange={(e) =>
              handleChange(
                e.detail.selectedOption.value || "technical",
                "category"
              )
            }
          />
        </FormField>

        {formData.category === "technical" && (
          <FormField
            label="Proficiency Level"
            description="Select your skill level (1-5)"
            stretch
          >
            <Select
              options={[
                { label: "1 - Beginner", value: "20" },
                { label: "2 - Basic", value: "40" },
                { label: "3 - Proficient", value: "60" },
                { label: "4 - Advanced", value: "80" },
                { label: "5 - Expert", value: "100" },
              ]}
              selectedOption={
                [
                  { label: "1 - Beginner", value: "20" },
                  { label: "2 - Basic", value: "40" },
                  { label: "3 - Proficient", value: "60" },
                  { label: "4 - Advanced", value: "80" },
                  { label: "5 - Expert", value: "100" },
                ].find(opt => opt.value === formData.level.toString()) || { label: "3 - Proficient", value: "60" }
              }
              onChange={(e) =>
                handleChange(
                  e.detail.selectedOption.value || "60",
                  "level"
                )
              }
            />
          </FormField>
        )}
      </Form>
    </Modal>
  );
};

export default SkillEditor;
