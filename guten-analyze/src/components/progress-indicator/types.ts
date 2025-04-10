export type AnalysisStepStatus =
  | "idle"
  | "fetchingMetadata"
  | "fetchingText"
  | "analyzing"
  | "complete";

export interface AnalysisStep {
  id: string;
  label: string;
  description: string;
}

export interface AnalysisProgressProps {
  analysisStep: AnalysisStepStatus;
}
