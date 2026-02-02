"use client";

import { Handle, Position } from "reactflow";
import { FileText, Trash2, Copy, Settings } from "lucide-react";

import { useWorkflowStore } from "@/store/workflowStore";

type Props = {
  id: string;
  data: {
    label?: string;
    subLabel?: string;
  };
};

export default function StartNode({ id, data }: Props) {
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const duplicateNode = useWorkflowStore((s) => s.duplicateNode);
  const openSettings = useWorkflowStore((s) => s.openSettings);

  const activeId = useWorkflowStore((s) => s.settingsNodeId);

  const active = activeId === id;

  return (
    <div className="relative flex min-w-[180px] max-w-[180px] h-[52px] rounded-lg border shadow-sm bg-white">
      {/* Actions */}
      {active && (
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
      <div className="bg-orange-500 px-3 flex items-center justify-center">
        <FileText className="text-white" size={18} />
      </div>

      {/* Text */}
      <div className="p-2 flex-1">
        <div className="text-[11px] text-gray-500">{data.subLabel}</div>

        <div className="text-sm font-semibold truncate">{data.label}</div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
