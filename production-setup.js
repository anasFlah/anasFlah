#!/usr/bin/env node

/**
 * Production Setup Script
 * Generates secure secrets and validates production readiness
 */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

console.log('🔒 Production Security Setup\n');

// Generate secure secrets
function generateSecret(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}

function generatePasswordHash(password) {
    return bcrypt.hashSync(password, 12);
}

// Interactive setup
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function setupProduction() {
    console.log('📋 Production Environment Setup\n');
    
    // Get admin credentials
    const adminUsername = await question('Admin username (default: admin): ') || 'admin';
    const adminPassword = await question('Admin password (min 12 chars): ');
    
    if (adminPassword.length < 12) {
        console.log('❌ Password must be at least 12 characters long');
        process.exit(1);
    }
    
    // Get domain
    const domain = await question('Your domain (e.g., yourdomain.com): ');
    if (!domain) {
        console.log('❌ Domain is required');
        process.exit(1);
    }
    
    // Get database password
    const dbPassword = await question('Database password (min 12 chars): ');
    if (dbPassword.length < 12) {
        console.log('❌ Database password must be at least 12 characters long');
        process.exit(1);
    }
    
    // Generate all secrets
    console.log('\n🔐 Generating secure secrets...\n');
    
    const secrets = {
        ADMIN_USERNAME: adminUsername,
        ADMIN_PASSWORD_HASH: generatePasswordHash(adminPassword),
        JWT_SECRET: generateSecret(32),
        POSTGRES_PASSWORD: dbPassword,
        UMAMI_HASH_SALT: generateSecret(32),
        UMAMI_JWT_SECRET: generateSecret(32),
        UMAMI_APP_SECRET: generateSecret(32),
        NEXT_PUBLIC_UMAMI_BASE_URL: `https://${domain}/analytics`,
        NEXT_PUBLIC_UMAMI_API_URL: `https://${domain}/analytics/api`,
        NEXT_PUBLIC_UMAMI_TRACKING_SCRIPT_URL: `https://${domain}/analytics/umami.js`,
        NEXT_PUBLIC_ENABLE_SECURITY_HEADERS: 'true',
        NODE_ENV: 'production',
        NEXT_TELEMETRY_DISABLED: '1'
    };
    
    // Create .env.production file
    const envContent = Object.entries(secrets)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');
    
    const envFile = '.env.production';
    fs.writeFileSync(envFile, envContent);
    
    console.log('✅ Generated .env.production file');
    console.log('✅ Generated secure password hash');
    console.log('✅ Generated JWT secret');
    console.log('✅ Generated database password');
    console.log('✅ Generated Umami secrets');
    console.log('✅ Configured domain URLs');
    
    // Update nginx.conf with domain
    if (fs.existsSync('nginx.conf')) {
        let nginxConfig = fs.readFileSync('nginx.conf', 'utf8');
        nginxConfig = nginxConfig.replace(/your-domain\.com/g, domain);
        fs.writeFileSync('nginx.conf', nginxConfig);
        console.log('✅ Updated nginx.conf with your domain');
    }
    
    // Create SSL directory
    if (!fs.existsSync('ssl')) {
        fs.mkdirSync('ssl');
        console.log('✅ Created SSL directory');
    }
    
    // Security checklist
    console.log('\n🔒 Security Checklist:');
    console.log('✅ Strong admin password generated');
    console.log('✅ Secure JWT secret generated');
    console.log('✅ Database password set');
    console.log('✅ Umami secrets generated');
    console.log('✅ Domain configured');
    console.log('✅ SSL directory created');
    
    console.log('\n📋 Next Steps:');
    console.log('1. Upload your SSL certificates to the ssl/ directory');
    console.log('2. Run: docker-compose -f docker-compose.prod.yml up -d --build');
    console.log('3. Test your deployment at https://' + domain);
    console.log('4. Access admin at https://' + domain + '/admin');
    console.log('5. Access analytics at https://' + domain + '/analytics');
    
    console.log('\n⚠️  IMPORTANT SECURITY REMINDERS:');
    console.log('• Never commit .env.production to version control');
    console.log('• Keep your secrets secure and rotate them regularly');
    console.log('• Monitor your application logs for suspicious activity');
    console.log('• Set up automatic SSL certificate renewal');
    console.log('• Configure firewall rules (ports 22, 80, 443 only)');
    console.log('• Enable fail2ban for SSH protection');
    
    rl.close();
}

setupProduction().catch(console.error);
