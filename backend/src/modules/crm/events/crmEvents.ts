import { eventBus } from '../../../shared/events/eventBus.js';

export class CrmEvents {
  static emitVipUpgraded(client: any) {
    eventBus.publish('client.vip', client);
  }

  static emitInactiveFlagged(client: any) {
    eventBus.publish('client.inactive', client);
  }
}
