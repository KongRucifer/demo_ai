import { db } from "./db";
import { supabase } from "./supabase";
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
    try {
      // Try Drizzle first
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
          analysis: analysis ? {
            ...analysis,
            extractedSkills: Array.isArray(analysis.extractedSkills) 
              ? Array.from(analysis.extractedSkills).filter(skill => typeof skill === 'string')
              : analysis.extractedSkills
          } : null,
        });
      }
      
      return result;
    } catch (error) {
      // Fallback to Supabase client
      console.log('Using Supabase client fallback');
      const { data: candidatesData, error: candidatesError } = await supabase
        .from('candidates')
        .select('id, full_name, email, phone, applied_at')
        .order('id', { ascending: false });

      if (candidatesError) throw candidatesError;

      const result: CandidateWithAnalysis[] = [];
      for (const candidate of candidatesData || []) {
        const { data: docs } = await supabase
          .from('documents')
          .select('id, candidate_id, file_path, file_type, raw_text')
          .eq('candidate_id', candidate.id)
          .limit(1);
        
        const doc = docs?.[0] || null;
        
        let analysis = null;
        if (doc) {
          const { data: analyses } = await supabase
            .from('analyses')
            .select('*')
            .eq('document_id', doc.id)
            .limit(1);
          analysis = analyses?.[0] || null;
        }
        
        result.push({
          id: candidate.id,
          fullName: candidate.full_name,
          email: candidate.email,
          phone: candidate.phone,
          appliedAt: candidate.applied_at,
          document: doc ? {
            id: doc.id,
            candidateId: doc.candidate_id,
            filePath: doc.file_path,
            fileType: doc.file_type,
            rawText: doc.raw_text,
          } : null,
          analysis: analysis ? {
            ...analysis,
            extractedSkills: Array.isArray(analysis.extracted_skills) 
              ? Array.from(analysis.extracted_skills).filter(skill => typeof skill === 'string')
              : analysis.extracted_skills
          } : null,
        });
      }
      
      return result;
    }
  }

  async getCandidate(id: number): Promise<CandidateWithAnalysis | undefined> {
    try {
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
        analysis: analysis ? {
          ...analysis,
          extractedSkills: Array.isArray(analysis.extractedSkills) 
            ? Array.from(analysis.extractedSkills).filter(skill => typeof skill === 'string')
            : analysis.extractedSkills
        } : null,
      };
    } catch (error) {
      // Fallback to Supabase client
      console.log('Using Supabase client fallback for getCandidate');
      const { data: candidate, error: candidateError } = await supabase
        .from('candidates')
        .select('id, full_name, email, phone, applied_at')
        .eq('id', id)
        .single();

      if (candidateError) throw candidateError;
      if (!candidate) return undefined;

      const { data: docs } = await supabase
        .from('documents')
        .select('id, candidate_id, file_path, file_type, raw_text')
        .eq('candidate_id', candidate.id)
        .limit(1);
      
      const doc = docs?.[0] || null;
      
      let analysis = null;
      if (doc) {
        const { data: analyses } = await supabase
          .from('analyses')
          .select('*')
          .eq('document_id', doc.id)
          .limit(1);
        analysis = analyses?.[0] || null;
      }
      
      return {
        id: candidate.id,
        fullName: candidate.full_name,
        email: candidate.email,
        phone: candidate.phone,
        appliedAt: candidate.applied_at,
        document: doc ? {
          id: doc.id,
          candidateId: doc.candidate_id,
          filePath: doc.file_path,
          fileType: doc.file_type,
          rawText: doc.raw_text,
        } : null,
        analysis: analysis ? {
          ...analysis,
          extractedSkills: Array.isArray(analysis.extracted_skills) 
            ? Array.from(analysis.extracted_skills).filter(skill => typeof skill === 'string')
            : analysis.extracted_skills
        } : null,
      };
    }
  }

  async createCandidate(candidate: InsertCandidate): Promise<number> {
    try {
      const [inserted] = await db.insert(candidates).values(candidate).returning({ id: candidates.id });
      return inserted.id;
    } catch (error) {
      // Fallback to Supabase client
      console.log('Using Supabase client fallback for createCandidate');
      const { data, error: insertError } = await supabase
        .from('candidates')
        .insert({
          full_name: candidate.fullName,
          email: candidate.email,
          phone: candidate.phone,
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      return data.id;
    }
  }

  async createDocument(document: InsertDocument): Promise<number> {
    try {
      const [inserted] = await db.insert(documents).values(document).returning({ id: documents.id });
      return inserted.id;
    } catch (error) {
      // Fallback to Supabase client
      console.log('Using Supabase client fallback for createDocument');
      const { data, error: insertError } = await supabase
        .from('documents')
        .insert({
          candidate_id: document.candidateId,
          file_path: document.filePath,
          file_type: document.fileType,
          raw_text: document.rawText,
        })
        .select('id')
        .single();

      if (insertError) throw insertError;
      return data.id;
    }
  }

  async createAnalysis(analysis: InsertAnalysis): Promise<void> {
    try {
      // Ensure extractedSkills is a proper string array
      const analysisData = {
        ...analysis,
        extractedSkills: analysis.extractedSkills ? 
          Array.from(analysis.extractedSkills).filter(skill => typeof skill === 'string') : 
          null,
      };
      await db.insert(analyses).values(analysisData);
    } catch (error) {
      // Fallback to Supabase client
      console.log('Using Supabase client fallback for createAnalysis');
      const analysisData = {
        document_id: analysis.documentId,
        extracted_skills: analysis.extractedSkills ? 
          Array.from(analysis.extractedSkills).filter(skill => typeof skill === 'string') : 
          null,
        matching_score: analysis.matchingScore,
        ai_summary: analysis.aiSummary,
        status: analysis.status,
      };
      
      const { error: insertError } = await supabase
        .from('analyses')
        .insert(analysisData);

      if (insertError) throw insertError;
    }
  }

  async getDocument(id: number): Promise<typeof documents.$inferSelect | undefined> {
    try {
      const rows = await db.select().from(documents).where(eq(documents.id, id));
      return rows[0] || undefined;
    } catch (error) {
      // Fallback to Supabase client
      console.log('Using Supabase client fallback for getDocument');
      const { data, error: selectError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (selectError) {
        if (selectError.code === 'PGRST116') return undefined; // No rows returned
        throw selectError;
      }
      return data;
    }
  }
}

export const storage = new DatabaseStorage();
