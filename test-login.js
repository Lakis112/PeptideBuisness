require('dotenv').config({ path: '.env.local' });
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

async function testLogin() {
    console.log('Testing login credentials...');
    
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });
    
    try {
        await client.connect();
        
        // 1. Check if user exists
        const userResult = await client.query(
            'SELECT * FROM users WHERE email = $1',
            ['researcher@lab.edu']
        );
        
        if (userResult.rows.length === 0) {
            console.log('❌ User not found in database');
            return;
        }
        
        const user = userResult.rows[0];
        console.log('✅ User found:', user.email);
        console.log('Password hash in DB:', user.password_hash.substring(0, 30) + '...');
        
        // 2. Test password "test123" against hash
        const isMatch = await bcrypt.compare('test123', user.password_hash);
        console.log('Password "test123" matches:', isMatch);
        
        if (!isMatch) {
            console.log('❌ Password does not match!');
            console.log('Trying common alternatives...');
            
            const testPasswords = ['password', '123456', 'Password123', 'Test123'];
            for (const pwd of testPasswords) {
                const match = await bcrypt.compare(pwd, user.password_hash);
                if (match) {
                    console.log(`✅ Found! Password is: "${pwd}"`);
                    return;
                }
            }
            console.log('None of the test passwords matched.');
        }
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await client.end();
    }
}

testLogin();