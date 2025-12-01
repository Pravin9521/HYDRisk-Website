/**
 * Database Initialization Script
 * Creates the database and tables if they don't exist
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Create database directory if it doesn't exist
const dbDir = path.join(__dirname, '..', 'database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'hydrisk.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database.');
    initializeDatabase();
  }
});

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
      console.log('✓ Contact submissions table created.');
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
      console.log('✓ Newsletter subscriptions table created.');
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
      console.log('✓ Service inquiries table created.');
    }
  });

  // Website Visits Table
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
      console.log('✓ Website visits table created.');
    }
    
    // Close database after all tables are created
    setTimeout(() => {
      db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('\n✓ Database initialization complete!');
          console.log(`Database file: ${dbPath}`);
        }
        process.exit(0);
      });
    }, 1000);
  });
}

