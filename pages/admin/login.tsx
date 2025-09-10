import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from './AdminLogin.module.scss';
import { portfolioData } from '@/data/portfolioData';

export default function AdminLogin() {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    // No auth check needed - middleware handles all authentication
    // If user is already authenticated, middleware will redirect them to /admin

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Authentication successful, redirect to admin dashboard with trailing slash
                router.push('/admin/');
            } else {
                setError(data.error || 'Authentication failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <Head>
                <title>Admin Login | {portfolioData.personalInfo.name}</title>
                <meta name="description" content="Admin login for portfolio dashboard" />
            </Head>
            
            <div className={styles.loginContainer}>
                <div className={styles.loginCard}>
                    <div className={styles.header}>
                        <h1>Admin Dashboard</h1>
                        <p>Sign in to access your portfolio analytics</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.loginForm}>
                        {error && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}

                        <div className={styles.inputGroup}>
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={credentials.username}
                                onChange={handleInputChange}
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleInputChange}
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={styles.loginBtn}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className={styles.footer}>
                        <p>Portfolio Analytics Dashboard</p>
                        <small>© 2024 {portfolioData.personalInfo.name}</small>
                    </div>
                </div>
            </div>
        </>
    );
}
