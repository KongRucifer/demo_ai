import { pgTable, text, serial, timestamp, integer, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  appliedAt: timestamp("applied_at").defaultNow(),
});

export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  candidateId: integer("candidate_id").references(() => candidates.id).notNull(),
  filePath: text("file_path").notNull(),
  fileType: text("file_type").notNull(),
  rawText: text("raw_text"),
});

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").references(() => documents.id).notNull(),
  extractedSkills: json("extracted_skills").$type<string[]>(),
  matchingScore: integer("matching_score"),
  aiSummary: text("ai_summary"),
  status: text("status"), // e.g., 'Pass', 'Fail', 'Review'
});

export const insertCandidateSchema = createInsertSchema(candidates).omit({ id: true, appliedAt: true });
export const insertDocumentSchema = createInsertSchema(documents).omit({ id: true });
export const insertAnalysisSchema = createInsertSchema(analyses).omit({ id: true });

export type Candidate = typeof candidates.$inferSelect;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;

export type CandidateWithAnalysis = Candidate & {
  document: Document | null;
  analysis: Analysis | null;
};
