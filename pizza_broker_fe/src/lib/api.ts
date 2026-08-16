import type { AgentRequest, AgentResponse } from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const REQUEST_TIMEOUT_MS = 15_000;

export class ApiError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "ApiError";
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
      throw new ApiError(`Shop agent responded with status ${res.status}`);
    }

    const data: AgentResponse = await res.json();
    return data.content;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("The kitchen is taking too long to reply. Please try again.", err);
    }
    throw new ApiError(
      "Couldn't reach the shop agent. Is the backend running on port 8000?",
      err
    );
  } finally {
    clearTimeout(timeout);
  }
}
