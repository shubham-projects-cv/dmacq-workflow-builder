import { create } from "zustand";
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

type WorkflowState = {
  nodes: Node[];
  edges: Edge[];

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;

  addNode: (type: string, position?: { x: number; y: number }) => void;
  addEdge: (edge: Edge) => void;
};

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [
    {
      id: "1",
      type: "default",
      position: { x: 250, y: 100 },
      data: { label: "Start" },
    },
  ],

  edges: [],

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addNode: (type, position?: { x: number; y: number }) => {
    const newNode: Node = {
      id: crypto.randomUUID(),
      type: "default",
      position: position || { x: 0, y: 0 },
      data: { label: type },
    };

    set({
      nodes: [...get().nodes, newNode],
    });
  },

  addEdge: (edge) => {
    set({
      edges: [...get().edges, edge],
    });
  },
}));
