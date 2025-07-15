// Simplified Consent Management JavaScript
// Handles simple consent choice and form submissions

class ConsentManager {
    constructor() {
        this.consentData = null;
        this.communicationService = null;
        this.preferences = {
            consentChoice: '',
            fullName: '',
            phoneNumber: '',
            email: '',
            timestamp: null
        };
    }

    // Initialize the consent manager
    async initialize() {
        console.log('Initializing consent manager...');
        
        // Always hide loading overlay after a timeout
        setTimeout(() => {
            this.hideLoadingOverlay();
        }, 3000);
        
        try {
            await this.loadConsentData();
            console.log('Consent data loaded successfully');
            
            await this.loadCommunicationConfig();
            console.log('Communication config loaded');
            
            this.setupEventListeners();
            console.log('Event listeners set up');
            
            this.populatePageContent();
            console.log('Page content populated');
            
        } catch (error) {
            console.error('Failed to initialize consent manager:', error);
            this.hideLoadingOverlay();
            this.populateBasicContent();
        }
    }

    // Load consent data from JSON
    async loadConsentData() {
        try {
            const response = await fetch('json/consent.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            this.consentData = await response.json();
        } catch (error) {
            console.error('Error loading consent data:', error);
            throw error;
        }
    }

    // Load communication configuration
    async loadCommunicationConfig() {
        try {
            const response = await fetch('json/communication.json');
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const config = await response.json();
            
            // Initialize Twilio service if available
            if (window.TwilioService) {
                this.communicationService = new TwilioService(config);
            }
        } catch (error) {
            console.warn('Communication config not available:', error);
            // Continue without Twilio integration
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Form submission
        const form = document.getElementById('communication-consent-form');
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmission(e));
        }

        // Phone number formatting
        const phoneInput = document.getElementById('phone-number');
        if (phoneInput) {
            phoneInput.addEventListener('input', this.formatPhoneNumber);
        }

        // Consent option changes (simplified)
        const consentOptions = document.querySelectorAll('input[name="consentChoice"]');
        consentOptions.forEach(option => {
            option.addEventListener('change', (e) => this.handleConsentChange(e));
        });

        // Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        if (mobileMenuButton) {
            mobileMenuButton.addEventListener('click', this.toggleMobileMenu);
        }
    }

    // Populate page content from JSON data
    populatePageContent() {
        if (!this.consentData) {
            console.warn('No consent data available, using basic content');
            this.populateBasicContent();
            return;
        }

        const consent = this.consentData.consent;
        
        // Update page metadata
        this.updatePageMetadata(consent);
        
        // Populate hero section
        this.populateHeroSection(consent.hero);
        
        // Populate content sections
        this.populateContentSections(consent.sections);
        
        // Populate contact section
        this.populateContactSection(consent.contact);
        
        // Populate legal information
        this.populateLegalInfo(consent.legalInfo);
        
        // Hide loading overlay
        this.hideLoadingOverlay();
    }

    // Populate basic content as fallback
    populateBasicContent() {
        console.log('Populating basic content');
        
        // Basic hero content with softer styling
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const heroDescription = document.getElementById('hero-description');
        const contactTitle = document.getElementById('contact-title');
        const contactDescription = document.getElementById('contact-description');
        
        if (heroTitle) {
            heroTitle.textContent = 'Communication Consent';
            heroTitle.className = 'text-4xl md:text-6xl font-bold font-heading mb-6 text-gray-200';
        }
        if (heroSubtitle) {
            heroSubtitle.textContent = 'Transparent. Secure. Respectful.';
            heroSubtitle.className = 'text-xl md:text-2xl mb-4 text-gray-400 font-heading';
        }
        if (heroDescription) {
            heroDescription.textContent = 'At FTTG AutoTech, we believe in clear communication and respecting your privacy preferences.';
            heroDescription.className = 'text-lg mb-8 text-gray-400 max-w-3xl mx-auto';
        }
        
        // Basic contact content with softer styling
        if (contactTitle) {
            contactTitle.textContent = 'Questions About Communication Consent?';
            contactTitle.className = 'text-3xl font-bold font-heading mb-4 text-gray-200';
        }
        if (contactDescription) {
            contactDescription.textContent = 'We\'re here to help clarify any questions about how we communicate with you.';
            contactDescription.className = 'text-lg text-gray-400';
        }
        
        // Basic legal info
        const legalTextContainer = document.getElementById('legal-text');
        if (legalTextContainer) {
            legalTextContainer.innerHTML = '<p class="mb-2 text-gray-700">By providing your phone number and consenting to SMS communications, you agree to receive text messages from FTTG AutoTech.</p>';
        }
        
        const footerLegalContainer = document.getElementById('legal-info');
        if (footerLegalContainer) {
            footerLegalContainer.innerHTML = '<p class="text-gray-500">Last updated: July 15, 2025 | Version 1.0</p>';
        }
        
        // Hide loading overlay
        this.hideLoadingOverlay();
    }

    // Update page metadata
    updatePageMetadata(consent) {
        document.title = consent.pageTitle + ' - FTTG AutoTech';
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.content = consent.pageDescription;
        }
    }

    // Populate hero section
    populateHeroSection(hero) {
        this.safeSetTextContent('hero-title', hero.title);
        this.safeSetTextContent('hero-subtitle', hero.subtitle);
        this.safeSetTextContent('hero-description', hero.description);
    }

    // Populate content sections
    populateContentSections(sections) {
        const container = document.getElementById('consent-sections');
        if (!container) return;

        container.innerHTML = ''; // Clear existing content
        
        Object.entries(sections).forEach(([key, section]) => {
            if (key === 'consentOptions') return; // Skip - we have static options now
            
            const sectionElement = this.createContentSection(section);
            container.appendChild(sectionElement);
        });
    }

    // Create individual content section
    createContentSection(section) {
        const sectionElement = document.createElement('div');
        sectionElement.className = 'bg-white rounded-lg shadow-lg p-8 border border-gray-200';
        
        let contentHtml = `
            <div class="flex items-center mb-6">
                <i class="bi ${section.icon} text-3xl text-accent mr-4"></i>
                <h2 class="text-2xl font-bold font-heading text-primary">${section.title}</h2>
            </div>
        `;
        
        section.content.forEach(item => {
            contentHtml += this.renderContentItem(item);
        });
        
        sectionElement.innerHTML = contentHtml;
        return sectionElement;
    }

    // Render individual content items
    renderContentItem(item) {
        switch (item.type) {
            case 'text':
                return `<p class="text-text-secondary mb-4">${item.value}</p>`;
            
            case 'list':
                let listHtml = '<ul class="list-disc list-inside text-text-secondary mb-4 space-y-2">';
                item.items.forEach(listItem => {
                    listHtml += `<li>${listItem}</li>`;
                });
                listHtml += '</ul>';
                return listHtml;
            
            case 'important':
                return `<div class="bg-blue-50 border-l-4 border-accent p-4 mb-4">
                    <p class="font-semibold text-accent">${item.value}</p>
                </div>`;
            
            case 'note':
                return `<div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p class="text-yellow-800">${item.value}</p>
                </div>`;
            
            default:
                return '';
        }
    }

    // Populate contact section
    populateContactSection(contact) {
        this.safeSetTextContent('contact-title', contact.title);
        this.safeSetTextContent('contact-description', contact.description);
        
        const container = document.getElementById('contact-methods');
        if (!container) return;

        container.innerHTML = ''; // Clear existing content
        
        contact.methods.forEach(method => {
            const methodElement = this.createContactMethod(method);
            container.appendChild(methodElement);
        });
    }

    // Create contact method element
    createContactMethod(method) {
        const methodElement = document.createElement('div');
        methodElement.className = 'text-center';
        
        let link = method.value;
        if (method.type === 'phone') {
            link = `tel:${method.value}`;
        } else if (method.type === 'email') {
            link = `mailto:${method.value}`;
        }
        
        methodElement.innerHTML = `
            <div class="mb-4">
                <i class="bi ${method.icon} text-4xl text-accent"></i>
            </div>
            <h3 class="text-xl font-semibold font-heading mb-2">${method.label}</h3>
            ${method.type === 'address' ? 
                `<p class="text-gray-300">${method.value}</p>` :
                `<a href="${link}" class="text-accent hover:text-orange-300 transition duration-300">${method.value}</a>`
            }
        `;
        
        return methodElement;
    }

    // Populate legal information
    populateLegalInfo(legalInfo) {
        const legalTextContainer = document.getElementById('legal-text');
        const footerLegalContainer = document.getElementById('legal-info');
        
        if (legalTextContainer) {
            legalTextContainer.innerHTML = ''; // Clear existing content
            legalInfo.content.forEach(item => {
                const p = document.createElement('p');
                p.textContent = item.value;
                p.className = 'mb-2';
                legalTextContainer.appendChild(p);
            });
        }
        
        if (footerLegalContainer) {
            footerLegalContainer.innerHTML = `
                <p>Last updated: ${legalInfo.lastUpdated} | Version ${legalInfo.version}</p>
            `;
        }
    }

    // Handle form submission
    async handleFormSubmission(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        this.preferences = {
            consentChoice: formData.get('consentChoice'),
            fullName: formData.get('fullName') || '',
            phoneNumber: formData.get('phoneNumber') || '',
            email: formData.get('email') || '',
            timestamp: new Date().toISOString()
        };

        // Validate required fields
        if (!this.validatePreferences()) {
            return;
        }

        try {
            await this.savePreferences();
            this.showSuccessModal();
            e.target.reset();
        } catch (error) {
            console.error('Error saving preferences:', error);
            this.showError('Failed to save preferences. Please try again.');
        }
    }

    // Validate preferences
    validatePreferences() {
        if (!this.preferences.consentChoice) {
            this.showError('Please select your consent choice.');
            return false;
        }

        return true;
    }

    // Save preferences
    async savePreferences() {
        // Store in localStorage
        localStorage.setItem('fttg_communication_consent', JSON.stringify(this.preferences));
        
        // If communication service is available, send confirmation
        if (this.communicationService && this.preferences.consentChoice === 'consent') {
            try {
                await this.sendConsentConfirmation();
            } catch (error) {
                console.warn('Failed to send consent confirmation:', error);
                // Don't fail the save operation if SMS fails
            }
        }

        // Here you would typically send to your backend
        console.log('Consent choice saved:', this.preferences);
    }

    // Send consent confirmation SMS
    async sendConsentConfirmation() {
        if (this.preferences.consentChoice === 'consent' && this.preferences.phoneNumber) {
            const name = this.preferences.fullName || 'Customer';
            const message = `Hi ${name}! Thank you for consenting to SMS communications with FTTG AutoTech. We'll use this to send appointment confirmations and service updates. Reply STOP to opt out anytime. Questions? Call (855) 578-4334`;
            
            await this.communicationService.sendSMS(
                this.preferences.phoneNumber,
                message
            );
        }
    }

    // Handle consent option change (simplified)
    handleConsentChange(e) {
        const choice = e.target.value;
        
        // Show helpful message based on choice
        if (choice === 'consent') {
            console.log('User consented to SMS/phone communications');
        } else if (choice === 'no-consent') {
            console.log('User opted out of SMS/phone communications');
        }
    }

    // Format phone number as user types
    formatPhoneNumber(e) {
        const input = e.target;
        const value = input.value.replace(/\D/g, '');
        let formattedValue = '';

        if (value.length >= 6) {
            formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        } else if (value.length >= 3) {
            formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            formattedValue = value;
        }

        input.value = formattedValue;
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
        }
    }

    // Show success modal
    showSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    // Close success modal
    closeSuccessModal() {
        const modal = document.getElementById('success-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Hide loading overlay
    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }

    // Show error message
    showError(message) {
        // Simple error handling - could be enhanced with a proper modal
        alert(message);
        // Also hide loading overlay if there's an error
        this.hideLoadingOverlay();
    }

    // Safely set text content
    safeSetTextContent(elementId, content) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = content;
        }
    }

    // Get saved preferences
    getSavedPreferences() {
        const saved = localStorage.getItem('fttg_communication_consent');
        return saved ? JSON.parse(saved) : null;
    }

    // Check if user has existing preferences
    hasExistingPreferences() {
        return this.getSavedPreferences() !== null;
    }
}

// Global functions for modal and menu control
window.closeSuccessModal = function() {
    if (window.consentManager) {
        window.consentManager.closeSuccessModal();
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.consentManager = new ConsentManager();
    window.consentManager.initialize();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConsentManager;
}
