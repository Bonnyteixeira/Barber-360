import Stripe from 'stripe';

export class BillingService {
  static getStripeClient() {
    const key = process.env.STRIPE_SECRET_KEY || 'mock_key';
    return new Stripe(key, { apiVersion: '2025-01-27' as any });
  }
}
