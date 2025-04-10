import { AnalysisStep } from "./types";

export const ANALYSIS_STEPS: AnalysisStep[] = [
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
