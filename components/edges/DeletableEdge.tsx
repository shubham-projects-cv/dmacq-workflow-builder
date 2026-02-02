"use client";

import { EdgeProps, getBezierPath } from "reactflow";
import { Trash2 } from "lucide-react";

import { useWorkflowStore } from "@/store/workflowStore";

export default function DeletableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  selected,
}: EdgeProps) {
  const deleteEdge = useWorkflowStore((s) => s.deleteEdge);

  const [path, cx, cy] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        d={path}
        stroke={selected ? "#ef4444" : "#6366f1"}
        strokeWidth={2}
        fill="none"
      />

      {/* ✅ Only when selected */}
      {selected && (
        <foreignObject x={cx + 10} y={cy - 15} width={30} height={30}>
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
