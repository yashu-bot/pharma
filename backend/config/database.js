require('dotenv').config();

// Detect database type based on DB_PORT
// PostgreSQL uses port 5432 (production/Render)
// MySQL uses port 3306 or no port specified (local development)
const isPostgres = process.env.DB_PORT === '5432' || process.env.NODE_ENV === 'production';

if (isPostgres) {
    // PostgreSQL configuration
    const { Pool } = require('pg');
    
    const pool = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 5432,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Convert MySQL-style queries to PostgreSQL
    const promisePool = {
        query: async (sql, params) => {
            // Convert MySQL ? placeholders to PostgreSQL $1, $2, etc.
            let paramIndex = 1;
            const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
            
            try {
                const result = await pool.query(pgSql, params);
                // Return in MySQL format [rows, fields]
                return [result.rows, result.fields];
            } catch (error) {
                console.error('Database query error:', error);
                throw error;
            }
        },
        
        getConnection: async () => {
            const client = await pool.connect();
            return {
                query: async (sql, params) => {
                    let paramIndex = 1;
                    const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
                    const result = await client.query(pgSql, params);
                    return [result.rows, result.fields];
                },
                beginTransaction: async () => {
                    await client.query('BEGIN');
                },
                commit: async () => {
                    await client.query('COMMIT');
                },
                rollback: async () => {
                    await client.query('ROLLBACK');
                },
                release: () => {
                    client.release();
                }
            };
        }
    };

    module.exports = promisePool;
} else {
    // MySQL configuration
    const mysql = require('mysql2');
    
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    const promisePool = pool.promise();
    
    // Add getConnection method for MySQL
    promisePool.getConnection = async () => {
        const connection = await pool.promise().getConnection();
        return {
            query: async (sql, params) => {
                const [rows, fields] = await connection.query(sql, params);
                return [rows, fields];
            },
            beginTransaction: async () => {
                await connection.beginTransaction();
            },
            commit: async () => {
                await connection.commit();
            },
            rollback: async () => {
                await connection.rollback();
            },
            release: () => {
                connection.release();
            }
        };
    };
    
    module.exports = promisePool;
}
