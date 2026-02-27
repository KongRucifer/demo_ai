import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api, errorSchemas } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import fs from "fs";
import path from "path";
import express from "express";
import { healthCheck } from "./health";

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({ dest: 'uploads/' });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.use('/uploads', express.static(uploadsDir));

  app.get(api.candidates.list.path, async (req, res) => {
    try {
      const list = await storage.getCandidates();
      res.json(list);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get(api.candidates.get.path, async (req, res) => {
    try {
      const id = Number(req.params.id);
      const candidate = await storage.getCandidate(id);
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }
      res.json(candidate);
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.candidates.create.path, upload.single('resume'), async (req, res) => {
    try {
      const { fullName, email, phone } = req.body;
      const file = req.file;

      if (!fullName || !email || !phone || !file) {
        return res.status(400).json({ message: "Missing required fields or file" });
      }

      const candidateId = await storage.createCandidate({ fullName, email, phone });
      
      const documentId = await storage.createDocument({
        candidateId,
        filePath: file.path,
        fileType: file.mimetype,
        rawText: "Simulated PDF text content for AI processing...",
      });

      const mockSkills = ["JavaScript", "React", "Node.js", "TypeScript", "Problem Solving", "Communication"];
      const score = Math.floor(Math.random() * 30) + 70; // Random score between 70 and 100
      const status = score > 85 ? 'Pass' : score > 75 ? 'Review' : 'Fail';

      await storage.createAnalysis({
        documentId,
        extractedSkills: mockSkills,
        matchingScore: score,
        aiSummary: `This candidate has a solid matching score of ${score}%. They possess strong foundational skills suitable for the role. Further review recommended based on actual experience in prior roles.`,
        status,
      });

      res.status(201).json({ success: true, candidateId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.analyze.create.path, async (req, res) => {
    try {
      const { documentId, rawText } = api.analyze.create.input.parse(req.body);
      const doc = await storage.getDocument(documentId);
      if (!doc) return res.status(404).json({ message: "Document not found" });

      const mockSkills = ["React", "Express", "Leadership"];
      const score = 88;
      const status = 'Pass';

      await storage.createAnalysis({
        documentId,
        extractedSkills: mockSkills,
        matchingScore: score,
        aiSummary: "Analysis simulated successfully based on raw text.",
        status,
      });

      res.json({ success: true });
    } catch(err) {
       res.status(400).json({ message: "Error parsing request" });
    }
  });

  // Seed DB with some realistic data if empty
  try {
    const list = await storage.getCandidates();
    if (list.length === 0) {
      const candidateId1 = await storage.createCandidate({ fullName: "Amjad Masad", email: "amjad@example.com", phone: "123-456-7890" });
      const docId1 = await storage.createDocument({ candidateId: candidateId1, filePath: "mock/path/resume1.pdf", fileType: "application/pdf", rawText: "Founder of Replit" });
      await storage.createAnalysis({ documentId: docId1, extractedSkills: ["Leadership", "Engineering", "Vision"], matchingScore: 98, aiSummary: "Exceptional candidate with strong background.", status: "Pass" });

      const candidateId2 = await storage.createCandidate({ fullName: "Jane Doe", email: "jane.doe@example.com", phone: "555-000-1111" });
      const docId2 = await storage.createDocument({ candidateId: candidateId2, filePath: "mock/path/resume2.pdf", fileType: "application/pdf", rawText: "Frontend Developer" });
      await storage.createAnalysis({ documentId: docId2, extractedSkills: ["React", "CSS", "UI/UX"], matchingScore: 82, aiSummary: "Solid frontend skills.", status: "Pass" });

      const candidateId3 = await storage.createCandidate({ fullName: "John Smith", email: "john@example.com", phone: "555-222-3333" });
      const docId3 = await storage.createDocument({ candidateId: candidateId3, filePath: "mock/path/resume3.pdf", fileType: "application/pdf", rawText: "Junior Developer" });
      await storage.createAnalysis({ documentId: docId3, extractedSkills: ["HTML", "JavaScript"], matchingScore: 65, aiSummary: "Needs more experience in backend.", status: "Review" });
    }
  } catch (e) {
    console.log("Error seeding database:", e);
  }

  // Health check endpoint for Railway
  app.get('/api/health', healthCheck);

  return httpServer;
}
