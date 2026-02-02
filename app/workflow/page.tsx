"use client";

import React, { useCallback } from "react";

import ReactFlow, {
  Controls,
  Background,
  addEdge,
  Connection,
  ReactFlowProvider,
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

  const selectNode = useWorkflowStore((s) => s.selectNode);

  const closeSettings = useWorkflowStore((s) => s.closeSettings);

  const settingsId = useWorkflowStore((s) => s.settingsNodeId);

  const onConnect = useCallback(
    (params: Connection) => {
      const e = addEdge(params, []);

      if (e.length) addStoreEdge(e[0]);
    },
    [addStoreEdge],
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
        <ReactFlow
          nodes={nodes}
          edges={mappedEdges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, n) => selectNode(n.id)}
          onPaneClick={() => {
            selectNode(null);
            closeSettings();
          }}
          fitView
        >
          <Controls />
          <Background />
        </ReactFlow>
      </WorkflowLayout>
    </ReactFlowProvider>
  );
}
