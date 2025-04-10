interface BookPreviewTabProps {
  text: string | null;
}

export function BookPreviewTab({ text }: BookPreviewTabProps) {
  if (!text) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Book Preview
      </h2>
      <div className="prose dark:prose-invert max-w-none">
        <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-50 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-96">
          {text}
        </pre>
        <p className="text-right mt-2">
          <span className="text-gray-500 dark:text-gray-400">
            {text.length.toLocaleString()} characters
          </span>
        </p>
      </div>
    </div>
  );
}
