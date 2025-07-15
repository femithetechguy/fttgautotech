# FTTG AutoTech - Project Architecture

## 🏗️ System Architecture

### Architecture Type: **Static Site with External Services**

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Pages                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Static Website                      │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │   │
│  │  │   HTML      │ │     CSS     │ │ JavaScript  │ │   │
│  │  │   Pages     │ │   Styles    │ │  Components │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           │ Form Submissions
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Formspree                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │             Form Processing                      │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │   │
│  │  │   Booking   │ │   Contact   │ │   Consent   │ │   │
│  │  │    Forms    │ │    Forms    │ │    Forms    │ │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                           │
                           │ Email Notifications
                           ▼
┌─────────────────────────────────────────────────────────┐
│                Business Email                           │
│              (info@fttgautotech.com)                   │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure & Components

### Frontend (Deployed to GitHub Pages)
```
/
├── index.html                 # Main landing page
├── consent.html              # Communication consent page
├── CNAME                     # Custom domain configuration
│
├── css/                      # Stylesheets
│   ├── styles.css           # Global styles and variables
│   ├── mobile.css           # Mobile responsiveness
│   ├── consent.css          # Consent page specific styles
│   ├── hero.css             # Hero section styles
│   ├── services.css         # Services section styles
│   ├── booking.css          # Booking form styles
│   └── form-popup.css       # Modal/popup styles
│
├── js/                       # JavaScript modules
│   ├── script.js            # Main application logic
│   ├── navigation.js        # Navigation and menu handling
│   ├── hero.js              # Hero section functionality
│   ├── services.js          # Services display logic
│   ├── booking.js           # Basic booking form
│   ├── enhanced-booking.js  # Advanced booking with features
│   ├── twilio-service.js    # Communication service (GitHub Pages mode)
│   ├── formspree-consent.js # Consent form handling
│   ├── consent-manager.js   # Consent page content loading
│   ├── footer.js            # Footer component
│   ├── seo.js               # SEO optimization
│   ├── structured-data.js   # Schema markup
│   └── form-popup.js        # Modal functionality
│
├── json/                     # Configuration files
│   ├── services.json        # Service definitions and pricing
│   ├── consent.json         # Consent page content
│   └── communication.json   # Communication preferences
│
├── image/                    # Static assets
│   ├── logo.png             # Company logo
│   └── fttgautotech_qr.png  # QR code for website sharing
│
└── docs/                     # Documentation (not deployed)
    └── *.md                  # Project documentation
```

### Backend (Not Used in GitHub Pages)
```
backend/
├── server.js                 # Express.js server with Twilio integration
├── package.json             # Node.js dependencies
└── .env                     # Environment variables (not committed)
```

---

## 🔄 Data Flow

### 1. User Interaction Flow
```
User visits website → Static HTML/CSS/JS loads → User fills form → 
JavaScript validates → Form submits to Formspree → 
Email notification sent → Business receives notification
```

### 2. Form Processing Flow
```
Form Submission → Formspree → Email Processing → Business Inbox
     ↓
Local Storage ← JavaScript ← Validation
     ↓
User Feedback ← Success/Error Messages
```

### 3. Content Loading Flow
```
Page Load → Fetch JSON configs → Populate dynamic content → 
Show loading states → Hide loading overlay → Ready for interaction
```

---

## 🧩 Component Architecture

### JavaScript Components

#### Core Components
1. **Navigation System**
   - Mobile menu toggle
   - Smooth scrolling
   - Active section highlighting

2. **Form Handlers**
   - Validation logic
   - Submission processing
   - Error handling
   - Success feedback

3. **Content Managers**
   - JSON data loading
   - Dynamic content injection
   - Fallback content

#### Service Layer
1. **Communication Service**
   - GitHub Pages compatible mode
   - Graceful degradation
   - User notifications

2. **Form Processing**
   - Formspree integration
   - Local storage backup
   - Analytics tracking

### CSS Architecture

#### Methodology: **Component-Based + Utility Classes**

1. **Global Styles** (`styles.css`)
   - CSS variables
   - Base typography
   - Layout utilities
   - Component base styles

2. **Responsive Styles** (`mobile.css`)
   - Mobile-first approach
   - Tablet breakpoints
   - Desktop enhancements

3. **Component Styles**
   - Self-contained components
   - BEM-like naming
   - Modular organization

---

## 🔌 External Integrations

### Formspree Integration
```javascript
// Form submission endpoint
POST https://formspree.io/f/{form_id}

// Response handling
{
  "success": true,
  "data": {...}
}
```

### Dependencies
- **Tailwind CSS**: Utility-first styling (CDN)
- **Bootstrap Icons**: Icon library (CDN)
- **Google Fonts**: Typography (CDN)

---

## 🔒 Security Architecture

### Client-Side Security
- **No sensitive data** in frontend code
- **Input validation** before submission
- **HTTPS enforcement** via GitHub Pages
- **XSS prevention** through proper escaping

### Form Security
- **Formspree spam protection**
- **Rate limiting** via Formspree
- **Email validation** client and server-side
- **CSRF protection** via form tokens

---

## 📊 Performance Architecture

### Loading Strategy
1. **Critical CSS** inlined in HTML
2. **Non-critical resources** loaded asynchronously
3. **Progressive enhancement**
4. **Graceful degradation**

### Optimization Techniques
- **Image optimization** (WebP with fallbacks)
- **CSS minification** in production
- **JavaScript bundling** (minimal)
- **CDN delivery** via GitHub Pages

---

## 🔧 Configuration Management

### Environment Configuration
```javascript
// Communication service automatically detects GitHub Pages
const isGitHubPages = !window.location.hostname.includes('localhost');
```

### Feature Flags
- **Twilio integration**: Disabled for GitHub Pages
- **Debug logging**: Environment-based
- **Analytics**: Configurable per environment

---

## 🎯 Design Patterns

### 1. Module Pattern
```javascript
class ServiceName {
  constructor() {
    this.init();
  }
  
  async init() {
    // Initialization logic
  }
}
```

### 2. Observer Pattern
```javascript
// Event-driven communication between components
document.addEventListener('formSubmit', this.handleSubmission);
```

### 3. Strategy Pattern
```javascript
// Different handling for GitHub Pages vs full server
if (this.isGitHubPages) {
  this.handleStaticMode();
} else {
  this.handleServerMode();
}
```

---

## 🔄 State Management

### Client-Side State
- **Form data**: Temporary storage during submission
- **User preferences**: Local storage for consent choices
- **UI state**: Loading indicators, error messages

### Persistence Strategy
- **Local Storage**: User preferences and form backups
- **Session Storage**: Temporary UI state
- **No global state**: Component-based architecture

This architecture provides a **scalable**, **maintainable**, and **deployable** solution optimized for GitHub Pages hosting! 🚀
