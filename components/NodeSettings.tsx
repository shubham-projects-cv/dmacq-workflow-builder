"use client";

import { X } from "lucide-react";
import { ChangeEvent } from "react";

import { useWorkflowStore } from "@/store/workflowStore";

export default function NodeSettings() {
  const nodeId = useWorkflowStore((s) => s.settingsNodeId);
  const nodes = useWorkflowStore((s) => s.workflow.nodes);

  const close = useWorkflowStore((s) => s.closeSettings);
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData);

  if (!nodeId) return null;

  const node = nodes.find((n) => n.id === nodeId);

  if (!node) return null;

  const handleChange =
    (field: string) => (e: ChangeEvent<HTMLInputElement>) => {
      updateNodeData(node.id, {
        [field]: e.target.value,
      });
    };

  return (
    <div className="w-72 bg-white border-l p-4 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Node Settings</h3>

        <button onClick={close}>
          <X size={18} />
        </button>
      </div>

      {/* Form */}
      <div className="space-y-4 text-sm">
        <div>
          <label className="block mb-1 font-medium">Label</label>

          <input
            value={node.data?.label || ""}
            onChange={handleChange("label")}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>

          <input
            value={node.data?.email || ""}
            onChange={handleChange("email")}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Approver</label>

          <input
            value={node.data?.approver || ""}
            onChange={handleChange("approver")}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>
    </div>
  );
}
