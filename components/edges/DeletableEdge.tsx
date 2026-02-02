"use client";

import { EdgeProps, getBezierPath } from "reactflow";
import { Trash2 } from "lucide-react";
import { useState } from "react";

import { useWorkflowStore } from "@/store/workflowStore";

/* ================= Condition Picker ================= */

function EdgeConditionPicker({
  onSelect,
  onClose,
}: {
  onSelect: (v: "approve" | "deny") => void;
  onClose: () => void;
}) {
  return (
    <div className="bg-white border rounded shadow p-2 flex gap-2">
      <button
        onClick={() => {
          onSelect("approve");
          onClose();
        }}
        className="px-3 py-1 rounded bg-green-500 text-white text-sm"
      >
        Approve
      </button>

      <button
        onClick={() => {
          onSelect("deny");
          onClose();
        }}
        className="px-3 py-1 rounded bg-red-500 text-white text-sm"
      >
        Deny
      </button>
    </div>
  );
}

/* ================= Edge ================= */

export default function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
  data,
}: EdgeProps) {
  const deleteEdge = useWorkflowStore((s) => s.deleteEdge);
  const updateEdgeData = useWorkflowStore((s) => s.updateEdgeData);

  const [editing, setEditing] = useState(false);

  const [path, cx, cy] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const condition = data?.condition;

  const isApprove = condition === "approve";
  const isDeny = condition === "deny";

  /* Position offsets */
  const labelOffsetX = -40;
  const deleteOffsetX = condition ? 55 : 12;

  return (
    <>
      {/* ================= LINE ================= */}

      <path
        d={path}
        stroke={
          isApprove
            ? "#22c55e"
            : isDeny
              ? "#ef4444"
              : selected
                ? "#6366f1"
                : "#94a3b8"
        }
        strokeWidth={2}
        fill="none"
      />

      {/* ================= CONDITION LABEL ================= */}

      {condition && (
        <foreignObject
          x={cx + labelOffsetX}
          y={cy - 16}
          width={80}
          height={40}
          style={{ overflow: "visible" }}
        >
          <div className="flex items-center justify-center">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className={`px-3 py-1 rounded-full text-xs font-medium shadow
                  ${
                    isApprove
                      ? "bg-green-500 text-white"
                      : "bg-red-500 text-white"
                  }
                `}
              >
                {isApprove ? "Approve" : "Deny"}
              </button>
            ) : (
              <EdgeConditionPicker
                onSelect={(v) =>
                  updateEdgeData(id, {
                    condition: v,
                  })
                }
                onClose={() => setEditing(false)}
              />
            )}
          </div>
        </foreignObject>
      )}

      {/* ================= DELETE (MOVED) ================= */}

      {selected && (
        <foreignObject
          x={cx + deleteOffsetX}
          y={cy - 14}
          width={30}
          height={30}
        >
          <button
            onClick={() => deleteEdge(id)}
            className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow"
          >
            <Trash2 size={12} />
          </button>
        </foreignObject>
      )}
    </>
  );
}
