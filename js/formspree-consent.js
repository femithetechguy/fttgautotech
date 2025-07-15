/**
 * Formspree Integration Script for FTTG AutoTech Consent Form
 * Handles form submission, validation, and user feedback
 */

class FormspreeConsentHandler {
    constructor() {
        this.form = null;
        this.submitBtn = null;
        this.isSubmitting = false;
        this.init();
    }

    // Initialize the handler
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupElements();
            this.setupEventListeners();
            this.setHiddenFields();
            this.checkForSuccessRedirect();
        });
    }

    // Setup DOM elements
    setupElements() {
        this.form = document.getElementById('communication-consent-form');
        this.submitBtn = document.getElementById('consent-submit-btn');
        
        if (!this.form || !this.submitBtn) {
            console.warn('Consent form elements not found');
            return;
        }
    }

    // Setup event listeners
    setupEventListeners() {
        if (!this.form || !this.submitBtn) {
            console.error('Form elements not found!', {
                form: this.form,
                submitBtn: this.submitBtn
            });
            return;
        }

        console.log('Setting up form event listeners...');

        // Form submission handler
        this.form.addEventListener('submit', (e) => {
            console.log('Form submit event triggered');
            this.handleFormSubmit(e);
        });
        
        // Form error handler
        this.form.addEventListener('error', (e) => {
            console.log('Form error event triggered');
            this.handleFormError(e);
        });
        
        // Phone number formatting
        this.setupPhoneFormatting();
        
        console.log('Event listeners set up successfully');
    }

    // Set hidden field values
    setHiddenFields() {
        const submissionDateField = document.getElementById('submission-date');
        const pageUrlField = document.getElementById('page-url');
        const redirectUrlField = document.getElementById('redirect-url');
        
        if (submissionDateField) {
            submissionDateField.value = new Date().toISOString();
        }
        
        if (pageUrlField) {
            pageUrlField.value = window.location.href;
        }
        
        if (redirectUrlField) {
            // Set redirect URL to current page with success parameter
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('success', 'true');
            redirectUrlField.value = currentUrl.toString();
        }
    }

    // Check for success parameter in URL
    checkForSuccessRedirect() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            this.showSuccessMessage();
        } else if (urlParams.get('error') === 'true') {
            this.showErrorMessage('There was an error processing your submission. Please try again.');
        }
    }

    // Handle form submission
    handleFormSubmit(e) {
        console.log('Form submission handler called', {
            isSubmitting: this.isSubmitting,
            event: e
        });

        if (this.isSubmitting) {
            console.log('Already submitting, preventing duplicate submission');
            e.preventDefault();
            return;
        }

        // Validate form before submission
        if (!this.validateForm()) {
            console.log('Form validation failed, preventing submission');
            e.preventDefault();
            return;
        }

        console.log('Form is valid, proceeding with submission...');
        this.isSubmitting = true;
        this.setSubmittingState();
        this.saveToLocalStorage();
        this.addTrackingData();
        
        // Track form submission
        this.trackEvent('consent_form_submit');
        
        console.log('Form data prepared, allowing natural submission to Formspree');
        
        // Set a timeout to reset button state if redirect doesn't happen
        setTimeout(() => {
            if (this.isSubmitting) {
                console.warn('Form submission timeout - resetting button state');
                this.resetButtonState();
                this.showErrorMessage('Form submission is taking longer than expected. Please check your internet connection and try again.');
            }
        }, 10000); // 10 second timeout
        
        // Allow the natural form submission to proceed to Formspree
        // DO NOT call e.preventDefault() here - let the form submit naturally
        console.log('Natural form submission will now proceed...');
    }

    // Validate form data
    validateForm() {
        console.log('Validating form...');
        const consentChoice = this.form.querySelector('input[name="consentChoice"]:checked');
        
        if (!consentChoice) {
            console.log('Validation failed: No consent choice selected');
            this.showErrorMessage('Please select your consent choice.');
            return false;
        }

        console.log('Consent choice:', consentChoice.value);

        // Optional: Validate email format if provided
        const emailField = this.form.querySelector('input[name="email"]');
        if (emailField && emailField.value && !this.isValidEmail(emailField.value)) {
            console.log('Validation failed: Invalid email format');
            this.showErrorMessage('Please enter a valid email address.');
            return false;
        }

        console.log('Form validation passed');
        return true;
    }

    // Email validation helper
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Set submitting state
    setSubmittingState() {
        if (!this.submitBtn) return;

        this.submitBtn.innerHTML = '<i class="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto"></i> Saving...';
        this.submitBtn.disabled = true;
        this.submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
    }

    // Reset button state
    resetButtonState() {
        if (!this.submitBtn) return;

        this.submitBtn.innerHTML = '💾 Save My Choice';
        this.submitBtn.disabled = false;
        this.submitBtn.classList.remove('opacity-75', 'cursor-not-allowed');
        this.isSubmitting = false;
    }

    // Save form data to localStorage as backup
    saveToLocalStorage() {
        try {
            const formData = new FormData(this.form);
            const consentData = {
                consentChoice: formData.get('consentChoice'),
                fullName: formData.get('fullName') || '',
                phoneNumber: formData.get('phoneNumber') || '',
                email: formData.get('email') || '',
                timestamp: new Date().toISOString(),
                submittedVia: 'Formspree',
                pageUrl: window.location.href
            };
            
            localStorage.setItem('fttg_communication_consent', JSON.stringify(consentData));
            console.log('Consent data saved to localStorage');
        } catch (error) {
            console.warn('Failed to save to localStorage:', error);
        }
    }

    // Add tracking and metadata
    addTrackingData() {
        if (!this.form) return;

        // Add user agent
        const hiddenUserAgent = document.createElement('input');
        hiddenUserAgent.type = 'hidden';
        hiddenUserAgent.name = 'userAgent';
        hiddenUserAgent.value = navigator.userAgent;
        this.form.appendChild(hiddenUserAgent);

        // Add referrer
        const hiddenReferrer = document.createElement('input');
        hiddenReferrer.type = 'hidden';
        hiddenReferrer.name = 'referrer';
        hiddenReferrer.value = document.referrer || 'Direct';
        this.form.appendChild(hiddenReferrer);

        // Add screen resolution
        const hiddenResolution = document.createElement('input');
        hiddenResolution.type = 'hidden';
        hiddenResolution.name = 'screenResolution';
        hiddenResolution.value = `${screen.width}x${screen.height}`;
        this.form.appendChild(hiddenResolution);

        // Add timezone
        const hiddenTimezone = document.createElement('input');
        hiddenTimezone.type = 'hidden';
        hiddenTimezone.name = 'timezone';
        hiddenTimezone.value = Intl.DateTimeFormat().resolvedOptions().timeZone;
        this.form.appendChild(hiddenTimezone);
    }

    // Handle form submission errors
    handleFormError(e) {
        console.error('Form submission error:', e);
        this.resetButtonState();
        this.showErrorMessage('There was an error submitting your form. Please try again.');
    }

    // Show success message
    showSuccessMessage() {
        const successModal = document.getElementById('success-modal');
        if (successModal) {
            successModal.classList.remove('hidden');
            // Update success message for Formspree
            const successText = successModal.querySelector('p');
            if (successText) {
                successText.textContent = 'Your communication consent choice has been successfully saved via Formspree. You will receive a confirmation email shortly.';
            }
        } else {
            this.createInlineSuccessMessage();
        }

        // Track success event
        this.trackEvent('consent_form_success');
    }

    // Show error message
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 max-w-md';
        errorDiv.innerHTML = `
            <div class="flex items-start">
                <i class="bi bi-exclamation-triangle-fill text-xl mr-3 mt-1"></i>
                <div class="flex-1">
                    <h4 class="font-bold">Submission Failed</h4>
                    <p class="text-sm mt-1">${message}</p>
                    <p class="text-xs mt-2 opacity-75">You can try again or contact us directly at (855) 578-4334</p>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200 text-xl">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);

        // Auto remove after 8 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 8000);

        // Track error event
        this.trackEvent('consent_form_error', { error: message });
    }

    // Create inline success message
    createInlineSuccessMessage() {
        const form = this.form;
        if (!form) return;

        const successDiv = document.createElement('div');
        successDiv.className = 'bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center shadow-xl';
        successDiv.innerHTML = `
            <div class="mb-6">
                <i class="bi bi-check-circle-fill text-6xl text-green-500"></i>
            </div>
            <h3 class="text-2xl font-bold text-green-800 mb-4">Choice Saved Successfully!</h3>
            <p class="text-green-700 mb-4">Your communication consent has been saved via Formspree.</p>
            <p class="text-green-600 text-sm mb-6">You will receive a confirmation email shortly at the address provided.</p>
            <div class="space-y-3">
                <button onclick="window.location.href='index.html'" class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition duration-300 font-semibold">
                    Return to Home
                </button>
                <button onclick="window.location.reload()" class="block mx-auto text-green-700 hover:text-green-800 text-sm">
                    Submit Another Response
                </button>
            </div>
        `;

        form.style.display = 'none';
        form.parentNode.insertBefore(successDiv, form);
    }

    // Setup phone number formatting
    setupPhoneFormatting() {
        const phoneInput = document.getElementById('phone-number');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', (e) => {
            const value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';

            if (value.length >= 6) {
                formattedValue = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
            } else if (value.length >= 3) {
                formattedValue = `(${value.slice(0, 3)}) ${value.slice(3)}`;
            } else {
                formattedValue = value;
            }

            e.target.value = formattedValue;
        });

        // Add visual feedback for phone input
        phoneInput.addEventListener('focus', () => {
            if (!phoneInput.value) {
                phoneInput.placeholder = '(___) ___-____';
            }
        });

        phoneInput.addEventListener('blur', () => {
            phoneInput.placeholder = '(555) 123-4567';
        });
    }

    // Track events (Google Analytics, Facebook Pixel, etc.)
    trackEvent(eventName, data = {}) {
        try {
            // Google Analytics 4
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, {
                    event_category: 'consent_form',
                    ...data
                });
            }

            // Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('track', eventName === 'consent_form_success' ? 'Lead' : 'CustomEvent', {
                    content_name: 'Communication Consent Form',
                    ...data
                });
            }

            // Custom analytics
            console.log('Event tracked:', eventName, data);
        } catch (error) {
            console.warn('Analytics tracking failed:', error);
        }
    }

    // Get saved consent data from localStorage
    getSavedConsent() {
        try {
            const saved = localStorage.getItem('fttg_communication_consent');
            return saved ? JSON.parse(saved) : null;
        } catch (error) {
            console.warn('Failed to retrieve saved consent:', error);
            return null;
        }
    }

    // Check if user has previously submitted consent
    hasPreviousConsent() {
        const saved = this.getSavedConsent();
        return saved && saved.timestamp;
    }

    // Show previous consent information
    showPreviousConsentInfo() {
        const saved = this.getSavedConsent();
        if (!saved) return;

        const infoDiv = document.createElement('div');
        infoDiv.className = 'bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6';
        infoDiv.innerHTML = `
            <div class="flex items-center">
                <i class="bi bi-info-circle-fill text-blue-500 text-lg mr-3"></i>
                <div>
                    <p class="text-blue-800 font-medium">Previous Consent Found</p>
                    <p class="text-blue-600 text-sm">
                        You previously ${saved.consentChoice === 'consent' ? 'consented to' : 'opted out of'} 
                        SMS communications on ${new Date(saved.timestamp).toLocaleDateString()}.
                    </p>
                </div>
            </div>
        `;

        const form = this.form;
        if (form) {
            form.parentNode.insertBefore(infoDiv, form);
        }
    }
}

// Global functions for modal control
window.closeSuccessModal = function() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
};

// Initialize the Formspree handler
const formspreeHandler = new FormspreeConsentHandler();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FormspreeConsentHandler;
}
