import Dexie, { Table } from 'dexie';
import { ResumeData } from '../types/resume';

export class ResumeDatabase extends Dexie {
  resumes!: Table<ResumeData>;

  constructor() {
    super('ResumeDatabase');
    this.version(1).stores({
      resumes: 'id, createdAt, updatedAt, contactInfo.name',
    });
  }
}

export const db = new ResumeDatabase();

export class DatabaseService {
  static async saveResume(resume: ResumeData): Promise<void> {
    await db.resumes.put(resume);
  }

  static async getResume(id: string): Promise<ResumeData | undefined> {
    return await db.resumes.get(id);
  }

  static async getAllResumes(): Promise<ResumeData[]> {
    return await db.resumes.orderBy('updatedAt').reverse().toArray();
  }

  static async deleteResume(id: string): Promise<void> {
    await db.resumes.delete(id);
  }

  static async searchResumes(query: string): Promise<ResumeData[]> {
    return await db.resumes
      .filter(resume => 
        resume.contactInfo.name.toLowerCase().includes(query.toLowerCase()) ||
        resume.contactInfo.email.toLowerCase().includes(query.toLowerCase())
      )
      .toArray();
  }
}