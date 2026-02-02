"use client";

import React, { useCallback, useRef } from "react";

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

import DeletableEdge from "@/components/edges/DeletableEdge";

import WorkflowLayout from "@/components/WorkflowLayout";
import Sidebar from "@/components/Sidebar";
import NodeSettings from "@/components/NodeSettings";

import { useWorkflowStore } from "@/store/workflowStore";

export default function WorkflowPage() {
  const nodes = useWorkflowStore((s) => s.workflow.nodes);
  const edges = useWorkflowStore((s) => s.workflow.edges);

  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);

  const addStoreEdge = useWorkflowStore((s) => s.addEdge);
  const addNode = useWorkflowStore((s) => s.addNode);

  const selectNode = useWorkflowStore((s) => s.selectNode);
  const selectEdge = useWorkflowStore((s) => s.selectEdge);

  const closeSettings = useWorkflowStore((s) => s.closeSettings);
  const settingsId = useWorkflowStore((s) => s.settingsNodeId);

  /* ✅ ReactFlow Instance */
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      const e = addEdge(params, []);

      if (e.length) addStoreEdge(e[0]);
    },
    [addStoreEdge],
  );

  /* ✅ Allow Drop */
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  /* ✅ Drop Handler */
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

  const nodeTypes = {
    start: StartNode,
    approval: ApprovalNode,
    end: EndNode,
  };

  const edgeTypes = {
    deletable: DeletableEdge,
  };

  const mappedEdges = edges.map((e) => ({
    ...e,
    type: "deletable",
  }));

  return (
    <ReactFlowProvider>
      <WorkflowLayout
        sidebar={<Sidebar />}
        rightPanel={settingsId ? <NodeSettings /> : null}
      >
        {/* ✅ Wrapper Needed for Drop */}
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
            selectNodesOnDrag={false}
            elementsSelectable
            onNodeClick={(_, node) => {
              selectNode(node.id);
              selectEdge(null);
            }}
            onEdgeClick={(_, edge) => {
              selectEdge(edge.id);
              selectNode(null);
              closeSettings();
            }}
            onPaneClick={() => {
              selectNode(null);
              selectEdge(null);
              closeSettings();
            }}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>
      </WorkflowLayout>
    </ReactFlowProvider>
  );
}
