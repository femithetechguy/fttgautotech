// Main App Controller - Dynamically loads content from app.json
class FTTGAutoTechApp {
    constructor() {
        this.appData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadAppData();
            this.applyTheme();
            this.renderContent();
            this.setupEventListeners();
            this.hideLoading();
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError();
        }
    }

    async loadAppData() {
        try {
            const response = await fetch('./json/app.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.appData = await response.json();
            console.log('App data loaded successfully:', this.appData);
        } catch (error) {
            console.error('Error loading app data:', error);
            throw error;
        }
    }

    applyTheme() {
        if (!this.appData?.branding?.colors) return;

        const root = document.documentElement;
        const colors = this.appData.branding.colors;
        
        // Apply primary color
        if (colors.primary?.color) {
            root.style.setProperty('--primary-color', colors.primary.color);
        }
        
        // Apply accent color (use first accent color)
        if (colors.accent?.[0]?.color) {
            root.style.setProperty('--accent-color', colors.accent[0].color);
        }
        
        // Apply fonts
        if (this.appData.branding?.fonts) {
            const fonts = this.appData.branding.fonts;
            if (fonts.headings?.[0]) {
                root.style.setProperty('--heading-font', `'${fonts.headings[0]}', sans-serif`);
            }
            if (fonts.body?.[0]) {
                root.style.setProperty('--body-font', `'${fonts.body[0]}', sans-serif`);
            }
        }
    }

    renderContent() {
        this.renderNavigation();
        this.renderHero();
        this.renderServices();
        this.renderFeatures();
        this.renderBookingForm();
        this.renderContact();
        this.renderFooter();
        this.updatePageTitle();
    }

    renderNavigation() {
        const navigation = this.appData?.navigation;
        if (!navigation) return;

        const navMenu = document.getElementById('nav-menu');
        const mobileNavMenu = document.getElementById('mobile-nav-menu');
        
        if (navMenu && mobileNavMenu) {
            const navItems = navigation
                .filter(item => !item.optional)
                .map(item => `
                    <a href="${item.url}" class="nav-link" data-section="${item.section.toLowerCase().replace(/\s+/g, '-')}">
                        ${item.section}
                    </a>
                `).join('');

            const mobileNavItems = navigation
                .filter(item => !item.optional)
                .map(item => `
                    <a href="${item.url}" class="mobile-nav-link" data-section="${item.section.toLowerCase().replace(/\s+/g, '-')}">
                        ${item.section}
                    </a>
                `).join('');

            navMenu.innerHTML = navItems;
            mobileNavMenu.innerHTML = mobileNavItems;
        }
    }

    renderHero() {
        const homepage = this.appData?.homepage;
        if (!homepage?.hero) return;

        const hero = homepage.hero;
        
        // Update title
        const titleElement = document.getElementById('hero-title');
        if (titleElement) {
            titleElement.textContent = hero.title;
            titleElement.className = 'hero-title text-4xl md:text-6xl font-heading font-bold mb-4';
        }

        // Update subtitle
        const subtitleElement = document.getElementById('hero-subtitle');
        if (subtitleElement) {
            subtitleElement.textContent = hero.subtitle;
            subtitleElement.className = 'hero-subtitle text-lg md:text-xl mb-8 opacity-90';
        }

        // Update CTA buttons
        const ctaElement = document.getElementById('hero-cta');
        if (ctaElement && hero.cta) {
            ctaElement.innerHTML = hero.cta.map((cta, index) => `
                <a href="#booking" class="hero-btn ${index === 0 ? 'hero-btn-primary' : 'hero-btn-secondary'} inline-block px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:transform hover:scale-105">
                    ${cta}
                </a>
            `).join('');
        }
    }

    renderServices() {
        const services = this.appData?.homepage?.services;
        if (!services?.items) return;

        const servicesGrid = document.getElementById('services-grid');
        const servicesTitle = document.getElementById('services-title');
        
        if (servicesTitle) {
            servicesTitle.textContent = services.title || 'Our Services';
        }

        if (servicesGrid) {
            servicesGrid.innerHTML = services.items.map(service => `
                <div class="service-item fade-in">
                    <div class="service-icon ${service.icon}"></div>
                    <h3 class="service-title">${service.name}</h3>
                    <p class="service-description">Professional ${service.name.toLowerCase()} services with certified technicians.</p>
                </div>
            `).join('');
        }
    }

    renderFeatures() {
        const features = this.appData?.homepage?.whyChooseUs;
        if (!features?.features) return;

        const featuresGrid = document.getElementById('features-grid');
        const whyChooseTitle = document.getElementById('why-choose-title');
        
        if (whyChooseTitle) {
            whyChooseTitle.textContent = features.title || 'Why Choose Us';
        }

        if (featuresGrid) {
            featuresGrid.innerHTML = features.features.map((feature, index) => {
                const iconClass = this.getFeatureIconClass(feature);
                return `
                    <div class="feature-item slide-up">
                        <div class="feature-icon ${iconClass}"></div>
                        <h3 class="feature-title">${feature}</h3>
                    </div>
                `;
            }).join('');
        }
    }

    getFeatureIconClass(feature) {
        const featureMap = {
            'ASE Certified Techs': 'certified',
            'Mobile Service Available': 'mobile',
            'Transparent Pricing': 'pricing',
            'Warranty on All Work': 'warranty'
        };
        return featureMap[feature] || 'certified';
    }

    renderBookingForm() {
        const booking = this.appData?.homepage?.booking;
        if (!booking) return;

        const bookingTitle = document.getElementById('booking-title');
        const bookingForm = document.getElementById('booking-form');
        
        if (bookingTitle) {
            bookingTitle.textContent = booking.title || 'Book Your Service';
        }

        if (bookingForm && booking.formFields) {
            bookingForm.innerHTML = `
                <form class="booking-form grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${booking.formFields.map(field => {
                        const fieldName = field.toLowerCase().replace(/\s+/g, '-');
                        const placeholder = field.charAt(0).toUpperCase() + field.slice(1);
                        
                        if (field === 'service needed') {
                            return `
                                <div class="md:col-span-2">
                                    <select name="${fieldName}" class="form-select" required>
                                        <option value="">Select Service Needed</option>
                                        <option value="oil-change">Oil Change</option>
                                        <option value="brake-service">Brake Service</option>
                                        <option value="engine-diagnostics">Engine Diagnostics</option>
                                        <option value="ac-repair">A/C Repair</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            `;
                        }
                        
                        return `
                            <div>
                                <input type="text" name="${fieldName}" placeholder="${placeholder}" class="form-input" required>
                            </div>
                        `;
                    }).join('')}
                    <div class="md:col-span-2">
                        <textarea name="additional-notes" placeholder="Additional notes or details" rows="3" class="form-textarea"></textarea>
                    </div>
                    <div class="md:col-span-2">
                        <button type="submit" class="btn-primary w-full">Book Now</button>
                    </div>
                </form>
            `;
        }
    }

    renderContact() {
        const contact = this.appData?.contact;
        if (!contact) return;

        const contactInfo = document.getElementById('contact-info');
        if (contactInfo) {
            contactInfo.innerHTML = `
                <div class="contact-item flex items-center mb-4">
                    <i class="bi bi-telephone text-accent text-xl mr-4"></i>
                    <div>
                        <h4 class="font-semibold text-primary">Phone</h4>
                        <a href="tel:${contact.phone}" class="text-gray-600 hover:text-accent">${contact.phone}</a>
                    </div>
                </div>
                <div class="contact-item flex items-center mb-4">
                    <i class="bi bi-envelope text-accent text-xl mr-4"></i>
                    <div>
                        <h4 class="font-semibold text-primary">General Inquiries</h4>
                        <a href="mailto:${contact.emails.general}" class="text-gray-600 hover:text-accent">${contact.emails.general}</a>
                    </div>
                </div>
                <div class="contact-item flex items-center mb-4">
                    <i class="bi bi-headset text-accent text-xl mr-4"></i>
                    <div>
                        <h4 class="font-semibold text-primary">Customer Support</h4>
                        <a href="mailto:${contact.emails.support}" class="text-gray-600 hover:text-accent">${contact.emails.support}</a>
                    </div>
                </div>
                <div class="contact-item flex items-center">
                    <i class="bi bi-geo-alt text-accent text-xl mr-4"></i>
                    <div>
                        <h4 class="font-semibold text-primary">Service Area</h4>
                        <p class="text-gray-600">${contact.serviceArea}</p>
                    </div>
                </div>
            `;
        }
    }

    renderFooter() {
        const business = this.appData?.business;
        const contact = this.appData?.contact;
        const navigation = this.appData?.navigation;
        const footer = this.appData?.footer;

        // Footer title and tagline
        const footerTitle = document.getElementById('footer-title');
        const footerTagline = document.getElementById('footer-tagline');
        
        if (footerTitle && business?.name) {
            footerTitle.textContent = business.name;
        }
        
        if (footerTagline && business?.tagline) {
            footerTagline.textContent = business.tagline;
        }

        // Footer links
        const footerLinks = document.getElementById('footer-links');
        if (footerLinks && navigation) {
            footerLinks.innerHTML = navigation
                .filter(item => !item.optional)
                .map(item => `
                    <a href="${item.url}" class="text-gray-300 hover:text-accent transition-colors">${item.section}</a>
                `).join('');
        }

        // Footer contact
        const footerContact = document.getElementById('footer-contact');
        if (footerContact && contact) {
            footerContact.innerHTML = `
                <p class="flex items-center mb-2">
                    <i class="bi bi-telephone mr-2"></i>
                    ${contact.phone}
                </p>
                <p class="flex items-center mb-2">
                    <i class="bi bi-envelope mr-2"></i>
                    ${contact.emails.general}
                </p>
                <p class="flex items-center">
                    <i class="bi bi-geo-alt mr-2"></i>
                    ${contact.serviceArea}
                </p>
            `;
        }

        // Update footer copyright section
        const footerCopyright = document.querySelector('footer .border-t');
        if (footerCopyright && footer) {
            // Always use current year when set to "dynamic" or if no year is specified
            const currentYear = new Date().getFullYear();
            const displayYear = footer.copyright?.year === 'dynamic' || !footer.copyright?.year ? currentYear : footer.copyright.year;
            
            footerCopyright.innerHTML = `
                <div class="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
                    <div class="flex flex-col md:flex-row justify-between items-center">
                        <p>&copy; ${displayYear} ${business?.name || 'FTTG AutoTech'}. ${footer.copyright?.text || 'All rights reserved.'}</p>
                        ${footer.createdBy ? `
                            <p class="mt-2 md:mt-0">
                                <a href="${footer.createdBy.url}" target="_blank" rel="noopener noreferrer" class="text-accent hover:text-orange-400 transition-colors">
                                    ${footer.createdBy.text}
                                </a>
                            </p>
                        ` : ''}
                    </div>
                </div>
            `;
        }
    }

    updatePageTitle() {
        const business = this.appData?.business;
        if (business?.name && business?.tagline) {
            document.title = `${business.name} - ${business.tagline}`;
        }
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

        // Smooth scrolling for navigation links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const target = document.querySelector(e.target.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                    
                    // Close mobile menu if open
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            }
        });

        // Form submission
        document.addEventListener('submit', (e) => {
            if (e.target.matches('.booking-form')) {
                e.preventDefault();
                this.handleBookingSubmission(e.target);
            }
        });

        // Update mobile call button with dynamic phone number
        const mobileCallBtn = document.querySelector('#mobile-call-btn a');
        if (mobileCallBtn && this.appData?.contact?.phone) {
            mobileCallBtn.href = `tel:${this.appData.contact.phone}`;
        }

        // Navbar scroll effect
        window.addEventListener('scroll', () => {
            const navbar = document.getElementById('navbar');
            if (navbar) {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
        });
    }

    handleBookingSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to your backend
        console.log('Booking submission:', data);
        
        // For now, show a success message
        alert('Thank you for your booking request! We will contact you soon.');
        form.reset();
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            setTimeout(() => {
                loading.style.opacity = '0';
                setTimeout(() => {
                    loading.style.display = 'none';
                }, 500);
            }, 1000);
        }
    }

    showError() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.innerHTML = `
                <div class="text-center text-white">
                    <i class="bi bi-exclamation-triangle text-6xl mb-4 text-red-400"></i>
                    <h2 class="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
                    <p class="mb-4">We're having trouble loading the website. Please try refreshing the page.</p>
                    <button onclick="location.reload()" class="bg-accent text-white px-6 py-3 rounded-lg hover:bg-opacity-90">
                        Refresh Page
                    </button>
                </div>
            `;
        }
    }

    // Method to reload app data (useful for development)
    async reload() {
        console.log('Reloading app data...');
        await this.init();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.fttgApp = new FTTGAutoTechApp();
});

// Auto-reload functionality for development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    setInterval(() => {
        fetch('./json/app.json', { cache: 'no-cache' })
            .then(response => response.json())
            .then(data => {
                // Check if data has changed (simple comparison)
                if (window.fttgApp && JSON.stringify(data) !== JSON.stringify(window.fttgApp.appData)) {
                    console.log('App data changed, reloading...');
                    window.fttgApp.reload();
                }
            })
            .catch(error => console.log('Auto-reload check failed:', error));
    }, 2000); // Check every 2 seconds
}
