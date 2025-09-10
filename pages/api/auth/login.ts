import { NextApiRequest, NextApiResponse } from 'next';

// Default values for development (change these in production!)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = 'anesflah2024'; // Direct password for development

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { username, password } = req.body;

        // Debug logging
        console.log('[AUTH DEBUG] Login attempt:', { username, password: password ? '***' : 'undefined' });

        // Input validation
        if (!username || !password) {
            console.log('[AUTH DEBUG] Missing username or password');
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // Check username
        if (username !== ADMIN_USERNAME) {
            console.log(`[AUTH DEBUG] Invalid username: ${username} !== ${ADMIN_USERNAME}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('[AUTH DEBUG] Username check passed');

        // Check password (direct comparison for development)
        if (password !== ADMIN_PASSWORD) {
            console.log(`[AUTH DEBUG] Invalid password for user: ${username}`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        console.log('[AUTH DEBUG] Password validation passed');

        // Generate a simple token (in production, use proper JWT)
        const token = Buffer.from(`${ADMIN_USERNAME}:${Date.now()}`).toString('base64');

        // Set HTTP-only cookie (Secure only in production to avoid dev redirect loops)
        const isProd = process.env.NODE_ENV === 'production';
        const cookie = `admin_token=${token}; HttpOnly; ${isProd ? 'Secure; ' : ''}SameSite=Strict; Max-Age=${24 * 60 * 60}; Path=/`;
        res.setHeader('Set-Cookie', [cookie]);

        // Log successful login attempt
        console.log(`[AUTH] Successful login attempt from IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);

        res.status(200).json({ 
            success: true, 
            message: 'Authentication successful',
            user: { username: ADMIN_USERNAME, role: 'admin' }
        });

    } catch (error) {
        console.error('[AUTH] Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
