import { eventBus } from '../../../shared/events/eventBus.js';

export class StorageEvents {
  static emitFileUploaded(fileInfo: any) {
    eventBus.publish('campaign.sent', fileInfo);
  }
}
