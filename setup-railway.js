const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
    console.log('🔧 Setting up Railway PostgreSQL database...');
    
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL not found in .env.local');
        return;
    }
    
    console.log('Connecting to:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@'));
    
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    
    try {
        await client.connect();
        console.log('✅ Connected to Railway!');
        
        // 1. Create users table
        console.log('\n1. Creating users table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                organization VARCHAR(255),
                phone VARCHAR(50),
                address TEXT,
                country VARCHAR(100),
                account_type VARCHAR(50) DEFAULT 'researcher',
                email_verified BOOLEAN DEFAULT FALSE,
                verification_token VARCHAR(100),
                reset_token VARCHAR(100),
                reset_expires TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP,
                status VARCHAR(20) DEFAULT 'active'
            );
        `);
        console.log('   ✅ Users table created');
        
        // 2. Create orders table
        console.log('2. Creating orders table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                order_number VARCHAR(50) UNIQUE NOT NULL,
                status VARCHAR(50) DEFAULT 'pending',
                subtotal DECIMAL(10, 2),
                shipping DECIMAL(10, 2),
                tax DECIMAL(10, 2),
                total DECIMAL(10, 2),
                shipping_method VARCHAR(100),
                tracking_number VARCHAR(100),
                carrier VARCHAR(50),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('   ✅ Orders table created');
        
        // 3. Create documents table
        console.log('3. Creating documents table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS documents (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                document_type VARCHAR(50) NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                file_name VARCHAR(255) NOT NULL,
                file_path VARCHAR(500) NOT NULL,
                file_size INTEGER,
                batch_number VARCHAR(100),
                product_id VARCHAR(100),
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_public BOOLEAN DEFAULT FALSE
            );
        `);
        console.log('   ✅ Documents table created');
        
        // 4. Create support tickets table
        console.log('4. Creating support tickets table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS support_tickets (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                ticket_number VARCHAR(50) UNIQUE NOT NULL,
                subject VARCHAR(255) NOT NULL,
                category VARCHAR(50) DEFAULT 'other',
                status VARCHAR(50) DEFAULT 'open',
                priority VARCHAR(50) DEFAULT 'medium',
                last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('   ✅ Support tickets table created');
        
        // 5. Create ticket messages table
        console.log('5. Creating ticket messages table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS ticket_messages (
                id SERIAL PRIMARY KEY,
                ticket_id INTEGER REFERENCES support_tickets(id) ON DELETE CASCADE,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                message TEXT NOT NULL,
                is_staff_reply BOOLEAN DEFAULT FALSE,
                attachments JSONB,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('   ✅ Ticket messages table created');
        
        // 6. Insert test data
        console.log('6. Creating test user...');
        await client.query(`
            INSERT INTO users (email, password_hash, first_name, last_name, organization, email_verified)
            VALUES ('researcher@lab.edu', '$2a$10$N9qo8uLOickgx2ZMRZoMye7Z7iK2.8zYFj2w7GJ2sQ4Q2JQ4WQ4Wq', 'John', 'Smith', 'University Research Lab', true)
            ON CONFLICT (email) DO NOTHING;
        `);
        console.log('   ✅ Test user created (email: researcher@lab.edu, password: test123)');
        
        // 7. Verify tables
        console.log('\n7. Verifying setup...');
        const tables = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);
        
        console.log('   Tables created:', tables.rows.map(r => r.table_name).join(', '));
        
        console.log('\n🎉 DATABASE SETUP COMPLETE!');
        console.log('\nNext steps:');
        console.log('1. Restart server: npm run dev');
        console.log('2. Visit: http://localhost:3000/api/health');
        console.log('3. Register at: http://localhost:3000/register');
        
    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.error('Error details:', error);
    } finally {
        await client.end();
    }
}

setupDatabase();