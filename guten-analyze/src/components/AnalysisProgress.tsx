interface AnalysisProgressProps {
  analysisStep:
    | "idle"
    | "fetchingMetadata"
    | "fetchingText"
    | "analyzing"
    | "complete";
}

export function AnalysisProgress({ analysisStep }: AnalysisProgressProps) {
  const analysisSteps = [
    {
      id: "fetchingMetadata",
      label: "Metadata",
      description: "Fetching book metadata",
    },
    {
      id: "fetchingText",
      label: "Book Text",
      description: "Downloading book content",
    },
    {
      id: "analyzing",
      label: "Analysis",
      description: "Identifying characters & relationships",
    },
  ];

  const getAnalysisStatusText = () => {
    switch (analysisStep) {
      case "fetchingMetadata":
        return "Fetching book metadata...";
      case "fetchingText":
        return "Fetching book text...";
      case "analyzing":
        return "Analyzing characters & interactions...";
      default:
        return "Analyze";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {getAnalysisStatusText()}
      </h2>

      <div className="space-y-6">
        <div className="relative">
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
            <div
              className="transition-all duration-500 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              style={{
                width:
                  analysisStep === "idle"
                    ? "0%"
                    : analysisStep === "fetchingMetadata"
                    ? "33.33%"
                    : analysisStep === "fetchingText"
                    ? "66.66%"
                    : "100%",
              }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between">
          {analysisSteps.map((step) => (
            <div
              key={step.id}
              className={`text-center flex flex-col items-center relative w-1/3 ${
                analysisStep === step.id ||
                (analysisStep === "complete" &&
                  (step.id === "fetchingMetadata" ||
                    step.id === "fetchingText" ||
                    step.id === "analyzing")) ||
                (analysisStep === "analyzing" &&
                  (step.id === "fetchingMetadata" ||
                    step.id === "fetchingText")) ||
                (analysisStep === "fetchingText" &&
                  step.id === "fetchingMetadata")
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-gray-400 dark:text-gray-500"
              }`}
            >
              <div
                className={`w-8 h-8 mb-2 rounded-full flex items-center justify-center text-xs transition-colors ${
                  analysisStep === step.id ||
                  (analysisStep === "complete" &&
                    (step.id === "fetchingMetadata" ||
                      step.id === "fetchingText" ||
                      step.id === "analyzing")) ||
                  (analysisStep === "analyzing" &&
                    (step.id === "fetchingMetadata" ||
                      step.id === "fetchingText")) ||
                  (analysisStep === "fetchingText" &&
                    step.id === "fetchingMetadata")
                    ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-500"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-700"
                }`}
              >
                {analysisStep === step.id && (
                  <div className="absolute w-8 h-8 rounded-full animate-ping opacity-30 bg-indigo-400 dark:bg-indigo-600"></div>
                )}
                <span className="relative">
                  {analysisStep === "complete" &&
                  (step.id === "fetchingMetadata" ||
                    step.id === "fetchingText" ||
                    step.id === "analyzing")
                    ? "✓"
                    : analysisStep === "analyzing" &&
                      (step.id === "fetchingMetadata" ||
                        step.id === "fetchingText")
                    ? "✓"
                    : analysisStep === "fetchingText" &&
                      step.id === "fetchingMetadata"
                    ? "✓"
                    : step.id === analysisStep
                    ? "●"
                    : "○"}
                </span>
              </div>
              <div className="text-xs font-medium">{step.label}</div>
              <div className="text-xs mt-1 hidden sm:block max-w-[120px] mx-auto">
                {step.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
