import { eventBus } from '../../../shared/events/eventBus.js';

export class BillingEvents {
  static emitSubscriptionCreated(payload: any) {
    eventBus.publish('payment.received', payload);
  }
}
