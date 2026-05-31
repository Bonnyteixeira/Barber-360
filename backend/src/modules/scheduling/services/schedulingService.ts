export class SchedulingService {
  static validateBusinessHours(time: Date): boolean {
    const hour = time.getHours();
    return hour >= 8 && hour < 22;
  }
}
