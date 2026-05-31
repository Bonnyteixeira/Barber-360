import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import apiRouter from './routes.js';
import { errorHandler } from './shared/middlewares/errorHandler.js';
import { runMigrations } from './database/runMigrations.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT ? parseInt(process.env.BACKEND_PORT) : 3500;

// ==========================================
// 1. ENTERPRISE SECURITY MIDDLEWARES
// ==========================================

// Helmet secures the HTTP headers (XSS protector, frameguard, etc.)
app.use(helmet());

// Safe CORS origins definitions
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID'],
  credentials: true
}));

// Express Rate Limit prevents brute-force scenarios (DDoS prevention)
const enterpriseLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes bounding
  limit: 250, // Limit each client IP to 250 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: 'Muitas requisições enviadas a partir deste endereço IP. Por favor, aguarde 15 minutos e tente novamente.',
    errors: ['Rate limit exceeded']
  }
});
app.use('/api/', enterpriseLimiter);

// Parse JSON request payloads with strict body size bounds (protects against body payload bloat)
app.use(express.json({ limit: '2mb' }));

// ==========================================
// 2. MOUNT ROUTES
// ==========================================
app.use('/api/v1', apiRouter);

// Basic Welcome Check
app.get('/', (req, res) => {
  res.json({
    name: 'Barber 360 Enterprise API Platform',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    status: 'online'
  });
});

// ==========================================
// 3. GLOBAL ERROR HANDLER
// ==========================================
app.use(errorHandler);

// ==========================================
// 4. BOOTSTRAP DATABASE & SERVER
// ==========================================
async function startEnterpriseBackend() {
  try {
    console.log('[BOOT] Initializing Barber 360 Enterprise Backend Application...');
    
    // Auto-run schema migrations on boots
    await runMigrations();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`====================================================`);
      console.log(`[BOOT] SERVER RUNNING AT: http://localhost:${PORT}`);
      console.log(`[BOOT] Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('[CRITICAL BOOT ERROR] Failed to startup backend service:', error);
    process.exit(1);
  }
}

startEnterpriseBackend();
