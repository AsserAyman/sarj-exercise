"use client";

import { Panel } from "reactflow";

interface RelationshipLegendProps {
  onRunSimulation: () => void;
  onResetView: () => void;
  simulationRunning: boolean;
}

export default function RelationshipLegend({
  onRunSimulation,
  onResetView,
  simulationRunning,
}: RelationshipLegendProps) {
  return (
    <Panel
      position="top-right"
      className="bg-white dark:bg-gray-800 p-2 rounded-md shadow-md"
    >
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Relationship Types</h3>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-green-500"></div>
          <span className="text-xs">Allies/Friends</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-red-500"></div>
          <span className="text-xs">Enemies/Rivals</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-blue-500"></div>
          <span className="text-xs">Family</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-1 bg-pink-500"></div>
          <span className="text-xs">Romantic</span>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <button
          onClick={onRunSimulation}
          disabled={simulationRunning}
          className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white text-xs px-2 py-1 rounded w-full transition-colors"
        >
          {simulationRunning ? "Optimizing Layout..." : "Optimize Layout"}
        </button>
        <button
          onClick={onResetView}
          className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-xs px-2 py-1 rounded w-full transition-colors"
        >
          Reset View
        </button>
      </div>
    </Panel>
  );
}
