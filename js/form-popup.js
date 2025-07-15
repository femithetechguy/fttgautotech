// Form Confirmation Popup System
class FormConfirmationPopup {
    constructor() {
        this.overlay = null;
        this.popup = null;
        this.currentFormData = null;
        this.currentForm = null;
        this.formEndpoint = null;
        this.isSubmitting = false;
        this.appData = null;
        this.init();
    }

    async init() {
        await this.loadAppData();
        this.createPopupHTML();
        this.attachEventListeners();
        this.interceptFormSubmissions();
    }

    async loadAppData() {
        try {
            const response = await fetch('./json/app.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.appData = await response.json();
            console.log('Form popup: App data loaded successfully');
        } catch (error) {
            console.error('Form popup: Error loading app data:', error);
            // Fallback to default text if JSON loading fails
            this.appData = this.getDefaultConfig();
        }
    }

    getDefaultConfig() {
        return {
            formPopup: {
                titles: {
                    review: "Review Your Submission",
                    success: "Submission Successful!",
                    error: "Submission Failed"
                },
                messages: {
                    review: {
                        serviceBooking: "Service Booking Details",
                        contactForm: "Contact Form Details",
                        general: "Form Submission Details"
                    },
                    success: {
                        title: "Thank You!",
                        serviceBooking: "Your service booking has been submitted successfully. We'll get back to you as soon as possible.",
                        contactForm: "Your message has been submitted successfully. We'll get back to you as soon as possible.",
                        general: "Your form has been submitted successfully. We'll get back to you as soon as possible."
                    },
                    error: {
                        title: "Submission Failed",
                        message: "We're sorry, but there was an error submitting your form. Please try again or contact us directly.",
                        contactInfo: "Please try again or call us at"
                    },
                    loading: {
                        serviceBooking: "Submitting your service booking...",
                        contactForm: "Submitting your message...",
                        general: "Submitting your form..."
                    }
                },
                buttons: {
                    update: "Update",
                    confirm: "Confirm & Submit",
                    close: "Close",
                    goBack: "Go Back",
                    tryAgain: "Try Again"
                },
                nextSteps: {
                    title: "What's Next?",
                    steps: [
                        "We'll review your submission within 24 hours",
                        "You'll receive a confirmation email shortly",
                        "Our team will contact you to discuss next steps"
                    ]
                },
                fieldLabels: {
                    "name": "Full Name",
                    "phone": "Phone Number",
                    "email": "Email Address",
                    "car-make-model": "Car Make & Model",
                    "car-make": "Car Make",
                    "car-model": "Car Model",
                    "car-year": "Car Year",
                    "service-needed": "Service Needed",
                    "preferred-date": "Preferred Date",
                    "preferred-time": "Preferred Time",
                    "message": "Message",
                    "subject": "Subject"
                }
            },
            contact: {
                phone: "111-222-3333"
            }
        };
    }

    createPopupHTML() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'form-popup-overlay';
        const popupConfig = this.appData?.formPopup || this.getDefaultConfig().formPopup;
        
        this.overlay.innerHTML = `
            <div class="form-popup">
                <div class="form-popup-header">
                    <h2 class="form-popup-title">${popupConfig.titles.review}</h2>
                    <button class="form-popup-close" type="button">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
                <div class="form-popup-body">
                    <div class="form-review-content">
                        <!-- Form review content will be inserted here -->
                    </div>
                </div>
                <div class="form-popup-actions">
                    <button class="form-popup-btn form-popup-btn-update" type="button">
                        <i class="bi bi-pencil"></i>
                        ${popupConfig.buttons.update}
                    </button>
                    <button class="form-popup-btn form-popup-btn-confirm" type="button">
                        <i class="bi bi-check-circle"></i>
                        ${popupConfig.buttons.confirm}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);
        this.popup = this.overlay.querySelector('.form-popup');
    }

    attachEventListeners() {
        // Close button
        const closeBtn = this.overlay.querySelector('.form-popup-close');
        closeBtn.addEventListener('click', () => this.hidePopup());

        // Update button
        const updateBtn = this.overlay.querySelector('.form-popup-btn-update');
        updateBtn.addEventListener('click', () => this.returnToFormWithValues());

        // Confirm button
        const confirmBtn = this.overlay.querySelector('.form-popup-btn-confirm');
        confirmBtn.addEventListener('click', () => this.confirmSubmission());

        // Close on overlay click
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.hidePopup();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.hidePopup();
            }
        });
    }

    interceptFormSubmissions() {
        // Intercept all form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            
            // Check if this is a form we should intercept
            if (this.shouldInterceptForm(form)) {
                e.preventDefault();
                this.handleFormSubmission(form);
            }
        });
    }

    shouldInterceptForm(form) {
        // Check if form has Formspree action or specific classes
        const action = form.getAttribute('action');
        return action && (
            action.includes('formspree.io') ||
            form.classList.contains('booking-form') ||
            form.closest('#contact') ||
            form.closest('#booking')
        );
    }

    async handleFormSubmission(form) {
        this.currentForm = form;
        this.formEndpoint = form.getAttribute('action');
        
        // Collect form data
        this.currentFormData = this.collectFormData(form);
        
        // Show review popup
        this.showReviewPopup();
    }

    collectFormData(form) {
        const formData = new FormData(form);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        return data;
    }

    showReviewPopup() {
        const reviewContent = this.overlay.querySelector('.form-review-content');
        reviewContent.innerHTML = this.generateReviewHTML();
        
        this.overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    generateReviewHTML() {
        const formType = this.determineFormType();
        const popupConfig = this.appData?.formPopup || this.getDefaultConfig().formPopup;
        
        let sectionTitle;
        switch (formType) {
            case 'Service Booking':
                sectionTitle = popupConfig.messages.review.serviceBooking;
                break;
            case 'Contact Form':
                sectionTitle = popupConfig.messages.review.contactForm;
                break;
            default:
                sectionTitle = popupConfig.messages.review.general;
        }
        
        let html = `<div class="form-review-section">
            <h3>${sectionTitle}</h3>`;

        // Generate review items based on form data
        for (const [key, value] of Object.entries(this.currentFormData)) {
            if (key === 'form_type') continue; // Skip hidden fields
            
            const label = this.formatFieldLabel(key);
            const displayValue = this.formatFieldValue(key, value);
            
            if (displayValue) {
                html += `
                    <div class="form-review-item">
                        <span class="form-review-label">${label}:</span>
                        <span class="form-review-value">${displayValue}</span>
                    </div>
                `;
            }
        }

        html += '</div>';
        return html;
    }

    determineFormType() {
        if (this.currentFormData.form_type === 'booking' || this.currentForm.classList.contains('booking-form')) {
            return 'Service Booking';
        } else if (this.currentFormData.form_type === 'contact' || this.currentForm.closest('#contact')) {
            return 'Contact Form';
        }
        return 'Form Submission';
    }

    formatFieldLabel(key) {
        const popupConfig = this.appData?.formPopup || this.getDefaultConfig().formPopup;
        const labelMap = popupConfig.fieldLabels;
        
        return labelMap[key] || key.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    formatFieldValue(key, value) {
        if (!value || value.trim() === '') return '';
        
        // Format specific fields
        switch (key) {
            case 'phone':
                return this.formatPhoneNumber(value);
            case 'email':
                return value.toLowerCase();
            case 'service-needed':
                return value.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
            default:
                return value;
        }
    }

    formatPhoneNumber(phone) {
        // Simple phone number formatting
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
        }
        return phone;
    }

    async confirmSubmission() {
        if (this.isSubmitting) return;
        
        this.isSubmitting = true;
        this.showLoadingState();
        
        try {
            const response = await this.submitToFormspree();
            
            if (response.ok) {
                this.showSuccessMessage();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage(error);
        } finally {
            this.isSubmitting = false;
        }
    }

    async submitToFormspree() {
        const formData = new FormData();
        
        // Add all form data
        for (const [key, value] of Object.entries(this.currentFormData)) {
            formData.append(key, value);
        }
        
        return fetch(this.formEndpoint, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });
    }

    showLoadingState() {
        const popupBody = this.overlay.querySelector('.form-popup-body');
        const popupActions = this.overlay.querySelector('.form-popup-actions');
        const popupConfig = this.appData?.formPopup || this.getDefaultConfig().formPopup;
        
        const formType = this.determineFormType();
        let loadingMessage;
        
        switch (formType) {
            case 'Service Booking':
                loadingMessage = popupConfig.messages.loading.serviceBooking;
                break;
            case 'Contact Form':
                loadingMessage = popupConfig.messages.loading.contactForm;
                break;
            default:
                loadingMessage = popupConfig.messages.loading.general;
        }
        
        popupBody.innerHTML = `
            <div class="form-popup-loading">
                <div class="form-popup-spinner"></div>
                <p>${loadingMessage}</p>
            </div>
        `;
        
        popupActions.style.display = 'none';
    }

    showSuccessMessage() {
        const formType = this.determineFormType();
        const popupConfig = this.appData?.formPopup || this.getDefaultConfig().formPopup;
        const popupHeader = this.overlay.querySelector('.form-popup-header');
        const popupBody = this.overlay.querySelector('.form-popup-body');
        const popupActions = this.overlay.querySelector('.form-popup-actions');
        
        // Update header
        popupHeader.querySelector('.form-popup-title').textContent = popupConfig.titles.success;
        
        // Get success message based on form type
        let successMessage;
        switch (formType) {
            case 'Service Booking':
                successMessage = popupConfig.messages.success.serviceBooking;
                break;
            case 'Contact Form':
                successMessage = popupConfig.messages.success.contactForm;
                break;
            default:
                successMessage = popupConfig.messages.success.general;
        }
        
        // Generate next steps HTML
        const nextStepsHtml = popupConfig.nextSteps.steps.map(step => `<p>• ${step}</p>`).join('');
        
        // Show success content
        popupBody.innerHTML = `
            <div class="form-success-content">
                <div class="form-success-icon">
                    <i class="bi bi-check-circle-fill"></i>
                </div>
                <h3 class="form-success-title">${popupConfig.messages.success.title}</h3>
                <p class="form-success-message">
                    ${successMessage}
                </p>
                <div class="form-success-details">
                    <p><strong>${popupConfig.nextSteps.title}</strong></p>
                    ${nextStepsHtml}
                </div>
            </div>
        `;
        
        // Update actions
        popupActions.innerHTML = `
            <button class="form-popup-btn form-popup-btn-close" type="button">
                <i class="bi bi-x-circle"></i>
                ${popupConfig.buttons.close}
            </button>
        `;
        
        // Attach close event
        const closeBtn = popupActions.querySelector('.form-popup-btn-close');
        closeBtn.addEventListener('click', () => {
            this.hidePopup();
            this.resetForm();
        });
    }

    showErrorMessage(error) {
        const popupBody = this.overlay.querySelector('.form-popup-body');
        const popupActions = this.overlay.querySelector('.form-popup-actions');
        const popupConfig = this.appData?.formPopup || this.getDefaultConfig().formPopup;
        const contactPhone = this.appData?.contact?.phone || this.getDefaultConfig().contact.phone;
        
        popupBody.innerHTML = `
            <div class="form-success-content">
                <div class="form-success-icon" style="color: #ef4444;">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                </div>
                <h3 class="form-success-title">${popupConfig.messages.error.title}</h3>
                <p class="form-success-message">
                    ${popupConfig.messages.error.message}
                </p>
                <div class="form-success-details" style="background-color: #fef2f2; border-color: #ef4444;">
                    <p style="color: #dc2626;"><strong>Error:</strong> ${error.message}</p>
                    <p style="color: #dc2626;">${popupConfig.messages.error.contactInfo} ${contactPhone}</p>
                </div>
            </div>
        `;
        
        // Reset actions to allow retry
        popupActions.innerHTML = `
            <button class="form-popup-btn form-popup-btn-update" type="button">
                <i class="bi bi-arrow-left"></i>
                ${popupConfig.buttons.goBack}
            </button>
            <button class="form-popup-btn form-popup-btn-confirm" type="button">
                <i class="bi bi-arrow-repeat"></i>
                ${popupConfig.buttons.tryAgain}
            </button>
        `;
        
        popupActions.style.display = 'flex';
        
        // Re-attach event listeners
        const updateBtn = popupActions.querySelector('.form-popup-btn-update');
        const confirmBtn = popupActions.querySelector('.form-popup-btn-confirm');
        
        updateBtn.addEventListener('click', () => this.returnToFormWithValues());
        confirmBtn.addEventListener('click', () => this.confirmSubmission());
    }

    returnToFormWithValues() {
        // Restore form values before hiding popup
        this.restoreFormValues();
        
        // Hide popup and return to form
        this.hidePopup();
        
        // Focus on the first form field for better UX
        if (this.currentForm) {
            const firstInput = this.currentForm.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => {
                    firstInput.focus();
                    firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 400); // Wait for popup hide animation
            }
        }
    }

    restoreFormValues() {
        if (!this.currentForm || !this.currentFormData) return;
        
        // Restore all form values from the collected data
        for (const [fieldName, fieldValue] of Object.entries(this.currentFormData)) {
            const field = this.currentForm.querySelector(`[name="${fieldName}"]`);
            
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = fieldValue === 'on' || fieldValue === 'true' || fieldValue === '1';
                } else if (field.type === 'radio') {
                    // For radio buttons, find the one with matching value
                    const radioButton = this.currentForm.querySelector(`[name="${fieldName}"][value="${fieldValue}"]`);
                    if (radioButton) {
                        radioButton.checked = true;
                    }
                } else {
                    // For text inputs, textareas, selects, etc.
                    field.value = fieldValue;
                    
                    // Trigger change event to update any dependent UI
                    const changeEvent = new Event('change', { bubbles: true });
                    field.dispatchEvent(changeEvent);
                    
                    // Also trigger input event for real-time validation
                    const inputEvent = new Event('input', { bubbles: true });
                    field.dispatchEvent(inputEvent);
                }
                
                // Add visual feedback that values were restored
                field.classList.add('form-field-restored');
                setTimeout(() => {
                    field.classList.remove('form-field-restored');
                }, 2000);
            }
        }
        
        // Trigger form validation if available
        if (typeof this.currentForm.reportValidity === 'function') {
            this.currentForm.reportValidity();
        }
        
        console.log('Form values restored successfully');
    }

    hidePopup() {
        this.overlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Reset state after animation
        setTimeout(() => {
            if (!this.overlay.classList.contains('active')) {
                this.resetPopupState();
            }
        }, 300);
    }

    resetPopupState() {
        const popupConfig = this.appData?.formPopup || this.getDefaultConfig().formPopup;
        const popupHeader = this.overlay.querySelector('.form-popup-header');
        const popupBody = this.overlay.querySelector('.form-popup-body');
        const popupActions = this.overlay.querySelector('.form-popup-actions');
        
        // Reset header
        popupHeader.querySelector('.form-popup-title').textContent = popupConfig.titles.review;
        
        // Reset body
        popupBody.innerHTML = `
            <div class="form-review-content">
                <!-- Form review content will be inserted here -->
            </div>
        `;
        
        // Reset actions
        popupActions.innerHTML = `
            <button class="form-popup-btn form-popup-btn-update" type="button">
                <i class="bi bi-pencil"></i>
                ${popupConfig.buttons.update}
            </button>
            <button class="form-popup-btn form-popup-btn-confirm" type="button">
                <i class="bi bi-check-circle"></i>
                ${popupConfig.buttons.confirm}
            </button>
        `;
        
        popupActions.style.display = 'flex';
        
        // Re-attach base event listeners
        this.attachEventListeners();
    }

    resetForm() {
        if (this.currentForm) {
            this.currentForm.reset();
            
            // Trigger any custom reset events
            const resetEvent = new CustomEvent('formReset', {
                detail: { form: this.currentForm }
            });
            document.dispatchEvent(resetEvent);
        }
        
        this.currentForm = null;
        this.currentFormData = null;
        this.formEndpoint = null;
    }
}

// Initialize the popup system when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const popup = new FormConfirmationPopup();
        console.log('Form confirmation popup system initialized successfully');
    } catch (error) {
        console.error('Failed to initialize form confirmation popup:', error);
    }
});

// Export for potential external use
window.FormConfirmationPopup = FormConfirmationPopup;
