const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

async function seed() {
  const isPostgres = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);

  if (isPostgres) {
    const { Client: PgClient } = require('pg');
    const connStr = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    const client = new PgClient({
      connectionString: connStr,
      ssl: connStr.includes('localhost') ? false : { rejectUnauthorized: false }
    });

    try {
      await client.connect();
      console.log('✅ Connected to Cloud PostgreSQL Database');

      // Create Tables
      let schemaSQL = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
      // Convert SQLite syntax to PostgreSQL syntax
      schemaSQL = schemaSQL
        .replace(/INTEGER PRIMARY KEY AUTOINCREMENT/gi, 'SERIAL PRIMARY KEY')
        .replace(/REAL/gi, 'NUMERIC(10,2)');

      const queries = schemaSQL.split(';').filter(q => q.trim());
      for (let query of queries) {
        if (query.trim()) {
          try {
            await client.query(query);
          } catch (e) {
            // Ignore if table/constraint already exists
          }
        }
      }
      console.log('✅ PostgreSQL Schema initialized successfully');

      // Seed Admin User
      const adminPassword = await bcrypt.hash('admin123', 10);
      const res = await client.query('SELECT * FROM users WHERE email = $1', ['admin@rythuroute.com']);
      if (res.rows.length === 0) {
        await client.query(
          'INSERT INTO users (name, email, phone, password, role) VALUES ($1, $2, $3, $4, $5)',
          ['System Admin', 'admin@rythuroute.com', '0000000000', adminPassword, 'admin']
        );
        console.log('✅ Admin user created: admin@rythuroute.com / admin123');
      } else {
        console.log('ℹ️ Admin user already exists');
      }

      console.log('🎉 Cloud Database Ready & Permanent!');
    } catch (err) {
      console.error('❌ PostgreSQL Seeding failed:', err);
    } finally {
      await client.end();
    }

  } else {
    // Local SQLite fallback
    let db;
    try {
      const dbPath = path.resolve(__dirname, '../database/database.sqlite');
      const dbDir = path.dirname(dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      db = await open({
        filename: dbPath,
        driver: sqlite3.Database
      });

      console.log('✅ Connected to SQLite');

      const schemaSQL = fs.readFileSync(path.join(__dirname, '../database/schema.sql'), 'utf8');
      const queries = schemaSQL.split(';').filter(q => q.trim());
      for (let query of queries) {
        if (query.trim()) {
          await db.exec(query);
        }
      }
      console.log('✅ Schema created successfully');

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
}

seed();
