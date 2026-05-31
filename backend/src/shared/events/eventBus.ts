import { EventEmitter } from 'events';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [new winston.transports.Console()]
});

class SharedEventBus extends EventEmitter {
  constructor() {
    super();
    this.setupDefaultListeners();
  }

  private setupDefaultListeners() {
    const defaultEvents = [
      'appointment.created',
      'appointment.updated',
      'appointment.cancelled',
      'client.created',
      'client.vip',
      'client.inactive',
      'payment.received',
      'campaign.sent',
      'message.received',
      'message.sent'
    ];

    defaultEvents.forEach((event) => {
      this.on(event, (data) => {
        logger.info(`[EventBus] Event Published: ${event}`, { data });
      });
    });
  }

  public publish(event: string, data: any) {
    this.emit(event, data);
  }
}

export const eventBus = new SharedEventBus();
