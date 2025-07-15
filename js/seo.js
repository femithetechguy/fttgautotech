// SEO Enhancement Module for FTTG AutoTech
class SEOManager {
    constructor() {
        this.baseTitle = "FTTG AutoTech - Professional Auto Repair & Mobile Service";
        this.sectionTitles = {
            'hero': `${this.baseTitle} in Metro Atlanta`,
            'services': `Auto Repair Services - ${this.baseTitle}`,
            'about': `About Us - ${this.baseTitle}`,
            'contact': `Contact - ${this.baseTitle}`,
            'booking': `Book Service - ${this.baseTitle}`,
            'service-area': `Service Area - ${this.baseTitle}`,
            'testimonials': `Testimonials - ${this.baseTitle}`
        };
        this.init();
    }

    // Initialize all SEO enhancements
    init() {
        this.updatePageTitle();
        this.addCanonicalURL();
        this.trackPageSections();
        this.setupAnalyticsTracking();
        this.optimizeImageAltTexts();
        this.addMetaDescriptionDynamic();
    }

    // Update page title for SEO
    updatePageTitle() {
        document.title = this.baseTitle + " in Metro Atlanta";
    }

    // Add canonical URL if not set
    addCanonicalURL() {
        if (!document.querySelector('link[rel="canonical"]')) {
            const canonical = document.createElement('link');
            canonical.rel = 'canonical';
            canonical.href = window.location.href.split('#')[0];
            document.head.appendChild(canonical);
        }
    }

    // Track page sections for SEO analytics
    trackPageSections() {
        const sections = ['hero', 'services', 'about', 'contact', 'booking', 'service-area', 'testimonials'];
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionName = entry.target.id;
                    this.updateSectionTitle(sectionName);
                    this.trackSectionView(sectionName);
                }
            });
        }, { threshold: 0.5 });

        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                observer.observe(section);
            }
        });
    }

    // Update page title based on current section
    updateSectionTitle(sectionName) {
        if (this.sectionTitles[sectionName]) {
            document.title = this.sectionTitles[sectionName];
            
            // Update meta description dynamically
            this.updateMetaDescription(sectionName);
        }
    }

    // Update meta description based on section
    updateMetaDescription(sectionName) {
        const descriptions = {
            'hero': 'FTTG AutoTech offers professional auto repair and mobile car service in Metro Atlanta. ASE certified technicians, transparent pricing, and quality warranties.',
            'services': 'Comprehensive auto repair services including oil changes, brake repair, engine diagnostics, and mobile car service. Expert technicians in Metro Atlanta.',
            'about': 'Learn about FTTG AutoTech - your trusted auto repair shop in Atlanta with ASE certified technicians and commitment to quality service.',
            'contact': 'Contact FTTG AutoTech for professional auto repair services in Metro Atlanta. Call us or schedule your service appointment online.',
            'booking': 'Book your auto repair service with FTTG AutoTech. Convenient online scheduling for mobile service and shop repairs in Metro Atlanta.',
            'service-area': 'FTTG AutoTech proudly serves the entire Metro Atlanta area. Serving Metro Atlanta Since 1980 with professional auto repair and mobile services.',
            'testimonials': 'Read what our customers say about FTTG AutoTech. Real testimonials from satisfied clients across Metro Atlanta for our auto repair services.'
        };

        let metaDesc = document.querySelector('meta[name="description"]');
        if (descriptions[sectionName]) {
            if (metaDesc) {
                metaDesc.setAttribute('content', descriptions[sectionName]);
            }
        }
    }

    // Add dynamic meta description if not present
    addMetaDescriptionDynamic() {
        if (!document.querySelector('meta[name="description"]')) {
            const metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            metaDesc.content = 'FTTG AutoTech offers professional auto repair and mobile car service in Metro Atlanta. ASE certified technicians, transparent pricing, and quality warranties.';
            document.head.appendChild(metaDesc);
        }
    }

    // Setup analytics tracking for SEO events
    setupAnalyticsTracking() {
        // Track form interactions
        document.addEventListener('submit', (e) => {
            if (e.target.matches('.booking-form')) {
                this.trackEvent('form_submit', 'booking_form', 'engagement');
            }
        });

        // Track phone number clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="tel:"]')) {
                this.trackEvent('phone_click', 'contact_phone', 'contact');
            }
        });

        // Track email clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="mailto:"]')) {
                this.trackEvent('email_click', 'contact_email', 'contact');
            }
        });

        // Track service selections
        document.addEventListener('change', (e) => {
            if (e.target.matches('#service-needed')) {
                this.trackEvent('service_selection', e.target.value, 'engagement');
            }
        });

        // Track mobile service interest
        document.addEventListener('change', (e) => {
            if (e.target.matches('#mobile-service-checkbox')) {
                this.trackEvent('mobile_service_toggle', e.target.checked ? 'enabled' : 'disabled', 'engagement');
            }
        });
    }

    // Track section views for analytics
    trackSectionView(sectionName) {
        this.trackEvent('section_view', sectionName, 'navigation');
    }

    // Generic event tracking function
    trackEvent(action, label, category = 'general') {
        // Google Analytics 4 tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: 1
            });
        }

        // Console logging for development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('SEO Event Tracked:', { action, label, category });
        }
    }

    // Optimize image alt texts for better SEO
    optimizeImageAltTexts() {
        const images = document.querySelectorAll('img:not([alt])');
        images.forEach((img, index) => {
            // Add meaningful alt text based on context
            const context = this.getImageContext(img);
            img.alt = context || `FTTG AutoTech professional auto repair service image ${index + 1}`;
        });
    }

    // Get context for image alt text
    getImageContext(img) {
        const parent = img.closest('section');
        if (!parent) return null;

        const sectionId = parent.id;
        const contexts = {
            'hero': 'Professional auto repair shop exterior and mobile service van',
            'services': 'Auto repair technician working on vehicle maintenance',
            'about': 'ASE certified automotive technicians at work',
            'contact': 'FTTG AutoTech service location and contact information',
            'booking': 'Customer booking auto repair service appointment',
            'service-area': 'Metro Atlanta service area map showing coverage zones',
            'testimonials': 'Happy customers and their vehicles after quality service'
        };

        return contexts[sectionId];
    }

    // Add structured data for local business
    addLocalBusinessStructuredData() {
        if (document.querySelector('script[type="application/ld+json"]')) {
            return; // Already exists
        }

        const structuredData = {
            "@context": "https://schema.org",
            "@type": "AutoRepair",
            "name": "FTTG AutoTech",
            "description": "Professional auto repair and mobile car service in Metro Atlanta with ASE certified technicians.",
            "url": "https://fttgautotech.com",
            "telephone": "+185557843343",
            "email": "support@fttgautotech.com",
            "address": {
                "@type": "PostalAddress",
                "addressRegion": "GA",
                "addressCountry": "US",
                "addressLocality": "Atlanta"
            },
            "openingHours": [
                "Mo-Fr 08:00-18:00",
                "Sa 08:00-16:00"
            ],
            "priceRange": "$$",
            "serviceArea": {
                "@type": "City",
                "name": "Atlanta"
            }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    // Monitor Core Web Vitals for SEO
    monitorCoreWebVitals() {
        // Track Largest Contentful Paint (LCP)
        if ('PerformanceObserver' in window) {
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.trackEvent('core_web_vital', `LCP_${Math.round(lastEntry.startTime)}ms`, 'performance');
            }).observe({ entryTypes: ['largest-contentful-paint'] });

            // Track First Input Delay (FID)
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    this.trackEvent('core_web_vital', `FID_${Math.round(entry.processingStart - entry.startTime)}ms`, 'performance');
                });
            }).observe({ entryTypes: ['first-input'] });

            // Track Cumulative Layout Shift (CLS)
            let clsValue = 0;
            new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                this.trackEvent('core_web_vital', `CLS_${Math.round(clsValue * 1000)}`, 'performance');
            }).observe({ entryTypes: ['layout-shift'] });
        }
    }

    // Generate sitemap data
    generateSitemapData() {
        const baseUrl = window.location.hostname === 'fttgautotech.com' 
            ? 'https://fttgautotech.com'
            : window.location.origin;
            
        const pages = [
            { url: '', priority: 1.0, changefreq: 'weekly' },
            { url: '#services', priority: 0.8, changefreq: 'monthly' },
            { url: '#about', priority: 0.7, changefreq: 'monthly' },
            { url: '#contact', priority: 0.6, changefreq: 'monthly' },
            { url: '#booking', priority: 0.9, changefreq: 'weekly' }
        ];

        return pages.map(page => ({
            ...page,
            url: baseUrl + (page.url ? '/' + page.url : ''),
            lastmod: new Date().toISOString().split('T')[0]
        }));
    }

    // Add breadcrumb structured data
    addBreadcrumbStructuredData() {
        const baseUrl = window.location.hostname === 'fttgautotech.com' 
            ? 'https://fttgautotech.com'
            : window.location.origin;
            
        const breadcrumbData = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": baseUrl
                }
            ]
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbData);
        document.head.appendChild(script);
    }
}

// Auto-initialize SEO manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.seoManager = new SEOManager();
});

// Export for manual initialization if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SEOManager;
}
