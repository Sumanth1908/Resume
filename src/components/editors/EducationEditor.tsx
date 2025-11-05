import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addEducation, updateEducation } from "../../store/resumeSlice";
import { Education } from "../../types/resume";
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
import { Grid } from "@cloudscape-design/components";
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
        startDate: education.startDate,
        endDate: education.endDate,
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

    if (isEditing && education) {
      dispatch(updateEducation({ ...formData, id: education.id }));
    } else {
      dispatch(addEducation(formData));
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
        <Grid
          gridDefinition={[
            { colspan: 12 },
            { colspan: 12 },
            { colspan: 4 },
            { colspan: 4 },
            { colspan: 4 },
            { colspan: 12 },
          ]}
        >
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

          <FormField label="Start Date" description="When you started">
            <DateInput
              name="startDate"
              value={formData.startDate}
              granularity="month"
              placeholder="YYYY/MM"
              onChange={(e) => handleChange(e.detail.value, "startDate")}
            />
          </FormField>

          <FormField label="End Date" description="When you graduated">
            <DateInput
              name="endDate"
              value={formData.endDate}
              granularity="month"
              placeholder="YYYY/MM"
              onChange={(e) => handleChange(e.detail.value, "endDate")}
            />
          </FormField>

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
        </Grid>
      </Form>
    </Modal>
  );
};

export default EducationEditor;
