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
import NodeSettings from "@/components/NodeSettings";

import { useWorkflowStore } from "@/store/workflowStore";

export default function WorkflowPage() {
  const nodes = useWorkflowStore((s) => s.workflow.nodes);
  const edges = useWorkflowStore((s) => s.workflow.edges);

  const onNodesChange = useWorkflowStore((s) => s.onNodesChange);
  const onEdgesChange = useWorkflowStore((s) => s.onEdgesChange);

  const addStoreEdge = useWorkflowStore((s) => s.addEdge);
  const selectNode = useWorkflowStore((s) => s.selectNode);
  const selectedNodeId = useWorkflowStore((s) => s.selectedNodeId);

  const onConnect = useCallback(
    (params: Connection) => {
      const edge = addEdge(params, []);

      if (edge.length > 0) {
        addStoreEdge(edge[0]);
      }
    },
    [addStoreEdge],
  );

  const onNodeClick: NodeMouseHandler = useCallback(
    (_, node: Node) => {
      selectNode(node.id);
    },
    [selectNode],
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const nodeTypes = {
    start: StartNode,
    approval: ApprovalNode,
    end: EndNode,
  };

  return (
    <ReactFlowProvider>
      <WorkflowLayout
        sidebar={<Sidebar />}
        rightPanel={selectedNodeId ? <NodeSettings /> : null}
      >
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
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
