"use client";

import { Handle, Position } from "reactflow";
import { CharacterNodeProps } from "./types";
import { bgColors } from "./constants";

export default function CharacterNode({ data }: CharacterNodeProps) {
  const importance = data.character.importance;

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: "#555" }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: "#555" }}
      />

      <div
        className={`px-4 py-2 rounded-lg border ${bgColors[importance]} shadow-md`}
        style={{ minWidth: "120px" }}
      >
        <div className="font-bold text-center truncate">
          {data.character.name}
        </div>
        {data.character.aliases.length > 0 && (
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1 truncate">
            {data.character.aliases[0]}
          </div>
        )}
      </div>
    </>
  );
}
