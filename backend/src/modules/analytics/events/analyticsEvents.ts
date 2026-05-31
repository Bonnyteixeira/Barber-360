import { eventBus } from '../../../shared/events/eventBus.js';

export class AnalyticsEvents {
  static emitReportCompiled(payload: any) {
    eventBus.publish('payment.received', payload);
  }
}
