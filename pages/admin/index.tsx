import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from './AdminDashboard.module.scss';
import AnalyticsOverview from '@/components/Admin/AnalyticsOverview';
import TrafficChart from '@/components/Admin/TrafficChart';
import PageViews from '@/components/Admin/PageViews';
import UserInteractions from '@/components/Admin/UserInteractions';
import AdminSidebar from '@/components/Admin/AdminSidebar';
import { portfolioData } from '@/data/portfolioData';

export default function AdminDashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const router = useRouter();

    useEffect(() => {
        // Simple loading delay to ensure middleware has processed
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Redirect to login page with trailing slash
            router.push('/admin/login/');
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Loading Admin Dashboard...</p>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>Admin Dashboard | {portfolioData.personalInfo.name}</title>
                <meta name="description" content="Admin dashboard for portfolio analytics and management" />
            </Head>
            
            <div className={styles.adminDashboard}>
                <AdminSidebar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab}
                    onLogout={handleLogout}
                />
                
                <main className={styles.mainContent}>
                    <header className={styles.header}>
                        <h1>Admin Dashboard</h1>
                        <div className={styles.userInfo}>
                            <span>Welcome, Admin</span>
                            <button onClick={handleLogout} className={styles.logoutBtn}>
                                Logout
                            </button>
                        </div>
                    </header>

                    <div className={styles.content}>
                        <div className={styles.tabWrapper}>
                            {activeTab === 'overview' && (
                                <div className={styles.overviewSection}>
                                    <h2>Dashboard Overview</h2>
                                    <div className={styles.sectionContent}>
                                        <AnalyticsOverview />
                                        <div className={styles.chartsGrid}>
                                            <TrafficChart />
                                            <PageViews />
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === 'traffic' && (
                                <div className={styles.trafficSection}>
                                    <h2>Traffic Analytics</h2>
                                    <div className={styles.sectionContent}>
                                        <TrafficChart />
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === 'interactions' && (
                                <div className={styles.interactionsSection}>
                                    <h2>User Interactions</h2>
                                    <div className={styles.sectionContent}>
                                        <UserInteractions />
                                    </div>
                                </div>
                            )}
                            
                            {activeTab === 'settings' && (
                                <div className={styles.settingsSection}>
                                    <h2>Dashboard Settings</h2>
                                    <div className={styles.sectionContent}>
                                        <div className={styles.settingsPlaceholder}>
                                            <div className={styles.settingsIcon}>⚙️</div>
                                            <h3>Settings Panel</h3>
                                            <p>Dashboard configuration options will be available here soon.</p>
                                            <div className={styles.settingsFeatures}>
                                                <div className={styles.featureItem}>
                                                    <span className={styles.featureIcon}>🎨</span>
                                                    <span>Theme Customization</span>
                                                </div>
                                                <div className={styles.featureItem}>
                                                    <span className={styles.featureIcon}>📊</span>
                                                    <span>Analytics Preferences</span>
                                                </div>
                                                <div className={styles.featureItem}>
                                                    <span className={styles.featureIcon}>🔔</span>
                                                    <span>Notification Settings</span>
                                                </div>
                                                <div className={styles.featureItem}>
                                                    <span className={styles.featureIcon}>🔒</span>
                                                    <span>Security Settings</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
