import * as d3 from "d3-force";
import { Node, Edge } from "reactflow";
import { Character, CharacterInteraction } from "@/api/types";
import { SimulationNode } from "./types";

export function getEdgeColor(nature: string): string {
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

export const getImportanceBadgeClass = (importance: string) => {
  switch (importance) {
    case "main":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "secondary":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  }
};

export function createNodes(characters: Character[]): Node[] {
  const nodeCount = characters.length;
  const radius = Math.max(300, nodeCount * 30);

  return characters.map((character, i) => {
    const angle = (i * 2 * Math.PI) / nodeCount;
    return {
      id: character.name,
      type: "character",
      position: {
        x: radius * Math.cos(angle) + radius,
        y: radius * Math.sin(angle) + 300,
      },
      data: { character },
    };
  });
}

export function createEdges(
  interactions: CharacterInteraction[],
  characterMap: Map<string, Character>
): Edge[] {
  return interactions
    .filter(
      (interaction) =>
        characterMap.has(interaction.character1) &&
        characterMap.has(interaction.character2)
    )
    .map((interaction, index) => ({
      id: `edge-${index}`,
      source: interaction.character1,
      target: interaction.character2,
      label: interaction.nature,
      animated: interaction.significance >= 8,
      style: {
        stroke: getEdgeColor(interaction.nature),
        strokeWidth: Math.max(1, Math.min(5, interaction.significance / 2)),
      },
    }));
}

export function createForceSimulation(
  nodes: Node[],
  interactions: CharacterInteraction[],
  characterMap: Map<string, Character>,
  onTick: (simulationNodes: SimulationNode[]) => void,
  onEnd: () => void
): d3.Simulation<SimulationNode, undefined> {
  // Create the simulation nodes from ReactFlow nodes
  const simulationNodes: SimulationNode[] = nodes.map((node) => ({
    id: node.id,
    x: node.position.x,
    y: node.position.y,
  }));

  const radius = Math.max(300, nodes.length * 30);

  // Create links for force simulation
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
        .id((d: d3.SimulationNodeDatum) => (d as SimulationNode).id)
        .distance(250)
    )
    // Charge force creates repulsion between nodes
    .force("charge", d3.forceManyBody().strength(-300))
    // Set alpha values for simulation control
    .alphaTarget(0)
    .alphaDecay(0.05);

  // Update node positions on each tick
  simulation.on("tick", () => onTick(simulationNodes));

  // When simulation completes
  simulation.on("end", onEnd);

  return simulation;
}
