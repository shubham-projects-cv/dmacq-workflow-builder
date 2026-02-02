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
  workflow: WorkflowJSON;

  // ✅ Selection
  activeNodeId: string | null;
  activeEdgeId: string | null;

  // ✅ Settings panel
  settingsNodeId: string | null;

  isLeftOpen: boolean;

  /* ReactFlow */

  onNodesChange: (c: NodeChange[]) => void;
  onEdgesChange: (c: EdgeChange[]) => void;

  /* Selection */

  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;

  openSettings: (id: string) => void;
  closeSettings: () => void;

  /* UI */

  toggleLeft: () => void;
  closeLeft: () => void;

  /* Workflow */

  addNode: (type: string, pos?: Position) => void;
  addEdge: (edge: Edge) => void;

  deleteNode: (id: string) => void;
  deleteEdge: (id: string) => void;

  duplicateNode: (id: string) => void;

  updateNodeData: (id: string, data: Partial<NodeData>) => void;

  setWorkflow: (wf: WorkflowJSON) => void;
};

/* ---------------- Storage ---------------- */

const KEY = "workflow-builder:v1";

/* ---------------- Helpers ---------------- */

function load(): WorkflowJSON | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(KEY);

    if (!raw) return null;

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function save(wf: WorkflowJSON): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(KEY, JSON.stringify(wf));
}

function empty(): WorkflowJSON {
  return {
    nodes: [
      {
        id: "start",
        type: "start",
        position: { x: 300, y: 120 },
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
  const saved = load();

  const initial = saved ?? empty();

  const persist = () => {
    const wf = get().workflow;

    save({
      ...wf,
      meta: {
        ...wf.meta,
        updatedAt: new Date().toISOString(),
      },
    });
  };

  return {
    workflow: initial,

    /* Selection */

    activeNodeId: null,
    activeEdgeId: null,

    settingsNodeId: null,

    isLeftOpen: true,

    /* ReactFlow */

    onNodesChange: (changes) => {
      const nodes = applyNodeChanges(changes, get().workflow.nodes);

      set((s) => ({
        workflow: { ...s.workflow, nodes },
      }));

      persist();
    },

    onEdgesChange: (changes) => {
      const edges = applyEdgeChanges(changes, get().workflow.edges);

      set((s) => ({
        workflow: { ...s.workflow, edges },
      }));

      persist();
    },

    /* Selection */

    selectNode: (id) => {
      set({
        activeNodeId: id,
        activeEdgeId: null,
      });
    },

    selectEdge: (id) => {
      set({
        activeEdgeId: id,
        activeNodeId: null,
      });
    },

    openSettings: (id) => {
      set({
        settingsNodeId: id,
        activeNodeId: id,
      });
    },

    closeSettings: () => {
      set({ settingsNodeId: null });
    },

    /* UI */

    toggleLeft: () => {
      set({ isLeftOpen: !get().isLeftOpen });
    },

    closeLeft: () => {
      set({ isLeftOpen: false });
    },

    /* Workflow */

    addNode: (type, pos) => {
      const t = type.toLowerCase();

      const node: Node<NodeData> = {
        id: crypto.randomUUID(),

        type: t,

        position: pos ?? { x: 0, y: 0 },

        data: {
          label: type,
          nodeType: t,
        },
      };

      set((s) => ({
        workflow: {
          ...s.workflow,
          nodes: [...s.workflow.nodes, node],
        },
      }));

      persist();
    },

    addEdge: (edge) => {
      set((s) => ({
        workflow: {
          ...s.workflow,
          edges: [...s.workflow.edges, edge],
        },
      }));

      persist();
    },

    deleteNode: (id) => {
      set((s) => {
        const nodes = s.workflow.nodes.filter((n) => n.id !== id);

        const edges = s.workflow.edges.filter(
          (e) => e.source !== id && e.target !== id,
        );

        return {
          workflow: {
            ...s.workflow,
            nodes,
            edges,
          },

          activeNodeId: null,
          settingsNodeId: null,
        };
      });

      persist();
    },

    deleteEdge: (id) => {
      set((s) => ({
        workflow: {
          ...s.workflow,
          edges: s.workflow.edges.filter((e) => e.id !== id),
        },

        activeEdgeId: null,
      }));

      persist();
    },

    duplicateNode: (id) => {
      set((s) => {
        const node = s.workflow.nodes.find((n) => n.id === id);

        if (!node) return s;

        const copy = {
          id: crypto.randomUUID(),

          type: node.type,

          position: {
            x: node.position.x + 180,
            y: node.position.y + 100,
          },

          data: { ...node.data },
        };

        return {
          workflow: {
            ...s.workflow,
            nodes: [...s.workflow.nodes, copy],
          },
        };
      });

      persist();
    },

    updateNodeData: (id, data) => {
      set((s) => ({
        workflow: {
          ...s.workflow,

          nodes: s.workflow.nodes.map((n) =>
            n.id === id
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    ...data,
                  },
                }
              : n,
          ),
        },
      }));

      persist();
    },

    setWorkflow: (wf) => {
      localStorage.removeItem(KEY);

      set({
        workflow: wf,
        activeNodeId: null,
        activeEdgeId: null,
        settingsNodeId: null,
      });

      save(wf);
    },
  };
});
