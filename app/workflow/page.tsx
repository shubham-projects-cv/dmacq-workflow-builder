"use client";

import React, { useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from "reactflow";

import WorkflowLayout from "@/components/WorkflowLayout";
import Sidebar from "@/components/Sidebar";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "default",
    position: { x: 250, y: 100 },
    data: { label: "Start" },
  },
];

const initialEdges: Edge[] = [];

export default function WorkflowPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  return (
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
  );
}
