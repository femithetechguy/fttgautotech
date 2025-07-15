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

    a    /**
     * Check if a feature is available
     * @param {string} feature - Feature name (sms, voice)
     * @returns {boolean} Whether feature is available
     */
    isFeatureAvailable(feature) {
        return this.isEnabled && this.config.features[feature]?.enabled;
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
}() {
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

        try {
            const response = await fetch('/api/twilio/sms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: this.formatPhoneNumber(options.to),
                    message: options.message,
                    type: options.type || 'general'
                })
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('✅ SMS sent successfully:', result.sid);
                this.trackCommunication('sms', 'sent', options.type);
                return result;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('❌ Failed to send SMS:', error);
            this.trackCommunication('sms', 'failed', options.type);
            return false;
        }
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

        try {
            const response = await fetch('/api/twilio/call', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: this.formatPhoneNumber(options.to),
                    type: options.type || 'general'
                })
            });

            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Call initiated successfully:', result.sid);
                this.trackCommunication('voice', 'initiated', options.type);
                return result;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('❌ Failed to initiate call:', error);
            this.trackCommunication('voice', 'failed', options.type);
            return false;
        }
    }

    /**
     * Handle form submission with communication
     * @param {Object} formData - Form submission data
     */
    async handleFormSubmission(formData) {
        const { formType, data } = formData;

        if (formType === 'booking' && data.phone) {
            // Send appointment confirmation SMS
            const message = this.generateMessage('appointmentConfirmation', {
                customerName: data.name,
                service: data.service,
                date: data.preferredDate || 'TBD',
                time: data.preferredTime || 'TBD'
            });

            await this.sendSMS({
                to: data.phone,
                message: message,
                type: 'appointment_confirmation'
            });

            // Send notification to business
            if (this.config.features.sms.enabled) {
                const businessMessage = `🚗 New appointment request from ${data.name} (${data.phone}) for ${data.service}. Check your dashboard for details.`;
                
                await this.sendSMS({
                    to: this.config.phoneNumbers.business,
                    message: businessMessage,
                    type: 'business_notification'
                });
            }
        }

        if (formType === 'contact' && data.phone && data.urgent) {
            // Send urgent contact notification
            const businessMessage = `🚨 URGENT: Contact request from ${data.name} (${data.phone}): ${data.message}`;
            
            await this.sendSMS({
                to: this.config.phoneNumbers.business,
                message: businessMessage,
                type: 'urgent_contact'
            });
        }
    }

    /**
     * Handle emergency call initiation
     */
    async initiateEmergencyCall() {
        // Show confirmation dialog
        const confirmed = confirm('Initiate emergency call to FTTG AutoTech? This will connect you directly to our emergency line.');
        
        if (confirmed) {
            // Log the emergency call attempt
            this.trackCommunication('voice', 'emergency', 'user_initiated');
            
            // Use direct tel: link for immediate call
            window.location.href = `tel:${this.config.phoneNumbers.emergency}`;
            
            // Also log with backend for tracking
            try {
                await fetch('/api/emergency-call-log', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent,
                        page: window.location.href
                    })
                });
            } catch (error) {
                console.error('Failed to log emergency call:', error);
            }
        }
    }

    /**
     * Handle SMS opt-in preference
     * @param {boolean} optedIn - Whether user opted in
     */
    handleSmsOptIn(optedIn) {
        localStorage.setItem('sms_opt_in', optedIn.toString());
        
        if (optedIn) {
            console.log('✅ User opted in to SMS notifications');
            this.showNotification('You will receive SMS updates about your service appointments.', 'success');
        } else {
            console.log('ℹ️ User opted out of SMS notifications');
            this.showNotification('SMS notifications disabled. You can re-enable them anytime.', 'info');
        }

        // Track the preference
        this.trackCommunication('sms', optedIn ? 'opted_in' : 'opted_out', 'user_preference');
    }

    /**
     * Generate message from template
     * @param {string} templateName - Template name
     * @param {Object} variables - Variables to replace
     * @returns {string} Generated message
     */
    generateMessage(templateName, variables = {}) {
        const templates = {
            appointmentConfirmation: "Hi {customerName}! Your appointment with FTTG AutoTech is confirmed for {date} at {time}. Service: {service}. Reply STOP to opt out.",
            appointmentReminder: "Reminder: Your FTTG AutoTech appointment is tomorrow at {time}. Service: {service}. Questions? Call {businessPhone}",
            welcomeMessage: "Welcome to FTTG AutoTech! We've received your service request and will contact you within 24 hours. Save this number for updates!"
        };

        let message = templates[templateName] || '';
        
        // Replace variables
        Object.keys(variables).forEach(key => {
            const placeholder = `{${key}}`;
            message = message.replace(new RegExp(placeholder, 'g'), variables[key]);
        });

        // Replace business phone placeholder
        message = message.replace(/{businessPhone}/g, this.config.phoneNumbers.business);

        return message;
    }

    /**
     * Format phone number for Twilio
     * @param {string} phone - Phone number
     * @returns {string} Formatted phone number
     */
    formatPhoneNumber(phone) {
        // Remove all non-digits
        const digits = phone.replace(/\D/g, '');
        
        // Add +1 if US number without country code
        if (digits.length === 10) {
            return `+1${digits}`;
        }
        
        // Add + if not present
        if (!phone.startsWith('+')) {
            return `+${digits}`;
        }
        
        return phone;
    }

    /**
     * Track communication events
     * @param {string} type - Communication type (sms, voice)
     * @param {string} action - Action taken
     * @param {string} category - Event category
     */
    trackCommunication(type, action, category) {
        // Track with analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', `${type}_${action}`, {
                event_category: 'communication',
                event_label: category,
                value: 1
            });
        }

        // Log locally for debugging
        console.log(`📊 Communication tracked: ${type} ${action} - ${category}`);
    }

    /**
     * Show user notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;

        // Add to DOM
        document.body.appendChild(notification);

        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Get user's SMS opt-in preference
     * @returns {boolean} Whether user has opted in
     */
    getSmsOptInPreference() {
        return localStorage.getItem('sms_opt_in') === 'true';
    }

    /**
     * Check if communication feature is available
     * @param {string} feature - Feature to check (sms, voice)
     * @returns {boolean} Whether feature is available
     */
    isFeatureAvailable(feature) {
        return this.isEnabled && this.config.features[feature]?.enabled;
    }
}

// Initialize the service
const twilioService = new TwilioCommunicationService();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TwilioCommunicationService;
}

// Add CSS for notifications
const notificationStyles = `
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
        align-items: center;
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
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
