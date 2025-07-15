/**
 * Enhanced Booking Form with Twilio Integration
 * Handles appointment booking with SMS and voice communication
 */
class EnhancedBookingForm {
    constructor() {
        this.formData = {};
        this.servicesData = null;
        this.communicationConfig = null;
        this.init();
    }

    async init() {
        try {
            // Load services and communication config
            await Promise.all([
                this.loadServicesData(),
                this.loadCommunicationConfig()
            ]);
            
            this.renderForm();
            this.setupEventListeners();
            console.log('📋 Enhanced Booking Form initialized');
        } catch (error) {
            console.error('❌ Failed to initialize booking form:', error);
            this.renderFallbackForm();
        }
    }

    async loadServicesData() {
        const response = await fetch('/json/services.json');
        this.servicesData = await response.json();
    }

    async loadCommunicationConfig() {
        const response = await fetch('/json/communication.json');
        this.communicationConfig = await response.json();
    }

    renderForm() {
        const formContainer = document.getElementById('booking-form');
        if (!formContainer) return;

        const smsOptInChecked = localStorage.getItem('sms_opt_in') === 'true';

        formContainer.innerHTML = `
            <form id="enhanced-booking-form" class="space-y-4">
                <!-- Personal Information -->
                <div class="form-section">
                    <h4 class="font-semibold text-primary mb-3">Personal Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="customer-name" class="block text-sm font-medium text-gray-700 mb-1">
                                Full Name *
                            </label>
                            <input 
                                type="text" 
                                id="customer-name" 
                                name="name" 
                                required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                placeholder="John Doe"
                            >
                        </div>
                        <div>
                            <label for="customer-phone" class="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number *
                            </label>
                            <input 
                                type="tel" 
                                id="customer-phone" 
                                name="phone" 
                                required 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                placeholder="(555) 123-4567"
                            >
                            <p class="text-xs text-gray-500 mt-1">We'll use this to confirm your appointment</p>
                        </div>
                    </div>
                    <div>
                        <label for="customer-email" class="block text-sm font-medium text-gray-700 mb-1">
                            Email Address *
                        </label>
                        <input 
                            type="email" 
                            id="customer-email" 
                            name="email" 
                            required 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            placeholder="john@example.com"
                        >
                    </div>
                </div>

                <!-- Service Selection -->
                <div class="form-section">
                    <h4 class="font-semibold text-primary mb-3">Service Needed</h4>
                    <div>
                        <label for="service-select" class="block text-sm font-medium text-gray-700 mb-1">
                            Select Service *
                        </label>
                        <select 
                            id="service-select" 
                            name="service" 
                            required 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                        >
                            <option value="">Choose a service...</option>
                            ${this.renderServiceOptions()}
                        </select>
                    </div>
                    <div id="service-details" class="mt-3 p-3 bg-gray-50 rounded-lg hidden">
                        <!-- Service details will be populated here -->
                    </div>
                </div>

                <!-- Location Preference -->
                <div class="form-section">
                    <h4 class="font-semibold text-primary mb-3">Service Location</h4>
                    <div class="space-y-3">
                        <label class="flex items-center">
                            <input type="radio" name="location-type" value="mobile" class="mr-2">
                            <span class="text-sm">Mobile Service (We come to you)</span>
                            <span class="ml-2 text-xs bg-accent text-white px-2 py-1 rounded">Popular</span>
                        </label>
                        <label class="flex items-center">
                            <input type="radio" name="location-type" value="shop" class="mr-2">
                            <span class="text-sm">Bring to Our Shop</span>
                        </label>
                    </div>
                    <div id="mobile-location-fields" class="mt-3 hidden">
                        <label for="service-address" class="block text-sm font-medium text-gray-700 mb-1">
                            Service Address
                        </label>
                        <textarea 
                            id="service-address" 
                            name="address" 
                            rows="2" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            placeholder="123 Main St, Atlanta, GA 30309"
                        ></textarea>
                        <p class="text-xs text-gray-500 mt-1">Include any special instructions (apartment number, gate code, etc.)</p>
                    </div>
                </div>

                <!-- Vehicle Information -->
                <div class="form-section">
                    <h4 class="font-semibold text-primary mb-3">Vehicle Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label for="vehicle-year" class="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input 
                                type="number" 
                                id="vehicle-year" 
                                name="vehicleYear" 
                                min="1990" 
                                max="2025"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                placeholder="2020"
                            >
                        </div>
                        <div>
                            <label for="vehicle-make" class="block text-sm font-medium text-gray-700 mb-1">Make</label>
                            <input 
                                type="text" 
                                id="vehicle-make" 
                                name="vehicleMake" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                placeholder="Toyota"
                            >
                        </div>
                        <div>
                            <label for="vehicle-model" class="block text-sm font-medium text-gray-700 mb-1">Model</label>
                            <input 
                                type="text" 
                                id="vehicle-model" 
                                name="vehicleModel" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                                placeholder="Camry"
                            >
                        </div>
                    </div>
                </div>

                <!-- Scheduling -->
                <div class="form-section">
                    <h4 class="font-semibold text-primary mb-3">Preferred Schedule</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label for="preferred-date" class="block text-sm font-medium text-gray-700 mb-1">
                                Preferred Date
                            </label>
                            <input 
                                type="date" 
                                id="preferred-date" 
                                name="preferredDate" 
                                min="${new Date().toISOString().split('T')[0]}"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            >
                        </div>
                        <div>
                            <label for="preferred-time" class="block text-sm font-medium text-gray-700 mb-1">
                                Preferred Time
                            </label>
                            <select 
                                id="preferred-time" 
                                name="preferredTime" 
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            >
                                <option value="">Select time...</option>
                                <option value="8:00 AM">8:00 AM</option>
                                <option value="9:00 AM">9:00 AM</option>
                                <option value="10:00 AM">10:00 AM</option>
                                <option value="11:00 AM">11:00 AM</option>
                                <option value="12:00 PM">12:00 PM</option>
                                <option value="1:00 PM">1:00 PM</option>
                                <option value="2:00 PM">2:00 PM</option>
                                <option value="3:00 PM">3:00 PM</option>
                                <option value="4:00 PM">4:00 PM</option>
                                <option value="5:00 PM">5:00 PM</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Additional Information -->
                <div class="form-section">
                    <h4 class="font-semibold text-primary mb-3">Additional Information</h4>
                    <div>
                        <label for="service-notes" class="block text-sm font-medium text-gray-700 mb-1">
                            Describe the issue or special requests
                        </label>
                        <textarea 
                            id="service-notes" 
                            name="notes" 
                            rows="3" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                            placeholder="Tell us about any symptoms, concerns, or special requirements..."
                        ></textarea>
                    </div>
                </div>

                <!-- Communication Preferences -->
                <div class="form-section">
                    <h4 class="font-semibold text-primary mb-3">Communication Preferences</h4>
                    <div class="space-y-3">
                        <label class="flex items-start">
                            <input 
                                type="checkbox" 
                                id="sms-opt-in" 
                                name="smsOptIn" 
                                data-action="sms-opt-in"
                                ${smsOptInChecked ? 'checked' : ''}
                                class="mt-1 mr-3"
                            >
                            <div>
                                <span class="text-sm font-medium">SMS Updates</span>
                                <p class="text-xs text-gray-500">Receive appointment confirmations and updates via text message</p>
                            </div>
                        </label>
                        <label class="flex items-start">
                            <input type="checkbox" name="emailUpdates" checked class="mt-1 mr-3">
                            <div>
                                <span class="text-sm font-medium">Email Updates</span>
                                <p class="text-xs text-gray-500">Receive appointment details and receipts via email</p>
                            </div>
                        </label>
                        <label class="flex items-start">
                            <input type="checkbox" name="urgentContact" class="mt-1 mr-3">
                            <div>
                                <span class="text-sm font-medium">This is urgent</span>
                                <p class="text-xs text-gray-500">Check this if you need immediate assistance</p>
                            </div>
                        </label>
                    </div>
                </div>

                <!-- Emergency Contact Button -->
                <div class="form-section border-t pt-4">
                    <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 class="font-semibold text-red-800 mb-2">Need Immediate Help?</h4>
                        <p class="text-sm text-red-600 mb-3">
                            If your vehicle is unsafe to drive or you're stranded, call us now.
                        </p>
                        <button 
                            type="button" 
                            data-action="emergency-call"
                            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                        >
                            <i class="bi bi-telephone-fill mr-2"></i>
                            Emergency Call
                        </button>
                    </div>
                </div>

                <!-- Submit Button -->
                <div class="form-section">
                    <button 
                        type="submit" 
                        class="w-full bg-accent text-white py-3 px-6 rounded-lg hover:bg-opacity-90 transition-all font-semibold text-lg"
                        id="submit-booking"
                    >
                        <span class="submit-text">Book My Appointment</span>
                        <span class="loading-spinner hidden">
                            <i class="bi bi-arrow-clockwise animate-spin mr-2"></i>
                            Booking...
                        </span>
                    </button>
                    <p class="text-xs text-gray-500 text-center mt-2">
                        We'll confirm your appointment within 24 hours
                    </p>
                </div>

                <!-- Hidden fields -->
                <input type="hidden" name="form_type" value="booking">
                <input type="hidden" name="timestamp" value="${new Date().toISOString()}">
            </form>
        `;
    }

    renderServiceOptions() {
        if (!this.servicesData?.services) return '';
        
        return this.servicesData.services.map(service => 
            `<option value="${service.id}" data-mobile="${service.mobileAvailable}" data-duration="${service.estimatedDuration}" data-price="${service.priceRange}">
                ${service.name} (${service.priceRange})
            </option>`
        ).join('');
    }

    setupEventListeners() {
        const form = document.getElementById('enhanced-booking-form');
        if (!form) return;

        // Service selection change
        const serviceSelect = document.getElementById('service-select');
        serviceSelect.addEventListener('change', (e) => {
            this.handleServiceSelection(e.target.value);
        });

        // Location type change
        const locationRadios = document.querySelectorAll('input[name="location-type"]');
        locationRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.handleLocationTypeChange(e.target.value);
            });
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission();
        });

        // Phone number formatting
        const phoneInput = document.getElementById('customer-phone');
        phoneInput.addEventListener('input', (e) => {
            this.formatPhoneNumber(e.target);
        });
    }

    handleServiceSelection(serviceId) {
        const service = this.servicesData.services.find(s => s.id === serviceId);
        const detailsContainer = document.getElementById('service-details');
        
        if (service) {
            detailsContainer.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h5 class="font-medium text-gray-800">${service.name}</h5>
                        <p class="text-sm text-gray-600">${service.description}</p>
                        <div class="mt-2">
                            <span class="text-sm font-medium text-accent">Price Range: ${service.priceRange}</span>
                            <span class="text-sm text-gray-500 ml-4">Duration: ~${service.estimatedDuration} mins</span>
                        </div>
                    </div>
                    <div>
                        <h6 class="font-medium text-gray-700 mb-1">Includes:</h6>
                        <ul class="text-sm text-gray-600 space-y-1">
                            ${service.includes.map(item => `<li>• ${item}</li>`).join('')}
                        </ul>
                        ${service.mobileAvailable ? 
                            '<span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2">Mobile Available</span>' : 
                            '<span class="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded mt-2">Shop Only</span>'
                        }
                    </div>
                </div>
            `;
            detailsContainer.classList.remove('hidden');

            // If service is not mobile available, hide mobile option
            const mobileRadio = document.querySelector('input[name="location-type"][value="mobile"]');
            const shopRadio = document.querySelector('input[name="location-type"][value="shop"]');
            
            if (!service.mobileAvailable) {
                mobileRadio.disabled = true;
                mobileRadio.checked = false;
                shopRadio.checked = true;
                this.handleLocationTypeChange('shop');
            } else {
                mobileRadio.disabled = false;
            }
        } else {
            detailsContainer.classList.add('hidden');
        }
    }

    handleLocationTypeChange(locationType) {
        const mobileFields = document.getElementById('mobile-location-fields');
        
        if (locationType === 'mobile') {
            mobileFields.classList.remove('hidden');
            document.getElementById('service-address').required = true;
        } else {
            mobileFields.classList.add('hidden');
            document.getElementById('service-address').required = false;
        }
    }

    formatPhoneNumber(input) {
        let value = input.value.replace(/\D/g, '');
        
        if (value.length >= 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{3})(\d{3})/, '($1) $2');
        }
        
        input.value = value;
    }

    async handleFormSubmission() {
        const form = document.getElementById('enhanced-booking-form');
        const submitButton = document.getElementById('submit-booking');
        const formData = new FormData(form);
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Validate form
            if (!this.validateForm(formData)) {
                this.setLoadingState(false);
                return;
            }

            // Prepare data
            const data = this.prepareFormData(formData);
            
            // Submit to Formspree
            const response = await fetch('https://formspree.io/f/xjkobqnw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Trigger Twilio communication
                const event = new CustomEvent('formSubmit', {
                    detail: {
                        formType: 'booking',
                        data: data
                    }
                });
                document.dispatchEvent(event);

                // Show success message
                this.showSuccessMessage(data);
                form.reset();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            this.showErrorMessage('There was an error submitting your appointment. Please try calling us directly.');
        } finally {
            this.setLoadingState(false);
        }
    }

    validateForm(formData) {
        const requiredFields = ['name', 'phone', 'email', 'service'];
        const errors = [];

        requiredFields.forEach(field => {
            if (!formData.get(field)) {
                errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
            }
        });

        // Validate phone number
        const phone = formData.get('phone');
        if (phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(phone)) {
            errors.push('Please enter a valid phone number');
        }

        // Validate email
        const email = formData.get('email');
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push('Please enter a valid email address');
        }

        if (errors.length > 0) {
            this.showErrorMessage(errors.join(', '));
            return false;
        }

        return true;
    }

    prepareFormData(formData) {
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Add vehicle info as combined string
        if (data.vehicleYear || data.vehicleMake || data.vehicleModel) {
            data.vehicle = `${data.vehicleYear || ''} ${data.vehicleMake || ''} ${data.vehicleModel || ''}`.trim();
        }

        // Add formatted service info
        const service = this.servicesData.services.find(s => s.id === data.service);
        if (service) {
            data.serviceName = service.name;
            data.servicePrice = service.priceRange;
        }

        return data;
    }

    setLoadingState(loading) {
        const submitButton = document.getElementById('submit-booking');
        const submitText = submitButton.querySelector('.submit-text');
        const loadingSpinner = submitButton.querySelector('.loading-spinner');

        if (loading) {
            submitButton.disabled = true;
            submitText.classList.add('hidden');
            loadingSpinner.classList.remove('hidden');
        } else {
            submitButton.disabled = false;
            submitText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
        }
    }

    showSuccessMessage(data) {
        const message = `
            <div class="text-center">
                <div class="text-green-600 text-4xl mb-4">✅</div>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">Appointment Request Received!</h3>
                <p class="text-gray-600 mb-4">
                    Thank you, ${data.name}! We've received your request for ${data.serviceName || data.service}.
                </p>
                <div class="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p class="text-sm text-green-800">
                        📱 ${data.smsOptIn === 'on' ? 'You will receive SMS confirmation shortly.' : 'We will contact you via email and phone.'}
                    </p>
                    <p class="text-sm text-green-800">
                        📧 A confirmation email is on its way to ${data.email}
                    </p>
                </div>
                <p class="text-sm text-gray-500">
                    We'll confirm your appointment within 24 hours. If urgent, please call us directly.
                </p>
            </div>
        `;

        document.getElementById('booking-form').innerHTML = message;
    }

    showErrorMessage(message) {
        // Create temporary error display
        const errorDiv = document.createElement('div');
        errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
        errorDiv.textContent = message;

        const form = document.getElementById('enhanced-booking-form');
        form.insertBefore(errorDiv, form.firstChild);

        // Remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 5000);
    }

    renderFallbackForm() {
        const formContainer = document.getElementById('booking-form');
        if (!formContainer) return;

        formContainer.innerHTML = `
            <form action="https://formspree.io/f/xjkobqnw" method="POST" class="space-y-4">
                <input type="hidden" name="form_type" value="booking">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" placeholder="Your Name" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent">
                    <input type="tel" name="phone" placeholder="Phone Number" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent">
                </div>
                <input type="email" name="email" placeholder="Email Address" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent">
                <input type="text" name="service" placeholder="Service Needed" required class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent">
                <textarea name="notes" rows="3" placeholder="Additional details..." class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"></textarea>
                <button type="submit" class="w-full bg-accent text-white py-3 rounded-lg hover:bg-opacity-90 transition-colors font-semibold">
                    Book Appointment
                </button>
            </form>
        `;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const bookingForm = new EnhancedBookingForm();
});
