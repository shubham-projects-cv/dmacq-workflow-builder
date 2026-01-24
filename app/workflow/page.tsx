"use client";

import React, { useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  Connection,
  ReactFlowProvider,
} from "reactflow";

import WorkflowLayout from "@/components/WorkflowLayout";
import Sidebar from "@/components/Sidebar";
import { useWorkflowStore } from "@/store/workflowStore";

export default function WorkflowPage() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);

  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);
  const addStoreEdge = useWorkflowStore((s) => s.addEdge);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = addEdge(params, []);
      if (edge.length > 0) {
        addStoreEdge(edge[0]);
      }
    },
    [addStoreEdge],
  );

  return (
    <ReactFlowProvider>
      <WorkflowLayout sidebar={<Sidebar />}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </WorkflowLayout>
    </ReactFlowProvider>
  );
}
