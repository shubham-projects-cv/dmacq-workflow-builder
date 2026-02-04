"use client";

import { Handle, Position, NodeProps } from "reactflow";
import {
  Square,
  Trash2,
  Copy,
  Settings,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { useWorkflowStore } from "@/store/workflowStore";

/* ================= Types ================= */

type WorkflowStatus = {
  started: boolean;
  waiting: boolean;
  decision: "approve" | "deny" | null;
  completed: boolean;
  denied: boolean;
  currentApproverId: string | null;
};

type NodeData = {
  label?: string;
  workflowStatus?: WorkflowStatus;
};

export default function EndNode({ id, data, selected }: NodeProps<NodeData>) {
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const duplicateNode = useWorkflowStore((s) => s.duplicateNode);
  const openSettings = useWorkflowStore((s) => s.openSettings);

  const status = data?.workflowStatus;

  const completed: boolean = status?.completed === true;
  const denied: boolean = status?.denied === true;

  return (
    <div className="relative flex items-center min-w-[180px] max-w-[180px] h-[52px] px-3 rounded-md border shadow-sm bg-white">
      {/* ================= STATUS ICON ================= */}

      {completed && !denied && (
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-green-500 rounded-full p-0.5">
          <CheckCircle size={14} className="text-white" />
        </div>
      )}

      {denied && (
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-red-500 rounded-full p-0.5">
          <XCircle size={14} className="text-white" />
        </div>
      )}

      {/* ================= ACTION BUTTONS ================= */}

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

      {/* ================= ICON ================= */}

      <Square size={14} className="text-indigo-700 mr-2" fill="currentColor" />

      {/* ================= LABEL ================= */}

      <span className="text-sm font-semibold truncate">
        {data?.label || "End"}
      </span>

      {/* ================= HANDLE ================= */}

      <Handle type="target" position={Position.Top} />
    </div>
  );
}
