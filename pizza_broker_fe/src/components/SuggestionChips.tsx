const SUGGESTIONS = [
  "What's the price of Margherita?",
  "How much is a Pepperoni pizza?",
  "Price of BBQ Chicken?",
  "Do you have Veggie Supreme?",
];

interface SuggestionChipsProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export function SuggestionChips({ onSelect, disabled }: SuggestionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-1">
      {SUGGESTIONS.map((s) => (
        <button
          key={s}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(s)}
          className="rounded-full border border-crust-200 bg-white px-3 py-1.5 text-xs font-medium text-crust-600 shadow-sm transition hover:border-tomato-300 hover:text-tomato-600 disabled:cursor-not-allowed disabled:opacity-50 dark:border-crust-700 dark:bg-crust-800 dark:text-crust-300 dark:hover:border-tomato-600 dark:hover:text-tomato-400"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
