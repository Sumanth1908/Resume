import React from "react";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import { APP_CONFIG } from "../config/constants";

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
      utilities={[
        ...(utilities || []),
        {
          type: "button",
          text: `Built by ${APP_CONFIG.author.shortName}`,
          variant: "link",
          href: APP_CONFIG.author.linkedin,
          external: true
        }
      ]}
    />
  );
};

export default AppHeader;
