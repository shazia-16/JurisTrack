import mysql from 'mysql2/promise'

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'juristrack',
  waitForConnections: true,
  connectionLimit: 10
}

// Create a connection pool
const pool = mysql.createPool(dbConfig)

// Helper function to execute queries
export async function query(sql: string, params: any[] = []) {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Helper function to execute transactions
export async function transaction(callback: (connection: any) => Promise<void>) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    await callback(connection)
    await connection.commit()
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

// Test database connection
export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()
    return true
  } catch (error) {
    console.error('Database connection test failed:', error)
    return false
  }
}

// Close all connections
export async function closePool() {
  await pool.end()
}
