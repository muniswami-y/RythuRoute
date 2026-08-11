const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');
const { Pool: PgPool } = require('pg');

const dbPath = path.resolve(__dirname, '../../../database/database.sqlite');
const isPostgres = !!(process.env.DATABASE_URL || process.env.POSTGRES_URL);

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
    const connStr = process.env.DATABASE_URL || process.env.POSTGRES_URL;
    pgPoolInstance = new PgPool({
      connectionString: connStr,
      ssl: connStr.includes('localhost') ? false : { rejectUnauthorized: false }
    });
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
    } else {
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
    }
  },
  execute: async (sql, params = []) => {
    if (isPostgres) {
      const p = getPgPool();
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
    } else {
      const db = await getSqliteConnection();
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const rows = await db.all(sql, params);
        return [rows];
      } else {
        const result = await db.run(sql, params);
        return [{ insertId: result.lastID, affectedRows: result.changes }];
      }
    }
  }
};

module.exports = pool;
