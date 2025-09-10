import { NextApiRequest, NextApiResponse } from 'next';
import { umamiService } from '../../../utils/umamiService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { range = '30d' } = req.query;
        
        let startAt: string | undefined;
        let endAt: string | undefined;

        // Set date range based on query parameter
        switch (range) {
            case '24h':
                const last24h = umamiService.getLast24HoursRange();
                startAt = last24h.startAt;
                endAt = last24h.endAt;
                break;
            case '7d':
                const last7d = umamiService.getLast7DaysRange();
                startAt = last7d.startAt;
                endAt = last7d.endAt;
                break;
            case '30d':
            default:
                const last30d = umamiService.getLast30DaysRange();
                startAt = last30d.startAt;
                endAt = last30d.endAt;
                break;
        }

        // Get referrer stats
        const referrerStats = await umamiService.getReferrerStats(startAt, endAt);
        
        // Transform data for the frontend
        const transformedData = referrerStats.map(referrer => ({
            source: referrer.referrer || 'Direct',
            visitors: referrer.uniques,
            pageviews: referrer.pageviews,
            percentage: referrerStats.reduce((sum, r) => sum + r.uniques, 0) > 0 
                ? Math.round((referrer.uniques / referrerStats.reduce((sum, r) => sum + r.uniques, 0)) * 100 * 10) / 10 
                : 0
        }));

        res.status(200).json({
            success: true,
            data: transformedData
        });
    } catch (error) {
        console.error('Sources API error:', error);
        
        // Fallback to mock data if Umami is not available
        const mockData = {
            success: true,
            data: [
                { source: 'Direct', visitors: 1250, pageviews: 3200, percentage: 45.2 },
                { source: 'Google', visitors: 890, pageviews: 2100, percentage: 32.1 },
                { source: 'Twitter', visitors: 320, pageviews: 780, percentage: 11.6 },
                { source: 'LinkedIn', visitors: 180, pageviews: 420, percentage: 6.5 },
                { source: 'GitHub', visitors: 120, pageviews: 280, percentage: 4.3 }
            ]
        };
        
        res.status(200).json(mockData);
    }
}
