import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import {
  setEditing,
  deleteExperience,
  deleteEducation,
  deleteProject,
  deleteSkill,
  deleteAward,
  reorderExperience,
} from "../store/resumeSlice";
import Button from "@cloudscape-design/components/button";
import { ResumeData } from "../types/resume";
import "./ResumeDisplay.css";

interface ResumeDisplayProps {
  resume?: ResumeData;
  isPreview?: boolean;
}

const ResumeDisplay: React.FC<ResumeDisplayProps> = ({
  resume,
  isPreview = false,
}) => {
  const currentResume = useSelector(
    (state: RootState) => state.resume.currentResume
  );
  const dispatch = useDispatch();
  const displayResume = resume || currentResume;

  if (!displayResume) {
    return (
      <div className="resume-placeholder">
        <p>No resume data available. Create a new resume to get started.</p>
      </div>
    );
  }

  const { contactInfo, experiences, projects, skills, education, awards } =
    displayResume;
  const technicalSkills = skills.filter(
    (skill) => skill.category === "technical"
  );
  const additionalSkills = skills.filter(
    (skill) => skill.category === "additional"
  );

  return (
    <div
      id="resume-display"
      className={`resume-display ${isPreview ? "preview-mode" : ""}`}
    >
      <div className="header">
        <h1>{contactInfo.name || "Your Name"}</h1>
        <div className="tagline">
          {contactInfo.tagline || "Your professional tagline goes here"}
        </div>
        <div className="contact-info">
          {contactInfo.phone && <span>📞 {contactInfo.phone}</span>}
          {contactInfo.email && <span>✉️ {contactInfo.email}</span>}
          {contactInfo.linkedin && <span>🔗 {contactInfo.linkedin}</span>}
        </div>
      </div>

      <div className="container">
        <div className="main-content">
          {/* EXPERIENCE SECTION */}
          {experiences.length > 0 && (
            <div className="section">
              <h2 className="section-title">Experience</h2>
              {experiences.map((experience) => (
                <div key={experience.id} className="job">
                  <div className="job-header">
                    <div>
                      <div className="company">{experience.company}</div>
                      <div className="position">{experience.position}</div>
                    </div>
                    <div className="date">
                      {experience.startDate} -{" "}
                      {experience.current ? "Current" : experience.endDate}
                    </div>
                    {!isPreview && (
                      <div className="actions">
                        <Button
                          variant="icon"
                          iconName="edit"
                          onClick={() =>
                            dispatch(
                              setEditing({
                                isEditing: true,
                                section: "experience",
                                editingItemId: experience.id,
                              })
                            )
                          }
                          ariaLabel="Edit experience"
                        />
                        <Button
                          variant="icon"
                          iconName="angle-up"
                          onClick={() =>
                            dispatch(
                              reorderExperience({
                                id: experience.id,
                                direction: "up",
                              })
                            )
                          }
                          ariaLabel="Move experience up"
                        />
                        <Button
                          variant="icon"
                          iconName="angle-down"
                          onClick={() =>
                            dispatch(
                              reorderExperience({
                                id: experience.id,
                                direction: "down",
                              })
                            )
                          }
                          ariaLabel="Move experience down"
                        />
                        <Button
                          variant="icon"
                          iconName="remove"
                          onClick={() =>
                            dispatch(deleteExperience(experience.id))
                          }
                          ariaLabel="Delete experience"
                        />
                      </div>
                    )}
                  </div>
                  {experience.description && (
                    <div className="description">{experience.description}</div>
                  )}
                  {experience.responsibilities.length > 0 && (
                    <div className="responsibilities">
                      <ul>
                        {experience.responsibilities.map(
                          (responsibility, index) => (
                            <li key={index}>{responsibility}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* EDUCATION SECTION */}
          {education.length > 0 && (
            <div className="section">
              <h2 className="section-title">Education</h2>
              {education.map((edu) => (
                <div key={edu.id} className="education-item">
                  <div className="education-header">
                    <div>
                      <div className="institution">
                        {edu.institution}, {edu.location}
                      </div>
                      <div className="degree">{edu.degree}</div>
                    </div>
                    {!isPreview && (
                      <div className="actions">
                        <Button
                          variant="icon"
                          iconName="edit"
                          onClick={() =>
                            dispatch(
                              setEditing({
                                isEditing: true,
                                section: "education",
                                editingItemId: edu.id,
                              })
                            )
                          }
                          ariaLabel="Edit education"
                        />
                        <Button
                          variant="icon"
                          iconName="remove"
                          onClick={() => dispatch(deleteEducation(edu.id))}
                          ariaLabel="Delete education"
                        />
                      </div>
                    )}
                  </div>
                  <div className="date">
                    {edu.startDate} - {edu.endDate}
                  </div>
                  {edu.description && (
                    <div className="description">{edu.description}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS SECTION */}
          {projects.length > 0 && (
            <div className="section">
              <h2 className="section-title">Projects</h2>
              {projects.map((project) => (
                <div key={project.id} className="project">
                  <div className="project-header">
                    <div>
                      <div className="project-title">{project.title}</div>
                      {project.subtitle && (
                        <div className="project-subtitle">
                          {project.subtitle}
                        </div>
                      )}
                    </div>
                    {!isPreview && (
                      <div className="actions">
                        <Button
                          variant="icon"
                          iconName="edit"
                          onClick={() =>
                            dispatch(
                              setEditing({
                                isEditing: true,
                                section: "project",
                                editingItemId: project.id,
                              })
                            )
                          }
                          ariaLabel="Edit project"
                        />
                        <Button
                          variant="icon"
                          iconName="remove"
                          onClick={() => dispatch(deleteProject(project.id))}
                          ariaLabel="Delete project"
                        />
                      </div>
                    )}
                  </div>
                  {project.description && (
                    <div className="description">{project.description}</div>
                  )}
                  {project.responsibilities.length > 0 && (
                    <div className="responsibilities">
                      <strong>Role and Responsibilities:</strong>
                      <ul>
                        {project.responsibilities.map(
                          (responsibility, index) => (
                            <li key={index}>{responsibility}</li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                  {project.technologies.length > 0 && (
                    <div className="technologies">
                      <strong>Technologies:</strong>{" "}
                      {project.technologies.join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar">
          {/* SKILLS SECTION */}
          {skills.length > 0 && (
            <div className="section">
              <h2 className="section-title">Skills</h2>
              {technicalSkills.length > 0 && (
                <div className="skills-chart">
                  {technicalSkills.map((skill) => (
                    <div key={skill.id} className="skill-item">
                      <div className="skill-header">
                        <div className="skill-name">{skill.name}</div>
                        {!isPreview && (
                          <div className="actions">
                            <Button
                              variant="icon"
                              iconName="edit"
                              onClick={() =>
                                dispatch(
                                  setEditing({
                                    isEditing: true,
                                    section: "skill",
                                    editingItemId: skill.id,
                                  })
                                )
                              }
                              ariaLabel="Edit skill"
                            />
                            <Button
                              variant="icon"
                              iconName="remove"
                              onClick={() => dispatch(deleteSkill(skill.id))}
                              ariaLabel="Delete skill"
                            />
                          </div>
                        )}
                      </div>
                      <div className="skill-bar">
                        <div
                          className="skill-level"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {additionalSkills.length > 0 && (
                <div className="additional-skills">
                  <strong>Additional skills:</strong>
                  <ul>
                    {additionalSkills.map((skill) => (
                      <li key={skill.id} className="additional-skill-item">
                        <span>{skill.name}</span>
                        {!isPreview && (
                          <div className="actions">
                            <Button
                              variant="icon"
                              iconName="edit"
                              onClick={() =>
                                dispatch(
                                  setEditing({
                                    isEditing: true,
                                    section: "skill",
                                    editingItemId: skill.id,
                                  })
                                )
                              }
                              ariaLabel="Edit skill"
                            />
                            <Button
                              variant="icon"
                              iconName="remove"
                              onClick={() => dispatch(deleteSkill(skill.id))}
                              ariaLabel="Delete skill"
                            />
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* AWARDS & CERTIFICATIONS */}
          {awards.length > 0 && (
            <div className="section">
              <h2 className="section-title">Awards & Certifications</h2>
              <div className="awards">
                <ul>
                  {awards.map((award) => (
                    <li key={award.id} className="award-item">
                      <div className="award-content">
                        <div className="award-header">
                          <strong>{award.title}</strong>
                          {!isPreview && (
                            <div className="actions">
                              <Button
                                variant="icon"
                                iconName="edit"
                                onClick={() =>
                                  dispatch(
                                    setEditing({
                                      isEditing: true,
                                      section: "award",
                                      editingItemId: award.id,
                                    })
                                  )
                                }
                                ariaLabel="Edit award"
                              />
                              <Button
                                variant="icon"
                                iconName="remove"
                                onClick={() => dispatch(deleteAward(award.id))}
                                ariaLabel="Delete award"
                              />
                            </div>
                          )}
                        </div>
                        {award.issuer && (
                          <div className="award-issuer">{award.issuer}</div>
                        )}
                        {award.date && (
                          <div className="award-date">{award.date}</div>
                        )}
                        {award.description && (
                          <div className="award-description">
                            {award.description}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeDisplay;
