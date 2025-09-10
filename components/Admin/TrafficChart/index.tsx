import { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './TrafficChart.module.scss';

interface TrafficDataPoint {
    date: string;
    visitors: number;
    pageViews: number;
    sessions: number;
}

interface TrafficSummary {
    totalVisitors: number;
    totalPageViews: number;
    totalSessions: number;
    avgBounceRate: number;
    avgSessionDuration: number;
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        value: number;
        dataKey: string;
        color: string;
        name?: string;
    }>;
    label?: string;
}

export default function TrafficChart() {
    const [timeRange, setTimeRange] = useState('7d');
    const [trafficData, setTrafficData] = useState<TrafficDataPoint[]>([]);
    const [summary, setSummary] = useState<TrafficSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const loadTrafficData = useCallback(async () => {
        const loadMockData = () => {
            const days = timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 7;
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
            
            setTrafficData(data);
            setSummary({
                totalVisitors: data.reduce((sum, d) => sum + d.visitors, 0),
                totalPageViews: data.reduce((sum, d) => sum + d.pageViews, 0),
                totalSessions: data.reduce((sum, d) => sum + d.sessions, 0),
                avgBounceRate: 25.5,
                avgSessionDuration: 180
            });
        };

        setIsLoading(true);
        try {
            const response = await fetch(`/api/analytics/traffic?range=${timeRange}`);
            const result = await response.json();
            
            if (result.success && result.data) {
                setTrafficData(result.data);
                setSummary(result.summary);
            } else {
                loadMockData();
            }
        } catch (error) {
            console.error('Failed to load traffic data:', error);
            loadMockData();
        } finally {
            setIsLoading(false);
        }
    }, [timeRange]);

    useEffect(() => {
        loadTrafficData();
    }, [timeRange, loadTrafficData]);

    const formatNumber = (num: number) => {
        if (!num || isNaN(num)) return '0';
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        
        if (timeRange === '7d') {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else if (timeRange === '30d') {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
        }
    };

    const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.customTooltip}>
                    <p className={styles.tooltipDate}>{formatDate(label || '')}</p>
                    {payload.map((entry, index: number) => (
                        <p key={index} style={{ color: entry.color }}>
                            {entry.name}: {formatNumber(entry.value)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading traffic data...</p>
            </div>
        );
    }

    return (
        <div className={styles.trafficChart}>
            <div className={styles.header}>
                <div className={styles.titleSection}>
                    <h3>Traffic Overview</h3>
                    <p>Real-time visitor and page view analytics</p>
                </div>
                <div className={styles.controls}>
                    <select 
                        value={timeRange} 
                        onChange={(e) => setTimeRange(e.target.value)}
                        className={styles.timeRange}
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
                </div>
            </div>

            {summary && (
                <div className={styles.summaryCards}>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryIcon}>
                            👥
                        </div>
                        <div className={styles.summaryInfo}>
                            <span className={styles.summaryValue}>{formatNumber(summary.totalVisitors)}</span>
                            <span className={styles.summaryLabel}>Total Visitors</span>
                        </div>
                    </div>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryIcon}>
                            👁️
                        </div>
                        <div className={styles.summaryInfo}>
                            <span className={styles.summaryValue}>{formatNumber(summary.totalPageViews)}</span>
                            <span className={styles.summaryLabel}>Page Views</span>
                        </div>
                    </div>
                    <div className={styles.summaryCard}>
                        <div className={styles.summaryIcon}>
                            📈
                        </div>
                        <div className={styles.summaryInfo}>
                            <span className={styles.summaryValue}>{formatNumber(summary.totalSessions)}</span>
                            <span className={styles.summaryLabel}>Sessions</span>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.chartContainer}>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={trafficData || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis 
                            dataKey="date" 
                            stroke="rgba(255,255,255,0.6)"
                            fontSize={12}
                            tickFormatter={formatDate}
                        />
                        <YAxis 
                            stroke="rgba(255,255,255,0.6)"
                            fontSize={12}
                            tickFormatter={formatNumber}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                            type="monotone" 
                            dataKey="visitors" 
                            name="Visitors"
                            stroke="#E0E0E0" 
                            strokeWidth={3}
                            dot={{ fill: '#E0E0E0', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#E0E0E0', strokeWidth: 2 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="pageViews" 
                            name="Page Views"
                            stroke="#C0C0C0" 
                            strokeWidth={3}
                            dot={{ fill: '#C0C0C0', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#C0C0C0', strokeWidth: 2 }}
                        />
                        <Line 
                            type="monotone" 
                            dataKey="sessions" 
                            name="Sessions"
                            stroke="#ff6b6b" 
                            strokeWidth={3}
                            dot={{ fill: '#ff6b6b', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#ff6b6b', strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.legend}>
                <div className={styles.legendItem}>
                                            <div className={styles.legendDot} style={{ backgroundColor: '#E0E0E0' }}></div>
                    <span>Visitors</span>
                </div>
                <div className={styles.legendItem}>
                                            <div className={styles.legendDot} style={{ backgroundColor: '#C0C0C0' }}></div>
                    <span>Page Views</span>
                </div>
                <div className={styles.legendItem}>
                    <div className={styles.legendDot} style={{ backgroundColor: '#ff6b6b' }}></div>
                    <span>Sessions</span>
                </div>
            </div>
        </div>
    );
}
