import type { AgentRequest, AgentResponse } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const REQUEST_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export async function askShopAgent(content: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const body: AgentRequest = { sender: "HungryAgent", content };

  try {
    const res = await fetch(`${API_BASE_URL}/a2a/message`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      console.error(`askShopAgent: backend responded with status ${res.status}`);
      if (res.status === 429) {
        throw new ApiError("You're sending messages a little fast — please wait a moment and try again.");
      }
      throw new ApiError("Something went wrong on our end. Please try again in a moment.");
    }

    const data: AgentResponse = await res.json();
    return data.content;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("The kitchen is taking too long to reply. Please try again.", err);
    }
    console.error("askShopAgent: network error", err);
    throw new ApiError(
      "Sorry, I couldn't reach PizzaBot right now. Please try again in a moment.",
      err
    );
  } finally {
    clearTimeout(timeout);
  }
}
