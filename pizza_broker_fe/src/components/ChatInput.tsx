import { useRef, type KeyboardEvent } from "react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSend, disabled }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex items-end gap-2 border-t border-black/5 bg-white/80 p-3 backdrop-blur-md dark:border-white/10 dark:bg-crust-900/80 sm:p-4">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask about a pizza's price…"
        rows={1}
        className="max-h-32 flex-1 resize-none rounded-2xl border border-crust-200 bg-white px-4 py-2.5 text-sm text-crust-800 placeholder:text-crust-400 focus:border-tomato-400 focus:outline-none focus:ring-2 focus:ring-tomato-100 disabled:opacity-60 dark:border-crust-700 dark:bg-crust-800 dark:text-crust-100 dark:placeholder:text-crust-500 dark:focus:ring-tomato-900"
      />
      <button
        type="button"
        onClick={onSend}
        disabled={disabled || !value.trim()}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-tomato-500 to-tomato-600 text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Send message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 -translate-x-px">
          <path d="M3.4 20.4l17.45-7.48a1 1 0 000-1.84L3.4 3.6a1 1 0 00-1.39 1.09L4.5 12l-2.49 7.31a1 1 0 001.39 1.09z" />
        </svg>
      </button>
    </div>
  );
}
