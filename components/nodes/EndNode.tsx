"use client";

import { Handle, Position } from "reactflow";
import { Square } from "lucide-react";

type Props = {
  data: {
    label?: string;
  };
};

export default function EndNode({ data }: Props) {
  return (
    <div className="min-w-[180px] max-w-[180px] h-[52px] flex items-center gap-2 px-3 py-1.5 rounded-md border shadow-sm bg-white">
      <Square size={14} className="text-indigo-700" fill="currentColor" />

      <span className="text-sm font-semibold text-gray-900">
        {data.label || "End"}
      </span>

      <Handle type="target" position={Position.Top} />
    </div>
  );
}
