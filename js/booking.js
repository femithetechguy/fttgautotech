// Booking Module - Handles booking form functionality and validation
class BookingModule {
    constructor() {
        this.form = null;
        this.formData = {};
        this.validationRules = {};
        this.init();
    }

    init() {
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupFormAnimations();
        this.setupAutoSave();
    }

    setupFormValidation() {
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Please enter a valid name (letters only)'
            },
            phone: {
                required: true,
                pattern: /^[\+]?[1-9][\d]{0,15}$/,
                message: 'Please enter a valid phone number'
            },
            'car-make': {
                required: true,
                message: 'Please select your car make'
            },
            'car-model': {
                required: true,
                message: 'Please select your car model'
            },
            'car-year': {
                required: true,
                message: 'Please select your car year'
            },
            'car-make-model': {
                required: true,
                minLength: 3,
                message: 'Please enter your car make and model'
            },
            'service-needed': {
                required: true,
                message: 'Please select a service'
            }
        };

        // Real-time validation
        document.addEventListener('input', (e) => {
            if (e.target.closest('.booking-form')) {
                this.validateField(e.target);
            }
        });

        document.addEventListener('blur', (e) => {
            if (e.target.closest('.booking-form')) {
                this.validateField(e.target);
            }
        });
    }

    validateField(field) {
        const fieldName = field.name;
        const fieldValue = field.value.trim();
        const rules = this.validationRules[fieldName];

        if (!rules) return true;

        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (rules.required && !fieldValue) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        }

        // Minimum length validation
        if (isValid && rules.minLength && fieldValue.length < rules.minLength) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} must be at least ${rules.minLength} characters`;
        }

        // Pattern validation
        if (isValid && rules.pattern && !rules.pattern.test(fieldValue)) {
            isValid = false;
            errorMessage = rules.message;
        }

        this.displayFieldValidation(field, isValid, errorMessage);
        return isValid;
    }

    getFieldLabel(fieldName) {
        const labels = {
            'name': 'Name',
            'phone': 'Phone',
            'car-make': 'Car Make',
            'car-model': 'Car Model', 
            'car-year': 'Car Year',
            'car-make-model': 'Car Make/Model',
            'service-needed': 'Service'
        };
        return labels[fieldName] || fieldName;
    }

    displayFieldValidation(field, isValid, errorMessage) {
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Update field styling
        if (isValid) {
            field.classList.remove('border-red-500');
            field.classList.add('border-green-500');
        } else {
            field.classList.remove('border-green-500');
            field.classList.add('border-red-500');

            // Add error message
            if (errorMessage) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'error-message text-red-500 text-sm mt-1';
                errorDiv.textContent = errorMessage;
                field.parentNode.appendChild(errorDiv);
            }
        }
    }

    setupFormSubmission() {
        document.addEventListener('submit', (e) => {
            if (e.target.matches('.booking-form')) {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            }
        });
    }

    async handleFormSubmission(form) {
        // Validate all fields
        const formFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isFormValid = true;

        formFields.forEach(field => {
            if (!this.validateField(field)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showMessage('Please correct the errors above', 'error');
            return;
        }

        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Booking...';
        submitButton.disabled = true;

        try {
            // Collect form data
            const formData = new FormData(form);
            const bookingData = Object.fromEntries(formData);
            
            // Add timestamp
            bookingData.timestamp = new Date().toISOString();
            bookingData.source = 'website';

            // Simulate API call (replace with actual booking system)
            await this.submitBooking(bookingData);

            // Success
            this.showMessage('Thank you! Your booking request has been submitted. We will contact you soon.', 'success');
            form.reset();
            this.clearValidationStates(form);

            // Clear auto-saved data
            localStorage.removeItem('fttg-booking-draft');

        } catch (error) {
            console.error('Booking submission error:', error);
            this.showMessage('Sorry, there was an error submitting your booking. Please try again or call us directly.', 'error');
        } finally {
            // Restore button state
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    async submitBooking(bookingData) {
        // This would typically send to your backend API
        // For now, we'll simulate with a delay and log the data
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                console.log('Booking submitted:', bookingData);
                
                // Simulate success/failure
                if (Math.random() > 0.1) { // 90% success rate
                    resolve(bookingData);
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }

    clearValidationStates(form) {
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.classList.remove('border-red-500', 'border-green-500');
        });

        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.remove());
    }

    showMessage(message, type) {
        // Remove existing message
        const existingMessage = document.querySelector('.booking-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `booking-message p-4 rounded-lg mb-4 ${
            type === 'success' ? 'bg-green-100 text-green-700 border border-green-300' : 
            'bg-red-100 text-red-700 border border-red-300'
        }`;
        messageDiv.textContent = message;

        // Insert message
        const bookingForm = document.getElementById('booking-form');
        if (bookingForm) {
            bookingForm.insertBefore(messageDiv, bookingForm.firstChild);

            // Auto-remove after 5 seconds for success messages
            if (type === 'success') {
                setTimeout(() => {
                    messageDiv.remove();
                }, 5000);
            }
        }
    }

    setupFormAnimations() {
        // Animate form fields on focus
        document.addEventListener('focus', (e) => {
            if (e.target.closest('.booking-form')) {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.transition = 'all 0.2s ease';
            }
        }, true);

        document.addEventListener('blur', (e) => {
            if (e.target.closest('.booking-form')) {
                e.target.style.transform = 'scale(1)';
            }
        }, true);
    }

    setupAutoSave() {
        // Auto-save form data to localStorage
        document.addEventListener('input', (e) => {
            if (e.target.closest('.booking-form')) {
                this.autoSaveFormData();
            }
        });

        // Restore saved data on page load
        this.restoreSavedData();
    }

    autoSaveFormData() {
        const form = document.querySelector('.booking-form');
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Only save if there's meaningful data
        const hasData = Object.values(data).some(value => value.trim() !== '');
        
        if (hasData) {
            localStorage.setItem('fttg-booking-draft', JSON.stringify(data));
        }
    }

    restoreSavedData() {
        const savedData = localStorage.getItem('fttg-booking-draft');
        if (!savedData) return;

        try {
            const data = JSON.parse(savedData);
            
            // Wait for form to be rendered
            setTimeout(() => {
                const form = document.querySelector('.booking-form');
                if (form) {
                    Object.entries(data).forEach(([name, value]) => {
                        const field = form.querySelector(`[name="${name}"]`);
                        if (field && value) {
                            field.value = value;
                        }
                    });

                    // Show restoration notice
                    this.showMessage('We restored your previous booking information.', 'info');
                }
            }, 1000);
        } catch (error) {
            console.error('Error restoring saved data:', error);
        }
    }

    // Method to pre-fill form with service
    preSelectService(serviceName) {
        setTimeout(() => {
            const serviceSelect = document.querySelector('select[name="service-needed"]');
            if (serviceSelect) {
                const option = Array.from(serviceSelect.options).find(opt => 
                    opt.textContent.toLowerCase().includes(serviceName.toLowerCase())
                );
                if (option) {
                    option.selected = true;
                    
                    // Scroll to booking section
                    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }, 500);
    }

    // Method to get booking statistics
    getBookingStats() {
        const stats = localStorage.getItem('fttg-booking-stats');
        return stats ? JSON.parse(stats) : { total: 0, lastSubmission: null };
    }

    updateBookingStats() {
        const stats = this.getBookingStats();
        stats.total += 1;
        stats.lastSubmission = new Date().toISOString();
        localStorage.setItem('fttg-booking-stats', JSON.stringify(stats));
    }
}

// Initialize booking module when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bookingModule = new BookingModule();
});
