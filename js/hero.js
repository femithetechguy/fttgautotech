// Hero Module - Handles hero section animations and interactions
class HeroModule {
    constructor() {
        this.heroElement = null;
        this.heroTitle = null;
        this.heroSubtitle = null;
        this.heroCTA = null;
        this.init();
    }

    init() {
        this.heroElement = document.querySelector('.hero-section');
        this.heroTitle = document.getElementById('hero-title');
        this.heroSubtitle = document.getElementById('hero-subtitle');
        this.heroCTA = document.getElementById('hero-cta');

        this.setupParallaxEffect();
        this.setupTypewriterEffect();
        this.setupCTAAnimations();
    }

    setupParallaxEffect() {
        if (!this.heroElement) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            if (this.heroElement) {
                this.heroElement.style.transform = `translateY(${parallax}px)`;
            }
        });
    }

    setupTypewriterEffect() {
        if (!this.heroTitle) return;

        // Wait for app data to load first
        const checkForContent = setInterval(() => {
            if (this.heroTitle.textContent && this.heroTitle.textContent !== 'Loading...') {
                clearInterval(checkForContent);
                this.animateTypewriter();
            }
        }, 100);
    }

    animateTypewriter() {
        if (!this.heroTitle) return;

        const text = this.heroTitle.textContent;
        this.heroTitle.textContent = '';
        this.heroTitle.style.opacity = '1';

        let i = 0;
        const typeInterval = setInterval(() => {
            if (i < text.length) {
                this.heroTitle.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typeInterval);
                this.animateSubtitle();
            }
        }, 100);
    }

    animateSubtitle() {
        if (!this.heroSubtitle) return;

        setTimeout(() => {
            this.heroSubtitle.style.opacity = '1';
            this.heroSubtitle.style.transform = 'translateY(0)';
            this.animateCTA();
        }, 300);
    }

    animateCTA() {
        if (!this.heroCTA) return;

        setTimeout(() => {
            this.heroCTA.style.opacity = '1';
            this.heroCTA.style.transform = 'translateY(0)';
        }, 600);
    }

    setupCTAAnimations() {
        // Add hover effects to CTA buttons
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('.hero-btn')) {
                this.animateButton(e.target, 'hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            if (e.target.matches('.hero-btn')) {
                this.animateButton(e.target, 'normal');
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('.hero-btn')) {
                this.animateButton(e.target, 'click');
            }
        });
    }

    animateButton(button, state) {
        switch (state) {
            case 'hover':
                button.style.transform = 'translateY(-3px) scale(1.02)';
                button.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                break;
            case 'normal':
                button.style.transform = 'translateY(0) scale(1)';
                button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                break;
            case 'click':
                button.style.transform = 'translateY(-1px) scale(0.98)';
                setTimeout(() => {
                    button.style.transform = 'translateY(-3px) scale(1.02)';
                }, 150);
                break;
        }
    }

    // Method to update hero content dynamically
    updateHeroContent(title, subtitle, cta) {
        if (this.heroTitle) {
            this.heroTitle.textContent = title;
        }
        if (this.heroSubtitle) {
            this.heroSubtitle.textContent = subtitle;
        }
        if (this.heroCTA && cta) {
            this.heroCTA.innerHTML = cta.map((text, index) => {
                let href = '#booking';
                let buttonClass = index === 0 ? 'hero-btn-primary' : 'hero-btn-secondary';
                let buttonText = text;
                
                // Add icons for each button type
                if (text.toLowerCase().includes('book a service')) {
                    buttonText = `<i class="bi bi-calendar-check mr-2"></i>${text}`;
                } else if (text.toLowerCase().includes('get a free estimate')) {
                    buttonText = `<i class="bi bi-clipboard-check mr-2"></i>${text}`;
                } else if (text.toLowerCase().includes('speak to a technician')) {
                    href = 'tel:111-222-3333'; // Default phone number
                    buttonClass = 'hero-btn-tertiary';
                    buttonText = `<i class="bi bi-telephone mr-2"></i>${text}`;
                }
                
                return `
                    <a href="${href}" class="hero-btn ${buttonClass}">
                        ${buttonText}
                    </a>
                `;
            }).join('');
        }
        
        // Re-run animations
        this.animateTypewriter();
    }

    // Method to add floating elements
    addFloatingElements() {
        if (!this.heroElement) return;

        const floatingElements = [
            { emoji: '🔧', size: '2rem', delay: '0s' },
            { emoji: '⚙️', size: '1.5rem', delay: '2s' },
            { emoji: '🚗', size: '2.5rem', delay: '4s' },
            { emoji: '🛠️', size: '1.8rem', delay: '6s' }
        ];

        floatingElements.forEach((element, index) => {
            const floatingDiv = document.createElement('div');
            floatingDiv.innerHTML = element.emoji;
            floatingDiv.style.cssText = `
                position: absolute;
                font-size: ${element.size};
                opacity: 0.1;
                animation: float 8s ease-in-out infinite;
                animation-delay: ${element.delay};
                top: ${Math.random() * 70 + 10}%;
                left: ${Math.random() * 80 + 10}%;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.heroElement.appendChild(floatingDiv);
        });
    }
}

// Initialize hero module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.heroModule = new HeroModule();
});
