const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

async function seed() {
  let db;
  try {
    const dbPath = path.resolve(__dirname, '../database/database.sqlite');
    
    // Ensure database directory exists
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    console.log('✅ Connected to SQLite');

    // 2. Create Tables (Reading from schema.sql)
    const schemaSQL = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
    
    // Split schema into individual queries and execute
    const queries = schemaSQL.split(';').filter(q => q.trim());
    for (let query of queries) {
      if (query.trim()) {
        await db.exec(query);
      }
    }
    console.log('✅ Schema created successfully');

    // 3. Seed Admin User
    const adminPassword = await bcrypt.hash('admin123', 10);
    const row = await db.get('SELECT * FROM users WHERE email = ?', ['admin@rythuroute.com']);
    
    if (!row) {
      await db.run(
        'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
        ['System Admin', 'admin@rythuroute.com', '0000000000', adminPassword, 'admin']
      );
      console.log('✅ Admin user created: admin@rythuroute.com / admin123');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    if (db) await db.close();
  }
}

seed();
