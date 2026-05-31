import { eventBus } from '../../../shared/events/eventBus.js';

export class CoreEvents {
  static publishUserRegistered(user: any) {
    eventBus.publish('client.created', {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      source: 'registration'
    });
  }
}
