// Simple navigation functionality for template pages
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.contains('hidden');
            
            if (isHidden) {
                mobileMenu.classList.remove('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'true');
                // Prevent body scroll
                document.body.style.overflow = 'hidden';
            } else {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                // Restore body scroll
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
        
        // Close mobile menu when clicking on navigation links
        const mobileNavLinks = mobileMenu.querySelectorAll('a');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });
    
    // Load and display business tagline dynamically
    loadBusinessTagline();
});

// Function to load business tagline from app.json
async function loadBusinessTagline() {
    try {
        const response = await fetch('./json/app.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update any elements that should show the service tagline
        const taglineElements = document.querySelectorAll('[data-business-tagline]');
        taglineElements.forEach(element => {
            const taglineType = element.getAttribute('data-business-tagline');
            
            switch(taglineType) {
                case 'subtitle':
                    element.textContent = data.business?.subtitle || 'Serving Metro Atlanta Since 1980';
                    break;
                case 'serviceTagline':
                    element.textContent = data.business?.serviceTagline || 'Serving Metro Atlanta Since 1980';
                    break;
                case 'serviceArea':
                    element.textContent = data.serviceArea?.description || 'We proudly serve the entire Metro Atlanta area';
                    break;
                default:
                    element.textContent = data.business?.serviceTagline || 'Serving Metro Atlanta Since 1980';
            }
        });
        
        console.log('Business tagline loaded successfully');
    } catch (error) {
        console.error('Failed to load business tagline:', error);
        // Fallback to default text if loading fails
        const taglineElements = document.querySelectorAll('[data-business-tagline]');
        taglineElements.forEach(element => {
            if (!element.textContent || element.textContent === 'Loading...') {
                element.textContent = 'Serving Metro Atlanta Since 1980';
            }
        });
    }
}
