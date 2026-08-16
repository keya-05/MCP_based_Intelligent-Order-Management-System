export type Sender = "user" | "bot" | "system";

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface AgentRequest {
  sender: string;
  content: string;
}

export interface AgentResponse {
  sender: string;
  content: string;
}
