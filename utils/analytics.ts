// Analytics tracking utility for portfolio interactions

interface AnalyticsEvent {
    type: 'page_view' | 'click' | 'scroll' | 'hover' | 'form_submit' | 'download';
    element?: string;
    page: string;
    timestamp: Date;
    userAgent: string;
    sessionId: string;
    ip?: string;
}

class AnalyticsTracker {
    private sessionId: string = '';
    private events: AnalyticsEvent[] = [];
    private isInitialized = false;

    constructor() {
        // Only initialize on client side
        if (typeof window !== 'undefined') {
            this.sessionId = this.generateSessionId();
            this.initialize();
        }
    }

    private generateSessionId(): string {
        return 'sess_' + Math.random().toString(36).substr(2, 9);
    }

    private initialize() {
        if (this.isInitialized || typeof window === 'undefined') return;
        
        // Track page views
        this.trackPageView();
        
        // Track clicks
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const element = this.getElementDescription(target);
            if (element) {
                this.trackEvent('click', element);
            }
        });

        // Track scroll events (throttled)
        let scrollTimeout: NodeJS.Timeout;
        document.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.trackEvent('scroll', 'Page Scroll');
            }, 1000);
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target as HTMLFormElement;
            this.trackEvent('form_submit', form.id || 'Contact Form');
        });

        // Track downloads
        document.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a');
            if (link && (link.href.includes('.pdf') || link.href.includes('download'))) {
                this.trackEvent('download', link.textContent || 'File Download');
            }
        });

        this.isInitialized = true;
    }

    private getElementDescription(element: HTMLElement): string | null {
        // Get meaningful element description
        if (element.tagName === 'A') {
            return element.textContent?.trim() || 'Link';
        }
        if (element.tagName === 'BUTTON') {
            return element.textContent?.trim() || 'Button';
        }
        if (element.closest('[data-analytics]')) {
            return element.closest('[data-analytics]')?.getAttribute('data-analytics') || null;
        }
        return null;
    }

    private trackPageView() {
        this.trackEvent('page_view', 'Page View');
    }

    private trackEvent(type: AnalyticsEvent['type'], element?: string) {
        if (typeof window === 'undefined') return;
        
        const event: AnalyticsEvent = {
            type,
            element,
            page: window.location.pathname,
            timestamp: new Date(),
            userAgent: navigator.userAgent,
            sessionId: this.sessionId
        };

        this.events.push(event);
        this.sendEvent(event);
    }

    private async sendEvent(event: AnalyticsEvent) {
        if (typeof window === 'undefined') return;
        
        try {
            // Send to backend API
            const response = await fetch('/api/analytics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(event)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Also store in localStorage as backup
            const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            storedEvents.push(event);
            localStorage.setItem('analytics_events', JSON.stringify(storedEvents));
        } catch (error) {
            console.error('Failed to send analytics event:', error);
            
            // Fallback to localStorage only
            try {
                const storedEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
                storedEvents.push(event);
                localStorage.setItem('analytics_events', JSON.stringify(storedEvents));
            } catch (localError) {
                console.error('Failed to store event in localStorage:', localError);
            }
        }
    }

    // Public method to manually track events
    public track(type: AnalyticsEvent['type'], element?: string) {
        this.trackEvent(type, element);
    }

    // Get all events for admin dashboard
    public getEvents(): AnalyticsEvent[] {
        return this.events;
    }

    // Get events from localStorage (for admin dashboard)
    public static getStoredEvents(): AnalyticsEvent[] {
        if (typeof window === 'undefined') return [];
        
        try {
            return JSON.parse(localStorage.getItem('analytics_events') || '[]');
        } catch {
            return [];
        }
    }

    // Clear stored events
    public static clearStoredEvents() {
        if (typeof window === 'undefined') return;
        localStorage.removeItem('analytics_events');
    }
}

// Initialize analytics tracker only on client side
let analytics: AnalyticsTracker;

if (typeof window !== 'undefined') {
    analytics = new AnalyticsTracker();
} else {
    // Create a dummy instance for SSR
    analytics = {} as AnalyticsTracker;
}

export default analytics;
export type { AnalyticsEvent };
export { AnalyticsTracker };
