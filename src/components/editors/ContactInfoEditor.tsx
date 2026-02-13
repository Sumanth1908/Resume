import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { updateContactInfo } from "../../store/resumeSlice";
import { ContactInfo } from "../../types/resume";
import "./Editor.css";
import Modal from "@cloudscape-design/components/modal";
import Box from "@cloudscape-design/components/box";
import SpaceBetween from "@cloudscape-design/components/space-between";
import Button from "@cloudscape-design/components/button";
import Form from "@cloudscape-design/components/form";
import FormField from "@cloudscape-design/components/form-field";
import Input from "@cloudscape-design/components/input";
import Textarea from "@cloudscape-design/components/textarea";

interface ContactInfoEditorProps {
  onClose: () => void;
}

const ContactInfoEditor: React.FC<ContactInfoEditorProps> = ({ onClose }) => {
  const dispatch = useDispatch();
  const contactInfo = useSelector(
    (state: RootState) => state.resume.currentResume?.contactInfo
  );

  const [formData, setFormData] = useState<Partial<ContactInfo>>({
    name: "",
    phone: "",
    email: "",
    linkedin: "",
    tagline: "",
  });

  useEffect(() => {
    if (contactInfo) {
      setFormData(contactInfo);
    }
  }, [contactInfo]);

  const handleChange = (value: string, name: string) => {
    let finalValue = value;
    if (name === "phone") {
      // Allow only digits and common phone symbols
      finalValue = value.replace(/[^\d+\-()\s]/g, "");
    }
    setFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleSubmit = () => {
    dispatch(updateContactInfo(formData));
    setVisible(false);
    onClose();
  };

  const [visible, setVisible] = useState(true);

  const handleCancel = () => {
    setVisible(false);
    onClose();
  };

  return (
    <Modal
      onDismiss={handleCancel}
      visible={visible}
      header="Edit Contact Information"
      footer={
        <Box float="right">
          <SpaceBetween direction="horizontal" size="xs">
            <Button onClick={handleCancel} variant="link">
              Cancel
            </Button>
            <Button onClick={handleSubmit} variant="primary">
              Save Changes
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <Form>
        <FormField
          label="Full Name"
          description="Your professional name"
          stretch
        >
          <Input
            value={formData.name || ""}
            onChange={(e) => handleChange(e.detail.value, "name")}
            placeholder="e.g., Jane Doe"
          />
        </FormField>

        <FormField
          label="Phone Number"
          description="Your contact number"
          stretch
        >
          <Input
            inputMode="tel"
            value={formData.phone || ""}
            onChange={(e) => handleChange(e.detail.value, "phone")}
            placeholder="e.g., +1 555 123 4567"
          />
        </FormField>

        <FormField
          label="Email Address"
          description="Your professional email"
          stretch
        >
          <Input
            type="email"
            value={formData.email || ""}
            onChange={(e) => handleChange(e.detail.value, "email")}
            placeholder="e.g., jane.doe@example.com"
          />
        </FormField>

        <FormField
          label="LinkedIn Profile"
          description="Your LinkedIn profile URL"
          stretch
        >
          <Input
            type="url"
            value={formData.linkedin || ""}
            onChange={(e) => handleChange(e.detail.value, "linkedin")}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </FormField>

        <FormField
          label="Professional Tagline"
          description="Brief description of your professional background"
          stretch
        >
          <Textarea
            value={formData.tagline || ""}
            onChange={(e) => handleChange(e.detail.value, "tagline")}
            rows={4}
            placeholder="Brief description of your professional background and expertise"
          />
        </FormField>
      </Form>
    </Modal>
  );
};

export default ContactInfoEditor;
