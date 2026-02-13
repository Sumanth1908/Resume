import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addExperience, updateExperience } from "../../store/resumeSlice";
import { Experience } from "../../types/resume";
import { polishBulletPoint } from "../../utils/aiUtils";
import { FEATURE_FLAGS } from "../../config/featureFlags";
import Modal from "@cloudscape-design/components/modal";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import DatePicker from "@cloudscape-design/components/date-picker";
import Textarea from "@cloudscape-design/components/textarea";
import Checkbox from "@cloudscape-design/components/checkbox";

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

  // Helper functions for date conversion
  const dateToPickerFormat = (dateString: string): string => {
    if (!dateString) return "";
    try {
      // Convert "October 2024" to "2024-10"
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    } catch {
      return dateString;
    }
  };

  const pickerToDateFormat = (pickerValue: string): string => {
    if (!pickerValue) return "";
    try {
      // Convert "2024-10" to "October 2024"
      const [year, month] = pickerValue.split("-");
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
    } catch {
      return pickerValue;
    }
  };

  const [formData, setFormData] = useState<Omit<Experience, "id">>({
    company: "",
    location: "",
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
        location: experience.location || "",
        position: experience.position,
        startDate: dateToPickerFormat(experience.startDate),
        endDate: dateToPickerFormat(experience.endDate),
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

  const moveResponsibility = (index: number, direction: "up" | "down") => {
    const newResponsibilities = [...formData.responsibilities];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newResponsibilities.length) {
      const temp = newResponsibilities[newIndex];
      newResponsibilities[newIndex] = newResponsibilities[index];
      newResponsibilities[index] = temp;
      setFormData((prev) => ({
        ...prev,
        responsibilities: newResponsibilities,
      }));
    }
  };

  const [polishingIndex, setPolishingIndex] = useState<number | null>(null);
  const [isPolishingDesc, setIsPolishingDesc] = useState(false);

  const handlePolishResponsibility = async (index: number) => {
    const text = formData.responsibilities[index];
    if (!text) return;

    setPolishingIndex(index);
    try {
      const polished = await polishBulletPoint(text);
      handleResponsibilityChange(index, polished);
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
      startDate: pickerToDateFormat(formData.startDate),
      endDate: pickerToDateFormat(formData.endDate),
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
        <div className="form-row">
          <FormField
            label="Company"
            description="Company or organization name"
            stretch
          >
            <Input
              type="text"
              value={formData.company}
              onChange={(e) => handleChange(e.detail.value, "company")}
              placeholder="e.g., Amazon, Microsoft"
            />
          </FormField>

          <FormField
            label="Location"
            description="City, State or Remote (optional)"
            stretch
          >
            <Input
              type="text"
              value={formData.location || ""}
              onChange={(e) => handleChange(e.detail.value, "location")}
              placeholder="e.g., Seattle, WA or Remote"
            />
          </FormField>
        </div>

        <div className="form-row">
          <FormField label="Position" description="Your job title" stretch>
            <Input
              type="text"
              value={formData.position}
              onChange={(e) => handleChange(e.detail.value, "position")}
              placeholder="e.g., Software Engineer"
            />
          </FormField>
        </div>

        <div className="form-row">
          <FormField label="Start Date" stretch>
            <DatePicker
              value={formData.startDate}
              onChange={(e) => handleChange(e.detail.value, "startDate")}
              placeholder="Select start date"
              granularity="month"
            />
          </FormField>

          <FormField label="End Date" stretch>
            <DatePicker
              value={formData.endDate}
              onChange={(e) => handleChange(e.detail.value, "endDate")}
              disabled={formData.current}
              placeholder="Select end date"
              granularity="month"
            />
            <Checkbox
              checked={formData.current}
              onChange={(e) => handleCheckboxChange(e.detail.checked)}
            >
              Currently working here
            </Checkbox>
          </FormField>
        </div>

        <FormField
          label="Job Description"
          description="Brief overview of your role and achievements"
          stretch
        >
          <div style={{ position: "relative" }}>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange(e.detail.value, "description")}
              rows={4}
              placeholder="Brief overview of your role and achievements"
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
          label="Key Responsibilities"
          description="List your main responsibilities and achievements"
          stretch
        >
          <div className="dynamic-list">
            {formData.responsibilities.map((responsibility, index) => (
              <div key={index} className="list-item">
                <div className="list-item-content">
                  <Textarea
                    value={responsibility}
                    onChange={(e) =>
                      handleResponsibilityChange(index, e.detail.value)
                    }
                    rows={3}
                    placeholder="Describe a key responsibility or achievement"
                  />
                </div>
                <SpaceBetween direction="horizontal" size="xs">
                  {formData.responsibilities.length > 1 && (
                    <>
                      <Button
                        onClick={() => moveResponsibility(index, "up")}
                        variant="icon"
                        iconName="angle-up"
                        disabled={index === 0}
                        ariaLabel="Move up"
                      />
                      <Button
                        onClick={() => moveResponsibility(index, "down")}
                        variant="icon"
                        iconName="angle-down"
                        disabled={index === formData.responsibilities.length - 1}
                        ariaLabel="Move down"
                      />
                      {FEATURE_FLAGS.AI_POLISH && (
                        <Button
                          onClick={() => handlePolishResponsibility(index)}
                          variant="icon"
                          iconName="gen-ai"
                          loading={polishingIndex === index}
                          ariaLabel="Polish with AI"
                        />
                      )}
                      <Button
                        onClick={() => removeResponsibility(index)}
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
              onClick={addResponsibility}
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

export default ExperienceEditor;
