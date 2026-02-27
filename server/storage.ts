import { db } from "./db";
import {
  candidates,
  documents,
  analyses,
  type InsertCandidate,
  type InsertDocument,
  type InsertAnalysis,
  type CandidateWithAnalysis
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getCandidates(): Promise<CandidateWithAnalysis[]>;
  getCandidate(id: number): Promise<CandidateWithAnalysis | undefined>;
  createCandidate(candidate: InsertCandidate): Promise<number>;
  createDocument(document: InsertDocument): Promise<number>;
  createAnalysis(analysis: InsertAnalysis): Promise<void>;
  getDocument(id: number): Promise<typeof documents.$inferSelect | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getCandidates(): Promise<CandidateWithAnalysis[]> {
    const rows = await db.select().from(candidates).orderBy(desc(candidates.id));
    
    const result: CandidateWithAnalysis[] = [];
    for (const row of rows) {
      const docs = await db.select().from(documents).where(eq(documents.candidateId, row.id));
      const doc = docs[0] || null;
      
      let analysis = null;
      if (doc) {
        const analysisRows = await db.select().from(analyses).where(eq(analyses.documentId, doc.id));
        analysis = analysisRows[0] || null;
      }
      
      result.push({
        ...row,
        document: doc,
        analysis,
      });
    }
    
    return result;
  }

  async getCandidate(id: number): Promise<CandidateWithAnalysis | undefined> {
    const rows = await db.select().from(candidates).where(eq(candidates.id, id));
    if (rows.length === 0) return undefined;
    
    const row = rows[0];
    const docs = await db.select().from(documents).where(eq(documents.candidateId, row.id));
    const doc = docs[0] || null;
    
    let analysis = null;
    if (doc) {
      const analysisRows = await db.select().from(analyses).where(eq(analyses.documentId, doc.id));
      analysis = analysisRows[0] || null;
    }
    
    return {
      ...row,
      document: doc,
      analysis,
    };
  }

  async createCandidate(candidate: InsertCandidate): Promise<number> {
    const [inserted] = await db.insert(candidates).values(candidate).returning({ id: candidates.id });
    return inserted.id;
  }

  async createDocument(document: InsertDocument): Promise<number> {
    const [inserted] = await db.insert(documents).values(document).returning({ id: documents.id });
    return inserted.id;
  }

  async createAnalysis(analysis: InsertAnalysis): Promise<void> {
    await db.insert(analyses).values(analysis);
  }

  async getDocument(id: number): Promise<typeof documents.$inferSelect | undefined> {
    const rows = await db.select().from(documents).where(eq(documents.id, id));
    return rows[0] || undefined;
  }
}

export const storage = new DatabaseStorage();
