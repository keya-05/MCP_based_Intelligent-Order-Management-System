export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 animate-pop-in">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-tomato-500 to-crust-500 text-base shadow-sm">
        🍕
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm dark:bg-crust-800">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-crust-400 animate-bounce-dot dark:bg-crust-400"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
