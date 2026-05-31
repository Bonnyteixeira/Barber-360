import { Response, NextFunction } from 'express';
import { TenantRequest } from '../../../shared/middlewares/tenant.js';
import { eventBus } from '../../../shared/events/eventBus.js';

export class MarketingController {
  static async sendCampaign(req: TenantRequest, res: Response, next: NextFunction) {
    try {
      const { title, text, targetSegment } = req.body;
      
      const campaignPayload = {
        title,
        text,
        targetSegment,
        sent_at: new Date()
      };

      // Trigger campaign sent event
      eventBus.publish('campaign.sent', campaignPayload);

      return res.status(201).json({
        success: true,
        data: campaignPayload,
        message: 'Disparo de campanha de retenção feito com sucesso!',
        errors: []
      });
    } catch (e) {
      next(e);
    }
  }
}
