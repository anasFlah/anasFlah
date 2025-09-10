import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Check environment variables
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        const jwtSecret = process.env.JWT_SECRET;

        res.status(200).json({ 
            success: true,
            message: 'Test endpoint working',
            env: {
                hasAdminUsername: !!adminUsername,
                hasPasswordHash: !!adminPasswordHash,
                hasJwtSecret: !!jwtSecret,
                nodeEnv: process.env.NODE_ENV
            }
        });

    } catch (error) {
        console.error('[TEST] Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
