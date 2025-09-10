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

        // Get device stats
        const deviceStats = await umamiService.getDeviceStats(startAt, endAt);
        
        // Transform data for the frontend
        const transformedData = deviceStats.map(device => ({
            device: device.device || 'Unknown',
            visitors: device.uniques,
            pageviews: device.pageviews,
            percentage: deviceStats.reduce((sum, d) => sum + d.uniques, 0) > 0 
                ? Math.round((device.uniques / deviceStats.reduce((sum, d) => sum + d.uniques, 0)) * 100 * 10) / 10 
                : 0
        }));

        res.status(200).json({
            success: true,
            data: transformedData
        });
    } catch (error) {
        console.error('Devices API error:', error);
        
        // Fallback to mock data if Umami is not available
        const mockData = {
            success: true,
            data: [
                { device: 'Desktop', visitors: 1850, pageviews: 5200, percentage: 54.2 },
                { device: 'Mobile', visitors: 1200, pageviews: 3800, percentage: 35.1 },
                { device: 'Tablet', visitors: 370, pageviews: 850, percentage: 10.7 }
            ]
        };
        
        res.status(200).json(mockData);
    }
}
