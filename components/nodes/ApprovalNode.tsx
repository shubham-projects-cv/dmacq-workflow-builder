"use client";

import { Handle, Position, NodeProps } from "reactflow";
import {
  CheckCircle,
  Trash2,
  Copy,
  Settings,
  Plus,
  Pencil,
  Mail,
} from "lucide-react";

import { useWorkflowStore } from "@/store/workflowStore";

/* ================= Types ================= */

type WorkflowStatus = {
  started: boolean;
  waiting: boolean;
  decision: "approve" | "deny" | null;
  completed: boolean;

  currentApproverId: string | null;
  completedApproverIds: string[];
};

type NodeData = {
  label?: string;
  email?: string;
  workflowStatus?: WorkflowStatus;
};

export default function ApprovalNode({
  id,
  data,
  selected,
}: NodeProps<NodeData>) {
  const deleteNode = useWorkflowStore((s) => s.deleteNode);
  const duplicateNode = useWorkflowStore((s) => s.duplicateNode);
  const openSettings = useWorkflowStore((s) => s.openSettings);

  const status = data?.workflowStatus;

  /* ================= Status ================= */

  const isActive = status?.waiting === true && status?.currentApproverId === id;

  const isChecked = status?.completedApproverIds?.includes(id) === true;

  return (
    <div
      className={`
        relative flex min-w-[210px] max-w-[210px] h-[70px]
        rounded-lg border shadow-sm bg-white
        ${isActive ? "ring-2 ring-indigo-500 animate-pulse" : ""}
      `}
    >
      {/* ================= CHECK ================= */}

      {isChecked && (
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-green-500 rounded-full p-0.5">
          <CheckCircle size={14} className="text-white" />
        </div>
      )}

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

      <div className="bg-emerald-600 px-3 flex items-center justify-center">
        <CheckCircle className="text-white" size={18} />
      </div>

      {/* ================= CONTENT ================= */}

      <div className="p-2 flex-1 text-[11px] overflow-hidden">
        <div className="font-semibold truncate leading-tight">
          {data?.label || "Approval"}
        </div>

        <div className="mt-1 flex items-center gap-1 overflow-hidden">
          {!data?.email ? (
            <>
              <span className="text-gray-500 truncate text-[10px]">
                No approval email
              </span>

              <button
                onClick={() => openSettings(id)}
                className="text-blue-600 hover:text-blue-800 ml-auto"
              >
                <Plus size={12} />
              </button>
            </>
          ) : (
            <>
              <Mail size={12} className="shrink-0 text-gray-500" />

              <span className="truncate max-w-[130px] text-[11px] text-gray-600">
                {data.email}
              </span>

              <button
                onClick={() => openSettings(id)}
                className="text-blue-600 hover:text-blue-800 ml-auto shrink-0"
              >
                <Pencil size={12} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ================= HANDLES ================= */}

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
