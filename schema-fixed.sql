-- Drop existing tables and recreate with correct column names
DROP TABLE IF EXISTS analyses CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS candidates CASCADE;

-- Create candidates table with camelCase column names
CREATE TABLE candidates (
    id SERIAL PRIMARY KEY,
    fullName TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    appliedAt TIMESTAMP DEFAULT NOW()
);

-- Create documents table with camelCase column names
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    candidateId INTEGER NOT NULL REFERENCES candidates(id),
    filePath TEXT NOT NULL,
    fileType TEXT NOT NULL,
    rawText TEXT
);

-- Create analyses table with camelCase column names
CREATE TABLE analyses (
    id SERIAL PRIMARY KEY,
    documentId INTEGER NOT NULL REFERENCES documents(id),
    extractedSkills JSONB,
    matchingScore INTEGER,
    aiSummary TEXT,
    status TEXT
);
