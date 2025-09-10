import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Clear authentication cookie
        const isProd = process.env.NODE_ENV === 'production';
        const clearCookie = `admin_token=; HttpOnly; ${isProd ? 'Secure; ' : ''}SameSite=Strict; Max-Age=0; Path=/`;
        res.setHeader('Set-Cookie', [clearCookie]);

        // Log logout attempt
        console.log(`[AUTH] Logout from IP: ${req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);

        res.status(200).json({ 
            success: true, 
            message: 'Logged out successfully' 
        });

    } catch (error) {
        console.error('[AUTH] Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
