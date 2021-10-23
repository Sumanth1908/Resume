import React, { ReactElement } from "react";
import { Tab, Col, Nav, Row } from "react-bootstrap";
import { ProgrammingLanguages } from "./ProgrammingLanguages";
import { Tools } from "./Tools";

type TechnicalSkillsProps = {
  Category: string;
  Component: ReactElement;
};

export const TechnicalSkills = () => {
  const SkillCategories: TechnicalSkillsProps[] = [
    { Category: "Programming Languages", Component: <ProgrammingLanguages /> },
    { Category: "Tools", Component: <Tools /> },
    { Category: "Web Framework", Component: <></> },
    { Category: "Databases", Component: <></> },
    { Category: "Containerisation", Component: <></> },
    { Category: "Deployment", Component: <></> },
    { Category: "Orchestration", Component: <></> },
  ];
  return (
    <>
      <p>Every Skill is in Linux and Windows</p>
      <p>Devops</p>
      <p>Full Stack</p>
      <Tab.Container defaultActiveKey="Programming Languages">
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              {SkillCategories.map((category) => (
                <Nav.Item>
                  <Nav.Link eventKey={category.Category}>
                    {category.Category}
                  </Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {SkillCategories.map((category) => (
                <Tab.Pane eventKey={category.Category}>
                  {category.Component}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
};
