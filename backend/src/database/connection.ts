import pg from 'pg';
import winston from 'winston';

const { Pool } = pg;

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console()
  ]
});

let pool: pg.Pool | null = null;

export function getDbPool(): pg.Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;

  // Safe fallback if PostgreSQL database is not connected/provisioned yet
  if (!connectionString || connectionString.includes('YOUR_DATABASE_URL')) {
    logger.warn('DATABASE_URL is missing or empty. Initializing in-memory fallback connection pool.');
    // Create a dummy pool that returns fake query methods to prevent startup crash
    const dummyPool = {
      query: async (text: string, params?: any[]) => {
        logger.info(`[Database Fallback Query]: ${text.substring(0, 150)}...`, { params });
        return { rows: [], rowCount: 0 };
      },
      connect: async () => {
        return {
          query: async (text: string, params?: any[]) => ({ rows: [], rowCount: 0 }),
          release: () => {}
        };
      },
      on: () => {},
      end: async () => {}
    };
    return dummyPool as unknown as pg.Pool;
  }

  pool = new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });

  pool.on('error', (err) => {
    logger.error('Unexpected database client error in connection pool', err);
  });

  return pool;
}
