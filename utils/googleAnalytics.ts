interface GoogleAnalyticsConfig {
  propertyId: string;
  clientEmail: string;
  privateKey: string;
}

interface AnalyticsData {
  visitors: number;
  pageViews: number;
  sessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  topPages: Array<{
    page: string;
    views: number;
    percentage: number;
  }>;
  trafficSources: Array<{
    source: string;
    sessions: number;
    percentage: number;
  }>;
  devices: Array<{
    device: string;
    sessions: number;
    percentage: number;
  }>;
  countries: Array<{
    country: string;
    sessions: number;
    percentage: number;
  }>;
}

interface TrafficDataPoint {
  date: string;
  visitors: number;
  pageViews: number;
  sessions: number;
}

class GoogleAnalyticsService {
  private config: GoogleAnalyticsConfig | null = null;

  constructor() {
    // In production, these would come from environment variables
    this.config = {
      propertyId: process.env.GA4_PROPERTY_ID || '',
      clientEmail: process.env.GA4_CLIENT_EMAIL || '',
      privateKey: process.env.GA4_PRIVATE_KEY || '',
    };
  }

  private async getAccessToken(): Promise<string> {
    if (!this.config) {
      throw new Error('Google Analytics not configured');
    }

    // For demo purposes, we'll use a mock token
    // In production, you would implement proper OAuth2 flow
    return 'mock_access_token';
  }

  private async makeGA4Request(endpoint: string, params: any): Promise<any> {
    const token = await this.getAccessToken();
    
    // Mock GA4 API response for demo
    // In production, you would make actual requests to Google Analytics Data API
    return this.getMockData(endpoint, params);
  }

  private getMockData(endpoint: string, params: any): any {
    // Generate realistic mock data based on the endpoint
    const baseVisitors = 1500;
    const basePageViews = 4200;
    const baseSessions = 1800;
    
    if (endpoint.includes('traffic')) {
      const days = params.dateRanges?.[0]?.endDate ? 
        Math.ceil((new Date(params.dateRanges[0].endDate).getTime() - new Date(params.dateRanges[0].startDate).getTime()) / (1000 * 60 * 60 * 24)) : 7;
      
      const data: TrafficDataPoint[] = [];
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        
        data.push({
          date: date.toISOString().split('T')[0],
          visitors: Math.floor(Math.random() * 100) + 80,
          pageViews: Math.floor(Math.random() * 200) + 150,
          sessions: Math.floor(Math.random() * 120) + 90,
        });
      }
      
      return {
        data: data,
        summary: {
          totalVisitors: data.reduce((sum, d) => sum + d.visitors, 0),
          totalPageViews: data.reduce((sum, d) => sum + d.pageViews, 0),
          totalSessions: data.reduce((sum, d) => sum + d.sessions, 0),
          avgBounceRate: 28.5,
          avgSessionDuration: 245,
        }
      };
    }
    
    if (endpoint.includes('pages')) {
      return {
        data: [
          { page: '/', views: 1247, percentage: 36.5 },
          { page: '/about', views: 892, percentage: 26.1 },
          { page: '/projects', views: 756, percentage: 22.1 },
          { page: '/contact', views: 526, percentage: 15.3 }
        ]
      };
    }
    
    if (endpoint.includes('sources')) {
      return {
        data: [
          { source: 'Direct', sessions: 650, percentage: 36.1 },
          { source: 'Google', sessions: 520, percentage: 28.9 },
          { source: 'Social Media', sessions: 380, percentage: 21.1 },
          { source: 'Referral', sessions: 250, percentage: 13.9 }
        ]
      };
    }
    
    if (endpoint.includes('devices')) {
      return {
        data: [
          { device: 'Desktop', sessions: 1080, percentage: 60.0 },
          { device: 'Mobile', sessions: 540, percentage: 30.0 },
          { device: 'Tablet', sessions: 180, percentage: 10.0 }
        ]
      };
    }
    
    if (endpoint.includes('countries')) {
      return {
        data: [
          { country: 'United States', sessions: 720, percentage: 40.0 },
          { country: 'United Kingdom', sessions: 360, percentage: 20.0 },
          { country: 'Canada', sessions: 270, percentage: 15.0 },
          { country: 'Germany', sessions: 180, percentage: 10.0 },
          { country: 'France', sessions: 144, percentage: 8.0 },
          { country: 'Other', sessions: 126, percentage: 7.0 }
        ]
      };
    }
    
    return { data: [] };
  }

  async getTrafficData(range: string = '7d'): Promise<{
    data: TrafficDataPoint[];
    summary: {
      totalVisitors: number;
      totalPageViews: number;
      totalSessions: number;
      avgBounceRate: number;
      avgSessionDuration: number;
    };
  }> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date();
    
    switch (range) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }
    
    const params = {
      dateRanges: [{
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate
      }],
      metrics: ['totalUsers', 'screenPageViews', 'sessions'],
      dimensions: ['date']
    };
    
    return this.makeGA4Request('traffic', params);
  }

  async getPageAnalytics(limit: number = 10): Promise<Array<{
    page: string;
    views: number;
    percentage: number;
  }>> {
    const params = {
      dateRanges: [{
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      }],
      metrics: ['screenPageViews'],
      dimensions: ['pagePath'],
      limit: limit
    };
    
    const result = await this.makeGA4Request('pages', params);
    return result.data;
  }

  async getTrafficSources(): Promise<Array<{
    source: string;
    sessions: number;
    percentage: number;
  }>> {
    const params = {
      dateRanges: [{
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      }],
      metrics: ['sessions'],
      dimensions: ['sessionDefaultChannelGrouping']
    };
    
    const result = await this.makeGA4Request('sources', params);
    return result.data;
  }

  async getDeviceAnalytics(): Promise<Array<{
    device: string;
    sessions: number;
    percentage: number;
  }>> {
    const params = {
      dateRanges: [{
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      }],
      metrics: ['sessions'],
      dimensions: ['deviceCategory']
    };
    
    const result = await this.makeGA4Request('devices', params);
    return result.data;
  }

  async getCountryAnalytics(): Promise<Array<{
    country: string;
    sessions: number;
    percentage: number;
  }>> {
    const params = {
      dateRanges: [{
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      }],
      metrics: ['sessions'],
      dimensions: ['country']
    };
    
    const result = await this.makeGA4Request('countries', params);
    return result.data;
  }

  async getAnalyticsOverview(): Promise<AnalyticsData> {
    const [trafficData, topPages, trafficSources, devices, countries] = await Promise.all([
      this.getTrafficData('7d'),
      this.getPageAnalytics(5),
      this.getTrafficSources(),
      this.getDeviceAnalytics(),
      this.getCountryAnalytics()
    ]);

    return {
      visitors: trafficData.summary.totalVisitors,
      pageViews: trafficData.summary.totalPageViews,
      sessions: trafficData.summary.totalSessions,
      bounceRate: trafficData.summary.avgBounceRate,
      avgSessionDuration: trafficData.summary.avgSessionDuration,
      topPages,
      trafficSources,
      devices,
      countries
    };
  }
}

export const gaService = new GoogleAnalyticsService();
export type { AnalyticsData, TrafficDataPoint };
