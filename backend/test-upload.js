const mysql = require('mysql2/promise');

async function testDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'admin',
      database: 'juristrack'
    });

    // Check if documents table exists
    const [rows] = await connection.execute("SHOW TABLES LIKE 'documents'");
    console.log('Documents table exists:', rows.length > 0);

    // Create documents table if it doesn't exist
    if (rows.length === 0) {
      await connection.execute(`
        CREATE TABLE documents (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          original_name VARCHAR(255) NOT NULL,
          size INT NOT NULL DEFAULT 0,
          type VARCHAR(50) NOT NULL DEFAULT 'file',
          entity_type VARCHAR(50) NOT NULL,
          entity_id VARCHAR(255) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.log('Documents table created successfully');
    }

    // Show table structure
    const [structure] = await connection.execute("DESCRIBE documents");
    console.log('Documents table structure:');
    structure.forEach(row => console.log(row));

    await connection.end();
  } catch (error) {
    console.error('Database test error:', error);
  }
}

testDatabase();
