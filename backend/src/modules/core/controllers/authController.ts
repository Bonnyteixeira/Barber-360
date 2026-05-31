import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';
import { getDbPool } from '../../../database/connection.js';

const JWT_SECRET = process.env.JWT_SECRET || 'BARBER_360_SUPER_SECRET_KEY_ENTERPRISE_9944';

export class AuthController {
  
  // 1. Register a Tenant and its owner administrator user
  static async register(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    const client = await pool.connect();
    
    try {
      const { tenantName, slug, name, email, password, phone } = req.body;

      if (!tenantName || !slug || !name || !email || !password) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Todos os campos obrigatórios (tenantName, slug, name, email, password) devem ser fornecidos.',
          errors: ['Missing required registration fields']
        });
      }

      await client.query('BEGIN');

      // Check if slug is already taken
      const checkSlug = await client.query('SELECT id FROM tenants WHERE slug = $1', [slug]);
      if (checkSlug.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          success: false,
          data: null,
          message: `O endereço da barbearia (slug) '${slug}' já está em uso por outro cliente.`,
          errors: ['Slug unique conflict']
        });
      }

      // Check if email already registered
      const checkEmail = await client.query('SELECT id FROM users WHERE email = $1', [email]);
      if (checkEmail.rows.length > 0) {
        await client.query('ROLLBACK');
        return res.status(409).json({
          success: false,
          data: null,
          message: 'Este endereço de e-mail já está registrado no Barber 360.',
          errors: ['Email unique conflict']
        });
      }

      // Create Tenant root
      const tenantResult = await client.query(
        'INSERT INTO tenants (name, slug, status) VALUES ($1, $2, \'trial\') RETURNING *',
        [tenantName, slug]
      );
      const tenant = tenantResult.rows[0];

      // Hash clear password securely
      const rounds = 12;
      const passwordHash = await bcrypt.hash(password, rounds);

      // Create Admin User mapped to this Tenant
      const userResult = await client.query(
        'INSERT INTO users (tenant_id, name, email, password_hash, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, is_active, created_at',
        [tenant.id, name, email, passwordHash, phone || null]
      );
      const user = userResult.rows[0];

      // Mapped roles 'barber_owner' as Admin
      await client.query(
        'INSERT INTO user_roles (user_id, role_id) VALUES ($1, \'barber_owner\')',
        [user.id]
      );

      // Initialize Tenant default Settings
      await client.query(
        'INSERT INTO settings (tenant_id, business_hours, notification_rules, ai_personality) VALUES ($1, $2, $3, $4)',
        [
          tenant.id,
          JSON.stringify({ weekday: '09:00-19:00', saturday: '09:00-18:00', sunday: 'closed' }),
          JSON.stringify({ notifyBeforeMinutes: 60 }),
          'Amigável, atencioso e focado em um atendimento ágil na barbearia.'
        ]
      );

      // Write Audit log
      await client.query(
        'INSERT INTO audit_logs (tenant_id, user_id, action, entity, entity_id, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [tenant.id, user.id, 'TENANT_REGISTER', 'tenants', tenant.id, req.ip || '127.0.0.1', req.headers['user-agent'] || null]
      );

      await client.query('COMMIT');

      // Generate Access JWT Token for session login
      const tokenPayload = {
        id: user.id,
        tenantId: tenant.id,
        email: user.email,
        roles: ['barber_owner']
      };
      
      const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });

      return res.status(201).json({
        success: true,
        data: {
          token: accessToken,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: ['barber_owner']
          },
          tenant: {
            id: tenant.id,
            name: tenant.name,
            slug: tenant.slug,
            status: tenant.status
          }
        },
        message: 'Tenant registrado e configurado com sucesso no Barber 360.',
        errors: []
      });

    } catch (e: any) {
      await client.query('ROLLBACK');
      next(e);
    } finally {
      client.release();
    }
  }

  // 2. User login authentication
  static async login(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          data: null,
          message: 'Por favor, envie o email e a senha para efetuar o login.',
          errors: ['Credentials missing']
        });
      }

      // Fetch user profile
      const userRes = await pool.query('SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL', [email]);
      if (userRes.rows.length === 0) {
        return res.status(401).json({
          success: false,
          data: null,
          message: 'E-mail ou senha incorretos.',
          errors: ['Authentication failure - User not found']
        });
      }

      const user = userRes.rows[0];

      // Check password hash match
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        // Record bad attempt inside audit trails
        await pool.query(
          'INSERT INTO audit_logs (tenant_id, user_id, action, entity, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6)',
          [user.tenant_id, user.id, 'LOGIN_FAILED', 'users', req.ip || '127.0.0.1', req.headers['user-agent'] || null]
        );
        return res.status(401).json({
          success: false,
          data: null,
          message: 'E-mail ou senha incorretos.',
          errors: ['Authentication failure - Invalid password']
        });
      }

      // Fetch user role memberships
      const rolesRes = await pool.query('SELECT role_id FROM user_roles WHERE user_id = $1', [user.id]);
      const roles = rolesRes.rows.map(r => r.role_id);

      // Generate credentials
      const tokenPayload = {
        id: user.id,
        tenantId: user.tenant_id,
        email: user.email,
        roles
      };

      const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1d' });
      const refreshToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

      // Save success audit log
      await pool.query(
        'INSERT INTO audit_logs (tenant_id, user_id, action, entity, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6)',
        [user.tenant_id, user.id, 'LOGIN_SUCCESS', 'users', req.ip || '127.0.0.1', req.headers['user-agent'] || null]
      );

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.json({
        success: true,
        data: {
          token: accessToken,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            roles
          },
          tenantId: user.tenant_id
        },
        message: 'Login realizado com sucesso.',
        errors: []
      });

    } catch (e: any) {
      next(e);
    }
  }

  // 3. Retrieve currently authenticated profile
  static async me(req: TenantRequest, res: Response, next: NextFunction) {
    const pool = getDbPool();
    try {
      if (!req.userClaims) {
        return res.status(401).json({
          success: false,
          data: null,
          message: 'Token expirado ou inválido.',
          errors: ['No claim block available']
        });
      }

      const userRes = await pool.query(
        'SELECT id, tenant_id, name, email, phone, is_active FROM users WHERE id = $1',
        [req.userClaims.id]
      );
      
      if (userRes.rows.length === 0) {
        return res.status(404).json({
          success: false,
          data: null,
          message: 'Usuário não encontrado no sistema.',
          errors: ['Claims point to dead user reference']
        });
      }

      const user = userRes.rows[0];

      return res.json({
        success: true,
        data: {
          user,
          roles: req.userClaims.roles,
          tenantId: req.tenantId
        },
        message: 'Perfil recuperado com sucesso.',
        errors: []
      });
    } catch (e: any) {
      next(e);
    }
  }
}
