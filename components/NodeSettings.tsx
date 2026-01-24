"use client";

import { X } from "lucide-react";
import { useWorkflowStore } from "@/store/workflowStore";

export default function NodeSettings() {
  const selectedId = useWorkflowStore((s) => s.selectedNodeId);
  const nodes = useWorkflowStore((s) => s.nodes);
  const selectNode = useWorkflowStore((s) => s.selectNode);

  if (!selectedId) return null;

  const node = nodes.find((n) => n.id === selectedId);

  if (!node) return null;

  return (
    <div className="w-72 bg-white border-l p-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Node Settings</h3>

        <button onClick={() => selectNode(null)}>
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-2 text-sm">
        <p>
          <b>Type:</b> {node.data?.label}
        </p>

        <p>
          <b>ID:</b> {node.id}
        </p>
      </div>
    </div>
  );
}
