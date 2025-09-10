import { useState, useEffect } from 'react';
import styles from './UserInteractions.module.scss';
import { AnalyticsTracker } from '@/utils/analytics';

interface Interaction {
    id: number;
    type: string;
    element: string;
    page: string;
    timestamp: Date;
    userAgent: string;
    ip: string;
    sessionId: string;
}

interface ApiInteractionEvent {
    id?: number;
    type?: string;
    element?: string;
    page?: string;
    timestamp?: string;
    userAgent?: string;
    ip?: string;
    sessionId?: string;
}

export default function UserInteractions() {
    const [interactions, setInteractions] = useState<Interaction[]>([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Load interaction data from backend API
        const loadInteractions = async () => {
            try {
                const response = await fetch(`/api/analytics?type=${filter === 'all' ? '' : filter}&limit=20`);
                const result = await response.json();
                
                if (result.success && result.data.length > 0) {
                    // Convert API data to interaction format
                    const formattedEvents = result.data.map((event: ApiInteractionEvent, index: number) => ({
                        id: index + 1,
                        type: event.type || 'Unknown',
                        element: event.element || 'Unknown',
                        page: event.page || 'Unknown',
                        timestamp: new Date(event.timestamp || Date.now()),
                        userAgent: event.userAgent || 'Unknown',
                        ip: event.ip || 'Unknown',
                        sessionId: event.sessionId || 'Unknown'
                    }));
                    setInteractions(formattedEvents);
                } else {
                    // Fallback to stored events or mock data
                    loadFallbackData();
                }
            } catch (error) {
                console.error('Failed to load interaction data:', error);
                loadFallbackData();
            }
        };

        const loadFallbackData = () => {
            const storedEvents = AnalyticsTracker.getStoredEvents();
            
            if (storedEvents.length > 0) {
                // Convert stored events to interaction format
                const formattedEvents = storedEvents.map((event, index) => ({
                    id: index + 1,
                    type: event.type,
                    element: event.element || 'Unknown',
                    page: event.page,
                    timestamp: new Date(event.timestamp),
                    userAgent: event.userAgent,
                    ip: event.ip || 'Unknown',
                    sessionId: event.sessionId
                }));
                setInteractions(formattedEvents);
            } else {
                // Use mock data
                const mockData = [
                    {
                        id: 1,
                        type: 'click',
                        element: 'Contact Button',
                        page: '/',
                        timestamp: new Date(Date.now() - 1000 * 60 * 30),
                        userAgent: 'Chrome/120.0.0.0',
                        ip: '192.168.1.100',
                        sessionId: 'sess_123456'
                    },
                    {
                        id: 2,
                        type: 'scroll',
                        element: 'Projects Section',
                        page: '/',
                        timestamp: new Date(Date.now() - 1000 * 60 * 45),
                        userAgent: 'Chrome/120.0.0.0',
                        ip: '192.168.1.100',
                        sessionId: 'sess_123456'
                    },
                    {
                        id: 3,
                        type: 'click',
                        element: 'GitHub Link',
                        page: '/contact',
                        timestamp: new Date(Date.now() - 1000 * 60 * 90),
                        userAgent: 'Firefox/121.0',
                        ip: '172.16.0.25',
                        sessionId: 'sess_345678'
                    }
                ];
                setInteractions(mockData);
            }
        };

        loadInteractions();
        
        // Refresh data every 30 seconds
        const interval = setInterval(loadInteractions, 30000);
        return () => clearInterval(interval);
    }, [filter]);

    const getFilteredInteractions = () => {
        if (filter === 'all') return interactions;
        return interactions.filter(interaction => interaction.type === filter);
    };

    const getInteractionIcon = (type: string) => {
        switch (type) {
            case 'click': return '🖱️';
            case 'scroll': return '📜';
            case 'hover': return '👆';
            case 'form_submit': return '📝';
            case 'download': return '⬇️';
            default: return '📊';
        }
    };

    const getInteractionColor = (type: string) => {
        switch (type) {
            case 'click': return '#E0E0E0';
            case 'scroll': return '#C0C0C0';
            case 'hover': return '#32CD32';
            case 'form_submit': return '#10b981';
            case 'download': return '#f59e0b';
            default: return '#6b7280';
        }
    };

    const formatTimestamp = (timestamp: Date) => {
        const now = new Date();
        const diff = now.getTime() - timestamp.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days > 0) return `${days}d ago`;
        if (hours > 0) return `${hours}h ago`;
        if (minutes > 0) return `${minutes}m ago`;
        return 'Just now';
    };

    const getBrowserInfo = (userAgent: string) => {
        if (userAgent.includes('Chrome')) return 'Chrome';
        if (userAgent.includes('Safari')) return 'Safari';
        if (userAgent.includes('Firefox')) return 'Firefox';
        if (userAgent.includes('Edge')) return 'Edge';
        return 'Unknown';
    };

    return (
        <div className={styles.userInteractions}>
            <div className={styles.header}>
                <h3>User Interactions</h3>
                <div className={styles.controls}>
                    <select 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="all">All Interactions</option>
                        <option value="click">Clicks</option>
                        <option value="scroll">Scrolls</option>
                        <option value="hover">Hovers</option>
                        <option value="form_submit">Form Submissions</option>
                        <option value="download">Downloads</option>
                    </select>
                </div>
            </div>

            <div className={styles.interactionsList}>
                {getFilteredInteractions().map((interaction) => (
                    <div key={interaction.id} className={styles.interactionItem}>
                        <div className={styles.interactionHeader}>
                            <div className={styles.interactionType}>
                                <span 
                                    className={styles.icon}
                                    style={{ backgroundColor: getInteractionColor(interaction.type) }}
                                >
                                    {getInteractionIcon(interaction.type)}
                                </span>
                                <div className={styles.interactionInfo}>
                                    <span className={styles.element}>{interaction.element}</span>
                                    <span className={styles.page}>{interaction.page}</span>
                                </div>
                            </div>
                            <span className={styles.timestamp}>
                                {formatTimestamp(interaction.timestamp)}
                            </span>
                        </div>
                        
                        <div className={styles.interactionDetails}>
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Browser:</span>
                                <span className={styles.value}>{getBrowserInfo(interaction.userAgent)}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.label}>IP:</span>
                                <span className={styles.value}>{interaction.ip}</span>
                            </div>
                            <div className={styles.detailItem}>
                                <span className={styles.label}>Session:</span>
                                <span className={styles.value}>{interaction.sessionId}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.summary}>
                <div className={styles.summaryItem}>
                    <span className={styles.label}>Total Interactions:</span>
                    <span className={styles.value}>{interactions.length}</span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.label}>Unique Sessions:</span>
                    <span className={styles.value}>
                        {new Set(interactions.map(i => i.sessionId)).size}
                    </span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.label}>Active Users:</span>
                    <span className={styles.value}>
                        {new Set(interactions.map(i => i.ip)).size}
                    </span>
                </div>
            </div>
        </div>
    );
}
