export interface ChatSession {
  id: string;
  tenant_id: string;
  client_id: string;
  status: 'active' | 'bot_handling' | 'manual' | 'closed';
  last_message_at?: Date;
  created_at: Date;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  sender: 'client' | 'bot' | 'human';
  content: string;
  created_at: Date;
}
