import type { BackendStatus } from "../hooks/useBackendStatus";

interface HeaderProps {
  status: BackendStatus;
  isDark: boolean;
  onToggleDark: () => void;
  onClearChat: () => void;
}

const STATUS_CONFIG: Record<BackendStatus, { label: string; dot: string }> = {
  checking: { label: "Connecting…", dot: "bg-amber-400" },
  online: { label: "Kitchen online", dot: "bg-basil-500" },
  offline: { label: "Kitchen offline", dot: "bg-tomato-500" },
};

export function Header({ status, isDark, onToggleDark, onClearChat }: HeaderProps) {
  const { label, dot } = STATUS_CONFIG[status];

  return (
    <header className="flex items-center justify-between gap-3 border-b border-black/5 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-white/10 dark:bg-crust-900/80 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-tomato-500 to-crust-500 text-xl shadow-sm">
          🍕
        </div>
        <div>
          <h1 className="font-display text-lg font-semibold leading-tight text-crust-900 dark:text-crust-50">
            Pizza Broker
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-crust-500 dark:text-crust-300">
            <span className={`h-1.5 w-1.5 rounded-full ${dot} ${status === "checking" ? "animate-pulse" : ""}`} />
            {label}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onClearChat}
          className="rounded-full px-3 py-2 text-xs font-medium text-crust-600 transition hover:bg-crust-100 dark:text-crust-300 dark:hover:bg-white/10"
          title="Clear chat"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onToggleDark}
          className="flex h-9 w-9 items-center justify-center rounded-full text-base transition hover:bg-crust-100 dark:hover:bg-white/10"
          title="Toggle theme"
          aria-label="Toggle dark mode"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
