import React from "react";
import Box from "@cloudscape-design/components/box";
import { APP_CONFIG } from "../config/constants";
import "./Footer.css";

const Footer: React.FC = () => {
    return (
        <footer className="app-footer">
            <Box padding="l" textAlign="center">
                <hr className="footer-divider" />
                <Box margin={{ top: "m" }}>
                    Designed and Developed with ❤️ by{" "}
                    <a
                        href={APP_CONFIG.author.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="author-name"
                    >
                        {APP_CONFIG.author.shortName}
                    </a>
                </Box>
                <Box variant="small" margin={{ top: "xs" }} color="text-label">
                    © {new Date().getFullYear()} Resume Builder. All rights reserved.
                </Box>
            </Box>
        </footer>
    );
};

export default Footer;
