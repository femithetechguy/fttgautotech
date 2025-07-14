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
            const [appResponse, carResponse] = await Promise.all([
                fetch('./json/app.json'),
                fetch('./json/car.json')
            ]);
            
            if (!appResponse.ok) {
                throw new Error(`HTTP error! status: ${appResponse.status}`);
            }
            if (!carResponse.ok) {
                throw new Error(`HTTP error! status: ${carResponse.status}`);
            }
            
            this.appData = await appResponse.json();
            this.carData = await carResponse.json();
            
            console.log('App data loaded successfully:', this.appData);
            console.log('Car data loaded successfully:', this.carData);
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
                <a href="#booking" class="hero-btn ${index === 0 ? 'hero-btn-primary' : 'hero-btn-secondary'} inline-block px-8 py-3 rounded-lg font-semibold transition-all duration-300 hover:transform hover:scale-105" data-mobile-direct="true">
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
                <form class="booking-form grid grid-cols-1 md:grid-cols-2 gap-6">
                    ${booking.formFields.map(field => {
                        const fieldName = field.toLowerCase().replace(/\s+/g, '-');
                        const placeholder = field.charAt(0).toUpperCase() + field.slice(1);
                        const isRequired = ['name', 'phone', 'service needed'].includes(field);
                        
                        if (field === 'service needed') {
                            return `
                                <div class="form-group full-width">
                                    <label for="${fieldName}">Service Needed ${isRequired ? '*' : ''}</label>
                                    <select name="${fieldName}" id="${fieldName}" class="form-select" ${isRequired ? 'required' : ''}>
                                        <option value="">Select Service Needed</option>
                                        <option value="oil-change">Oil Change</option>
                                        <option value="brake-service">Brake Service</option>
                                        <option value="engine-diagnostics">Engine Diagnostics</option>
                                        <option value="ac-repair">A/C Repair</option>
                                        <option value="transmission">Transmission Service</option>
                                        <option value="mobile-service">Mobile Service</option>
                                        <option value="inspection">Vehicle Inspection</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            `;
                        }
                        
                        if (field === 'car make/model') {
                            return this.renderCarSelectionFields();
                        }
                        
                        return `
                            <div class="form-group">
                                <label for="${fieldName}">${placeholder} ${isRequired ? '*' : ''}</label>
                                <input 
                                    type="${fieldName === 'phone' ? 'tel' : 'text'}" 
                                    name="${fieldName}" 
                                    id="${fieldName}"
                                    placeholder="Enter your ${field.toLowerCase()}" 
                                    class="form-input" 
                                    ${isRequired ? 'required' : ''}
                                >
                            </div>
                        `;
                    }).join('')}
                    
                    <div class="form-group full-width">
                        <label for="preferred-date">Preferred Date</label>
                        <input type="date" name="preferred-date" id="preferred-date" class="form-input" min="${new Date().toISOString().split('T')[0]}">
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="preferred-time">Preferred Time</label>
                        <select name="preferred-time" id="preferred-time" class="form-select">
                            <option value="">Select preferred time</option>
                            <option value="morning">Morning (8AM - 12PM)</option>
                            <option value="afternoon">Afternoon (12PM - 5PM)</option>
                            <option value="evening">Evening (5PM - 7PM)</option>
                            <option value="flexible">I'm flexible</option>
                        </select>
                    </div>
                    
                    <div class="form-group full-width">
                        <label for="additional-notes">Additional Notes</label>
                        <textarea 
                            name="additional-notes" 
                            id="additional-notes"
                            placeholder="Tell us more about your vehicle's issue or any special requests..." 
                            rows="4" 
                            class="form-textarea"
                        ></textarea>
                    </div>
                    
                    <div class="form-group full-width">
                        <div class="mobile-service-container">
                            <label class="mobile-service-label">
                                <input type="checkbox" name="mobile-service-interest" id="mobile-service-checkbox" class="mobile-service-checkbox">
                                <div class="mobile-service-content">
                                    <div class="mobile-service-icon">
                                        <i class="bi bi-geo-alt"></i>
                                    </div>
                                    <div class="mobile-service-text">
                                        <h4>Mobile Service Available</h4>
                                        <span>We come to your location for convenient service</span>
                                    </div>
                                    <div class="mobile-service-badge">
                                        <span>Popular</span>
                                    </div>
                                </div>
                            </label>
                            
                            <div id="service-location-container" class="service-location-container" style="display: none;">
                                <div class="service-location-header">
                                    <i class="bi bi-pin-map"></i>
                                    <span>Where should we come to service your vehicle?</span>
                                </div>
                                <div class="service-location-fields">
                                    <div class="form-group">
                                        <label for="service-address">Service Address *</label>
                                        <input 
                                            type="text" 
                                            name="service-address" 
                                            id="service-address"
                                            placeholder="Enter street address" 
                                            class="form-input service-location-input"
                                        >
                                    </div>
                                    <div class="form-group">
                                        <label for="service-city">City *</label>
                                        <input 
                                            type="text" 
                                            name="service-city" 
                                            id="service-city"
                                            placeholder="Enter city" 
                                            class="form-input service-location-input"
                                        >
                                    </div>
                                    <div class="form-group">
                                        <label for="service-zip">ZIP Code *</label>
                                        <input 
                                            type="text" 
                                            name="service-zip" 
                                            id="service-zip"
                                            placeholder="Enter ZIP code" 
                                            class="form-input service-location-input"
                                        >
                                    </div>
                                    <div class="form-group full-width">
                                        <label for="location-type">Location Type</label>
                                        <select name="location-type" id="location-type" class="form-select">
                                            <option value="">Select location type</option>
                                            <option value="home">Home/Residential</option>
                                            <option value="office">Office/Workplace</option>
                                            <option value="parking-lot">Parking Lot</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div class="form-group full-width">
                                        <label for="location-notes">Location Instructions</label>
                                        <textarea 
                                            name="location-notes" 
                                            id="location-notes"
                                            placeholder="Any special instructions for finding you? (e.g., building number, parking details, access codes)" 
                                            rows="3" 
                                            class="form-textarea"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <button type="submit" class="booking-submit">
                        <span class="submit-text">Book My Service</span>
                        <i class="bi bi-arrow-right ml-2"></i>
                    </button>
                </form>
            `;
        }
    }

    renderCarSelectionFields() {
        if (!this.carData?.carData) {
            // Fallback to simple text input if car data not available
            return `
                <div class="form-group">
                    <label for="car-make-model">Car Make/Model *</label>
                    <input 
                        type="text" 
                        name="car-make-model" 
                        id="car-make-model"
                        placeholder="Enter your car make and model" 
                        class="form-input" 
                        required
                    >
                </div>
            `;
        }

        const carData = this.carData.carData;
        
        return `
            <div class="form-group">
                <label for="car-make">Car Make *</label>
                <select name="car-make" id="car-make" class="form-select" required onchange="window.app.updateModelOptions(this.value)">
                    <option value="">Select Car Make</option>
                    ${carData.makes.map(make => `<option value="${make}">${make}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label for="car-model">Car Model *</label>
                <select name="car-model" id="car-model" class="form-select" required disabled>
                    <option value="">Select Make First</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="car-year">Car Year *</label>
                <select name="car-year" id="car-year" class="form-select" required>
                    <option value="">Select Year</option>
                    ${carData.years.map(year => `<option value="${year}">${year}</option>`).join('')}
                </select>
            </div>
        `;
    }

    updateModelOptions(selectedMake) {
        const modelSelect = document.getElementById('car-model');
        if (!modelSelect || !this.carData?.carData?.models[selectedMake]) {
            return;
        }

        const models = this.carData.carData.models[selectedMake];
        
        modelSelect.innerHTML = `
            <option value="">Select Model</option>
            ${models.map(model => `<option value="${model}">${model}</option>`).join('')}
        `;
        
        modelSelect.disabled = false;
        
        // Add visual feedback
        modelSelect.classList.add('updated');
        setTimeout(() => modelSelect.classList.remove('updated'), 300);
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

        // Mobile service checkbox functionality
        document.addEventListener('change', (e) => {
            if (e.target.matches('#mobile-service-checkbox')) {
                this.handleMobileServiceToggle(e.target);
            }
        });

        // Service location input validation
        document.addEventListener('input', (e) => {
            if (e.target.matches('.service-location-input')) {
                this.validateServiceLocationField(e.target);
            }
        });

        // Mobile service benefit card click handler
        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="select-mobile-service"]')) {
                this.selectMobileService();
            }
        });

        // Mobile-specific hero button click handler
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-mobile-direct="true"]') && this.isMobileDevice()) {
                e.preventDefault();
                this.scrollToBookingForm();
            }
        });
    }

    handleBookingSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate mobile service fields if mobile service is selected
        const mobileServiceChecked = document.getElementById('mobile-service-checkbox')?.checked;
        if (mobileServiceChecked) {
            const requiredFields = ['service-address', 'service-city', 'service-zip'];
            const missingFields = [];
            
            requiredFields.forEach(fieldName => {
                if (!data[fieldName] || data[fieldName].trim() === '') {
                    missingFields.push(fieldName);
                }
            });
            
            if (missingFields.length > 0) {
                alert('Please fill in all required service location fields.');
                // Focus on first missing field
                const firstMissingField = document.getElementById(missingFields[0]);
                if (firstMissingField) {
                    firstMissingField.focus();
                    firstMissingField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
        }
        
        // Add mobile service info to submission data
        if (mobileServiceChecked) {
            data['is-mobile-service'] = true;
            data['service-location'] = {
                address: data['service-address'],
                city: data['service-city'],
                zip: data['service-zip'],
                type: data['location-type'],
                notes: data['location-notes']
            };
        }
        
        // Here you would typically send the data to your backend
        console.log('Booking submission:', data);
        
        // Show appropriate success message
        const successMessage = mobileServiceChecked 
            ? 'Thank you for your mobile service booking! We will contact you soon to confirm your appointment and service location.'
            : 'Thank you for your booking request! We will contact you soon.';
            
        alert(successMessage);
        form.reset();
        
        // Reset mobile service container if it was shown
        if (mobileServiceChecked) {
            const serviceLocationContainer = document.getElementById('service-location-container');
            if (serviceLocationContainer) {
                serviceLocationContainer.style.display = 'none';
                serviceLocationContainer.classList.remove('show');
            }
        }
    }

    renderCarSelectionFields() {
        if (!this.carData?.carData) {
            // Fallback to simple text input if car data not available
            return `
                <div class="form-group">
                    <label for="car-make-model">Car Make/Model *</label>
                    <input 
                        type="text" 
                        name="car-make-model" 
                        id="car-make-model"
                        placeholder="Enter your car make and model" 
                        class="form-input" 
                        required
                    >
                </div>
            `;
        }

        const carData = this.carData.carData;
        
        return `
            <div class="form-group">
                <label for="car-make">Car Make *</label>
                <select name="car-make" id="car-make" class="form-select" required onchange="window.app.updateModelOptions(this.value)">
                    <option value="">Select Car Make</option>
                    ${carData.makes.map(make => `<option value="${make}">${make}</option>`).join('')}
                </select>
            </div>
            
            <div class="form-group">
                <label for="car-model">Car Model *</label>
                <select name="car-model" id="car-model" class="form-select" required disabled>
                    <option value="">Select Make First</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="car-year">Car Year *</label>
                <select name="car-year" id="car-year" class="form-select" required>
                    <option value="">Select Year</option>
                    ${carData.years.map(year => `<option value="${year}">${year}</option>`).join('')}
                </select>
            </div>
        `;
    }

    updateModelOptions(selectedMake) {
        const modelSelect = document.getElementById('car-model');
        if (!modelSelect || !this.carData?.carData?.models[selectedMake]) {
            return;
        }

        const models = this.carData.carData.models[selectedMake];
        
        modelSelect.innerHTML = `
            <option value="">Select Model</option>
            ${models.map(model => `<option value="${model}">${model}</option>`).join('')}
        `;
        
        modelSelect.disabled = false;
        
        // Add visual feedback
        modelSelect.classList.add('updated');
        setTimeout(() => modelSelect.classList.remove('updated'), 300);
    }

    selectMobileService() {
        // Scroll to booking form
        const bookingForm = document.getElementById('booking-form');
        if (bookingForm) {
            bookingForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Wait for scroll, then select mobile service
        setTimeout(() => {
            const mobileServiceCheckbox = document.getElementById('mobile-service-checkbox');
            const serviceNeededSelect = document.getElementById('service-needed');
            
            if (mobileServiceCheckbox && !mobileServiceCheckbox.checked) {
                mobileServiceCheckbox.checked = true;
                this.handleMobileServiceToggle(mobileServiceCheckbox);
            }
            
            // Also set service type to mobile service if not already selected
            if (serviceNeededSelect && serviceNeededSelect.value === '') {
                serviceNeededSelect.value = 'mobile-service';
                serviceNeededSelect.classList.add('form-select', 'updated');
            }
            
            // Add visual feedback
            const mobileServiceContainer = document.querySelector('.mobile-service-container');
            if (mobileServiceContainer) {
                mobileServiceContainer.style.border = '2px solid ' + 'var(--accent-color)';
                setTimeout(() => {
                    mobileServiceContainer.style.border = '';
                }, 2000);
            }
        }, 1000);
    }

    handleMobileServiceToggle(checkbox) {
        const serviceLocationContainer = document.getElementById('service-location-container');
        const serviceLocationInputs = document.querySelectorAll('.service-location-input');
        
        if (checkbox.checked) {
            // Show service location fields with animation
            serviceLocationContainer.style.display = 'block';
            setTimeout(() => {
                serviceLocationContainer.classList.add('show');
            }, 10);
            
            // Make service location fields required
            serviceLocationInputs.forEach(input => {
                input.setAttribute('required', 'required');
            });
            
            // Scroll to service location section
            setTimeout(() => {
                serviceLocationContainer.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'nearest' 
                });
            }, 300);
            
        } else {
            // Hide service location fields
            serviceLocationContainer.classList.remove('show');
            setTimeout(() => {
                serviceLocationContainer.style.display = 'none';
            }, 300);
            
            // Remove required attribute and clear values
            serviceLocationInputs.forEach(input => {
                input.removeAttribute('required');
                input.value = '';
                input.classList.remove('valid', 'invalid');
            });
            
            // Clear location type and notes
            const locationTypeSelect = document.getElementById('location-type');
            const locationNotesTextarea = document.getElementById('location-notes');
            if (locationTypeSelect) locationTypeSelect.value = '';
            if (locationNotesTextarea) locationNotesTextarea.value = '';
        }
    }

    validateServiceLocationField(field) {
        const value = field.value.trim();
        let isValid = false;
        
        switch (field.name) {
            case 'service-address':
                isValid = value.length >= 5;
                break;
            case 'service-city':
                isValid = value.length >= 2 && /^[a-zA-Z\s]+$/.test(value);
                break;
            case 'service-zip':
                isValid = /^\d{5}(-\d{4})?$/.test(value);
                break;
            default:
                isValid = value.length > 0;
        }
        
        // Update field styling
        field.classList.remove('valid', 'invalid');
        if (value.length > 0) {
            field.classList.add(isValid ? 'valid' : 'invalid');
        }
        
        return isValid;
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

    isMobileDevice() {
        // Check for mobile device using multiple methods
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobileUserAgent = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const isSmallScreen = window.innerWidth <= 768;
        
        return isMobileUserAgent || (isTouchDevice && isSmallScreen);
    }

    scrollToBookingForm() {
        // First scroll to booking section
        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        // Then after a short delay, scroll specifically to the form and focus first input
        setTimeout(() => {
            const bookingForm = document.querySelector('.booking-form');
            const firstInput = document.querySelector('.booking-form input[type="text"], .booking-form input[type="tel"]');
            
            if (bookingForm) {
                // Scroll to form with some offset for mobile header
                const formRect = bookingForm.getBoundingClientRect();
                const scrollTarget = window.pageYOffset + formRect.top - 100;
                
                window.scrollTo({
                    top: scrollTarget,
                    behavior: 'smooth'
                });
                
                // Focus first input after scroll completes
                setTimeout(() => {
                    if (firstInput) {
                        firstInput.focus();
                        // Add visual highlight to show where user should start
                        firstInput.classList.add('mobile-focused');
                        firstInput.style.boxShadow = '0 0 0 3px rgba(255, 107, 0, 0.3)';
                        setTimeout(() => {
                            firstInput.style.boxShadow = '';
                            firstInput.classList.remove('mobile-focused');
                        }, 2000);
                    }
                }, 800);
            }
        }, 600);
    }

    // Method to reload app data (useful for development)
    async reload() {
        console.log('Reloading app data...');
        await this.init();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FTTGAutoTechApp();
    window.fttgApp = window.app; // Keep backward compatibility
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
