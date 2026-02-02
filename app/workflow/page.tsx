"use client";

import StartNode from "@/components/nodes/StartNode";
import ApprovalNode from "@/components/nodes/ApprovalNode";
import EndNode from "@/components/nodes/EndNode";

import React, { useCallback } from "react";
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  Connection,
  ReactFlowProvider,
  Node,
  NodeMouseHandler,
} from "reactflow";

import WorkflowLayout from "@/components/WorkflowLayout";
import Sidebar from "@/components/Sidebar";

import { useWorkflowStore } from "@/store/workflowStore";

export default function WorkflowPage() {
  const workflow = useWorkflowStore((s) => s.workflow);

  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);

  const addStoreEdge = useWorkflowStore((s) => s.addEdge);
  const selectNode = useWorkflowStore((s) => s.selectNode);

  /* Prevent empty nodes */
  const nodes = workflow.nodes.length ? workflow.nodes : [];

  const edges = workflow.edges;

  /* Connect */

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = addEdge(params, []);

      if (edge.length > 0) {
        addStoreEdge(edge[0]);
      }
    },
    [addStoreEdge],
  );

  /* Select */

  const onNodeClick: NodeMouseHandler = (_, node: Node) => {
    selectNode(node.id);
  };

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  /* Node Types */

  const nodeTypes = {
    start: StartNode,
    approval: ApprovalNode,
    end: EndNode,
  };

  return (
    <ReactFlowProvider>
      <WorkflowLayout sidebar={<Sidebar />} rightPanel={null}>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes} // ✅ controlled
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </WorkflowLayout>
    </ReactFlowProvider>
  );
}
