# QR Payment System - Running Servers

## Current Status ✅

Both backend and frontend servers are now running successfully!

### Backend Server
- **URL**: http://localhost:8080
- **Admin Panel**: http://localhost:8080/admin
- **API Endpoint**: http://localhost:8080/api/settings/
- **Status**: Running ✅

### Frontend Server
- **URL**: http://localhost:5176
- **Status**: Running ✅
- **API Proxy**: Configured to http://localhost:8080

## How to Access

1. **Home Page (QR Code)**: http://localhost:5176
   - Shows QR code that points to `https://realedgeventure.com/pay`
   - Clickable to navigate to payment page

2. **Payment Page**: http://localhost:5176/pay
   - User details form (name, email, phone, country)
   - Amount section with currency selector
   - Payment methods:
     - M-Pesa (Till Number)
     - PayPal
     - Card Payment

3. **Django Admin**: http://localhost:8080/admin
   - Configure company settings
   - Manage till number, PayPal email, support contacts
   - Customize theme colors

## Testing the System

1. Visit http://localhost:5176
2. Click on QR code or navigate to http://localhost:5176/pay
3. Fill in user details:
   - First Name, Last Name, Email
   - Phone number (with country code selector)
   - Country (searchable dropdown)
4. Enter amount and select currency
5. Choose payment method:
   - **M-Pesa**: Enter till number, click "Pay via M-Pesa"
   - **PayPal**: Click "Pay with PayPal"
   - **Card**: Enter card details, click "Pay with Card"

## Configuration

Access Django admin at http://localhost:8080/admin to configure:

- Company name and logo
- M-Pesa till number
- PayPal email address
- Support contact information
- Theme colors (primary/secondary)

## Troubleshooting

If servers stop:

**Start Backend:**
```bash
cd qr-payment-system/backend
python manage.py runserver 8080
```

**Start Frontend:**
```bash
cd qr-payment-system/frontend
npm run dev
```

## Notes

- Frontend is running on port 5176 (not default 5173 which was in use)
- Backend is running on port 8080 (port 8000 was in use by another project)
- API proxy is configured in `frontend/vite.config.js`
- All payment methods are enabled by default