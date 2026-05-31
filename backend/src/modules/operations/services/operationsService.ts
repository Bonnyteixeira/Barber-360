export class OperationsService {
  static formatIp(ip: string): string {
    return ip === '::1' ? '127.0.0.1' : ip;
  }
}
