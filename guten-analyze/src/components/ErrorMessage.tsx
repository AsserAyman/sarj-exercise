interface ErrorMessageProps {
  message: string | null;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="p-4 bg-red-900/20 borderborder-red-800 rounded-md text-red-400">
      <p className="font-medium">Error</p>
      <p>{message}</p>
    </div>
  );
}
