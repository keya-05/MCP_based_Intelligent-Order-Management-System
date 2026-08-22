import { useCallback, useEffect, useState } from "react";
import { askShopAgent, ApiError } from "../lib/api";
import type { ChatMessage } from "../lib/types";

const STORAGE_KEY = "pizza-broker-chat-history";

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  sender: "bot",
  text: "Hey there! I'm PizzaBot 🍕 Ask me about the price of anything on our menu, like \"How much is a Margherita?\"",
  timestamp: Date.now(),
};

function loadHistory(): ChatMessage[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME_MESSAGE];
    const parsed = JSON.parse(raw) as ChatMessage[];
    return parsed.length ? parsed : [WELCOME_MESSAGE];
  } catch {
    return [WELCOME_MESSAGE];
  }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(loadHistory);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      sender: "user",
      text: trimmed,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);

    try {
      const reply = await askShopAgent(trimmed);
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), sender: "bot", text: reply, timestamp: Date.now() },
      ]);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), sender: "bot", text: message, timestamp: Date.now(), isError: true },
      ]);
    } finally {
      setIsSending(false);
    }
  }, [isSending]);

  const clearChat = useCallback(() => {
    setMessages([{ ...WELCOME_MESSAGE, id: crypto.randomUUID(), timestamp: Date.now() }]);
  }, []);

  return { messages, isSending, sendMessage, clearChat };
}
