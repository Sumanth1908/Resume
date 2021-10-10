import React from "react";

export const Projects = () => {
  return (
    <div className="section" id="professional-experience">
      <div>Professional Experience</div>
      <ul>
        <li>
          <div className="section project" id="project-0">
            <div className="underline">
              E2E Analytical Product build and deploy on VMware
            </div>
            <div>Summary:</div>
            <p>
              Deploy E2E complete vantage cluster based on pre GCA builds to
              identify cross component issues
            </p>
            <div>Roles and responsibilities:</div>
            <ul>
              <li>
                Architected and created a POC to demonstrate the ability to
                identify cross component issues at the initial phase using an
                application which is highly scalable micro-services.
              </li>
              <li>
                As a developer I have created ansible playbooks to deploy the
                vantage components and VM’s on VMWare.
              </li>
              <li>
                As a developer I have containerised the app and exposed API to
                run the ansible playbooks and in-turn used the API’s to control
                the flow and deploy the components from Jenkins Job{" "}
              </li>
              <li>
                As a developer I have optimised the execution time by reducing
                40 min by parallelising few stages.
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div className="section project" id="project-1">
            <div className="underline">Unified Dashboard</div>
            <div>Summary:</div>
            <p>
              Develop a dashboard to view KPI’s for different projects in an
              organisation.
            </p>
            <div>Roles and responsibilities:</div>
            <ul>
              <li>
                Architected and created a POC to demonstrate the ability to pull
                data from Jenkins and show in a consolidated page
              </li>
              <li>
                As a developer I have created micro-services to fetch data from
                a Jenkins, process and return it as json.{" "}
              </li>
              <li>
                As a developer I have containerised the app, developed a dynamic
                data generation from existing preliminary date so that
                application could be recovered fast incase of any disaster.
              </li>
              <li>
                As a developer I have created CI in place and automated it so
                that PR are auto validated by doing a test deployment
                automatically.
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div className="section project" id="project-2">
            <div className="underline">Common Modules (Python Development)</div>
            <div>Summary:</div>
            <ul>
              <li>
                Develop common modules that can be used organisation wide.
              </li>
              <li>
                Helps in maintaining the code, decreases dependency other
                modules, security is improved.
              </li>
              <li>Consolidated logs, behaviour debugging.</li>
            </ul>
            <div>Roles and responsibilities:</div>
            <ul>
              <li>
                As a developer I need to take the requirements from various
                teams and implement the features
              </li>
              <li>
                Need to make sure the utilities/packages used are up to date and
                cover security patches
              </li>
              <li>
                Make sure the team requirement is satisfied by using these
                modules
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div className="section project" id="project-3">
            <div className="underline">
              Auto-Triage (E2E Python Based CI/CD)
            </div>
            <div>Summary:</div>
            <ul>
              <li>
                Automate the triaging process and represent the results/reports
                in a web page
              </li>
            </ul>

            <div>Roles and responsibilities:</div>
            <ul>
              <li>
                As a developer I worked on the scenario-based automation of
                issues triaged.
              </li>
              <li>
                As a developer I have created a web application using Django to
                view and visualise reports
              </li>
              <li>
                As a developer I have created a pipeline to run the job in
                Jenkins whenever new issues are triaged
              </li>
              <li>
                As a developer I have dockerized the UI application and added
                feature to ssh from webpage to the Linux Machine
              </li>
              <li>
                Implemented intelligent polling based on previous data analysis
                to check for hung
              </li>
            </ul>
          </div>
        </li>
        <li>
          <div className="section project" id="project-4">
            <div className="underline">ML Chat-Bot</div>
            <div>Summary:</div>
            <ul>
              <li>
                In this project I created a ChatBot that can answer and respond
                to user queries
              </li>
            </ul>
            <div>Roles and responsibilities:</div>
            <ul>
              <li>
                Selected TensorFlow library and used Seq2Seq modelling to design
                the Bot
              </li>
              <li>Prepared the Training data and trained the model</li>
              <li>
                Adjusted and tuned the model for better performance and response
              </li>
              <li>
                Planned to implement content awareness but couldn’t due to time
                and infra constraint
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  );
};
