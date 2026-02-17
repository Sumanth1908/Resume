import React from "react";
import TopNavigation from "@cloudscape-design/components/top-navigation";
import { APP_CONFIG } from "../config/constants";

interface AppHeaderProps {
  title?: string;
  // TopNavigation utilities array (buttons, menu-dropdowns, etc.)
  utilities?: Array<any>;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, utilities }) => {
  const isHashRouter = process.env.REACT_APP_USE_HASH_ROUTER === 'true';

  return (
    <TopNavigation
      identity={{ href: isHashRouter ? "#/" : "/", title }}
      i18nStrings={{
        overflowMenuTriggerText: "More",
        searchIconAriaLabel: "Search",
      }}
      utilities={[
        ...(utilities || []),
        {
          type: "button",
          text: "☕ Buy Me a Coffee",
          href: APP_CONFIG.author.buyMeACoffee,
          external: true
        },
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
