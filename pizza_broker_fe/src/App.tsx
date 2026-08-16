import { useEffect, useRef, useState } from "react";
import { Header } from "./components/Header";
import { ChatBubble } from "./components/ChatBubble";
import { TypingIndicator } from "./components/TypingIndicator";
import { SuggestionChips } from "./components/SuggestionChips";
import { ChatInput } from "./components/ChatInput";
import { useChat } from "./hooks/useChat";
import { useBackendStatus } from "./hooks/useBackendStatus";

const THEME_KEY = "pizza-broker-theme";

function useDarkMode() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem(THEME_KEY) === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((d) => !d) };
}

function App() {
  const { messages, isSending, sendMessage, clearChat } = useChat();
  const status = useBackendStatus();
  const { isDark, toggle } = useDarkMode();
  const [draft, setDraft] = useState("");
  const scrollAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSend = () => {
    if (!draft.trim() || isSending) return;
    sendMessage(draft);
    setDraft("");
  };

  return (
    <div className="flex h-dvh flex-col bg-crust-50 dark:bg-crust-950">
      <Header status={status} isDark={isDark} onToggleDark={toggle} onClearChat={clearChat} />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col overflow-hidden">
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
          {messages.map((m) => (
            <ChatBubble key={m.id} message={m} />
          ))}
          {isSending && <TypingIndicator />}
          <div ref={scrollAnchorRef} />
        </div>

        <div className="space-y-3 px-4 pb-2 sm:px-6">
          <SuggestionChips onSelect={sendMessage} disabled={isSending} />
        </div>

        <ChatInput value={draft} onChange={setDraft} onSend={handleSend} disabled={isSending} />
      </main>
    </div>
  );
}

export default App;
