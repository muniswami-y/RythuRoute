const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, '../../../database/database.sqlite');
const dbUrl = (process.env.DATABASE_URL || process.env.POSTGRES_URL || '').trim();
let isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');

let sqliteInstance = null;
let pgPoolInstance = null;

async function getSqliteConnection() {
  if (sqliteInstance) return sqliteInstance;

  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  sqliteInstance = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await sqliteInstance.exec('PRAGMA foreign_keys = ON');
  return sqliteInstance;
}

function getPgPool() {
  if (!pgPoolInstance) {
    try {
      const { Pool: PgPool } = require('pg');
      pgPoolInstance = new PgPool({
        connectionString: dbUrl,
        ssl: dbUrl.includes('localhost') ? false : { rejectUnauthorized: false }
      });
    } catch (e) {
      console.warn('⚠️ pg module not found, falling back to SQLite database');
      isPostgres = false;
      return null;
    }
  }
  return pgPoolInstance;
}

function convertPlaceholders(sql) {
  let index = 1;
  return sql.replace(/\?/g, () => `$${index++}`);
}

const pool = {
  getConnection: async () => {
    if (isPostgres) {
      const p = getPgPool();
      if (p) {
        try {
          const client = await p.connect();
          return {
            beginTransaction: async () => await client.query('BEGIN'),
            commit: async () => await client.query('COMMIT'),
            rollback: async () => await client.query('ROLLBACK'),
            execute: async (sql, params = []) => {
              let converted = convertPlaceholders(sql);
              if (converted.trim().toUpperCase().startsWith('INSERT') && !converted.toUpperCase().includes('RETURNING')) {
                converted += ' RETURNING id';
              }
              const res = await client.query(converted, params);
              if (sql.trim().toUpperCase().startsWith('SELECT')) {
                return [res.rows];
              } else {
                const insertId = res.rows.length > 0 && res.rows[0].id ? res.rows[0].id : null;
                return [{ insertId, affectedRows: res.rowCount }];
              }
            },
            release: () => client.release()
          };
        } catch (err) {
          console.warn('⚠️ Cloud DB connection failed, falling back to SQLite:', err.message);
          isPostgres = false;
        }
      }
    }

    // SQLite fallback
    const db = await getSqliteConnection();
    return {
      beginTransaction: async () => await db.exec('BEGIN TRANSACTION'),
      commit: async () => await db.exec('COMMIT'),
      rollback: async () => await db.exec('ROLLBACK'),
      execute: async (sql, params = []) => {
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
          const rows = await db.all(sql, params);
          return [rows];
        } else {
          const result = await db.run(sql, params);
          return [{ insertId: result.lastID, affectedRows: result.changes }];
        }
      },
      release: () => {}
    };
  },
  execute: async (sql, params = []) => {
    if (isPostgres) {
      const p = getPgPool();
      if (p) {
        try {
          let converted = convertPlaceholders(sql);
          if (converted.trim().toUpperCase().startsWith('INSERT') && !converted.toUpperCase().includes('RETURNING')) {
            converted += ' RETURNING id';
          }
          const res = await p.query(converted, params);
          if (sql.trim().toUpperCase().startsWith('SELECT')) {
            return [res.rows];
          } else {
            const insertId = res.rows.length > 0 && res.rows[0].id ? res.rows[0].id : null;
            return [{ insertId, affectedRows: res.rowCount }];
          }
        } catch (err) {
          console.warn('⚠️ Cloud DB query failed, falling back to SQLite:', err.message);
          isPostgres = false;
        }
      }
    }

    const db = await getSqliteConnection();
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
