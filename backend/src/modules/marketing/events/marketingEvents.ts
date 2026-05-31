import { eventBus } from '../../../shared/events/eventBus.js';

export class MarketingEvents {
  static emitPromoSent(promo: any) {
    eventBus.publish('campaign.sent', promo);
  }
}
