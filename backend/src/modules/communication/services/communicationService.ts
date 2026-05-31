export class CommunicationService {
  static formatWhatsAppAlert(clientName: string, time: string, barberName: string): string {
    return `Olá ${clientName}! Passando para lembrar do seu horário agendado com ${barberName} às ${time}. Confirmado?`;
  }
}
