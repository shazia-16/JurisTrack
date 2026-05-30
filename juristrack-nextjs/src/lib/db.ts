import mysql from 'mysql2/promise'

// Connection pool configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'juristrack',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log('✅ Database connected successfully')
    connection.release()
    return true
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return false
  }
}

// Execute query with error handling
async function query(sql: string, params: any[] = []): Promise<any[]> {
  try {
    const [rows, fields] = await pool.execute(sql, params)
    // mysql2 returns RowDataPacket[] for SELECT queries and OkPacket for INSERT/UPDATE/DELETE
    // We need to handle both cases
    if (Array.isArray(rows)) {
      return rows as any[]
    } else {
      // For INSERT/UPDATE/DELETE queries, return empty array
      return []
    }
  } catch (error) {
    console.error('Database query error:', error)
    throw new Error(`Database error: ${error}`)
  }
}

// Execute query that returns a single result
async function queryOne(sql: string, params: any[] = []): Promise<any | null> {
  try {
    const results = await query(sql, params)
    return results.length > 0 ? results[0] : null
  } catch (error) {
    console.error('Database query error:', error)
    throw new Error(`Database error: ${error}`)
  }
}

// Execute transaction
async function transaction(callback: (connection: any) => Promise<any>) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

// Close all connections
async function closePool() {
  await pool.end()
  console.log('Database connection pool closed')
}

export {
  pool,
  query,
  queryOne,
  transaction,
  testConnection,
  closePool
}
