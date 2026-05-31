export class FinancialService {
  static splitCommission(price: number, rate: number): number {
    return parseFloat((price * (rate / 100)).toFixed(2));
  }
}
