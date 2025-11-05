import React from "react";
import { IconType } from "react-icons";
import * as IoIcons from "react-icons/io5";

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

const Icon: React.FC<IconProps> = ({ name, size = 16, color }) => {
  const iconMap: { [key: string]: { icon: IconType; defaultColor: string } } = {
    edit: { icon: IoIcons.IoPencilSharp, defaultColor: "#4CAF50" },
    plus: { icon: IoIcons.IoAddCircle, defaultColor: "#2196F3" },
    download: { icon: IoIcons.IoCloudDownload, defaultColor: "#9C27B0" },
    save: { icon: IoIcons.IoSave, defaultColor: "#4CAF50" },
    eye: { icon: IoIcons.IoEye, defaultColor: "#607D8B" },
    database: { icon: IoIcons.IoDocument, defaultColor: "#FF9800" },
    search: { icon: IoIcons.IoSearch, defaultColor: "#2196F3" },
    trash: { icon: IoIcons.IoTrash, defaultColor: "#F44336" },
    document: { icon: IoIcons.IoDocumentText, defaultColor: "#3F51B5" },
    "arrow-left": { icon: IoIcons.IoArrowBack, defaultColor: "#607D8B" },
    contact: { icon: IoIcons.IoPerson, defaultColor: "#00BCD4" },
    experience: { icon: IoIcons.IoBriefcase, defaultColor: "#673AB7" },
    education: { icon: IoIcons.IoSchool, defaultColor: "#FF5722" },
    skills: { icon: IoIcons.IoStarHalf, defaultColor: "#FFC107" },
    projects: { icon: IoIcons.IoCodeSlash, defaultColor: "#795548" },
    award: { icon: IoIcons.IoTrophy, defaultColor: "#E91E63" },
  };

  const iconEntry = iconMap[name];

  if (!iconEntry) {
    return <span>{name}</span>;
  }

  const IconComponent: IconType = iconEntry.icon; // No need for type assertion
  const iconColor = color ?? iconEntry.defaultColor;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        marginRight: "4px",
      }}
    >
      {React.createElement(
        IconComponent as React.ComponentType<{ size?: number; color?: string }>,
        {
          size,
          color: iconColor,
        }
      )}
    </span>
  );
};

export default Icon;
