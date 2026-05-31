export class MarketingService {
  static computeDiscount(loyaltyPoints: number): number {
    return loyaltyPoints >= 100 ? 10.00 : 0.00;
  }
}
