"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  Node,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";
import * as d3 from "d3-force";
import { Character } from "@/api/types";
import CharacterNodeDetails from "./CharacterNodeDetails";
import CharacterNode from "./CharacterNode";
import { FlowProps, SimulationNode } from "./types";
import { createNodes, createEdges, createForceSimulation } from "./utils";
import RelationshipLegend from "./RelationshipLegend";

// Define the custom node types
const nodeTypes = {
  character: CharacterNode,
};

export default function Flow({ characters, interactions }: FlowProps) {
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

    // Create initial nodes
    const initialNodes = createNodes(characters);
    setNodes(initialNodes);

    // Create edges for each interaction
    const initialEdges = createEdges(interactions, characterMap);
    setEdges(initialEdges);

    // Define tick handler for simulation
    const handleTick = (simulationNodes: SimulationNode[]) => {
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
    };

    // Define handler for when simulation ends
    const handleSimulationEnd = () => {
      setSimulationRunning(false);
      console.log("Force simulation completed");
    };

    // Create and run the force simulation
    const simulation = createForceSimulation(
      initialNodes,
      interactions,
      characterMap,
      handleTick,
      handleSimulationEnd
    );

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

  // Get the React Flow instance
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
        <RelationshipLegend
          onRunSimulation={runSimulation}
          onResetView={onResetView}
          simulationRunning={simulationRunning}
        />
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
