import { eventBus } from '../../../shared/events/eventBus.js';

export class CommunicationEvents {
  static emitMessageSent(message: any) {
    eventBus.publish('message.sent', message);
  }

  static emitMessageReceived(message: any) {
    eventBus.publish('message.received', message);
  }
}
