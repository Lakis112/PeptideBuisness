import { Pool } from 'pg';

console.log('🔧 Initializing database connection...');

// Debug: Show what's loaded
console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);
if (process.env.DATABASE_URL) {
    console.log('Connection string (first part):', process.env.DATABASE_URL.substring(0, 50) + '...');
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test connection on import
pool.query('SELECT 1')
    .then(() => {
        console.log('✅ Database connection successful');
    })
    .catch((err) => {
        console.error('❌ Database connection failed:', err.message);
        console.error('Error code:', err.code);
        console.error('Error detail:', err.detail);
    });

export default pool;