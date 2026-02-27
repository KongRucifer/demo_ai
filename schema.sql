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
