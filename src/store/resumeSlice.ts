import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ResumeData,
  Experience,
  Project,
  Skill,
  Education,
  Award,
  ContactInfo,
} from "../types/resume";
import { v4 as uuidv4 } from "uuid";

interface ResumeState {
  currentResume: ResumeData | null;
  isEditing: boolean;
  editingSection: string;
  editingItemId: string | null;
}

const initialState: ResumeState = {
  currentResume: null,
  isEditing: false,
  editingSection: "",
  editingItemId: null,
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setResume: (state, action: PayloadAction<ResumeData>) => {
      state.currentResume = action.payload;
    },

    createNewResume: (state) => {
      const newResume: ResumeData = {
        id: uuidv4(),
        contactInfo: {
          id: uuidv4(),
          name: "",
          phone: "",
          email: "",
          linkedin: "",
          tagline: "",
        },
        experiences: [],
        projects: [],
        skills: [],
        education: [],
        awards: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.currentResume = newResume;
    },

    updateContactInfo: (state, action: PayloadAction<Partial<ContactInfo>>) => {
      if (state.currentResume) {
        state.currentResume.contactInfo = {
          ...state.currentResume.contactInfo,
          ...action.payload,
        };
        state.currentResume.updatedAt = new Date().toISOString();
      }
    },

    addExperience: (state, action: PayloadAction<Omit<Experience, "id">>) => {
      if (state.currentResume) {
        const newExperience: Experience = {
          ...action.payload,
          id: uuidv4(),
        };
        state.currentResume.experiences.push(newExperience);
        state.currentResume.updatedAt = new Date().toISOString();
      }
    },

    updateExperience: (state, action: PayloadAction<Experience>) => {
      if (state.currentResume) {
        const index = state.currentResume.experiences.findIndex(
          (exp) => exp.id === action.payload.id
        );
        if (index !== -1) {
          state.currentResume.experiences[index] = action.payload;
          state.currentResume.updatedAt = new Date().toISOString();
        }
      }
    },

    deleteExperience: (state, action: PayloadAction<string>) => {
      if (state.currentResume) {
        state.currentResume.experiences =
          state.currentResume.experiences.filter(
            (exp) => exp.id !== action.payload
          );
        state.currentResume.updatedAt = new Date().toISOString();
      }
    },

    // Reorder experience items by moving the item with the given id up or down
    reorderExperience: (
      state,
      action: PayloadAction<{ id: string; direction: "up" | "down" }>
    ) => {
      if (state.currentResume) {
        const { id, direction } = action.payload;
        const arr = state.currentResume.experiences;
        const idx = arr.findIndex((exp) => exp.id === id);
        if (idx === -1) return;
        const newIndex = direction === "up" ? idx - 1 : idx + 1;
        if (newIndex < 0 || newIndex >= arr.length) return;
        // swap
        const temp = arr[newIndex];
        arr[newIndex] = arr[idx];
        arr[idx] = temp;
        state.currentResume.updatedAt = new Date().toISOString();
      }
    },

    addProject: (state, action: PayloadAction<Omit<Project, "id">>) => {
      if (state.currentResume) {
        const newProject: Project = {
          ...action.payload,
          id: uuidv4(),
        };
        state.currentResume.projects.push(newProject);
        state.currentResume.updatedAt = new Date().toISOString();
      }
    },

    updateProject: (state, action: PayloadAction<Project>) => {
      if (state.currentResume) {
        const index = state.currentResume.projects.findIndex(
          (proj) => proj.id === action.payload.id
        );
        if (index !== -1) {
          state.currentResume.projects[index] = action.payload;
          state.currentResume.updatedAt = new Date().toISOString();
        }
      }
    },

    deleteProject: (state, action: PayloadAction<string>) => {
      if (state.currentResume) {
        state.currentResume.projects = state.currentResume.projects.filter(
          (proj) => proj.id !== action.payload
        );
        state.currentResume.updatedAt = new Date().toISOString();
      }
    },

    addSkill: (state, action: PayloadAction<Omit<Skill, "id">>) => {
      if (state.currentResume) {
        const newSkill: Skill = {
          ...action.payload,
          id: uuidv4(),
        };
        state.currentResume.skills.push(newSkill);
        state.currentResume.updatedAt = new Date().toISOString();
      }
    },

    updateSkill: (state, action: PayloadAction<Skill>) => {
      if (state.currentResume) {
        const index = state.currentResume.skills.findIndex(
          (skill) => skill.id === action.payload.id
        );
        if (index !== -1) {
          state.currentResume.skills[index] = action.payload;
          state.currentResume.updatedAt = new Date().toISOString();
        }
      }
    },

    deleteSkill: (state, action: PayloadAction<string>) => {
      if (state.currentResume) {
        state.currentResume.skills = state.currentResume.skills.filter(
          (skill) => skill.id !== action.payload
        );
        state.currentResume.updatedAt = new Date().toISOString();
      }
    },

    addEducation: (state, action: PayloadAction<Omit<Education, "id">>) => {
      if (state.currentResume) {
        const newEducation: Education = {
          ...action.payload,
          id: uuidv4(),
        };
        state.currentResume.education.push(newEducation);
        state.currentResume.updatedAt = new Date().toISOString();
      }
    },

    updateEducation: (state, action: PayloadAction<Education>) => {
      if (state.currentResume) {
        const index = state.currentResume.education.findIndex(
          (edu) => edu.id === action.payload.id
        );
        if (index !== -1) {
          state.currentResume.education[index] = action.payload;
          state.currentResume.updatedAt = new Date().toISOString();
        }
      }
    },

    deleteEducation: (state, action: PayloadAction<string>) => {
      if (state.currentResume) {
        state.currentResume.education = state.currentResume.education.filter(
          (edu) => edu.id !== action.payload
        );
        state.currentResume.updatedAt = new Date().toISOString();
      }
    },

    addAward: (state, action: PayloadAction<Omit<Award, "id">>) => {
      if (state.currentResume) {
        const newAward: Award = {
          ...action.payload,
          id: uuidv4(),
        };
        state.currentResume.awards.push(newAward);
        state.currentResume.updatedAt = new Date().toISOString();
      }
    },

    updateAward: (state, action: PayloadAction<Award>) => {
      if (state.currentResume) {
        const index = state.currentResume.awards.findIndex(
          (award) => award.id === action.payload.id
        );
        if (index !== -1) {
          state.currentResume.awards[index] = action.payload;
          state.currentResume.updatedAt = new Date().toISOString();
        }
      }
    },

    deleteAward: (state, action: PayloadAction<string>) => {
      if (state.currentResume) {
        state.currentResume.awards = state.currentResume.awards.filter(
          (award) => award.id !== action.payload
        );
        state.currentResume.updatedAt = new Date().toISOString();
      }
    },

    setEditing: (
      state,
      action: PayloadAction<{
        isEditing: boolean;
        section?: string;
        editingItemId?: string;
      }>
    ) => {
      state.isEditing = action.payload.isEditing;
      state.editingSection = action.payload.section || "";
      state.editingItemId = action.payload.editingItemId || null;
    },
  },
});

export const {
  setResume,
  createNewResume,
  updateContactInfo,
  addExperience,
  updateExperience,
  deleteExperience,
  reorderExperience,
  addProject,
  updateProject,
  deleteProject,
  addSkill,
  updateSkill,
  deleteSkill,
  addEducation,
  updateEducation,
  deleteEducation,
  addAward,
  updateAward,
  deleteAward,
  setEditing,
} = resumeSlice.actions;

export default resumeSlice.reducer;
