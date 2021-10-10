import React from "react";
import { Card } from "react-bootstrap";
import { BsEnvelope, BsPhone } from "react-icons/bs";
import { Objective } from "../Objective/objective";

export const BasicInfo = () => {
  return (
    <Card>
      <Card.Body>
        <div className="row">
          <div className="col">
            <h2>Sumanth Jillepally</h2>
            <h6>DevOps Engineer</h6>
            <BsEnvelope>
              <a href="sumanthjillepally@gmail.com"></a>
            </BsEnvelope>
            <BsPhone />
            <h6>Mobile: +91-9010234192</h6>
          </div>
          <div className="col">
            <Objective />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
