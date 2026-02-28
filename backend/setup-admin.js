const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function setupAdmin() {
    try {
        // Hash the password
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log('Generated hash for "admin123":', hashedPassword);
        
        // Check if admin exists
        const [admins] = await db.query('SELECT * FROM admin WHERE phone = ?', ['1234567890']);
        
        if (admins.length > 0) {
            // Update existing admin
            await db.query('UPDATE admin SET password = ? WHERE phone = ?', [hashedPassword, '1234567890']);
            console.log('✅ Admin password updated successfully!');
        } else {
            // Insert new admin
            await db.query(
                'INSERT INTO admin (pharma_name, address, phone, password) VALUES (?, ?, ?, ?)',
                ['Default Pharma', '123 Main Street, City', '1234567890', hashedPassword]
            );
            console.log('✅ Admin account created successfully!');
        }
        
        console.log('\nAdmin Login Credentials:');
        console.log('Phone: 1234567890');
        console.log('Password: admin123');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

setupAdmin();
