import React from "react";
import TopNavigation from "@cloudscape-design/components/top-navigation";

interface AppHeaderProps {
  title?: string;
  // TopNavigation utilities array (buttons, menu-dropdowns, etc.)
  utilities?: Array<any>;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, utilities }) => {
  return (
    <TopNavigation
      identity={{ href: "/", title }}
      i18nStrings={{
        overflowMenuTriggerText: "More",
        searchIconAriaLabel: "Search",
      }}
      utilities={utilities || []}
    />
  );
};

export default AppHeader;
