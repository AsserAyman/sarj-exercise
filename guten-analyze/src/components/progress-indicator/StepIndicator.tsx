import { AnalysisStep, AnalysisStepStatus } from "./types";

interface StepIndicatorProps {
  step: AnalysisStep;
  currentStep: AnalysisStepStatus;
}

export function StepIndicator({ step, currentStep }: StepIndicatorProps) {
  const isCompleted =
    currentStep === "complete" ||
    (currentStep === "analyzing" &&
      (step.id === "fetchingMetadata" || step.id === "fetchingText")) ||
    (currentStep === "fetchingText" && step.id === "fetchingMetadata");

  const isActive = currentStep === step.id || isCompleted;

  return (
    <div
      className={`text-center flex flex-col items-center relative w-1/3 ${
        isActive
          ? "text-indigo-600 dark:text-indigo-400"
          : "text-gray-400 dark:text-gray-500"
      }`}
    >
      <div
        className={`w-8 h-8 mb-2 rounded-full flex items-center justify-center text-xs transition-colors ${
          isActive
            ? "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-500"
            : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-700"
        }`}
      >
        {currentStep === step.id && (
          <div className="absolute w-8 h-8 rounded-full animate-ping opacity-30 bg-indigo-400 dark:bg-indigo-600"></div>
        )}
        <span className="relative">
          {isCompleted ? "✓" : step.id === currentStep ? "●" : "○"}
        </span>
      </div>
      <div className="text-xs font-medium">{step.label}</div>
      <div className="text-xs mt-1 hidden sm:block max-w-[120px] mx-auto">
        {step.description}
      </div>
    </div>
  );
}
