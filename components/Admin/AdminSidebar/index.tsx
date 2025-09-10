import { useState } from 'react';
import styles from './AdminSidebar.module.scss';

interface AdminSidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    onLogout: () => void;
}

export default function AdminSidebar({ activeTab, setActiveTab, onLogout }: AdminSidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        {
            id: 'overview',
            label: 'Overview',
            icon: '📊',
            description: 'Dashboard overview'
        },
        {
            id: 'traffic',
            label: 'Traffic Analytics',
            icon: '📈',
            description: 'Website traffic data'
        },
        {
            id: 'interactions',
            label: 'User Interactions',
            icon: '👥',
            description: 'User engagement metrics'
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: '⚙️',
            description: 'Dashboard settings'
        }
    ];

    return (
        <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.sidebarHeader}>
                <div className={styles.logo}>
                    <div className={styles.logoIcon}>
                        📊
                    </div>
                    {!isCollapsed && <span className={styles.logoText}>Admin Dashboard</span>}
                </div>
                <button 
                    className={styles.collapseBtn}
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? '→' : '←'}
                </button>
            </div>

            <nav className={styles.navigation}>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        className={`${styles.navItem} ${activeTab === item.id ? styles.active : ''}`}
                        onClick={() => setActiveTab(item.id)}
                        title={item.description}
                    >
                        <div className={styles.iconContainer}>
                            {item.icon}
                        </div>
                        {!isCollapsed && (
                            <div className={styles.navContent}>
                                <span className={styles.label}>{item.label}</span>
                                <span className={styles.description}>{item.description}</span>
                            </div>
                        )}
                    </button>
                ))}
            </nav>

            <div className={styles.sidebarFooter}>
                <button className={styles.logoutBtn} onClick={onLogout} title="Logout">
                    <div className={styles.iconContainer}>
                        🚪
                    </div>
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
}
