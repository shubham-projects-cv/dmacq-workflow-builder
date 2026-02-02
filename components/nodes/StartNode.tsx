"use client";

import { Handle, Position } from "reactflow";
import { FileText } from "lucide-react";

type Props = {
  data: {
    label?: string;
    subLabel?: string;
  };
};

export default function StartNode({ data }: Props) {
  return (
    <div className="flex min-w-[180px] max-w-[180px] h-[52px] rounded-lg border shadow-sm bg-white overflow-hidden">
      {/* Icon */}
      <div className="bg-orange-500 px-3 flex items-center justify-center">
        <FileText className="text-white" size={20} />
      </div>

      {/* Content */}
      <div className="p-2 flex-1">
        <div className="text-[11px] text-gray-500 font-medium">
          {data.subLabel || "Starting Point"}
        </div>

        <div className="text-sm font-semibold text-gray-900 leading-tight">
          {data.label || "Start"}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
