import { create } from "zustand";
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

/* ----------------------------- */
/* Types */
/* ----------------------------- */

type Position = {
  x: number;
  y: number;
};

type NodeData = {
  label?: string;
  email?: string;
  approver?: string;
};

type WorkflowSnapshot = {
  nodes: Node<NodeData>[];
  edges: Edge[];
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

/* ----------------------------- */
/* Constants */
/* ----------------------------- */

const STORAGE_KEY = "workflow-builder:v1";

/* ----------------------------- */
/* Helpers */
/* ----------------------------- */

function loadFromStorage(): WorkflowSnapshot | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) return null;

    return JSON.parse(raw) as WorkflowSnapshot;
  } catch {
    return null;
  }
}

function saveToStorage(snapshot: WorkflowSnapshot): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // silently fail (quota / private mode etc.)
  }
}

/* ----------------------------- */
/* Initial Data */
/* ----------------------------- */

const defaultNodes: Node<NodeData>[] = [
  {
    id: "1",
    type: "default",
    position: { x: 250, y: 100 },
    data: { label: "Start" },
  },
];

const defaultEdges: Edge[] = [];

/* ----------------------------- */
/* Store */
/* ----------------------------- */

export const useWorkflowStore = create<WorkflowState>((set, get) => {
  /* Load persisted workflow */
  const saved = loadFromStorage();

  const initialNodes = saved?.nodes ?? defaultNodes;
  const initialEdges = saved?.edges ?? defaultEdges;

  /* Persist helper */
  const persist = (): void => {
    const { nodes, edges } = get();

    saveToStorage({
      nodes,
      edges,
    });
  };

  return {
    nodes: initialNodes,
    edges: initialEdges,

    selectedNodeId: null,
    isLeftOpen: true,

    /* ----------------------------- */
    /* ReactFlow handlers */
    /* ----------------------------- */

    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });

      persist();
    },

    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });

      persist();
    },

    /* ----------------------------- */
    /* UI state */
    /* ----------------------------- */

    selectNode: (id) => {
      set({ selectedNodeId: id });
    },

    toggleLeft: () => {
      set({ isLeftOpen: !get().isLeftOpen });
    },

    closeLeft: () => {
      set({ isLeftOpen: false });
    },

    /* ----------------------------- */
    /* Workflow actions */
    /* ----------------------------- */

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

      persist();
    },

    addEdge: (edge) => {
      set({
        edges: [...get().edges, edge],
      });

      persist();
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

      persist();
    },
  };
});
