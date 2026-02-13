import React from "react";
import ButtonDropdown, { ButtonDropdownProps } from "@cloudscape-design/components/button-dropdown";
import "./FloatingAddButton.css";

interface FloatingAddButtonProps {
    disabled?: boolean;
    onOpenEditor: (section: string) => void;
}

const items: ButtonDropdownProps.Item[] = [
    { id: "experience", text: "Experience", iconName: "contact" },
    { id: "project", text: "Project", iconName: "folder" },
    { id: "skill", text: "Skill", iconName: "settings" },
    { id: "education", text: "Education", iconName: "calendar" },
    { id: "award", text: "Awards & Certifications", iconName: "status-positive" },
];

const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({
    disabled,
    onOpenEditor,
}) => {
    const handleItemClick = (e: any) => {
        const id = e?.detail?.id;
        if (id) onOpenEditor(id);
    };

    return (
        <div className="fab-container">
            <ButtonDropdown
                items={items}
                onItemClick={handleItemClick}
                disabled={disabled}
                variant="primary"
                ariaLabel="Add section"
                expandableGroups
                expandToViewport
            >
                <span className="fab-icon">+</span>
            </ButtonDropdown>
        </div>
    );
};

export default FloatingAddButton;
