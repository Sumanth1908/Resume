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
  reorderProject,
  reorderSkill,
  updateExperience,
  updateEducation,
  updateProject,
} from "../store/resumeSlice";
import Button from "@cloudscape-design/components/button";
import { ResumeData } from "../types/resume";
import "./ResumeDisplay.css";

const EyeIcon = (
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = (
  <svg viewBox="0 0 24 24" focusable="false">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

interface ResumeDisplayProps {
  resume?: ResumeData;
  isPreview?: boolean;
}

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
      result[3],
      16
    )}`
    : "9, 114, 211";
};

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

  const {
    contactInfo,
    experiences: rawExperiences,
    projects: rawProjects,
    skills,
    education: rawEducation,
    awards,
    settings,
  } = displayResume;

  const experiences = isPreview ? rawExperiences.filter(e => !e.hidden) : rawExperiences;
  const projects = isPreview ? rawProjects.filter(p => !p.hidden) : rawProjects;
  const education = isPreview ? rawEducation.filter(e => !e.hidden) : rawEducation;

  const visibility = settings?.sectionVisibility || {
    experience: true,
    projects: true,
    skills: true,
    education: true,
    awards: true,
  };

  const technicalSkills = skills.filter(
    (skill) => skill.category === "technical"
  );
  const additionalSkills = skills.filter(
    (skill) => skill.category === "additional"
  );
  const hasSidebarContent =
    (skills.length > 0 && visibility.skills) ||
    (awards.length > 0 && visibility.awards);

  return (
    <div
      id="resume-display"
      className={`resume-display ${isPreview ? "preview-mode" : ""} template-${settings?.template || "modern"
        } ${hasSidebarContent ? "has-sidebar" : "no-sidebar"}`}
      style={
        {
          "--resume-theme-color": settings?.themeColor || "#0972d3",
          "--resume-theme-color-rgb": hexToRgb(settings?.themeColor || "#0972d3"),
          "--resume-font-family": settings?.fontFamily || "Inter, sans-serif",
          "--resume-text-alignment": settings?.textAlignment || "left",
          "--resume-heading-alignment": settings?.textAlignment === "justify" ? "left" : (settings?.textAlignment || "left"),
        } as React.CSSProperties
      }
    >
      <div className="header" style={{ position: 'relative' }}>
        {!isPreview && (
          <div style={{ position: 'absolute', right: 0, top: 0 }}>
            <Button
              variant="icon"
              iconName="edit"
              onClick={() =>
                dispatch(setEditing({ isEditing: true, section: "contact" }))
              }
              ariaLabel="Edit contact info"
            />
          </div>
        )}
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
        {hasSidebarContent && (
          <div className="sidebar">
            {/* SKILLS SECTION */}
            {skills.length > 0 && visibility.skills && (
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
                                iconName="angle-up"
                                onClick={() =>
                                  dispatch(
                                    reorderSkill({
                                      id: skill.id,
                                      direction: "up",
                                    })
                                  )
                                }
                                ariaLabel="Move skill up"
                              />
                              <Button
                                variant="icon"
                                iconName="angle-down"
                                onClick={() =>
                                  dispatch(
                                    reorderSkill({
                                      id: skill.id,
                                      direction: "down",
                                    })
                                  )
                                }
                                ariaLabel="Move skill down"
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
                        <div className="skill-blocks">
                          {[1, 2, 3, 4, 5].map((idx) => (
                            <div
                              key={idx}
                              className={`skill-block ${skill.level >= idx * 20 ? "active" : ""}`}
                            ></div>
                          ))}
                        </div>
                        <div className="skill-level-label">
                          {skill.level <= 20
                            ? "Beginner"
                            : skill.level <= 40
                              ? "Basic"
                              : skill.level <= 60
                                ? "Proficient"
                                : skill.level <= 80
                                  ? "Advanced"
                                  : "Expert"}
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
                                iconName="angle-up"
                                onClick={() =>
                                  dispatch(
                                    reorderSkill({
                                      id: skill.id,
                                      direction: "up",
                                    })
                                  )
                                }
                                ariaLabel="Move skill up"
                              />
                              <Button
                                variant="icon"
                                iconName="angle-down"
                                onClick={() =>
                                  dispatch(
                                    reorderSkill({
                                      id: skill.id,
                                      direction: "down",
                                    })
                                  )
                                }
                                ariaLabel="Move skill down"
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
            {awards.length > 0 && visibility.awards && (
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
                          {(award.issuer || award.date) && (
                            <div className="award-meta">
                              {award.issuer && <span className="award-issuer">{award.issuer}</span>}
                              {award.issuer && award.date && <span className="separator"> • </span>}
                              {award.date && <span className="award-date">{award.date}</span>}
                            </div>
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
        )}

        <div className="main-content">
          {/* EXPERIENCE SECTION */}
          {experiences.length > 0 && visibility.experience && (
            <div className="section">
              <h2 className="section-title">Experience</h2>
              {experiences.map((experience) => (
                <div key={experience.id} className={`job ${experience.hidden ? "hidden-item" : ""}`}>
                  <div className="job-header">
                    <div>
                      <div className="company">
                        {experience.company}
                        {experience.location && (
                          <span className="location"> | {experience.location}</span>
                        )}
                      </div>
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
                          iconSvg={experience.hidden ? EyeOffIcon : EyeIcon}
                          onClick={() =>
                            dispatch(updateExperience({ ...experience, hidden: !experience.hidden }))
                          }
                          ariaLabel={experience.hidden ? "Show experience" : "Hide experience"}
                        />
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
        </div>
      </div>

      {/* FULL-WIDTH SECTIONS BELOW */}
      <div className="full-width-content">
        {/* EDUCATION SECTION */}
        {education.length > 0 && visibility.education && (
          <div className="section">
            <h2 className="section-title">Education</h2>
            {education.map((edu) => (
              <div key={edu.id} className={`education-item ${edu.hidden ? "hidden-item" : ""}`}>
                <div className="education-header">
                  <div>
                    <div className="institution">
                      {edu.institution}
                      {edu.location && (
                        <span className="location"> | {edu.location}</span>
                      )}
                    </div>
                    <div className="degree">{edu.degree}</div>
                  </div>
                  {!isPreview && (
                    <div className="actions">
                      <Button
                        variant="icon"
                        iconSvg={edu.hidden ? EyeOffIcon : EyeIcon}
                        onClick={() =>
                          dispatch(updateEducation({ ...edu, hidden: !edu.hidden }))
                        }
                        ariaLabel={edu.hidden ? "Show education" : "Hide education"}
                      />
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
        {projects.length > 0 && visibility.projects && (
          <div className="section">
            <h2 className="section-title">Projects</h2>
            {projects.map((project, index) => (
              <div key={project.id} className={`project ${project.hidden ? "hidden-item" : ""}`}>
                <div className="project-header">
                  <div>
                    <div className="project-title">
                      {index + 1}. {project.title}
                      {project.company && (
                        <span className="company-tag"> @ {project.company}</span>
                      )}
                    </div>
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
                        iconSvg={project.hidden ? EyeOffIcon : EyeIcon}
                        onClick={() =>
                          dispatch(updateProject({ ...project, hidden: !project.hidden }))
                        }
                        ariaLabel={project.hidden ? "Show project" : "Hide project"}
                      />
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
                        iconName="angle-up"
                        onClick={() =>
                          dispatch(
                            reorderProject({
                              id: project.id,
                              direction: "up",
                            })
                          )
                        }
                        ariaLabel="Move project up"
                      />
                      <Button
                        variant="icon"
                        iconName="angle-down"
                        onClick={() =>
                          dispatch(
                            reorderProject({
                              id: project.id,
                              direction: "down",
                            })
                          )
                        }
                        ariaLabel="Move project down"
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
                    <div className="tech-tags">
                      <strong className="tech-label">Technologies:</strong>
                      {project.technologies.map((tech, index) => (
                        <span key={index} className="tech-tag">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}


      </div>
    </div>
  );
};

export default ResumeDisplay;
