const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');

const fs = require('fs');
const dbPath = path.resolve(__dirname, '../../../database/database.sqlite');

let dbInstance = null;

async function getDbConnection() {
  if (dbInstance) {
    return dbInstance;
  }

  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  dbInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });
  
  // Enable foreign keys
  await dbInstance.exec('PRAGMA foreign_keys = ON');
  
  return dbInstance;
}

// Emulate a mysql2-like interface to minimize changes in other files
const pool = {
  getConnection: async () => {
    const db = await getDbConnection();
    return {
      beginTransaction: async () => await db.exec('BEGIN TRANSACTION'),
      commit: async () => await db.exec('COMMIT'),
      rollback: async () => await db.exec('ROLLBACK'),
      execute: async (sql, params) => {
        // SQLite expects ? but sometimes behavior varies for SELECT vs INSERT
        // SQLite wrapper 'run' vs 'all'. We'll parse the query.
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
          const rows = await db.all(sql, params);
          return [rows]; // Emulate [rows, fields]
        } else {
          const result = await db.run(sql, params);
          return [{ insertId: result.lastID, affectedRows: result.changes }];
        }
      },
      release: () => {} // No-op for SQLite
    };
  },
  execute: async (sql, params) => {
    const db = await getDbConnection();
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      const rows = await db.all(sql, params);
      return [rows];
    } else {
      const result = await db.run(sql, params);
      return [{ insertId: result.lastID, affectedRows: result.changes }];
    }
  }
};

module.exports = pool;
