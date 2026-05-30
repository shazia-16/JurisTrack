-- JurisTrack MySQL Database Schema
-- Run this script to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS juristrack;
USE juristrack;

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    address TEXT,
    type ENUM('Individual', 'Corporate', 'Government') NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Judges table
CREATE TABLE IF NOT EXISTS judges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    court VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cases table
CREATE TABLE IF NOT EXISTS cases (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    status ENUM('Active', 'Pending', 'Closed') DEFAULT 'Active',
    court VARCHAR(255),
    next_hearing_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Hearings table
CREATE TABLE IF NOT EXISTS hearings (
    id VARCHAR(20) PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    courtroom VARCHAR(100) NOT NULL,
    status ENUM('Scheduled', 'In Progress', 'Completed', 'Postponed') DEFAULT 'Scheduled',
    judge VARCHAR(255) NOT NULL,
    case_id VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    id VARCHAR(20) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type ENUM('Complaint', 'Evidence', 'Contract', 'Motion', 'Order', 'Other') NOT NULL,
    format VARCHAR(10) DEFAULT 'PDF',
    size VARCHAR(20),
    file_path VARCHAR(500),
    uploaded_date DATE DEFAULT (CURRENT_DATE),
    uploaded_by VARCHAR(255) NOT NULL,
    case_id VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
);

-- Insert sample data
INSERT INTO clients (id, name, email, phone, address, type) VALUES
('CLI000001', 'John Smith', 'john.smith@email.com', '555-0101', '123 Main St, City, State', 'Individual'),
('CLI000002', 'ABC Corporation', 'legal@abc-corp.com', '555-0102', '456 Business Ave, City, State', 'Corporate'),
('CLI000003', 'Jane Doe', 'jane.doe@email.com', '555-0103', '789 Oak St, City, State', 'Individual'),
('CLI000004', 'XYZ Legal Firm', 'contact@xyz-law.com', '555-0104', '321 Legal Blvd, City, State', 'Corporate'),
('CLI000005', 'Government Agency', 'legal@gov.gov', '555-0105', '654 Gov Way, City, State', 'Government');

INSERT INTO judges (name, email, phone, court) VALUES
('Judge Robert Johnson', 'r.johnson@court.gov', '555-0201', 'Superior Court'),
('Judge Sarah Williams', 's.williams@court.gov', '555-0202', 'District Court'),
('Judge Michael Brown', 'm.brown@court.gov', '555-0203', 'Circuit Court'),
('Judge Emily Davis', 'e.davis@court.gov', '555-0204', 'Municipal Court'),
('Judge James Wilson', 'j.wilson@court.gov', '555-0205', 'Federal Court');

INSERT INTO cases (id, title, status, court, next_hearing_date) VALUES
('CASE0001', 'Smith vs. Johnson', 'Active', 'Superior Court', '2024-01-20'),
('CASE0002', 'ABC Corp Contract Dispute', 'Active', 'District Court', '2024-01-21'),
('CASE0003', 'Doe Family Law Matter', 'Pending', 'Family Court', '2024-01-22'),
('CASE0004', 'XYZ vs. State', 'Active', 'Criminal Court', '2024-01-23'),
('CASE0005', 'Government Regulatory Case', 'Closed', 'Federal Court', NULL);

INSERT INTO hearings (id, type, date, time, courtroom, status, judge, case_id) VALUES
('HRG0001', 'Initial Hearing', '2024-01-20', '09:00:00', 'Courtroom 101', 'Scheduled', 'Judge Robert Johnson', 'CASE0001'),
('HRG0002', 'Status Conference', '2024-01-21', '14:00:00', 'Courtroom 102', 'Scheduled', 'Judge Sarah Williams', 'CASE0002'),
('HRG0003', 'Pre-trial Motion', '2024-01-22', '10:30:00', 'Courtroom 103', 'In Progress', 'Judge Michael Brown', 'CASE0003'),
('HRG0004', 'Arraignment', '2024-01-23', '11:00:00', 'Courtroom 104', 'Scheduled', 'Judge Emily Davis', 'CASE0004'),
('HRG0005', 'Final Hearing', '2024-01-24', '15:00:00', 'Courtroom 105', 'Completed', 'Judge James Wilson', 'CASE0005');

INSERT INTO documents (id, title, type, format, size, uploaded_by, case_id) VALUES
('DOC0001', 'Initial Complaint', 'Complaint', 'PDF', '2.5 MB', 'John Smith', 'CASE0001'),
('DOC0002', 'Contract Agreement', 'Contract', 'DOC', '1.2 MB', 'Legal Team', 'CASE0002'),
('DOC0003', 'Marriage Certificate', 'Evidence', 'PDF', '0.8 MB', 'Jane Doe', 'CASE0003'),
('DOC0004', 'Police Report', 'Evidence', 'PDF', '3.1 MB', 'Prosecution', 'CASE0004'),
('DOC0005', 'Compliance Order', 'Order', 'PDF', '1.5 MB', 'Court Clerk', 'CASE0005');

-- Create indexes for better performance
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_client ON cases(client_id);
CREATE INDEX idx_hearings_date ON hearings(date);
CREATE INDEX idx_hearings_case ON hearings(case_id);
CREATE INDEX idx_documents_case ON documents(case_id);
CREATE INDEX idx_clients_type ON clients(type);
