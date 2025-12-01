const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
let PORT = parseInt(process.env.PORT, 10) || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.')); // Serve static files

// Initialize Database
const dbPath = path.join(__dirname, 'database', 'hydrisk.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

// Initialize Database Tables
function initializeDatabase() {
  // Contact Submissions Table
  db.run(`CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    service_type TEXT,
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'new',
    notes TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating contact_submissions table:', err.message);
    } else {
      console.log('Contact submissions table ready.');
    }
  });

  // Newsletter Subscriptions Table
  db.run(`CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    subscription_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active',
    source TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating newsletter_subscriptions table:', err.message);
    } else {
      console.log('Newsletter subscriptions table ready.');
    }
  });

  // Service Inquiries Table
  db.run(`CREATE TABLE IF NOT EXISTS service_inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    service_type TEXT NOT NULL,
    project_details TEXT,
    location TEXT,
    budget_range TEXT,
    inquiry_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'new',
    assigned_to TEXT,
    notes TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating service_inquiries table:', err.message);
    } else {
      console.log('Service inquiries table ready.');
    }
  });

  // Website Analytics/Visits Table (optional)
  db.run(`CREATE TABLE IF NOT EXISTS website_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page_url TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address TEXT,
    visit_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating website_visits table:', err.message);
    } else {
      console.log('Website visits table ready.');
    }
  });
}

// API Routes

// Contact Form Submission
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message, serviceType } = req.body;

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'Name, email, and message are required.' 
    });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid email address.' 
    });
  }

  const sql = `INSERT INTO contact_submissions (name, email, phone, subject, message, service_type) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [name, email, phone || null, subject || null, message, serviceType || null], function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to save contact submission.' 
      });
    }

    console.log(`Contact submission saved with ID: ${this.lastID}`);
    res.json({ 
      success: true, 
      message: 'Thank you for your message! We will get back to you soon.',
      submissionId: this.lastID
    });
  });
});

// Newsletter Subscription
app.post('/api/newsletter', (req, res) => {
  const { email, name, source } = req.body;

  if (!email) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email is required.' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid email address.' 
    });
  }

  const sql = `INSERT OR IGNORE INTO newsletter_subscriptions (email, name, source) 
               VALUES (?, ?, ?)`;
  
  db.run(sql, [email, name || null, source || 'website'], function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to subscribe to newsletter.' 
      });
    }

    if (this.changes === 0) {
      return res.json({ 
        success: true, 
        message: 'You are already subscribed to our newsletter!',
        alreadySubscribed: true
      });
    }

    console.log(`Newsletter subscription saved with ID: ${this.lastID}`);
    res.json({ 
      success: true, 
      message: 'Successfully subscribed to our newsletter!',
      subscriptionId: this.lastID
    });
  });
});

// Service Inquiry Submission
app.post('/api/service-inquiry', (req, res) => {
  const { name, email, phone, company, serviceType, projectDetails, location, budgetRange } = req.body;

  if (!name || !email || !serviceType) {
    return res.status(400).json({ 
      success: false, 
      error: 'Name, email, and service type are required.' 
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid email address.' 
    });
  }

  const sql = `INSERT INTO service_inquiries (name, email, phone, company, service_type, project_details, location, budget_range) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(sql, [name, email, phone || null, company || null, serviceType, projectDetails || null, location || null, budgetRange || null], function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to save service inquiry.' 
      });
    }

    console.log(`Service inquiry saved with ID: ${this.lastID}`);
    res.json({ 
      success: true, 
      message: 'Thank you for your inquiry! We will contact you soon.',
      inquiryId: this.lastID
    });
  });
});

// Get Contact Submissions (Admin - should be protected in production)
app.get('/api/contacts', (req, res) => {
  const { status, limit = 50, offset = 0 } = req.query;
  
  let sql = 'SELECT * FROM contact_submissions';
  const params = [];

  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }

  sql += ' ORDER BY submission_date DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve contacts.' 
      });
    }
    res.json({ success: true, data: rows, count: rows.length });
  });
});

// Get Service Inquiries (Admin)
app.get('/api/inquiries', (req, res) => {
  const { status, serviceType, limit = 50, offset = 0 } = req.query;
  
  let sql = 'SELECT * FROM service_inquiries';
  const params = [];
  const conditions = [];

  if (status) {
    conditions.push('status = ?');
    params.push(status);
  }

  if (serviceType) {
    conditions.push('service_type = ?');
    params.push(serviceType);
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' ORDER BY inquiry_date DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve inquiries.' 
      });
    }
    res.json({ success: true, data: rows, count: rows.length });
  });
});

// Get Newsletter Subscriptions (Admin)
app.get('/api/newsletter', (req, res) => {
  const { status = 'active', limit = 100, offset = 0 } = req.query;
  
  const sql = 'SELECT * FROM newsletter_subscriptions WHERE status = ? ORDER BY subscription_date DESC LIMIT ? OFFSET ?';
  
  db.all(sql, [status, parseInt(limit), parseInt(offset)], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to retrieve subscriptions.' 
      });
    }
    res.json({ success: true, data: rows, count: rows.length });
  });
});

// Update Contact Status (Admin)
app.patch('/api/contacts/:id', (req, res) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  if (!status) {
    return res.status(400).json({ 
      success: false, 
      error: 'Status is required.' 
    });
  }

  const sql = 'UPDATE contact_submissions SET status = ?, notes = ? WHERE id = ?';
  
  db.run(sql, [status, notes || null, id], function(err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to update contact.' 
      });
    }

    if (this.changes === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Contact not found.' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Contact updated successfully.' 
    });
  });
});

// Statistics/Dashboard Data
app.get('/api/stats', (req, res) => {
  const stats = {};

  // Get counts
  db.get('SELECT COUNT(*) as count FROM contact_submissions', (err, row) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ success: false, error: 'Failed to get stats.' });
    }
    stats.totalContacts = row.count;

    db.get('SELECT COUNT(*) as count FROM service_inquiries', (err, row) => {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).json({ success: false, error: 'Failed to get stats.' });
      }
      stats.totalInquiries = row.count;

      db.get('SELECT COUNT(*) as count FROM newsletter_subscriptions WHERE status = "active"', (err, row) => {
        if (err) {
          console.error('Database error:', err.message);
          return res.status(500).json({ success: false, error: 'Failed to get stats.' });
        }
        stats.totalNewsletterSubscribers = row.count;

        db.get('SELECT COUNT(*) as count FROM contact_submissions WHERE status = "new"', (err, row) => {
          if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ success: false, error: 'Failed to get stats.' });
          }
          stats.newContacts = row.count;

          res.json({ success: true, data: stats });
        });
      });
    });
  });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'HYDRisk API is running',
    timestamp: new Date().toISOString()
  });
});

// Start Server — try next ports if current one is in use
let server = null;
const MAX_PORT_RETRIES = 5; // try +1 up to this many times
let portAttempts = 0;

function startServerOnPort(port) {
  server = app.listen(port, () => {
    console.log(`HYDRisk server is running on http://localhost:${port}`);
    console.log(`API endpoints available at http://localhost:${port}/api`);
  });

  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} already in use.`);
      if (portAttempts < MAX_PORT_RETRIES) {
        portAttempts += 1;
        const nextPort = port + 1;
        console.log(`Attempting to start on port ${nextPort} (attempt ${portAttempts}/${MAX_PORT_RETRIES})`);
        setTimeout(() => startServerOnPort(nextPort), 500);
      } else {
        console.error('Unable to start server — all ports occupied. Exiting.');
        process.exit(1);
      }
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });
}

startServerOnPort(PORT);

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

