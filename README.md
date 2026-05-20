# QR Payment System - RealEdge Africa Venture ltd

A modern, production-ready QR code payment system with support for M-Pesa, PayPal, and card payments.

## Features

✅ **QR Code Payment** - Scan to pay directly at `https://realedgeventure.com/pay`
✅ **M-Pesa Integration** - Buy Goods till number payments
✅ **PayPal Integration** - Quick PayPal checkout
✅ **Card Payments** - Visa, Mastercard with 3D Secure
✅ **Multi-Currency** - KES, USD, EUR, GBP, NGN, ZAR, INR, and more
✅ **Global Country Support** - Searchable country dropdown with 20+ countries
✅ **Responsive Design** - Mobile-first lilac purple theme
✅ **Company Settings** - Configurable till number, PayPal email, support contacts
✅ **WhatsApp Support** - Built-in support button

## Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS + Framer Motion
- **Backend**: Django 4.2 + Django REST Framework
- **Database**: SQLite3 (development) / PostgreSQL (production)
- **Payment Libraries**: react-phone-number-input, react-select

## Quick Start

### Prerequisites

- Node.js 16+ and npm
- Python 3.8+ and pip

### Backend Setup

```bash
cd qr-payment-system/backend

# Install dependencies
pip install -r requirements.txt --break-system-packages

# Run migrations
python manage.py migrate

# Create superuser for admin access
python manage.py createsuperuser

# Start development server
python manage.py runserver
```

Backend will be available at `http://localhost:8000`
Admin panel at `http://localhost:8000/admin`

### Frontend Setup

```bash
cd qr-payment-system/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Build for Production

```bash
cd qr-payment-system/frontend
npm run build
```

Production files will be in `dist/` directory.

## Configuration

### Company Settings (via Django Admin)

Access `/admin` and configure:

1. **Company Information**
   - Name: Your company name
   - Description: Business description
   - Logo: URL to your logo

2. **M-Pesa Settings**
   - Till Number: Your M-Pesa buy goods till number
   - Till Name: Display name for the till

3. **PayPal Settings**
   - Enable PayPal: Toggle on/off
   - PayPal Email: Your PayPal receiving email

4. **Card Payment Settings**
   - Enable Card Payments: Toggle on/off

5. **Support Contact**
   - Support Email: Customer support email
   - Support Phone: Customer support phone
   - WhatsApp Number: WhatsApp support number (default: 254798400295)

6. **Theme & Security**
   - Primary Color: Main brand color (default: #9370ff)
   - Secondary Color: Accent color (default: #7d4fff)

## API Endpoints

- `GET /api/settings/` - Get company settings
- `POST /api/payment-session/` - Create payment session

## Deployment

### Environment Variables

Set these in production:

```
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=realedgeventure.com,www.realedgeventure.com
```

### CORS Configuration

Update `qr_payment_system/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "https://realedgeventure.com",
    "https://www.realedgeventure.com",
]
```

### Frontend Deployment

1. Build the frontend: `npm run build`
2. Deploy `dist/` folder to your web server
3. Configure reverse proxy to serve static files
4. Point domain to the server

### Backend Deployment

1. Use a production WSGI server (Gunicorn, uWSGI)
2. Use a production database (PostgreSQL recommended)
3. Set up SSL/TLS certificates
4. Configure static file serving

## QR Code Behavior

The QR code on the home page:
- Points to: `https://realedgeventure.com/pay`
- Clickable on desktop → opens payment page
- Scannable on mobile → opens payment page directly
- Shows all checkout fields properly

## Payment Flow

1. User scans QR code or visits `/pay`
2. Fills in personal details (name, email, phone, country)
3. Selects currency and enters amount
4. Chooses payment method:
   - **M-Pesa**: Enter till number, click "Pay via M-Pesa", follow instructions
   - **PayPal**: Click "Pay with PayPal", complete on PayPal
   - **Card**: Enter card details, click "Pay with Card"
5. Payment confirmation displayed

## Troubleshooting

### Phone Input Not Working
- Ensure `react-phone-number-input` is installed
- Check browser console for errors
- Verify country code selection

### Payment Methods Not Showing
- Check company settings in admin
- Ensure `paypal_enabled` or `card_enabled` is true
- Verify till number is set for M-Pesa

### Build Fails
- Clear node_modules: `rm -rf node_modules && npm install`
- Update dependencies: `npm update`
- Check Node.js version (16+ required)

## Support

For issues or questions:
- Email: support@realedgeventure.com
- WhatsApp: +254 798 400 295

## License

Proprietary - RealEdge Africa Venture ltd