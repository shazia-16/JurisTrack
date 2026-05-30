const mysql = require('mysql2');

// Create connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_NAME || 'juristrack'
});

// Create tables one by one
async function createTables() {
    try {
        // Drop existing tables
        await dropTable('documents');
        await dropTable('hearings');
        await dropTable('cases');
        await dropTable('judges');
        await dropTable('clients');

        // Create clients table
        await executeQuery(`
            CREATE TABLE clients (
                id VARCHAR(20) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE,
                phone VARCHAR(20),
                address TEXT,
                type ENUM('Individual', 'Corporate', 'Government') NOT NULL,
                status ENUM('Active', 'Inactive') DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create judges table
        await executeQuery(`
            CREATE TABLE judges (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE,
                phone VARCHAR(20),
                court VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Create cases table
        await executeQuery(`
            CREATE TABLE cases (
                id VARCHAR(20) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                status ENUM('Active', 'Pending', 'Closed') DEFAULT 'Active',
                court VARCHAR(255),
                next_hearing_date DATE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        // Create hearings table
        await executeQuery(`
            CREATE TABLE hearings (
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
            )
        `);

        console.log('✅ Tables created successfully!');

        // Insert sample data
        await insertSampleData();
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        connection.end();
    }
}

function dropTable(tableName) {
    return new Promise((resolve, reject) => {
        connection.query(`DROP TABLE IF EXISTS ${tableName}`, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

function executeQuery(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
}

async function insertSampleData() {
    try {
        // Insert clients
        await executeQuery(`
            INSERT INTO clients (id, name, email, phone, address, type) VALUES
            ('CLI000001', 'John Smith', 'john.smith@email.com', '555-0101', '123 Main St, City, State', 'Individual'),
            ('CLI000002', 'ABC Corporation', 'legal@abc-corp.com', '555-0102', '456 Business Ave, City, State', 'Corporate'),
            ('CLI000003', 'Jane Doe', 'jane.doe@email.com', '555-0103', '789 Oak St, City, State', 'Individual'),
            ('CLI000004', 'XYZ Legal Firm', 'contact@xyz-law.com', '555-0104', '321 Legal Blvd, City, State', 'Corporate'),
            ('CLI000005', 'Government Agency', 'legal@gov.gov', '555-0105', '654 Gov Way, City, State', 'Government')
        `);

        // Insert judges
        await executeQuery(`
            INSERT INTO judges (name, email, phone, court) VALUES
            ('Judge Robert Johnson', 'r.johnson@court.gov', '555-0201', 'Superior Court'),
            ('Judge Sarah Williams', 's.williams@court.gov', '555-0202', 'District Court'),
            ('Judge Michael Brown', 'm.brown@court.gov', '555-0203', 'Circuit Court'),
            ('Judge Emily Davis', 'e.davis@court.gov', '555-0204', 'Municipal Court'),
            ('Judge James Wilson', 'j.wilson@court.gov', '555-0205', 'Federal Court')
        `);

        // Insert cases
        await executeQuery(`
            INSERT INTO cases (id, title, status, court, next_hearing_date) VALUES
            ('CASE0001', 'Smith vs. Johnson', 'Active', 'Superior Court', '2024-01-20'),
            ('CASE0002', 'ABC Corp Contract Dispute', 'Active', 'District Court', '2024-01-21'),
            ('CASE0003', 'Doe Family Law Matter', 'Pending', 'Family Court', '2024-01-22'),
            ('CASE0004', 'XYZ vs. State', 'Active', 'Criminal Court', '2024-01-23'),
            ('CASE0005', 'Government Regulatory Case', 'Closed', 'Federal Court', NULL)
        `);

        // Insert hearings
        await executeQuery(`
            INSERT INTO hearings (id, type, date, time, courtroom, status, judge, case_id) VALUES
            ('HRG0001', 'Initial Hearing', '2024-01-20', '09:00:00', 'Courtroom 101', 'Scheduled', 'Judge Robert Johnson', 'CASE0001'),
            ('HRG0002', 'Status Conference', '2024-01-21', '14:00:00', 'Courtroom 102', 'Scheduled', 'Judge Sarah Williams', 'CASE0002'),
            ('HRG0003', 'Pre-trial Motion', '2024-01-22', '10:30:00', 'Courtroom 103', 'In Progress', 'Judge Michael Brown', 'CASE0003'),
            ('HRG0004', 'Arraignment', '2024-01-23', '11:00:00', 'Courtroom 104', 'Scheduled', 'Judge Emily Davis', 'CASE0004'),
            ('HRG0005', 'Final Hearing', '2024-01-24', '15:00:00', 'Courtroom 105', 'Completed', 'Judge James Wilson', 'CASE0005')
        `);

        console.log('✅ Sample data inserted successfully!');
    } catch (error) {
        console.error('Error inserting data:', error);
    }
}

createTables();
