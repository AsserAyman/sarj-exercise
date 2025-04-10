import { TabButtonProps } from "./types";

export function TabButton({
  isActive,
  onClick,
  disabled,
  icon,
  label,
}: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3.5 font-medium text-sm transition-all duration-200 cursor-pointer relative ${
        isActive
          ? "border-b-2 border-indigo-500 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
          : "text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 hover:shadow-sm"
      } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
      disabled={disabled}
    >
      <span className="flex items-center">
        {icon}
        {label}
      </span>
      {!disabled && !isActive && (
        <span className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-500/0 group-hover:bg-indigo-500/40 transition-all duration-200" />
      )}
    </button>
  );
}
