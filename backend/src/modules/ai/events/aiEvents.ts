import { eventBus } from '../../../shared/events/eventBus.js';

export class AiEvents {
  static emitAutomationTriggered(clientId: string, type: string) {
    eventBus.publish('campaign.sent', {
      clientId,
      type,
      channel: 'automated_ai'
    });
  }
}
