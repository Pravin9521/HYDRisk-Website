# HYDRisk Website - Backend API Documentation

## Overview
This backend API handles contact form submissions, newsletter subscriptions, service inquiries, and stores all data in a SQLite database.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Database
The database will be automatically created when you start the server. Alternatively, you can run:
```bash
npm run init-db
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and update with your settings:
```bash
cp .env.example .env
```

### 4. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000`

## Database Schema

### contact_submissions
- `id` - Primary key
- `name` - Contact name
- `email` - Contact email
- `phone` - Contact phone (optional)
- `subject` - Message subject (optional)
- `message` - Message content
- `service_type` - Type of service inquired about (optional)
- `submission_date` - Timestamp
- `status` - Status (new, read, replied, archived)
- `notes` - Admin notes (optional)

### newsletter_subscriptions
- `id` - Primary key
- `email` - Subscriber email (unique)
- `name` - Subscriber name (optional)
- `subscription_date` - Timestamp
- `status` - Status (active, unsubscribed)
- `source` - Where subscription came from

### service_inquiries
- `id` - Primary key
- `name` - Inquirer name
- `email` - Inquirer email
- `phone` - Phone number (optional)
- `company` - Company name (optional)
- `service_type` - Type of service
- `project_details` - Project description
- `location` - Project location (optional)
- `budget_range` - Budget range (optional)
- `inquiry_date` - Timestamp
- `status` - Status (new, contacted, quoted, closed)
- `assigned_to` - Assigned team member (optional)
- `notes` - Internal notes (optional)

### website_visits
- `id` - Primary key
- `page_url` - Page visited
- `referrer` - Referrer URL
- `user_agent` - Browser user agent
- `ip_address` - Visitor IP
- `visit_date` - Timestamp
- `session_id` - Session identifier

## API Endpoints

### Contact Form
**POST** `/api/contact`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "Inquiry",
  "message": "I need help with flood risk assessment",
  "serviceType": "FRA"
}
```

### Newsletter Subscription
**POST** `/api/newsletter`
```json
{
  "email": "john@example.com",
  "name": "John Doe",
  "source": "homepage"
}
```

### Service Inquiry
**POST** `/api/service-inquiry`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "company": "ABC Corp",
  "serviceType": "Flood Risk Assessment",
  "projectDetails": "Solar PV plant flood risk analysis",
  "location": "California, USA",
  "budgetRange": "$10,000 - $50,000"
}
```

### Get Contacts (Admin)
**GET** `/api/contacts?status=new&limit=50&offset=0`

### Get Service Inquiries (Admin)
**GET** `/api/inquiries?status=new&serviceType=FRA&limit=50&offset=0`

### Get Newsletter Subscriptions (Admin)
**GET** `/api/newsletter?status=active&limit=100&offset=0`

### Update Contact Status (Admin)
**PATCH** `/api/contacts/:id`
```json
{
  "status": "read",
  "notes": "Followed up via email"
}
```

### Get Statistics
**GET** `/api/stats`
Returns total counts of contacts, inquiries, newsletter subscribers, and new contacts.

### Health Check
**GET** `/api/health`

## Frontend Integration

Update your contact forms to submit to the API:

```javascript
// Example: Contact Form Submission
async function submitContactForm(formData) {
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Show success message
      console.log('Success:', result.message);
    } else {
      // Show error message
      console.error('Error:', result.error);
    }
  } catch (error) {
    console.error('Network error:', error);
  }
}
```

## Database Location
The SQLite database file is stored in: `./database/hydrisk.db`

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a production database (PostgreSQL/MySQL) instead of SQLite
3. Add authentication for admin endpoints
4. Set up SSL/HTTPS
5. Configure proper CORS settings
6. Add rate limiting
7. Set up email notifications for new submissions

## Security Notes

- In production, add authentication middleware for admin endpoints
- Implement rate limiting to prevent spam
- Sanitize all user inputs
- Use prepared statements (already implemented)
- Add CSRF protection
- Validate and sanitize email addresses
- Consider adding CAPTCHA for forms

