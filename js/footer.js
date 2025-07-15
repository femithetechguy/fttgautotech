// Footer Component - Consistent across all pages
class FooterComponent {
    constructor() {
        this.footerData = null;
        this.init();
    }

    async init() {
        try {
            await this.loadFooterData();
            this.renderFooter();
        } catch (error) {
            console.error('Failed to load footer:', error);
            this.renderFallbackFooter();
        }
    }

    async loadFooterData() {
        try {
            const response = await fetch('./json/app.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.footerData = {
                business: data.business,
                contact: data.contact,
                navigation: data.navigation,
                footer: data.footer
            };
        } catch (error) {
            console.error('Error loading footer data:', error);
            throw error;
        }
    }

    renderFooter() {
        const footerElement = document.querySelector('footer') || this.createFooterElement();
        
        if (!footerElement) return;

        const { business, contact, navigation, footer } = this.footerData;

        footerElement.innerHTML = this.getFooterHTML(business, contact, navigation, footer);
        
        // Ensure footer is visible
        footerElement.style.display = 'block';
        
        console.log('Footer rendered successfully');
    }

    createFooterElement() {
        const footer = document.createElement('footer');
        footer.className = 'bg-primary text-white py-12';
        footer.id = 'main-footer';
        
        // Insert before any existing script tags or at the end of body
        const scripts = document.querySelectorAll('script');
        if (scripts.length > 0) {
            document.body.insertBefore(footer, scripts[0]);
        } else {
            document.body.appendChild(footer);
        }
        
        return footer;
    }

    getFooterHTML(business, contact, navigation, footer) {
        const currentYear = new Date().getFullYear();
        const displayYear = footer?.copyright?.year === 'dynamic' || !footer?.copyright?.year ? currentYear : footer.copyright.year;
        
        // Generate navigation links
        const navigationLinks = navigation ? navigation
            .filter(item => !item.optional)
            .map(item => `
                <a href="${item.url}" class="text-gray-300 hover:text-accent transition-colors">${item.section}</a>
            `).join('') : '';

        // Generate social media links
        const socialLinksHtml = footer?.socialLinks ? `
            <div class="footer-social-links">
                ${footer.socialLinks.map(link => `
                    <a href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${link.platform}">
                        <i class="bi ${link.icon}"></i>
                    </a>
                `).join('')}
            </div>
        ` : '';

        return `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <!-- Company Info -->
                    <div>
                        <h3 class="text-xl font-heading font-bold mb-4">${business?.name || 'FTTG AutoTech'}</h3>
                        <p class="text-gray-300 mb-4">${business?.tagline || 'Precision. Passion. Performance.'}</p>
                        <p class="text-gray-400 text-sm">${business?.subtitle || 'Serving Metro Atlanta Since 1980'}</p>
                    </div>
                    
                    <!-- Quick Links -->
                    <div>
                        <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
                        <div class="space-y-2">
                            ${navigationLinks}
                        </div>
                    </div>
                    
                    <!-- Contact Info -->
                    <div>
                        <h4 class="text-lg font-semibold mb-4">Contact Info</h4>
                        <div class="space-y-2 text-gray-300">
                            ${contact ? `
                                <p class="flex items-center mb-2">
                                    <i class="bi bi-telephone mr-2"></i>
                                    <a href="tel:${contact.phone}" class="hover:text-accent transition-colors">${contact.phone}</a>
                                </p>
                                <p class="flex items-center mb-2">
                                    <i class="bi bi-envelope mr-2"></i>
                                    <a href="mailto:${contact.emails.general}" class="hover:text-accent transition-colors">${contact.emails.general}</a>
                                </p>
                                <p class="flex items-center">
                                    <i class="bi bi-geo-alt mr-2"></i>
                                    <span>${contact.serviceArea}</span>
                                </p>
                            ` : ''}
                        </div>
                    </div>
                </div>
                
                <!-- Copyright and Social Links -->
                <div class="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
                    <div class="flex flex-col md:flex-row justify-between items-center mb-4">
                        <p>&copy; ${displayYear} ${business?.name || 'FTTG AutoTech'}. ${footer?.copyright?.text || 'All rights reserved.'}</p>
                        ${footer?.createdBy ? `
                            <p class="mt-2 md:mt-0">
                                <a href="${footer.createdBy.url}" target="_blank" rel="noopener noreferrer" class="text-accent hover:text-orange-400 transition-colors">
                                    ${footer.createdBy.text}
                                </a>
                            </p>
                        ` : ''}
                    </div>
                    ${socialLinksHtml}
                </div>
            </div>
        `;
    }

    renderFallbackFooter() {
        const footerElement = document.querySelector('footer') || this.createFooterElement();
        
        if (!footerElement) return;

        footerElement.innerHTML = `
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 class="text-xl font-heading font-bold mb-4">FTTG AutoTech</h3>
                        <p class="text-gray-300">Precision. Passion. Performance.</p>
                    </div>
                    <div>
                        <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
                        <div class="space-y-2">
                            <a href="#home" class="text-gray-300 hover:text-accent transition-colors">Home</a>
                            <a href="#services" class="text-gray-300 hover:text-accent transition-colors">Services</a>
                            <a href="#about" class="text-gray-300 hover:text-accent transition-colors">About</a>
                            <a href="#contact" class="text-gray-300 hover:text-accent transition-colors">Contact</a>
                        </div>
                    </div>
                    <div>
                        <h4 class="text-lg font-semibold mb-4">Contact Info</h4>
                        <div class="space-y-2 text-gray-300">
                            <p class="flex items-center mb-2">
                                <i class="bi bi-telephone mr-2"></i>
                                <a href="tel:111-222-3333" class="hover:text-accent transition-colors">111-222-3333</a>
                            </p>
                            <p class="flex items-center mb-2">
                                <i class="bi bi-envelope mr-2"></i>
                                <a href="mailto:support@fttgautotech.com" class="hover:text-accent transition-colors">support@fttgautotech.com</a>
                            </p>
                            <p class="flex items-center">
                                <i class="bi bi-geo-alt mr-2"></i>
                                <span>Metro Atlanta</span>
                            </p>
                        </div>
                    </div>
                </div>
                
                <div class="border-t border-gray-600 mt-8 pt-8 text-center text-gray-300">
                    <div class="flex flex-col md:flex-row justify-between items-center mb-4">
                        <p>&copy; ${new Date().getFullYear()} FTTG AutoTech. All rights reserved.</p>
                        <p class="mt-2 md:mt-0">
                            <a href="https://fttgsolutions.com" target="_blank" rel="noopener noreferrer" class="text-accent hover:text-orange-400 transition-colors">
                                Created with <i class='bi bi-heart-fill text-red-500'></i> by FTTG SOLUTIONS
                            </a>
                        </p>
                    </div>
                    <div class="footer-social-links">
                        <a href="https://www.facebook.com/FTTGAutoTech" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <i class="bi bi-facebook"></i>
                        </a>
                        <a href="https://www.instagram.com/fttgautotech" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <i class="bi bi-instagram"></i>
                        </a>
                        <a href="https://www.youtube.com/@fttgautotech" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <i class="bi bi-youtube"></i>
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <i class="bi bi-linkedin"></i>
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <i class="bi bi-twitter"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        console.log('Fallback footer rendered');
    }

    // Method to update footer data dynamically
    updateFooter(newData) {
        this.footerData = { ...this.footerData, ...newData };
        this.renderFooter();
    }

    // Method to force refresh footer
    refresh() {
        this.init();
    }
}

// Auto-initialize footer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.footerComponent = new FooterComponent();
});

// Export for manual initialization if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FooterComponent;
}
