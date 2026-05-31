export class AnalyticsService {
  static computeChangeRate(past: number, current: number): number {
    if (past === 0) return 100;
    return parseFloat((((current - past) / past) * 100).toFixed(1));
  }
}
