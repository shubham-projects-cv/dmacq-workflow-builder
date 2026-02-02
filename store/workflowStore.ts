import { create } from "zustand";
import {
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";

/* ---------------- Types ---------------- */

type Position = {
  x: number;
  y: number;
};

type NodeData = {
  label?: string;
  subLabel?: string;
  email?: string;
  approver?: string;
  nodeType?: string;
};

type WorkflowMeta = {
  version: string;
  createdBy: string;
  updatedAt: string;
};

export type WorkflowJSON = {
  nodes: Node<NodeData>[];
  edges: Edge[];
  meta: WorkflowMeta;
};

type WorkflowState = {
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;

  workflow: WorkflowJSON;

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

  setWorkflow: (workflow: WorkflowJSON) => void;
};

/* ---------------- Constants ---------------- */

const STORAGE_KEY = "workflow-builder:json:v1";

/* ---------------- Helpers ---------------- */

function loadWorkflow(): WorkflowJSON | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    return JSON.parse(raw) as WorkflowJSON;
  } catch {
    return null;
  }
}

function saveWorkflow(workflow: WorkflowJSON): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflow));
  } catch {
    //
  }
}

function createEmptyWorkflow(): WorkflowJSON {
  return {
    nodes: [
      {
        id: "start",
        type: "start", // 👈 IMPORTANT
        position: { x: 250, y: 100 },
        data: {
          label: "Start",
          subLabel: "Starting Point",
          nodeType: "start",
        },
      },
    ],

    edges: [],

    meta: {
      version: "1.0.0",
      createdBy: "Workflow Builder",
      updatedAt: new Date().toISOString(),
    },
  };
}

/* ---------------- Store ---------------- */

export const useWorkflowStore = create<WorkflowState>((set, get) => {
  const saved = loadWorkflow();

  const initialWorkflow = saved ?? createEmptyWorkflow();

  const persist = (): void => {
    const workflow = get().workflow;

    saveWorkflow({
      ...workflow,
      meta: {
        ...workflow.meta,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  return {
    workflow: initialWorkflow,

    selectedNodeId: null,
    isLeftOpen: true,

    /* -------- ReactFlow -------- */

    onNodesChange: (changes) => {
      const nodes = applyNodeChanges(changes, get().workflow.nodes);

      set((state) => ({
        workflow: {
          ...state.workflow,
          nodes,
        },
      }));

      persist();
    },

    onEdgesChange: (changes) => {
      const edges = applyEdgeChanges(changes, get().workflow.edges);

      set((state) => ({
        workflow: {
          ...state.workflow,
          edges,
        },
      }));

      persist();
    },

    /* -------- UI -------- */

    selectNode: (id) => {
      set({ selectedNodeId: id });
    },

    toggleLeft: () => {
      set({ isLeftOpen: !get().isLeftOpen });
    },

    closeLeft: () => {
      set({ isLeftOpen: false });
    },

    /* -------- Workflow -------- */

    addNode: (type, position) => {
      const nodeType = type.toLowerCase();

      const newNode: Node<NodeData> = {
        id: crypto.randomUUID(),

        type: nodeType,

        position: position ?? { x: 0, y: 0 },

        data: {
          label: type,
          nodeType,
        },
      };

      set((state) => ({
        workflow: {
          ...state.workflow,
          nodes: [...state.workflow.nodes, newNode],
        },
      }));

      persist();
    },

    addEdge: (edge) => {
      set((state) => ({
        workflow: {
          ...state.workflow,
          edges: [...state.workflow.edges, edge],
        },
      }));

      persist();
    },

    updateNodeData: (id, data) => {
      set((state) => ({
        workflow: {
          ...state.workflow,

          nodes: state.workflow.nodes.map((node) =>
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
        },
      }));

      persist();
    },

    /* -------- Import -------- */

    setWorkflow: (workflow) => {
      localStorage.removeItem(STORAGE_KEY);

      set({
        workflow,
        selectedNodeId: null,
      });

      saveWorkflow(workflow);
    },

    deleteNode: (id) => {
      set((state) => {
        const nodes = state.workflow.nodes.filter((n) => n.id !== id);

        const edges = state.workflow.edges.filter(
          (e) => e.source !== id && e.target !== id,
        );

        return {
          workflow: {
            ...state.workflow,
            nodes,
            edges,
          },
          selectedNodeId: null,
        };
      });

      persist();
    },

    duplicateNode: (id) => {
      set((state) => {
        const node = state.workflow.nodes.find((n) => n.id === id);

        if (!node) return state;

        // ✅ Create fresh clean node (no internals)
        const newNode = {
          id: crypto.randomUUID(),

          type: node.type,

          position: {
            x: node.position.x + 200,
            y: node.position.y + 120,
          },

          data: {
            ...node.data,
          },
        };

        return {
          workflow: {
            ...state.workflow,
            nodes: [...state.workflow.nodes, newNode],
          },
        };
      });

      persist();
    },
  };
});
