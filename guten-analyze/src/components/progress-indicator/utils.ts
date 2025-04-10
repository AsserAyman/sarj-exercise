import { AnalysisStepStatus } from "./types";

export function getAnalysisStatusText(step: AnalysisStepStatus): string {
  switch (step) {
    case "fetchingMetadata":
      return "Fetching book metadata...";
    case "fetchingText":
      return "Fetching book text...";
    case "analyzing":
      return "Analyzing characters & interactions...";
    default:
      return "Analyze";
  }
}
