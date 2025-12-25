import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addEducation, updateEducation } from "../../store/resumeSlice";
import { Education } from "../../types/resume";
import Modal from "@cloudscape-design/components/modal";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import DatePicker from "@cloudscape-design/components/date-picker";
import Textarea from "@cloudscape-design/components/textarea";
// ...existing code...

interface EducationEditorProps {
  education?: Education;
  onClose: () => void;
}

const EducationEditor: React.FC<EducationEditorProps> = ({
  education,
  onClose,
}) => {
  const dispatch = useDispatch();
  const isEditing = !!education;

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

  const [formData, setFormData] = useState<Omit<Education, "id">>({
    institution: "",
    degree: "",
    location: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    if (education) {
      setFormData({
        institution: education.institution,
        degree: education.degree,
        location: education.location,
        startDate: dateToPickerFormat(education.startDate),
        endDate: dateToPickerFormat(education.endDate),
        description: education.description,
      });
    } else {
      setFormData({
        institution: "",
        degree: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      });
    }
  }, [education]);

  // Modal visibility control
  const [visible, setVisible] = useState<boolean>(true);

  const handleChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Accept optional event so footer button can call it without an event
  const handleSubmit = (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }

    const cleanedData = {
      ...formData,
      startDate: pickerToDateFormat(formData.startDate),
      endDate: pickerToDateFormat(formData.endDate),
    };

    if (isEditing && education) {
      dispatch(updateEducation({ ...cleanedData, id: education.id }));
    } else {
      dispatch(addEducation(cleanedData));
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
      header={isEditing ? "Edit Education" : "Add Education"}
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={handleCancel} variant="link">
              Cancel
            </Button>
            <Button onClick={() => handleSubmit()} variant="primary">
              {isEditing ? "Update Education" : "Add Education"}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <Form>
        <FormField
          label="Institute Name"
          description="Where you studied"
          stretch
        >
          <Input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={(e) => handleChange(e.detail.value, "institution")}
          />
        </FormField>

        <FormField
          label="Degree"
          description="Your degree or certification"
          stretch
        >
          <Input
            type="text"
            name="degree"
            value={formData.degree}
            onChange={(e) => handleChange(e.detail.value, "degree")}
          />
        </FormField>

        <FormField label="Location" description="City, State" stretch>
          <Input
            type="text"
            name="location"
            value={formData.location}
            onChange={(e) => handleChange(e.detail.value, "location")}
            placeholder="City, State"
          />
        </FormField>
        <div className="form-row">
          <FormField label="Start Date">
            <DatePicker
              value={formData.startDate}
              onChange={(e) => handleChange(e.detail.value, "startDate")}
              placeholder="Select start date"
              granularity="month"
            />
          </FormField>

          <FormField label="End Date">
            <DatePicker
              value={formData.endDate}
              onChange={(e) => handleChange(e.detail.value, "endDate")}
              placeholder="Select end date"
              granularity="month"
            />
          </FormField>
        </div>

        <FormField
          label="Summary"
          description="Brief summary of your education"
        >
          <Textarea
            name="description"
            value={formData.description}
            onChange={(e) => handleChange(e.detail.value, "description")}
            rows={3}
            placeholder="Brief summary of your education"
          />
        </FormField>
      </Form>
    </Modal>
  );
};

export default EducationEditor;
