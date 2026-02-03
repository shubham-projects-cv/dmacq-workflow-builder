"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWorkflowStream } from "@/hooks/useWorkflowStream";

import ReactFlow, {
  Controls,
  Background,
  addEdge,
  Connection,
  ReactFlowProvider,
  ReactFlowInstance,
} from "reactflow";

import StartNode from "@/components/nodes/StartNode";
import ApprovalNode from "@/components/nodes/ApprovalNode";
import EndNode from "@/components/nodes/EndNode";
import EmailNode from "@/components/nodes/EmailNode";

import DeletableEdge from "@/components/edges/DeletableEdge";

import WorkflowLayout from "@/components/WorkflowLayout";
import Sidebar from "@/components/Sidebar";
import NodeSettings from "@/components/NodeSettings";
import WorkflowStatusPanel from "@/components/WorkflowStatusPanel";

import { useWorkflowStore } from "@/store/workflowStore";

/* ================= Condition Picker ================= */

function ConditionPicker({
  x,
  y,
  onSelect,
}: {
  x: number;
  y: number;
  onSelect: (v: "approve" | "deny") => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: y,
        left: x,
        zIndex: 1000,
      }}
      className="bg-white border rounded shadow p-2 flex gap-2"
    >
      <button
        onClick={() => onSelect("approve")}
        className="px-3 py-1 rounded bg-green-500 text-white text-sm"
      >
        Approve
      </button>

      <button
        onClick={() => onSelect("deny")}
        className="px-3 py-1 rounded bg-red-500 text-white text-sm"
      >
        Deny
      </button>
    </div>
  );
}

/* ================= Page ================= */

export default function WorkflowPage() {
  /* ================= Mount Guard (Fix Hydration) ================= */

  /* ================= Mount Guard ================= */

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setMounted(true);
    });
  }, []);

  /* ================= Store ================= */

  const nodes = useWorkflowStore((s) => s.workflow.nodes);
  const edges = useWorkflowStore((s) => s.workflow.edges);

  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);

  const addStoreEdge = useWorkflowStore((s) => s.addEdge);
  const addNode = useWorkflowStore((s) => s.addNode);

  const settingsId = useWorkflowStore((s) => s.settingsNodeId);

  /* ================= Workflow Status ================= */

  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [showStatus, setShowStatus] = useState(false);

  const STORAGE_KEY = "active-workflow";

  const events = useWorkflowStream(workflowId || undefined);

  /* ================= ReactFlow ================= */

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  /* ================= Condition ================= */

  const [pendingConnection, setPendingConnection] = useState<Connection | null>(
    null,
  );

  const [pickerPos, setPickerPos] = useState({ x: 0, y: 0 });

  /* ================= Add Node ================= */

  const addNodeInView = useCallback(
    (type: string) => {
      if (!reactFlowWrapper.current || !reactFlowInstance.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();

      const center = reactFlowInstance.current.screenToFlowPosition({
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      });

      addNode(type, center);
    },
    [addNode],
  );

  /* ================= Connect ================= */

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = nodes.find((n) => n.id === params.source);

      if (sourceNode?.type === "approval") {
        setPendingConnection(params);

        setPickerPos({
          x: window.innerWidth / 2 - 60,
          y: window.innerHeight / 2 - 30,
        });

        return;
      }

      const e = addEdge(params, []);

      if (e.length) addStoreEdge(e[0]);
    },
    [addStoreEdge, nodes],
  );

  const handleConditionSelect = (v: "approve" | "deny") => {
    if (!pendingConnection) return;

    const e = addEdge(
      {
        ...pendingConnection,
        data: { condition: v },
      },
      [],
    );

    if (e.length) addStoreEdge(e[0]);

    setPendingConnection(null);
  };

  /* ================= Drag ================= */

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (!type) return;

      if (!reactFlowWrapper.current || !reactFlowInstance.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();

      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });

      addNode(type, position);
    },
    [addNode],
  );

  /* ================= Node Types ================= */

  const nodeTypes = {
    start: StartNode,
    approval: ApprovalNode,
    end: EndNode,
    email: EmailNode,
  };

  const edgeTypes = {
    deletable: DeletableEdge,
  };

  const mappedEdges = edges.map((e) => ({
    ...e,
    type: "deletable",
  }));

  /* ================= Restore On Refresh ================= */

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) return;

    queueMicrotask(() => {
      setWorkflowId(saved);
      setShowStatus(true);
    });
  }, []);

  /* ================= Listen Publish ================= */

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const id = e.detail.workflowId;

      localStorage.setItem(STORAGE_KEY, id);

      setWorkflowId(id);
      setShowStatus(true);
    };

    window.addEventListener("workflow-started", handler as EventListener);

    return () => {
      window.removeEventListener("workflow-started", handler as EventListener);
    };
  }, []);

  /* ================= Cleanup On Complete ================= */

  useEffect(() => {
    if (!events.length) return;

    const last = events[events.length - 1];

    if (last.status === "COMPLETED") {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [events]);

  /* ================= Prevent SSR Mismatch ================= */

  if (!mounted) return null;

  /* ================= Render ================= */

  return (
    <ReactFlowProvider>
      <WorkflowLayout
        sidebar={<Sidebar onAddNode={addNodeInView} />}
        rightPanel={settingsId ? <NodeSettings /> : null}
      >
        <div
          ref={reactFlowWrapper}
          className="w-full h-full"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={mappedEdges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={(rf) => (reactFlowInstance.current = rf)}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>

          {pendingConnection && (
            <ConditionPicker
              x={pickerPos.x}
              y={pickerPos.y}
              onSelect={handleConditionSelect}
            />
          )}
        </div>

        {/* ✅ STATUS PANEL */}
        {showStatus && workflowId && (
          <WorkflowStatusPanel
            events={events}
            onClose={() => {
              localStorage.removeItem(STORAGE_KEY);

              setShowStatus(false);
              setWorkflowId(null);
            }}
          />
        )}
      </WorkflowLayout>
    </ReactFlowProvider>
  );
}
