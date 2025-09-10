import { useState, useEffect } from 'react';
import styles from './AnalyticsOverview.module.scss';

interface TopPage {
    page: string;
    views: number;
    percentage: number;
}

interface ApiPageData {
    page: string;
    views: number;
}

interface AnalyticsData {
    totalVisitors: number;
    pageViews: number;
    uniqueVisitors: number;
    bounceRate: number;
    avgSessionDuration: number;
    topPages: TopPage[];
}

export default function AnalyticsOverview() {
    const [analytics, setAnalytics] = useState<AnalyticsData>({
        totalVisitors: 0,
        pageViews: 0,
        uniqueVisitors: 0,
        bounceRate: 0,
        avgSessionDuration: 0,
        topPages: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Load analytics data from backend API
        const loadAnalytics = async () => {
            setIsLoading(true);
            try {
                // Fetch traffic data
                const trafficResponse = await fetch('/api/analytics/traffic?range=7d');
                const trafficData = await trafficResponse.json();
                
                // Fetch page data
                const pagesResponse = await fetch('/api/analytics/pages?limit=4');
                const pagesData = await pagesResponse.json();
                
                if (trafficData.success && pagesData.success) {
                    const summary = trafficData.summary;
                    const topPages = pagesData.data.map((page: ApiPageData) => ({
                        page: page.page,
                        views: page.views,
                        percentage: Math.round((page.views / summary.totalVisitors) * 100 * 10) / 10
                    }));
                    
                    setAnalytics({
                        totalVisitors: summary.totalVisitors || 0,
                        pageViews: summary.totalPageViews || 0,
                        uniqueVisitors: Math.round((summary.totalVisitors || 0) * 0.7), // Estimate
                        bounceRate: summary.avgBounceRate || 0,
                        avgSessionDuration: summary.avgSessionDuration || 0,
                        topPages
                    });
                } else {
                    // Fallback to mock data
                    loadMockData();
                }
            } catch (error) {
                console.error('Failed to load analytics data:', error);
                loadMockData();
            } finally {
                setIsLoading(false);
            }
        };

        const loadMockData = () => {
            const mockData = {
                totalVisitors: 1247,
                pageViews: 3421,
                uniqueVisitors: 892,
                bounceRate: 23.5,
                avgSessionDuration: 245,
                topPages: [
                    { page: '/', views: 1247, percentage: 36.5 },
                    { page: '/about', views: 892, percentage: 26.1 },
                    { page: '/projects', views: 756, percentage: 22.1 },
                    { page: '/contact', views: 526, percentage: 15.3 }
                ]
            };
            setAnalytics(mockData);
        };

        loadAnalytics();
    }, []);

    const formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    const metrics = [
        {
            title: 'Total Visitors',
            value: (analytics?.totalVisitors || 0).toLocaleString(),
            change: '+12.5%',
            changeType: 'positive',
            icon: '👥'
        },
        {
            title: 'Page Views',
            value: (analytics?.pageViews || 0).toLocaleString(),
            change: '+8.3%',
            changeType: 'positive',
            icon: '📄'
        },
        {
            title: 'Unique Visitors',
            value: (analytics?.uniqueVisitors || 0).toLocaleString(),
            change: '+15.2%',
            changeType: 'positive',
            icon: '👤'
        },
        {
            title: 'Bounce Rate',
            value: `${analytics?.bounceRate || 0}%`,
            change: '-2.1%',
            changeType: 'negative',
            icon: '📊'
        },
        {
            title: 'Avg. Session',
            value: formatDuration(analytics?.avgSessionDuration || 0),
            change: '+5.7%',
            changeType: 'positive',
            icon: '⏱️'
        }
    ];

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading analytics data...</p>
            </div>
        );
    }

    return (
        <div className={styles.analyticsOverview}>
            <div className={styles.header}>
                <h2>Analytics Overview</h2>
                <p>Key metrics for your portfolio performance</p>
            </div>

            <div className={styles.metricsGrid}>
                {metrics.map((metric, index) => (
                    <div key={index} className={styles.metricCard}>
                        <div className={styles.metricHeader}>
                            <span className={styles.icon}>{metric.icon}</span>
                            <span className={styles.title}>{metric.title}</span>
                        </div>
                        <div className={styles.metricValue}>
                            <span className={styles.value}>{metric.value}</span>
                            <span className={`${styles.change} ${styles[metric.changeType]}`}>
                                {metric.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.topPages}>
                <h3>Top Pages</h3>
                <div className={styles.pagesList}>
                    {(analytics?.topPages || []).map((page, index) => (
                        <div key={index} className={styles.pageItem}>
                            <div className={styles.pageInfo}>
                                <span className={styles.pageName}>{page.page}</span>
                                <span className={styles.pageViews}>{page.views.toLocaleString()} views</span>
                            </div>
                            <div className={styles.progressBar}>
                                <div 
                                    className={styles.progress} 
                                    style={{ width: `${page.percentage}%` }}
                                ></div>
                            </div>
                            <span className={styles.percentage}>{page.percentage}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
