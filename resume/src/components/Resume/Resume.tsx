import React, { ReactElement } from "react";
import { BasicInfo } from "../BasicInfo/BasicInfo";
import { Objective } from "../Objective/objective";
import { Summary } from "../Summary/Summary";
import { Education } from "../Education/Education";
import { Softskills } from "../SoftSkills/Softskills";
import { TechnicalSkills } from "../TechnicalSkills/TechnicalSkills";
import { Projects } from "../Projects/Projects";
import { Tabs, Tab, Card } from "react-bootstrap";
import "./Resume.css";
type Sections = {
  Title: string;
  Component: ReactElement;
};

export const Resume = () => {
  const Sections: Sections[] = [
    { Title: "Objective", Component: <Objective /> },
    { Title: "Summary", Component: <Summary /> },
    { Title: "Education", Component: <Education /> },
    { Title: "Soft Skills", Component: <Softskills /> },
    { Title: "Technical Skills", Component: <TechnicalSkills /> },
    { Title: "Projects", Component: <Projects /> },
  ];
  return (
    <div className="resume-container">
      <BasicInfo />
      <Card>
        <Card.Body>
          <Tabs
            defaultActiveKey="Objective"
            id="resume-section-tab"
            className="mb-3"
          >
            {Sections.map((section) => (
              <Tab eventKey={section.Title} title={section.Title}>
                {section.Component}
              </Tab>
            ))}
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};
