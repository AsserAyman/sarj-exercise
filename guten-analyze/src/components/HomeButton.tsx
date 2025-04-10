interface HomeButtonProps {
  resetToLanding: () => void;
  isLoading: boolean;
  showButton: boolean;
}

export function HomeButton({
  resetToLanding,
  isLoading,
  showButton,
}: HomeButtonProps) {
  if (!showButton) return null;

  return (
    <button
      onClick={resetToLanding}
      className="absolute top-6 left-6 p-3 rounded-full bg-black border border-indigo-500 hover:border-indigo-400 hover:bg-gray-900 hover:scale-105 hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-lg shadow-indigo-500/10 z-20"
      aria-label="Return to home page"
      disabled={isLoading}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 text-white"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    </button>
  );
}
