import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addExperience, updateExperience } from "../../store/resumeSlice";
import { Experience } from "../../types/resume";
import "./Editor.css";
import Modal from "@cloudscape-design/components/modal";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import DateInput from "@cloudscape-design/components/date-input";
import Textarea from "@cloudscape-design/components/textarea";
import Checkbox from "@cloudscape-design/components/checkbox";
import { Grid } from "@cloudscape-design/components";

interface ExperienceEditorProps {
  experience?: Experience;
  onClose: () => void;
}

const ExperienceEditor: React.FC<ExperienceEditorProps> = ({
  experience,
  onClose,
}) => {
  const dispatch = useDispatch();
  const isEditing = !!experience;

  const [formData, setFormData] = useState<Omit<Experience, "id">>({
    company: "",
    position: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
    responsibilities: [""],
  });

  useEffect(() => {
    if (experience) {
      setFormData({
        company: experience.company,
        position: experience.position,
        startDate: experience.startDate,
        endDate: experience.endDate,
        current: experience.current,
        description: experience.description,
        responsibilities:
          experience.responsibilities.length > 0
            ? experience.responsibilities
            : [""],
      });
    }
  }, [experience]);

  const handleChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      current: checked,
      endDate: checked ? "" : prev.endDate,
    }));
  };

  const handleResponsibilityChange = (index: number, value: string) => {
    const newResponsibilities = [...formData.responsibilities];
    newResponsibilities[index] = value;
    setFormData((prev) => ({ ...prev, responsibilities: newResponsibilities }));
  };

  const addResponsibility = () => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }));
  };

  const removeResponsibility = (index: number) => {
    if (formData.responsibilities.length > 1) {
      const newResponsibilities = formData.responsibilities.filter(
        (_, i) => i !== index
      );
      setFormData((prev) => ({
        ...prev,
        responsibilities: newResponsibilities,
      }));
    }
  };

  const [visible, setVisible] = useState(true);

  const handleSubmit = () => {
    const cleanedData = {
      ...formData,
      responsibilities: formData.responsibilities.filter(
        (r) => r.trim() !== ""
      ),
    };

    if (isEditing && experience) {
      dispatch(updateExperience({ ...cleanedData, id: experience.id }));
    } else {
      dispatch(addExperience(cleanedData));
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
      header={isEditing ? "Edit Experience" : "Add New Experience"}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={handleCancel} variant="link">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="primary">
              {isEditing ? "Update Experience" : "Add Experience"}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <Form>
        <Grid
          gridDefinition={[
            { colspan: 6 },
            { colspan: 6 },
            { colspan: 6 },
            { colspan: 6 },
            { colspan: 12 },
            { colspan: 12 },
          ]}
        >
          <FormField
            label="Company"
            description="Company or organization name"
            stretch
          >
            <Input
              type="text"
              value={formData.company}
              onChange={(e) => handleChange(e.detail.value, "company")}
            />
          </FormField>

          <FormField label="Position" description="Your job title" stretch>
            <Input
              type="text"
              value={formData.position}
              onChange={(e) => handleChange(e.detail.value, "position")}
            />
          </FormField>

          <FormField label="Start Date" stretch>
            <DateInput
              value={formData.startDate}
              onChange={(e) => handleChange(e.detail.value, "startDate")}
              granularity="month"
              placeholder="YYYY/MM"
            />
          </FormField>

          <FormField label="End Date" stretch>
            <DateInput
              id="endDate"
              value={formData.endDate}
              onChange={(e) => handleChange(e.detail.value, "endDate")}
              disabled={formData.current}
              granularity="month"
              placeholder="YYYY/MM"
            />
            <Checkbox
              checked={formData.current}
              onChange={(e) => handleCheckboxChange(e.detail.checked)}
            >
              Currently working here
            </Checkbox>
          </FormField>

          <FormField
            label="Job Description"
            description="Brief overview of your role and achievements"
            stretch
          >
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange(e.detail.value, "description")}
              rows={4}
              placeholder="Brief overview of your role and achievements"
            />
          </FormField>

          <FormField
            label="Key Responsibilities"
            description="List your main responsibilities and achievements"
            stretch
          >
            <div className="dynamic-list">
              {formData.responsibilities.map((responsibility, index) => (
                <div key={index}>
                  <Input
                    value={responsibility}
                    onChange={(e) =>
                      handleResponsibilityChange(index, e.detail.value)
                    }
                    placeholder="Describe a key responsibility or achievement"
                  />
                  {formData.responsibilities.length > 1 && (
                    <Button
                      onClick={() => removeResponsibility(index)}
                      variant="icon"
                      iconName="close"
                    />
                  )}
                </div>
              ))}
              <Button
                onClick={addResponsibility}
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

export default ExperienceEditor;
