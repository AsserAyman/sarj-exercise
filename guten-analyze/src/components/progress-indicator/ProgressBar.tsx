import { AnalysisStepStatus } from "./types";

interface ProgressBarProps {
  analysisStep: AnalysisStepStatus;
}

export function ProgressBar({ analysisStep }: ProgressBarProps) {
  const progressWidth =
    analysisStep === "idle"
      ? "0%"
      : analysisStep === "fetchingMetadata"
      ? "33.33%"
      : analysisStep === "fetchingText"
      ? "66.66%"
      : "100%";

  return (
    <div className="relative">
      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-700">
        <div
          className="transition-all duration-500 shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
          style={{ width: progressWidth }}
        ></div>
      </div>
    </div>
  );
}
