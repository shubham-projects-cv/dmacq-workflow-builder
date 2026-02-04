"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
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

/* ================= Storage ================= */

const WORKFLOW_KEY = "active-workflow";
const PANEL_KEY = "workflow-panel-closed";

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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  /* ================= Store ================= */

  const nodes = useWorkflowStore((s) => s.workflow.nodes);
  const edges = useWorkflowStore((s) => s.workflow.edges);

  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);

  const addStoreEdge = useWorkflowStore((s) => s.addEdge);
  const addNode = useWorkflowStore((s) => s.addNode);

  const settingsId = useWorkflowStore((s) => s.settingsNodeId);

  /* ================= Status ================= */

  const [workflowId, setWorkflowId] = useState<string | null>(null);
  const [showStatus, setShowStatus] = useState(false);

  const { events, status } = useWorkflowStream(workflowId || undefined);

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

  /* ================= Node / Edge ================= */

  const nodeTypes = {
    start: StartNode,
    approval: ApprovalNode,
    end: EndNode,
    email: EmailNode,
  };

  const edgeTypes = {
    deletable: DeletableEdge,
  };

  /* ================= Inject Status ================= */

  const mappedNodes = useMemo(() => {
    return nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        workflowStatus: status,
      },
    }));
  }, [nodes, status]);

  const mappedEdges = useMemo(() => {
    return edges.map((e) => ({
      ...e,
      type: "deletable",
      data: {
        ...e.data,
        workflowStatus: status,
      },
    }));
  }, [edges, status]);

  /* ================= Restore ================= */

  useEffect(() => {
    const saved = localStorage.getItem(WORKFLOW_KEY);
    const closed = localStorage.getItem(PANEL_KEY);

    if (!saved) return;

    queueMicrotask(() => {
      setWorkflowId(saved);

      if (!closed) {
        setShowStatus(true);
      }
    });
  }, []);

  /* ================= Listen Publish ================= */

  useEffect(() => {
    const handler = (e: CustomEvent<{ workflowId: string }>) => {
      const id = e.detail.workflowId;

      localStorage.setItem(WORKFLOW_KEY, id);
      localStorage.removeItem(PANEL_KEY);

      setWorkflowId(id);
      setShowStatus(true);
    };

    window.addEventListener("workflow-started", handler as EventListener);

    return () => {
      window.removeEventListener("workflow-started", handler as EventListener);
    };
  }, []);

  /* ================= Cleanup ================= */

  useEffect(() => {
    if (!status.completed) return;

    localStorage.removeItem(WORKFLOW_KEY);
    localStorage.removeItem(PANEL_KEY);
  }, [status.completed]);

  useEffect(() => {
    if (!reactFlowInstance.current) return;

    if (nodes.length === 0) return;

    setTimeout(() => {
      reactFlowInstance.current?.fitView({
        padding: 0.2,
        minZoom: 0.6,
        maxZoom: 1,
        duration: 400,
      });
    }, 100);
  }, [nodes, edges]);

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
            nodes={mappedNodes}
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

        {showStatus && workflowId && (
          <WorkflowStatusPanel
            events={events}
            onClose={() => {
              localStorage.setItem(PANEL_KEY, "1");

              setShowStatus(false);
            }}
          />
        )}
      </WorkflowLayout>
    </ReactFlowProvider>
  );
}
