"use client";

import { Handle, Position } from "reactflow";
import { CheckCircle } from "lucide-react";

type Props = {
  data: {
    label?: string;
    approver?: string;
  };
};

export default function ApprovalNode({ data }: Props) {
  return (
    <div className="min-w-[180px] max-w-[180px] h-[52px] flex w-60 rounded-lg border shadow-sm bg-white overflow-hidden">
      {/* Icon */}
      <div className="bg-emerald-600 px-3 flex items-center justify-center">
        <CheckCircle className="text-white" size={20} />
      </div>

      {/* Content */}
      <div className="p-2 flex-1">
        <div className="text-sm font-semibold text-gray-900">
          {data.label || "Approval"}
        </div>

        {data.approver && (
          <div className="text-[11px] text-gray-500 mt-0.5">
            👤 {data.approver}
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
