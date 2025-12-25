import React from "react";
import ButtonDropdown from "@cloudscape-design/components/button-dropdown";

interface AddSectionDropdownProps {
  disabled?: boolean;
  onOpenEditor: (section: string) => void;
}

const items = [
  { id: "experience", text: "Experience" },
  { id: "project", text: "Project" },
  { id: "skill", text: "Skill" },
  { id: "education", text: "Education" },
];

const AddSectionDropdown: React.FC<AddSectionDropdownProps> = ({
  disabled,
  onOpenEditor,
}) => {
  const handleItemClick = (e: any) => {
    // Cloudscape sends detail with id for menu items
    const id = e?.detail?.id || e?.detail?.value;
    if (id) onOpenEditor(id);
  };

  return (
    <ButtonDropdown
      items={items}
      onItemClick={handleItemClick}
      disabled={disabled}
      variant="primary"
      ariaLabel="Add section"
    >
      Add Section
    </ButtonDropdown>
  );
};

export default AddSectionDropdown;
