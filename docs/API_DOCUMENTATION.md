# FTTG AutoTech - API Documentation

## 🔌 API Overview

**Note**: For GitHub Pages deployment, the backend API is not used. This documentation is for reference and alternative deployment platforms.

## 🚫 GitHub Pages Status

❌ **API Endpoints NOT Available** on GitHub Pages
✅ **Form Submissions** handled by Formspree instead

---

## 🔄 Alternative: Formspree API

### Form Endpoints (Currently Used)

#### Booking Form
```http
POST https://formspree.io/f/xjkobqnw
Content-Type: application/json

{
  "name": "John Doe",
  "phone": "555-123-4567",
  "email": "john@example.com",
  "service": "Oil Change",
  "message": "Need appointment this week"
}
```

#### Contact Form
```http
POST https://formspree.io/f/xjkobqnw
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "subject": "Question about services",
  "message": "Do you offer mobile service?"
}
```

#### Consent Form
```http
POST https://formspree.io/f/manbywaz
Content-Type: application/json

{
  "consentChoice": "consent",
  "fullName": "Customer Name",
  "phoneNumber": "555-123-4567",
  "email": "customer@example.com"
}
```

---

## 🏗️ Backend API (Not Used in GitHub Pages)

*The following endpoints are available when deploying with a backend server (Vercel, Netlify, etc.)*

### Base URL
```
Local: http://localhost:3001
Production: https://your-backend-domain.com
```

---

### 📱 SMS Endpoints

#### Send SMS
```http
POST /api/twilio/sms
Content-Type: application/json

{
  "to": "+15551234567",
  "message": "Your appointment is confirmed",
  "type": "appointment"
}
```

**Response:**
```json
{
  "success": true,
  "sid": "SM1234567890abcdef",
  "status": "queued",
  "type": "appointment"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Phone number and message are required"
}
```

---

### 📞 Voice Call Endpoints

#### Initiate Call
```http
POST /api/twilio/call
Content-Type: application/json

{
  "to": "+15551234567",
  "type": "emergency"
}
```

**Response:**
```json
{
  "success": true,
  "sid": "CA1234567890abcdef",
  "status": "initiated",
  "type": "emergency"
}
```

---

### 🔊 Voice Webhook
```http
POST /api/twilio/voice-webhook?type=emergency
```

**Response (TwiML):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say>Thank you for calling FTTG AutoTech emergency line...</Say>
  <Dial>+15557843343</Dial>
</Response>
```

---

### 💬 SMS Webhook
```http
POST /api/twilio/webhook
Content-Type: application/x-www-form-urlencoded

From=%2B15551234567&Body=appointment&MessageSid=SM123
```

**Response (TwiML):**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Thanks for your message! For appointment scheduling...</Message>
</Response>
```

---

### 🚨 Emergency Call Log
```http
POST /api/emergency-call-log
Content-Type: application/json

{
  "timestamp": "2025-07-15T10:30:00Z",
  "userAgent": "Mozilla/5.0...",
  "page": "/index.html"
}
```

**Response:**
```json
{
  "success": true,
  "logged": true
}
```

---

### 🏥 Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "service": "FTTG AutoTech Twilio Service",
  "timestamp": "2025-07-15T10:30:00.000Z"
}
```

---

## 🔧 Configuration

### Environment Variables (Backend Only)
```bash
# Twilio Configuration
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+15557843343

# Business Configuration
BUSINESS_PHONE=+15557843343
BUSINESS_NAME="FTTG AutoTech"

# Server Configuration
PORT=3001
FRONTEND_URL=https://fttgautotech.com
```

---

## 📝 Request/Response Examples

### SMS Message Types

#### Appointment Confirmation
```json
{
  "to": "+15551234567",
  "message": "Hi John! Your appointment with FTTG AutoTech is confirmed for July 16 at 2:00 PM. Service: Oil Change. Reply STOP to opt out.",
  "type": "appointmentConfirmation"
}
```

#### Appointment Reminder
```json
{
  "to": "+15551234567",
  "message": "Reminder: Your FTTG AutoTech appointment is tomorrow at 2:00 PM. Service: Oil Change. Questions? Call (855) 578-4334",
  "type": "appointmentReminder"
}
```

---

### Voice Call Types

#### Emergency Call
- **Response**: Connects to business phone immediately
- **Message**: "Thank you for calling FTTG AutoTech emergency line..."

#### Appointment Call
- **Response**: Connects to business phone
- **Message**: "Thank you for calling FTTG AutoTech regarding your appointment..."

#### General Call
- **Response**: Plays business hours message then connects
- **Message**: "Thank you for calling FTTG AutoTech. Our hours are..."

---

## 🔐 Authentication

### API Security
- **No authentication required** for webhooks (Twilio handles verification)
- **CORS protection** for frontend requests
- **Rate limiting** via Twilio
- **Input validation** on all endpoints

### Webhook Security
```javascript
// Twilio webhook signature verification (when implemented)
const crypto = require('crypto');

function validateTwilioSignature(signature, url, params, authToken) {
  const expectedSignature = crypto
    .createHmac('sha1', authToken)
    .update(Buffer.from(url + params, 'utf-8'))
    .digest('base64');
  return signature === expectedSignature;
}
```

---

## 📊 Error Handling

### Standard Error Responses
```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "timestamp": "2025-07-15T10:30:00.000Z"
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (missing parameters)
- `401` - Unauthorized
- `500` - Internal Server Error
- `404` - Endpoint not found

---

## 🧪 Testing

### Test SMS Endpoint
```bash
curl -X POST http://localhost:3001/api/twilio/sms \
  -H "Content-Type: application/json" \
  -d '{
    "to": "+15551234567",
    "message": "Test message",
    "type": "test"
  }'
```

### Test Health Check
```bash
curl http://localhost:3001/api/health
```

---

## 🔄 Migration Guide

### From Backend API to Formspree

#### Before (Backend Required):
```javascript
fetch('/api/twilio/sms', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

#### After (GitHub Pages Compatible):
```javascript
fetch('https://formspree.io/f/xjkobqnw', {
  method: 'POST',
  body: JSON.stringify(data)
});
```

Your current setup uses Formspree exclusively, making it GitHub Pages compatible! 🚀
