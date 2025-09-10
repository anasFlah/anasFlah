const bcrypt = require('bcryptjs');

// Usage: node utils/generatePasswordHash.js "your-password-here"
const password = process.argv[2];

if (!password) {
    console.error('Please provide a password as an argument');
    console.error('Usage: node utils/generatePasswordHash.js "your-password-here"');
    process.exit(1);
}

const saltRounds = 12;
const hash = bcrypt.hashSync(password, saltRounds);

console.log('\n=== SECURE PASSWORD HASH GENERATOR ===');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nAdd this hash to your .env file:');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log('\n⚠️  IMPORTANT SECURITY NOTES:');
console.log('1. Use a strong password (12+ characters, mix of letters, numbers, symbols)');
console.log('2. Change the JWT_SECRET to a random string');
console.log('3. Never commit your .env file to version control');
console.log('4. Use different credentials for development and production');
console.log('5. Regularly rotate your passwords and secrets');
console.log('\n=== END ===\n');
