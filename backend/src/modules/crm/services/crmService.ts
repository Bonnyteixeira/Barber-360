export class CrmService {
  static computeClassification(appointmentsCount: number, spent: number): 'regular' | 'vip' {
    if (appointmentsCount >= 10 || spent > 500) {
      return 'vip';
    }
    return 'regular';
  }
}
