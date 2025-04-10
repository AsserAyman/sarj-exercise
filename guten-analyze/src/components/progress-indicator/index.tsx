import { AnalysisProgressProps } from "./types";
import { ANALYSIS_STEPS } from "./constants";
import { getAnalysisStatusText } from "./utils";
import { ProgressBar } from "./ProgressBar";
import { StepIndicator } from "./StepIndicator";

export function AnalysisProgress({ analysisStep }: AnalysisProgressProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mt-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {getAnalysisStatusText(analysisStep)}
      </h2>

      <div className="space-y-6">
        <ProgressBar analysisStep={analysisStep} />

        <div className="flex justify-between">
          {ANALYSIS_STEPS.map((step) => (
            <StepIndicator
              key={step.id}
              step={step}
              currentStep={analysisStep}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
