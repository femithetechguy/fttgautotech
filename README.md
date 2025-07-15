# FTTG AutoTech Website

A modern, dynamic automotive service website that automatically updates content from a JSON configuration file.

## 🚗 About

FTTG AutoTech is a professional automotive service company serving the Metro Atlanta area. This website showcases their services with a clean, modern design that emphasizes trust, professionalism, and technical expertise.

**Tagline**: *Precision. Passion. Performance.*

## ✨ Features

### Dynamic Content Management
- **JSON-Driven**: All website content is controlled by `json/app.json`
- **Auto-Reload**: Content updates automatically when JSON is modified (in development)
- **No Code Changes**: Update text, colors, services, and contact info without touching HTML/CSS/JS

### Modern Design
- **Responsive**: Mobile-first design that works on all devices
- **Professional**: Clean, bold, and tech-savvy aesthetic
- **Brand Colors**: Midnight blue (#1D2A35) and Safety orange (#FF6B00)
- **Typography**: Montserrat for headings, Open Sans for body text

### Key Sections
- **Hero Section**: Animated title with call-to-action buttons
- **Services**: Quick service grid with hover animations
- **Why Choose Us**: Feature highlights with icons
- **Booking Form**: Complete service booking with validation
- **Testimonials**: Customer reviews and ratings
- **Contact**: Multiple contact methods and service area info

### Mobile Optimized
- Sticky "Call Now" button
- Touch-friendly interface
- Optimized forms and navigation
- Fast loading and smooth animations

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Styling**: Tailwind CSS + Custom CSS
- **Icons**: Bootstrap Icons
- **Fonts**: Google Fonts (Montserrat, Open Sans)
- **Hosting**: GitHub Pages (current), Vercel/Netlify (planned)
- **Forms**: Formspree (current), Custom backend (planned)

## 📁 Project Structure

```
fttgautotech/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css          # Main styles and variables
│   ├── hero.css            # Hero section specific styles
│   ├── services.css        # Services section styles
│   └── mobile.css          # Mobile-specific styles
├── js/
│   ├── script.js           # Main app controller
│   ├── navigation.js       # Navigation functionality
│   ├── hero.js             # Hero animations
│   ├── services.js         # Services interactions
│   └── booking.js          # Booking form logic
├── json/
│   └── app.json            # Website configuration
├── image/                  # Images and assets
└── README.md              # This file
```

## 🚀 Getting Started

### Quick Start
1. **Clone the repository**
   ```bash
   git clone https://github.com/femithetechguy/fttgautotech.git
   cd fttgautotech
   ```

2. **Serve locally**
   ```bash
   # Using Python (recommended)
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Development
- **Live Editing**: Modify `json/app.json` and see changes automatically
- **CSS Changes**: Edit CSS files in `css/` directory
- **JavaScript**: Modify JS modules in `js/` directory

## ⚙️ Configuration

### Updating Content
All website content is controlled by `json/app.json`. Key sections include:

#### Business Information
```json
{
  "business": {
    "name": "FTTG AutoTech",
    "tagline": "Precision. Passion. Performance.",
    "subtitle": "Serving Metro Atlanta Since [Year]"
  }
}
```

#### Contact Information
```json
{
  "contact": {
    "phone": "+185557843343",
    "emails": {
      "general": "support@fttgautotech.com",
      "support": "support@fttgautotech.com"
    },
    "serviceArea": "Metro Atlanta"
  }
}
```

#### Branding & Colors
```json
{
  "branding": {
    "colors": {
      "primary": {
        "color": "#1D2A35",
        "name": "Midnight blue"
      },
      "accent": [
        {
          "color": "#FF6B00",
          "name": "Safety orange"
        }
      ]
    }
  }
}
```

#### Services
```json
{
  "homepage": {
    "services": {
      "title": "Quick Services",
      "items": [
        {
          "name": "Oil Change",
          "icon": "oil-change"
        }
      ]
    }
  }
}
```

### Dynamic Features
- **Auto Year**: Copyright year updates automatically
- **Theme Colors**: CSS variables update from JSON
- **Navigation**: Menu items generated from JSON
- **Forms**: Booking form fields configured in JSON

## 📱 Mobile Features

- **Responsive Design**: Works perfectly on all screen sizes
- **Touch Optimized**: Large touch targets and smooth interactions
- **Fast Loading**: Optimized assets and efficient code
- **Mobile Navigation**: Collapsible menu with smooth animations
- **Call Button**: Sticky call button for easy contact

## 🎨 Customization

### Colors
Update colors in `json/app.json` under `branding.colors`. The website automatically applies new colors using CSS custom properties.

### Fonts
Modify font choices in `json/app.json` under `branding.fonts`. Currently supports Google Fonts.

### Services
Add or modify services in `json/app.json` under `homepage.services.items` and `services` arrays.

### Navigation
Update menu items in `json/app.json` under `navigation` array.

## 🔧 Development Features

### Auto-Reload (Development Only)
When running on localhost, the website automatically checks for JSON changes every 2 seconds and reloads content without page refresh.

### Modular Architecture
- **Separation of Concerns**: Each major feature has its own CSS and JS file
- **Reusable Components**: Modular design for easy maintenance
- **Event-Driven**: Clean event handling and state management

### Form Handling
- **Real-time Validation**: Instant feedback on form inputs
- **Auto-Save**: Form data saved locally to prevent loss
- **Error Handling**: Comprehensive error states and messages

## 📈 SEO & Performance

### SEO Optimized
- **Meta Tags**: Dynamic title and description
- **Local Keywords**: Metro Atlanta automotive services
- **Structured Data**: Ready for schema markup
- **Fast Loading**: Optimized assets and code

### Performance
- **Lazy Loading**: Images load as needed
- **Minified Assets**: Compressed CSS and JS
- **Efficient Rendering**: Minimal DOM manipulation
- **Mobile First**: Optimized for mobile performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for FTTG AutoTech. All rights reserved.

## 💝 Credits

**Created with ❤️ by [FTTG SOLUTIONS](https://fttgsolutions.com)**

---

## 📞 Contact

- **Phone**: [+185557843343](tel:+185557843343)
- **Email**: [support@fttgautotech.com](mailto:support@fttgautotech.com)
- **Service Area**: Metro Atlanta

## 🗓️ Version History

- **v1.0.0** (2025-07-14): Initial release with dynamic JSON configuration
  - Complete responsive design
  - Dynamic content management
  - Mobile optimizations
  - Booking system
  - SEO optimizations

---

*Last updated: July 14, 2025*
