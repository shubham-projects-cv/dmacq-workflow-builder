"use client";

import { Handle, Position, NodeProps } from "reactflow";
import { Square, Trash2, Copy, Settings } from "lucide-react";

import { useWorkflowStore } from "@/store/workflowStore";

export default function EndNode({ id, data, selected }: NodeProps) {
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const duplicateNode = useWorkflowStore((s) => s.duplicateNode);
  const openSettings = useWorkflowStore((s) => s.openSettings);

  return (
    <div className="relative flex items-center min-w-[180px] max-w-[180px] h-[52px] px-3 rounded-md border shadow-sm bg-white">
      {/* ✅ Action Buttons (Only When Selected) */}
      {selected && (
        <div className="absolute -right-11 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50">
          <button
            onClick={() => openSettings(id)}
            className="p-2 bg-blue-500 text-white rounded-full"
          >
            <Settings size={14} />
          </button>

          <button
            onClick={() => duplicateNode(id)}
            className="p-2 bg-blue-500 text-white rounded-full"
          >
            <Copy size={14} />
          </button>

          <button
            onClick={() => deleteNode(id)}
            className="p-2 bg-red-500 text-white rounded-full"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}

      {/* Icon */}
      <Square size={14} className="text-indigo-700 mr-2" fill="currentColor" />

      {/* Label */}
      <span className="text-sm font-semibold truncate">
        {data.label || "End"}
      </span>

      {/* Handle */}
      <Handle type="target" position={Position.Top} />
    </div>
  );
}
