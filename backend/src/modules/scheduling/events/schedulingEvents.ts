import { eventBus } from '../../../shared/events/eventBus.js';

export class SchedulingEvents {
  static emitCreated(appointment: any) {
    eventBus.publish('appointment.created', appointment);
  }

  static emitCancelled(appointment: any) {
    eventBus.publish('appointment.cancelled', appointment);
  }
}
