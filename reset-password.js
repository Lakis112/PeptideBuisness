require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function resetPassword() {
    console.log('Resetting password for researcher@lab.edu...');
    
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    
    try {
        await client.connect();
        
        // Generate CORRECT bcrypt hash for "test123"
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('test123', salt);
        
        console.log('Generated hash:', passwordHash);
        
        // Update the user
        const result = await client.query(`
            UPDATE users 
            SET password_hash = $1 
            WHERE email = 'researcher@lab.edu'
            RETURNING email
        `, [passwordHash]);
        
        if (result.rowCount > 0) {
            console.log('✅ Password updated successfully!');
            console.log('Email: researcher@lab.edu');
            console.log('Password: test123');
            
            // Verify
            const verify = await client.query(
                'SELECT email FROM users WHERE email = $1',
                ['researcher@lab.edu']
            );
            console.log('User verified:', verify.rows[0].email);
        } else {
            console.log('❌ User not found! Creating new one...');
            
            // Create user if doesn't exist
            await client.query(`
                INSERT INTO users (email, password_hash, first_name, last_name, organization, email_verified)
                VALUES ($1, $2, 'John', 'Smith', 'Research Lab', true)
            `, ['researcher@lab.edu', passwordHash]);
            
            console.log('✅ User created with password: test123');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await client.end();
    }
}

resetPassword();