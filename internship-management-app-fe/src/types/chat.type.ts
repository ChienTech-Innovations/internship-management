// Types cho Chat System

export interface ChatSession {
  id: string;
  userId: string;
  role: string;
  createdAt: string;
  messages?: Message[];
}

export enum SenderRole {
  USER = "user",
  ASSISTANT = "assistant"
}

export interface Message {
  id: string;
  sessionId: string;
  sender: SenderRole;
  content: string;
  createdAt: string;
}

export interface SendMessageResponse {
  userMessage: Message;
  assistantMessage: Message;
}
