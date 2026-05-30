-- Documents table for file uploads
CREATE TABLE IF NOT EXISTS documents (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  size INT NOT NULL DEFAULT 0,
  type VARCHAR(50) NOT NULL DEFAULT 'file',
  entity_type VARCHAR(50) NOT NULL, -- 'case', 'hearing', 'client'
  entity_id VARCHAR(255) NOT NULL, -- ID of related entity
  file_path VARCHAR(500) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_entity ON documents(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON documents(uploaded_at DESC);

-- Sample data for testing
INSERT INTO documents (id, name, original_name, size, type, entity_type, entity_id, file_path, uploaded_at) VALUES
('1', 'contract.pdf', '123456_contract.pdf', 1024000, 'file', 'case', 'CASE0001', '/uploads/123456_contract.pdf', NOW()),
('2', 'evidence', '123457_evidence.zip', 2048000, 'file', 'case', 'CASE0001', '/uploads/123457_evidence.zip', NOW()),
('3', 'court_transcript', 'http://example.com/transcript.pdf', 0, 'link', 'hearing', 'HRG0001', 'http://example.com/transcript.pdf', NOW()),
('4', 'client_photo', '123458_client.jpg', 512000, 'file', 'client', 'CLI0001', '/uploads/123458_client.jpg', NOW());
