import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addAward, updateAward } from "../../store/resumeSlice";
import { Award } from "../../types/resume";
import "./Editor.css";
import Modal from "@cloudscape-design/components/modal";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Textarea from "@cloudscape-design/components/textarea";

interface AwardEditorProps {
  award?: Award;
  onClose: () => void;
}

const AwardEditor: React.FC<AwardEditorProps> = ({ award, onClose }) => {
  const dispatch = useDispatch();
  const isEditing = !!award;

  const [formData, setFormData] = useState<Omit<Award, "id">>({
    title: "",
    description: "",
    date: "",
    issuer: "",
  });

  useEffect(() => {
    if (award) {
      setFormData({
        title: award.title,
        description: award.description,
        date: award.date,
        issuer: award.issuer,
      });
    }
  }, [award]);

  const [visible, setVisible] = useState(true);

  const handleChange = (value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (isEditing && award) {
      dispatch(updateAward({ ...formData, id: award.id }));
    } else {
      dispatch(addAward(formData));
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
      header={
        isEditing ? "Edit Award/Certification" : "Add Award/Certification"
      }
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={handleCancel} variant="link">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="primary">
              {isEditing ? "Update" : "Add"}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <Form>
        <SpaceBetween direction="vertical" size="l">
          <FormField
            label="Title"
            description="Name of the award or certification"
            stretch
          >
            <Input
              value={formData.title}
              onChange={(e) => handleChange(e.detail.value, "title")}
              placeholder="e.g., AWS Certified Solutions Architect"
            />
          </FormField>

          <FormField
            label="Issuer"
            description="Organization that issued the award/certification"
            stretch
          >
            <Input
              value={formData.issuer}
              onChange={(e) => handleChange(e.detail.value, "issuer")}
              placeholder="e.g., Amazon Web Services"
            />
          </FormField>

          <FormField label="Date" description="When was this awarded" stretch>
            <Input
              value={formData.date}
              onChange={(e) => handleChange(e.detail.value, "date")}
              placeholder="e.g., June 2023"
            />
          </FormField>

          <FormField
            label="Description"
            description="Additional details about the award/certification"
            stretch
          >
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange(e.detail.value, "description")}
              placeholder="e.g., Advanced level certification demonstrating expertise in AWS cloud architecture"
            />
          </FormField>
        </SpaceBetween>
      </Form>
    </Modal>
  );
};

export default AwardEditor;
