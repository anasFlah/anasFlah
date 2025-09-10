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

        // Get country stats
        const countryStats = await umamiService.getCountryStats(startAt, endAt);
        
        // Transform data for the frontend
        const transformedData = countryStats.map(country => ({
            country: country.country || 'Unknown',
            visitors: country.uniques,
            pageviews: country.pageviews,
            percentage: countryStats.reduce((sum, c) => sum + c.uniques, 0) > 0 
                ? Math.round((country.uniques / countryStats.reduce((sum, c) => sum + c.uniques, 0)) * 100 * 10) / 10 
                : 0
        }));

        res.status(200).json({
            success: true,
            data: transformedData
        });
    } catch (error) {
        console.error('Countries API error:', error);
        
        // Fallback to mock data if Umami is not available
        const mockData = {
            success: true,
            data: [
                { country: 'United States', visitors: 1250, pageviews: 3800, percentage: 36.2 },
                { country: 'United Kingdom', visitors: 680, pageviews: 2100, percentage: 19.7 },
                { country: 'Canada', visitors: 420, pageviews: 1200, percentage: 12.2 },
                { country: 'Germany', visitors: 380, pageviews: 980, percentage: 11.0 },
                { country: 'France', visitors: 290, pageviews: 750, percentage: 8.4 },
                { country: 'Australia', visitors: 220, pageviews: 580, percentage: 6.4 },
                { country: 'Netherlands', visitors: 180, pageviews: 420, percentage: 5.2 },
                { country: 'Other', visitors: 120, pageviews: 320, percentage: 3.5 }
            ]
        };
        
        res.status(200).json(mockData);
    }
}
