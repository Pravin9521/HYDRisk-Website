# HYDRisk Website - Database Setup & Deployment Instructions

## Quick Start

### 1. Install Node.js Dependencies
```bash
npm install
```

### 2. Initialize Database
```bash
npm run init-db
```

This will create the `database/` folder and `hydrisk.db` SQLite database file.

### 3. Start the Server
```bash
# Development mode (auto-reload on changes)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000`

## Database Structure

The database stores:
- **Contact Form Submissions** - All contact form messages
- **Newsletter Subscriptions** - Email subscriptions
- **Service Inquiries** - Detailed service inquiries
- **Website Visits** - Optional analytics data

## Frontend Integration

All contact forms are now configured to submit to the API. The forms will:
1. Validate input on the client side
2. Submit to `/api/contact` endpoint
3. Store data in the database
4. Show success/error messages

## API Endpoints

- `POST /api/contact` - Submit contact form
- `POST /api/newsletter` - Subscribe to newsletter
- `POST /api/service-inquiry` - Submit service inquiry
- `GET /api/contacts` - Get all contacts (admin)
- `GET /api/inquiries` - Get all inquiries (admin)
- `GET /api/stats` - Get statistics
- `GET /api/health` - Health check

## Production Deployment

### Option 1: Same Server (Recommended)
1. Run the Node.js server on the same domain as your website
2. Forms will automatically submit to the API
3. No CORS issues

### Option 2: Separate API Server
1. Deploy API to a subdomain (e.g., `api.hydrisk.com`)
2. Update `API_BASE_URL` in `js/api-handler.js`
3. Configure CORS on the server

### Environment Variables
Create a `.env` file:
```
PORT=3000
NODE_ENV=production
DB_PATH=./database/hydrisk.db
```

## Database Backup

To backup your database:
```bash
cp database/hydrisk.db database/hydrisk_backup_$(date +%Y%m%d).db
```

## Viewing Database Data

You can use SQLite browser tools or command line:
```bash
sqlite3 database/hydrisk.db
.tables
SELECT * FROM contact_submissions;
```

## Security Notes

- Add authentication for admin endpoints in production
- Implement rate limiting
- Use HTTPS
- Sanitize all inputs (already done)
- Add CAPTCHA for forms (recommended)

## Troubleshooting

**Database not created?**
- Check if `database/` folder exists
- Check file permissions
- Run `npm run init-db` manually

**Forms not submitting?**
- Check if server is running
- Check browser console for errors
- Verify API endpoint is accessible
- Check CORS settings if using separate domain

**Port already in use?**
- Change PORT in `.env` file
- Or kill the process using port 3000

