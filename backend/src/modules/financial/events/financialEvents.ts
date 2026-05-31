import { eventBus } from '../../../shared/events/eventBus.js';

export class FinancialEvents {
  static emitPaymentReceived(payload: any) {
    eventBus.publish('payment.received', payload);
  }
}
