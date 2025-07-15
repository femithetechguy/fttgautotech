// Structured Data for FTTG AutoTech
// This file contains Schema.org markup for better SEO

const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "name": "FTTG AutoTech",
    "description": "Professional auto repair and mobile car service in Metro Atlanta with ASE certified technicians.",
    "image": "https://fttgautotech.com/image/logo.png",
    "url": "https://fttgautotech.com",
    "telephone": "+185557843343",
    "email": "support@fttgautotech.com",
    "address": {
        "@type": "PostalAddress",
        "addressRegion": "GA",
        "addressCountry": "US",
        "addressLocality": "Atlanta"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": "33.7490",
        "longitude": "-84.3880"
    },
    "openingHours": [
        "Mo-Fr 08:00-18:00",
        "Sa 08:00-16:00"
    ],
    "priceRange": "$$",
    "paymentAccepted": ["Cash", "Credit Card"],
    "currenciesAccepted": "USD",
    "serviceArea": {
        "@type": "City",
        "name": "Atlanta"
    },
    "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Auto Repair Services",
        "itemListElement": [
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Oil Change",
                    "description": "Professional oil change service"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Brake Repair",
                    "description": "Complete brake system repair and maintenance"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Engine Diagnostics",
                    "description": "Comprehensive engine diagnostic services"
                }
            },
            {
                "@type": "Offer",
                "itemOffered": {
                    "@type": "Service",
                    "name": "Mobile Car Service",
                    "description": "Convenient mobile auto repair at your location"
                }
            }
        ]
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "150"
    },
    "review": [
        {
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": "John D."
            },
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5"
            },
            "reviewBody": "Excellent service and fair pricing. They fixed my brake issue quickly and professionally."
        }
    ],
    "sameAs": [
        "https://www.facebook.com/FTTGAutoTech",
        "https://www.instagram.com/fttgautotech",
        "https://www.youtube.com/@fttgautotech",
        "https://www.linkedin.com/company/fttgautotech"
    ]
};

// Inject structured data when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    console.log('Structured data injected successfully');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = structuredData;
}
