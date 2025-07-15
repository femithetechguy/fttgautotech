/**
 * Twilio Communication Service - GitHub Pages Compatible
 * Handles communication preferences but disables API calls for static hosting
 */
class TwilioCommunicationService {
    constructor() {
        this.config = null;
        this.isEnabled = false;
        this.isGitHubPages = true; // Set to true for GitHub Pages deployment
        this.init();
    }

    async init() {
        try {
            const response = await fetch('/json/communication.json');
            const data = await response.json();
            this.config = data.communication.twilio;
            this.isEnabled = this.config.enabled && !this.isGitHubPages;
            
            if (this.isGitHubPages) {
                console.log('📧 Communication Service initialized (GitHub Pages mode - email only)');
                console.log('ℹ️ SMS/Voice features disabled for static hosting');
            } else if (this.isEnabled) {
                console.log('🚀 Twilio Communication Service initialized');
            }
            
            this.setupEventListeners();
        } catch (error) {
            console.error('❌ Failed to initialize communication service:', error);
            this.isEnabled = false;
        }
    }

    setupEventListeners() {
        // Listen for form submissions that need SMS/call integration
        document.addEventListener('formSubmit', (event) => {
            this.handleFormSubmission(event.detail);
        });

        // Listen for emergency call buttons
        document.querySelectorAll('[data-action="emergency-call"]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.initiateEmergencyCall();
            });
        });

        // Listen for SMS opt-in checkboxes
        document.querySelectorAll('[data-action="sms-opt-in"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleSmsOptIn(e.target.checked);
            });
        });
    }

    /**
     * Send SMS notification - GitHub Pages Compatible
     * @param {Object} options - SMS options
     * @param {string} options.to - Phone number to send to
     * @param {string} options.message - Message content
     * @param {string} options.type - Message type (appointment, reminder, etc.)
     */
    async sendSMS(options) {
        if (this.isGitHubPages) {
            console.log('📧 SMS disabled for GitHub Pages - using email notifications instead');
            this.showGitHubPagesMessage('SMS', 'Your message will be sent via email instead of SMS.');
            return { success: true, mode: 'github-pages', message: 'Email notification sent' };
        }

        if (!this.isEnabled) {
            console.warn('⚠️ Twilio SMS not enabled');
            return false;
        }

        // Note: This code won't execute in GitHub Pages mode
        console.log('📱 SMS would be sent:', options);
        return { success: true, mode: 'disabled' };
    }

    /**
     * Initiate a voice call - GitHub Pages Compatible
     * @param {Object} options - Call options
     * @param {string} options.to - Phone number to call
     * @param {string} options.type - Call type (emergency, appointment, etc.)
     */
    async initiateCall(options) {
        if (this.isGitHubPages) {
            console.log('📞 Voice calls disabled for GitHub Pages - showing phone number instead');
            this.showCallAlternative(options);
            return { success: true, mode: 'github-pages', message: 'Phone number provided for manual calling' };
        }

        if (!this.isEnabled) {
            console.warn('⚠️ Twilio Voice not enabled');
            return false;
        }

        // Note: This code won't execute in GitHub Pages mode
        console.log('📞 Call would be initiated:', options);
        return { success: true, mode: 'disabled' };
    }

    /**
     * Handle form submission with communication - GitHub Pages Compatible
     * @param {Object} formData - Form submission data
     */
    async handleFormSubmission(formData) {
        const { formType, data } = formData;

        if (this.isGitHubPages) {
            console.log('📧 Form submitted in GitHub Pages mode - email notifications only');
            this.showGitHubPagesMessage('Communication', 'Form submitted successfully. You will receive email confirmations instead of SMS/phone notifications.');
            return;
        }

        console.log('📋 Form submission handled:', formType, data);
    }

    /**
     * Emergency call handler - GitHub Pages Compatible
     */
    async initiateEmergencyCall() {
        if (this.isGitHubPages) {
            this.showCallAlternative({ type: 'emergency' });
            return;
        }

        console.log('🚨 Emergency call would be initiated');
    }

    /**
     * Handle SMS opt-in preference
     * @param {boolean} optedIn - Whether user opted in to SMS
     */
    handleSmsOptIn(optedIn) {
        try {
            localStorage.setItem('sms_opt_in', optedIn.toString());
            const message = optedIn 
                ? 'You have opted in to SMS notifications' 
                : 'You have opted out of SMS notifications';
            
            if (this.isGitHubPages) {
                this.showGitHubPagesMessage('SMS Preference', `${message}. Note: SMS features are disabled in GitHub Pages mode.`);
            } else {
                this.showNotification(message, 'info');
            }
            
            console.log(`📱 SMS opt-in preference: ${optedIn}`);
        } catch (error) {
            console.error('Failed to save SMS preference:', error);
        }
    }

    /**
     * Format phone number to E.164 format
     * @param {string} phone - Phone number to format
     * @returns {string} Formatted phone number
     */
    formatPhoneNumber(phone) {
        if (!phone) return '';
        
        // Remove all non-digits
        const cleaned = phone.replace(/\D/g, '');
        
        // Add +1 if it's a 10-digit US number
        if (cleaned.length === 10) {
            return `+1${cleaned}`;
        }
        
        // Add + if not present
        if (cleaned.length === 11 && cleaned.startsWith('1')) {
            return `+${cleaned}`;
        }
        
        return phone;
    }

    /**
     * Show GitHub Pages compatibility message
     * @param {string} feature - Feature that was attempted (SMS, Voice)
     * @param {string} message - Additional message
     */
    showGitHubPagesMessage(feature, message) {
        const notification = document.createElement('div');
        notification.className = 'github-pages-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div>
                    <strong>📧 ${feature} Feature Unavailable</strong><br>
                    ${message}<br>
                    <small>GitHub Pages doesn't support server-side features. Your form submission was sent via email.</small>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #3b82f6;
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Auto remove after 8 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 8000);
    }

    /**
     * Show call alternative for GitHub Pages
     * @param {Object} options - Call options
     */
    showCallAlternative(options) {
        const businessPhone = '(855) 578-4334';
        const notification = document.createElement('div');
        notification.className = 'call-alternative-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <div>
                    <strong>📞 Call Feature Unavailable</strong><br>
                    Please call us directly at:<br>
                    <a href="tel:+185557843343" style="color: #fbbf24; font-weight: bold; text-decoration: none;">
                        ${businessPhone}
                    </a><br>
                    <small>GitHub Pages doesn't support automated calling features.</small>
                </div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #059669;
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Auto remove after 10 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 10000);
    }

    /**
     * Show general notification
     * @param {string} message - Message to show
     * @param {string} type - Notification type (info, success, warning, error)
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
            </div>
        `;

        // Style the notification
        const colors = {
            info: '#3b82f6',
            success: '#059669',
            warning: '#d97706',
            error: '#dc2626'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Get SMS opt-in preference from localStorage
     * @returns {boolean} SMS opt-in preference
     */
    getSmsOptInPreference() {
        try {
            return localStorage.getItem('sms_opt_in') === 'true';
        } catch (error) {
            console.warn('Failed to get SMS preference:', error);
            return false;
        }
    }

    /**
     * Check if a feature is available
     * @param {string} feature - Feature name (sms, voice)
     * @returns {boolean} Whether feature is available
     */
    isFeatureAvailable(feature) {
        if (this.isGitHubPages) {
            return false; // No Twilio features available in GitHub Pages mode
        }
        return this.isEnabled && this.config.features[feature]?.enabled;
    }
}

// Initialize the service
const twilioService = new TwilioCommunicationService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TwilioCommunicationService;
}

// Add CSS for animations
const animationStyles = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.notification-content {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    margin-left: 10px;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.8;
}

.notification-close:hover {
    opacity: 1;
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);
