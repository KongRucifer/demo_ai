// Database setup script for Railway
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// For Railway Postgres, you'll need to use a different approach
// This script is for Supabase only

console.log('For Railway Postgres setup:');
console.log('1. Get DATABASE_URL from Railway Postgres service');
console.log('2. Connect using psql or GUI tool');
console.log('3. Run the schema.sql file contents');

console.log('\nSchema.sql contents:');
console.log(`
-- Create candidates table
CREATE TABLE IF NOT EXISTS candidates (
    id SERIAL PRIMARY KEY,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    applied_at TIMESTAMP DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER NOT NULL REFERENCES candidates(id),
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    raw_text TEXT
);

-- Create analyses table
CREATE TABLE IF NOT EXISTS analyses (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id),
    extracted_skills JSONB,
    matching_score INTEGER,
    ai_summary TEXT,
    status TEXT
);
`);
