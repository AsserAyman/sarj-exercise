"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import * as d3 from "d3-force";
import { Character, CharacterInteraction } from "@/api/types";
import CharacterNodeDetails from "./CharacterNodeDetails";

// Custom node component with explicit handles
interface CharacterNodeProps {
  data: {
    character: Character;
  };
}

function CharacterNode({ data }: CharacterNodeProps) {
  const importance = data.character.importance;

  const bgColors: Record<string, string> = {
    main: "bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700",
    secondary:
      "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700",
    minor:
      "bg-gray-100 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700",
  };

  return (
    <>
      {/* Add explicit handles on all sides of the node */}
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

// Define just the custom node type
const nodeTypes = {
  character: CharacterNode,
};

// Helper function to get edge color based on relationship nature
function getEdgeColor(nature: string): string {
  switch (nature.toLowerCase()) {
    case "allies":
    case "friends":
      return "#22c55e"; // green-500
    case "enemies":
    case "rivals":
      return "#ef4444"; // red-500
    case "family":
      return "#3b82f6"; // blue-500
    case "romantic":
      return "#ec4899"; // pink-500
    default:
      return "#9ca3af"; // gray-400
  }
}

// Interface for D3 simulation node
interface SimulationNode extends d3.SimulationNodeDatum {
  id: string;
  x?: number;
  y?: number;
  // Add any other properties needed
}

// Main flow component that needs access to the ReactFlow hooks
function Flow({ characters, interactions }: CharacterGraphProps) {
  // Use ReactFlow's state hooks for nodes and edges
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // State for selected character details
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  // State for simulation
  const [simulationRunning, setSimulationRunning] = useState(false);
  const simulationRef = useRef<d3.Simulation<SimulationNode, undefined> | null>(
    null
  );

  // Initialize graph data
  useEffect(() => {
    // Create a map of character names to their data
    const characterMap = new Map<string, Character>();
    characters.forEach((character) => {
      characterMap.set(character.name, character);
    });

    // Initial node positions - start in a circle
    const initialNodes: Node[] = [];
    const nodeCount = characters.length;
    const radius = Math.max(300, nodeCount * 30);

    characters.forEach((character, i) => {
      const angle = (i * 2 * Math.PI) / nodeCount;
      initialNodes.push({
        id: character.name,
        type: "character",
        position: {
          x: radius * Math.cos(angle) + radius,
          y: radius * Math.sin(angle) + 300,
        },
        data: { character },
      });
    });

    // Create edges for each interaction
    const initialEdges: Edge[] = [];

    interactions.forEach((interaction, index) => {
      if (
        !characterMap.has(interaction.character1) ||
        !characterMap.has(interaction.character2)
      ) {
        return;
      }

      initialEdges.push({
        id: `edge-${index}`,
        source: interaction.character1,
        target: interaction.character2,
        label: interaction.nature,
        animated: interaction.significance >= 8,
        style: {
          stroke: getEdgeColor(interaction.nature),
          strokeWidth: Math.max(1, Math.min(5, interaction.significance / 2)),
        },
      });
    });

    setNodes(initialNodes);
    setEdges(initialEdges);

    // Create and run a force simulation
    const forceLinks = interactions
      .filter(
        (i) => characterMap.has(i.character1) && characterMap.has(i.character2)
      )
      .map((i) => ({
        source: i.character1,
        target: i.character2,
        // Stronger links for more significant relationships
        strength: i.significance / 10,
      }));

    // Create the simulation nodes from our ReactFlow nodes
    const simulationNodes: SimulationNode[] = initialNodes.map((node) => ({
      id: node.id,
      x: node.position.x,
      y: node.position.y,
    }));

    // Create the simulation
    const simulation = d3
      .forceSimulation(simulationNodes)
      // Center force pulls nodes to center
      .force("center", d3.forceCenter(radius, 300))
      // Collision force prevents node overlap
      .force("collision", d3.forceCollide().radius(60))
      // Link force keeps connected nodes closer
      .force(
        "link",
        d3
          .forceLink(forceLinks)
          .id(function (d: d3.SimulationNodeDatum) {
            return (d as SimulationNode).id;
          })
          .distance(250)
      )
      // Charge force creates repulsion between nodes
      .force("charge", d3.forceManyBody().strength(-300))
      // Set alpha values for simulation control
      .alphaTarget(0)
      .alphaDecay(0.05);

    // Update node positions on each tick
    simulation.on("tick", () => {
      setNodes((nodes) =>
        nodes.map((node) => {
          const simNode = simulationNodes.find((n) => n.id === node.id);
          if (simNode && simNode.x !== undefined && simNode.y !== undefined) {
            return {
              ...node,
              position: {
                x: simNode.x,
                y: simNode.y,
              },
            };
          }
          return node;
        })
      );
    });

    // When simulation completes
    simulation.on("end", () => {
      setSimulationRunning(false);
      console.log("Force simulation completed");
    });

    // Store simulation reference
    simulationRef.current = simulation;
    setSimulationRunning(true);

    // Clean up simulation on unmount
    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop();
      }
    };
  }, [characters, interactions, setNodes, setEdges]);

  // Handle node click to show more information
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedCharacter(node.data.character);
  }, []);

  // Close character details modal
  const closeCharacterDetails = useCallback(() => {
    setSelectedCharacter(null);
  }, []);

  // Restart the simulation
  const runSimulation = useCallback(() => {
    if (simulationRef.current) {
      // Restart simulation with a higher alpha for more movement
      simulationRef.current.alpha(0.5).restart();
      setSimulationRunning(true);
    }
  }, []);

  // Fit view on initial render
  const reactFlowInstance = useReactFlow();

  // Reset view to see all nodes
  const onResetView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.2 });
  }, [reactFlowInstance]);

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        attributionPosition="bottom-right"
      >
        <Controls />
        <Background color="#aaa" gap={16} />
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
              onClick={runSimulation}
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
      </ReactFlow>

      {/* Character Details Modal */}
      {selectedCharacter && (
        <CharacterNodeDetails
          character={selectedCharacter}
          interactions={interactions}
          onClose={closeCharacterDetails}
        />
      )}
    </>
  );
}

// Props for the character graph component
interface CharacterGraphProps {
  characters: Character[];
  interactions: CharacterInteraction[];
}

// Wrapper component that provides the ReactFlow context
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
