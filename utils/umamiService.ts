interface UmamiConfig {
  baseUrl: string;
  username: string;
  password: string;
  websiteId: string;
}

interface UmamiStats {
  pageviews: number;
  uniques: number;
  bounces: number;
  totaltime: number;
}

interface UmamiPageStats {
  url: string;
  pageviews: number;
  uniques: number;
  bounces: number;
  totaltime: number;
}

interface UmamiReferrerStats {
  referrer: string;
  pageviews: number;
  uniques: number;
}

interface UmamiDeviceStats {
  device: string;
  pageviews: number;
  uniques: number;
}

interface UmamiCountryStats {
  country: string;
  pageviews: number;
  uniques: number;
}

interface UmamiTrafficData {
  date: string;
  pageviews: number;
  uniques: number;
}

class UmamiService {
  private config: UmamiConfig;
  private token: string | null = null;

  constructor() {
    this.config = {
      baseUrl: process.env.NEXT_PUBLIC_UMAMI_BASE_URL || 'http://localhost:3001',
      username: process.env.NEXT_PUBLIC_UMAMI_USERNAME || 'admin',
      password: process.env.NEXT_PUBLIC_UMAMI_PASSWORD || 'umami',
      websiteId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID || '1'
    };
  }

  private async authenticate(): Promise<string> {
    if (this.token) return this.token;

    try {
      const response = await fetch(`${this.config.baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.config.username,
          password: this.config.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const data = await response.json();
      this.token = data.token;
      return this.token!;
    } catch (error) {
      console.error('Umami authentication error:', error);
      throw error;
    }
  }

  private async makeRequest(endpoint: string): Promise<any> {
    try {
      const token = await this.authenticate();
      const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Umami API request error:', error);
      throw error;
    }
  }

  async getWebsiteStats(startAt?: string, endAt?: string): Promise<UmamiStats> {
    const params = new URLSearchParams();
    if (startAt) params.append('startAt', startAt);
    if (endAt) params.append('endAt', endAt);

    const endpoint = `/api/websites/${this.config.websiteId}/stats?${params.toString()}`;
    return this.makeRequest(endpoint);
  }

  async getPageStats(startAt?: string, endAt?: string): Promise<UmamiPageStats[]> {
    const params = new URLSearchParams();
    if (startAt) params.append('startAt', startAt);
    if (endAt) params.append('endAt', endAt);

    const endpoint = `/api/websites/${this.config.websiteId}/pages?${params.toString()}`;
    return this.makeRequest(endpoint);
  }

  async getReferrerStats(startAt?: string, endAt?: string): Promise<UmamiReferrerStats[]> {
    const params = new URLSearchParams();
    if (startAt) params.append('startAt', startAt);
    if (endAt) params.append('endAt', endAt);

    const endpoint = `/api/websites/${this.config.websiteId}/referrers?${params.toString()}`;
    return this.makeRequest(endpoint);
  }

  async getDeviceStats(startAt?: string, endAt?: string): Promise<UmamiDeviceStats[]> {
    const params = new URLSearchParams();
    if (startAt) params.append('startAt', startAt);
    if (endAt) params.append('endAt', endAt);

    const endpoint = `/api/websites/${this.config.websiteId}/devices?${params.toString()}`;
    return this.makeRequest(endpoint);
  }

  async getCountryStats(startAt?: string, endAt?: string): Promise<UmamiCountryStats[]> {
    const params = new URLSearchParams();
    if (startAt) params.append('startAt', startAt);
    if (endAt) params.append('endAt', endAt);

    const endpoint = `/api/websites/${this.config.websiteId}/countries?${params.toString()}`;
    return this.makeRequest(endpoint);
  }

  async getTrafficData(startAt?: string, endAt?: string): Promise<UmamiTrafficData[]> {
    const params = new URLSearchParams();
    if (startAt) params.append('startAt', startAt);
    if (endAt) params.append('endAt', endAt);

    const endpoint = `/api/websites/${this.config.websiteId}/traffic?${params.toString()}`;
    return this.makeRequest(endpoint);
  }

  // Helper method to get date range for last 30 days
  getLast30DaysRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    return {
      startAt: startDate.toISOString(),
      endAt: endDate.toISOString()
    };
  }

  // Helper method to get date range for last 7 days
  getLast7DaysRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    return {
      startAt: startDate.toISOString(),
      endAt: endDate.toISOString()
    };
  }

  // Helper method to get date range for last 24 hours
  getLast24HoursRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - 24);
    
    return {
      startAt: startDate.toISOString(),
      endAt: endDate.toISOString()
    };
  }
}

export const umamiService = new UmamiService();
export type { UmamiStats, UmamiPageStats, UmamiReferrerStats, UmamiDeviceStats, UmamiCountryStats, UmamiTrafficData };
