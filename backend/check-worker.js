const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function checkWorker() {
    try {
        // Get the phone number from command line argument
        const phone = process.argv[2];
        const password = process.argv[3];
        
        if (!phone || !password) {
            console.log('Usage: node check-worker.js <phone> <password>');
            console.log('Example: node check-worker.js 9876543210 worker123');
            process.exit(1);
        }
        
        console.log(`\nChecking worker with phone: ${phone}`);
        console.log('='.repeat(50));
        
        // Query the worker
        const [workers] = await db.query('SELECT * FROM workers WHERE phone = ?', [phone]);
        
        if (workers.length === 0) {
            console.log('❌ Worker not found with this phone number!');
            console.log('\nAll workers in database:');
            const [allWorkers] = await db.query('SELECT id, name, phone, email FROM workers');
            console.table(allWorkers);
            process.exit(1);
        }
        
        const worker = workers[0];
        console.log('✅ Worker found!');
        console.log(`   ID: ${worker.id}`);
        console.log(`   Name: ${worker.name}`);
        console.log(`   Phone: ${worker.phone}`);
        console.log(`   Email: ${worker.email}`);
        console.log(`   Password Hash: ${worker.password.substring(0, 20)}...`);
        
        // Test password
        console.log(`\nTesting password: ${password}`);
        const isMatch = await bcrypt.compare(password, worker.password);
        
        if (isMatch) {
            console.log('✅ Password is CORRECT!');
            console.log('\nYou can login with:');
            console.log(`   Phone: ${phone}`);
            console.log(`   Password: ${password}`);
        } else {
            console.log('❌ Password is INCORRECT!');
            console.log('\nThe password you entered does not match the stored hash.');
            console.log('Please check:');
            console.log('1. Are you entering the correct password?');
            console.log('2. Did you create the worker with a different password?');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkWorker();
