// Services Module - Handles services section animations and interactions
class ServicesModule {
    constructor() {
        this.serviceItems = [];
        this.featureItems = [];
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupHoverEffects();
        this.setupServiceAnimations();
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                }
            });
        }, observerOptions);

        // Observe service items
        const serviceItems = document.querySelectorAll('.service-item');
        serviceItems.forEach(item => observer.observe(item));

        // Observe feature items
        const featureItems = document.querySelectorAll('.feature-item');
        featureItems.forEach(item => observer.observe(item));
    }

    animateElement(element) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }

    setupHoverEffects() {
        document.addEventListener('mouseenter', (e) => {
            if (e.target.closest('.service-item')) {
                this.animateServiceHover(e.target.closest('.service-item'), true);
            }
            if (e.target.closest('.feature-item')) {
                this.animateFeatureHover(e.target.closest('.feature-item'), true);
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target.closest('.service-item')) {
                this.animateServiceHover(e.target.closest('.service-item'), false);
            }
            if (e.target.closest('.feature-item')) {
                this.animateFeatureHover(e.target.closest('.feature-item'), false);
            }
        }, true);
    }

    animateServiceHover(serviceItem, isHover) {
        const icon = serviceItem.querySelector('.service-icon');
        const title = serviceItem.querySelector('.service-title');
        
        if (isHover) {
            serviceItem.style.transform = 'translateY(-8px)';
            serviceItem.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
            
            if (icon) {
                icon.style.transform = 'rotate(360deg) scale(1.1)';
                icon.style.backgroundColor = 'var(--primary-color)';
            }
            
            if (title) {
                title.style.color = 'var(--accent-color)';
            }
        } else {
            serviceItem.style.transform = 'translateY(0)';
            serviceItem.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
                icon.style.backgroundColor = 'var(--accent-color)';
            }
            
            if (title) {
                title.style.color = 'var(--primary-color)';
            }
        }
    }

    animateFeatureHover(featureItem, isHover) {
        const icon = featureItem.querySelector('.feature-icon');
        
        if (isHover) {
            featureItem.style.transform = 'translateY(-4px)';
            featureItem.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
            
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.backgroundColor = 'var(--accent-color)';
                icon.style.color = 'white';
            }
        } else {
            featureItem.style.transform = 'translateY(0)';
            featureItem.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
            
            if (icon) {
                icon.style.transform = 'scale(1)';
                icon.style.backgroundColor = 'rgba(255, 107, 0, 0.1)';
                icon.style.color = 'var(--accent-color)';
            }
        }
    }

    setupServiceAnimations() {
        // Staggered animation for service items
        const animateServices = () => {
            const serviceItems = document.querySelectorAll('.service-item');
            serviceItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('fade-in');
                }, index * 200);
            });
        };

        // Trigger animation when services section comes into view
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateServices();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(servicesSection);
        }
    }

    // Method to dynamically add a new service
    addService(serviceData) {
        const servicesGrid = document.getElementById('services-grid');
        if (!servicesGrid) return;

        const serviceElement = document.createElement('div');
        serviceElement.className = 'service-item';
        serviceElement.innerHTML = `
            <div class="service-icon ${serviceData.icon}"></div>
            <h3 class="service-title">${serviceData.name}</h3>
            <p class="service-description">${serviceData.description || `Professional ${serviceData.name.toLowerCase()} services with certified technicians.`}</p>
        `;

        servicesGrid.appendChild(serviceElement);
        
        // Animate the new service in
        setTimeout(() => {
            this.animateElement(serviceElement);
        }, 100);
    }

    // Method to update service content
    updateServices(servicesData) {
        const servicesGrid = document.getElementById('services-grid');
        const servicesTitle = document.getElementById('services-title');
        
        if (servicesTitle) {
            servicesTitle.textContent = servicesData.title || 'Our Services';
        }

        if (servicesGrid && servicesData.items) {
            servicesGrid.innerHTML = servicesData.items.map(service => `
                <div class="service-item">
                    <div class="service-icon ${service.icon}"></div>
                    <h3 class="service-title">${service.name}</h3>
                    <p class="service-description">Professional ${service.name.toLowerCase()} services with certified technicians.</p>
                </div>
            `).join('');

            // Re-setup observers for new elements
            this.setupIntersectionObserver();
        }
    }

    // Method to highlight a specific service
    highlightService(serviceName) {
        const serviceItems = document.querySelectorAll('.service-item');
        serviceItems.forEach(item => {
            const title = item.querySelector('.service-title');
            if (title && title.textContent.includes(serviceName)) {
                item.style.backgroundColor = 'rgba(255, 107, 0, 0.1)';
                item.style.borderColor = 'var(--accent-color)';
                
                setTimeout(() => {
                    item.style.backgroundColor = '';
                    item.style.borderColor = '';
                }, 3000);
            }
        });
    }

    // Method to filter services
    filterServices(category) {
        const serviceItems = document.querySelectorAll('.service-item');
        serviceItems.forEach(item => {
            const title = item.querySelector('.service-title').textContent.toLowerCase();
            
            if (category === 'all' || title.includes(category.toLowerCase())) {
                item.style.display = 'block';
                item.style.opacity = '1';
            } else {
                item.style.opacity = '0.3';
            }
        });
    }
}

// Initialize services module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.servicesModule = new ServicesModule();
});
