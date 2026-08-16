import type { ChatMessage } from "../lib/types";

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.sender === "user";

  return (
    <div className={`flex items-end gap-2 animate-pop-in ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-base shadow-sm ${
          isUser ? "bg-crust-200 dark:bg-crust-700" : "bg-gradient-to-br from-tomato-500 to-crust-500"
        }`}
      >
        {isUser ? "🙋" : "🍕"}
      </div>

      <div className={`flex max-w-[75%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
            isUser
              ? "rounded-br-sm bg-gradient-to-br from-tomato-500 to-tomato-600 text-white"
              : message.isError
              ? "rounded-bl-sm border border-tomato-200 bg-tomato-50 text-tomato-800 dark:border-tomato-800 dark:bg-tomato-950/40 dark:text-tomato-200"
              : "rounded-bl-sm bg-white text-crust-800 dark:bg-crust-800 dark:text-crust-100"
          }`}
        >
          {message.text}
        </div>
        <span className="px-1 text-[11px] text-crust-400 dark:text-crust-500">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}
