import { create } from "zustand";
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

type Position = {
  x: number;
  y: number;
};

type NodeData = {
  label?: string;
  email?: string;
  approver?: string;
};

type WorkflowState = {
  nodes: Node<NodeData>[];
  edges: Edge[];

  selectedNodeId: string | null;
  isLeftOpen: boolean;

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;

  selectNode: (id: string | null) => void;

  toggleLeft: () => void;
  closeLeft: () => void;

  addNode: (type: string, position?: Position) => void;
  addEdge: (edge: Edge) => void;

  updateNodeData: (id: string, data: Partial<NodeData>) => void;
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

  selectedNodeId: null,
  isLeftOpen: true,

  /* ReactFlow handlers */

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

  /* UI state */

  selectNode: (id) => {
    set({ selectedNodeId: id });
  },

  toggleLeft: () => {
    set({ isLeftOpen: !get().isLeftOpen });
  },

  closeLeft: () => {
    set({ isLeftOpen: false });
  },

  /* Workflow actions */

  addNode: (type, position) => {
    const newNode: Node<NodeData> = {
      id: crypto.randomUUID(),
      type: "default",
      position: position ?? { x: 0, y: 0 },
      data: {
        label: type,
      },
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

  updateNodeData: (id, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                ...data,
              },
            }
          : node,
      ),
    });
  },
}));
