"use client";

import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import { CharacterGraphProps } from "./types";
import Flow from "./Flow";

export default function CharacterGraph({
  characters,
  interactions,
}: CharacterGraphProps) {
  return (
    <div style={{ width: "100%", height: "600px" }}>
      <ReactFlowProvider>
        <Flow characters={characters} interactions={interactions} />
      </ReactFlowProvider>
    </div>
  );
}
