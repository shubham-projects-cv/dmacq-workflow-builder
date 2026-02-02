"use client";

import { Handle, Position, NodeProps } from "reactflow";
import { Mail, Trash2, Copy, Settings, User } from "lucide-react";

import { useWorkflowStore } from "@/store/workflowStore";

export default function EmailNode({ id, data, selected }: NodeProps) {
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const duplicateNode = useWorkflowStore((s) => s.duplicateNode);
  const openSettings = useWorkflowStore((s) => s.openSettings);

  return (
    <div className="relative flex min-w-[220px] max-w-[220px] h-[70px] rounded-lg border shadow-sm bg-white">
      {/* ================= ACTIONS ================= */}

      {selected && (
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50">
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

      {/* ================= ICON ================= */}

      <div className="bg-indigo-700 px-3 flex items-center justify-center">
        <Mail className="text-white" size={18} />
      </div>

      {/* ================= CONTENT ================= */}

      <div className="p-2 flex-1 text-[11px] overflow-hidden">
        <div className="font-semibold truncate leading-tight">
          {data.label || "Email"}
        </div>

        <div className="mt-1 flex items-center gap-1 overflow-hidden">
          <User size={12} className="shrink-0 text-gray-500" />

          <span className="truncate max-w-[150px] text-[11px] text-gray-600">
            {data.email || "No receiver email"}
          </span>
        </div>
      </div>

      {/* ================= HANDLES ================= */}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
