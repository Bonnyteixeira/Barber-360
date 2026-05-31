import { eventBus } from '../../../shared/events/eventBus.js';

export class OperationsEvents {
  static emitSystemAlert(alert: any) {
    eventBus.publish('campaign.sent', alert);
  }
}
