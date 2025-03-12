# GrassApp

![GrassApp Logo](/public/GrassAppLogo.png)

GrassApp is a modern, full-featured cannabis delivery platform that connects dispensaries with customers through a reliable delivery network.

[![GitHub Repository](https://img.shields.io/badge/GitHub-WaterVibes%2Fgrassapp--web-green.svg)](https://github.com/WaterVibes/grassapp-web)

## Features

### Customer Experience
#### Shopping & Discovery
- **Product Browsing**
  - Advanced search and filtering
  - Product categories and tags
  - Detailed product information
  - THC/CBD content display
  - Strain effects and characteristics
  - Customer reviews and ratings

- **Dispensary Discovery**
  - Location-based search
  - Operating hours
  - Menu availability
  - Delivery radius visualization
  - Favorite dispensary saving
  - Rating and review system

#### Ordering System
- **Shopping Cart**
  - Real-time inventory checks
  - Quantity adjustments
  - Save for later functionality
  - Product recommendations
  - Bundle deals detection

- **Checkout Process**
  - Multiple payment methods
    - Credit/Debit cards
    - ACH transfers
    - Cryptocurrency
  - Address verification
  - Delivery time selection
  - Special instructions
  - Tip customization
  - MMCC ID verification

- **Order Management**
  - Real-time order tracking
  - Live chat with drivers
  - Order history
  - Reorder functionality
  - Delivery status notifications
  - Digital receipts

### Delivery Driver (Buddy) Features
#### Order Management
- **Order Processing**
  - Real-time order notifications
  - Order acceptance/rejection
  - Pickup/delivery instructions
  - Customer communication
  - Digital signature capture
  - MMCC ID verification scanner

- **Navigation & Routing**
  - GPS-based location tracking
  - Optimized delivery routes
  - Turn-by-turn navigation
  - Real-time traffic updates
  - Multiple stop optimization
  - Geofencing alerts

#### Earnings & Performance
- **Financial Management**
  - Real-time earnings tracking
  - Daily/weekly summaries
  - Tip management
  - Multiple payout options
  - Transaction history
  - Tax documentation

- **Performance Metrics**
  - Delivery statistics
  - Customer ratings
  - Acceptance rate
  - On-time delivery rate
  - Customer feedback
  - Performance rewards

### Dispensary Integration
#### Inventory Management
- **Product Management**
  - Real-time inventory tracking
  - Low stock alerts
  - Batch tracking
  - Product categorization
  - Price management
  - Special offers/deals

- **Menu Control**
  - Real-time menu updates
  - Product availability toggle
  - Bulk product updates
  - Category management
  - Featured items
  - Daily specials

#### Order Processing
- **Order Management**
  - Real-time order notifications
  - Order status updates
  - Driver assignment
  - Delivery zone management
  - Priority ordering
  - Order analytics

- **Compliance & Security**
  - MMCC compliance checks
  - Purchase limit tracking
  - Age verification
  - License verification
  - Transaction logging
  - Security protocols

### Security & Compliance
- **User Security**
  - Two-factor authentication
  - Biometric login
  - Session management
  - Device tracking
  - Suspicious activity detection
  - Data encryption

- **Compliance**
  - MMCC regulations
  - Purchase limits
  - Age verification
  - License verification
  - Audit trails
  - Compliance reporting

### Analytics & Reporting
- **Business Intelligence**
  - Sales analytics
  - Customer insights
  - Driver performance
  - Inventory metrics
  - Financial reports
  - Market trends

- **Performance Monitoring**
  - Real-time dashboards
  - Custom report builder
  - Data visualization
  - Export capabilities
  - Automated reporting
  - KPI tracking

## Project Structure

```
grassapp-web/
├── src/
│   ├── app/                    # Next.js app router pages
│   ├── Budz/                   # Driver portal components
│   ├── components/             # Shared components
│   ├── store/                  # Redux store and slices
│   ├── types/                  # TypeScript type definitions
│   └── utils/                  # Utility functions
├── public/                     # Static assets
│   ├── images/
│   │   ├── products/          # Product images
│   │   │   ├── blue-dream.jpg
│   │   │   ├── wedding-cake.jpg
│   │   │   └── sour-diesel.jpg
│   │   └── dispensary-placeholder.jpg
│   ├── GrassAppLogo.png       # Main app logo
│   ├── GrassPassLogo.png      # GrassPass feature logo
│   ├── default-avatar.png     # Default profile picture
│   ├── apple-logo.png         # Auth provider logos
│   ├── google-logo.png
│   ├── facebook-logo.png
│   └── notification.mp3       # Order notification sound
└── package.json
```

## Required Assets

### Images
1. Branding
   - [ ] GrassAppLogo.png
   - [ ] GrassPassLogo.png

2. Authentication
   - [ ] apple-logo.png
   - [ ] google-logo.png
   - [ ] facebook-logo.png
   - [ ] default-avatar.png

3. Products
   - [ ] /images/products/blue-dream.jpg
   - [ ] /images/products/wedding-cake.jpg
   - [ ] /images/products/sour-diesel.jpg

4. Dispensary
   - [ ] /images/dispensary-placeholder.jpg
   - [ ] dispensary-storehouse.jpg
   - [ ] dispensary-default.jpg

### Audio
- [ ] notification.mp3 - Order notification sound

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/grassapp-web.git
cd grassapp-web
```

2. Install dependencies:
```bash
npm install
```

3. Add required assets:
- Place all image files in their respective directories under `/public`
- Ensure all required assets are present before starting the development server

4. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration.

5. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:3006

## Development

### Tech Stack
- **Frontend**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Maps**: MapLibre GL JS
- **Real-time Updates**: WebSocket
- **UI Components**: Headless UI
- **Icons**: Heroicons

### Key Features in Development
1. **Enhanced Security**
   - Two-factor authentication
   - Biometric verification
   - Advanced fraud detection

2. **Platform Expansion**
   - iOS/Android mobile apps
   - Dispensary management dashboard
   - Analytics platform

3. **User Experience**
   - AI-powered recommendations
   - Loyalty program
   - Social features

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.